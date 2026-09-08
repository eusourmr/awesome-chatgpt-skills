#!/usr/bin/env node
import { readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const readJson = async (rel) => JSON.parse(await readFile(path.join(root, rel), 'utf8'));

async function loadExternalSources() {
  const dir = path.join(root, 'sources', 'external');
  const result = [];
  try {
    for (const name of (await readdir(dir)).filter((x) => x.endsWith('.json')).sort()) {
      result.push(JSON.parse(await readFile(path.join(dir, name), 'utf8')));
    }
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  return result;
}

export async function buildSnapshot() {
  const manifest = await readJson('installer/manifest.json');
  const trust = await readJson(manifest.trust_file || 'trust/skills.json');
  const execution = await readJson('trust/execution.json');
  const external = await loadExternalSources();

  const entries = Object.keys(manifest.skills || {}).sort().map((id) => {
    const raw = trust.skills?.[id];
    const exec = execution.skills?.[id];
    if (!raw || !exec) throw new Error(`${id}: missing trust or execution data`);
    const recommendation = { ...(trust.defaults?.recommendation || {}), ...(raw.recommendation || {}) };
    return {
      id,
      name: raw.name,
      summary: raw.summary,
      recommendation: recommendation.state,
      execution_mode: exec.mode,
      execution_evidence: exec.evidence_state,
      required_capabilities: exec.required_capabilities || [],
      known_gaps: raw.known_gaps || trust.defaults?.known_gaps || []
    };
  });

  const external_sources = external
    .sort((a, b) => String(a.repository).localeCompare(String(b.repository)))
    .map((source) => ({
      repository: source.repository,
      immutable_ref: source.immutable_ref,
      discovery_state: source.discovery_state,
      trust_state: source.trust_state,
      license: source.license,
      skill_count: source.skill_count,
      warnings: source.warnings || [],
      skill_ids: (source.skills || []).map((skill) => skill.id).sort()
    }));

  return {
    schema_version: 1,
    policy: "Use the smallest useful set. Execution and trust are separate. External indexed sources are discovery-only until separately evidenced.",
    source_contract: ["installer/manifest.json", "trust/skills.json", "trust/execution.json", "sources/external/*.json"],
    entries,
    external_sources
  };
}

const target = path.join(root, 'skills', 'featured', 'cs-navigator', 'references', 'catalog-snapshot.json');
const snapshot = await buildSnapshot();
const rendered = JSON.stringify(snapshot, null, 2) + '\n';

if (process.argv.includes('--check')) {
  const current = await readFile(target, 'utf8');
  if (current !== rendered) {
    console.error('CS Navigator snapshot is stale. Run: node scripts/generate-navigator-snapshot.mjs');
    process.exit(1);
  }
  console.log(`CS Navigator snapshot OK: ${snapshot.entries.length} bundled skills, ${snapshot.external_sources.length} external source(s).`);
} else {
  await writeFile(target, rendered, 'utf8');
  console.log(`Wrote ${path.relative(root, target)}`);
}
