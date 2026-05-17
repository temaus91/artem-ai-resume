import { describe, it, expect } from 'vitest';
import { buildSystemPrompt } from '@/lib/ai/build-system-prompt';
import { buildJDPrompt } from '@/lib/ai/build-jd-prompt';
import { artemProfile } from '@/data/artem-profile';

describe('prompt builders', () => {
  it('includes anti-sycophancy constraints', () => {
    const prompt = buildSystemPrompt({ profile: { id: '1', name: 'Artem', title: 'SWE' } });
    expect(prompt).toContain('Never oversell');
    expect(prompt).toContain("I'm probably not your person for this role");
  });

  it('preserves unknowns instead of converting absence into negative claims', () => {
    const prompt = buildSystemPrompt({ profile: { id: '1', name: 'Artem', title: 'SWE' } });
    expect(prompt).toContain('missing evidence');
    expect(prompt).toContain('not enough evidence in the profile');
  });

  it('creates JD prompt with strict json instruction', () => {
    const prompt = buildJDPrompt('Example JD text long enough to pass validation.');
    expect(prompt).toContain('strict JSON');
    expect(prompt).toContain('verdict');
    expect(prompt).toContain('No direct evidence of X');
  });

  it('includes the independent AI resume project as evidence', () => {
    expect(artemProfile.aiExperienceSummary).toContain('Codex');
    expect(artemProfile.aiExperienceSummary).toContain('Anthropic Claude');
    expect(artemProfile.experience[0].company).toBe('Oracle');
    expect(artemProfile.projects[0].name).toBe('AI Resume / Candidate Portfolio');
    expect(artemProfile.projects[0].highlights.join(' ')).toContain('OpenAI-backed resume chatbot');
  });

  it('keeps projects separate from employment evidence in the system prompt', () => {
    const prompt = buildSystemPrompt({
      profile: { id: '1', name: 'Artem', title: 'SWE' },
      experiences: [
        {
          id: 'exp-1',
          company_name: 'Oracle',
          title: 'Senior Software Engineer',
          bullet_points: ['Built production systems'],
        },
      ],
      projects: [
        {
          id: 'project-1',
          name: 'AI Resume / Candidate Portfolio',
          bullet_points: ['Built an OpenAI-backed chatbot'],
        },
      ],
    });

    expect(prompt).toContain('Experiences:');
    expect(prompt).toContain('Projects:');
    expect(prompt).toContain('AI Resume / Candidate Portfolio');
  });
});
