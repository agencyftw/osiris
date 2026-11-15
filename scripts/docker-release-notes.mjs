import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderReleaseNotes } from '../.github/actions/render-release-notes/render.mjs';

export function nativeReleaseNotes(argv, environment = process.env) {
  const source = environment.RELEASE_SOURCE_SHA;
  assert.match(source ?? '', /^[a-f0-9]{40}$/);
  const manifest = JSON.parse(readFileSync(new URL('./docker-release-notes.json', import.meta.url), 'utf8'));
  const digest = environment.RELEASE_DIGEST;
  assert.match(digest ?? '', /^sha256:[a-f0-9]{64}$/);
  assert.equal(environment.GITHUB_REPOSITORY?.toLowerCase(), 'agencyftw/osiris');
  const identity = `ghcr.io/agencyftw/osiris@${digest}`;
  const tag = environment.RELEASE_NATIVE_TAG;
  assert.match(tag ?? '', /^[A-Za-z0-9_][A-Za-z0-9_.-]{0,127}$/);
  manifest.highlights.push({ title: 'Exact published image', body: `Immutable OCI index reference: ${identity}. Platforms: linux/amd64 and linux/arm64. Retain the native build provenance and SBOM with this digest.` });
  return renderReleaseNotes({ ...manifest, versionScheme: 'oci-digest', version: digest, sourceCommit: source, tag });
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const args = process.argv.slice(2), output = args.at(-1);
    assert.ok(output, 'A notes output path is required');
    const notes = nativeReleaseNotes(args);
    mkdirSync(dirname(resolve(output)), { recursive: true });
    writeFileSync(output, notes, { flag: 'wx' });
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
