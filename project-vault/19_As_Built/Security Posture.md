---
layer: as-built
status: live
updated: 2026-08-22
---

# Security Posture

> Hardened across Sessions 10, 10b, 10c and 13 via the `/murphyscan` audit skill. This note is
> the current state; the audit history is in `HANDOFF.md`.

## Database — RLS Locked Down (2026-07-06)

* **RLS is ENABLED on all 19 application tables with zero anon policies**, plus
  `public._prisma_migrations` (closed 2026-07-09 — it was missed in the original sweep and was
  anon-readable; migration names/checksums only, no PII).
* **The anon key is inert.** Verified post-lockdown: anon reads return `[]` on every table,
  anon `INSERT` → `42501` / 401.
* **The app runs entirely on `SUPABASE_SERVICE_ROLE_KEY`**, which bypasses RLS. That key is the
  crown jewel: server-only, never in the repo, rotate in the Supabase dashboard if it leaks.
  `lib/supabase.ts` throws if imported client-side.
* DDL lives in `scripts/security/rls-lockdown.sql` and must be **run by the user** — automated
  modes are blocked from production DDL. `scripts/security/fix-reviews-rls.sql` is obsolete.

⚠️ **Supabase "Action required" advisor emails can be stale.** The 2026-07-08 email flagged
`rls_disabled_in_public` from a scan that predated the lockdown. Always verify against the live
DB before treating an advisor email as a real finding.

## Auth — `auth.ts`

* Auth.js v5, **credentials provider, env-var only — there is no admin user record in the DB.**
  `auth.ts` compares against `ADMIN_EMAIL` / `ADMIN_PASSWORD`.
* Timing-safe credential comparison.
* **Rate limited: 5 attempts / 15 min / IP** (`auth.ts:38`).
* **24h session expiry.**
* Current admin email: `mrigansh@sumanglam.co` (rotated from `admin@sumanglam.co` on
  2026-07-09, password rotated at the same time). Anything ever committed is burned — the old
  password sat in `HANDOFF.md` through Session 9.

**When admin login breaks after an env change, check in this order:** (1) Vercel env changes
need a **redeploy**; (2) vars must be scoped to **Production**; (3) **Vercel does not strip
quotes** — paste raw values; (4) the 5/15min rate limit rejects even correct credentials after
repeated failures, wait 15 minutes; (5) browser autofill re-inserting old credentials. See
[[Trap - Vercel Env Quotes And Redeploy]].

## Headers — `next.config.ts`

Applied to `/:path*`:

| Header | Value |
|---|---|
| `Content-Security-Policy` | Full policy, see below |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains` (add `; preload` once the domain is settled) |
| `X-Content-Type-Options` | `nosniff` |
| `X-Frame-Options` | `DENY` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` |

`poweredByHeader: false`.

### CSP

```
default-src 'self'
script-src  'self' 'unsafe-inline' [+ 'unsafe-eval' in dev only] https://*.googletagmanager.com
style-src   'self' 'unsafe-inline'
img-src     'self' data: blob: https://res.cloudinary.com https://*.googletagmanager.com https://*.google-analytics.com
font-src    'self' data:
connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com
frame-src   https://www.google.com
object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests
```

* `'unsafe-inline'` for scripts is required by Next hydration + the inline GA4 snippet; a
  nonce-based CSP needs per-request middleware.
* `'unsafe-eval'` is **dev-only** — `next dev` bundles via eval, and without it local pages
  render blank. Production never gets it.
* `frame-src` covers the Google Maps embeds on `/contact` (and `/showroom` when restored).

> **If a new feature loads a new external script, frame, image, or connect origin, add it to
> `contentSecurityPolicy` in `next.config.ts` or the browser will silently block it.**

## API Surface

* **All admin API handlers are auth-gated** — verified by a 1:1 handler-to-`auth()` sweep.
  Server actions in `app/admin/(protected)/actions.ts` call `requireAdmin()`.
* Public writes (`consultations`, `reviews`, `events`) are **Zod-validated** (`lib/validation/`)
  and rate-limited.
* API errors return the `{ success: false, error: { code, message } }` envelope and do not leak
  internals.
* `.env` has never been committed; `next.config.ts` `images.remotePatterns` allowlists only
  Cloudinary and six vendor domains.
* Next 15.5.x — past the 15.2.3 middleware-bypass CVE.

## Build Gate

`ignoreBuildErrors` was **removed** in Session 10b; ~132 suppressed TypeScript errors were
fixed (and two real enum bugs surfaced en route). **Deploys now hard-fail on type errors.** Do
not reintroduce the suppression. `npm run typecheck` and `npm run lint --max-warnings=0`.

## Known Open Gaps

| Gap | Status |
|---|---|
| Rate limiting is **in-memory** (`lib/api/rate-limit.ts`) — not durable across serverless instances | Open, accepted for current traffic |
| No error tracking / uptime monitoring | Open |
| CSP relies on `'unsafe-inline'` for scripts | Accepted; needs middleware to improve |

## Linked Notes

* [[Security Auth Rules]]
* [[Authentication]]
* [[Data Access Layer]]
* [[Production Deployment]]
* [[Decision - RLS Lockdown And Service Role]]

## Source Trace

`next.config.ts`, `auth.ts`, `lib/supabase.ts`, `lib/api/rate-limit.ts`,
`scripts/security/*.sql` read 2026-08-22; audit history from `HANDOFF.md` Sessions 10–13.
