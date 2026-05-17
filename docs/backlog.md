# Backlog

## Contact Form Without Public Email

Add a contact form that lets recruiters send a message without exposing a personal email address in source code or rendered HTML.

Notes:
- Add `POST /api/contact`.
- Validate name, sender email, message, and a honeypot field.
- Reuse the existing in-memory rate limiter.
- Send through Resend, Postmark, or SendGrid.
- Keep the destination email in a server-only environment variable, such as `CONTACT_TO_EMAIL`.
- Do not use `NEXT_PUBLIC_` for private contact details.

