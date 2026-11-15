# Native image release notes

The existing Docker publisher builds and pushes both linux/amd64 and linux/arm64.
After a successful push, it passes the actual OCI index digest and exact source
SHA to the pinned canonical notes renderer. It retains the resulting Markdown as
a 90-day workflow artifact named for the native run and attempt. The digest is the release version; the tag comes from the existing Docker
metadata output rather than an invented application version.

This adapter creates no GitHub release, tag or deployment. It does not qualify
application behavior, image startup, production traffic or DNS. Preserve the
upstream relationship and production rollback lane in [architecture](architecture.md).
The existing publisher's tags, multi-platform build, cache and registry authority
remain unchanged. The canonical renderer snapshot includes exact source/blob and
SHA256 receipts under `.github/actions/render-release-notes/`.
