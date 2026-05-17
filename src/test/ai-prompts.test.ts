import { describe, it, expect } from 'vitest';
import { buildSystemPrompt } from '@/lib/ai/build-system-prompt';
import { buildJDPrompt } from '@/lib/ai/build-jd-prompt';
import { isClearlyOffTopic, normalizeAssistantAnswer, OFF_TOPIC_RESPONSE } from '@/lib/ai/chat-guardrails';
import { inferEvidenceLabels, withEvidenceLine } from '@/lib/ai/evidence-labels';
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

  it('asks for a short evidence-used line on substantive answers', () => {
    const prompt = buildSystemPrompt({ profile: { id: '1', name: 'Artem', title: 'SWE' } });
    expect(prompt).toContain('Evidence used: Oracle, Projects');
    expect(prompt).toContain('Do not add this line to off-topic refusals');
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

  it('includes failure examples and blocks invented failure stories', () => {
    const prompt = buildSystemPrompt({
      profile: { id: '1', name: 'Artem', title: 'SWE' },
      failures: artemProfile.failures,
    });

    expect(prompt).toContain('Failure examples:');
    expect(prompt).toContain('Permission Scope Was Too Broad');
    expect(prompt).toContain('Built the Spec, Then Found a Simpler Solution');
    expect(prompt).toContain('Do not invent new failure stories');
  });

  it('defines off-topic scope control for resume chat', () => {
    const prompt = buildSystemPrompt({ profile: { id: '1', name: 'Artem', title: 'SWE' } });
    expect(prompt).toContain('Only answer questions about my professional background');
    expect(prompt).toContain('Do not answer unrelated questions using general world knowledge');
    expect(isClearlyOffTopic('I want to go on vacation to Turkey. Make me a good plan')).toBe(true);
    expect(isClearlyOffTopic('Tell me about Artem project failures')).toBe(false);
    expect(OFF_TOPIC_RESPONSE).toContain("Artem's resume");
  });

  it('normalizes markdown artifacts from assistant output', () => {
    expect(normalizeAssistantAnswer('### 1. **Duration**\\n\\nUse **plain text**.')).toBe('1. Duration\\n\\nUse plain text.');
  });

  it('adds deterministic evidence labels when the question maps to resume evidence', () => {
    expect(inferEvidenceLabels('Tell me about a real failure')).toEqual(['Failures']);
    expect(inferEvidenceLabels('Explain the AI resume project')).toEqual(['Projects']);
    expect(withEvidenceLine('I learned to narrow scope.', 'Tell me about a real failure')).toContain(
      'Evidence used: Failures',
    );
    expect(withEvidenceLine(OFF_TOPIC_RESPONSE, 'I want to go to Turkey')).not.toContain('Evidence used:');
  });
});
