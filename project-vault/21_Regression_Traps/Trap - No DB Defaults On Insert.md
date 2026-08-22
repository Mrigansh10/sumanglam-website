---
layer: trap
severity: critical
area: data
---

# Trap - No DB Defaults On Insert

## The Trap

Prisma created these tables with **client-side** defaults — `@default(cuid())` for `id` and
`@updatedAt` for `updated_at`. Those are Prisma-runtime behaviours, so the **database itself has
no defaults for either column**.

A Supabase REST insert that omits them violates NOT NULL and fails.

## How It Showed Up

**Consultation booking was broken in production** and had been broken since the Prisma→REST
port — it had *never once worked*. The public form returned "something went wrong". Review
submission failed **silently**. Nobody noticed for weeks because `leads` was empty anyway, so
there was no downstream signal.

## The Fix

`lib/ids.ts` exports `newId()` and `nowIso()`. **Every** REST insert supplies both; every update
path stamps `updated_at`.

```ts
import { newId, nowIso } from "@/lib/ids";

// insert
{ id: newId(), created_at: nowIso(), updated_at: nowIso(), ...fields }

// update
{ ...fields, updated_at: nowIso() }
```

Applied in `4e744a4` to leads, consultations, reviews, all 5 admin create routes, and every
update path. Errors are now surfaced rather than swallowed.

## The Wider Lesson

**A write path that has never been exercised is not a working write path.** Test public form
submissions end-to-end on production after any data-layer change, and clean up the test rows.

## Linked Notes

* [[Data Access Layer]]
* [[Decision - Supabase REST Over Prisma]]
* [[Consultation Booking]]

## Source Trace

`HANDOFF.md` Session 11; `lib/ids.ts`; `server/leads.ts`, `server/reviews.ts`.
