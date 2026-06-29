# Homepage UX Specification

## Purpose

The homepage is the primary entry point into the Sumanglam ecosystem. It should inspire visitors, build trust, introduce Sumanglam, encourage exploration, drive showroom visits, and generate consultation requests.

## Audience

Primary: homeowners planning new homes, renovations, modular kitchens, wardrobes, and interior upgrades.

Secondary: architects, interior designers, and builders.

Tertiary: product researchers looking for hardware, appliances, and premium brands.

## Emotional Goals

Visitors should feel:

* Luxury.
* Trust.
* Warmth.
* Modernity.
* Customization.
* Expertise.

The page should communicate: Sumanglam can help bring a dream home to life.

It should not communicate: Sumanglam is a hardware shop.

## Required Sections

1. Hero Section.
2. Explore Your Journey.
3. Featured Inspirations.
4. Featured Brands.
5. Why Sumanglam.
6. Showroom Experience.
7. Consultation.
8. Footer.

## Hero Requirements

* Full viewport height.
* Single premium image or slow-moving cinematic visual.
* Minimal copy.
* Maximum whitespace.
* Primary CTA and secondary CTA.
* Very subtle animation only.

## Managed Imagery

The hero banner and the three "Explore Your Journey" category card images
(Kitchens, Wardrobes, Hardware) are admin-managed via the **Homepage** admin page,
stored in [[Database - site_settings]]. They fall back to built-in defaults when
unset. See [[Implementation Decisions]].

## Interaction Requirements

* Desktop visual cards may have hover effects.
* Mobile cards use simple tap behavior.
* Motion should be subtle: fade, slide, reveal, gentle parallax.
* No aggressive motion or excessive animation chains.

## Mobile Requirements

* Large imagery.
* Minimal text.
* Fast loading.
* Thumb-friendly navigation.
* Persistent WhatsApp access.
* Clear CTA visibility.
* No zoom needed.

## Desktop Requirements

* Aggressive use of whitespace.
* Large imagery.
* Editorial layouts.
* Sophisticated scrolling.
* Never overcrowd sections.

## Linked Notes

* [[Homepage]]
* [[CTA System]]
* [[Mobile Experience]]
* [[Visual Style]]
* [[Interaction Patterns]]

## Source Trace

Source file: `03-ui-ux-specification.md`.
