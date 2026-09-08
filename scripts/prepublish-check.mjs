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

const errors = [];
const expect = (condition, message) => {
  if (!condition) errors.push(message);
};

expect(pkg.name === 'chatgpt-skills', `package name must be chatgpt-skills, got ${pkg.name}`);
expect(/^\d+\.\d+\.\d+$/.test(pkg.version), `package version must be semver, got ${pkg.version}`);
expect(pkg.private === false, 'root package must be public');
expect(pkg.bin?.['chatgpt-skills'] === './installer/index.js', 'chatgpt-skills bin must point to ./installer/index.js');
expect(installerPkg.private === true, 'installer/package.json must remain private');
expect(manifest.schema_version === 2, `manifest schema_version must be 2, got ${manifest.schema_version}`);
expect(manifest.distribution === 'bundled', 'manifest distribution must be bundled');
expect(manifest.source_repository === 'eusourmr/chatgpt-skills', 'manifest source_repository must be eusourmr/chatgpt-skills');

for (const [skillId, skill] of Object.entries(manifest.skills ?? {})) {
  expect(typeof skill.path === 'string' && skill.path.length > 0, `${skillId}: missing path`);
  expect(Array.isArray(skill.files) && skill.files.length > 0, `${skillId}: missing files`);
  for (const rel of skill.files ?? []) {
    try {
      await access(path.join(root, skill.path, rel));
    } catch {
      errors.push(`${skillId}: missing bundled file ${skill.path}/${rel}`);
    }
  }
}

for (const [bundle, skillIds] of Object.entries(manifest.bundles ?? {})) {
  expect(Array.isArray(skillIds) && skillIds.length > 0, `${bundle}: bundle must contain skills`);
  for (const skillId of skillIds ?? []) {
    expect(Boolean(manifest.skills?.[skillId]), `${bundle}: unknown skill ${skillId}`);
  }
}

try {
  await access(path.join(root, 'installer/index.js'));
} catch {
  errors.push('installer/index.js is missing');
}

if (errors.length) {
  console.error('Prepublish check failed:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Prepublish check OK: ${pkg.name}@${pkg.version}, ${Object.keys(manifest.skills).length} bundled skills, ${Object.keys(manifest.bundles).length} bundles.`);
