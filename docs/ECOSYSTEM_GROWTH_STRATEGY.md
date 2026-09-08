# Ecosystem & Growth Strategy

This document records how ChatGPT Skills should learn from large Agent Skills catalogs without turning catalog size, stars, or vendor integrations into proxies for trust.

## Competitive baseline — 2026-09-08

The largest directly relevant community benchmark is `ComposioHQ/awesome-claude-skills`.

- It describes itself as a curated list of 1,000+ production-ready/practical skills and plugins.
- It has strong community distribution and network effects.
- Its app-action story is materially powered by Composio's MCP/tooling infrastructure rather than by the skill format alone.
- Composio itself provides 1,000+ toolkits and an MCP gateway with authentication/tool execution capabilities.

This is useful evidence about distribution and user demand. It is not a reason to copy the same architecture or equate every listed item with independently verified behavior.

OpenAI's current ecosystem also matters: Plugins are a primary discovery surface across ChatGPT and Codex, plugins can package skills and connected apps, apps provide access to external data/actions, and the Apps SDK is based on MCP. ChatGPT Skills should complement those first-party surfaces rather than build a parallel proprietary action protocol.

## Strategic position

ChatGPT Skills should become an independent layer for:

1. **Discovery** — find capabilities by job-to-be-done.
2. **Inspection** — explain provenance, permissions, dependencies, security evidence, compatibility, and unknowns.
3. **Composition** — recommend the smallest useful set of compatible capabilities.
4. **Verification** — tie trust statements to immutable artifacts and reproducible evidence.
5. **Monitoring** — show when upstream changes invalidate or stale previous evidence.

The project may index broadly, but it should recommend narrowly.

## Scale model: four different numbers

Do not publish one undifferentiated "skill count" as the main success metric. Track separate states:

- `indexed` — discoverable metadata exists; no independent quality claim.
- `source-checked` — canonical source, publisher, license, and basic structure were inspected.
- `tested` — at least one reproducible compatibility or behavior test passed against an immutable reference.
- `recommended` — the current trust model's required evidence is satisfied with no material unresolved warning.

A future goal such as **100 indexed entries** is reasonable as a coverage target. It must never be reported as "100 verified skills" unless all 100 genuinely meet the verification gate.

### Coverage targets

For the next growth milestone:

- reach 100 useful indexed entries across high-value jobs;
- maintain explicit evidence state for every indexed entry;
- increase the tested/recommended subset only as review capacity permits;
- report evidence coverage percentages, not only total count;
- measure stale evidence separately from current evidence.

## Import, do not blindly convert

Automated ingestion is valuable; automatic semantic conversion is dangerous.

Build importers that can:

- discover Agent Skills repositories and existing `SKILL.md` artifacts;
- normalize metadata into the catalog schema;
- record canonical source, commit/release, publisher, license, compatibility declarations, and external dependencies;
- create a review candidate without assigning verification automatically.

Do **not** automatically convert every OpenAI plugin or third-party plugin into a new repository-owned `SKILL.md`. A plugin can contain skills, apps, app templates, authentication requirements, and other behavior that is not semantically equivalent to one skill. Preserve original provenance and packaging. Create derived artifacts only when the license permits it, the transformation is technically faithful, and the derived artifact is independently reviewed.

## Apps, MCP, and action providers

### Adopt the capability, not a single provider

Real actions are important: email, Slack, GitHub, Notion, databases, calendars, and other systems make skills materially more useful.

However, ChatGPT Skills should model **external capabilities** rather than make one gateway part of the trust root.

A reviewed item should be able to declare:

- provider / app / toolkit dependency;
- connection protocol (for example MCP, native connected app, local tool, SDK function tool);
- authentication model;
- requested permissions/scopes;
- read/write/destructive action surface;
- data destinations;
- approval/confirmation behavior;
- whether the dependency is first-party, third-party hosted, or self-hostable;
- evidence date and tested environment.

### Composio

Composio is a strong candidate for an **optional integration adapter and reference provider** because it offers broad app coverage and an open-source MIT repository. Its hosted gateway/auth services are still an external dependency and must be represented as such.

Recommended sequence:

1. support the schema for app/tool/gateway dependencies;
2. test one narrow reference workflow with Composio;
3. compare it with OpenAI-native connected app/plugin capability where an equivalent exists;
4. publish evidence and trade-offs rather than declaring one provider universally preferred.

### Do not build a "ChatGPT Actions Gateway"

Do not create a proprietary action gateway as a long-term objective. OpenAI's Apps SDK already uses MCP, and the Plugin model already composes skills with apps/actions. A new protocol would create another authentication, security, compatibility, and maintenance surface without a demonstrated gap.

If a real missing capability is later demonstrated, build the smallest adapter or service around an existing standard first.

## Production-ready skills

The feedback that production skills matter is correct. The response should be **evidence and reference workflows**, not cloning famous skills for branding.

Priorities:

- require reproducible fixtures/tests for bundled verified skills;
- publish example inputs, acceptance criteria, and generated artifacts where useful;
- use screenshots only when visual output is part of the acceptance criteria;
- create reference workflows for documents, spreadsheets, PDFs, presentations, coding, analysis, and connected-app actions;
- prefer existing authoritative/official capabilities when they already solve the job well;
- create a repository-authored core skill only when there is a real uncovered job or a meaningful trust/composition improvement.

## Taxonomy: jobs first, categories second

Broader categories are useful for navigation, but "five skills per category" is not a quality target.

Use multiple dimensions:

- job-to-be-done;
- domain/category;
- target surface;
- external systems;
- permission/risk class;
- data sensitivity;
- side effects;
- evidence level;
- maintenance state.

Categories such as Security & Privacy, DevOps & Infrastructure, and Research & Academia should be introduced when the catalog has real entries to support them, not to make the directory look complete.

## Community growth

A community program is valuable after the review model is operational.

Prefer **Evidence Maintainers / Curators** over volume-oriented "Ambassadors". Recognition should reward:

- keeping evidence current;
- reproducing tests;
- identifying stale or unsafe entries;
- improving explanations and fixtures;
- maintaining a high-quality job/domain area over time.

Do not reward raw submission count. That would create the same catalog inflation the trust model is designed to resist.

## Distribution and marketing

Stars are useful reach indicators, not product-quality evidence.

Before broad promotion, complete the v0.4 exit criteria and publish reproducible examples. Then distribute through developer/community channels with evidence-led launches.

Recommended launch assets:

- 3 reproducible case studies showing a real job, candidate skills, evidence, selection, installation/export, and result;
- one security/integrity case where the service catches a meaningful problem;
- one composition case showing why a smaller bundle is better than installing everything;
- transparent comparison pages that explain methodology and limitations.

Never publish "Used by X companies" unless those organizations have explicitly opted in and the claim is auditable. Never fabricate testimonials, reviews, or usage numbers.

## Internationalization

International reach matters, but translating every skill multiplies maintenance and semantic-drift risk.

Sequence:

1. keep canonical technical artifacts in their authoritative source language;
2. support localized catalog metadata and plain-language evidence summaries;
3. maintain English + Brazilian Portuguese as first-class project documentation;
4. add Spanish when the web/service layer makes localization cheap and maintainable;
5. add additional languages based on real contributors/usage;
6. translate full skill instructions only when a maintainer owns semantic parity and updates.

## Metrics that matter

Primary metrics:

- indexed entries with explicit provenance;
- percentage source-checked;
- percentage reproducibly tested;
- current vs stale evidence;
- number of jobs with at least one evidence-backed recommendation;
- successful CI/behavior fixtures per bundled skill;
- time from material upstream change to evidence refresh;
- external contributions that improve durable evidence;
- install/export success and `doctor` correctness in test environments.

Secondary adoption metrics:

- npm downloads;
- GitHub stars/forks;
- external references;
- returning contributors.

Do not optimize the product directly for the secondary metrics.

## Decision summary

### Adopt now

- broader indexed coverage, with evidence tiers;
- production-grade tests/fixtures;
- app/tool dependency modeling;
- one optional Composio reference integration after the schema exists;
- job-first discovery and richer taxonomy;
- real case studies after v0.4 exits.

### Adopt later

- community curator program;
- additional localized catalog UI/metadata;
- broader app-provider adapters;
- public recognition based on durable evidence.

### Reject as strategy

- "100 verified" as a quota;
- proprietary ChatGPT Actions Gateway;
- automatic plugin-to-skill conversion without semantic/license review;
- five skills per category as a KPI;
- aggressive marketing before the trust service is demonstrably useful;
- stars as a quality target;
- unaudited company badges/testimonials;
- translating every skill before there is maintenance capacity.
