---
layer: trap
severity: high
area: react
---

# Trap - Unmounting A Server Action Form

## The Trap

If a confirm button both **submits a server-action form** and **closes the dialog** in the same
click, and the form lives inside `{open ? … : null}`, closing **unmounts the form and cancels
the submission before React dispatches it.**

The delete silently does nothing. No error, no console warning — the row just stays.

## How It Showed Up

Shipped in `b3d2315` (admin delete for leads and consultations), found and fixed the same
session in `2554f0e`.

## The Fix

Wrap the action so it **awaits first and closes after**, and add a `pending` state:

```tsx
async function handleAction(formData: FormData) {
  setPending(true);
  await action(formData);   // await BEFORE closing
  setOpen(false);
}
```

`pending` disables both buttons and shows "Deleting…". The pattern lives in
`components/admin/delete-confirm-form.tsx` — reuse it rather than rebuilding it.

## The Rule

**Never unmount a server-action form in the same click that submits it. Await first, close
after.**

## Why Not `window.confirm()`

It can't be styled and it blocks the event loop. The in-page dialog is deliberate: Escape to
close, backdrop click, Confirm focused on open.

## Linked Notes

* [[Admin Surface]]
* [[Manage Leads Admin]]

## Source Trace

`HANDOFF.md` Session 14; `components/admin/delete-confirm-form.tsx`.
