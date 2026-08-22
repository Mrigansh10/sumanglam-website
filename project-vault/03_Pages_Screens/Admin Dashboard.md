# Admin Dashboard

> **ℹ️ See the as-built version.** The shipped admin — including Spaces, Homepage image slots, and delete for leads/consultations — is documented in [[Admin Surface]].

## Purpose

Provide authenticated admin tools for content management, lead visibility, and consultation management.

## User Goal

Admins create and manage inspirations, products, brands, collections, showroom content, leads, and consultations.

## Entry Points

* `/admin` after admin login.

## Exit Points

* Inspiration CRUD.
* Product CRUD.
* Brand CRUD.
* Collection CRUD.
* Showroom CRUD.
* Leads list/detail.
* Consultations list/detail.

## UI Requirements

* Authenticated dashboard layout.
* CRUD surfaces for inspirations, products, brands, collections, showroom sections.
* Lead list with filtering/pagination.
* Lead detail and status update.
* Consultation list/detail.

## UX Behavior

* Practical and data-focused.
* Protect all admin routes.
* Avoid overbuilding roles beyond Admin in V1.

## Content Requirements

Admin forms must support the fields documented in content/database/API notes.

## Data Requirements

* [[Database - inspirations]]
* [[Database - products]]
* [[Database - brands]]
* [[Database - collections]]
* [[Database - showroom_sections]]
* [[Database - leads]]
* [[Database - consultations]]

## API/backend Requirements

* [[API - Admin Content]]
* [[API - Admin Leads]]
* [[API - Consultations]]
* [[Authentication]]

## Auth/permission Rules

Admin authentication required. V1 role: Admin.

## Edge Cases

* Unauthorized access.
* Expired session.
* Invalid form data.
* Attempting to delete published content should archive where documented.
* Lead status outside allowed enum.

## Forbidden Mistakes

* Do not expose admin APIs publicly.
* Do not create undocumented fields/endpoints.
* Do not build non-V1 roles or architect portal.

## Linked Notes

* [[Create Inspiration Admin]]
* [[Create Product Admin]]
* [[Manage Leads Admin]]
* [[API - Admin Content]]
* [[API - Admin Leads]]
* [[Authentication]]

## Source Trace

Source files and sections: `07-screen-event-flows.md`, `09-api-specification.md`, `10-techincal-architecture.md`, `14-project-bootstrap.md`.
