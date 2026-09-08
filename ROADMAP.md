# Public Roadmap

This roadmap is directional, public, and deliberately measurable. Dates may change when platform APIs, security requirements, or evidence change.

## Current position

The project has completed the first distribution milestone: a versioned npm CLI, curated bundles, machine-readable catalog metadata, validation workflows, and public provenance rules.

The next goal is **not catalog size**. OpenAI already provides first-party Plugin and Skills discovery surfaces, while generic Agent Skills installers already serve broad multi-agent distribution. ChatGPT Skills should therefore differentiate as an independent trust, evidence, compatibility, and composition layer.

## v0.4 — Trust Layer

Build the evidence model that makes the catalog useful before it becomes large.

### Deliverables

- Adopt `docs/TRUST_MODEL.md` as the catalog's trust contract.
- Extend catalog metadata with provenance, immutable reviewed reference, integrity/hash, permissions, side effects, evidence states, recommendation state, and verification timestamps.
- Add deterministic security admission checks for bundled skills: suspicious instructions, secret access, network/process execution, remote downloads, obfuscation, lifecycle hooks, and description-versus-behavior review prompts.
- Add `chatgpt-skills doctor` for the local installation: validate config, installed files, expected hashes/version, missing files, unsupported target, stale metadata, and actionable remediation.
- Add `chatgpt-skills inspect <skill>` for bundled/catalog skills, showing plain-language purpose, provenance, permissions, compatibility evidence, warnings, and unknowns.
- Pin every bundled artifact to the package version and record verifiable content hashes.
- Add at least one reproducible smoke/behavior test per bundled skill or explicitly mark the evidence gap.

**Exit criteria:** every bundled skill has an evidence card; `doctor` detects corrupted/incomplete installs; `inspect` explains trust without an opaque score; CI blocks a deliberately unsafe fixture.

## v0.5 — Useful Service

Turn the trust data into a discovery service focused on user jobs rather than repository browsing.

### Deliverables

- Generate a static/searchable web catalog from the same source of truth as the CLI.
- Search by problem to solve, not only skill name or category.
- Show trust/evidence cards, last verification, permissions, compatibility, and known limitations on every result.
- Add outcome-oriented bundle recommendations: describe the job, get the smallest useful set of skills.
- Detect overlapping or potentially conflicting skills in a bundle.
- Provide machine-readable JSON endpoints/artifacts so other tools can consume the catalog without scraping the website.
- Add deprecation, supersession, and replacement relationships.

**Exit criteria:** a user can go from a plain-language job to a small evidence-backed recommendation and inspect the trade-offs before installation.

## v0.6 — Continuous Verification

Make trust decay visible instead of treating verification as permanent.

### Deliverables

- Scheduled upstream-change detection for reviewed sources.
- Mark reviewed hashes stale when upstream artifacts change.
- Re-run compatibility/security checks after material source changes.
- Publish review diffs: what changed since the last accepted version.
- Add maintainer/reviewer attribution and conflict-of-interest metadata.
- Add an auditable public review log, including accepted, conditional, duplicate, unsafe, and out-of-scope outcomes.

**Exit criteria:** a previously reviewed skill cannot silently change while retaining the same project trust state.

## Later — Community & Recognition

Community recognition and marketplace-like features are deliberately deferred until the trust layer has real usage and review history.

Potential later work:

- community nominations and evidence-backed recognition;
- public reviewer program;
- signed maintainer/provenance metadata;
- community collections and bundles;
- contribution recognition based on durable value, not paid placement or popularity.

Do **not** launch an "Awarded Skills" program before there is enough external evidence to make the award meaningful. Do **not** optimize for a large marketplace while the project cannot continuously explain why an item should be trusted.

## Product principles

1. **Trust before scale.** A larger catalog is not automatically a better catalog.
2. **Evidence before labels.** Show why a recommendation exists.
3. **Jobs before categories.** Users arrive with outcomes, not taxonomy.
4. **Smallest useful bundle.** More skills increase context, permissions, conflict, and maintenance cost.
5. **Immutable when installed.** Prefer versioned, hashed artifacts over mutable remote content.
6. **Plain language with technical depth available.** A non-specialist should understand the risk; an expert should be able to inspect the evidence.
7. **Independent, not adversarial.** Complement OpenAI's Plugin/Skills directory rather than pretending to replace or represent it.
8. **No paid trust.** Sponsorship, if ever introduced, must never buy ranking, verification, or a positive recommendation.
9. **Regenerative by design.** Repository-authored regenerative skills retain the stronger multi-lens systemic standard and should create more reusable capability than the resources they consume.
