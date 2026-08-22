# Components

> **ℹ️ See the real inventory.** Shipped components are listed in [[Codebase Map]]; motion primitives in [[Motion System]].

## Required Foundation Components

From project bootstrap:

* Container component.
* Section component.
* Heading component.
* CTA component.
* Card component.

## Component Rules

* Reusable.
* Small.
* Focused.
* Testable.
* Type-safe.
* Consistent with design language.

## Common UI Components

Likely needed:

* Navigation.
* Footer.
* Hero.
* CTA group.
* Visual card.
* Brand card.
* Inspiration card.
* Product card.
* Gallery.
* Form field.
* Status/empty/error state.
* Admin table.
* Admin form.

## Decision Test

Every component should answer:

* Does this increase trust?
* Does this improve clarity?
* Does this support inspiration?

If not, remove it or simplify.

## Forbidden Mistakes

* Do not create duplicate components.
* Do not create page-specific components when reusable versions are appropriate.
* Do not hardcode content that belongs in CMS/database.
* Do not build giant components.

## Linked Notes

* [[Global Rules]]
* [[Quality Bar]]
* [[Project Bootstrap]]

## Source Trace

Source files: `04-design-language.md`, `11-rules.md`, `12-dontdo.md`, `14-project-bootstrap.md`.
