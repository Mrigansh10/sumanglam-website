---
layer: trap
severity: high
area: data
---

# Trap - Joined Selects Must Fetch Rendered Fields

## The Trap

A Supabase REST `.select()` with a join returns **only the fields you name**. If a component
renders a field the select didn't fetch, you get `undefined` — and depending on what you do with
it, a 500.

The nasty part: **it is unreachable until the first row exists.** An empty table hides the bug
completely.

## How It Showed Up

The admin leads page 500'd (`8192c3e`) the moment the **first consultation was ever saved**. The
list join fetched the lead's consultations but never selected `project_type`, which the page
rendered.

## The Fix

When writing or editing a joined select, **read the component first** and name every field it
touches. Also note that supabase-js types to-one joins as **arrays**; the codebase bridges this
with `as unknown as` casts.

## The Wider Lesson

Empty tables hide bugs. `reviews` and `leads` are both at **0 rows** right now — any code path
that reads them is effectively untested. See [[Data Access Layer]].

## Linked Notes

* [[Data Access Layer]]
* [[Manage Leads Admin]]
* [[Trap - No DB Defaults On Insert]]

## Source Trace

`HANDOFF.md` Session 11; `server/admin.ts`.
