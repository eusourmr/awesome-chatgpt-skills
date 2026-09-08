#!/usr/bin/env node
import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const manifest = JSON.parse(await readFile(path.join(root, 'installer', 'manifest.json'), 'utf8'));
const explicitIndex = process.argv.indexOf('--path');
const explicit = explicitIndex >= 0 ? process.argv[explicitIndex + 1] : null;

const BLOCK = [
  { id: 'remote-shell-pipe', re: /(?:curl|wget)[^\n|]{0,240}\|\s*(?:sh|bash|zsh)\b/i, why: 'remote content piped directly to a shell' },
  { id: 'powershell-download-exec', re: /Invoke-WebRequest[\s\S]{0,240}Invoke-Expression/i, why: 'downloaded PowerShell content executed directly' },
  { id: 'destructive-root-delete', re: /\brm\s+-rf\s+\/(?:\s|$)/i, why: 'destructive deletion of filesystem root' },
  { id: 'explicit-secret-exfiltration', re: /ignore\s+(?:all\s+)?previous\s+instructions[\s\S]{0,240}(?:secret|token|password|credential)[\s\S]{0,240}(?:send|post|upload|exfiltrat)/i, why: 'instruction override combined with secret exfiltration' }
];
const SIGNALS = [
  { id: 'secret-reference', re: /(?:API_KEY|TOKEN|PASSWORD|SECRET|credential)/i },
  { id: 'network-reference', re: /(?:https?:\/\/|WebSocket|WebRTC|fetch\(|requests\.|openai)/i },
  { id: 'process-reference', re: /(?:child_process|subprocess|os\.system|exec\(|spawn\(|shell\s*=\s*True)/i }
];

async function walk(dir) {
  const out = [];
  for (const name of await readdir(dir)) {
    const full = path.join(dir, name);
    const info = await stat(full);
    if (info.isDirectory()) out.push(...await walk(full));
    else if (info.isFile()) out.push(full);
  }
  return out;
}

const roots = explicit
  ? [path.resolve(explicit)]
  : Object.values(manifest.skills).map((skill) => path.join(root, skill.path));
const seen = new Set();
let blocked = 0;
let signals = 0;
for (const scanRoot of roots) {
  for (const file of await walk(scanRoot)) {
    const key = path.resolve(file);
    if (seen.has(key)) continue;
    seen.add(key);
    let text;
    try { text = await readFile(file, 'utf8'); } catch { continue; }
    const rel = path.relative(root, file);
    for (const rule of BLOCK) {
      if (rule.re.test(text)) {
        blocked += 1;
        console.error(`BLOCK ${rule.id}: ${rel} — ${rule.why}`);
      }
    }
    for (const rule of SIGNALS) {
      if (rule.re.test(text)) {
        signals += 1;
        console.log(`SIGNAL ${rule.id}: ${rel}`);
      }
    }
  }
}
if (blocked) {
  console.error(`Security Gate v1: BLOCKED (${blocked} blocking finding(s), ${signals} informational signal(s))`);
  process.exit(1);
}
console.log(`Security Gate v1: PASS (${seen.size} files scanned, ${signals} informational signal(s))`);
