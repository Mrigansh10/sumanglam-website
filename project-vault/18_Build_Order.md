# Build Order

> **✅ Complete.** All 13 steps shipped; the site launched 2026-07-06. See [[Session Log]] and [[As Built Overview]].

Build vertically. Do not build every page skeleton first. Complete one meaningful feature path at a time.

## 1. Repo And Project Setup

Objective: Create the application shell and establish a clean working baseline.

Source notes to read first: [[Project Bootstrap]], [[Technical Architecture Overview]], [[Global Rules]], [[17_Forbidden_Things]].

Files likely to be touched: `package.json`, `next.config.*`, `tsconfig.json`, `tailwind.config.*`, `postcss.config.*`, `.env.example`, `app/`, `components/`, `lib/`, `server/`, `prisma/`.

Acceptance criteria: Next.js app runs locally, TypeScript is configured, Tailwind is configured, shadcn/ui can be installed, project folders match [[Folder Structure]], environment validation exists.

Blockers/open questions: Package manager not specified. Database provider not finalized.

## 2. Tech Stack And Bootstrap

Objective: Configure documented and user-approved dependencies without overbuilding.

Source notes to read first: [[Frontend Stack]], [[Backend Stack]], [[User Approved Stack Extension - Three GSAP Lenis]], [[Project Bootstrap]].

Files likely to be touched: `package.json`, `app/layout.tsx`, `lib/env.ts`, `components/`, `features/`.

Acceptance criteria: Next.js 15, TypeScript, Tailwind, shadcn/ui, Prisma, Cloudinary helpers, Auth.js foundation, GA4 placeholder, and user-approved animation dependencies are documented or installed when needed.

Blockers/open questions: Decide whether `three`, `gsap`, and `lenis` are installed immediately or deferred to the first immersive section.

## 3. Global Rules And Forbidden Patterns

Objective: Encode the product guardrails before building UI.

Source notes to read first: [[Global Rules]], [[Forbidden Patterns]], [[Quality Bar]], [[17_Forbidden_Things]], [[16_Conflicts]].

Files likely to be touched: `AGENTS.md`, `project-vault/`, docs, lint/config if useful.

Acceptance criteria: Executor has clear rules: no ecommerce framing, no desktop-first UI, no V1 accounts/wishlists/quotation/architect portal, no unoptimized images, no undocumented endpoints.

Blockers/open questions: None.

## 4. Design Tokens And Design System

Objective: Create the reusable design foundation for premium, mobile-first pages.

Source notes to read first: [[Visual Style]], [[Typography]], [[Spacing Layout]], [[Components]], [[Interaction Patterns]], [[Responsive Behavior]], [[Accessibility Requirements]], [[Homepage UX Specification]].

Files likely to be touched: `app/globals.css`, `tailwind.config.*`, `components/ui/`, `components/layout/`, `components/sections/`, `components/cta/`.

Acceptance criteria: Container, Section, Heading, CTA, Card, navigation, responsive image patterns, and motion conventions exist. Typography, spacing, and responsive behavior are consistent.

Blockers/open questions: Exact colors and fonts are not specified.

## 5. Database And Schema Foundation

Objective: Implement the documented data model with Prisma and PostgreSQL.

Source notes to read first: [[Database Overview]], all `Database - ...` notes, [[Content Governance]], [[Solution]], [[16_Conflicts]].

Files likely to be touched: `prisma/schema.prisma`, `prisma/migrations/`, `prisma/seed.*`, `lib/db.ts`.

Acceptance criteria: Schema includes V1 tables, constraints, enums, parent brand relationship, junction tables, and indexes. Seed data includes core spaces, categories, brands, and sample content.

Blockers/open questions: Supabase vs Neon, media storage shape, exact product/PDP pricing approach, Solution entity scope.

## 6. Content Model And Taxonomy Foundation

Objective: Seed and normalize content around space-first/category-first discovery.

Source notes to read first: content type notes, [[Space Taxonomy]], [[Hardware Categories]], [[Appliance Categories]], [[Solution Brands]], [[Product Brands]], [[Inspiration Collections]], [[Parent Brand Relationships]].

Files likely to be touched: `prisma/seed.*`, `server/content/`, `features/content/`, admin content forms later.

Acceptance criteria: Spaces, collections, inspirations, brands, product types, categories, and showroom sections follow the official taxonomy. Blaupunkt is a child of Hettich. Wardrobes are Mrida solution content.

Blockers/open questions: Official assets and initial content copy are not complete.

## 7. API And Backend Foundation

Objective: Implement `/api/v1` route handlers and shared response behavior.

Source notes to read first: [[API Overview]], API notes, [[API - Error Format]], [[Backend Stack]], [[Security Auth Rules]].

Files likely to be touched: `app/api/v1/**/route.ts`, `server/`, `lib/api/`, `lib/validation/`.

Acceptance criteria: Public read endpoints and consultation creation follow standard success/error envelopes. Admin endpoints are protected. Server validation exists.

Blockers/open questions: Validation library, notification channel, exact auth configuration, rate limiting strategy.

## 8. Core Layouts And Navigation

Objective: Build the common page shell, navigation, footer, and CTA system.

Source notes to read first: [[Navigation Structure]], [[CTA Hierarchy]], [[Responsive Behavior]], [[Mobile Experience]], [[Forbidden Patterns]].

Files likely to be touched: `app/layout.tsx`, `components/layout/`, `components/navigation/`, `components/footer/`, `components/cta/`.

Acceptance criteria: Navigation reflects IA, CTAs follow priority, mobile navigation is thumb-friendly, WhatsApp access is persistent where appropriate, footer includes required contact/location/navigation/brand links.

Blockers/open questions: Wardrobes nav placement.

## 9. Highest Priority Pages

Objective: Build the pages that define the V1 showroom experience.

Source notes to read first: [[Homepage]], [[Inspiration]], [[Kitchens]], [[Nolte]], [[Mrida]], [[Hardware And Appliances]], [[Brands]], [[Showroom Experience]], [[Contact]], [[Book Consultation]].

Files likely to be touched: `app/page.tsx`, `app/inspiration/**`, `app/kitchens/**`, `app/brands/**`, `app/showroom/**`, `app/contact/**`, `app/book-consultation/**`, `features/**`.

Acceptance criteria: Homepage is complete first, then dynamic content pages. Pages use real data or seeded data, not hardcoded final architecture. Design remains image-first and premium.

Blockers/open questions: Final copy, assets, and product count.

## 10. Main User Flows

Objective: Complete the journeys that generate engagement and leads.

Source notes to read first: all user flow notes, [[API - Consultations]], [[API - WhatsApp Tracking]], [[API - Analytics Events]].

Files likely to be touched: `features/inspirations/`, `features/brands/`, `features/products/`, `features/consultations/`, `features/whatsapp/`, `server/leads/`.

Acceptance criteria: Inspiration, brand, product, consultation, WhatsApp, and showroom visit flows work end to end with source tracking.

Blockers/open questions: Notification channel and WhatsApp number.

## 11. Edge States And Validation

Objective: Add empty, loading, error, invalid input, and permission states.

Source notes to read first: page notes, flow notes, [[API - Error Format]], [[Security Auth Rules]], [[Forbidden Patterns]].

Files likely to be touched: route components, form components, `app/error.tsx`, `app/loading.tsx`, API validation modules.

Acceptance criteria: Forms validate on client and server. APIs return standard errors. Pages handle empty content and failed fetches gracefully.

Blockers/open questions: Validation library.

## 12. QA Against Documentation

Objective: Check implementation against the vault and original source docs.

Source notes to read first: [[00_Index]], [[17_Forbidden_Things]], [[16_Conflicts]], [[15_Open_Questions]], [[Quality Bar]].

Files likely to be touched: tests, docs, bug fixes.

Acceptance criteria: Mobile-first behavior, Lighthouse target path, no forbidden V1 features, no Nolte wardrobe errors, no ecommerce framing, no unoptimized images, no inconsistent API responses.

Blockers/open questions: Lighthouse target requires real assets and deployment-like conditions.

## 13. Deployment Readiness

Objective: Prepare production release.

Source notes to read first: [[Deployment]], [[Performance SEO Security]], [[Asset Management]], [[Authentication]], [[API Overview]].

Files likely to be touched: Vercel config, environment variables, `app/sitemap.ts`, `app/robots.ts`, metadata, Cloudinary config, Auth.js config.

Acceptance criteria: Vercel deployment builds, database connection works, Cloudinary works, admin auth works, SEO metadata exists, sitemap/robots/canonicals exist, analytics events work.

Blockers/open questions: Domain/DNS ownership, Supabase vs Neon, production credentials.

## Source Trace

Derived from `14-project-bootstrap.md`, `10-techincal-architecture.md`, `11-rules.md`, `12-dontdo.md`, `13-master-context.md`, `15-content-taxonomy.md`, and user instructions on 2026-06-10.
