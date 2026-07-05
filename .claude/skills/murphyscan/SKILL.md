---
name: murphyscan
description: Launch-readiness and scaling-readiness audit for software projects. Use when the user asks to scan a repo, database, deployment setup, CI/CD pipeline, AI app, or adjacent system for production blockers, missing launch controls, security gaps, operational gaps, or scaling risks. Use for requests like "scan this app for launch readiness", "what is missing before launch", "is this production ready", "what do I need for scale", or explicit `/murphyscan` invocations.
---

# MurphyScan

Run a production-readiness audit using the Murphy vault as the rulebook. Treat this skill as a verification workflow, not a rewrite workflow.

## Workflow

### 1. Build the scan surface

Inspect the project before making claims. Prefer repo evidence over assumptions.

Start with the highest-signal surfaces that exist:
- application code
- auth and permission code paths
- API routes and external provider wrappers
- public API schemas, webhook handlers, and changelog/version surfaces when they exist
- database schema, migrations, policies, and connection config
- deployment config and environment handling
- CI/CD workflows, branch protections when visible, and test gates
- monitoring, logging, uptime, backup, and restore surfaces
- AI-specific routing, eval, validation, spend controls, and instruction/skill trust surfaces when the app uses AI

If the workspace contains the Murphy vault, use these notes first:
- `00-Start/Layer Map.md`
- `00-Start/Agent Knowledge Map.md`
- `04-MurphyScan/Scan Rule Backlog.md`

Read only the relevant concept notes after repo discovery. Do not load the whole vault if a smaller subset answers the question.

### 2. Map findings to the 13 layers

Evaluate the project against the production layers in `01-Layers/`. Use the matching concept notes in `02-Concepts/` to avoid repeating or diluting checks.

Use the rule priorities from `04-MurphyScan/Scan Rule Backlog.md`:
- Priority 0: launch blockers
- Priority 1: cost and abuse controls
- Priority 2: scale and quality
- Priority 3: product edge checks

When a layer does not apply, say why briefly instead of forcing a finding.

### 3. Require evidence, not tool presence

Do not treat installed tools or config stubs as proof. Verify the control is actually wired.

Examples:
- A monitoring SDK import is not proof of alerting.
- A migration folder is not proof of database safety.
- A CI file is not proof of blocking gates.
- A provider name in docs is not proof of auth/session correctness.

Prefer concrete evidence:
- file references
- config values
- route behavior
- policy definitions
- test or validation outputs
- observable gaps in code paths

### 4. Separate launch blockers from scale gaps

Keep two distinct questions separate:
- what blocks a safe launch now
- what is not required for launch but should be added for scale, resilience, or cost control

Use strict language for blockers. A blocker is something that can cause user-data exposure, broken deploys, silent failures, runaway cost, or an unrecoverable incident path.

### 5. Produce a decision-oriented report

Use the report format in `.claude/skills/murphyscan/references/report-format.md` when available.

Default output shape:
1. readiness verdict
2. blockers
3. missing launch controls
4. scaling and resilience gaps
5. highest-leverage next actions
6. evidence references

Keep the report compact. Group by production layer or control family, not by file inventory.

## Default scan behavior

When the user only says `/murphyscan`, run a standard scan:
- auth and authorization
- secrets and env handling
- deploy and rollback safety
- monitoring and incident recovery
- rate limits and expensive endpoint controls
- database safety and ownership boundaries
- CI/CD and test gates
- scaling risks that are already visible from architecture

When the user asks for a faster pass, bias toward Priority 0 and Priority 1 checks.

When the user asks for a deeper pass, add:
- dependency and secret scanning
- bundle/client exposure review
- database and query-path inspection
- API contract, webhook, and versioning review
- AI eval and output-validation review
- AI prompt, skill, and automation trust review where relevant
- load-test or scaling-surface review if local evidence exists

## Working rules

- Do not rewrite the app unless the user asks for fixes after the scan.
- Do not invent product policy decisions or compliance claims.
- Do not hide uncertainty. If a conclusion depends on unavailable runtime or database access, say so directly.
- Prefer launch-risk findings over stylistic commentary.
- If no serious issues are found, say that clearly and call out residual test or runtime gaps.

## References

- Scan matrix: `.claude/skills/murphyscan/references/scan-matrix.md`
- Report shape: `.claude/skills/murphyscan/references/report-format.md`
