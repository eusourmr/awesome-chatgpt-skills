# CS Navigator

CS Navigator is the first ChatGPT Skills (CS) workflow that joins **chat-native capability** with **independent ecosystem trust context**.

## User path

`describe the job → smallest useful set → understand execution/trust → continue in the same chat`

The core workflow requires no server, API key, MCP gateway, external account, or local runtime.

## What ships inside the skill

- `SKILL.md` — the navigation and composition rules.
- `agents/openai.yaml` — ChatGPT/OpenAI-facing skill metadata.
- `references/catalog-snapshot.json` — a compact deterministic snapshot derived from CS source data.

The snapshot is generated from:

- `installer/manifest.json`
- `trust/skills.json`
- `trust/execution.json`
- `sources/external/*.json`

It does not fetch mutable `main` at runtime and does not copy third-party skill content.

## Trust boundary

Bundled CS skills expose recommendation and execution evidence separately. External repositories remain discovery records unless CS separately reviews them.

`indexed / not-evaluated` never becomes a positive recommendation merely because a repository is popular or claims to be audited.

## Smallest useful set

Navigator should prefer one skill. It may recommend two or three only when each contributes a distinct necessary capability. It should report a coverage gap rather than invent a skill or add unrelated tools.

## Validation

CI requires:

1. the snapshot to match current machine-readable CS source data byte-for-byte;
2. every bundled skill to have trust and execution data;
3. external indexed sources to remain `not-evaluated` at ingestion;
4. at least five representative job fixtures;
5. expected fixture sets to contain at most three skills;
6. the upload ZIP to contain the skill, OpenAI metadata, and exact snapshot.

End-to-end ChatGPT behavior remains `designed` until a qualifying in-product run is recorded.

Independent community project. Not affiliated with or endorsed by OpenAI.
