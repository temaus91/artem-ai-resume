export type ChatTurn = { role: 'user' | 'assistant'; content: string };

export type CandidateProfilePublic = {
  id: string;
  name: string;
  title: string;
  elevator_pitch?: string;
  location?: string;
  github_url?: string;
  linkedin_url?: string;
};

export type CandidateProfilePrivate = CandidateProfilePublic & {
  target_titles?: string[];
  target_company_stages?: string[];
  career_narrative?: string;
  looking_for?: string;
  not_looking_for?: string;
};

export type ExperiencePublic = {
  id: string;
  company_name: string;
  title: string;
  start_date?: string;
  end_date?: string;
  bullet_points: string[];
};

export type ExperiencePrivate = ExperiencePublic & {
  why_joined?: string;
  why_left?: string;
  actual_contributions?: string;
  lessons_learned?: string;
};

export type SkillAssessment = {
  skill_name: string;
  category: 'strong' | 'moderate' | 'gaps' | string;
  evidence?: string;
  honest_notes?: string;
};

export type GapWeakness = {
  description: string;
  why_its_a_gap?: string;
};

export type FAQResponse = {
  question: string;
  answer: string;
};

export type AIInstruction = {
  instruction_type?: string;
  instruction: string;
  priority?: number;
};

export type JDAnalysisResult = {
  verdict: 'strong_fit' | 'worth_conversation' | 'probably_not';
  headline: string;
  opening: string;
  gaps: { requirement: string; gap_title: string; explanation: string }[];
  transfers: string;
  recommendation: string;
};
