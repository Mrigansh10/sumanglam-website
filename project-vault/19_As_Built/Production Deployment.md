---
layer: as-built
status: live
updated: 2026-08-22
---

# Production Deployment

> **The site is live at https://sumanglam.co** — launched 2026-07-06.

## Hosting

| Item | Value |
|---|---|
| Platform | Vercel, project `sumanglam/sumanglam-website` |
| Deploy trigger | **Auto-deploy from `master`** — a push to master ships to production |
| Repo | https://github.com/Mrigansh10/sumanglam-website |
| Live commit | `2554f0e` (2026-07-23). No app code has changed since |
| Build gate | Type errors hard-fail the build (see [[Security Posture]]) |

## Domain And DNS (GoDaddy)

| Record | Value |
|---|---|
| Apex `sumanglam.co` | A → `216.198.79.1` |
| `www` | CNAME → apex |
| Redirects | `www` **and** the `*.vercel.app` URL both **308 → apex** |

Old GoDaddy-email CNAMEs (`secureserver.net`) are deliberately left in place until a Google
Workspace MX setup replaces them.

**Launch driver:** Google Workspace flagged the bare domain as suspicious; a live site plus
Search Console verification was the fix.

## Environment Variables

Set in Vercel (Production scope) and mirrored in local `.env`:

```
SUPABASE_SERVICE_ROLE_KEY=   # REQUIRED since the RLS lockdown — the anon key is inert
SUPABASE_ANON_KEY=
NEXTAUTH_SECRET=             # prod value DIFFERS from local; openssl rand -base64 32
NEXTAUTH_URL=https://sumanglam.co
ADMIN_EMAIL=mrigansh@sumanglam.co
ADMIN_PASSWORD=
CLOUDINARY_CLOUD_NAME=de9turgsy
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
NEXT_PUBLIC_SITE_URL=https://sumanglam.co
```

⚠️ **Vercel does not strip quotes the way dotenv does — paste raw values.** Env changes require
a **redeploy** to take effect. See [[Trap - Vercel Env Quotes And Redeploy]].

## Running Locally

```bash
cd /Users/MriganshChaudhary/Desktop/sumanglam-website
npm run dev          # → http://localhost:3000
npm run build
npm run typecheck
npm run lint
```

`.env` is already configured; no setup needed.

**Two local gotchas:** `npm run build` clobbers a running dev server's `.next` — restart dev
after a build. And a long-running dev server can 404 its CSS chunk after large edits, rendering
pages completely unstyled; fix with `rm -rf .next && npm run dev`. See
[[Trap - Stale Dev Build Cache]].

## Post-Launch Verification Checklist

Used at launch and worth repeating after any significant deploy:

1. All public routes return 200.
2. Security headers present (`curl -I`).
3. Admin login works on production.
4. `sitemap.xml` emits `sumanglam.co` URLs.
5. `/favicon.ico` returns 200 (Googlebot + the Google Favicon crawler UA both fetch it).
6. Consultation submit succeeds end-to-end; clean up the test row afterwards.

## DNS Triage Note

"Site doesn't open on some phones" (2026-07-07) was **not a defect** — carrier DNS caching
from the parking-page era, self-healing. Authoritative zone, TLS 1.2, http→https, and absence
of stale AAAA records were all verified.

## Linked Notes

* [[Deployment]] — the *specified* deployment plan
* [[Security Posture]]
* [[SEO And Metadata]]
* [[As Built Overview]]

## Source Trace

`HANDOFF.md` header and Sessions 11–13; `next.config.ts` and `package.json` read 2026-08-22.
