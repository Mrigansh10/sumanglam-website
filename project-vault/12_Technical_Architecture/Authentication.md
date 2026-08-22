# Authentication

> **⚠️ Note.** Admin auth is **env-var only — there is no user record in the database**. See [[Security Posture]] and [[Trap - Vercel Env Quotes And Redeploy]].

## Scope

Admin only in V1.

## Provider

Auth.js.

## Roles

V1:

* Admin.

Future:

* Editor.
* Content Manager.
* Architect Partner.

## Implementation Rules

* All admin functionality must require authentication.
* Do not build public user accounts in V1.
* Do not build architect partner role or portal in V1 unless explicitly approved.

## Used By

* [[Admin Dashboard]]
* [[API - Admin Content]]
* [[API - Admin Leads]]

## Open Questions

* Auth provider configuration is not specified.
* Admin credential provisioning is not specified.
* Role persistence model is not specified.

## Source Trace

Source files: `10-techincal-architecture.md`, `09-api-specification.md`, `11-rules.md`, `12-dontdo.md`.
