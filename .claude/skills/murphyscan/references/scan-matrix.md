# MurphyScan Matrix

Use this matrix to decide what to inspect and how to classify findings.

## Priority 0 - Launch blockers

### Auth and permissions
- Concepts: `Managed Auth and Session Security.md`, `Authorization and Row-Level Security.md`
- Inspect: auth provider setup, protected routes, session expiry, logout behavior, role checks, RLS or ownership enforcement
- Block when: user A can access user B data, sessions never expire, logout is client-only, service-role paths bypass ownership controls, or auth is custom and clearly underprotected

### API contracts and billing events
- Concepts: `API Contracts and Versioning.md`, `Billing and Usage Events.md`
- Inspect: API schemas, versioning, changelogs, webhook verification, idempotency, billing event handling
- Block when: production-facing APIs change without a stable contract, or payment/webhook flows can create duplicate or unauthenticated side effects

### Secrets and credential hygiene
- Concepts: `Secrets and Credential Rotation.md`, `Client Trust Boundary.md`
- Inspect: committed env files, public env vars, frontend bundles, git history if available, server-side secret use, key scoping
- Block when: secrets are exposed in frontend or repo history and not rotated, or privileged credentials are broadly scoped with no mitigation

### Deployment safety and rollback
- Concepts: `Deployment Safety and Rollbacks.md`, `Staging Environments and Branching.md`
- Inspect: preview or staging deploys, rollback path, release flow, canary or flag controls where relevant
- Block when: code goes straight to production with no review path or rollback path

### Observability and recovery
- Concepts: `Observability and Incident Response.md`
- Inspect: error tracking, logs, uptime checks, backups, restore path, incident runbook
- Block when: the owner cannot detect failures, recover data, or restore service safely

## Priority 1 - Cost and abuse controls

### Rate limits and API gateways
- Concepts: `Rate Limiting and API Gateways.md`, `AI Endpoint Protection.md`
- Inspect: auth endpoint caps, paid API endpoint caps, payload validation, per-user spend controls
- Flag when: public or paid endpoints can be abused cheaply or expensively

### AI cost controls
- Concepts: `AI Cost Controls and Model Routing.md`, `Caching Strategy.md`
- Inspect: semantic cache, model routing, batching, debouncing, billing caps
- Flag when: every request hits the expensive model or repeated work is uncached

### Cloud cost discipline
- Concepts: `Cloud Cost Discipline.md`
- Inspect: provider alerts, hard caps, overprovisioned resources, idle always-on services
- Flag when: one bad loop or moderate traffic can create uncontrolled spend

### AI supply chain trust
- Concepts: `AI Supply Chain Trust.md`
- Inspect: downloaded skill files, copied prompts, shared system instructions, automation trust boundaries
- Flag when: unreviewed external AI artifacts influence production-critical code or deploy paths

## Priority 2 - Scale and quality

### Database design and scaling
- Concepts: `Database Design and Indexing.md`, `Database Scaling and Connection Pooling.md`, `Multi-Tenancy and Tenant Isolation.md`
- Inspect: schema shape, indexes, migrations, pooling, replicas, tenant isolation
- Flag when: obvious scaling cliffs, unbounded queries, or missing ownership fields are visible

### Async work and idempotency
- Concepts: `Async Jobs and Idempotency.md`
- Inspect: long-running routes, exports, report generation, retries, duplicate-request handling
- Flag when: slow work is synchronous or duplicate submission can create duplicate side effects

### AI output quality
- Concepts: `AI Output Validation and Evals.md`
- Inspect: schema validation, retries with feedback, fallbacks, evals, canary quality gates
- Flag when: raw model output is shown or persisted without guardrails

### Load testing and scaling cliffs
- Concepts: `Load Testing and Scaling Cliffs.md`, `Caching Strategy.md`
- Inspect: evidence of first-traffic testing, bottlenecks, queue use, cache use
- Flag when: scaling assumptions are untested and obvious bottlenecks are present

## Priority 3 - Product edge checks

### Billing and usage events
- Concepts: `Billing and Usage Events.md`
- Inspect: pricing metric, Stripe or equivalent setup, billable event stream

### Mobile deep links
- Concepts: `Mobile Deep Links and App Links.md`
- Inspect: app links, universal links, website fallback

### Legal and compliance basics
- Concepts: `Legal and Compliance Basics.md`
- Inspect: privacy policy, terms, deletion path, enterprise evidence if relevant
