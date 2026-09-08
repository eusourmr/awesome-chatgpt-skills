# ChatGPT Skills Trust Model

The project should not tell users that a skill is "safe" based on a single opaque score. Agent skills can contain instructions, scripts, dependencies, network access, secret requirements, and side effects. Trust must therefore be expressed as inspectable evidence.

## Product question

For any skill, the service should help a user answer:

> What does this skill do, where did it come from, what can it access or change, what evidence supports its compatibility, how recently was it checked, and what remains unknown?

## Trust dimensions

Every reviewed skill should eventually expose the following dimensions.

### 1. Provenance

- canonical source
- publisher / maintainer
- license
- immutable version, commit, or release reference when available
- source ownership evidence

### 2. Integrity

- content hash for reviewed artifacts
- reviewed version or commit
- whether the install source is pinned or mutable
- whether the current source still matches the reviewed artifact

### 3. Permissions & side effects

- local files read or written
- network destinations or external services
- secrets or credentials required
- commands or scripts executed
- destructive or irreversible actions
- user confirmation points

### 4. Security review

Checks should cover both instruction and execution surfaces:

- prompt-injection and behavioral-manipulation patterns
- secret harvesting and data exfiltration
- obfuscation / homoglyphs / hidden instructions
- unsafe shell or process execution
- dependency and remote-download risks
- lifecycle hooks and developer-tool execution
- description-versus-behavior mismatch

Automated findings are evidence, not a final guarantee. High-impact findings require human review before a positive recommendation.

### 5. Compatibility

Compatibility is not a marketing claim. Record:

- supported surface: ChatGPT, Codex, Agents SDK, Cursor, or other declared targets
- evidence type: source declaration, structural validation, smoke test, or end-to-end test
- test date and environment
- known limitations

### 6. Maintenance

- last upstream activity when observable
- last project verification
- deprecation status
- unresolved compatibility or security concerns

### 7. Usefulness evidence

Do not substitute stars or popularity for utility. Useful evidence can include:

- repeatable example task
- expected output or acceptance criteria
- automated test / fixture
- successful review records
- real user reports with context

### 8. Systemic impact

For repository-authored regenerative skills, keep the stronger five-lens standard: human, social, knowledge, resources, and ecology. For third-party catalog entries this dimension is descriptive unless the skill explicitly seeks regenerative verification.

## Evidence states

Use small, comprehensible states instead of a synthetic 0–100 trust score:

- `unknown` — no evidence collected yet
- `declared` — claimed by the source or maintainer, not independently checked
- `inspected` — artifact/source manually or mechanically inspected
- `tested` — behavior or compatibility exercised in a reproducible test
- `verified` — evidence meets the project gate for that dimension
- `warning` — material concern exists but may be acceptable in a constrained context
- `blocked` — evidence indicates the project should not recommend installation

A skill can be `verified` for provenance and still have `warning` for permissions. The service must preserve that nuance.

## Recommendation states

The user-facing recommendation should be derived from evidence and remain explainable:

- `recommended` — required evidence is current and no material unresolved warning exists
- `conditional` — usable only with stated constraints, permissions, or unresolved evidence
- `unverified` — insufficient evidence to recommend
- `do-not-install` — known security, integrity, provenance, or behavior issue makes installation inadvisable
- `deprecated` — superseded or no longer maintained/compatible

Never equate `recommended` with a guarantee of safety.

## Minimum evidence for a bundled installable skill

A skill bundled by `chatgpt-skills` should have, at minimum:

1. canonical provenance and license;
2. reviewed immutable artifact reference or package-version snapshot;
3. declared permission / side-effect footprint;
4. automated static checks for obvious dangerous patterns;
5. structural validation of `SKILL.md`;
6. at least one reproducible compatibility or behavior smoke test;
7. verification date and expiry/staleness rule;
8. a human-governed final admission decision.

## Install-time principle

The installer should prefer immutable, versioned content and should be able to explain what it is about to install. Future external-source installation must not silently follow a mutable `main`, `latest`, branch, or remote script without showing the resulting integrity and trust implications.

## What this model deliberately avoids

- paid ranking
- popularity-as-quality
- invented reviews
- permanent "safe" badges
- a single opaque trust score
- claims of OpenAI endorsement
- treating an upstream repository location as proof of authorship

The goal is not to become another marketplace. The goal is to make skill adoption more legible, auditable, and reversible.
