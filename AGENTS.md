# Agent guide — osirisai.live

The canonical architecture and delivery boundaries are documented in
[`docs/architecture.md`](docs/architecture.md). Read that file before changing
hosting, DNS, deployment, or upstream synchronization behavior.

## Repository commands

```bash
pnpm install
pnpm dev
pnpm build
pnpm validate
```

This repository uses the AgencyFTW Node 24, pnpm, Nx, and TypeScript monorepo
contract. Preserve the upstream `simplifaisoul/osiris` relationship and the
existing Cloudflare-fronted production rollback path.
