#!/usr/bin/env node
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { buildSnapshot } from './generate-navigator-snapshot.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const readJson = async (rel) => JSON.parse(await readFile(path.join(root, rel), 'utf8'));
const errors = [];
const expect = (condition, message) => { if (!condition) errors.push(message); };

const snapshot = await readJson('skills/featured/cs-navigator/references/catalog-snapshot.json');
const expected = await buildSnapshot();
const fixtures = await readJson('tests/fixtures/navigator-jobs.json');

expect(JSON.stringify(snapshot) === JSON.stringify(expected), 'Navigator snapshot differs from the current CS source data');
expect(snapshot.schema_version === 1, 'Navigator snapshot schema_version must be 1');
expect(Array.isArray(snapshot.entries) && snapshot.entries.length > 0, 'Navigator snapshot needs entries');
expect(Array.isArray(snapshot.external_sources), 'Navigator snapshot external_sources must be an array');

const ids = new Set(snapshot.entries.map((entry) => entry.id));
expect(ids.size === snapshot.entries.length, 'Navigator snapshot contains duplicate skill IDs');
expect(ids.has('cs-navigator'), 'Navigator snapshot must include cs-navigator itself');

for (const entry of snapshot.entries) {
  expect(typeof entry.name === 'string' && entry.name.length > 0, `${entry.id}: missing name`);
  expect(typeof entry.summary === 'string' && entry.summary.length > 0, `${entry.id}: missing summary`);
  expect(['conditional', 'recommended', 'not-recommended', 'unknown'].includes(entry.recommendation), `${entry.id}: invalid recommendation state ${entry.recommendation}`);
  expect(['chat-native', 'native-tools', 'connected', 'local-agent'].includes(entry.execution_mode), `${entry.id}: invalid execution mode ${entry.execution_mode}`);
  expect(['designed', 'tested', 'conditional', 'unknown'].includes(entry.execution_evidence), `${entry.id}: invalid execution evidence ${entry.execution_evidence}`);
  expect(Array.isArray(entry.required_capabilities), `${entry.id}: required_capabilities must be an array`);
  expect(Array.isArray(entry.known_gaps), `${entry.id}: known_gaps must be an array`);
}

for (const source of snapshot.external_sources) {
  expect(source.discovery_state === 'indexed', `${source.repository}: external source must remain indexed at ingestion`);
  expect(source.trust_state === 'not-evaluated', `${source.repository}: ingestion must not auto-promote trust`);
  expect(Array.isArray(source.skill_ids), `${source.repository}: skill_ids must be an array`);
}

expect(fixtures.schema_version === 1, 'Navigator fixture schema_version must be 1');
expect(Array.isArray(fixtures.jobs) && fixtures.jobs.length >= 5, 'Navigator needs at least five job fixtures');
const jobIds = new Set();
for (const job of fixtures.jobs || []) {
  expect(typeof job.id === 'string' && job.id.length > 0, 'Navigator fixture missing job id');
  expect(!jobIds.has(job.id), `Duplicate Navigator fixture id: ${job.id}`);
  jobIds.add(job.id);
  expect(typeof job.prompt === 'string' && job.prompt.length > 0, `${job.id}: missing prompt`);
  expect(Array.isArray(job.expected_skills), `${job.id}: expected_skills must be an array`);
  expect(job.expected_skills.length <= 3, `${job.id}: expected set exceeds smallest-useful-set limit of 3`);
  expect(new Set(job.expected_skills).size === job.expected_skills.length, `${job.id}: duplicate expected skill`);
  for (const skillId of job.expected_skills) expect(ids.has(skillId), `${job.id}: unknown expected skill ${skillId}`);
  expect(typeof job.reason === 'string' && job.reason.length > 0, `${job.id}: missing reason`);
}

if (errors.length) {
  console.error('CS Navigator validation failed:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`CS Navigator OK: ${snapshot.entries.length} skills, ${snapshot.external_sources.length} external source(s), ${fixtures.jobs.length} job fixtures.`);
