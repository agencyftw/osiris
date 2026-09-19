# Review of the June 3 commercial proposal

Reviewed September 19, 2026 against upstream commit `3f9e951304ac782a70a7f282f36e30410ed8aac1`. This is a source-grounded product disposition, not a running-system assessment or market/legal research. The [446-line original](original/PRD.md) is retained unchanged; its status remains Draft v0.2 and its checkboxes are not completed by this review.

| Original area | Current source evidence and decision |
| --- | --- |
| §§1–2: public-feed map as a starting point | **Retain the private-data hypothesis; revise the baseline.** Upstream is now a Next.js 16 application with numerous API routes and an `intel/server.js` entity-resolution service. “Only a map” and “no intelligence layer” are outdated descriptions. Reuse those components only where their behavior fits the selected use case. |
| §3, §7, §11: personas, pricing, competitor table and open-core split | **Decline as settled facts.** Revenue ranges, competitor prices/capabilities and willingness to pay are unvalidated assertions in this proposal. No pricing, licensing tier or launch promise is adopted. Its table's checkmarks describe aspirations, not delivered Agency FTW capabilities. |
| §4: public/commercial/private data tiers | **Retain source provenance and explicitly supplied private documents as the useful distinction.** Do not assume permission to redistribute feeds or access internal/paid systems. This transfer buys no feeds and imports no customer data. Existing public feeds are upstream capabilities, not Agency FTW maintenance-free guarantees. |
| §5.1, §5.4: extraction, correlation and persistence | **Retain a single-source, cited signal as the first product behavior.** `intel/server.js` already contains in-memory sanctions indexing and Wikidata lookups; it is not the proposed durable tenant signal store. Entity resolution must expose source/missing/derived distinctions, not silently fabricate intelligence. No cross-source correlation engine is claimed implemented. |
| §5.2, §8 phase 1, §9: Kubernetes, HPA, PostgreSQL/Redis and managed migration | **Decline mandatory topology and zero-downtime claims.** Upstream has Docker/Compose support; this transfer needs no cluster or database. Pick persistence/deployment from an actual executable slice. A dump/restore and rolling restart recipe does not establish zero downtime or migration safety. |
| §5.3, §6, §8 phases 2/5: tenancy, auth, audit, workspace | **Keep requirements conditional on accepting multiple principals/private data; do not claim them present.** `src/middleware.ts` is analytics middleware and excludes API routes; it is not tenant auth. This review establishes no SSO/SAML, PostgreSQL RLS, data-residency enforcement, compliance or isolation. A namespace or region field alone would not establish those guarantees. |
| §5.5: OpenClaw subscriptions/delivery | **Decline guessed API names as an integration contract.** The proposed `session_send`/`cron_wake` strings and `osiris-signals` interface are design sketches. No native delivery integration is transferred or enabled; any future integration must use the then-supported authenticated native contract and explicit message authorization. |
| §6: “zero RECON guardrails” | **Correct the outdated blanket claim.** `src/app/api/scanner/route.ts` restricts scan types, requires configured scanner credentials, rate-limits requests and invokes `src/lib/ssrf-guard.ts` for target validation. These are concrete guards, but not proof of tenant authorization or target ownership. No scan is run by this handover. |
| §7: air-gapped, day-one enterprise and compliance positioning | **Decline those acceptance claims.** The application contains external feed requests and analytics middleware; no offline deployment or enterprise assurance was tested. Avoid comparison claims without their own evidence. |
| §8: six phased weeks and Nx library | **Decline fixed schedule and imposed workspace tooling.** Preserve the intended sequence as historical context, but ship the single cited-signal behavior before commissioning auth/tenancy/connectors. Keep upstream's current project layout for this handover. |
| §10: rate limits/key rotation, legal risk and isolation mitigations | **Retain explicit limits and provenance; reject mitigation-as-proof.** Key rotation is not a substitute for provider authorization or service limits. Scope checks, RLS and audit logs require actual implementations/tests; none are introduced by this document. |

## Concrete evidence inspected

- [Upstream README](../../README.md), [package manifest](../../package.json), [Docker Compose](../../docker-compose.yml): current dashboard and hosting shape, not runtime qualification.
- [Middleware](../../src/middleware.ts): analytics requests and route matcher.
- [Scanner route](../../src/app/api/scanner/route.ts) and [target validation](../../src/lib/ssrf-guard.ts): existing bounded controls; not a complete security review.
- [Intelligence service](../../intel/server.js): existing in-memory public-source indexing/lookup.
- Original platform `.gitmodules` and gitlink: actual intended code dependency; no Osiris product code was embedded in the platform config snapshot.

The owner/home decision and proposal transfer are complete. Future implementation is an explicitly different task in this product repository, not an unclosed requirement of the Agents migration.
