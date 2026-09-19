# Agency FTW product ownership

**Decision, September 19, 2026:** `agencyftw/osiris` is the product home for the Agency FTW Osiris proposal. Agency FTW owns this fork and its product decisions; repository administrator [@ptahdunbar](https://github.com/ptahdunbar) is the accountable maintainer. The upstream project remains [simplifaisoul/osiris](https://github.com/simplifaisoul/osiris), with its own maintainers and MIT license. Neither upstream ownership nor endorsement is implied.

This completes the transfer and assumption-review scope of [agents #47](https://github.com/agencyftw/agents/issues/47). It does not implement the proposal's enterprise edition. No deployment, image publication, paid feed, tenant data or production migration is introduced. The Agents gateway and infrastructure are not this product's runtime.

## What moved and why here

The archived platform PR [#178](https://github.com/agencyftw/platform/pull/178) contained a unique 446-line commercial PRD and a gitlink to the real Osiris repository, hidden within an automated configuration update. We preserve the [original proposal](original/PRD.md), [original submodule declarations](original/platform.gitmodules), exact hashes and commits in [provenance.json](provenance.json). The accompanying platform gateway configuration was not transferred.

An existing Agency FTW Osiris product repository was not found during the ownership audit. `agencyftw/os1.ai` is explicitly a parked Astro marketing site, so it is not an appropriate code owner. This fork instead retains the actual upstream code/history at `3f9e951304ac782a70a7f282f36e30410ed8aac1`; the original submodule pin `08097a662b1e4936c511d4e5c134cea41ab64f2f` is an ancestor and remains in that history. No package installation or application execution was required for this transfer.

## Accepted disposition

The [assumption review](assumption-review.md) supersedes the original proposal as current product direction. Keep the concrete private-data-to-traceable-signal use case as the product hypothesis. Reuse upstream UI/feed/inspection capabilities after evaluating their actual fit. Decline the old six-week delivery promise, default Kubernetes/Postgres/Nx commitment, unproven air-gap/compliance claims, unvalidated pricing and portrayal of proposed functionality as implemented.

The next implementation, if commissioned, belongs here: one explicitly supplied synthetic or authorized document → structured signal with source citation → human-visible inspection. It must first run without network/provider access using a deterministic fixture; any later LLM use needs an explicit provider/budget and expected output checks. It does not need tenants, paid connectors, production deployment or OpenClaw messages to establish that first behavior. This is a bounded product direction, not another migration tracking issue or a promise that enterprise work is already done.

## License and operation boundaries

The upstream root [MIT license](../../LICENSE) is unchanged. No root license was found at the original platform proposal commit; preserving that text does not establish it as MIT, approve commercial redistribution, or choose a license for Agency FTW's future proprietary additions. The original PRD remains a historical Agency FTW document with licensing unresolved. No upstream license or copyright notice was removed.

GitHub Actions are disabled on this new fork at transfer time. The inherited Docker publishing workflow targets pushes to `master`; enabling it would publish an image, which this source/proposal transfer does not authorize. A future maintainer may enable reviewed build checks separately from publication. No automatic deployment is configured by this handover.

Verify the preserved originals offline with:

```sh
python3 docs/agencyftw/verify-provenance.py
```

The original platform commit, PR and branch remain untouched in the archived repository. Product changes and assumption decisions now belong to this fork; the archived platform repository is no longer an active product inbox.
