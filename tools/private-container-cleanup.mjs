import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

export function previewPr(tags) {
  if (!Array.isArray(tags) || tags.length === 0) return undefined;
  const prs = tags.map(tag => /^preview-pr-([1-9]\d*)-run-[1-9]\d*-[1-9]\d*-g[a-f0-9]{12}$/.exec(tag)?.[1]);
  return prs.every(pr => pr && pr === prs[0]) ? Number(prs[0]) : undefined;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const repository = process.env.GITHUB_REPOSITORY;
  if (!/^(agencyftw|PirateSchool)\/[A-Za-z0-9_.-]+$/.test(repository || '')) throw new Error('Unsupported repository');
  const [owner, name] = repository.split('/');
  const api = (path, ...args) => execFileSync('gh', ['api', path, ...args], { encoding: 'utf8' });
  const endpoint = `/orgs/${owner}/packages/container/${name.toLowerCase()}`;
  const metadata = JSON.parse(api(endpoint));
  if (metadata.visibility !== 'private') throw new Error('Private container required');
  if (metadata.repository?.full_name && metadata.repository.full_name !== repository) throw new Error('Foreign source repository');
  const onlyPr = process.env.PR_NUMBER;
  if (onlyPr && !/^[1-9]\d*$/.test(onlyPr)) throw new Error('Invalid PR number');
  const versions = JSON.parse(api(`${endpoint}/versions?per_page=100`, '--paginate', '--slurp')).flat();
  for (const version of versions) {
    const pr = previewPr(version.metadata?.container?.tags);
    if (!pr || (onlyPr && pr !== Number(onlyPr))) continue;
    if (JSON.parse(api(`/repos/${repository}/pulls/${pr}`)).state !== 'closed') continue;
    // Re-read tags immediately before deletion so stable aliases protect a digest.
    const current = JSON.parse(api(`${endpoint}/versions/${version.id}`));
    if (previewPr(current.metadata?.container?.tags) !== pr) continue;
    api(`${endpoint}/versions/${version.id}`, '--method', 'DELETE');
    console.log(`Deleted closed PR ${pr} container preview ${version.id}`);
  }
}
