# Kitchens

> **⚠️ Scope changed.** `/kitchens` now **also hosts the Appliances section**. See [[Decision - Kitchen First Navigation]].

## Purpose

Present kitchen-focused solutions, including Nolte, Mrida, kitchen inspirations, design philosophy, and consultation paths.

## User Goal

Understand Sumanglam's kitchen offerings and decide whether to explore Nolte, Mrida, inspirations, or book a consultation.

## Entry Points

* Main navigation.
* Homepage Explore Spaces card.
* Inspiration links.
* Brand links.

## Exit Points

* [[Nolte]]
* [[Mrida]]
* Kitchen inspiration details.
* [[Book Consultation]]
* [[Showroom Experience]]

## UI Requirements

* Kitchen solution overview.
* Nolte section.
* Mrida section.
* Kitchen inspiration section.
* Design philosophy section.
* Consultation CTA.

## UX Behavior

* Lead with aspiration and solutions, not SKU listings.
* Clarify that Nolte is premium German kitchens.
* Clarify that Mrida includes modular kitchens and wardrobes/customized interior solutions.

## Content Requirements

* Kitchen imagery.
* Nolte story and philosophy.
* Mrida story and customization.
* Kitchen collections such as German Kitchens, Modern Kitchens, Luxury Kitchens, Minimal Kitchens, Warm Contemporary Kitchens, Smart Storage Kitchens.

## Data Requirements

* [[Database - brands]]
* [[Database - collections]]
* [[Database - inspirations]]
* [[Database - showroom_sections]]

## API/backend Requirements

* [[API - Brands]]
* [[API - Collections]]
* [[API - Inspirations]]
* [[API - Consultations]]

## Auth/permission Rules

Public page.

## Edge Cases

* Missing Nolte or Mrida brand content.
* No featured kitchen inspirations.
* Ambiguous wardrobe references.

## Forbidden Mistakes

* Do not imply Nolte sells wardrobes.
* Do not make kitchens a product catalog first.
* Do not use generic hardware-shop framing.

## Linked Notes

* [[Nolte]]
* [[Mrida]]
* [[Solution Brands]]
* [[Kitchen Journey]]
* [[Consultation Booking]]

## Source Trace

Source files and sections: `01-prd.md`, `02-information_architecture.md` Kitchens, `13-master-context.md`, `15-content-taxonomy.md`, `16-doc-review.md`.
