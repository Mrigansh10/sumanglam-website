# Decision - Hardware Catalogue Ask For Price

**Date:** 2026-11-18
**Status:** Accepted. Supersedes the catalogue pause in [[Decision - Release Focus Over Catalog Depth]] and [[Decision - Product Catalog Unpublished]].

## Decision

Hardware is a browsable catalogue again: `/hardware`, `/hardware/[category]`, `/products/[slug]`, starting with 20 Yale smart locks.

* **No prices on the site.** Every product says "Ask for price on WhatsApp". MRP stays in `price_range` but is not rendered, and ₹ values inside specs are stripped.
* **One image per product.** A cut-out of the brand's official studio photo on a soft tile, so every product looks the same and nothing drifts over later imports.
* **Brands added one at a time** from catalogues or price lists the user supplies; Yale's remaining categories come from the 2026 price list PDF.

## Why

Most hardware customers, carpenters included, shop by product code. The user asked for the catalogue back, "in the most polished way possible". Prices change with brand lists, so they are confirmed per order.

## Reversible?

Yes. Set products back to `draft` to hide them; the pages handle empty categories.
