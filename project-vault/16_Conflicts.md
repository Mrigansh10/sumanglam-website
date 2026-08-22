# Conflicts

> **ℹ️ Several of these are now resolved** by what shipped. See [[Spec Vs Built]].

## Conflict 1: User-approved animation stack vs original approved stack

* Conflicting requirement A: `11-rules.md` says not to introduce technologies not listed in `10-technical-architecture.md`; `12-dontdo.md` forbids unapproved dependencies.
* Conflicting requirement B: The user explicitly wants Three.js, GSAP ScrollTrigger, and Lenis.js in this project.
* Source files: `10-techincal-architecture.md`, `11-rules.md`, `12-dontdo.md`, user instruction on 2026-06-10.
* Practical impact: Claude Code may reject these packages unless the vault records them as approved.
* Suggested resolution: Treat `three`, `gsap`, and `lenis` as a user-approved stack extension, scoped to immersive visuals, scroll-triggered interactions, and smooth scrolling. Keep Framer Motion for normal component-level UI motion unless replaced deliberately.
* Blocks implementation: No, if [[User Approved Stack Extension - Three GSAP Lenis]] is followed.

## Conflict 2: Discovery order differs across docs

* Conflicting requirement A: `01-prd.md` describes Space -> Inspiration -> Brand -> Product -> Consultation.
* Conflicting requirement B: `05-domain-model.md` and `04-design-language.md` describe Space -> Inspiration -> Product -> Brand -> Consultation, while `06-content-model.md` and `13-master-context.md` include Collection before Inspiration.
* Source files: `01-prd.md`, `04-design-language.md`, `05-domain-model.md`, `06-content-model.md`, `13-master-context.md`.
* Practical impact: Navigation, breadcrumbs, internal linking, and page CTAs may branch differently.
* Suggested resolution: Use Space -> Collection -> Inspiration as the browsing spine. From Inspiration detail, support both Brand and Product exploration, then Consultation.
* Blocks implementation: No for scaffolding; yes for final IA/linking details if unresolved.

## Conflict 3: Nolte wardrobe wording in earlier docs vs later correction

* Conflicting requirement A: Earlier PRD wording says solution-brand pages include kitchens and wardrobes.
* Conflicting requirement B: `16-doc-review.md`, `11-rules.md`, and `13-master-context.md` say Nolte is premium German kitchens only and wardrobes belong to Mrida.
* Source files: `01-prd.md`, `11-rules.md`, `13-master-context.md`, `16-doc-review.md`.
* Practical impact: Wrong brand modeling would damage taxonomy, content, and UI trust.
* Suggested resolution: Treat `16-doc-review.md`, `11-rules.md`, and `13-master-context.md` as superseding. Nolte has kitchens only; Mrida has kitchens and wardrobes.
* Blocks implementation: No if superseding rule is followed.

## Conflict 4: Product Detail exact pricing vs price range fields

* Conflicting requirement A: `01-prd.md` says PDPs feature exact pricing.
* Conflicting requirement B: `06-content-model.md` and `08-database-design.md` specify `Price Range` / `price_range`, not exact price fields.
* Source files: `01-prd.md`, `06-content-model.md`, `08-database-design.md`.
* Practical impact: PDP schema and copy may overpromise price precision.
* Suggested resolution: Use `price_range` for V1 unless exact pricing is explicitly confirmed.
* Blocks implementation: Partially for PDP content and schema.

## Conflict 5: Product filters included in flows but advanced filtering excluded from V1

* Conflicting requirement A: `07-screen-event-flows.md` says Product Discovery includes applying filters.
* Conflicting requirement B: `02-information_architecture.md` excludes Advanced Filtering from V1.
* Source files: `02-information_architecture.md`, `07-screen-event-flows.md`, `09-api-specification.md`.
* Practical impact: Product listing could be overbuilt.
* Suggested resolution: V1 may support basic filters documented in API query params: brand, type, category, subcategory. Defer advanced filters such as finish, dimensions, modular compatibility, and mechanisms.
* Blocks implementation: No if basic-only filter scope is used.

## Conflict 6: Wardrobes site map placement vs final brand rule

* Conflicting requirement A: The IA site map includes Wardrobes as a major branch.
* Conflicting requirement B: Later governing docs say wardrobes belong to Mrida and should not be modeled as independent product catalogs.
* Source files: `02-information_architecture.md`, `11-rules.md`, `12-dontdo.md`, `15-content-taxonomy.md`, `16-doc-review.md`.
* Practical impact: Navigation could accidentally imply standalone wardrobe products or Nolte wardrobes.
* Suggested resolution: If Wardrobes is a page, position it as Mrida Wardrobes or a Mrida solution page, not a standalone product catalog.
* Blocks implementation: Yes for final nav and route naming.

## Source Trace

Derived from `01-prd.md`, `02-information_architecture.md`, `04-design-language.md`, `05-domain-model.md`, `06-content-model.md`, `07-screen-event-flows.md`, `08-database-design.md`, `09-api-specification.md`, `10-techincal-architecture.md`, `11-rules.md`, `12-dontdo.md`, `13-master-context.md`, `15-content-taxonomy.md`, `16-doc-review.md`, and user instructions on 2026-06-10.
