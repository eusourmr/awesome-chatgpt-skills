# Contributing

Thank you for helping build a trustworthy, inspectable skills catalog for ChatGPT, Codex, and OpenAI developer workflows.

[Leia em português](CONTRIBUTING.pt-BR.md)

## Non-negotiable submission gates

Every new bundled skill must:

1. follow the open Agent Skills format documented at https://agentskills.io/;
2. contain a valid `SKILL.md` whose frontmatter includes at least `name` and a discriminating `description`;
3. include the sections `Description`, `Use Cases`, `Installation`, and `Example`;
4. identify publisher, license, dependencies, external services, permissions, and secret requirements;
5. expose no hidden downloads, secret harvesting, prompt injection, or unsafe default side effects;
6. provide evidence for each claimed ChatGPT, Codex, or Agents SDK compatibility surface;
7. pass `python scripts/catalog.py --check` and `python scripts/validate_catalog.py`;
8. be reviewed with the repository-native `$catalog-curator` before acceptance.

Mass-generated submissions, SEO-only repositories, copied commercial descriptions, inaccessible sources, and unverifiable compatibility claims are not accepted.

## Catalog metadata

The repository uses two complementary layers:

- `catalog/skills.json` is the editorial ecosystem map and generated README source.
- `catalog.json` is the quality/verification layer used by health reporting and progress automation.

Do not use `official` merely because a third-party skill appears in an OpenAI-controlled collection. In the quality catalog, `official` is reserved for OpenAI-published entries; third-party authors remain `community` unless they pass this project's independent `verified` process.

Ratings may not be invented. Use `rating: 0`, `reviews: 0`, and `rating_state: unrated` until a real review mechanism produces a score.

## Folder structure

- Repository-maintenance skills: `.agents/skills/<skill-name>/`
- Regenerative core: `skills/<regenerative-skill-name>/`
- Featured repository-authored production skills: `skills/featured/<skill-name>/`

Skill folders and frontmatter names use lowercase letters, digits, and hyphens. Include only scripts, references, agents metadata, and assets that the workflow actually uses.

## Add or update an ecosystem entry

1. Fork the repository and create a focused branch.
2. Add or update the object in `catalog/skills.json`.
3. Write concise English and Brazilian Portuguese summaries from inspected source evidence, not marketing copy.
4. Set `checked_on` to the inspection date.
5. Run `python scripts/catalog.py --write`.
6. Update `catalog.json` when quality metadata changes.
7. Run `python scripts/catalog.py --check` and `python scripts/validate_catalog.py`.
8. Run `$catalog-curator` against the candidate.
9. Open a pull request using the repository template.

## Regenerative core proposals

The wider catalog and the Regenerative core are different review tracks. A core proposal must pass every gate in `docs/REGENERATIVE_STANDARD.md`, including multi-lens benefit, harm checks across all five lenses, a reinforcing loop, a balancing safeguard, resource accounting, a regenerative seed, plain language, and observable indicators.

Use `design-reviewed` until qualifying field evidence and validation exist. Strong performance in one lens cannot compensate for serious unowned harm in another.

## Review outcomes

Maintainers classify submissions as `accepted`, `needs-evidence`, `duplicate`, `unsafe`, or `out-of-scope`. Rejections should be recorded once the public review log is introduced so repository statistics remain auditable.

Inclusion is editorial and may be reconsidered if a project becomes abandoned, compromised, misleading, incompatible, or unsafe.
