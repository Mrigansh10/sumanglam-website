---
layer: trap
severity: medium
area: security
---

# Trap - Stale Supabase Advisor Emails

## The Trap

Supabase "**Action required**" emails carry a **snapshot from an earlier scan**. The 2026-07-08
email titled "Table publicly accessible" (`rls_disabled_in_public`) was dated 06 Jul — it
predated the lockdown DDL that had already fixed it.

Acting on it directly would have meant re-running DDL against an already-correct database and,
worse, believing PII had been exposed when it hadn't.

## The Rule

**Verify against the live database before treating an advisor email or dashboard finding as
real.** The check:

* anon-key read on the flagged table → expect `[]`
* anon-key `INSERT` → expect `42501` / 401

And to confirm a table is *genuinely* empty rather than RLS-filtered, query as `postgres`
(`rolbypassrls = true`) and sanity-check with a table you know has rows — Session 16 used the
15-row `brands` table as the control.

## But Sometimes It's Real

The same Advisor surfaced a **genuine** gap in the same window: `public._prisma_migrations` had
RLS off and was anon-readable. It wasn't in the original 19-table lockdown. Migration names and
checksums only — no PII — but real. Fixed 2026-07-09 and added to
`scripts/security/rls-lockdown.sql`.

**So: don't dismiss advisor findings either. Verify.**

## Linked Notes

* [[Security Posture]]
* [[Decision - RLS Lockdown And Service Role]]

## Source Trace

`HANDOFF.md` Sessions 13 and 16.
