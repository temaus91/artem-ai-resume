import { NextResponse } from 'next/server';
import { z } from 'zod';
import OpenAI from 'openai';
import { buildJDPrompt } from '@/lib/ai/build-jd-prompt';

const schema = z.object({ jobDescription: z.string().min(40).max(12000) });

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
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: 'Invalid job description' }, { status: 400 });

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
    input: [{ role: 'user', content: buildJDPrompt(parsed.data.jobDescription) }],
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
