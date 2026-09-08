#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { access, mkdir, readFile, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import process from 'node:process';
import readline from 'node:readline/promises';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.resolve(here, '..');
const manifest = JSON.parse(await readFile(path.join(here, 'manifest.json'), 'utf8'));
const trust = JSON.parse(await readFile(path.join(packageRoot, 'trust', 'skills.json'), 'utf8'));
const packageMeta = JSON.parse(await readFile(path.join(packageRoot, 'package.json'), 'utf8'));
const args = process.argv.slice(2);
const command = args[0] && !args[0].startsWith('-') ? args[0] : 'install';

function valueOf(flag) {
  const i = args.indexOf(flag);
  return i >= 0 ? args[i + 1] : undefined;
}
function has(flag) { return args.includes(flag); }
function positional(index) {
  const values = args.slice(1).filter((x, i, all) => {
    if (x.startsWith('-')) return false;
    const prev = all[i - 1];
    return !['--bundle', '--profile', '--tool', '--target', '--scope', '--config'].includes(prev);
  });
  return values[index];
}
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
function digest(data) { return createHash('sha256').update(data).digest('hex'); }
async function exists(candidate) {
  try { await access(candidate); return true; } catch { return false; }
}
async function choose(rl, question, items) {
  while (true) {
    const raw = (await rl.question(`${question}\n${choiceLabel(items)}\n> `)).trim();
    const n = Number(raw);
    if (Number.isInteger(n) && n >= 1 && n <= items.length) return items[n - 1].value;
    console.log('Escolha um número válido.');
  }
}

const adapters = {
  'codex-cli': {
    label: 'Codex CLI', mode: 'install',
    target: (scope) => scope === 'user' ? path.join(process.env.CODEX_HOME || path.join(os.homedir(), '.codex'), 'skills') : path.join(process.cwd(), '.codex', 'skills'),
    config: (target) => path.join(path.dirname(target), 'chatgpt-skills-config.json'),
    note: 'Instala em um diretório de skills descoberto pelo Codex no escopo selecionado.'
  },
  cursor: {
    label: 'Cursor', mode: 'install',
    target: (scope) => scope === 'user' ? path.join(os.homedir(), '.cursor', 'skills') : path.join(process.cwd(), '.cursor', 'skills'),
    config: (target) => path.join(path.dirname(target), 'chatgpt-skills-config.json'),
    note: 'Instala em .cursor/skills (projeto) ou ~/.cursor/skills (usuário).'
  },
  'agents-portable': {
    label: 'Portable Agent Skills', mode: 'install',
    target: (scope) => scope === 'user' ? path.join(os.homedir(), '.agents', 'skills') : path.join(process.cwd(), '.agents', 'skills'),
    config: (target) => path.join(path.dirname(target), 'chatgpt-skills-config.json'),
    note: 'Instala no diretório portátil .agents/skills.'
  },
  'chatgpt-web': {
    label: 'ChatGPT upload export', mode: 'export',
    target: () => path.join(process.cwd(), '.chatgpt-skills', 'export', 'skills'),
    config: (target) => path.join(path.dirname(target), 'chatgpt-skills-export.json'),
    note: 'Prepara arquivos para upload manual. Isto não instala diretamente no ChatGPT Web.'
  }
};

const profiles = [
  { label: 'Desenvolvedor', value: 'developer' },
  { label: 'Marketeiro', value: 'marketing-growth' },
  { label: 'Pesquisador', value: 'data-analyst' },
  { label: 'Estudante', value: 'education' }
];
const tools = [
  { label: 'Codex CLI', value: 'codex-cli' },
  { label: 'Cursor', value: 'cursor' },
  { label: 'Portable Agent Skills (.agents/skills)', value: 'agents-portable' },
  { label: 'ChatGPT (preparar para upload)', value: 'chatgpt-web' }
];

if (command === 'list') {
  console.log(`ChatGPT Skills ${packageMeta.version}`);
  console.log('Bundles:');
  for (const [name, skills] of Object.entries(manifest.bundles)) console.log(`- ${name}: ${skills.join(', ')}`);
  console.log('Targets:');
  for (const [name, adapter] of Object.entries(adapters)) console.log(`- ${name}: ${adapter.label} (${adapter.mode})`);
  process.exit(0);
}

if (command === 'inspect') {
  const skillId = positional(0);
  if (!skillId) {
    console.error('Uso: chatgpt-skills inspect <skill-id>');
    console.error(`Bundled skills: ${Object.keys(manifest.skills).join(', ')}`);
    process.exit(2);
  }
  const rawCard = trust.skills?.[skillId];
  if (!rawCard) {
    console.error(`Evidence Card não encontrada para: ${skillId}`);
    process.exit(1);
  }
  const card = {
    ...trust.defaults,
    ...rawCard,
    provenance: { ...(trust.defaults?.provenance || {}), ...(rawCard.provenance || {}) },
    integrity: { ...(trust.defaults?.integrity || {}), ...(rawCard.integrity || {}) },
    security: { ...(trust.defaults?.security || {}), ...(rawCard.security || {}) },
    maintenance: { ...(trust.defaults?.maintenance || {}), ...(rawCard.maintenance || {}) },
    recommendation: { ...(trust.defaults?.recommendation || {}), ...(rawCard.recommendation || {}) },
    compatibility: rawCard.compatibility || trust.defaults?.compatibility || [],
    external_capabilities: rawCard.external_capabilities || [],
    known_gaps: rawCard.known_gaps || trust.defaults?.known_gaps || []
  };
  console.log(`${card.name} (${skillId})`);
  console.log(`Resumo: ${card.summary}`);
  console.log(`Recomendação: ${card.recommendation.state}`);
  console.log(`Motivo: ${card.recommendation.reason}`);
  console.log(`Proveniência: ${card.provenance.state} — ${card.provenance.publisher} — ${card.provenance.license}`);
  console.log(`Integridade: ${card.integrity.state} — ${card.integrity.basis}`);
  console.log(`Permissões: arquivos=${card.permissions.local_files}; rede=${card.permissions.network}; segredos=${card.permissions.secrets}; processos=${card.permissions.process_execution}`);
  console.log(`Segurança: ${card.security.state} — ${card.security.notes}`);
  console.log('Compatibilidade:');
  for (const item of card.compatibility) console.log(`- ${item.surface}: ${item.state} — ${item.evidence}`);
  if (card.external_capabilities?.length) {
    console.log('Capacidades externas:');
    for (const dep of card.external_capabilities) console.log(`- ${dep.provider}: ${dep.type}; auth=${dep.authentication}; ações=${dep.action_class}`);
  } else {
    console.log('Capacidades externas: nenhuma dependência de ação obrigatória registrada.');
  }
  console.log(`Última verificação: ${card.maintenance.last_verified}`);
  console.log(`Lacunas conhecidas: ${card.known_gaps.length ? card.known_gaps.join('; ') : 'nenhuma registrada'}`);
  process.exit(0);
}

async function findDoctorConfig() {
  const explicit = valueOf('--config');
  if (explicit) return path.resolve(explicit);
  const candidates = [
    path.join(process.cwd(), '.codex', 'chatgpt-skills-config.json'),
    path.join(process.cwd(), '.cursor', 'chatgpt-skills-config.json'),
    path.join(process.cwd(), '.agents', 'chatgpt-skills-config.json'),
    path.join(process.cwd(), '.chatgpt-skills', 'export', 'chatgpt-skills-export.json'),
    path.join(process.cwd(), '.chatgpt', 'skills-config.json')
  ];
  const found = [];
  for (const candidate of candidates) if (await exists(candidate)) found.push(candidate);
  if (found.length === 1) return found[0];
  if (found.length > 1) throw new Error(`múltiplas configurações encontradas; use --config: ${found.join(', ')}`);
  throw new Error('nenhuma configuração encontrada; use --config ou execute install primeiro');
}

if (command === 'doctor') {
  let configPath;
  try { configPath = await findDoctorConfig(); }
  catch (error) { console.error(`Erro: ${error.message}`); process.exit(1); }
  let issues = 0;
  const issue = (message) => { issues += 1; console.log(`✗ ${message}`); };
  const ok = (message) => console.log(`✓ ${message}`);
  const warn = (message) => console.log(`! ${message}`);

  console.log(`ChatGPT Skills Doctor ${packageMeta.version}`);
  console.log(`Configuração: ${configPath}`);
  let config;
  try { config = JSON.parse(await readFile(configPath, 'utf8')); ok('configuração legível'); }
  catch (error) { issue(`não foi possível ler a configuração: ${error.message}`); process.exit(1); }

  if (config.package !== packageMeta.name) issue(`pacote inesperado: ${config.package ?? 'ausente'}`); else ok(`pacote ${config.package}`);
  const adapter = adapters[config.adapter || config.tool];
  if (!adapter) issue(`adapter desconhecido: ${config.adapter || config.tool || 'ausente'}`); else ok(`adapter ${config.adapter || config.tool} (${config.mode || adapter.mode})`);
  if (config.package_version !== packageMeta.version) warn(`instalação foi criada por ${config.package_version}; verificador atual é ${packageMeta.version}`); else ok(`versão ${config.package_version}`);
  if (config.distribution !== manifest.distribution) issue(`distribuição inesperada: ${config.distribution ?? 'ausente'}`); else ok(`distribuição ${config.distribution}`);
  if (!Array.isArray(config.enabled_skills) || config.enabled_skills.length === 0) issue('nenhuma skill habilitada registrada');

  const targetRoot = config.target ? path.resolve(config.target) : null;
  if (!targetRoot) issue('destino ausente na configuração'); else ok(`destino ${targetRoot}`);
  if (config.mode === 'export') warn('este artefato foi apenas preparado para upload; doctor não confirma instalação no ChatGPT Web');

  if (targetRoot && Array.isArray(config.enabled_skills)) {
    for (const skillId of config.enabled_skills) {
      const skill = manifest.skills[skillId];
      const recorded = config.file_hashes?.[skillId] || {};
      if (!skill && Object.keys(recorded).length === 0) { issue(`${skillId}: sem manifesto nem hashes registrados`); continue; }
      let healthy = true;
      const rels = Object.keys(recorded).length ? Object.keys(recorded) : (skill?.files || []);
      for (const rel of rels) {
        const installedPath = path.join(targetRoot, skillId, rel);
        try {
          const installed = await readFile(installedPath);
          const expectedHash = recorded[rel] || (skill && config.package_version === packageMeta.version ? digest(await readFile(packagedFile(skill.path, rel))) : null);
          if (!expectedHash) { warn(`${skillId}/${rel}: sem hash esperado disponível`); continue; }
          if (digest(installed) !== expectedHash) { healthy = false; issue(`${skillId}/${rel}: conteúdo modificado ou corrompido`); }
        } catch (error) { healthy = false; issue(`${skillId}/${rel}: arquivo ausente ou ilegível (${error.code || error.message})`); }
      }
      if (healthy) ok(`${skillId}: arquivos íntegros`);
    }
  }
  if (issues === 0) { console.log('\nSaúde da instalação: OK'); process.exit(0); }
  console.log(`\nSaúde da instalação: ${issues} problema(s) encontrado(s)`);
  process.exit(1);
}

if (command !== 'install') {
  console.error(`Comando desconhecido: ${command}. Use install, list, inspect ou doctor.`);
  process.exit(2);
}

const yes = has('--yes');
const rl = yes ? null : readline.createInterface({ input: process.stdin, output: process.stdout });
try {
  const requestedBundle = valueOf('--bundle');
  const profileBundle = valueOf('--profile');
  const bundle = requestedBundle || profileBundle || (yes ? 'developer' : await choose(rl, 'Qual é o seu perfil?', profiles));
  const tool = valueOf('--tool') || (yes ? 'codex-cli' : await choose(rl, 'Qual destino você usa?', tools));
  const scope = valueOf('--scope') || 'project';
  if (!['project', 'user'].includes(scope)) throw new Error('scope deve ser project ou user');
  if (!manifest.bundles[bundle]) throw new Error(`Bundle inexistente: ${bundle}`);
  const adapter = adapters[tool];
  if (!adapter) throw new Error(`Destino inexistente: ${tool}`);
  if (tool === 'chatgpt-web' && scope === 'user' && !valueOf('--target')) throw new Error('ChatGPT export não possui instalação global; use --scope project ou --target');

  const targetRoot = path.resolve(valueOf('--target') || adapter.target(scope));
  const configPath = path.resolve(adapter.config(targetRoot));
  await mkdir(targetRoot, { recursive: true });
  const installed = [];
  const fileHashes = {};
  for (const skillId of manifest.bundles[bundle]) {
    const skill = manifest.skills[skillId];
    if (!skill) throw new Error(`Manifesto inconsistente: ${skillId}`);
    const targetSkill = path.join(targetRoot, skillId);
    fileHashes[skillId] = {};
    for (const rel of skill.files) {
      const source = packagedFile(skill.path, rel);
      const data = await readFile(source);
      const out = path.join(targetSkill, rel);
      await mkdir(path.dirname(out), { recursive: true });
      await writeFile(out, data);
      fileHashes[skillId][rel] = digest(data);
    }
    installed.push(skillId);
    console.log(`✓ ${skillId}`);
  }
  await mkdir(path.dirname(configPath), { recursive: true });
  const config = {
    schema_version: 2,
    package: packageMeta.name,
    package_version: packageMeta.version,
    distribution: manifest.distribution,
    bundle,
    adapter: tool,
    mode: adapter.mode,
    scope,
    installed_at: new Date().toISOString(),
    target: targetRoot,
    enabled_skills: installed,
    file_hashes: fileHashes
  };
  await writeFile(configPath, JSON.stringify(config, null, 2) + '\n', 'utf8');
  console.log(`\n${adapter.mode === 'export' ? 'Exportação' : 'Instalação'} concluída: ${installed.length} skills`);
  console.log(`Versão: ${packageMeta.version}`);
  console.log(`Destino: ${targetRoot}`);
  console.log(`Configuração: ${configPath}`);
  console.log(`Adapter: ${adapter.label}`);
  console.log(adapter.note);
  if (adapter.mode === 'export') {
    console.log('Próximo passo: revise os arquivos e faça o upload pela interface de Skills do ChatGPT.');
  }
} catch (error) {
  console.error(`Erro: ${error.message}`);
  process.exitCode = 1;
} finally {
  if (rl) rl.close();
}
