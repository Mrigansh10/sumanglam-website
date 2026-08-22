# Open Questions

> **ℹ️ Several of these are now answered** by what shipped. See the resolved-questions table in [[Spec Vs Built]].

## Product

* Question: Should V1 include exactly 20 curated product pages, or a broader 100-300 product sample?
  Why it matters: It affects seed data, admin scope, page volume, QA, and performance testing.
  Source: `01-prd.md` Phase 2, `02-information_architecture.md` MVP Scope.
  Blocks implementation: Partially. Foundation can proceed; product seeding and PDP scope need confirmation.

* Question: Should Product Detail pages show exact pricing or only `price_range`?
  Why it matters: The PRD asks for exact pricing, while the content/database model uses `price_range`.
  Source: `01-prd.md` Product Detail Pages, `06-content-model.md` Product Fields, `08-database-design.md` products table.
  Blocks implementation: Partially. Schema can use `price_range`; exact pricing requires business confirmation.

## Information Architecture

* Question: Is Wardrobes a top-level navigation item in V1, or should wardrobe content live under Mrida/Kitchens?
  Why it matters: The site map includes Wardrobes, but main navigation does not.
  Source: `02-information_architecture.md` Navigation Structure and Site Map, `16-doc-review.md`.
  Blocks implementation: Yes for final navigation, no for core setup.

* Question: Should Architects & Designers be a full V1 page or a lightweight lead-generation page only?
  Why it matters: V1 excludes Architect Portal but includes the Architects & Designers page.
  Source: `02-information_architecture.md`, `07-screen-event-flows.md`, `13-master-context.md`.
  Blocks implementation: Partially. Do not build portal features.

## UI/UX

* Question: What is the final homepage hero copy?
  Why it matters: `03-ui-ux-specification.md` provides example messaging only, not final copy.
  Source: `03-ui-ux-specification.md` Hero Section.
  Blocks implementation: No. Placeholder copy can be used only if clearly marked.

* Question: Which sections should use Three.js, GSAP ScrollTrigger, and Lenis.js?
  Why it matters: These libraries are now approved, but the exact immersive/scroll behaviors are not specified.
  Source: User instruction on 2026-06-10, `03-ui-ux-specification.md`, `04-design-language.md`.
  Blocks implementation: Partially. Install/config can wait until a section requires it.

## Design Language

* Question: What exact color tokens should be used?
  Why it matters: The docs specify brand mood and anti-patterns but not concrete colors.
  Source: `04-design-language.md`.
  Blocks implementation: Yes for final design system; no for scaffolding.

* Question: What exact fonts should be used?
  Why it matters: The docs specify typography philosophy but not typefaces.
  Source: `04-design-language.md`.
  Blocks implementation: Yes for final visual design.

## Domain Model

* Question: Should `Solution` be a V1 entity, a content abstraction, or a future-only concept?
  Why it matters: `16-doc-review.md` says solution support should be introduced, but V1 database tables do not include a solutions table.
  Source: `05-domain-model.md`, `08-database-design.md`, `16-doc-review.md`.
  Blocks implementation: Partially. Avoid overbuilding until decided.

## Content Model

* Question: Where will official brand assets, showroom photos, and inspiration imagery come from?
  Why it matters: The homepage and visual-first pages rely on high-quality imagery.
  Source: `03-ui-ux-specification.md`, `04-design-language.md`, `10-techincal-architecture.md`.
  Blocks implementation: Yes for final visual QA, no for layout scaffolding.

* Question: Who owns content editing and publishing status changes?
  Why it matters: Content governance requires status, metadata, author/editor, and last updated date.
  Source: `06-content-model.md`.
  Blocks implementation: Partially for admin workflow.

## Content Taxonomy

* Question: Should new categories be seeded only when products exist, or can planned categories exist empty?
  Why it matters: Taxonomy governance says avoid category proliferation and create categories only with demand/products.
  Source: `15-content-taxonomy.md`.
  Blocks implementation: No for schema, yes for seed content.

## Database

* Question: Should production PostgreSQL use Supabase or Neon?
  Why it matters: Environment variables, connection pooling, migrations, backups, and deployment differ.
  Source: `10-techincal-architecture.md`.
  Blocks implementation: Yes for production setup, no for local Prisma schema.

* Question: Should media fields be arrays of Cloudinary public IDs, URLs, or structured media objects?
  Why it matters: Database docs list image fields but not their exact storage shape.
  Source: `06-content-model.md`, `08-database-design.md`, `10-techincal-architecture.md`.
  Blocks implementation: Yes for schema finalization.

## API/backend

* Question: What validation library should be used for API and form inputs?
  Why it matters: Forms must not trust client-side validation alone.
  Source: `10-techincal-architecture.md`, `11-rules.md`, `12-dontdo.md`.
  Blocks implementation: Partially.

* Question: What channel should admin notifications use after consultation submission?
  Why it matters: The flow requires notification but does not specify email, WhatsApp, dashboard alert, or another service.
  Source: `07-screen-event-flows.md`, `09-api-specification.md`.
  Blocks implementation: Yes for notification feature, no for lead creation.

## Auth/permissions

* Question: What admin authentication provider configuration and credentials should be used?
  Why it matters: Admin APIs and dashboard require authentication.
  Source: `10-techincal-architecture.md`, `09-api-specification.md`.
  Blocks implementation: Yes for admin features.

* Question: Are Admin, Editor, Content Manager, and Architect Partner future roles only?
  Why it matters: V1 scope lists Admin only.
  Source: `10-techincal-architecture.md`.
  Blocks implementation: No if V1 stays Admin-only.

## Technical Architecture

* Question: The actual file is `10-techincal-architecture.md`, but docs reference `10-technical-architecture.md`. Should the filename be corrected later?
  Why it matters: Agents may fail to locate the architecture file if they follow the references literally.
  Source: `10-techincal-architecture.md`, `11-rules.md`, `14-project-bootstrap.md`.
  Blocks implementation: No, but it is a documentation hygiene issue.

* Question: Should Three.js, GSAP, and Lenis be installed from the start or only when a planned section uses them?
  Why it matters: The architecture values simplicity and performance.
  Source: User instruction on 2026-06-10, `10-techincal-architecture.md`.
  Blocks implementation: No for initial scaffold.

## Deployment

* Question: Is the production domain definitely `sumanglam.co`, and who manages DNS?
  Why it matters: `01-prd.md` references a pre-purchased GoDaddy domain, and architecture names `sumanglam.co`.
  Source: `01-prd.md`, `10-techincal-architecture.md`.
  Blocks implementation: Yes for production launch.

## Build Process

* Question: Which package manager should be used?
  Why it matters: The docs name the stack but not npm, pnpm, yarn, or bun.
  Source: `14-project-bootstrap.md`.
  Blocks implementation: No, but the first build prompt should specify one.

* Question: Should Claude Code update vault notes after every implementation decision?
  Why it matters: `AGENTS.md` requires relevant vault notes to be updated when implementation decisions are made.
  Source: User instruction on Claude Code executor, root `AGENTS.md`.
  Blocks implementation: No.

## Source Trace

Derived from all source docs and user instructions on 2026-06-10.
