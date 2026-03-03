# Resume AI Portfolio - Lossless Implementation Plan (Vercel)

## Header
- Intent: Preserve all requirements from `ResumeWebsitePrompt.docx` in repository-native docs.
- Snapshot type: Lossless + executable (no external context required).
- Version: 2.0
- Date: 2026-03-03
- Source preservation note: This file intentionally embeds all critical product, UX, schema, API, prompting, and deployment details so implementation can proceed even if the original `.docx` is unavailable.

## Product Thesis (Must Not Change)
1. The AI is the product. This is not a resume site with a chatbot bolted on.
2. Core differentiation is brutally honest fit assessment, including explicit rejection when there is mismatch.
3. Goal is trust and qualification, not universal self-promotion.
4. The site qualifies both parties: employer fit and candidate fit.

## Locked Stack and Product Decisions
1. Runtime/platform:
- Vercel-hosted Next.js App Router application.
- Next Route Handlers replace Lovable/Supabase Edge Functions.
2. Data/auth:
- Supabase PostgreSQL + Supabase Auth + RLS.
- Single-candidate deployment model.
3. AI provider:
- OpenAI GPT as primary provider for v1.
4. Admin auth UX:
- Magic-link login.
5. Chat history policy:
- Persisted by default in v1.
- `chat_history` is a required table and runtime dependency.
- Retention policy: delete `chat_history` rows older than 30 days.
6. Initial content:
- Seed from existing static repository profile data.

## Public Site Specification (What Employers See)

### Design System
1. Theme and color:
- Background: near-black `#0a0a0a`.
- Primary accent for CTA: teal/mint `#4ade80`.
- Secondary warning/gap tone: warm amber `#d4a574`.
2. Typography:
- Serif headings: Playfair Display.
- Sans body: Inter.
3. Surface style:
- Cards with subtle borders.
- Rounded corners.
- Glass-morphism effects where relevant.

### Navigation (Fixed)
1. Left: logo/initials.
2. Links: `Experience` and `Fit Check`.
3. Prominent teal `Ask AI` button opens chat drawer.

### Hero Section
1. Status badge pattern:
- `🟢 Open to [Role Type] at [Company Stage]`.
2. Large serif name heading.
3. Role/title in teal.
4. One-line positioning statement.
5. Company badges row (pill style).
6. Primary CTA:
- `Ask AI About Me` with chat icon and `New` badge.
7. Scroll indicator.

### Experience Section
1. Header:
- Title: `Experience`
- Subhead: `Each role includes queryable AI context—the real story behind the bullet points.`
2. Card structure per role:
- Company + date range.
- Title/title progression.
- Three metric-oriented achievement bullets.
- Toggle button: `✨ Show AI Context`.
3. Expanded AI context panel labels (exact intent):
- `SITUATION`
- `APPROACH`
- `TECHNICAL WORK`
- `LESSONS LEARNED` (honest reflection in italics)

### Skills Matrix
1. Three side-by-side cards:
- `STRONG ✓` (green background)
- `MODERATE ○` (gray background)
- `GAPS ✗` (amber background)
2. Each card lists relevant skills/gaps.

### JD Analyzer (Killer Feature)
1. Header:
- Title: `Honest Fit Assessment`
- Subhead: `Paste a job description. Get an honest assessment of whether I’m the right person—including when I’m not.`
2. Controls:
- Toggle: `Strong Fit Example` / `Weak Fit Example` (prefills demo JDs).
- Large textarea: `Paste job description here…`.
- Action button: `Analyze Fit`.
3. Output panel structure:
- Header style: `⚠️ Honest Assessment — [Probably Not Your Person / Strong Fit / Worth a Conversation]`
- Opening paragraph in first person and direct tone.
- Section: `WHERE I DON'T FIT` with explicit gap titles + explanations.
- Section: `WHAT TRANSFERS` with transferable strengths.
- Section: `MY RECOMMENDATION` including permission for `don't hire me for this role`.
4. Philosophy callout (intent and message):
- `This signals something completely different than ‘please consider my resume.’ You’re qualifying them. Your time is valuable too.`

### AI Chat Drawer
1. Opens from right side when `Ask AI` is clicked.
2. Includes:
- Message history.
- Input field.
- Send button.
3. Seeded suggested questions (exact):
- `What’s your biggest weakness?`
- `Tell me about a project that failed`
- `Why did you leave [Company]?`
- `What would your last manager say about you?`

### Footer
1. Name + title.
2. Social links: GitHub, LinkedIn, Email.
3. Tagline about AI-queryable portfolios.

## Candidate Admin Panel Specification (Where the Magic Happens)

### Auth and Scope
1. Simple auth (magic link or password); v1 locked to magic link.
2. Single candidate per deployment.

### Context Input Sections (All Must Exist)

#### 1) Basic Profile
- Full name
- Current title
- Target titles
- Target company stages (seed, Series A-D, public, etc.)
- Location / remote preferences
- Availability status + availability date
- Salary expectations (range)
- Social links

#### 2) Professional Narrative
- Elevator pitch (2-3 sentences)
- Detailed career narrative
- What candidate is known for
- What candidate is looking for in next role
- What candidate is not looking for (dealbreakers)
- Management style (if applicable)
- Work style preferences

#### 3) Experience Deep Dive (Per Role)
Basic:
- Company name
- Title(s) held
- Dates
- Public bullet points

Private AI context:
- Why joined
- Why left
- Actual individual contribution vs team
- Proudest achievement
- What they would do differently
- What was hard/frustrating
- Lessons learned
- Manager description
- Reports description (if applicable)
- People conflicts/challenges
- Quantified impact

#### 4) Skills Self-Assessment
For each skill:
- Skill name
- Self-rating: Strong / Moderate / Weak / No Experience
- Evidence (projects, years, certifications)
- Honest notes

#### 5) Gaps & Weaknesses (Critical)
- Known skill gaps
- Role types that are bad fits
- Work environments that are difficult fits
- Past feedback
- Active improvement areas
- Things with zero interest in learning

#### 6) Values & Culture Fit
- Must-haves
- Dealbreakers
- Management style preferences
- Team size preferences
- Conflict handling
- Ambiguity handling
- Failure handling

#### 7) FAQ / Common Questions
Pre-authored responses to:
- Tell me about yourself
- What's your biggest weakness?
- Why are you leaving your current role?
- Where do you see yourself in 5 years?
- Tell me about a time you failed
- Custom Q&A pairs

#### 8) Anti-Sycophancy Instructions
Examples that must be supported as editable instructions:
- Never oversell me.
- If JD asks for X and I don't have it, say so directly.
- Use phrases like "I'm probably not your person" when appropriate.
- Don't hedge; be direct.
- It's okay to recommend they not hire me.

## Architecture: Lovable Reference vs Vercel Production

### Lovable Reference Pattern (for traceability)
1. Frontend app.
2. Supabase Postgres tables.
3. Supabase Edge Functions (`/chat`, `/analyze-jd`).
4. LLM API.

### Vercel Production Mapping (authoritative for implementation)
1. Next.js App Router frontend and server.
2. Supabase Postgres + Auth + RLS stays.
3. Edge Function logic moves to Next Route Handlers:
- `POST /api/chat`
- `POST /api/analyze-jd`
4. Service-role access is server-only in route handlers and server actions.
5. Public site reads only public-safe views or equivalent sanitized query model.

## Canonical Database Schema (Preserved + Vercel Extensions)

### A) Preserved Base Tables from original spec
```sql
CREATE TABLE candidate_profile (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT,
  title TEXT,
  target_titles TEXT[],
  target_company_stages TEXT[],
  elevator_pitch TEXT,
  career_narrative TEXT,
  looking_for TEXT,
  not_looking_for TEXT,
  salary_min INTEGER,
  salary_max INTEGER,
  availability_status TEXT,
  availability_date DATE,
  location TEXT,
  remote_preference TEXT,
  github_url TEXT,
  linkedin_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE experiences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  candidate_id UUID REFERENCES candidate_profile(id),
  company_name TEXT NOT NULL,
  title TEXT NOT NULL,
  title_progression TEXT,
  start_date DATE,
  end_date DATE,
  is_current BOOLEAN DEFAULT FALSE,
  bullet_points TEXT[],
  why_joined TEXT,
  why_left TEXT,
  actual_contributions TEXT,
  proudest_achievement TEXT,
  would_do_differently TEXT,
  challenges_faced TEXT,
  lessons_learned TEXT,
  manager_would_say TEXT,
  reports_would_say TEXT,
  quantified_impact JSONB,
  display_order INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  candidate_id UUID REFERENCES candidate_profile(id),
  skill_name TEXT NOT NULL,
  category TEXT,
  self_rating INTEGER,
  evidence TEXT,
  honest_notes TEXT,
  years_experience DECIMAL,
  last_used DATE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE gaps_weaknesses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  candidate_id UUID REFERENCES candidate_profile(id),
  gap_type TEXT,
  description TEXT NOT NULL,
  why_its_a_gap TEXT,
  interest_in_learning BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE faq_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  candidate_id UUID REFERENCES candidate_profile(id),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  is_common_question BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE ai_instructions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  candidate_id UUID REFERENCES candidate_profile(id),
  instruction_type TEXT,
  instruction TEXT NOT NULL,
  priority INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE chat_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id TEXT NOT NULL,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### B) Required Vercel-Plan Extensions (additions)
```sql
CREATE TABLE values_culture_fit (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  candidate_id UUID REFERENCES candidate_profile(id),
  must_haves TEXT,
  dealbreakers TEXT,
  management_style_preferences TEXT,
  team_size_preferences TEXT,
  conflict_handling TEXT,
  ambiguity_handling TEXT,
  failure_handling TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_user_id UUID UNIQUE NOT NULL,
  candidate_id UUID REFERENCES candidate_profile(id),
  role TEXT DEFAULT 'owner',
  created_at TIMESTAMP DEFAULT NOW()
);
```

### C) Public-Safe Views (additions)
```sql
CREATE VIEW public_candidate_profile_v AS
SELECT id, name, title, elevator_pitch, location, github_url, linkedin_url
FROM candidate_profile;

CREATE VIEW public_experiences_v AS
SELECT id, candidate_id, company_name, title, title_progression, start_date, end_date, is_current, bullet_points, display_order
FROM experiences;

CREATE VIEW public_skills_matrix_v AS
SELECT id, candidate_id, skill_name, category, evidence, honest_notes, created_at
FROM skills;

CREATE VIEW public_faq_v AS
SELECT id, candidate_id, question, answer, is_common_question, created_at
FROM faq_responses;
```

### D) Security Model Requirements
1. Enable RLS on all base tables.
2. Owner-only CRUD policy via `admin_users.auth_user_id = auth.uid()`.
3. Anonymous users denied direct access to base/private tables.
4. Anonymous and authenticated public readers allowed on public views only.
5. Service role key used only server-side.
6. `chat_history` must not be directly readable/writable by anonymous clients; only server routes can access it.

## Prompting and Honesty Behavior (Canonical)

### Core Prompt Principles
1. Speak in first person as the candidate.
2. Be warm but direct.
3. Never oversell.
4. Explicitly acknowledge missing skills/experience.
5. Recommend against hiring when fit is poor.
6. Keep concise by default; expand on request.

### Required Honesty Directives
- If the JD asks for experience the candidate lacks, say so directly.
- If role is a clear mismatch, explicitly say "I'm probably not your person for this role."
- No hedging/weasel language to soften known mismatches.
- Gaps are discussed confidently and concretely.

### Required JD Analyzer JSON Schema
```json
{
  "verdict": "strong_fit | worth_conversation | probably_not",
  "headline": "string",
  "opening": "string",
  "gaps": [
    {
      "requirement": "string",
      "gap_title": "string",
      "explanation": "string"
    }
  ],
  "transfers": "string",
  "recommendation": "string"
}
```

### Calibration Guidance (must include in prompting docs/tests)
1. Good honesty example:
- User: "We need someone with 5+ years of mobile development"
- Good: "I should be upfront - I don't have mobile development experience. My background is entirely backend and infrastructure. While I could learn, you probably want someone who can hit the ground running. I'm not your person for this role."
2. Bad honesty example:
- "While I haven't done mobile specifically, my strong engineering fundamentals would allow me to pick it up quickly..."

## API Contracts (Authoritative)

### POST /api/chat
1. Purpose:
- Real-time AI chat using full private candidate context.
2. Canonical request payload:
```json
{
  "messages": [
    { "role": "user", "content": "..." },
    { "role": "assistant", "content": "..." }
  ]
}
```
3. Behavior:
- Validate payload.
- Resolve or generate a `session_id` for the active chat.
- Load up to the last 20 rows from `chat_history` for that `session_id`.
- Load private context from Supabase (profile, experiences, skills, gaps, FAQ, instructions).
- Build system prompt with anti-sycophancy directives.
- Stream response tokens from OpenAI.
- Persist the new user turn and assistant turn to `chat_history`.
4. Response:
- Streaming data response (SSE/data stream).
5. Error handling:
- 400 for invalid payload.
- 500 for missing env or backend failures.

### POST /api/analyze-jd
1. Purpose:
- Structured honest fit assessment.
2. Canonical request payload:
```json
{
  "jobDescription": "full JD text"
}
```
3. Behavior:
- Validate minimum/maximum length.
- Load private context.
- Use JD-specific system prompt.
- Generate structured JSON via schema validation.
4. Response:
- JSON strictly matching schema above.
5. Error handling:
- 400 invalid input.
- 500 provider/context failures.

## Frontend Implementation Map

### Original spec component map (preserved)
```text
src/
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   ├── sections/
│   │   ├── HeroSection.tsx
│   │   ├── ExperienceSection.tsx
│   │   ├── SkillsMatrix.tsx
│   │   ├── FitAssessment.tsx
│   │   └── ExperienceCard.tsx
│   ├── chat/
│   │   ├── ChatDrawer.tsx
│   │   ├── ChatMessage.tsx
│   │   └── ChatInput.tsx
│   └── admin/
│       ├── AdminLayout.tsx
│       ├── ProfileForm.tsx
│       ├── ExperienceForm.tsx
│       ├── SkillsForm.tsx
│       ├── GapsForm.tsx
│       └── FAQForm.tsx
├── hooks/
│   ├── useChat.ts
│   ├── useJDAnalyzer.ts
│   └── useCandidateData.ts
├── lib/
│   ├── supabase.ts
│   └── api.ts
└── pages/
    ├── index.tsx
    └── admin/*
```

### Vercel/Next equivalent (authoritative)
1. Public:
- `src/app/page.tsx`
2. Admin:
- `src/app/admin/login/page.tsx`
- `src/app/admin/page.tsx`
- `src/app/admin/profile/page.tsx`
- `src/app/admin/narrative/page.tsx`
- `src/app/admin/experience/page.tsx`
- `src/app/admin/skills/page.tsx`
- `src/app/admin/gaps/page.tsx`
- `src/app/admin/values/page.tsx`
- `src/app/admin/faq/page.tsx`
- `src/app/admin/instructions/page.tsx`
- `src/app/admin/settings/page.tsx`
3. API:
- `src/app/api/chat/route.ts`
- `src/app/api/analyze-jd/route.ts`

## State Management
1. React Query for Supabase reads and mutations.
2. Context or Zustand for chat drawer/session state.
3. Local form state (React Hook Form + Zod) for admin editing workflows.

## Environment Variables (Cross-Mapped)

### Original spec names (Lovable/Vite style)
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `ANTHROPIC_API_KEY`

### Vercel/Next canonical names (authoritative)
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `OPENAI_API_KEY`
- `OPENAI_MODEL_CHAT`
- `OPENAI_MODEL_ANALYZE`

### Mapping notes
1. `VITE_SUPABASE_URL` -> `NEXT_PUBLIC_SUPABASE_URL`
2. `VITE_SUPABASE_ANON_KEY` -> `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. `ANTHROPIC_API_KEY` replaced by `OPENAI_API_KEY` because OpenAI is locked provider for v1.

## Implementation Phases (Execution Order)
1. Migrate Vite app shell to Next App Router.
2. Add Supabase clients (browser/server/admin) and middleware auth guard.
3. Build schema migrations and RLS/public views.
4. Implement public data loaders and page sections.
5. Implement `/api/chat` streaming endpoint.
6. Implement `/api/analyze-jd` structured endpoint.
7. Implement admin panel forms for all 8 sections.
8. Seed DB from existing static data.
9. Run tests and calibration checks.
10. Deploy to Vercel and run smoke/acceptance checks.

## Deployment Checklist (Lossless)

### Supabase setup
- [ ] Create new Supabase project.
- [ ] Run migrations (all base + extension tables/views).
- [ ] Configure RLS policies.
- [ ] Configure auth provider (magic link).
- [ ] Configure auth redirect URLs.
- [ ] Add service role usage only on server.
- [ ] Configure scheduled retention cleanup for `chat_history` rows older than 30 days.

### Vercel setup
- [ ] Create Vercel project from repo.
- [ ] Set environment variables for Preview + Production.
- [ ] Confirm Next build settings.
- [ ] Deploy preview.
- [ ] Promote to production.

### Content population
- [ ] Fill complete profile.
- [ ] Add all experiences with deep private context.
- [ ] Complete honest skills assessment.
- [ ] Document explicit gaps.
- [ ] Add FAQ responses.
- [ ] Set anti-sycophancy instructions.

### Testing
- [ ] Test JDs that should be rejected.
- [ ] Test JDs that are good fits.
- [ ] Test chat edge cases.
- [ ] Verify AI avoids overselling.
- [ ] Verify chat context continuity using persisted history for the same `session_id`.
- [ ] Verify retention cleanup removes rows older than 30 days.

## Acceptance Criteria and Test Matrix

### Functional
1. Public site renders all sections from DB data.
2. Chat drawer streams AI responses.
3. JD analyzer returns structured result.
4. Admin panel can create/update all context domains.
5. Chat responses use persisted session history for continuity.

### Honesty
1. Bad-fit JD produces explicit mismatch/rejection language.
2. Good-fit JD still includes candid gaps.
3. Missing skill questions answered directly without hedge.

### Security
1. Anon cannot read base/private tables.
2. Admin routes require auth.
3. Service role secrets never exposed client-side.
4. `chat_history` is not directly exposed to anonymous clients.

### Performance
1. Public page loads within acceptable UX bounds.
2. Chat/JD APIs respond within practical latency targets.

## Shared Public Interfaces and Types (Must Exist)
- `CandidateProfilePublic`
- `CandidateProfilePrivate`
- `ExperiencePublic`
- `ExperiencePrivate`
- `SkillAssessment`
- `GapWeakness`
- `FAQResponse`
- `AIInstruction`
- `JDAnalysisResult`
- `ChatTurn`

## Assumptions and Defaults
1. Single candidate per deployment.
2. Magic-link admin auth in v1.
3. OpenAI is primary provider in v1.
4. Chat history is persisted in v1 with 30-day retention cleanup.
5. Seed from existing static candidate data.
6. No multi-tenant behavior in v1.
