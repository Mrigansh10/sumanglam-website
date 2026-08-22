# Deployment

> **✅ Done.** The site is live at **https://sumanglam.co** since 2026-07-06. Actual hosting, DNS and env details are in [[Production Deployment]].

## Frontend

Vercel.

## Database

Supabase PostgreSQL or Neon PostgreSQL.

## Asset Storage

Cloudinary.

## Domain

`sumanglam.co`

`01-prd.md` also mentions DNS mapped to a pre-purchased GoDaddy domain.

## Environment Strategy

* Development: local environment.
* Staging: optional for V1.
* Production: live website.

## Deployment Readiness Requirements

* Environment variables configured.
* Database connection works.
* Cloudinary works.
* Auth.js works.
* Sitemap, robots, canonical URLs, metadata, and Open Graph are configured.
* Analytics events work.

## Open Questions

* Confirm database provider.
* Confirm DNS owner and exact domain setup.
* Confirm whether staging is needed.

## Linked Notes

* [[18_Build_Order]]
* [[Performance SEO Security]]
* [[15_Open_Questions]]

## Source Trace

Source files: `01-prd.md`, `10-techincal-architecture.md`.
