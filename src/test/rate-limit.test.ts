import { describe, expect, it } from 'vitest';
import { checkRateLimit, createRateLimitStore, getClientIp, rateLimitRequest } from '@/lib/rate-limit';
import { extractApiErrorMessage } from '@/lib/client-api-errors';

describe('rate limiter', () => {
  it('blocks after the configured fixed-window limit', () => {
    const store = createRateLimitStore();
    const config = { limit: 2, windowMs: 10000, now: 1000, store };

    expect(checkRateLimit('chat:1.1.1.1', config).allowed).toBe(true);
    expect(checkRateLimit('chat:1.1.1.1', config).allowed).toBe(true);

    const blocked = checkRateLimit('chat:1.1.1.1', config);
    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfter).toBe(10);
  });

  it('starts a new window after reset', () => {
    const store = createRateLimitStore();
    expect(checkRateLimit('chat:1.1.1.1', { limit: 1, windowMs: 1000, now: 0, store }).allowed).toBe(true);
    expect(checkRateLimit('chat:1.1.1.1', { limit: 1, windowMs: 1000, now: 500, store }).allowed).toBe(false);
    expect(checkRateLimit('chat:1.1.1.1', { limit: 1, windowMs: 1000, now: 1000, store }).allowed).toBe(true);
  });

  it('keys requests by route and best-effort client ip', () => {
    const store = createRateLimitStore();
    const request = new Request('https://example.com/api/chat', {
      headers: { 'x-forwarded-for': '203.0.113.10, 10.0.0.1' },
    });

    expect(getClientIp(request)).toBe('203.0.113.10');
    expect(rateLimitRequest(request, { route: 'chat', limit: 1, windowMs: 1000, now: 0, store }).allowed).toBe(true);
    expect(rateLimitRequest(request, { route: 'analyze-jd', limit: 1, windowMs: 1000, now: 0, store }).allowed).toBe(true);
    expect(rateLimitRequest(request, { route: 'chat', limit: 1, windowMs: 1000, now: 0, store }).allowed).toBe(false);
  });

  it('prunes expired entries before inserting a new key', () => {
    const store = createRateLimitStore();

    expect(checkRateLimit('chat:old', { limit: 1, windowMs: 1000, now: 0, store }).allowed).toBe(true);
    expect(checkRateLimit('chat:new', { limit: 1, windowMs: 1000, now: 1000, store }).allowed).toBe(true);
    expect(store.has('chat:old')).toBe(false);
    expect(store.has('chat:new')).toBe(true);
  });

  it('caps the in-memory store when many active keys are inserted', () => {
    const store = createRateLimitStore();

    expect(checkRateLimit('chat:one', { limit: 1, windowMs: 10000, now: 0, store, maxEntries: 2 }).allowed).toBe(true);
    expect(checkRateLimit('chat:two', { limit: 1, windowMs: 10000, now: 0, store, maxEntries: 2 }).allowed).toBe(true);
    expect(checkRateLimit('chat:three', { limit: 1, windowMs: 10000, now: 0, store, maxEntries: 2 }).allowed).toBe(true);

    expect(store.size).toBe(2);
    expect(store.has('chat:one')).toBe(false);
    expect(store.has('chat:two')).toBe(true);
    expect(store.has('chat:three')).toBe(true);
  });
});

describe('client api errors', () => {
  it('extracts clean json rate-limit messages for the JD analyzer', () => {
    expect(extractApiErrorMessage({ error: 'Too many fit checks. Please wait.' }, 'Fallback')).toBe(
      'Too many fit checks. Please wait.',
    );
  });

  it('falls back for malformed error payloads', () => {
    expect(extractApiErrorMessage({ message: 'not used' }, 'Fallback')).toBe('Fallback');
  });
});
