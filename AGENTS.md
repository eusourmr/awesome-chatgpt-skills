# Repository instructions

Treat `catalog/skills.json` as the source of truth for catalog entries.

- Use `$catalog-curator` when reviewing or adding a submission.
- Do not edit generated catalog blocks in either README manually.
- Run `python scripts/catalog.py --write` after catalog changes.
- Run `python scripts/catalog.py --check` before committing.
- Link to third-party skills by default; copy them only when redistribution is licensed and explicitly required.
- Preserve bilingual summaries for every entry.
- Do not claim a surface, test result, publisher, or license without inspectable evidence.
- Treat the wider catalog as an ecosystem map, not regenerative certification.
- Apply every gate in `docs/REGENERATIVE_STANDARD.md` before using `regenerative-core`; require `systemic_review` and keep untested outcomes at `design-reviewed`.
- Repository-authored core skills live under `skills/<skill-name>/`; maintenance skills remain under `.agents/skills/`.
