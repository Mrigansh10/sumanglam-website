---
layer: as-built
status: live
updated: 2026-08-22
---

# Admin Surface

> `/admin` — the content operations dashboard. Redirects to `/admin/login` when
> unauthenticated. Everything here is gated by [[Security Posture|env-var credentials auth]].

## Screens

| Screen | Path | What it does |
|---|---|---|
| Overview | `/admin` | Counts and recent activity (`getAdminOverview`) |
| Brands | `/admin/brands`, `/admin/brands/[id]` | Edit brand copy, type, logo, **hero image**. Brand heroes also drive the Kitchens mega-menu cards |
| Spaces | `/admin/spaces`, `/admin/spaces/[id]` | Per-category page **hero image + intro copy** (Kitchens, Wardrobes, Hardware…). Uploads to `sumanglam/spaces` |
| Homepage | `/admin/homepage` | The **4 homepage image slots** — hero + Kitchens/Wardrobes/Hardware journey cards. Uploads to `sumanglam/home` |
| Inspirations | `/admin/inspirations`, `/new`, `/[id]` | List, create, edit. Gallery images upload to `sumanglam/inspirations` |
| Content | `/admin/content` | Publish/draft/archive toggles and featured flags across content types |
| Leads | `/admin/leads` | Inbox, status changes, **delete** |
| Consultations | `/admin/consultations` | Inbox, status changes, **delete** |
| Reviews | `/admin/reviews` | Approve / unapprove / delete |

## Homepage Images Are Database-Driven

The homepage hero and the three journey cards are **not** a hardcoded `IMAGES` const. They live
in the `site_settings` table and are read by `getHomepageImages()` in `server/site-settings.ts`
(which supplies built-in defaults). Written through `PUT /api/v1/admin/settings/homepage`.

Slot keys are defined by `HOMEPAGE_SLOT_KEYS`; `home_hardware` is the one that was set purely
via the DB in Session 7. **To change a homepage image, use Admin → Homepage — do not edit code.**

Category page heroes work the same way through Admin → Spaces.

## Image Upload Behaviour

`components/admin/image-upload.tsx` — dual mode (file drag-drop + URL import). It downscales
in-browser to ≤3000px / <9 MB before upload to clear Cloudinary's 10 MB free-plan limit, and
stores **bare public IDs** so `resolveImage()` can apply auto-polish. Full rules in
[[Image Delivery Pipeline]].

Landscape sources only for heroes; portrait looks wrong in the wide hero.

## Delete Flow (Session 14)

`components/admin/delete-confirm-form.tsx` is the reusable pattern: a Delete button plus an
in-page confirm dialog (Escape to close, backdrop click, Confirm focused on open). Deliberately
**not** `window.confirm()` — unstylable and blocks the event loop.

Two auth-gated paths exist for each entity:

* Server actions `deleteLeadAction` / `deleteConsultationAction` in
  `app/admin/(protected)/actions.ts` → `requireAdmin()` → `revalidatePath` on `/admin`,
  `/admin/leads`, `/admin/consultations`.
* `DELETE` handlers on `app/api/v1/admin/leads/[id]` and `.../consultations/[id]`.

Both go through `deleteLead()` / `deleteConsultation()` in `server/admin.ts`.

**Cascade semantics:** deleting a **lead** also deletes its consultations
(`consultations_lead_id_fkey` is `ON DELETE CASCADE` in the DB — no app-side cleanup).
Deleting a **consultation** leaves the lead intact. The dialog copy and the Leads page intro
both say this explicitly.

⚠️ The confirm button must `await` the action **before** closing the dialog — see
[[Trap - Unmounting A Server Action Form]].

## History Note

All admin API routes were rewritten from Prisma to Supabase REST on 2026-06-26. If you find
Prisma-shaped assumptions in admin code, they are leftovers — see [[Data Access Layer]].

## Linked Notes

* [[Admin Dashboard]] — the *specified* admin design
* [[Create Inspiration Admin]]
* [[Create Product Admin]]
* [[Manage Leads Admin]]
* [[Route Map]]
* [[Security Posture]]

## Source Trace

`app/admin/`, `app/api/v1/admin/`, `server/admin.ts`, `server/site-settings.ts`,
`components/admin/*` read 2026-08-22; behaviour from `HANDOFF.md` Sessions 4, 6 and 14.
