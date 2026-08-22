---
layer: trap
severity: low
area: tooling
---

# Trap - Stale Dev Build Cache

## The Trap

After large edits — new files, schema changes — a long-running `next dev` server can **404 its
own CSS chunk**. The page renders **completely unstyled**: giant washed-out blocks, no header.
HTML and images still return 200, so it looks like a catastrophic CSS regression.

It isn't. It's the dev cache.

## The Fix

```bash
# stop the dev server
rm -rf .next
npm run dev
# then hard-refresh: Cmd+Shift+R
```

## The Companion

**`npm run build` clobbers a running dev server's `.next`.** If you build while dev is running,
restart dev afterwards or you'll hit the same symptom and think the build broke something.

## Before Debugging Unstyled Pages

Restart dev first. It costs 20 seconds and rules out the most likely cause.

## Linked Notes

* [[Production Deployment]]
* [[Project Bootstrap]]

## Source Trace

`HANDOFF.md` Sessions 6 and 8.
