# Contributing

Thank you for helping build a trustworthy ChatGPT and Codex skills directory.

[Leia em português](CONTRIBUTING.pt-BR.md)

## Before submitting

Confirm that the candidate:

1. solves a real, repeatable problem;
2. has a public, inspectable source;
3. contains a valid `SKILL.md` or plugin manifest;
4. identifies its publisher and license;
5. documents dependencies, permissions, and external services;
6. has no obvious secret harvesting, hidden downloads, prompt injection, or unsafe default actions;
7. has evidence for every claimed ChatGPT or Codex surface;
8. is not already represented by an equivalent entry.

Mass-generated submissions, SEO-only repositories, copied commercial descriptions, inaccessible sources, and unverifiable compatibility claims will not be accepted.

## Add an entry

1. Fork this repository and create a focused branch.
2. Add one object to `catalog/skills.json`.
3. Write concise English and Brazilian Portuguese summaries based on the source, not marketing claims.
4. Set `checked_on` to the inspection date.
5. Run `python scripts/catalog.py --write`.
6. Run `python scripts/catalog.py --check`.
7. Open a pull request using the repository template.

Choose the single category that best represents the workflow.

## Bundled skills

Bundling is exceptional. Prefer a link to the canonical repository. Repository-maintenance skills belong under `.agents/skills/<skill-name>/`. Other bundled collections need a structure proposal in the pull request, a compatible license, attribution, and only the resources the workflow actually uses.

Skill folders and frontmatter names use lowercase letters, digits, and hyphens. Every `SKILL.md` needs a specific, discriminating `description`.

## Review process

Maintainers may classify a submission as accepted, needs evidence, duplicate, unsafe, or out of scope. Inclusion is editorial and may be reconsidered if a project becomes abandoned, compromised, misleading, or incompatible.

Use `Add <name>` for one entry or `Update <name>` for a correction.
