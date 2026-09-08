# External Ingestion Policy

ChatGPT Skills (CS) may index public Agent Skills repositories to improve discovery and independent evaluation without taking ownership of the source content.

The ingestion boundary is intentionally strict:

- discover metadata;
- pin the observed source to an immutable commit;
- record repository, paths, license state, freshness and structural signals;
- surface warnings and unknowns;
- do **not** copy external `SKILL.md`, scripts, references or assets into CS merely because they are public;
- do **not** convert `indexed` into `tested`, `verified`, `recommended` or any other positive trust state automatically.

## Why metadata-only first

A public repository can be useful for discovery while still having unresolved license terms, stale documentation, outdated product metadata, untested behavior or dependencies that have not been reviewed.

Indexing and recommendation therefore remain separate decisions.

## Source record

Each source under `sources/external/` records:

- canonical GitHub repository and URL;
- immutable 40-character commit SHA;
- default branch and observed last push;
- license state;
- observed skill count;
- skill IDs and paths;
- whether `SKILL.md` was observed;
- the observed shape of `agents/openai.yaml`;
- discovery state;
- trust state;
- explicit warnings;
- ownership/copy boundary.

The initial trust state is always:

```text
indexed / not-evaluated
```

## Current OpenAI metadata shape check

CS recognizes the current OpenAI skill metadata pattern where UI fields live under an `interface:` block in `agents/openai.yaml`.

The ingestor currently records one of:

- `current-interface-block`
- `legacy-flat-interface`
- `missing`
- `unrecognized`

This is a structural freshness signal, not a complete compatibility test.

## Warnings

The initial ingestor can expose signals such as:

- `license-unresolved`
- `stale-audit-count`
- `openai-yaml-legacy-shape`
- `missing-openai-yaml`
- `openai-yaml-unrecognized-shape`

Warnings do not automatically mean a source is unsafe. They mean a user or reviewer should not treat the source as fully evaluated yet.

## Example

The first external source indexed by CS is `dkyazzentwatwa/chatgpt-skills`.

It is useful as a discovery source and currently remains `not-evaluated`. The record preserves its upstream ownership and surfaces observed gaps rather than copying its skills or assigning a positive recommendation.

## Reproducibility

`scripts/ingest-github-repo.mjs` supports two modes:

```bash
node scripts/ingest-github-repo.mjs --repo owner/repo
```

for a live public GitHub observation, and:

```bash
node scripts/ingest-github-repo.mjs --snapshot snapshot.json
```

for deterministic CI fixtures.

The package CI regenerates the first external record from a fixture and requires byte-for-byte equality with the stored source record.

## Product principle

CS should help users answer:

> What is this source, what did we actually observe, what is still unknown, and what would need to be proven before I trust it?

That is intentionally different from claiming ownership or endorsing everything that is indexed.

Independent community project. Not affiliated with or endorsed by OpenAI.
