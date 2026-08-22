---
layer: trap
severity: medium
area: security
---

# Trap - CSP Blocks New External Origins

## The Trap

The site ships a **full Content-Security-Policy** in `next.config.ts`. Any feature that loads a
new external **script, frame, image, font, or connect** origin will be **silently blocked by the
browser** until that origin is added to the policy.

The failure looks like a broken feature, not a security setting — an embed that renders blank,
a script that never fires, an image that never loads.

## Currently Allowlisted

* Scripts: `'self'`, inline, `https://*.googletagmanager.com`
* Images: `'self'`, `data:`, `blob:`, `res.cloudinary.com`, googletagmanager, google-analytics
* Connect: `'self'`, google-analytics, analytics.google.com, googletagmanager
* Frames: `https://www.google.com` (the Maps embeds)
* Everything else: `default-src 'self'`, `object-src 'none'`, `frame-ancestors 'none'`

## The Dev-Only Escape Hatch

`'unsafe-eval'` is appended to `script-src` **in development only** — `next dev` bundles via
eval, and without it local pages render **completely blank**. Production never gets it. If local
pages go blank after touching `next.config.ts`, check that the `isDev` branch survived.

## Also Note

`images.remotePatterns` in the same file is a **separate** allowlist for `next/image`. A new
image host needs adding in **both** places.

## Linked Notes

* [[Security Posture]]
* [[Route Map]]
* [[Performance SEO Security]]

## Source Trace

`next.config.ts`; `HANDOFF.md` Sessions 10b and 11.
