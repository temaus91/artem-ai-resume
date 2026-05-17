export const OFF_TOPIC_RESPONSE =
  "I'm here to answer questions about Artem's resume, work experience, projects, strengths, gaps, values, or role fit. I can't help with unrelated requests like travel planning, but I can talk about Artem's background or whether he fits a specific role.";

const resumeTopicTerms = [
  'artem',
  'resume',
  'background',
  'experience',
  'work',
  'job',
  'role',
  'fit',
  'strength',
  'weakness',
  'gap',
  'amazon',
  'oracle',
  'project',
  'failed',
  'failure',
  'manager',
  'interview',
  'skill',
  'aws',
  'ai',
  'codex',
  'claude',
  'github',
  'career',
  'candidate',
  'hire',
  'leadership',
  'clinical',
  'portfolio',
  'linkedin',
  'email',
  'education',
  'degree',
  'university',
  'college',
  'citizen',
  'citizenship',
  'authorized',
  'authorization',
  'visa',
  'work legally',
];

const offTopicTerms = [
  'vacation',
  'trip',
  'itinerary',
  'travel',
  'hotel',
  'flight',
  'restaurant',
  'recipe',
  'cook',
  'weather',
  'sports',
  'movie',
  'song',
  'stock',
  'investment',
  'medical',
  'legal',
  'homework',
  'math problem',
];

export function isClearlyOffTopic(message: string) {
  const text = message.toLowerCase();
  const hasResumeTopic = resumeTopicTerms.some((term) => text.includes(term));
  const hasOffTopicTerm = offTopicTerms.some((term) => text.includes(term));
  return hasOffTopicTerm && !hasResumeTopic;
}

export function normalizeAssistantAnswer(answer: string) {
  return answer
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/__(.*?)__/g, '$1')
    .replace(/\s*Evidence used:\s*[A-Za-z ,.-]+\.?\s*$/i, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}
