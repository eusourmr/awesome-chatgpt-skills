# Public Roadmap

This roadmap is directional, public, and deliberately measurable. Dates may change when platform APIs, security requirements, or evidence change.

See [`docs/ECOSYSTEM_GROWTH_STRATEGY.md`](docs/ECOSYSTEM_GROWTH_STRATEGY.md) for the competitive/growth rationale behind the sequencing below.

## Current position

The project has completed the first distribution milestone: a versioned npm CLI, curated bundles, machine-readable catalog metadata, validation workflows, and public provenance rules.

The next goal is **not catalog size alone**. OpenAI already provides first-party Plugin and Skills discovery surfaces, while generic Agent Skills installers already serve broad multi-agent distribution. ChatGPT Skills should therefore differentiate as an independent trust, evidence, compatibility, execution, and composition layer.

The project may scale discovery broadly while keeping trust claims narrow: `indexed`, `source-checked`, `tested`, and `recommended` must remain distinct states.

## v0.4 — Trust Layer

Build the evidence model that makes the catalog useful before it becomes large.

### Deliverables

- Adopt `docs/TRUST_MODEL.md` as the catalog's trust contract.
- Correct platform targets so "install" means a path the target actually discovers; use explicit export/upload-preparation semantics where direct installation is not available.
- Extend catalog metadata with provenance, immutable reviewed reference, integrity/hash, permissions, side effects, evidence states, recommendation state, and verification timestamps.
- Model external app/tool/gateway dependencies separately from the skill itself: authentication, scopes, data destinations, read/write/destructive actions, approval behavior, and provider type.
- Add deterministic security admission checks for bundled skills: suspicious instructions, secret access, network/process execution, remote downloads, obfuscation, lifecycle hooks, and description-versus-behavior review prompts.
- Add `chatgpt-skills doctor` for the local installation: validate config, installed files, expected hashes/version, missing files, unsupported target, stale metadata, and actionable remediation.
- Add `chatgpt-skills inspect <skill>` for bundled/catalog skills, showing plain-language purpose, provenance, permissions, compatibility evidence, warnings, and unknowns.
- Pin every bundled artifact to the package version and record verifiable content hashes.
- Add at least one reproducible smoke/behavior test per bundled skill or explicitly mark the evidence gap.

**Exit criteria:** every bundled skill has an evidence card; platform install/export semantics are honest; `doctor` detects corrupted/incomplete installs; `inspect` explains trust without an opaque score; CI blocks a deliberately unsafe fixture.

## v0.5 — Useful Service & Chat-Native Execution

Turn the trust data into a discovery service focused on user jobs, while proving the shortest reliable path from a skill to useful execution inside ChatGPT.

### Deliverables

- Adopt `docs/EXECUTION_MODEL.md` and classify every bundled skill as `chat-native`, `native-tools`, `connected`, or `local-agent`, with an explicit evidence state.
- Prove at least one `chat-native` skill end-to-end using the native ChatGPT Skills flow: create/upload or install, activate automatically or by `@`, complete the job in the same chat, and record the evidence without claiming broader availability than was tested.
- Keep **Chat-Native First** as the default architecture: use ChatGPT itself first, then a focused skill, then native tools, and add external apps/MCP/API only when the job truly requires them.
- Generate a static/searchable web catalog from the same source of truth as the CLI.
- Search by problem to solve, not only skill name or category.
- Show trust/evidence cards, execution mode, last verification, permissions, compatibility, external app dependencies, and known limitations on every result.
- Add outcome-oriented bundle recommendations: describe the job, get the smallest useful set of skills.
- Detect overlapping or potentially conflicting skills in a bundle.
- Provide machine-readable JSON endpoints/artifacts so other tools can consume the catalog without scraping the website.
- Add deprecation, supersession, and replacement relationships.
- Build an ingestion pipeline that can index existing `SKILL.md` repositories and plugin metadata into review candidates without automatically granting verification or silently converting packaging semantics.
- Grow toward **100 useful indexed entries** across high-value jobs while reporting how many are source-checked, tested, recommended, or stale.
- Add one narrow app-backed reference workflow and compare at least one optional third-party provider (for example Composio) against the relevant OpenAI-native app/plugin path where comparable.
- Publish three reproducible case studies before broad promotional campaigns.

**Exit criteria:** a user can go from a plain-language job to a small evidence-backed recommendation, understand whether the workflow stays inside ChatGPT or needs another execution surface, inspect the trade-offs before installation/export, and distinguish broad discovery coverage from independently tested trust evidence. At least one chat-native workflow has recorded end-to-end ChatGPT execution evidence.

## v0.6 — Continuous Verification

Make trust decay visible instead of treating verification as permanent.

### Deliverables

- Scheduled upstream-change detection for reviewed sources.
- Mark reviewed hashes stale when upstream artifacts change.
- Re-run compatibility/security checks after material source changes.
- Publish review diffs: what changed since the last accepted version.
- Add maintainer/reviewer attribution and conflict-of-interest metadata.
- Add an auditable public review log, including accepted, conditional, duplicate, unsafe, and out-of-scope outcomes.
- Track evidence freshness and verification lag as first-class service-health metrics.

**Exit criteria:** a previously reviewed skill cannot silently change while retaining the same project trust state.

## Later — Community, Internationalization & Recognition

Community recognition and marketplace-like features are deliberately deferred until the trust layer has real usage and review history.

Potential later work:

- an Evidence Maintainers / Curators program that rewards durable review and freshness rather than submission volume;
- public reviewer program;
- signed maintainer/provenance metadata;
- community collections and bundles;
- contribution recognition based on durable value, not paid placement or popularity;
- localized catalog metadata/UI beyond English and Brazilian Portuguese, beginning with languages that have active maintainers and usage.

Do **not** launch an "Awarded Skills" program before there is enough external evidence to make the award meaningful. Do **not** optimize for a large marketplace while the project cannot continuously explain why an item should be trusted.

## Explicit non-goals

- Do not build a proprietary "ChatGPT Actions Gateway" while OpenAI's Apps SDK/Plugins and MCP already provide the relevant action/integration primitives.
- Do not automatically transform every plugin into a repository-owned skill; preserve source packaging, provenance, license, and semantics.
- Do not use "five skills per category", star count, or raw submission volume as quality KPIs.
- Do not make a single third-party gateway a required trust dependency; integrations should be optional adapters with explicit evidence and permissions.

## Product principles

1. **Trust before scale.** A larger catalog is not automatically a better catalog.
2. **Scale discovery, not trust claims.** Broad indexing is compatible with narrow, evidence-backed recommendation.
3. **Evidence before labels.** Show why a recommendation exists.
4. **Jobs before categories.** Users arrive with outcomes, not taxonomy.
5. **Smallest useful bundle.** More skills increase context, permissions, conflict, and maintenance cost.
6. **Immutable when installed.** Prefer versioned, hashed artifacts over mutable remote content.
7. **Plain language with technical depth available.** A non-specialist should understand the risk; an expert should be able to inspect the evidence.
8. **Independent, not adversarial.** Complement OpenAI's Plugin/Skills directory rather than pretending to replace or represent it.
9. **Open standards before proprietary gateways.** Prefer MCP, Agent Skills, existing app/plugin mechanisms, and thin adapters over new protocols.
10. **No paid trust.** Sponsorship, if ever introduced, must never buy ranking, verification, or a positive recommendation.
11. **Regenerative by design.** Repository-authored regenerative skills retain the stronger multi-lens systemic standard and should create more reusable capability than the resources they consume.
12. **Chat-Native First.** Prefer workflows that become useful after loading a skill and stay in the same chat; add infrastructure only when it creates necessary capability.
