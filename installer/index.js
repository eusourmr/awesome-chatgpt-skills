#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import readline from 'node:readline/promises';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.resolve(here, '..');
const manifest = JSON.parse(await readFile(path.join(here, 'manifest.json'), 'utf8'));
const packageMeta = JSON.parse(await readFile(path.join(packageRoot, 'package.json'), 'utf8'));
const args = process.argv.slice(2);
const command = args[0] && !args[0].startsWith('-') ? args[0] : 'install';

function valueOf(flag) {
  const i = args.indexOf(flag);
  return i >= 0 ? args[i + 1] : undefined;
}
function has(flag) { return args.includes(flag); }
function choiceLabel(items) { return items.map((x, i) => `${i + 1}) ${x.label}`).join('\n'); }
function inside(root, candidate) {
  const rel = path.relative(root, candidate);
  return rel === '' || (!rel.startsWith('..') && !path.isAbsolute(rel));
}
function packagedFile(skillPath, rel) {
  const skillRoot = path.resolve(packageRoot, skillPath);
  const source = path.resolve(skillRoot, rel);
  if (!inside(packageRoot, skillRoot) || !inside(skillRoot, source)) {
    throw new Error(`Caminho inválido no manifesto: ${skillPath}/${rel}`);
  }
  return source;
}
function digest(data) {
  return createHash('sha256').update(data).digest('hex');
}
async function choose(rl, question, items) {
  while (true) {
    const raw = (await rl.question(`${question}\n${choiceLabel(items)}\n> `)).trim();
    const n = Number(raw);
    if (Number.isInteger(n) && n >= 1 && n <= items.length) return items[n - 1].value;
    console.log('Escolha um número válido.');
  }
}

if (command === 'list') {
  console.log(`ChatGPT Skills ${packageMeta.version}`);
  console.log('Bundles:');
  for (const [name, skills] of Object.entries(manifest.bundles)) console.log(`- ${name}: ${skills.join(', ')}`);
  process.exit(0);
}

if (command === 'doctor') {
  const configPath = path.resolve(valueOf('--config') || path.join(process.cwd(), '.chatgpt', 'skills-config.json'));
  let issues = 0;
  const issue = (message) => {
    issues += 1;
    console.log(`✗ ${message}`);
  };
  const ok = (message) => console.log(`✓ ${message}`);
  const warn = (message) => console.log(`! ${message}`);

  console.log(`ChatGPT Skills Doctor ${packageMeta.version}`);
  console.log(`Configuração: ${configPath}`);

  let config;
  try {
    config = JSON.parse(await readFile(configPath, 'utf8'));
    ok('skills-config.json legível');
  } catch (error) {
    issue(`não foi possível ler a configuração: ${error.message}`);
    process.exit(1);
  }

  if (config.package !== packageMeta.name) issue(`pacote inesperado na configuração: ${config.package ?? 'ausente'}`);
  else ok(`pacote ${config.package}`);

  if (config.package_version !== packageMeta.version) {
    issue(`versão instalada ${config.package_version ?? 'ausente'} difere do verificador ${packageMeta.version}`);
    warn('execute o doctor com a mesma versão do pacote que fez a instalação para verificar integridade byte a byte');
  } else {
    ok(`versão ${config.package_version}`);
  }

  if (config.distribution !== manifest.distribution) issue(`distribuição inesperada: ${config.distribution ?? 'ausente'}`);
  else ok(`distribuição ${config.distribution}`);

  if (!Array.isArray(config.enabled_skills) || config.enabled_skills.length === 0) {
    issue('nenhuma skill habilitada registrada');
  }

  const targetRoot = config.target ? path.resolve(config.target) : null;
  if (!targetRoot) {
    issue('destino das skills ausente na configuração');
  } else {
    ok(`destino ${targetRoot}`);
  }

  if (targetRoot && Array.isArray(config.enabled_skills)) {
    for (const skillId of config.enabled_skills) {
      const skill = manifest.skills[skillId];
      if (!skill) {
        issue(`${skillId}: não existe no manifesto desta versão`);
        continue;
      }
      let skillHealthy = true;
      for (const rel of skill.files) {
        const expectedPath = packagedFile(skill.path, rel);
        const installedPath = path.join(targetRoot, skillId, rel);
        try {
          const [expected, installed] = await Promise.all([readFile(expectedPath), readFile(installedPath)]);
          if (digest(expected) !== digest(installed)) {
            skillHealthy = false;
            issue(`${skillId}/${rel}: conteúdo modificado ou corrompido`);
          }
        } catch (error) {
          skillHealthy = false;
          issue(`${skillId}/${rel}: arquivo ausente ou ilegível (${error.code || error.message})`);
        }
      }
      if (skillHealthy) ok(`${skillId}: arquivos íntegros`);
    }
  }

  if (issues === 0) {
    console.log('\nSaúde da instalação: OK');
    process.exit(0);
  }

  console.log(`\nSaúde da instalação: ${issues} problema(s) encontrado(s)`);
  process.exit(1);
}

if (command !== 'install') {
  console.error(`Comando desconhecido: ${command}. Use install, list ou doctor.`);
  process.exit(2);
}

const profiles = [
  { label: 'Desenvolvedor', value: 'developer' },
  { label: 'Marketeiro', value: 'marketing-growth' },
  { label: 'Pesquisador', value: 'data-analyst' },
  { label: 'Estudante', value: 'education' }
];
const tools = [
  { label: 'ChatGPT Web', value: 'chatgpt-web' },
  { label: 'Codex CLI', value: 'codex-cli' },
  { label: 'Cursor', value: 'cursor' }
];

const yes = has('--yes');
const rl = yes ? null : readline.createInterface({ input: process.stdin, output: process.stdout });
try {
  const requestedBundle = valueOf('--bundle');
  const profileBundle = valueOf('--profile');
  const bundle = requestedBundle || profileBundle || (yes ? 'developer' : await choose(rl, 'Qual é o seu perfil?', profiles));
  const tool = valueOf('--tool') || (yes ? 'codex-cli' : await choose(rl, 'Qual ferramenta você usa?', tools));
  if (!manifest.bundles[bundle]) throw new Error(`Bundle inexistente: ${bundle}`);

  const targetRoot = path.resolve(valueOf('--target') || path.join(process.cwd(), '.chatgpt', 'skills'));
  await mkdir(targetRoot, { recursive: true });
  const installed = [];
  for (const skillId of manifest.bundles[bundle]) {
    const skill = manifest.skills[skillId];
    if (!skill) throw new Error(`Manifesto inconsistente: ${skillId}`);
    const targetSkill = path.join(targetRoot, skillId);
    for (const rel of skill.files) {
      const source = packagedFile(skill.path, rel);
      const out = path.join(targetSkill, rel);
      await mkdir(path.dirname(out), { recursive: true });
      await writeFile(out, await readFile(source));
    }
    installed.push(skillId);
    console.log(`✓ ${skillId}`);
  }
  const configPath = path.join(path.dirname(targetRoot), 'skills-config.json');
  const config = {
    schema_version: 1,
    package: packageMeta.name,
    package_version: packageMeta.version,
    distribution: manifest.distribution,
    bundle,
    tool,
    installed_at: new Date().toISOString(),
    target: targetRoot,
    enabled_skills: installed
  };
  await writeFile(configPath, JSON.stringify(config, null, 2) + '\n', 'utf8');
  console.log(`\nInstalação concluída: ${installed.length} skills`);
  console.log(`Versão: ${packageMeta.version}`);
  console.log(`Destino: ${targetRoot}`);
  console.log(`Configuração: ${configPath}`);
} catch (error) {
  console.error(`Erro: ${error.message}`);
  process.exitCode = 1;
} finally {
  if (rl) rl.close();
}
