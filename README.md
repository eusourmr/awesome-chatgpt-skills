# Awesome ChatGPT Skills

[![Awesome](https://awesome.re/badge-flat2.svg)](https://awesome.re)
[![Validate catalog](https://github.com/eusourmr/awesome-chatgpt-skills/actions/workflows/validate.yml/badge.svg)](https://github.com/eusourmr/awesome-chatgpt-skills/actions/workflows/validate.yml)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Curation](https://img.shields.io/badge/curation-human--governed-2f6f4e.svg)](CONTRIBUTING.md)
[![Catalog](https://img.shields.io/badge/catalog-30%20skills-4c1.svg)](PROGRESS.md)
[![Standard](https://img.shields.io/badge/Agent%20Skills-agentskills.io-6f42c1.svg)](https://agentskills.io/)

**The curated skills catalog for the OpenAI ecosystem.** Unlike a flat community list, entries here are source-checked, categorized by use case, mapped to the open Agent Skills format, and separated by provenance: OpenAI-published, independently verified, or community-authored.

[Português do Brasil](README.pt-BR.md) · [Bundles](BUNDLES.md) · [Progress](PROGRESS.md) · [Roadmap](ROADMAP.md) · [Community](COMMUNITY.md)

> **Independent community project. Not affiliated with or endorsed by OpenAI.** “Official” in this repository describes attributable OpenAI publication/provenance; it never means OpenAI has endorsed this repository.

## 🏛️ Official OpenAI Catalog

This section is a **source-verified window into OpenAI-published skills/plugins**, not a claim that this repository itself is official.

[![OpenAI Build iOS Apps](https://img.shields.io/badge/OpenAI-Build%20iOS%20Apps-000000?logo=openai&logoColor=white)](https://github.com/openai/plugins/tree/main/plugins/build-ios-apps)
[![OpenAI Build Web Apps](https://img.shields.io/badge/OpenAI-Build%20Web%20Apps-000000?logo=openai&logoColor=white)](https://github.com/openai/plugins/tree/main/plugins/build-web-apps)
[![OpenAI Developers](https://img.shields.io/badge/OpenAI-Developers-000000?logo=openai&logoColor=white)](https://github.com/openai/plugins/tree/main/plugins/openai-developers)

The quality catalog currently tracks **30 skills**: **12 OpenAI-published**, **14 project-verified**, and **4 community-authored**. Rejections are reported only when there is an auditable record; the current recorded rejection count is **0**, not an invented confidence statistic. See [`PROGRESS.md`](PROGRESS.md) and [`catalog.json`](catalog.json).

## Why this catalog is different

| Capability | This catalog | Typical flat list |
|---|---:|---:|
| OpenAI provenance distinguished from third-party authorship | ✅ | Sometimes |
| Agent Skills / `SKILL.md` format checks | ✅ | Inconsistent |
| Continuous verification date | ✅ | Rare |
| Human-governed curation policy | ✅ | Varies |
| Machine-readable status, compatibility, rating state and reviews | ✅ | Rare |
| Bundles by real use case | ✅ | ❌ |
| Interactive installer | ✅ | ❌ |
| Public health/progress report | ✅ | ❌ |
| Regenerative/systemic design standard | ✅ | ❌ |

## 🚀 Start in 1 Minute

Interactive install:

```bash
npx awesome-chatgpt-skills install
```

The npm package must be published before that exact command resolves from the npm registry. Until then, run the repository package directly:

```bash
npx github:eusourmr/awesome-chatgpt-skills install
```

Choose a profile and tool, and the installer writes the recommended skills to `.chatgpt/skills/` plus `.chatgpt/skills-config.json`.

Install a bundle directly:

```bash
npx awesome-chatgpt-skills install --bundle openai-ecosystem
```

See all curated packages in [`BUNDLES.md`](BUNDLES.md).

## Featured OpenAI-native production skills

| Skill | Purpose |
|---|---|
| [`openai-agents-sdk-builder`](skills/featured/openai-agents-sdk-builder/) | Scaffold and review Agents SDK projects with tools, guardrails, state, tracing and sandbox boundaries. |
| [`realtime-api-integration`](skills/featured/realtime-api-integration/) | Design WebSocket/WebRTC Realtime integrations with explicit transport fallback and secret isolation. |
| [`chatgpt-apps-deployer`](skills/featured/chatgpt-apps-deployer/) | Package and validate ChatGPT Apps SDK releases without pretending platform approval is automatic. |
| [`codex-pr-reviewer`](skills/featured/codex-pr-reviewer/) | Review PRs against versioned business rules with risk-ranked evidence. |

## Curation model

A folder named `skill` is not enough. This catalog favors focused workflows, inspectable source, visible licensing, honest compatibility claims, narrow permissions, testable installation paths, and plain language before technical depth.

OpenAI distinguishes standalone skills from plugin packages, while the open Agent Skills format defines a lightweight folder centered on `SKILL.md`. This repository uses both concepts conservatively and records what surface a candidate actually supports.

The repository also has a stricter **Regenerative core**: repository-authored skills there must improve at least three of five lenses—human, social, knowledge, resources, and ecology—while checking harm across all five, creating a reinforcing benefit loop, adding a balancing safeguard, and leaving reusable capability behind. Read the complete [Regenerative Skills Standard](docs/REGENERATIVE_STANDARD.md).

## Catalog

<!-- CATALOG:START -->
<!-- Generated by scripts/catalog.py. Do not edit this block manually. -->

### Official collection

- [**OpenAI Plugins**](https://github.com/openai/plugins) — The current official collection of plugin examples for ChatGPT and Codex, including skill-only and MCP-backed packages. `Collection` · `OpenAI catalog` · `Chat` · `Work` · `Codex` · `License: Per package` · OpenAI · 2026-09-08

### Regenerative core

- [**Regenerative Adaptive Experiment**](https://github.com/eusourmr/awesome-chatgpt-skills/tree/main/skills/regenerative-adaptive-experiment) — Convert uncertainty into a small, reversible test with causal predictions, systemic measures, early harm detection, rollback, and reusable learning. `Skill` · `Regenerative core` · `Design reviewed` · `4/5 lenses: human, social, knowledge, resources` · `Chat` · `Codex` · `License: MIT` · eusourmr · 2026-09-08
- [**Regenerative Capability Exchange**](https://github.com/eusourmr/awesome-chatgpt-skills/tree/main/skills/regenerative-capability-exchange) — Create reciprocal exchanges that start from existing strengths and distribute practical capability instead of dependence on one expert. `Skill` · `Regenerative core` · `Design reviewed` · `4/5 lenses: human, social, knowledge, resources` · `Chat` · `Codex` · `License: MIT` · eusourmr · 2026-09-08
- [**Regenerative Conflict Repair**](https://github.com/eusourmr/awesome-chatgpt-skills/tree/main/skills/regenerative-conflict-repair) — Assess safety before structuring voluntary conflict repair across immediate harm, relationships, procedures, and systemic causes. `Skill` · `Regenerative core` · `Design reviewed` · `4/5 lenses: human, social, knowledge, resources` · `Chat` · `Codex` · `License: MIT` · eusourmr · 2026-09-08
- [**Regenerative Impact Map**](https://github.com/eusourmr/awesome-chatgpt-skills/tree/main/skills/regenerative-impact-map) — Map a consequential decision across five systemic lenses, causal loops, power, delays, spillovers, and reversible leverage points. `Skill` · `Regenerative core` · `Design reviewed` · `5/5 lenses: human, social, knowledge, resources, ecology` · `Chat` · `Codex` · `License: MIT` · eusourmr · 2026-09-08
- [**Regenerative Knowledge Commons**](https://github.com/eusourmr/awesome-chatgpt-skills/tree/main/skills/regenerative-knowledge-commons) — Turn project learning into accessible, reusable, rights-aware knowledge with provenance, stewardship, correction, contribution, and expiry paths. `Skill` · `Regenerative core` · `Design reviewed` · `4/5 lenses: human, social, knowledge, resources` · `Chat` · `Codex` · `License: MIT` · eusourmr · 2026-09-08
- [**Regenerative Language Bridge**](https://github.com/eusourmr/awesome-chatgpt-skills/tree/main/skills/regenerative-language-bridge) — Explain complex material in everyday language while retaining exact terms, evidence, uncertainty, caveats, and a check of real understanding. `Skill` · `Regenerative core` · `Design reviewed` · `4/5 lenses: human, social, knowledge, resources` · `Chat` · `Codex` · `License: MIT` · eusourmr · 2026-09-08
- [**Regenerative Listening Loop**](https://github.com/eusourmr/awesome-chatgpt-skills/tree/main/skills/regenerative-listening-loop) — Build an ethical listen–understand–act–report-back cycle that gives affected people real influence and avoids extractive consultation. `Skill` · `Regenerative core` · `Design reviewed` · `4/5 lenses: human, social, knowledge, resources` · `Chat` · `Codex` · `License: MIT` · eusourmr · 2026-09-08
- [**Regenerative Participatory Decision**](https://github.com/eusourmr/awesome-chatgpt-skills/tree/main/skills/regenerative-participatory-decision) — Design a fair, traceable decision in which affected people have clear influence, dissent is preserved, and every participant receives a response. `Skill` · `Regenerative core` · `Design reviewed` · `4/5 lenses: human, social, knowledge, resources` · `Chat` · `Codex` · `License: MIT` · eusourmr · 2026-09-08
- [**Regenerative Resilience Plan**](https://github.com/eusourmr/awesome-chatgpt-skills/tree/main/skills/regenerative-resilience-plan) — Prepare essential functions to prevent, absorb, adapt to, recover from, and learn through disruption without shifting risk to vulnerable people. `Skill` · `Regenerative core` · `Design reviewed` · `5/5 lenses: human, social, knowledge, resources, ecology` · `Chat` · `Codex` · `License: MIT` · eusourmr · 2026-09-08
- [**Regenerative Resource Cycle**](https://github.com/eusourmr/awesome-chatgpt-skills/tree/main/skills/regenerative-resource-cycle) — Redesign a lifecycle by avoiding demand first, circulating resources safely, checking rebound, and committing to measurable restoration. `Skill` · `Regenerative core` · `Design reviewed` · `5/5 lenses: human, social, knowledge, resources, ecology` · `Chat` · `Codex` · `License: MIT` · eusourmr · 2026-09-08

### Development

- [**Build iOS Apps**](https://github.com/openai/plugins/tree/main/plugins/build-ios-apps) — Build and debug iOS apps with SwiftUI, App Intents, Xcode, Simulator, performance, and memory workflows. `Plugin` · `OpenAI catalog` · `Codex` · `License: MIT` · OpenAI · 2026-09-08
- [**Build macOS Apps**](https://github.com/openai/plugins/tree/main/plugins/build-macos-apps) — Build, test, instrument, and debug native macOS apps using SwiftUI, AppKit, Xcode, signing, and unified logging. `Plugin` · `OpenAI catalog` · `Codex` · `License: MIT` · OpenAI · 2026-09-08
- [**Build Web Apps**](https://github.com/openai/plugins/tree/main/plugins/build-web-apps) — Build frontend-focused web apps with visual assets, browser testing, UI components, payments, and database guidance. `Plugin` · `OpenAI catalog` · `Work` · `Codex` · `License: MIT` · OpenAI · 2026-09-08
- [**OpenAI Developers**](https://github.com/openai/plugins/tree/main/plugins/openai-developers) — Build with OpenAI APIs, Agents SDK, and ChatGPT Apps using official documentation and development workflows. `Plugin` · `OpenAI catalog` · `Codex` · `License: Proprietary` · OpenAI · 2026-09-08
- [**Plugin Eval**](https://github.com/openai/plugins/tree/main/plugins/plugin-eval) — Evaluate and benchmark Codex skills and plugins with local reports, scoring explanations, and token-use measurements. `Plugin` · `OpenAI catalog` · `Codex` · `License: MIT` · OpenAI · 2026-09-08
- [**Superpowers**](https://github.com/openai/plugins/tree/main/plugins/superpowers) — A software-development skill framework covering brainstorming, planning, TDD, debugging, collaboration, and code review. `Plugin` · `OpenAI catalog` · `Codex` · `License: MIT` · Jesse Vincent · 2026-09-08

### Data & research

- [**Build Web Data Visualization**](https://github.com/openai/plugins/tree/main/plugins/build-web-data-visualization) — Design, implement, test, and export browser-based charts, maps, dashboards, diagrams, and advanced visual stories. `Plugin` · `OpenAI catalog` · `Work` · `Codex` · `License: MIT` · OpenAI · 2026-09-08
- [**Data Analytics**](https://github.com/openai/plugins/tree/main/plugins/data-analytics) — Answer product and business questions with data, validation, diagnostics, charts, dashboards, notebooks, and reports. `Plugin` · `OpenAI catalog` · `Chat` · `Work` · `Codex` · `License: Proprietary` · OpenAI · 2026-09-08
- [**Life Science Research**](https://github.com/openai/plugins/tree/main/plugins/life-science-research) — Route and synthesize evidence across genetics, omics, biology, chemistry, clinical research, and public datasets. `Plugin` · `OpenAI catalog` · `Work` · `Codex` · `License: Proprietary` · OpenAI · 2026-09-08

### Design & media

- [**Creative Production**](https://github.com/openai/plugins/tree/main/plugins/creative-production) — Turn briefs, products, and source images into campaign concepts, mood boards, ads, social posts, and launch assets. `Plugin` · `OpenAI catalog` · `Chat` · `Work` · `Codex` · `License: Proprietary` · OpenAI · 2026-09-08
- [**Figma**](https://github.com/openai/plugins/tree/main/plugins/figma) — Implement Figma designs in code, create Code Connect templates, and generate project-specific design-system rules. `Plugin` · `OpenAI catalog` · `Work` · `Codex` · `License: LicenseRef-Figma-Developer-Terms` · Figma · 2026-09-08
- [**Product Design**](https://github.com/openai/plugins/tree/main/plugins/product-design) — Turn early ideas, URLs, screenshots, and briefs into reviewable product directions, UX audits, and interactive prototypes. `Plugin` · `OpenAI catalog` · `Work` · `Codex` · `License: Proprietary` · OpenAI · 2026-09-08
- [**Remotion**](https://github.com/openai/plugins/tree/main/plugins/remotion) — Create programmatic videos with React using reusable guidance for animation, audio, captions, charts, 3D, and transitions. `Plugin` · `OpenAI catalog` · `Codex` · `License: MIT` · Remotion · 2026-09-08

### Productivity & collaboration

- [**Google Drive**](https://github.com/openai/plugins/tree/main/plugins/google-drive) — Use one entry point for Google Drive search, organization, sharing, and Docs, Sheets, and Slides workflows. `Plugin` · `OpenAI catalog` · `Chat` · `Work` · `Codex` · `License: MIT` · OpenAI · 2026-09-08
- [**Notion**](https://github.com/openai/plugins/tree/main/plugins/notion) — Turn specifications, research, meetings, and workspace context into plans, documentation, and durable knowledge. `Plugin` · `OpenAI catalog` · `Chat` · `Work` · `Codex` · `License: MIT` · Notion · 2026-09-08

### Security & quality

- [**Codex Security**](https://github.com/openai/plugins/tree/main/plugins/codex-security) — Run reusable security scanning, analysis, validation, triage, and investigation workflows across code and diffs. `Plugin` · `OpenAI catalog` · `Codex` · `License: Proprietary` · OpenAI · 2026-09-08
<!-- CATALOG:END -->

## Quality & verification

`catalog.json` adds the required quality metadata for each tracked skill: category, status, rating, review count, verification date, and compatibility. Ratings are never inferred from provenance. A `0` paired with `rating_state: unrated` means no public score exists yet.

Validate locally:

```bash
python scripts/catalog.py --check
python scripts/validate_catalog.py
```

Regenerate the visual progress panel:

```bash
python scripts/validate_catalog.py --write-progress
```

## Contributing

Every new bundled skill must follow the Agent Skills format, include a `SKILL.md` with `Description`, `Use Cases`, `Installation`, and `Example`, pass automated validation, and run through [`$catalog-curator`](.agents/skills/catalog-curator/SKILL.md) before acceptance. See [CONTRIBUTING.md](CONTRIBUTING.md) and [COMMUNITY.md](COMMUNITY.md).

## Official starting points

- [OpenAI developer documentation](https://developers.openai.com/)
- [OpenAI Plugins repository](https://github.com/openai/plugins)
- [OpenAI Agents SDK](https://openai.github.io/openai-agents-python/)
- [Agent Skills open standard](https://agentskills.io/)

## License

Repository-authored content and validation code are licensed under the [MIT License](LICENSE). Linked projects keep their own licenses.
