#!/usr/bin/env node
import { readFile, writeFile } from 'node:fs/promises';
import process from 'node:process';

const args = process.argv.slice(2);
function valueOf(flag) {
  const i = args.indexOf(flag);
  return i >= 0 ? args[i + 1] : undefined;
}

const repo = valueOf('--repo');
const snapshotPath = valueOf('--snapshot');
const outputPath = valueOf('--output');

if ((!repo && !snapshotPath) || (repo && snapshotPath)) {
  console.error('Use exactly one: --repo owner/repo or --snapshot file.json');
  process.exit(2);
}

async function requestJson(url) {
  const headers = { Accept: 'application/vnd.github+json', 'User-Agent': 'chatgpt-skills-ingestor' };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  const response = await fetch(url, { headers });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${url}`);
  return response.json();
}

async function requestText(url) {
  const headers = { Accept: 'application/vnd.github.raw+json', 'User-Agent': 'chatgpt-skills-ingestor' };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  const response = await fetch(url, { headers });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${url}`);
  return response.text();
}

function yamlShape(text) {
  if (!text) return 'missing';
  const lines = text.split(/\r?\n/).filter((line) => line.trim() && !line.trim().startsWith('#'));
  const hasInterface = lines.some((line) => /^interface:\s*$/.test(line));
  const hasFlatInterfaceField = lines.some((line) => /^(display_name|short_description|default_prompt):\s*/.test(line));
  if (hasInterface) return 'current-interface-block';
  if (hasFlatInterfaceField) return 'legacy-flat-interface';
  return 'unrecognized';
}

function normalize(snapshot) {
  const warnings = [];
  if (!snapshot.license?.spdx_id && !snapshot.license_file_detected) warnings.push('license-unresolved');
  if (snapshot.audit_claimed_skill_count != null && snapshot.audit_claimed_skill_count !== snapshot.skills.length) warnings.push('stale-audit-count');

  const schemas = new Set(snapshot.skills.map((skill) => skill.openai_yaml_shape));
  if (schemas.has('legacy-flat-interface')) warnings.push('openai-yaml-legacy-shape');
  if (schemas.has('missing')) warnings.push('missing-openai-yaml');
  if (schemas.has('unrecognized')) warnings.push('openai-yaml-unrecognized-shape');

  return {
    schema_version: 1,
    source_type: 'github-skill-repository',
    repository: snapshot.repository,
    source_url: snapshot.source_url,
    immutable_ref: snapshot.immutable_ref,
    default_branch: snapshot.default_branch,
    last_push: snapshot.last_push || null,
    license: snapshot.license?.spdx_id || (snapshot.license_file_detected ? 'file-present-unresolved' : 'unresolved'),
    discovery_state: 'indexed',
    trust_state: 'not-evaluated',
    skill_count: snapshot.skills.length,
    skills: snapshot.skills.map((skill) => ({
      id: skill.id,
      path: skill.path,
      has_skill_md: Boolean(skill.has_skill_md),
      openai_yaml_shape: skill.openai_yaml_shape,
      source_owned: true,
      copied_into_cs: false
    })),
    warnings: [...new Set(warnings)].sort(),
    policy: 'Metadata-only discovery record. No external skill content is copied and no positive trust state is inferred from source claims.'
  };
}

async function liveSnapshot(fullName) {
  if (!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(fullName)) throw new Error('Invalid repository; use owner/repo');
  const api = `https://api.github.com/repos/${fullName}`;
  const meta = await requestJson(api);
  const ref = meta.default_branch;
  const branch = await requestJson(`${api}/branches/${encodeURIComponent(ref)}`);
  const immutableRef = branch.commit.sha;
  const root = await requestJson(`${api}/contents?ref=${immutableRef}`);
  const licenseFileDetected = root.some((item) => /^(license|copying)(\.|$)/i.test(item.name));

  const skills = [];
  for (const item of root.filter((entry) => entry.type === 'dir')) {
    const skillMd = await requestText(`${api}/contents/${encodeURIComponent(item.path)}/SKILL.md?ref=${immutableRef}`);
    if (!skillMd) continue;
    const openaiYaml = await requestText(`${api}/contents/${encodeURIComponent(item.path)}/agents/openai.yaml?ref=${immutableRef}`);
    skills.push({
      id: item.name,
      path: item.path,
      has_skill_md: true,
      openai_yaml_shape: yamlShape(openaiYaml)
    });
  }

  let auditClaimedSkillCount = null;
  const audit = await requestText(`${api}/contents/AUDIT_REPORT.md?ref=${immutableRef}`);
  if (audit) {
    const match = audit.match(/\*\*Total Skills:\*\*\s*(\d+)/i) || audit.match(/Structural Validation\s*\((\d+)\//i);
    if (match) auditClaimedSkillCount = Number(match[1]);
  }

  return {
    repository: fullName,
    source_url: meta.html_url,
    immutable_ref: immutableRef,
    default_branch: ref,
    last_push: meta.pushed_at,
    license: meta.license,
    license_file_detected: licenseFileDetected,
    audit_claimed_skill_count: auditClaimedSkillCount,
    skills
  };
}

const snapshot = snapshotPath
  ? JSON.parse(await readFile(snapshotPath, 'utf8'))
  : await liveSnapshot(repo);

const serialized = JSON.stringify(normalize(snapshot), null, 2) + '\n';
if (outputPath) await writeFile(outputPath, serialized, 'utf8');
else process.stdout.write(serialized);
