---
layer: trap
severity: high
area: deployment
---

# Trap - Vercel Env Quotes And Redeploy

## The Trap

"I changed the admin password in Vercel and now I can't log in." There are **five** independent
causes and they compound.

## The Checklist, In Order

1. **Vercel env changes need a redeploy.** Saving the variable does nothing to the running
   deployment.
2. **Variables must be scoped to Production.** A Preview-only variable silently isn't there.
3. **Vercel does NOT strip quotes the way dotenv does.** Paste raw values — no surrounding
   quotes. `"hunter2"` becomes a password with quote characters in it.
4. **Login is rate-limited 5 attempts / 15 min / IP** (`auth.ts:38`). Once tripped, it rejects
   **even correct credentials**. Wait 15 minutes.
5. **Browser autofill** re-inserting the old email or password.

## Why This Is Especially Sharp Here

Admin auth is **env-var only — there is no user record in the database.** `auth.ts` compares
directly against `ADMIN_EMAIL` / `ADMIN_PASSWORD`, so local `.env` and Vercel env must both
match, and only a redeploy makes Vercel's copy live.

## Testing Tip

When verifying a credential rotation on production, test from a **different IP** so you don't
burn the user's rate-limit window.

## Linked Notes

* [[Security Posture]]
* [[Production Deployment]]
* [[Authentication]]

## Source Trace

`HANDOFF.md` Session 13; `auth.ts`.
