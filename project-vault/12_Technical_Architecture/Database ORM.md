# Database ORM

> **⚠️ Superseded.** Prisma is used for **schema and migrations only** — never for runtime queries. See [[Decision - Supabase REST Over Prisma]] and [[Data Access Layer]].

## Database

PostgreSQL.

## ORM

Prisma.

## Responsibilities

* Content storage.
* Product storage.
* Lead management.
* Consultation management.
* Relationships.

## Provider Options

Production database provider is documented as:

* Supabase PostgreSQL, or
* Neon PostgreSQL.

Provider is not finalized.

## Implementation Rules

* Follow [[Database Overview]].
* Do not introduce schema changes without updating documentation.
* Do not create tables outside documented domain models.
* Do not denormalize without justification.
* Do not store duplicate information.

## Linked Notes

* [[Database Overview]]
* [[Database - Status Enums]]
* [[15_Open_Questions]]

## Source Trace

Source files: `08-database-design.md`, `10-techincal-architecture.md`, `11-rules.md`, `12-dontdo.md`.
