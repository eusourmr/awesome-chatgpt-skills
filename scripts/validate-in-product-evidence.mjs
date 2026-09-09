#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const tests = JSON.parse(fs.readFileSync(path.join(root, 'trust/in-product-tests.json'), 'utf8'));
const runs = JSON.parse(fs.readFileSync(path.join(root, 'trust/in-product-runs.json'), 'utf8'));
const execution = JSON.parse(fs.readFileSync(path.join(root, 'trust/execution.json'), 'utf8'));

const errors = [];
const isString = (v) => typeof v === 'string' && v.trim().length > 0;
const isSha256 = (v) => typeof v === 'string' && /^[a-f0-9]{64}$/.test(v);
const isCommit = (v) => typeof v === 'string' && /^[a-f0-9]{40}$/.test(v);
const uniqueStrings = (v) => Array.isArray(v) && v.every(isString) && new Set(v).size === v.length;
const distributions = new Set(['npm', 'github-pinned', 'local']);

if (tests.schema_version !== 1) errors.push('trust/in-product-tests.json schema_version must be 1');
if (runs.schema_version !== 1) errors.push('trust/in-product-runs.json schema_version must be 1');
if (!Array.isArray(tests.tests) || tests.tests.length === 0) errors.push('at least one in-product test plan is required');
if (!Array.isArray(runs.runs)) errors.push('runs must be an array');

const plans = new Map();
for (const [i, plan] of (tests.tests || []).entries()) {
  const where = `tests[${i}]`;
  if (!isString(plan.id)) errors.push(`${where}.id is required`);
  if (!isString(plan.skill_id)) errors.push(`${where}.skill_id is required`);
  if (plans.has(plan.id)) errors.push(`duplicate test plan id: ${plan.id}`);
  plans.set(plan.id, plan);
  const skillExecution = execution.skills?.[plan.skill_id];
  if (!skillExecution) errors.push(`${where} references unknown execution skill ${plan.skill_id}`);
  if (skillExecution && skillExecution.mode !== plan.execution_mode) {
    errors.push(`${where}.execution_mode does not match trust/execution.json`);
  }
  if (plan.surface !== 'chatgpt-skills') errors.push(`${where}.surface must be chatgpt-skills for in-product chat-native proof`);
  if (!Number.isInteger(plan.minimum_cases) || plan.minimum_cases < 1) errors.push(`${where}.minimum_cases must be a positive integer`);
  if (!Array.isArray(plan.cases) || plan.cases.length < plan.minimum_cases) {
    errors.push(`${where}.cases must meet minimum_cases`);
  }
  const caseIds = new Set();
  for (const [j, c] of (plan.cases || []).entries()) {
    const cWhere = `${where}.cases[${j}]`;
    if (!isString(c.id)) errors.push(`${cWhere}.id is required`);
    if (caseIds.has(c.id)) errors.push(`duplicate case id in ${plan.id}: ${c.id}`);
    caseIds.add(c.id);
    if (!isString(c.prompt)) errors.push(`${cWhere}.prompt is required`);
    if (!Array.isArray(c.expected_skill_ids) || !c.expected_skill_ids.every((x) => typeof x === 'string')) {
      errors.push(`${cWhere}.expected_skill_ids must be an array of strings`);
    }
    if ((c.expected_skill_ids || []).length > 3) errors.push(`${cWhere} exceeds the smallest-useful-set cap of 3 skills`);
  }
}

const passingBySkill = new Set();
for (const [i, run] of (runs.runs || []).entries()) {
  const where = `runs[${i}]`;
  const plan = plans.get(run.test_id);
  if (!plan) errors.push(`${where}.test_id references unknown test plan ${run.test_id}`);
  if (!isString(run.skill_id)) errors.push(`${where}.skill_id is required`);
  if (plan && run.skill_id !== plan.skill_id) errors.push(`${where}.skill_id must match its test plan`);
  if (!['pass', 'fail'].includes(run.result)) errors.push(`${where}.result must be pass or fail`);
  if (!isString(run.executed_at) || Number.isNaN(Date.parse(run.executed_at))) errors.push(`${where}.executed_at must be an ISO date/time`);
  if (!isString(run.product_surface)) errors.push(`${where}.product_surface is required`);
  if (!isString(run.package_version)) errors.push(`${where}.package_version is required`);
  if (!distributions.has(run.distribution)) errors.push(`${where}.distribution must be npm, github-pinned, or local`);
  if (!isCommit(run.source_revision)) errors.push(`${where}.source_revision must be a full lowercase 40-character commit SHA`);
  if (!isSha256(run.artifact_sha256)) errors.push(`${where}.artifact_sha256 must be a lowercase SHA-256`);
  if (!uniqueStrings(run.case_ids)) errors.push(`${where}.case_ids must be a unique array of strings`);
  if (!Array.isArray(run.assertions) || run.assertions.length === 0) errors.push(`${where}.assertions are required`);
  for (const [j, a] of (run.assertions || []).entries()) {
    if (!isString(a.case_id) || typeof a.pass !== 'boolean' || !isString(a.observed)) {
      errors.push(`${where}.assertions[${j}] requires case_id, boolean pass, and observed text`);
    }
  }
  if (run.result === 'pass') {
    const expectedCases = new Set((plan?.cases || []).map((c) => c.id));
    const covered = new Set(run.case_ids || []);
    if (plan && [...expectedCases].some((id) => !covered.has(id))) errors.push(`${where} pass result does not cover every planned case`);
    if ((run.assertions || []).some((a) => a.pass !== true)) errors.push(`${where} pass result contains a failed assertion`);
    passingBySkill.add(run.skill_id);
  }
}

for (const [skillId, info] of Object.entries(execution.skills || {})) {
  if (info.mode === 'chat-native' && info.evidence_state === 'tested' && !passingBySkill.has(skillId)) {
    errors.push(`${skillId} is chat-native/tested without a passing in-product evidence run`);
  }
}

if (errors.length) {
  console.error('In-product evidence validation failed:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`In-product evidence OK: ${plans.size} test plan(s), ${(runs.runs || []).length} recorded run(s).`);
