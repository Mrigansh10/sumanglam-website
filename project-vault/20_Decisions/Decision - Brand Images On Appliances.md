# Decision - Brand Images On Appliances

**Date:** 2026-11-18
**Status:** Accepted, temporary ("live as is, changes later")

## Decision

The `/appliances` page mixes our own showroom photos with five lifestyle images taken from the
Bosch and Siemens websites (`media3.bsh-group.com`). Each brand image carries a small
"Image: Siemens" / "Image: Bosch" credit. They live in Cloudinary under `sumanglam/appliances/*`.

## Why

The user felt the first prototype repeated showroom photos already used on Home, Nolte and
Kitchens, and asked for brand-site images instead. The copyright risk was raised and the user
chose to proceed. The "See them in our kitchens" band uses only our own photos, because it
claims what is on our floor.

## Open

* The user wants more Häfele images. hafeleindia.com blocks automated downloads, so they have to
  come from a Häfele rep, a catalogue PDF or a manual save.
* Siemens fridge image used for Cooling; unconfirmed whether Siemens fridges are sold.
* The header image is only 1640px wide and may look soft on large screens.

## Reversible?

Yes. Replace the brand images with own or brand-supplied ones and drop the credits.
