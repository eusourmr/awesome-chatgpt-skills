# Chat-Native First

This is a core product principle for ChatGPT Skills (CS).

## Goal

A useful CS skill should make ChatGPT more capable **inside the conversation** with the least possible friction. When a user loads or enables a skill, the ideal experience is that ChatGPT can immediately apply the skill's method and use the platform capabilities already available to it.

The project should not add infrastructure merely because it is possible. Simplicity is part of correctness.

## Default architecture

Use the smallest layer that solves the job:

1. **Native ChatGPT capability first.** Reuse reasoning, browsing, files, code execution, connected apps, and other capabilities already available in the target ChatGPT surface.
2. **Skill second.** Add instructions, methods, examples, references, and narrowly scoped scripts only when they materially improve the job.
3. **Native app/plugin/MCP dependency only when required.** Add an external capability when the job genuinely needs data or actions outside the chat.
4. **Third-party gateway last.** A gateway such as Composio may be useful as an optional adapter, but it must not become a dependency when the platform can already perform the job directly.
5. **Do not invent a new protocol or control plane without evidence that existing primitives cannot solve the problem.**

## Ideal user experience

The target experience is:

> Find a skill → inspect what it needs → load/enable it → continue working in the same ChatGPT conversation.

The user should not have to understand package managers, MCP topology, OAuth architecture, local folders, or deployment infrastructure unless the task truly requires those details.

Where ChatGPT does not currently allow direct programmatic installation, CS must be explicit about the boundary and make the remaining manual step as small as possible. It must never describe an export as an installation.

## Capability amplification

A CS skill should not try to replace ChatGPT. It should amplify it by providing one or more of:

- a better method;
- domain-specific decision rules;
- reusable checks and safeguards;
- higher-quality tool selection;
- structured use of native ChatGPT resources;
- clear handling of uncertainty and limits;
- a repeatable workflow that leaves reusable knowledge behind.

The skill should prefer orchestration of capabilities ChatGPT already has over duplicating them in custom code.

## Simplicity gate

Before adding a dependency, service, script, gateway, or new user step, ask:

1. Can ChatGPT already do this with a native capability?
2. Can the skill solve it with instructions alone?
3. Does the added layer create more user value than operational burden?
4. Can the same result be achieved with fewer permissions or fewer moving parts?
5. Does the design remain understandable in plain language?

If the answer exposes unnecessary complexity, simplify the design before shipping.

## Trust and permissions

Simplicity does not override trust. A skill that uses an app, API, MCP server, script, network connection, secret, or write action must make those requirements visible before adoption.

The preferred design is **least privilege, least dependency, least surprise**.

## Regenerative alignment

For repository-authored skills, simplicity should reinforce the CS regenerative standard:

- spend fewer resources than the reusable capability created;
- avoid dependence when capability can be transferred to the user or community;
- leave understandable knowledge behind;
- improve at least three systemic lenses where the regenerative standard applies;
- use plain language without sacrificing technical precision.

## Product metric

CS should optimize for **time to trusted value**, not number of components or number of skills.

Useful measures include:

- steps from discovery to first successful use;
- number of external dependencies;
- permissions requested;
- percentage of a workflow completed inside ChatGPT;
- successful end-to-end executions;
- user-visible failures and required recovery steps;
- reusable capability created by the workflow.

## Decision rule

When two architectures deliver comparable outcomes, choose the one that keeps more of the experience **inside ChatGPT**, uses fewer dependencies, requests fewer permissions, and is easier to explain.
