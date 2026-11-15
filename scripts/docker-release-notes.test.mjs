import assert from 'node:assert/strict';
import test from 'node:test';
import { nativeReleaseNotes } from './docker-release-notes.mjs';

test('native image notes retain actual immutable identity and reject malformed publication outputs', () => {
  const env={RELEASE_SOURCE_SHA:'a'.repeat(40),RELEASE_DIGEST:'sha256:'+'b'.repeat(64),GITHUB_REPOSITORY:'agencyftw/osiris',RELEASE_NATIVE_TAG:'sha-aaaaaaaa'};
  const notes=nativeReleaseNotes([],env);
  assert.ok(notes.includes(`ghcr.io/agencyftw/osiris@${env.RELEASE_DIGEST}`));
  assert.ok(notes.includes(env.RELEASE_SOURCE_SHA));
  assert.match(notes,/not proof of a production rollout/);
  assert.match(notes,/## Rollback/);
  assert.throws(()=>nativeReleaseNotes([],{...env,RELEASE_DIGEST:'latest'}));
  assert.throws(()=>nativeReleaseNotes([],{...env,RELEASE_NATIVE_TAG:'ghcr.io/owner/image:latest'}));
  assert.throws(()=>nativeReleaseNotes([],{...env,RELEASE_SOURCE_SHA:'master'}));
  assert.throws(()=>nativeReleaseNotes([],{...env,GITHUB_REPOSITORY:'other/osiris'}));
});
