# Execution Model

ChatGPT Skills (CS) classifies **how a skill actually reaches useful execution**, separately from compatibility, provenance, popularity, or recommendation.

The default product principle is **Chat-Native First**: use the capabilities already available in ChatGPT before adding local runtimes, external apps, MCP servers, APIs, gateways, or extra setup.

## Why this exists

A valid `SKILL.md` can be structurally compatible with several Agent Skills surfaces without proving that the job is completed inside ChatGPT. CS therefore records an execution class instead of treating format compatibility as execution proof.

The user-facing question is simple:

> After I load this skill, can I keep working in the same chat, or do I need something else?

## Execution classes

### `chat-native`

The job can be performed from the skill instructions and bundled reference material inside ChatGPT without a mandatory external account, app, local runtime, or network dependency introduced by the skill.

Ideal path:

`find → inspect → install/load → continue in the same chat`

This is the preferred CS class when it is sufficient for the job.

### `native-tools`

The workflow expects one or more native ChatGPT capabilities such as files, web research, data analysis, image generation, or another first-party tool available on the user's surface. It does not require an external account integration merely to complete the core job.

Availability of a native tool can still vary by plan, workspace, region, or product surface, so the exact required capabilities must be declared.

### `connected`

The job requires external data or actions through an app, plugin, MCP server, API, OAuth connection, or another connected provider.

CS must declare the provider, authentication, scopes/permissions, read/write/destructive action classes, and whether an approval step is expected. A connected dependency is assessed separately from the skill itself.

### `local-agent`

The workflow requires or materially depends on a local filesystem, CLI, executable script, development runtime, or agent environment such as Codex or Cursor.

A `local-agent` skill may still contain useful guidance in ChatGPT, but CS must not describe the complete deterministic workflow as chat-native unless the same job has been separately proven inside ChatGPT.

## Evidence states

Execution class and execution evidence are different fields.

- `designed`: the skill structure and instructions support the declared mode by inspection.
- `tested`: the declared path was exercised end-to-end on the named surface.
- `conditional`: the path works only when a documented capability, plan, permission, or dependency is available.
- `unknown`: there is not enough evidence yet.

A skill must not move from `designed` to `tested` merely because its files validate or its scripts pass locally.

## Simplicity gate

Before CS adds a dependency, ask in this order:

1. Can ChatGPT already do the job directly?
2. Can a focused skill provide the missing method, criteria, format, or reusable knowledge?
3. Can a native ChatGPT tool complete the remaining step?
4. Is an external app/action genuinely required?
5. If yes, what is the least-privilege existing integration?
6. Only then consider a third-party gateway or new infrastructure.

If two approaches produce comparable value, prefer the one with fewer setup steps, fewer permissions, fewer dependencies, less data movement, and more work completed in the same chat.

## Current v0.5 baseline

The first baseline classifies the 12 skills bundled in the npm package.

- The eight regenerative instruction skills are `chat-native` by design because their packaged workflows require no local files, network, secrets, processes, or external apps.
- The four featured developer skills are currently `local-agent` because their deterministic workflows include local scaffolding or file-processing helpers.
- No bundled skill is currently labeled `native-tools` or `connected`; those classes are reserved for workflows whose required capabilities are explicitly modeled and tested.

These are conservative classifications, not claims that every skill has already been executed in a qualifying ChatGPT workspace. The first v0.5 end-to-end milestone is to promote at least one `chat-native` skill from `designed` to `tested` using the native ChatGPT Skills installation/activation flow.

## Product metric

The principal experience metric is **Time to Trusted Value**: how much setup and risk stands between a user's job and a reliable result.

CS should reduce that time primarily by removing unnecessary complexity, not by hiding dependencies.

Independent community project. Not affiliated with or endorsed by OpenAI.
