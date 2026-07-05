# MurphyScan Report Format

Use this format unless the user asks for a different shape.

## 1. Verdict

State one of:
- `Ready with minor gaps`
- `Not launch ready`
- `Launch blocked by critical controls`

Include one sentence explaining the decision.

## 2. Blockers

List only issues that can directly threaten:
- user-data isolation
- auth/session safety
- secret exposure
- production deploy safety
- incident recovery
- runaway cost from public or paid endpoints

Each blocker should include:
- layer
- issue
- why it matters
- evidence
- minimum fix

## 3. Missing launch controls

List important controls that are missing but may not be hard blockers yet. Keep these grouped by layer or concept family.

## 4. Scaling and resilience gaps

List issues that will hurt the app under growth, concurrency, or prolonged operation:
- pooling
- caching
- async work
- query/index design
- load testing
- cost routing
- observability depth

## 5. Highest-leverage next actions

Give a short ordered list of the smallest set of actions that would materially improve launch readiness.

## 6. Evidence references

Point to the strongest local evidence:
- files
- configs
- migrations
- policies
- workflow files
- runtime/test outputs if available

## Tone

- Be direct.
- Prioritize risk over style.
- Separate facts from assumptions.
- Say clearly when access gaps limit confidence.
