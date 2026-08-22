# Backend - Auth Admin

> **ℹ️ Implemented.** See [[Security Posture]] and [[Admin Surface]].

## Purpose

Protect admin functionality and admin APIs.

## Inputs

Auth provider: Auth.js.

Roles:

* V1: Admin.
* Future: Editor, Content Manager, Architect Partner.

## Outputs

Authenticated admin sessions for dashboard and admin route handlers.

## Data Touched

Admin auth storage is not specified.

## Used By

[[Admin Dashboard]], [[API - Admin Content]], [[API - Admin Leads]]

## Error States

* Unauthorized.
* Expired session.
* Missing role.
* Misconfigured provider.

## Security/Auth Rules

* All admin functionality must require authentication.
* Do not build user accounts for public visitors in V1.
* Do not build Architect Partner roles in V1 unless explicitly approved.

## Open Questions

* Auth provider configuration and credentials are not specified.
* User/role persistence model is not specified.

## Source Trace

Source files: `09-api-specification.md`, `10-techincal-architecture.md`, `11-rules.md`, `12-dontdo.md`.
