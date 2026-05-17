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

  it('includes sanitized private marketplace project evidence', () => {
    const marketplaceProject = artemProfile.projects.find((project) =>
      project.name.includes('Marketplace'),
    );

    expect(marketplaceProject?.period).toBeUndefined();
    expect(marketplaceProject?.sourceUrl).toBeUndefined();
    expect(marketplaceProject?.stack.join(' ')).toContain('Stripe Connect');
    expect(marketplaceProject?.stack.join(' ')).toContain('Supabase');
    expect(marketplaceProject?.aiContext.technicalWork).toContain('webhook idempotency');
    expect(marketplaceProject?.sourceUrl).toBeUndefined();
  });

  it('includes Kindle Scribe launch-readiness evidence without overstating device specialization', () => {
    const amazonExperience = artemProfile.experience.find((experience) => experience.company === 'Amazon');

    expect(amazonExperience?.highlights.join(' ')).toContain('Kindle Scribe');
    expect(amazonExperience?.aiContext.technicalWork).toContain('pre-release Kindle Scribe devices');
    expect(artemProfile.hardNoClaims.join(' ')).toContain('No long-term production ownership of shipped native iOS/watchOS apps yet');
  });

  it('includes AWS and OCI cloud evidence in profile data', () => {
    expect(artemProfile.awsServices).toEqual(
      expect.arrayContaining(['S3', 'DynamoDB', 'SNS', 'SQS', 'Kinesis', 'Redshift']),
    );
    expect(artemProfile.ociExperience.join(' ')).toContain('OCI IAM application configuration');
    expect(artemProfile.experience[0].highlights.join(' ')).toContain('token minting');
    expect(artemProfile.skills.strong.join(' ')).toContain('AWS Services and Cloud Operations');
    expect(artemProfile.skills.moderate.join(' ')).toContain('Oracle Cloud (OCI) IAM and Operations Support');
  });

  it('includes education and work authorization evidence', () => {
    expect(artemProfile.education).toBe('Bachelor of Science in Computer Science, University of Washington');
    expect(artemProfile.workAuthorization).toContain('US citizen');
    expect(artemProfile.faq.map((item) => item.answer).join(' ')).toContain('legally authorized to work');
    expect(artemProfile.faq.map((item) => item.answer).join(' ')).toContain('LinkedIn is the best reference');
  });

  it('includes the in-progress iOS watchOS soaring project without overstating maturity', () => {
    const soaringProject = artemProfile.projects.find((project) => project.name === 'Soaring Session');

    expect(soaringProject?.period).toBeUndefined();
    expect(soaringProject?.sourceUrl).toBeUndefined();
    expect(soaringProject?.stack.join(' ')).toContain('SwiftUI');
    expect(soaringProject?.stack.join(' ')).toContain('HealthKit');
    expect(soaringProject?.stack.join(' ')).toContain('WatchConnectivity');
    expect(soaringProject?.aiContext.technicalWork).toContain('automatic flight-segmentation engine');
    expect(soaringProject?.highlights.join(' ')).toContain('field testing as explicit next validation steps');
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
    expect(isClearlyOffTopic('Can Artem legally work in the US?')).toBe(false);
    expect(isClearlyOffTopic('What is Artem education?')).toBe(false);
    expect(OFF_TOPIC_RESPONSE).toContain("Artem's resume");
  });

  it('normalizes markdown artifacts from assistant output', () => {
    expect(normalizeAssistantAnswer('### 1. **Duration**\\n\\nUse **plain text**.')).toBe('1. Duration\\n\\nUse plain text.');
    expect(normalizeAssistantAnswer('I have a BS in CS. Evidence used: Education.')).toBe('I have a BS in CS.');
  });

  it('adds deterministic evidence labels when the question maps to resume evidence', () => {
    expect(inferEvidenceLabels('Tell me about a real failure')).toEqual(['Failures']);
    expect(inferEvidenceLabels('Explain the AI resume project')).toEqual(['Projects']);
    expect(inferEvidenceLabels('Walk me through a project')).toEqual(['Projects']);
    expect(inferEvidenceLabels('Tell me about HR work at Amazon')).toEqual(['Amazon']);
    expect(inferEvidenceLabels('Does Artem have Stripe or Supabase experience?')).toEqual(['Projects']);
    expect(inferEvidenceLabels('Does Artem have SwiftUI watchOS experience?')).toEqual(['Projects']);
    expect(inferEvidenceLabels('What degree does Artem have?')).toEqual(['Education']);
    expect(inferEvidenceLabels('Can Artem work legally in the US?')).toEqual(['Work authorization']);
    expect(withEvidenceLine('I learned to narrow scope.', 'Tell me about a real failure')).toContain(
      'Evidence used: Failures',
    );
    expect(withEvidenceLine(OFF_TOPIC_RESPONSE, 'I want to go to Turkey')).not.toContain('Evidence used:');
    expect(
      withEvidenceLine(
        "I'm here to answer questions about Artem's resume, not unrelated project planning.",
        'Can you make me a travel project plan?',
      ),
    ).not.toContain('Evidence used:');
  });
});
