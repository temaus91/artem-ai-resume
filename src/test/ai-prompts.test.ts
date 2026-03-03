import { describe, it, expect } from 'vitest';
import { buildSystemPrompt } from '@/lib/ai/build-system-prompt';
import { buildJDPrompt } from '@/lib/ai/build-jd-prompt';

describe('prompt builders', () => {
  it('includes anti-sycophancy constraints', () => {
    const prompt = buildSystemPrompt({ profile: { id: '1', name: 'Artem', title: 'SWE' } });
    expect(prompt).toContain('Never oversell');
    expect(prompt).toContain("I'm probably not your person for this role");
  });

  it('creates JD prompt with strict json instruction', () => {
    const prompt = buildJDPrompt('Example JD text long enough to pass validation.');
    expect(prompt).toContain('strict JSON');
    expect(prompt).toContain('verdict');
  });
});
