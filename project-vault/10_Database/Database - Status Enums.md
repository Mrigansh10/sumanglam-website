# Database - Status Enums

> **⚠️ Shape warning.** Supabase REST returns these enums **lowercase**, not in the uppercase Prisma form. See [[Trap - REST Shape Dates And Enums]].

## Lead Status Values

Allowed values:

* `new`
* `contacted`
* `qualified`
* `converted`
* `closed`

Admin UI labels:

* New.
* Contacted.
* Qualified.
* Converted.
* Closed.

## Availability Status Values

Allowed values:

* `available`
* `limited`
* `discontinued`
* `coming_soon`

## Content Status Values

Content governance says every content item should support:

* Draft.
* Published.
* Archived.

This is not consistently reflected in the database table list and should be addressed during schema design.

## Open Questions

* Consultation status allowed values are not specified.
* Content status fields are required by content model but absent from several database table definitions.

## Linked Notes

* [[Database - leads]]
* [[Database - products]]
* [[Content Governance]]
* [[15_Open_Questions]]

## Source Trace

Source files: `06-content-model.md`, `08-database-design.md`, `09-api-specification.md`.
