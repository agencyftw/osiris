# Shared release disposition

The canonical configuration is [release-publication.json](release-publication.json). It is validated by the shared provider; it does not grant release, registry, cloud or deployment authority.

Shared publication is explicitly disabled. Shared publication is disabled: the inherited OCI publisher remains independent; private-provider access and an exact native OCI notes/readback adapter are not qualified.

## Existing native owner

`.github/workflows/docker-publish.yml` remains the native operation boundary. The inherited master/semver Docker publisher can publish images automatically when mainline source changes. A shared-disabled disposition does not disable or replace that existing publisher. Production origin, Cloudflare DNS and upstream history remain unchanged.

## Remaining qualification

- Qualify access to the canonical provider from this public fork without hand-copying generic code.
- Bind native image/manifest digests and actual source/run identity to canonical notes and registry readback.
- Review automatic image-publication side effects before merging; do not infer runtime deployment from registry publication.

The configured notes directory is reserved for future exact-source reviewed product content. No product version, tag, artifact, notes bundle or publication receipt is fabricated here. Source configuration validation is separate from native runtime and destination qualification.

The shared implementation belongs to `agencyftw/.github`. Do not add local formatters, validators, publication engines or retry loops to close these gaps. Native adapters must call its pinned APIs after their existing admission gates pass.

This public fork has no qualified access path to the private canonical provider. Its workflows remain unchanged. The configuration was validated against the exact shared core during preparation; hosted provider resolution and native adapter integration remain unqualified. Do not hand-copy the generic implementation to bypass access policy.
