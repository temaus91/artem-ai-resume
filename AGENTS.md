# AGENTS.md

Project rules for future AI/code-agent edits.

## Product Posture

- This is Artem Tarasenko's personal AI-queryable resume, not a generic resume-builder SaaS.
- Keep personal projects separate from Oracle and Amazon employment.
- Do not make broad redesigns unless explicitly requested. Prefer focused polish that reinforces the existing dark editorial/engineering style.
- Do not add a resume PDF export until the content is intentionally sanitized and reviewed.

## Privacy And Public Source

- Assume this repository is public.
- Do not add personal email addresses, phone numbers, home addresses, private company/domain names, API keys, tokens, local filesystem paths, or unreleased employer details.
- The private marketplace project must stay unnamed publicly.
- The Soaring Session app should be described as an in-progress personal iOS/watchOS prototype unless real field validation exists.

## Content Truthfulness

- Education may be stated as: Bachelor of Science in Computer Science, University of Washington.
- Work authorization may be stated as: US citizen; legally authorized to work in the United States.
- Do not overstate native mobile experience. Current wording should distinguish in-progress SwiftUI/watchOS project work from deep production native mobile specialization.
- Keep AI answers grounded in explicit profile evidence. Missing evidence is not the same as a negative claim.

## UI Consistency

- Reuse existing tokens from `src/app/globals.css` and Tailwind config.
- Use `lucide-react` icons; do not introduce another icon library without a clear need.
- Use shared chip styling from `src/components/ui/Chip.tsx` for compact labels and stack badges.
- Keep dark-only styling unless a real light-mode pass is requested.
- Respect `prefers-reduced-motion`.
- Avoid emoji in UI. Use icons and text instead.
