# Folder Structure

> **ℹ️ See the real tree.** The shipped structure — including `features/`, `server/` and `components/motion/` — is mapped in [[Codebase Map]].

## Documented Structure

`/app`

App Router pages and route handlers.

`/components`

Reusable UI components.

`/features`

Feature-specific components.

Examples:

* brands.
* products.
* inspirations.
* consultations.

`/lib`

Utilities, database, Cloudinary, analytics.

`/server`

Server-side logic.

`/prisma`

Schema and migrations.

`/public`

Static assets.

`/docs`

Project documentation.

`/project-vault`

Normalized implementation knowledge base.

## Implementation Rules

* Keep feature code grouped by domain.
* Keep reusable primitives in components.
* Keep server-only logic out of client components.
* Keep docs and vault updated when architecture decisions change.

## Linked Notes

* [[Project Bootstrap]]
* [[18_Build_Order]]

## Source Trace

Source files: `10-techincal-architecture.md`, `14-project-bootstrap.md`.
