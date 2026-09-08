#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { access, mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import process from 'node:process';
import readline from 'node:readline/promises';
import { fileURLToPath } from 'node:url';
import { createZip } from './zip.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.resolve(here, '..');
const manifest = JSON.parse(await readFile(path.join(here, 'manifest.json'), 'utf8'));
const trust = JSON.parse(await readFile(path.join(packageRoot, 'trust', 'skills.json'), 'utf8'));
const execution = JSON.parse(await readFile(path.join(packageRoot, 'trust', 'execution.json'), 'utf8'));
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
    return !['--bundle', '--profile', '--skill', '--tool', '--target', '--scope', '--config'].includes(prev);
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
function normalizeSourceRef(ref) {
  return ref.replace(/^https?:\/\/github\.com\//i, '').replace(/\/+$/, '');
}
async function loadExternalSources() {
  const result = {};
  const dir = path.join(packageRoot, 'sources', 'external');
  if (!(await exists(dir))) return result;
  for (const name of (await readdir(dir)).filter((item) => item.endsWith('.json')).sort()) {
    const record = JSON.parse(await readFile(path.join(dir, name), 'utf8'));
    if (record.repository) result[record.repository] = record;
  }
  return result;
}
const externalSources = await loadExternalSources();

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
    note: 'Prepara a pasta legível e um ZIP determinístico por skill para upload. Isto não instala diretamente no ChatGPT Web.'
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
  if (Object.keys(externalSources).length) console.log(`External sources indexed: ${Object.keys(externalSources).length}`);
  process.exit(0);
}

if (command === 'inspect') {
  const inspectRef = positional(0);
  if (!inspectRef) {
    console.error('Uso: chatgpt-skills inspect <skill-id|owner/repo|github-url>');
    console.error(`Bundled skills: ${Object.keys(manifest.skills).join(', ')}`);
    process.exit(2);
  }

  const rawCard = trust.skills?.[inspectRef];
  if (!rawCard) {
    const sourceRef = normalizeSourceRef(inspectRef);
    const source = externalSources[sourceRef];
    if (!source) {
      console.error(`Skill ou fonte externa não encontrada: ${inspectRef}`);
      process.exit(1);
    }
    console.log(`Fonte externa: ${source.repository}`);
    console.log(`Origem: ${source.source_url}`);
    console.log(`Descoberta: ${source.discovery_state}`);
    console.log(`Confiança: ${source.trust_state}`);
    console.log(`Commit imutável: ${source.immutable_ref}`);
    console.log(`Licença: ${source.license}`);
    console.log(`Skills observadas: ${source.skill_count}`);
    console.log(`Último push observado: ${source.last_push || 'desconhecido'}`);
    console.log(`Alertas: ${source.warnings?.length ? source.warnings.join(', ') : 'nenhum'}`);
    console.log(`Política: ${source.policy}`);
    process.exit(0);
  }

  const skillId = inspectRef;
  const executionCard = execution.skills?.[skillId];
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
  if (executionCard) {
    console.log(`Execução: ${executionCard.mode} — evidência=${executionCard.evidence_state}`);
    console.log(`Setup mínimo: ${executionCard.minimum_setup}`);
    console.log(`Capacidades obrigatórias: ${executionCard.required_capabilities.length ? executionCard.required_capabilities.join(', ') : 'nenhuma'}`);
    console.log(`Evidência de execução: ${executionCard.evidence}`);
  } else {
    console.log('Execução: unknown — sem classificação registrada');
  }
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
  if (config.mode === 'export') warn('este artefato foi preparado para upload; doctor confirma integridade local, não instalação no ChatGPT Web');

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

  if (config.mode === 'export' && config.upload_packages) {
    for (const [skillId, upload] of Object.entries(config.upload_packages)) {
      try {
        const packageBytes = await readFile(upload.path);
        if (digest(packageBytes) !== upload.sha256) issue(`${skillId}: ZIP de upload modificado ou corrompido`);
        else ok(`${skillId}: ZIP de upload íntegro`);
      } catch (error) {
        issue(`${skillId}: ZIP de upload ausente ou ilegível (${error.code || error.message})`);
      }
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
  const requestedSkill = valueOf('--skill');
  if (requestedSkill && (requestedBundle || profileBundle)) throw new Error('use --skill ou --bundle/--profile, não ambos');

  const bundle = requestedSkill ? null : (requestedBundle || profileBundle || (yes ? 'developer' : await choose(rl, 'Qual é o seu perfil?', profiles)));
  const selectedSkills = requestedSkill ? [requestedSkill] : manifest.bundles[bundle];
  if (requestedSkill && !manifest.skills[requestedSkill]) throw new Error(`Skill inexistente: ${requestedSkill}`);
  if (!requestedSkill && !selectedSkills) throw new Error(`Bundle inexistente: ${bundle}`);

  const tool = valueOf('--tool') || (yes ? 'codex-cli' : await choose(rl, 'Qual destino você usa?', tools));
  const scope = valueOf('--scope') || 'project';
  if (!['project', 'user'].includes(scope)) throw new Error('scope deve ser project ou user');
  const adapter = adapters[tool];
  if (!adapter) throw new Error(`Destino inexistente: ${tool}`);
  if (tool === 'chatgpt-web' && scope === 'user' && !valueOf('--target')) throw new Error('ChatGPT export não possui instalação global; use --scope project ou --target');

  const targetRoot = path.resolve(valueOf('--target') || adapter.target(scope));
  const configPath = path.resolve(adapter.config(targetRoot));
  await mkdir(targetRoot, { recursive: true });
  const installed = [];
  const fileHashes = {};
  const uploadPackages = {};

  for (const skillId of selectedSkills) {
    const skill = manifest.skills[skillId];
    if (!skill) throw new Error(`Manifesto inconsistente: ${skillId}`);
    const targetSkill = path.join(targetRoot, skillId);
    fileHashes[skillId] = {};
    const zipEntries = [];

    for (const rel of skill.files) {
      const source = packagedFile(skill.path, rel);
      const data = await readFile(source);
      const out = path.join(targetSkill, rel);
      await mkdir(path.dirname(out), { recursive: true });
      await writeFile(out, data);
      fileHashes[skillId][rel] = digest(data);
      zipEntries.push({ name: `${skillId}/${rel.replaceAll('\\', '/')}`, data });
    }

    if (adapter.mode === 'export') {
      const packageDir = path.join(path.dirname(targetRoot), 'packages');
      await mkdir(packageDir, { recursive: true });
      const zipBytes = createZip(zipEntries);
      const zipPath = path.join(packageDir, `${skillId}.zip`);
      await writeFile(zipPath, zipBytes);
      uploadPackages[skillId] = { format: 'zip', path: zipPath, sha256: digest(zipBytes) };
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
    selection: requestedSkill ? { type: 'skill', id: requestedSkill } : { type: 'bundle', id: bundle },
    bundle,
    skill: requestedSkill || null,
    adapter: tool,
    mode: adapter.mode,
    scope,
    installed_at: new Date().toISOString(),
    target: targetRoot,
    enabled_skills: installed,
    file_hashes: fileHashes,
    upload_packages: adapter.mode === 'export' ? uploadPackages : undefined
  };
  await writeFile(configPath, JSON.stringify(config, null, 2) + '\n', 'utf8');
  console.log(`\n${adapter.mode === 'export' ? 'Exportação' : 'Instalação'} concluída: ${installed.length} skills`);
  console.log(`Versão: ${packageMeta.version}`);
  console.log(`Destino: ${targetRoot}`);
  console.log(`Configuração: ${configPath}`);
  console.log(`Adapter: ${adapter.label}`);
  console.log(adapter.note);
  if (adapter.mode === 'export') {
    console.log('Pacotes prontos para upload:');
    for (const [skillId, upload] of Object.entries(uploadPackages)) console.log(`- ${skillId}: ${upload.path} (sha256 ${upload.sha256})`);
    console.log('Próximo passo: onde Skills estiverem disponíveis, abra Plugins > Skills > Create > Upload from your computer e carregue um ZIP por skill.');
  }
} catch (error) {
  console.error(`Erro: ${error.message}`);
  process.exitCode = 1;
} finally {
  if (rl) rl.close();
}
