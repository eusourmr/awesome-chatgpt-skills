#!/usr/bin/env node
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourceDir = path.join(root, 'sources', 'external');
const errors = [];
const expect = (condition, message) => { if (!condition) errors.push(message); };

let files = [];
try {
  files = (await readdir(sourceDir)).filter((name) => name.endsWith('.json')).sort();
} catch (error) {
  console.error(`External source validation failed: ${error.message}`);
  process.exit(1);
}

expect(files.length > 0, 'at least one external source record is required');

for (const file of files) {
  let record;
  try {
    record = JSON.parse(await readFile(path.join(sourceDir, file), 'utf8'));
  } catch (error) {
    errors.push(`${file}: invalid JSON (${error.message})`);
    continue;
  }

  expect(record.schema_version === 1, `${file}: schema_version must be 1`);
  expect(record.source_type === 'github-skill-repository', `${file}: unsupported source_type ${record.source_type}`);
  expect(typeof record.repository === 'string' && /^[^/]+\/[^/]+$/.test(record.repository), `${file}: repository must be owner/repo`);
  expect(typeof record.source_url === 'string' && record.source_url.startsWith('https://github.com/'), `${file}: source_url must be a public GitHub URL`);
  expect(typeof record.immutable_ref === 'string' && /^[0-9a-f]{40}$/.test(record.immutable_ref), `${file}: immutable_ref must be a 40-character commit SHA`);
  expect(record.discovery_state === 'indexed', `${file}: external records enter as indexed`);
  expect(record.trust_state === 'not-evaluated', `${file}: ingestion must not grant positive trust automatically`);
  expect(Array.isArray(record.skills), `${file}: skills must be an array`);
  expect(record.skill_count === record.skills?.length, `${file}: skill_count must equal skills.length`);
  expect(Array.isArray(record.warnings), `${file}: warnings must be an array`);
  expect(typeof record.policy === 'string' && record.policy.includes('No external skill content is copied'), `${file}: metadata-only policy is required`);

  if (record.license === 'unresolved') {
    expect(record.warnings?.includes('license-unresolved'), `${file}: unresolved license must remain visible as a warning`);
  }

  const ids = new Set();
  for (const skill of record.skills ?? []) {
    expect(typeof skill.id === 'string' && skill.id.length > 0, `${file}: every skill needs an id`);
    expect(!ids.has(skill.id), `${file}: duplicate skill id ${skill.id}`);
    ids.add(skill.id);
    expect(skill.has_skill_md === true, `${file}/${skill.id}: indexed skill must have observed SKILL.md`);
    expect(skill.source_owned === true, `${file}/${skill.id}: external content must remain source-owned`);
    expect(skill.copied_into_cs === false, `${file}/${skill.id}: ingestion must not copy external skill content into CS`);
    expect(['current-interface-block', 'legacy-flat-interface', 'missing', 'unrecognized'].includes(skill.openai_yaml_shape), `${file}/${skill.id}: invalid openai_yaml_shape`);
  }
}

if (errors.length) {
  console.error('External source validation failed:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`External sources OK: ${files.length} source record(s)`);
