# Security Auth Rules

> **ℹ️ Implemented and hardened.** Current state — RLS lockdown, CSP, rate limits, session policy — is in [[Security Posture]].

## API Security

* Validate all inputs.
* Use structured JSON error responses.
* Add rate limiting where public write endpoints can be abused.
* Protect environment variables.
* Use CSRF protection where relevant.
* Do not trust client-side validation alone.

## Admin Security

* All admin functionality requires authentication.
* V1 role is Admin.
* Future roles must not be implemented unless explicitly approved.
* Lead data is private and admin-only.

## Form Security

* Consultation form requires server-side validation.
* Sanitize text fields.
* Capture source context without trusting arbitrary client data blindly.

## Open Questions

* Validation library is not specified.
* Rate limiting provider/approach is not specified.
* Auth provider configuration is not specified.

## Linked Notes

* [[Backend - Auth Admin]]
* [[API - Consultations]]
* [[API - Admin Leads]]
* [[17_Forbidden_Things]]

## Source Trace

Source files: `10-techincal-architecture.md`, `11-rules.md`, `12-dontdo.md`, `09-api-specification.md`.
