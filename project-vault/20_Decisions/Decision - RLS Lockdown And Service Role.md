---
layer: decision
date: 2026-07-06
status: standing
---

# Decision - RLS Lockdown And Service Role

## Decision

Enable **Row Level Security on every table with zero anon policies**, and run the entire
application on the **service-role key**, which bypasses RLS.

## Why

Before the lockdown, the anon key was the only wall around `leads` and `consultations` PII. If
it leaked — and anon keys are designed to be public — the data was exposed. Making the anon key
**inert** removes that whole class of risk, at the cost of concentrating trust in one
server-only secret.

Surfaced by the `/murphyscan` launch-readiness audit in Session 10.

## How It Was Executed

1. Session 10b: `lib/supabase.ts` changed to prefer `SUPABASE_SERVICE_ROLE_KEY`, with a
   server-only guard that throws if the module reaches the browser, and `persistSession: false`.
2. Two SQL scripts were prepared rather than run — **automated modes are blocked from
   production DDL**.
3. Session 10c: the user supplied the service-role key, then ran
   `scripts/security/rls-lockdown.sql` themselves.
4. Session 13: `_prisma_migrations` was found still open by the dashboard Security Advisor and
   fixed with `ALTER TABLE public._prisma_migrations ENABLE ROW LEVEL SECURITY;`. The line was
   added to the lockdown script so a re-run covers it.

## Consequences

* **`SUPABASE_SERVICE_ROLE_KEY` is now a required env var** in `.env` and Vercel. Without it the
  app reads nothing.
* The anon key is harmless: reads return `[]`, writes return `42501` / 401.
* The service-role key is the crown jewel — server-only, never in the repo, rotate in the
  dashboard if it leaks.
* Verified empty tables are **genuinely empty**, not RLS-filtered, only when checked as
  `postgres` (`rolbypassrls`). Session 16 used exactly this method to confirm `reviews` and
  `leads` are at 0 rows.

## Watch Out

**Supabase advisor emails can be stale.** The 2026-07-08 "Table publicly accessible" email came
from a scan dated 06 Jul that predated the lockdown DDL. Verify against the live DB before
acting on one.

## Linked Notes

* [[Security Posture]]
* [[Data Access Layer]]
* [[Security Auth Rules]]
* [[Production Deployment]]

## Source Trace

`HANDOFF.md` Sessions 10, 10b, 10c, 13, 16; `lib/supabase.ts`; `scripts/security/rls-lockdown.sql`.
