export function buildJDPrompt(jobDescription: string) {
  return `Analyze this job description with ruthless honesty. Return strict JSON with fields: verdict, headline, opening, gaps[], transfers, recommendation.

Rules:
- verdict in [strong_fit, worth_conversation, probably_not]
- Identify explicit gaps under gaps[] with requirement, gap_title, explanation
- recommendation can directly advise against hiring
- write opening/recommendation in first person

Job Description:\n${jobDescription}`;
}
