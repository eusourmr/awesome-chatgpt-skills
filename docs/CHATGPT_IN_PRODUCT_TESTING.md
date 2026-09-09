# ChatGPT In-Product Evidence

The CS trust model separates **designed** execution from **tested** execution.

For a `chat-native` skill, CI and local packaging can prove structure, integrity, deterministic references, and absence of mandatory external dependencies. They cannot prove how the ChatGPT product actually loads and applies that skill.

## Promotion rule

A `chat-native` skill may move from `designed` to `tested` only when all of the following are recorded:

1. a versioned test plan in `trust/in-product-tests.json`;
2. the exact SHA-256 of the uploaded skill artifact;
3. distribution type and immutable source revision;
4. package version recorded by that source;
5. the ChatGPT product surface used;
6. execution date/time;
7. every required case from the plan;
8. an observed result for every assertion;
9. a final `pass` with no failed assertion.

The machine-readable run is stored in `trust/in-product-runs.json`.

## First test: CS Navigator

Test plan: `cs-navigator-chatgpt-v1`.

The intended flow is deliberately simple:

`export one ZIP → upload/install in ChatGPT → stay in the same chat → run six cases → record evidence`

No server, API key, MCP gateway, external account, or local runtime is part of the Navigator's core test.

### Prepare the pre-release artifact

The public npm release is still `0.4.0` and does not contain CS Navigator. Do not use unpinned `npx chatgpt-skills` for this pre-release proof.

Use the exact repository revision that introduced the evidence gate:

```bash
npx --yes github:eusourmr/chatgpt-skills#8b814c93980175fa61da141d659cfa28a8e6bd92 install --skill cs-navigator --tool chatgpt-web --yes
```

This should create:

```text
.chatgpt-skills/export/packages/cs-navigator.zip
```

Record the SHA-256 of that exact ZIP. The evidence run must use:

```text
distribution: github-pinned
source_revision: 8b814c93980175fa61da141d659cfa28a8e6bd92
```

Upload that exact ZIP to a ChatGPT surface that supports custom Skills.

### Execute the test

Run every prompt from `trust/in-product-tests.json` in the qualifying ChatGPT Skills surface. The result must demonstrate the expected smallest useful set, execution disclosure, trust boundary, coverage-gap behavior, and the ability to say that no additional skill is needed.

### Record the run

Append one run object to `trust/in-product-runs.json` with the exact artifact hash, immutable source revision, product surface, and observed evidence. Do not edit `trust/execution.json` to `tested` before this run validates.

After a passing run is committed, the execution evidence may be promoted in a separate reviewed change. CI enforces that a `chat-native/tested` claim cannot exist without a passing in-product run.

## Evidence is not endorsement

A passing test proves that the tested version behaved according to the plan on the recorded product surface. It does not mean the skill is universally safe, permanently compatible, or endorsed by OpenAI.

Independent community project. Not affiliated with or endorsed by OpenAI.
