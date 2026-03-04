export function buildJDPrompt(jobDescription: string, candidateContext?: string) {
  return `Analyze this job description with balanced, evidence-based honesty. Return strict JSON with fields: verdict, headline, opening, gaps[], transfers, recommendation.

Rules:
- verdict in [strong_fit, worth_conversation, probably_not]
- Identify explicit gaps under gaps[] with requirement, gap_title, explanation
- recommendation can directly advise against hiring
- write opening/recommendation in first person
- never claim "insufficient years" or "not high-scale" if the candidate context clearly satisfies those bars
- if you identify a gap, tie it to a concrete missing requirement
- tone should be approachable and professional, not cold or pessimistic
- avoid hype language; be specific and grounded in evidence

Candidate Context:\n${candidateContext || 'Not provided. Be conservative and avoid assumptions.'}

Job Description:\n${jobDescription}`;
}
