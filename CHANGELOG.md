# Changelog

All notable changes to ChatGPT Skills are documented here.

## 0.3.1 — 2026-09-08

### Fixed

- Restored the npm executable mapping so `npx chatgpt-skills ...` resolves to `installer/index.js` under npm 11.
- Kept the Node-only prepublish gate so Windows maintainers do not need Python just to publish the package.
- Confirmed the packaged CLI and bundled installation path in GitHub Actions before release.

### Release note

- `0.3.0` exists on npm but was published without a usable `bin` entry after npm normalized an older package manifest. It should not be treated as the recommended CLI release.
- `0.3.1` is the first intended public CLI release.

## 0.3.0 — 2026-09-08

### Added

- Interactive `chatgpt-skills` installer with curated bundles and `.chatgpt/skills-config.json` output.
- Quality metadata in `catalog.json` with provenance, verification status, ratings, reviews and compatibility surfaces.
- Repository health reporting and automated progress updates.
- `Developer`, `Data Analyst`, `Marketing & Growth`, `Education` and `OpenAI Ecosystem` bundles.
- Four OpenAI-native featured skills:
  - `openai-agents-sdk-builder`
  - `realtime-api-integration`
  - `chatgpt-apps-deployer`
  - `codex-pr-reviewer`
- Public roadmap, community process and stronger contribution gates.
- npm package smoke testing and trusted-publishing workflow.

### Changed

- Project identity from `awesome-chatgpt-skills` to `chatgpt-skills`.
- README positioning from a flat list to a curated, auditable catalog and distribution layer.
- Official OpenAI provenance is now distinguished from independent project verification and community authorship.

### Integrity

- No OpenAI endorsement is claimed for this independent project.
- Rejection counts and ratings are reported only when auditable evidence exists.
- Repository-authored regenerative skills remain subject to the stricter systemic design gates.
