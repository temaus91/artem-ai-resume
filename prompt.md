You are implementing a full production migration of this repository to match the complete ResumeWebsitePrompt specification, adapted to Vercel/Next.js.

This prompt is intentionally self-contained and lossless. Do not rely on any external doc.

## Mission
Build a professional AI-powered candidate portfolio where the AI is the core product and behaves with brutally honest fit assessment. The system must explicitly acknowledge mismatches and can recommend against hiring for specific roles.

## Non-Negotiable Rules
1. Do not drop any requirement in this prompt.
2. Preserve explicit anti-sycophancy behavior.
3. Keep single-candidate-per-deployment model.
4. Implement with this locked stack:
- Next.js App Router on Vercel
- Supabase (Postgres + Auth + RLS)
- OpenAI GPT for chat and JD analyzer
5. Admin auth is magic-link.
6. Chat history is persisted in v1 with 30-day retention.
7. Existing static profile data is used only to seed initial DB content.

## Product Thesis to Enforce
1. AI is the product, not an afterthought.
2. Objective is trust and qualification through honesty.
3. The assistant should directly state when candidate is not a fit.
4. No polished evasiveness when there are known gaps.

## Public Site Requirements (Exact)

### Design System
- Background near-black: `#0a0a0a`
- CTA accent teal/mint: `#4ade80`
- Warning/gap accent amber: `#d4a574`
- Typography: Playfair Display for headings, Inter for body
- Cards: subtle borders, rounded corners, glass-morphism treatment

### Fixed Navigation
- Left: initials/logo
- Links: `Experience`, `Fit Check`
- Prominent teal `Ask AI` button opens right-side chat drawer

### Hero
- Status badge format: `🟢 Open to [Role Type] at [Company Stage]`
- Large serif name heading
- Title in teal
- One-line positioning statement
- Company pill badges row
- CTA: `Ask AI About Me` + chat icon + `New` badge
- Scroll indicator

### Experience Section
- Header title: `Experience`
- Subhead exact intent: `Each role includes queryable AI context—the real story behind the bullet points.`
- Role card contains:
  - Company + date range
  - Title/title progression
  - Metric bullets
  - Toggle button: `✨ Show AI Context`
- Expanded context panel fields (labels and meaning):
  - `SITUATION`
  - `APPROACH`
  - `TECHNICAL WORK`
  - `LESSONS LEARNED` (italic honest reflection)

### Skills Matrix
Three side-by-side cards:
- `STRONG ✓` (green)
- `MODERATE ○` (gray)
- `GAPS ✗` (amber)

### JD Analyzer (Killer Feature)
- Header: `Honest Fit Assessment`
- Subhead: `Paste a job description. Get an honest assessment of whether I’m the right person—including when I’m not.`
- Controls:
  - Toggle `Strong Fit Example` / `Weak Fit Example`
  - Large textarea placeholder: `Paste job description here…`
  - Button: `Analyze Fit`
- Output panel semantics:
  - Headline format: `⚠️ Honest Assessment — [Probably Not Your Person / Strong Fit / Worth a Conversation]`
  - Opening paragraph in first person, direct
  - `WHERE I DON'T FIT`
  - `WHAT TRANSFERS`
  - `MY RECOMMENDATION`
- Include philosophy callout intent/message:
  - `This signals something completely different than ‘please consider my resume.’ You’re qualifying them. Your time is valuable too.`

### Chat Drawer
- Slides in from right
- Contains message history, input, send
- Seeded questions (exact):
  - `What’s your biggest weakness?`
  - `Tell me about a project that failed`
  - `Why did you leave [Company]?`
  - `What would your last manager say about you?`

### Footer
- Name + title
- GitHub/LinkedIn/Email links
- Tagline about AI-queryable portfolios

## Admin Panel Requirements (All 8 Context Domains)

### Auth and Access
- Supabase magic-link auth
- `/admin` routes protected by middleware/session checks
- Single owner candidate model

### 1) Basic Profile
- Full name
- Current title
- Target titles
- Target company stages
- Location
- Remote preference
- Availability status/date
- Salary min/max
- Social links

### 2) Professional Narrative
- Elevator pitch
- Career narrative
- Known for
- Looking for
- Not looking for
- Management style
- Work style preferences

### 3) Experience Deep Dive (per role)
Public:
- Company name
- Title(s)
- Dates
- Public bullet points
Private AI context:
- Why joined
- Why left
- Individual contribution vs team
- Proudest achievement
- Would do differently
- Hard/frustrating parts
- Lessons learned
- Manager perspective
- Reports perspective
- People conflicts/challenges
- Quantified impact

### 4) Skills Self-Assessment
- Skill name
- Rating: Strong / Moderate / Weak / No Experience
- Evidence
- Honest notes

### 5) Gaps & Weaknesses
- Known skill gaps
- Role types that are bad fits
- Environment mismatches
- Past feedback
- Active improvement areas
- Zero-interest learning areas

### 6) Values & Culture Fit
- Must-haves
- Dealbreakers
- Management style preferences
- Team size preferences
- Conflict handling
- Ambiguity handling
- Failure handling

### 7) FAQ / Common Questions
Pre-answer common interview prompts and custom Q&A.

### 8) Anti-Sycophancy Instructions
Admin-editable behavior instructions including:
- Never oversell
- Admit missing requirements directly
- Use “I’m probably not your person” where appropriate
- Don’t hedge
- Okay to recommend not hiring

## Architecture Requirements

### Replace Lovable Edge Functions with Next Route Handlers
- `src/app/api/chat/route.ts`
- `src/app/api/analyze-jd/route.ts`

### Keep Supabase as backend
- Postgres for profile/context data
- Auth + RLS for admin security
- service role access only in server code

## Required File/Route Inventory

### App Router core
- `src/app/layout.tsx`
- `src/app/page.tsx`
- `src/app/globals.css`

### Admin routes
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

### API routes
- `src/app/api/chat/route.ts`
- `src/app/api/analyze-jd/route.ts`

### Support libs/types/hooks
- `src/middleware.ts`
- `src/lib/supabase/browser.ts`
- `src/lib/supabase/server.ts`
- `src/lib/supabase/admin.ts`
- `src/lib/ai/build-system-prompt.ts`
- `src/lib/ai/build-jd-prompt.ts`
- `src/hooks/useCandidateData.ts`
- `src/hooks/useChat.ts`
- `src/hooks/useJDAnalyzer.ts`
- `src/types/domain.ts`

## Data Model Requirements

### Preserve these base tables
- `candidate_profile`
- `experiences`
- `skills`
- `gaps_weaknesses`
- `faq_responses`
- `ai_instructions`
- `chat_history` (required runtime usage in v1)

### Add required extensions
- `values_culture_fit`
- `admin_users`
- public-safe views:
  - `public_candidate_profile_v`
  - `public_experiences_v`
  - `public_skills_matrix_v`
  - `public_faq_v`

### Migration requirements
- Include created_at/updated_at where relevant
- Add indexes on candidate linkage and display order
- Maintain schema compatibility with all 8 admin context domains

## Security Requirements
1. Enable RLS on all base tables.
2. Owner-only policy via `admin_users.auth_user_id = auth.uid()`.
3. Anonymous users can only read public views.
4. Private context inaccessible to anonymous clients.
5. `SUPABASE_SERVICE_ROLE_KEY` never exposed to browser.
6. `/admin/*` protected by middleware except login/confirm paths.
7. `chat_history` must only be accessed by server routes, never directly by anonymous clients.

## API Contracts (Canonical)

### POST /api/chat
Request:
```json
{
  "messages": [
    { "role": "user", "content": "..." },
    { "role": "assistant", "content": "..." }
  ]
}
```
Behavior:
1. Validate payload.
2. Resolve or generate a `session_id` for the chat session.
3. Load up to the last 20 messages from `chat_history` for that `session_id`.
4. Assemble full private candidate context.
5. Build anti-sycophancy system prompt.
6. Stream OpenAI response.
7. Persist both new user and assistant turns to `chat_history`.

Response:
- Streamed text/data response.

### POST /api/analyze-jd
Request:
```json
{
  "jobDescription": "..."
}
```
Response schema:
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
Behavior:
1. Validate input.
2. Build JD-specific system prompt with full context.
3. Use schema-constrained structured generation.
4. Return validated JSON.
5. Return robust error responses on malformed model outputs.

## Prompting Behavior Requirements

### Mandatory system directives
- Speak in first person as candidate.
- Never oversell.
- Be direct about gaps.
- If role is not fit, say so explicitly.
- It is acceptable to recommend not hiring.
- Keep concise unless detail requested.

### Include calibration content in prompting/test fixtures
Good response example:
- `I should be upfront - I don't have mobile development experience... I'm not your person for this role.`

Bad response example:
- `While I haven't done mobile specifically... I could pick it up quickly...`

### Rejection guardrail
- If there are 3+ major requirement gaps, recommendation should generally be `probably_not` with explicit rationale.

## State Management Requirements
- React Query for data fetching/mutations.
- Context or Zustand for chat state.
- Local form state for admin forms.

## Environment Variables

### Original traceability names
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `ANTHROPIC_API_KEY`

### Canonical Next/Vercel names
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `OPENAI_API_KEY`
- `OPENAI_MODEL_CHAT`
- `OPENAI_MODEL_ANALYZE`

## Shared Types That Must Exist
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

## Data Bootstrap Requirement
- Convert existing static `src/data/artem-profile.ts` content into DB seed scripts/data.
- Public runtime must read from DB, not hardcoded demo content.

## Test Requirements

### Unit
- Prompt builders include honesty directives.
- JD schema validation and fallback behavior.

### API
- `/api/chat` success/error and streaming behavior.
- `/api/analyze-jd` success/error and schema conformance.
- `/api/chat` session continuity behavior using persisted history.

### Security
- RLS blocks anon from private tables.
- Public views expose only safe columns.
- Admin gate enforcement for `/admin`.

### E2E
- Magic link login flow.
- Admin content edits and persistence.
- Public site reflects updates.
- Chat and JD analysis workflows complete.
- Chat continuity across page refresh/new requests with same `session_id`.

### Honesty calibration scenarios
- Bad-fit JD triggers direct rejection language.
- Good-fit JD includes strengths and explicit caveats.
- Gap-specific questions produce unhedged direct responses.

### Retention
- Verify cleanup removes `chat_history` rows older than 30 days.

## Deployment Checklist

### Supabase
- Create project
- Apply migrations
- Configure RLS
- Configure auth provider and redirect URLs
- Validate public/private access boundaries
- Configure scheduled cleanup for `chat_history` rows older than 30 days

### Vercel
- Create project
- Add env vars to Preview + Production
- Deploy preview and run smoke tests
- Promote to production

### Content
- Fill complete profile and deep context
- Add gaps and anti-sycophancy instructions
- Validate FAQ quality

## Final Delivery Format (from implementation agent)
1. Changed file list.
2. Vite -> Next migration notes.
3. `.env` template and variable explanations.
4. SQL migration summary.
5. Test run summary.
