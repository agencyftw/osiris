# Private container previews

Copy the workflows and tools directory into a publisher whose private GHCR package matches its repository name. This variant serves Agency FTW and PirateSchool repositories; adjust the validation command to preserve the repository gates. Existing stable Docker release workflows remain authoritative.

Same-repository PRs publish an immutable single-platform linux/amd64 image tagged preview-pr-N-run-RUN-ATTEMPT-gSHA. Fork PRs cannot publish. Existing package visibility must be private before publication. No latest or release tags move.

Closing a PR deletes only digests whose tags all match that PR preview namespace. Daily cleanup retries missed closes. Stable aliases, legacy tags, and untagged images are preserved. Previews disable attestations to avoid creating untagged child manifests. This retention deliberately does not delete stable release or multi-platform child images.

The cleanup uses trusted default-branch code and the repository GITHUB_TOKEN. Runtime helpers use dependency-free JavaScript so cleanup needs no package installation. Consumers authenticate using the organization read token and install the exact image shown in the job summary.
