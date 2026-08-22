---
layer: trap
severity: high
area: motion
---

# Trap - Fixed Elements Inside Template

## The Trap

`app/(site)/template.tsx` wraps every page in a `motion.div` that animates `y`. **An ancestor
with a transform re-anchors `position: fixed` descendants** to that element instead of the
viewport.

Put the header, footer, or the floating WhatsApp button inside the template and they stop being
fixed — they drift with the page transition and mis-position on every navigation.

## The Rule

**Fixed elements live in `app/(site)/layout.tsx`, outside the template.** The header
(`fixed left-12 right-12 top-3 z-50`), the footer, and `features/whatsapp/floating-whatsapp.tsx`
are all there on purpose. The comment block in `template.tsx` says so — leave it.

## Related Constraints In The Same File

* The transition is **enter-only**. Real exit animations on the App Router need the fragile
  "frozen router" hack and break scroll restoration. Don't add them.
* `searchParams`-only changes don't remount the template, so filter and pagination browsing
  doesn't replay the fade. That's intended.
* `useReducedMotion()` short-circuits the whole thing.

## Linked Notes

* [[Motion System]]
* [[Codebase Map]]
* [[Trap - Parallax And Ken Burns Transform Conflict]]

## Source Trace

`HANDOFF.md` Session 8; `app/(site)/template.tsx`.
