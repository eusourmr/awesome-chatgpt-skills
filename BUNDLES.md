# Curated Bundles

Bundles turn the catalog into useful starting points instead of a flat list. Each bundle installs only repository-bundled skills with inspectable files.

> The npm command works after the package is published. Until then, the repository package can be invoked with `npx github:eusourmr/chatgpt-skills install --bundle <name>`.

## 🧑‍💻 Developer Bundle

For agent architecture, realtime systems, ChatGPT apps, PR review, and resilient delivery.

- `openai-agents-sdk-builder`
- `realtime-api-integration`
- `chatgpt-apps-deployer`
- `codex-pr-reviewer`
- `regenerative-resilience-plan`

```bash
npx chatgpt-skills install --bundle developer
```

## 📊 Data Analyst Bundle

For experiments, system-level impact analysis, reusable knowledge, and clear technical communication.

- `regenerative-adaptive-experiment`
- `regenerative-impact-map`
- `regenerative-knowledge-commons`
- `regenerative-language-bridge`

```bash
npx chatgpt-skills install --bundle data-analyst
```

## 📈 Marketing & Growth Bundle

For ethical listening, clear messaging, capability building, and participatory decisions rather than extractive growth loops.

- `regenerative-listening-loop`
- `regenerative-language-bridge`
- `regenerative-capability-exchange`
- `regenerative-participatory-decision`

```bash
npx chatgpt-skills install --bundle marketing-growth
```

## 🎓 Education Bundle

For explanation, research reuse, learning experiments, and feedback loops.

- `regenerative-language-bridge`
- `regenerative-knowledge-commons`
- `regenerative-adaptive-experiment`
- `regenerative-listening-loop`

```bash
npx chatgpt-skills install --bundle education
```

## 🤖 OpenAI Ecosystem Bundle

For the OpenAI Agents SDK, Realtime API, ChatGPT Apps SDK, and Codex-based PR review.

- `openai-agents-sdk-builder`
- `realtime-api-integration`
- `chatgpt-apps-deployer`
- `codex-pr-reviewer`

```bash
npx chatgpt-skills install --bundle openai-ecosystem
```

## Non-interactive installation

```bash
npx chatgpt-skills install --bundle openai-ecosystem --tool codex-cli --yes
```

The installer writes skills to `.chatgpt/skills/` and records the selected bundle, tool, install timestamp, and enabled skills in `.chatgpt/skills-config.json`.
