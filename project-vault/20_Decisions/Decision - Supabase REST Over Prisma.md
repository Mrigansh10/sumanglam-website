---
layer: decision
date: 2026-06-19
status: standing
---

# Decision - Supabase REST Over Prisma

## Decision

Prisma owns the **schema and migrations only**. Every runtime read and write goes through
`@supabase/supabase-js` REST, wrapped in `server/*.ts`.

## Why

The Prisma wire protocol (ports 5432/6543) is **blocked on the developer's home network**.
Supabase REST runs over HTTPS on 443 and works. This is a **network constraint, not a design
preference** — which matters, because it means the decision could in principle be revisited
from a different network, but nothing else about the app depends on that.

Notably, a direct 5432 connection **did** work in Session 13 (`npx prisma db execute` ran the
`_prisma_migrations` RLS fix), so the block is intermittent rather than absolute. That is not a
reason to move runtime queries back.

## Consequences

* `lib/db.ts` (Prisma client) must never be imported by a page, route handler or component.
* All admin API routes were rewritten from Prisma to REST on 2026-06-26.
* REST returns a **different shape** than Prisma — ISO-string dates, lowercase enums, literal
  column camelization. See [[Trap - REST Shape Dates And Enums]].
* Prisma-created tables have **no database defaults** for `id` / `updated_at`, so every insert
  must supply them. See [[Trap - No DB Defaults On Insert]].
* `@prisma/client` and `prisma` stay in `package.json` for `db:migrate` / `db:push` / `db:seed`
  and the `postinstall` generate step.

## Linked Notes

* [[Data Access Layer]]
* [[Database ORM]]
* [[Database Overview]]

## Source Trace

`HANDOFF.md` Sessions 2, 3, 13; `lib/supabase.ts`, `lib/db.ts`, `package.json`.
