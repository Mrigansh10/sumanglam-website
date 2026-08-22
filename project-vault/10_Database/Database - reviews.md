# Database - reviews

> **As-built note.** This table was added during implementation and is not in the original
> `08-database-design.md`. See [[Data Access Layer]] and [[Spec Vs Built]].

## Purpose

Stores customer reviews submitted through the public site, plus reviews imported from Google,
with an approval gate before anything renders publicly.

## Fields / Properties

| Column | Type | Notes |
|---|---|---|
| `id` | `String` | Primary key. `@default(cuid())` is **client-side** — REST inserts must supply it |
| `author_name` | `String` | |
| `rating` | `Int` | |
| `content` | `String` | |
| `is_approved` | `Boolean` | Defaults `false`. **Indexed** |
| `created_at` | `DateTime` | Defaults `now()` |
| `updated_at` | `DateTime` | `@updatedAt` is client-side — REST updates must stamp it |

## Relationships

Standalone — no foreign keys.

## Used By

* `server/reviews.ts` — `submitReview`, `getApprovedReviews`, `getAllReviewsAdmin`,
  `setReviewApproval`, `deleteReview`
* `server/google-reviews.ts` — `getGoogleReviews`, fed by `npm run scrape:reviews`
* `GET`/`POST /api/v1/reviews`; admin `GET/PATCH/DELETE /api/v1/admin/reviews[/id]`
* `components/shared/reviews-section.tsx`, `review-form.tsx`, `star-rating.tsx`
* `/admin/reviews` — see [[Admin Surface]]

## Validation Rules

* Public submissions are Zod-validated (`lib/validation/review.ts`) and rate-limited.
* Submissions land with `is_approved = false` and only render after moderation.
* Inserts must supply `id` and `updated_at` — see [[Trap - No DB Defaults On Insert]].

## Content Rules

**Reviews stay photo-less** — a deliberate content decision, see [[Content And Asset State]].
Never invent review content.

## Current State

⚠️ **The table holds 0 rows** (verified 2026-08-12 as `postgres` with `rolbypassrls`, so this
is a real empty table, not an RLS artifact). The public site therefore renders **no reviews at
all**. If a reviews surface looks bare, that is why — it is not a bug.

The "Test User" review flagged before launch was already gone by the time it was checked.

## History

Reviews were the one table with RLS **enabled but no policies** before the full lockdown, which
broke the reviews API entirely. Fixed by the 2026-07-06 lockdown plus the move to the
service-role key. `scripts/security/fix-reviews-rls.sql` is now obsolete.

## Linked Notes

* [[Database Overview]]
* [[Data Access Layer]]
* [[Decision - RLS Lockdown And Service Role]]
* [[Homepage]]

## Source Trace

`prisma/schema.prisma`, `server/reviews.ts`, `lib/validation/review.ts` read 2026-08-22;
history from `HANDOFF.md` Sessions 2, 10b, 10c, 16.
