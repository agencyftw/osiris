import { readFileSync, writeFileSync, appendFileSync, realpathSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const groups = ['Breaking changes', 'Features', 'Fixes', 'Documentation', 'Maintenance'];
const profiles = ['package', 'cli', 'desktop', 'web', 'service', 'infrastructure', 'documentation'];
function requireValue(condition, message) {
  if (!condition) throw new Error(message);
}
function text(value, label) {
  requireValue(typeof value === 'string' && value.trim().length > 0, `${label} must be nonempty text`);
  requireValue(!/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(value), `${label} contains control characters`);
  return value.trim();
}
function oneLine(value, label) {
  const result = text(value, label);
  requireValue(!/[\r\n]/.test(result), `${label} must be one line`);
  return result;
}
function url(value, label) {
  oneLine(value, label);
  let parsed;
  try { parsed = new URL(value); } catch { throw new Error(`${label} must be an HTTPS URL`); }
  requireValue(parsed.protocol === 'https:' && !parsed.username && !parsed.password, `${label} must be an HTTPS URL without credentials`);
  return parsed.href.replaceAll('(', '%28').replaceAll(')', '%29');
}
function label(value, field) {
  return oneLine(value, field).replaceAll('\\', '\\\\').replaceAll('[', '\\[').replaceAll(']', '\\]').replaceAll('|', '\\|');
}
function list(values, field, minimum = 0) {
  requireValue(Array.isArray(values) && values.length >= minimum, `${field} must contain at least ${minimum} item(s)`);
  return values;
}
function rejectUnknown(value, allowed, field) {
  requireValue(value && typeof value === 'object' && !Array.isArray(value), `${field} must be an object`);
  for (const key of Object.keys(value)) requireValue(allowed.includes(key), `${field}: unknown field ${key}`);
}

export function renderReleaseNotes(manifest) {
  rejectUnknown(manifest, ['schemaVersion', 'product', 'version', 'versionScheme', 'tag', 'profile', 'sourceCommit', 'previousTag', 'summary', 'highlights', 'media', 'access', 'requirements', 'upgrade', 'rollback', 'knownIssues', 'evidence', 'changes'], 'manifest');
  requireValue(manifest.schemaVersion === 1, 'schemaVersion must be 1');
  requireValue(profiles.includes(manifest.profile), 'profile is unsupported');
  const product = oneLine(manifest.product, 'product');
  const version = oneLine(manifest.version, 'version');
  const number = '(?:0|[1-9][0-9]*)';
  const prerelease = '(?:0|[1-9][0-9]*|[0-9]*[A-Za-z-][0-9A-Za-z-]*)';
  const versionScheme = manifest.versionScheme ?? 'semver';
  requireValue(['semver', 'revision', 'oci-digest'].includes(versionScheme), 'versionScheme must be semver, revision or oci-digest');
  if (versionScheme === 'semver') {
  requireValue(new RegExp(`^${number}\\.${number}\\.${number}(?:-${prerelease}(?:\\.${prerelease})*)?(?:\\+[0-9A-Za-z-]+(?:\\.[0-9A-Za-z-]+)*)?$`).test(version), 'version must be a semantic version');
  } else if (versionScheme === 'revision') {
    requireValue(/^[a-f0-9]{40}$/.test(version) && version === manifest.sourceCommit, 'revision version must equal the full sourceCommit');
  } else {
    requireValue(['service', 'infrastructure'].includes(manifest.profile), 'oci-digest requires a service or infrastructure profile');
    requireValue(/^sha256:[a-f0-9]{64}$/.test(version), 'OCI version must be an exact lowercase sha256 digest');
    requireValue(!Object.hasOwn(manifest, 'previousTag'), 'oci-digest does not support previousTag or GitHub comparison refs');
  }
  const tag = oneLine(manifest.tag, 'tag');
  requireValue(!/[`\s]/.test(tag), 'tag must not contain whitespace or backticks');
  if (versionScheme === 'oci-digest') requireValue(/^[A-Za-z0-9_][A-Za-z0-9_.-]{0,127}$/.test(tag), 'OCI tag must follow the native 1-to-128-character tag grammar');
  requireValue(/^[a-f0-9]{40}$/.test(manifest.sourceCommit), 'sourceCommit must be a full commit SHA');
  if (versionScheme === 'revision') requireValue(!tag.includes('..') && new RegExp(`^[A-Za-z0-9][A-Za-z0-9._-]*-${manifest.sourceCommit}$`).test(tag), 'revision tag must use a safe native prefix followed by the full sourceCommit');
  const lines = [`# ${product} ${version}`, '', text(manifest.summary, 'summary'), ''];
  if (manifest.media !== undefined) {
    for (const item of list(manifest.media, 'media')) {
      rejectUnknown(item, ['label', 'url'], 'media item');
      lines.push(oneLine(item.label, 'media label'), '', url(item.url, 'media URL'), '');
    }
  }
  for (const item of list(manifest.highlights, 'highlights', 1)) {
    rejectUnknown(item, ['title', 'body'], 'highlight');
    lines.push(`## ${oneLine(item.title, 'highlight title')}`, '', text(item.body, 'highlight body'), '');
  }
  lines.push(`## Get ${version}`, '', '| Platform or audience | Install or access |', '| --- | --- |');
  for (const item of list(manifest.access, 'access', 1)) {
    rejectUnknown(item, ['kind', 'label', 'url', 'instructions', 'sha256', 'provenance'], 'access item');
    requireValue(['install', 'download', 'open', 'docs'].includes(item.kind), 'access kind must be install, download, open or docs');
    if (item.kind === 'download') requireValue(item.sha256 && item.provenance, 'downloads require sha256 and provenance');
    const name = label(item.label, 'access label');
    const instructions = label(item.instructions, 'access instructions');
    lines.push(`| ${name} | [${instructions}](${url(item.url, 'access URL')}) |`);
    if (item.sha256 !== undefined) requireValue(/^[a-f0-9]{64}$/.test(item.sha256), 'sha256 must contain 64 lowercase hex characters');
    if (item.provenance !== undefined) url(item.provenance, 'provenance URL');
  }
  lines.push('', '## Requirements', '');
  for (const item of list(manifest.requirements, 'requirements', 1)) lines.push(`- ${oneLine(item, 'requirement')}`);
  lines.push('', '## Upgrade', '', text(manifest.upgrade, 'upgrade'), '', '## Rollback', '', text(manifest.rollback, 'rollback'), '', '## Known issues', '');
  for (const item of list(manifest.knownIssues, 'knownIssues', 1)) lines.push(`- ${oneLine(item, 'known issue')}`);
  lines.push('', '## Build evidence', '', `Source commit: \`${manifest.sourceCommit}\``, '', `Release tag: \`${tag}\``, '');
  for (const item of list(manifest.evidence, 'evidence', 1)) {
    rejectUnknown(item, ['label', 'url'], 'evidence item');
    lines.push(`- [${label(item.label, 'evidence label')}](${url(item.url, 'evidence URL')})`);
  }
  for (const item of manifest.access) {
    if (item.sha256) lines.push(`- ${label(item.label, 'access label')} SHA-256: \`${item.sha256}\``);
    if (item.provenance) lines.push(`- [${label(item.label, 'access label')} provenance](${url(item.provenance, 'provenance URL')})`);
  }
  rejectUnknown(manifest.changes, groups, 'changes');
  let changes = 0;
  for (const group of groups) {
    if (manifest.changes[group] === undefined) continue;
    const items = list(manifest.changes[group], group);
    if (!items.length) continue;
    lines.push('', `## ${group}`, '');
    for (const item of items) { lines.push(`- ${oneLine(item, 'change')}`); changes++; }
  }
  requireValue(changes > 0, 'changes must contain at least one entry');
  if (manifest.previousTag !== undefined) {
    const previous = oneLine(manifest.previousTag, 'previousTag');
    const evidence = manifest.evidence.find(item => item.label === 'Repository');
    requireValue(evidence, 'previousTag requires a Repository evidence link');
    const repo = url(evidence.url, 'Repository URL').replace(/\/$/, '');
    requireValue(/^https:\/\/github\.com\/[^/]+\/[^/?#]+$/.test(repo), 'Repository must name a GitHub repository');
    lines.push('', `[Full changelog](${repo}/compare/${encodeURIComponent(previous)}...${encodeURIComponent(tag)})`);
  }
  return `${lines.join('\n').trim()}\n`;
}

if (process.argv[1] && import.meta.url === pathToFileURL(realpathSync(process.argv[1])).href) {
  try {
    const [, , input, output] = process.argv;
    requireValue(input && output, 'Usage: node render.mjs <manifest.json> <notes.md>');
    const destination = resolve(output);
    requireValue(!/[\r\n]/.test(destination), 'output path must be one line');
    requireValue(destination !== resolve(input), 'output must not overwrite the manifest');
    const rendered = renderReleaseNotes(JSON.parse(readFileSync(input, 'utf8')));
    writeFileSync(destination, rendered);
    if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `body-path=${destination}\n`);
    console.log(`Rendered release notes: ${destination}`);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
