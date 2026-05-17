const evidenceRules = [
  {
    label: 'Oracle',
    terms: ['oracle', 'current role', 'current job', 'healthcare', 'jet', 'test automation'],
  },
  {
    label: 'Amazon',
    terms: ['amazon', 'aws', 'kindle', 'seller', 'fraud', 'hr', 'high-scale'],
  },
  {
    label: 'Projects',
    terms: ['project', 'portfolio', 'resume', 'chatbot', 'codex', 'anthropic', 'ai app'],
  },
  {
    label: 'Failures',
    terms: ['failure', 'failed', 'mistake', 'setback', 'went wrong', 'challenge'],
  },
  {
    label: 'Skills',
    terms: ['strongest', 'strength', 'skill', 'stack', 'technology', 'technical'],
  },
  {
    label: 'Known gaps',
    terms: ['gap', 'not a fit', 'weakness', 'missing', 'lack', 'not your person'],
  },
  {
    label: 'FAQ',
    terms: ['contact', 'location', 'remote', 'status', 'why left', 'values', 'interview'],
  },
] as const;

export function inferEvidenceLabels(question: string) {
  const normalized = question.toLowerCase();
  return evidenceRules
    .filter((rule) => rule.terms.some((term) => normalized.includes(term)))
    .map((rule) => rule.label);
}

export function withEvidenceLine(answer: string, question: string | undefined) {
  const trimmed = answer.trim();
  if (!question || /^Evidence used:/im.test(trimmed)) return trimmed;

  const labels = inferEvidenceLabels(question);
  if (labels.length === 0) return trimmed;

  return `${trimmed}\n\nEvidence used: ${labels.join(', ')}`;
}
