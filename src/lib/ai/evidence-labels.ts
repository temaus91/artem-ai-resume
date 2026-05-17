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
    terms: [
      'project',
      'portfolio',
      'resume',
      'chatbot',
      'codex',
      'anthropic',
      'ai app',
      'marketplace',
      'supabase',
      'postgres',
      'postgresql',
      'stripe',
      'checkout',
      'payments',
      'webhooks',
      'vercel',
      'deployment',
      'deployments',
      'ci/cd',
      'playwright',
      'qr',
      'reservation',
      'reservations',
      'paragliding',
      'soaring',
      'ios',
      'watchos',
      'apple watch',
      'swift',
      'swiftui',
      'healthkit',
      'watchconnectivity',
      'native apple',
    ],
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
    label: 'Education',
    terms: ['education', 'degree', 'university', 'uw', 'computer science', 'bachelor', 'bs'],
  },
  {
    label: 'Work authorization',
    terms: ['citizen', 'citizenship', 'authorized', 'authorization', 'work legally', 'legally work', 'visa'],
  },
  {
    label: 'FAQ',
    terms: [
      'contact',
      'location',
      'remote',
      'status',
      'why left',
      'values',
      'interview',
    ],
  },
] as const;

const refusalTerms = [
  "I'm here to answer questions about Artem's resume",
  "I can't help with unrelated requests",
  'I can only answer questions about',
  'I can talk about Artem',
  'unrelated requests',
] as const;

function escapeRegExp(term: string) {
  return term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function matchesEvidenceTerm(question: string, term: string) {
  const escapedTerm = escapeRegExp(term).replace(/\s+/g, '\\s+');
  return new RegExp(`(^|[^a-z0-9])${escapedTerm}(?=$|[^a-z0-9])`, 'i').test(question);
}

export function inferEvidenceLabels(question: string) {
  return evidenceRules
    .filter((rule) => rule.terms.some((term) => matchesEvidenceTerm(question, term)))
    .map((rule) => rule.label);
}

function isRefusalAnswer(answer: string) {
  const normalized = answer.toLowerCase();
  return refusalTerms.some((term) => normalized.includes(term.toLowerCase()));
}

export function withEvidenceLine(answer: string, question: string | undefined) {
  const trimmed = answer.trim();
  if (!question || /^Evidence used:/im.test(trimmed) || isRefusalAnswer(trimmed)) return trimmed;

  const labels = inferEvidenceLabels(question);
  if (labels.length === 0) return trimmed;

  return `${trimmed}\n\nEvidence used: ${labels.join(', ')}`;
}
