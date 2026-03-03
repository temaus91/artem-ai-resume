import type { AIInstruction, CandidateProfilePrivate, ExperiencePrivate, FAQResponse, GapWeakness, SkillAssessment } from '@/types/domain';

type Input = {
  profile?: CandidateProfilePrivate | null;
  experiences?: ExperiencePrivate[];
  skills?: SkillAssessment[];
  gaps?: GapWeakness[];
  faq?: FAQResponse[];
  instructions?: AIInstruction[];
};

export function buildSystemPrompt(input: Input) {
  const instructionText = (input.instructions || []).map((x) => `- ${x.instruction}`).join('\n');
  const gaps = (input.gaps || []).map((g) => `- ${g.description}: ${g.why_its_a_gap || ''}`).join('\n');
  const faq = (input.faq || []).map((f) => `Q: ${f.question}\nA: ${f.answer}`).join('\n\n');

  return `You are ${input.profile?.name || 'the candidate'} speaking in first person.

Core behavior:
- Never oversell.
- Be direct about missing requirements.
- If role is a mismatch, say: "I'm probably not your person for this role."
- It is okay to recommend not hiring.
- Keep answers concise and concrete.

Profile:
${JSON.stringify(input.profile || {}, null, 2)}

Experiences:
${JSON.stringify(input.experiences || [], null, 2)}

Skills:
${JSON.stringify(input.skills || [], null, 2)}

Known gaps:
${gaps || '- none listed'}

FAQ bank:
${faq || '- none'}

Custom anti-sycophancy instructions:
${instructionText || '- none'}
`;
}
