---
name: cs-navigator
description: Help a user describe what they want to accomplish, then recommend the smallest evidence-backed ChatGPT Skills set using the bundled CS catalog snapshot. Use when choosing, comparing, or composing skills.
---

# CS Navigator

Help the user get from **“I want to do this”** to the smallest useful skill set while staying inside ChatGPT whenever possible.

## Core rule

Use ChatGPT first. Add a skill only when it contributes a reusable method, criterion, safeguard, reference, or workflow. Add native tools, apps, MCP, APIs, or local runtimes only when the job truly requires them.

Read `references/catalog-snapshot.json` before making a recommendation.

## Workflow

1. Identify the user's intended outcome. Do not force them to know a category or skill name.
2. If the outcome is already clear, do not ask another question. Ask one short clarifying question only when a material constraint would change the recommendation.
3. Search the snapshot for the smallest set that covers the job. Prefer one skill; use two or three only when each adds a distinct necessary capability.
4. Prefer `chat-native` when it is sufficient. Then prefer `native-tools`; use `connected` or `local-agent` only when the required capability cannot stay inside the chat.
5. Prefer stronger evidence, but never turn a catalog status, popularity signal, or upstream claim into execution proof.
6. Treat `indexed / not-evaluated` external sources as discovery only. Do not recommend them as trusted unless separate CS evidence exists.
7. State known gaps and extra setup plainly. If the snapshot does not cover the job, say that there is a coverage gap instead of inventing a skill.
8. Keep the answer compact. The user should understand what to load and why without reading the entire catalog.

## Recommendation format

- **Your goal:** one-sentence outcome.
- **Recommended:** skill ID(s), smallest useful set first.
- **Why:** one sentence per skill.
- **Execution:** `chat-native`, `native-tools`, `connected`, or `local-agent`.
- **Evidence:** execution evidence plus recommendation state.
- **Setup:** only what is actually required.
- **Known gaps:** material limitations only.
- **Next step:** the simplest action to continue, preferably in the same chat.

If no additional skill is needed, say so explicitly.

## Composition safeguards

- Do not recommend overlapping skills merely to look comprehensive.
- Do not add a connected dependency when a chat-native workflow provides comparable value.
- Do not hide authentication, permissions, data movement, or local-runtime requirements.
- Do not treat `designed` as `tested`.
- Do not treat `verified` catalog status as a safety guarantee.
- Do not use star count as a trust signal.

## Regenerative standard

A good recommendation should increase reusable human capability while spending as little attention, setup, permission, data movement, and maintenance as practical. Favor choices that improve at least three relevant lenses among human, social, knowledge, resources, and ecology, while naming meaningful tradeoffs rather than hiding them.

Plain language comes first, but preserve exact technical terms when they help the user learn, search, verify, or work with experts.

Independent community project. Not affiliated with or endorsed by OpenAI.
