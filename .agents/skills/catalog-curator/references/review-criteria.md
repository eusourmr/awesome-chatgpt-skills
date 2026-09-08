# Review criteria

Use this checklist for new entries and material updates.

## Required evidence

1. **Canonical source** — a public, stable URL controlled by the publisher or upstream project.
2. **Skill or plugin structure** — an inspectable `SKILL.md` or `.codex-plugin/plugin.json` that identifies the workflow.
3. **License** — a repository, package, or per-skill license. Do not merge an entry with an unidentified license.
4. **Publisher** — derived from repository ownership, a manifest, or explicit project documentation.
5. **Real use case** — a concrete outcome, not merely a generic persona prompt.
6. **Compatibility** — evidence supports every surface label. Codex CLI support alone does not establish ChatGPT web support.
7. **Safety** — scripts, hooks, permissions, credential handling, downloads, and external writes are disclosed and proportionate.

## Surface labels

- `chat`: bundled or distributed for ChatGPT conversational use.
- `work`: intended for ChatGPT Work artifact or connected-app workflows.
- `codex`: intended for one or more Codex surfaces; note platform limitations in the summary.

Standalone skill support and plugin distribution are not interchangeable. Consult current official OpenAI documentation when a source predates the current packaging model.

## Reject or pause

Reject or request evidence for inaccessible or obfuscated source, copied work without attribution, secrets committed in source, unrelated hidden downloads, unsafe default actions, misleading claims, mass-generated near-duplicates, or an unidentified license.

## Regenerative core gate

Apply this section only when the core label is proposed. Read `docs/REGENERATIVE_STANDARD.md`; all gates are mandatory.

- Define the system boundary, affected and missing voices, time horizon, and material dependencies.
- Require a causal mechanism and observable indicator in at least three lenses: human, social, knowledge, resources, and ecology.
- Inspect all five lenses. Every material harm needs an owner, mitigation, stop condition, or a no-go decision.
- Name the reinforcing loop and the balancing safeguard. Positive intent alone does not make a reinforcing loop safe.
- Name what renewable capacity, relationship, governed knowledge, repairable asset, restored resource, or reusable evidence remains.
- Track material resource types separately against a baseline. Never combine attention, money, carbon, data, time, or energy into an unsupported net score.
- Require plain language first, exact technical terms and caveats underneath, and a comprehension check.
- Use `design-reviewed` for predicted outcomes. A future field-tested claim needs dated baseline and results, context, method, participant feedback, harms, limitations, and disconfirming evidence.

The validator additionally requires all five lenses across the core portfolio and ecology in at least two entries.

## Summary standard

Describe what the workflow helps a user accomplish. Avoid superlatives, adoption numbers, unsupported performance claims, and copied promotional language. Preserve platform and dependency limitations in both languages.
