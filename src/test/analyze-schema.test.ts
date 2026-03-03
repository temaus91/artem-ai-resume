import { describe, expect, it } from 'vitest';
import { z } from 'zod';

const resultSchema = z.object({
  verdict: z.enum(['strong_fit', 'worth_conversation', 'probably_not']),
  headline: z.string(),
  opening: z.string(),
  gaps: z.array(z.object({ requirement: z.string(), gap_title: z.string(), explanation: z.string() })),
  transfers: z.string(),
  recommendation: z.string(),
});

describe('jd schema', () => {
  it('accepts valid payload', () => {
    expect(
      resultSchema.safeParse({
        verdict: 'worth_conversation',
        headline: 'Solid fit',
        opening: 'I can help here.',
        gaps: [],
        transfers: 'APIs and platform delivery',
        recommendation: 'Worth a conversation',
      }).success,
    ).toBe(true);
  });

  it('rejects malformed payload', () => {
    expect(resultSchema.safeParse({ verdict: 'unknown' }).success).toBe(false);
  });
});
