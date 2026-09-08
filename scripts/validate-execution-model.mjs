#!/usr/bin/env node
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const readJson = async (rel) => JSON.parse(await readFile(path.join(root, rel), 'utf8'));

const manifest = await readJson('installer/manifest.json');
const trust = await readJson('trust/skills.json');
const execution = await readJson('trust/execution.json');

const errors = [];
const expect = (condition, message) => {
  if (!condition) errors.push(message);
};

const modes = new Set(['chat-native', 'native-tools', 'connected', 'local-agent']);
const states = new Set(['designed', 'tested', 'conditional', 'unknown']);
const bundled = new Set(Object.keys(manifest.skills ?? {}));
const evidenceCards = new Set(Object.keys(trust.skills ?? {}));
const executionCards = new Set(Object.keys(execution.skills ?? {}));

expect(execution.schema_version === 1, `execution schema_version must be 1, got ${execution.schema_version}`);
expect(typeof execution.policy === 'string' && execution.policy.length > 0, 'execution policy is required');

for (const id of bundled) {
  expect(evidenceCards.has(id), `${id}: missing Evidence Card in trust/skills.json`);
  expect(executionCards.has(id), `${id}: missing execution classification`);
}
for (const id of executionCards) {
  expect(bundled.has(id), `${id}: execution classification exists for a skill not bundled by installer/manifest.json`);
}

for (const [id, card] of Object.entries(execution.skills ?? {})) {
  expect(modes.has(card.mode), `${id}: invalid execution mode ${card.mode}`);
  expect(states.has(card.evidence_state), `${id}: invalid evidence_state ${card.evidence_state}`);
  expect(typeof card.minimum_setup === 'string' && card.minimum_setup.trim().length > 0, `${id}: minimum_setup is required`);
  expect(Array.isArray(card.required_capabilities), `${id}: required_capabilities must be an array`);
  expect(typeof card.evidence === 'string' && card.evidence.trim().length > 0, `${id}: evidence is required`);

  if (card.mode === 'chat-native') {
    expect(card.required_capabilities.length === 0, `${id}: chat-native must not declare mandatory extra capabilities`);
  }
  if (card.mode === 'connected') {
    expect(card.required_capabilities.length > 0, `${id}: connected mode must declare required capabilities`);
  }
}

if (errors.length) {
  console.error('Execution model validation failed:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

const counts = {};
for (const card of Object.values(execution.skills ?? {})) counts[card.mode] = (counts[card.mode] || 0) + 1;
console.log(`Execution model OK: ${executionCards.size} bundled skills; ` +
  [...modes].map((mode) => `${mode}=${counts[mode] || 0}`).join(', '));
