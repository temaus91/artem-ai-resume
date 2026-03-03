create extension if not exists "uuid-ossp";

create table if not exists candidate_profile (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text,
  title text,
  target_titles text[],
  target_company_stages text[],
  elevator_pitch text,
  career_narrative text,
  looking_for text,
  not_looking_for text,
  known_for text,
  management_style text,
  work_style_preferences text,
  salary_min integer,
  salary_max integer,
  availability_status text,
  availability_date date,
  location text,
  remote_preference text,
  github_url text,
  linkedin_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists experiences (
  id uuid primary key default uuid_generate_v4(),
  candidate_id uuid references candidate_profile(id),
  company_name text not null,
  title text not null,
  title_progression text,
  start_date date,
  end_date date,
  is_current boolean default false,
  bullet_points text[],
  why_joined text,
  why_left text,
  actual_contributions text,
  proudest_achievement text,
  would_do_differently text,
  challenges_faced text,
  lessons_learned text,
  manager_would_say text,
  reports_would_say text,
  people_conflicts text,
  quantified_impact jsonb,
  display_order integer,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists skills (
  id uuid primary key default uuid_generate_v4(),
  candidate_id uuid references candidate_profile(id),
  skill_name text not null,
  category text,
  self_rating integer,
  evidence text,
  honest_notes text,
  years_experience decimal,
  last_used date,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists gaps_weaknesses (
  id uuid primary key default uuid_generate_v4(),
  candidate_id uuid references candidate_profile(id),
  gap_type text,
  description text not null,
  why_its_a_gap text,
  interest_in_learning boolean default false,
  past_feedback text,
  active_improvement text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists values_culture_fit (
  id uuid primary key default uuid_generate_v4(),
  candidate_id uuid references candidate_profile(id),
  must_haves text,
  dealbreakers text,
  management_style_preferences text,
  team_size_preferences text,
  conflict_handling text,
  ambiguity_handling text,
  failure_handling text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists faq_responses (
  id uuid primary key default uuid_generate_v4(),
  candidate_id uuid references candidate_profile(id),
  question text not null,
  answer text not null,
  is_common_question boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists ai_instructions (
  id uuid primary key default uuid_generate_v4(),
  candidate_id uuid references candidate_profile(id),
  instruction_type text,
  instruction text not null,
  priority integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists admin_users (
  id uuid primary key default uuid_generate_v4(),
  auth_user_id uuid unique not null,
  candidate_id uuid references candidate_profile(id),
  role text default 'owner',
  created_at timestamptz default now()
);

create table if not exists chat_history (
  id uuid primary key default uuid_generate_v4(),
  session_id text not null,
  role text not null,
  content text not null,
  created_at timestamptz default now()
);

create view public_candidate_profile_v as
select id, name, title, elevator_pitch, location, github_url, linkedin_url
from candidate_profile;

create view public_experiences_v as
select id, candidate_id, company_name, title, title_progression, start_date, end_date, is_current, bullet_points, display_order
from experiences;

create view public_skills_matrix_v as
select id, candidate_id, skill_name, category, evidence, honest_notes
from skills;

create view public_faq_v as
select id, candidate_id, question, answer, is_common_question
from faq_responses;
