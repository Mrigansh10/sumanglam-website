# Database Overview

## Purpose

The database supports inspiration-first discovery, product exploration, brand storytelling, consultation workflows, future wishlist support, and future catalog expansion.

## Philosophy

Optimize for:

* Simplicity.
* Maintainability.
* Future scalability.
* Developer productivity.
* Content management.

Avoid premature scaling.

## Core Tables

* [[Database - spaces]]
* [[Database - collections]]
* [[Database - inspirations]]
* [[Database - brands]]
* [[Database - product_types]]
* [[Database - product_categories]]
* [[Database - product_subcategories]]
* [[Database - products]]
* [[Database - showroom_sections]]
* [[Database - leads]]
* [[Database - consultations]]
* [[Database - junction tables]]
* [[Database - site_settings]]

## Core Query Patterns

Homepage retrieves featured inspirations, brands, products, and showroom highlights.

Inspiration page retrieves inspiration, products used, related brands, and related inspirations.

Brand page retrieves brand information, brand inspirations, and brand products.

Product page retrieves product details, brand, related inspirations, and related products.

Collection page retrieves collection information and collection inspirations.

Consultation creates Lead and Consultation Request, then updates Lead Status later.

## Linked Notes

* [[Database - Index Strategy]]
* [[Database - Status Enums]]
* [[API Overview]]
* [[18_Build_Order]]

## Source Trace

Source file: `08-database-design.md`.
