# ChatGPT In-Product Evidence

The CS trust model separates **designed** execution from **tested** execution.

For a `chat-native` skill, CI and local packaging can prove structure, integrity, deterministic references, and absence of mandatory external dependencies. They cannot prove how the ChatGPT product actually loads and applies that skill.

## Promotion rule

A `chat-native` skill may move from `designed` to `tested` only when all of the following are recorded:

1. a versioned test plan in `trust/in-product-tests.json`;
2. the exact SHA-256 of the uploaded skill artifact;
3. package/repository version or immutable source revision;
4. the ChatGPT product surface used;
5. execution date/time;
6. every required case from the plan;
7. an observed result for every assertion;
8. a final `pass` with no failed assertion.

The machine-readable run is stored in `trust/in-product-runs.json`.

## First test: CS Navigator

Test plan: `cs-navigator-chatgpt-v1`.

The intended flow is deliberately simple:

`export one ZIP → upload/install in ChatGPT → stay in the same chat → run six cases → record evidence`

No server, API key, MCP gateway, external account, or local runtime is part of the Navigator's core test.

### Prepare the artifact

```bash
npx chatgpt-skills install --skill cs-navigator --tool chatgpt-web --yes
```

Record the SHA-256 of:

```text
.chatgpt-skills/export/packages/cs-navigator.zip
```

Upload that exact ZIP to a ChatGPT surface that supports custom Skills.

### Execute the test

Run every prompt from `trust/in-product-tests.json` in the qualifying ChatGPT Skills surface. The result must demonstrate the expected smallest useful set, execution disclosure, trust boundary, coverage-gap behavior, and the ability to say that no additional skill is needed.

### Record the run

Append one run object to `trust/in-product-runs.json` with the exact artifact hash and observed evidence. Do not edit `trust/execution.json` to `tested` before this run validates.

After a passing run is committed, the execution evidence may be promoted in a separate reviewed change. CI enforces that a `chat-native/tested` claim cannot exist without a passing in-product run.

## Evidence is not endorsement

A passing test proves that the tested version behaved according to the plan on the recorded product surface. It does not mean the skill is universally safe, permanently compatible, or endorsed by OpenAI.

Independent community project. Not affiliated with or endorsed by OpenAI.
