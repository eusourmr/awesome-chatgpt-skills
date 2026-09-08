#!/usr/bin/env node
import { access, readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const readJson = async (rel) => JSON.parse(await readFile(path.join(root, rel), 'utf8'));

const pkg = await readJson('package.json');
const installerPkg = await readJson('installer/package.json');
const manifest = await readJson('installer/manifest.json');
const trust = await readJson(manifest.trust_file || 'trust/skills.json');

const errors = [];
const expect = (condition, message) => {
  if (!condition) errors.push(message);
};

expect(pkg.name === 'chatgpt-skills', `package name must be chatgpt-skills, got ${pkg.name}`);
expect(/^\d+\.\d+\.\d+$/.test(pkg.version), `package version must be semver, got ${pkg.version}`);
expect(pkg.version === '0.4.0', `release branch must publish 0.4.0, got ${pkg.version}`);
expect(pkg.private === false, 'root package must be public');
expect(pkg.bin?.['chatgpt-skills'] === 'installer/index.js', 'chatgpt-skills bin must point to installer/index.js');
expect(installerPkg.private === true, 'installer/package.json must remain private');
expect(installerPkg.version === pkg.version, 'installer package metadata must match root package version');
expect(manifest.schema_version === 3, `manifest schema_version must be 3, got ${manifest.schema_version}`);
expect(manifest.distribution === 'bundled', 'manifest distribution must be bundled');
expect(manifest.source_repository === 'eusourmr/chatgpt-skills', 'manifest source_repository must be eusourmr/chatgpt-skills');
expect(manifest.trust_file === 'trust/skills.json', 'manifest trust_file must point to trust/skills.json');
expect(trust.schema_version === 1, `trust schema_version must be 1, got ${trust.schema_version}`);
expect(trust.generated_for_package === pkg.version, `trust data must target package ${pkg.version}`);

const skillIds = Object.keys(manifest.skills ?? {});
expect(skillIds.length === 12, `v0.4.0 must bundle 12 skills, got ${skillIds.length}`);
for (const [skillId, skill] of Object.entries(manifest.skills ?? {})) {
  expect(typeof skill.path === 'string' && skill.path.length > 0, `${skillId}: missing path`);
  expect(Array.isArray(skill.files) && skill.files.length > 0, `${skillId}: missing files`);
  expect(Boolean(trust.skills?.[skillId]), `${skillId}: missing Evidence Card`);
  const card = trust.skills?.[skillId];
  if (card) {
    expect(typeof card.name === 'string' && card.name.length > 0, `${skillId}: Evidence Card missing name`);
    expect(typeof card.summary === 'string' && card.summary.length > 0, `${skillId}: Evidence Card missing summary`);
    expect(Boolean(card.permissions), `${skillId}: Evidence Card missing permissions`);
    expect(Array.isArray(card.known_gaps), `${skillId}: Evidence Card known_gaps must be an array`);
  }
  for (const rel of skill.files ?? []) {
    try {
      await access(path.join(root, skill.path, rel));
    } catch {
      errors.push(`${skillId}: missing bundled file ${skill.path}/${rel}`);
    }
  }
}

for (const [bundle, ids] of Object.entries(manifest.bundles ?? {})) {
  expect(Array.isArray(ids) && ids.length > 0, `${bundle}: bundle must contain skills`);
  for (const skillId of ids ?? []) expect(Boolean(manifest.skills?.[skillId]), `${bundle}: unknown skill ${skillId}`);
}

for (const target of ['codex-cli', 'cursor', 'agents-portable', 'chatgpt-web']) {
  expect(Boolean(manifest.targets?.[target]), `missing target adapter metadata: ${target}`);
}
expect(manifest.targets?.['chatgpt-web']?.mode === 'export', 'ChatGPT Web target must be export-only');

try { await access(path.join(root, 'installer/index.js')); }
catch { errors.push('installer/index.js is missing'); }
try { await access(path.join(root, 'trust/skills.json')); }
catch { errors.push('trust/skills.json is missing'); }

if (errors.length) {
  console.error('Prepublish check failed:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Prepublish check OK: ${pkg.name}@${pkg.version}, ${skillIds.length} bundled skills, ${Object.keys(manifest.bundles).length} bundles, ${Object.keys(manifest.targets).length} targets, Evidence Cards complete.`);
