import { NextResponse } from 'next/server';
import { z } from 'zod';
import OpenAI from 'openai';
import { buildJDPrompt } from '@/lib/ai/build-jd-prompt';
import { artemProfile } from '@/data/artem-profile';
import { rateLimitHeaders, rateLimitRequest } from '@/lib/rate-limit';

const schema = z.object({ jobDescription: z.string().min(40).max(12000) });
const JD_RATE_LIMIT = 10;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;

const resultSchema = z.object({
  verdict: z.enum(['strong_fit', 'worth_conversation', 'probably_not']),
  headline: z.string(),
  opening: z.string(),
  gaps: z.array(z.object({ requirement: z.string(), gap_title: z.string(), explanation: z.string() })),
  transfers: z.string(),
  recommendation: z.string(),
});

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const limit = rateLimitRequest(req, {
    route: 'analyze-jd',
    limit: JD_RATE_LIMIT,
    windowMs: RATE_LIMIT_WINDOW_MS,
  });
  if (!limit.allowed) {
    return NextResponse.json(
      { error: 'Too many fit checks. Please wait a few minutes and try again.' },
      { status: 429, headers: rateLimitHeaders(limit) },
    );
  }

  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: 'Invalid job description' }, { status: 400 });

  const candidateContext = [
    `Name: ${artemProfile.name}`,
    `Title: ${artemProfile.title}`,
    `Experience: ${artemProfile.yearsExperience || '12+ years total'}`,
    `Companies: ${artemProfile.companies.join(', ')}`,
    'High-scale background: Amazon (10 years) + Oracle (current)',
    `AWS services used hands-on: ${(artemProfile.awsServices || []).join(', ')}`,
    `Cloud security/networking: ${(artemProfile.cloudSecurityAndNetworking || []).join(', ')}`,
    `Personal AI project evidence: ${artemProfile.aiExperienceSummary}`,
    'Personal project: built this AI resume as a Next.js/OpenAI app with resume chatbot, structured job-description fit analyzer, prompt guardrails, optional Supabase chat history, tests, and public GitHub cleanup.',
    'Private independent product build: built a substantial marketplace/operations platform with Next.js, React, TypeScript, Supabase/PostgreSQL, auth, RLS-aware server flows, image storage, Stripe Connect, Checkout Sessions, webhook idempotency, sale ledger snapshots, Vercel deployment lanes, Playwright, Vitest, and CI/CD-style verification. Do not name the private product or domain.',
    'AI-assisted development tools used heavily since 2025: Codex and Anthropic Claude.',
    `Work style: ${artemProfile.status}`,
    'Known constraints: not currently a people manager; limited server hardware engineering; limited device-only focus',
  ].join('\n');

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({
      verdict: 'worth_conversation',
      headline: 'Preliminary fit (mock mode)',
      opening: 'I can help across full-stack and platform work, but this is a local fallback response.',
      gaps: [],
      transfers: 'Backend APIs, platform delivery, and cross-team execution transfer well.',
      recommendation: 'Configure OPENAI_API_KEY for real structured analysis.',
    });
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const response = await openai.responses.create({
    model: process.env.OPENAI_MODEL_ANALYZE || 'gpt-4.1-mini',
    store: false,
    input: [{ role: 'user', content: buildJDPrompt(parsed.data.jobDescription, candidateContext) }],
    text: {
      format: {
        type: 'json_schema',
        name: 'jd_analysis',
        schema: {
          type: 'object',
          properties: {
            verdict: { enum: ['strong_fit', 'worth_conversation', 'probably_not'] },
            headline: { type: 'string' },
            opening: { type: 'string' },
            gaps: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  requirement: { type: 'string' },
                  gap_title: { type: 'string' },
                  explanation: { type: 'string' },
                },
                required: ['requirement', 'gap_title', 'explanation'],
                additionalProperties: false,
              },
            },
            transfers: { type: 'string' },
            recommendation: { type: 'string' },
          },
          required: ['verdict', 'headline', 'opening', 'gaps', 'transfers', 'recommendation'],
          additionalProperties: false,
        },
        strict: true,
      },
    },
  });

  const content = response.output_text;
  const json = resultSchema.parse(JSON.parse(content));
  return NextResponse.json(json);
}
