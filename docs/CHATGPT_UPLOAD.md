# ChatGPT Upload Path

The preferred CS experience is **Chat-Native First**: prepare one focused skill, load it into ChatGPT where Skills are available, and keep working in the same chat.

## Minimal path

Prepare one bundled skill:

```bash
npx chatgpt-skills install \
  --skill regenerative-language-bridge \
  --tool chatgpt-web \
  --yes
```

CS writes two representations:

- a readable folder under `.chatgpt-skills/export/skills/` for inspection;
- one deterministic ZIP under `.chatgpt-skills/export/packages/` for upload.

For the first chat-native candidate:

```text
.chatgpt-skills/export/packages/regenerative-language-bridge.zip
```

The export configuration records the SHA-256 of the ZIP. `chatgpt-skills doctor` verifies both the readable files and the ZIP before upload.

## Why one ZIP per skill

A single focused package is easier to inspect, hash, upload, revoke and test than a multi-skill archive. It also preserves a simple mental model:

`one skill → one upload artifact → one execution claim`

Bundles remain useful for Codex, Cursor and portable Agent Skills, and CS can still prepare multiple ChatGPT ZIPs from a bundle. The individual ZIP remains the unit of ChatGPT upload evidence.

## In ChatGPT

Where the Skills feature is available for the account/workspace, use the product's Skills upload flow and select the ZIP for the skill you want to add.

CS deliberately stops short of claiming that a local export equals an installed ChatGPT skill. In-product execution evidence is recorded only after the exact artifact has actually been loaded and exercised on a qualifying ChatGPT surface.

## First end-to-end proof

`regenerative-language-bridge` is the first candidate because its core job is instruction-only and requires no external account, MCP server, local runtime, API credential or new network dependency.

The reproducible test contract lives at:

```text
tests/chat-native/regenerative-language-bridge.json
```

Its execution state remains `designed` until the actual ChatGPT run satisfies that contract.

## Integrity boundary

The ZIP is deterministic for a given packaged skill version:

- file order comes from the package manifest;
- timestamps are fixed;
- no network content is fetched during export;
- the ZIP SHA-256 is stored in the export config;
- `doctor` fails if the ZIP changes afterward.

This proves local artifact integrity. It does **not** prove OpenAI approval, availability on every plan, or successful in-product execution.

Independent community project. Not affiliated with or endorsed by OpenAI.
