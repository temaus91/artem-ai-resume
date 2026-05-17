export type RateLimitConfig = {
  route: string;
  limit: number;
  windowMs: number;
  now?: number;
  store?: RateLimitStore;
};

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

export type RateLimitStore = Map<string, RateLimitEntry>;

export type RateLimitResult = {
  allowed: boolean;
  limit: number;
  remaining: number;
  retryAfter: number;
  resetAt: number;
};

const globalForRateLimit = globalThis as typeof globalThis & {
  __artemResumeRateLimitStore?: RateLimitStore;
};

function getDefaultStore() {
  if (!globalForRateLimit.__artemResumeRateLimitStore) {
    globalForRateLimit.__artemResumeRateLimitStore = new Map();
  }
  return globalForRateLimit.__artemResumeRateLimitStore;
}

export function createRateLimitStore(): RateLimitStore {
  return new Map();
}

export function getClientIp(request: Request) {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) return forwardedFor.split(',')[0]?.trim() || 'unknown';

  return (
    request.headers.get('x-real-ip') ||
    request.headers.get('cf-connecting-ip') ||
    'unknown'
  );
}

export function checkRateLimit(key: string, config: Omit<RateLimitConfig, 'route'>): RateLimitResult {
  const now = config.now ?? Date.now();
  const store = config.store ?? getDefaultStore();
  const existing = store.get(key);

  if (!existing || existing.resetAt <= now) {
    const resetAt = now + config.windowMs;
    store.set(key, { count: 1, resetAt });
    return {
      allowed: true,
      limit: config.limit,
      remaining: Math.max(config.limit - 1, 0),
      retryAfter: 0,
      resetAt,
    };
  }

  if (existing.count >= config.limit) {
    return {
      allowed: false,
      limit: config.limit,
      remaining: 0,
      retryAfter: Math.max(Math.ceil((existing.resetAt - now) / 1000), 1),
      resetAt: existing.resetAt,
    };
  }

  existing.count += 1;
  store.set(key, existing);
  return {
    allowed: true,
    limit: config.limit,
    remaining: Math.max(config.limit - existing.count, 0),
    retryAfter: 0,
    resetAt: existing.resetAt,
  };
}

export function rateLimitRequest(request: Request, config: RateLimitConfig): RateLimitResult {
  const ip = getClientIp(request);
  return checkRateLimit(`${config.route}:${ip}`, config);
}

export function rateLimitHeaders(result: RateLimitResult) {
  return {
    'Retry-After': String(result.retryAfter),
    'X-RateLimit-Limit': String(result.limit),
    'X-RateLimit-Remaining': String(result.remaining),
    'X-RateLimit-Reset': String(Math.ceil(result.resetAt / 1000)),
  };
}
