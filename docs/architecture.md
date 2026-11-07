# Osiris repository architecture

## Delivery boundary

`osirisai.live` is already authoritative on Cloudflare nameservers. Cloudflare
fronts the existing production application; this repository change standardizes
source governance and does not change DNS, the production origin, or traffic.

The repository retains its upstream relationship with
`simplifaisoul/osiris`. AgencyFTW-specific release changes must be attributable,
reviewed, and must not silently overwrite upstream history.

## Monorepo contract

- Node 24.21.0
- pnpm 11.18.0
- Nx 22.7.7 task graph
- TypeScript 5.9.3
- `web`: the root Next.js application
- `intel`: the optional Express intelligence service

The web application remains at the repository root to preserve the current
Vercel and Docker build roots. Nx gives both applications one explicit task
graph without forcing a production-root migration in the same change.

The lint gate covers repository tooling and executable configuration. The
legacy application source is still protected by the strict TypeScript and test
gates, but is not yet in the lint target: the inherited source has existing
rule violations and the monolithic map components exhaust ESLint's heap. Add
source directories to the lint target incrementally as those components are
split and their violations are retired; do not hide them with blanket rule
disables.

## Release and rollback

Pull requests run the shared AgencyFTW validation workflow. Docker publication
remains an independent release path. Production hosting and Cloudflare DNS are
unchanged by the monorepo adoption.

Before any future origin or Cloudflare routing change:

1. qualify the exact reviewed commit through the shared validation workflow;
2. preserve the current production origin and DNS values as the rollback lane;
3. verify a production-equivalent preview;
4. change one routing boundary at a time;
5. verify HTTP, TLS, security headers, telemetry, and rollback behavior.
