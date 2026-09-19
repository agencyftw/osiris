# PRD: Osiris Intelligence Platform — Commercial & Enterprise Edition

**Status:** Draft v0.2 (commercial reframe)
**Owner:** Agency FTW / o11y
**Date:** 2026-06-03
**Positioning:** Self-hosted Palantir Foundry alternative for teams who can't afford $100K/yr

---

## Executive Summary

Osiris (open source) is a map UI over public OSINT feeds. That's its ceiling — and also its floor.
The real Palantir moat is **not the map**. It's 23 years of proprietary data pipelines, classified
source integrations, and deep AI reasoning over *your organization's internal data*. Foundry charges
$100K+/yr and takes months to onboard because that data layer is genuinely hard.

**Our product:** Take Osiris's UI, strip away the public-feed dependency, and replace it with a
bring-your-own-data intelligence layer powered by LLMs and OpenClaw agents. Ship it as a self-hosted
K8s platform with day-1 value, enterprise governance, and a clear upgrade path to managed SaaS.

**Target:** Security teams, threat analysts, OSINT researchers, geopolitical risk teams — anyone who
needs Palantir's capabilities but cannot justify $100K/yr or 3-month onboarding.

---

## 1. The Problem (Reframed)

### What Osiris actually is
- A beautiful map dashboard over **public internet feeds** (USGS, OpenSky, FIRMS, NVD, t.me previews)
- No auth, no data persistence, no tenant isolation, no governance
- Sporadic data quality — if the public feed goes down, you see nothing
- Built fast on AI-generated code — impressive for a demo, not production-grade

### What Palantir Foundry actually is (the commercial benchmark)
- A **data fusion + intelligence platform** where the map is just one output
- Value = ingesting *your* data: threat feeds, internal logs, financial records, IoT streams,
  human intelligence reports, classified sources
- AI (AIP/Apollo) reasons over correlated data to surface patterns you'd never find manually
- Real example: watching APT groups move industry-to-industry, correlating supply chain incidents
  across geographies before they hit your sector
- Moat: 23 years of data connectors, compliance frameworks, governance, onboarding methodology

### The gap we fill
Osiris shows you the world map. Foundry shows you what matters to *your* organization.
We build the bridge: Osiris UI + enterprise data connectors + LLM intelligence layer + OpenClaw
agent delivery. Self-hosted, day-1 deployable, bring-your-own data.

---

## 2. Product Vision

**"Palantir Foundry for the other 99%"**

A self-hosted, open-core intelligence platform that:
1. Ingests both public OSINT feeds AND private/proprietary data sources
2. Runs LLM-powered extraction and correlation across all sources
3. Delivers structured, tenant-scoped intelligence to agents and humans
4. Ships with enterprise governance (auth, audit log, RECON policy, legal guardrails)
5. Runs anywhere K8s runs — on-prem, air-gapped, cloud, edge

**Internal use:** Agency FTW operates this as its own intelligence backbone — feeding OpenClaw agents
with real-world signals, enabling proactive automation vs reactive response.

**External (commercial):** License as managed SaaS or self-hosted enterprise. Target personas below.

---

## 3. Target Personas & Commercial Intent

### Tier 1 — Internal (Agency FTW)
OpenClaw agents consuming signals. Zero licensing cost. Proves the platform.

### Tier 2 — Self-hosted (Open Core, freemium)
- Small security teams (5-50 person orgs)
- OSINT researchers & threat analysts
- Junior analysts learning intelligence correlation (video creator's audience)
- Self-hosters who want the Patreon-tutorial crowd to actually succeed

**Revenue:** Hosted Helm chart + docs = free. Commercial license for:
- Private data connectors (Shodan paid, commercial threat feeds, internal SIEM)
- Multi-tenant workspace management UI
- SSO / SAML / audit log
- SLA support

### Tier 3 — Managed SaaS (enterprise target)
- Security teams at 50-500 person companies
- Geopolitical risk / travel security teams
- Critical infrastructure operators (healthcare, energy, finance)
- Defense contractors who can't afford Palantir but have classified-adjacent needs

**Revenue:** Per-seat or per-tenant SaaS. $500-5K/mo per organization.
ACV target: $6K-60K/yr (vs Palantir's $100K+ floor). Palantir's pricing creates the wedge.

### Tier 4 — Enterprise On-Prem
- Air-gapped deployments
- Government / defense adjacent (can't use SaaS)
- Full white-label + custom data connector buildouts

**Revenue:** Annual contracts, professional services. $50K-200K/yr.

---

## 4. Core Insight: Data Is the Moat

The video creator nails it: *"Nobody had trouble building a map. The trouble is getting good data."*

Palantir's moat = data quality + data depth. Ours = data flexibility + AI extraction + agent delivery.

### Data strategy: Three tiers

**Tier A — Public feeds (Osiris upstream, free)**
USGS, OpenSky, FIRMS, NVD, GDELT, OpenSanctions, public RSS, t.me/s/ previews.
These are Osiris's feeds. We call their `/api/*` routes. We don't maintain them.

**Tier B — Commercial feeds (paid connectors, revenue driver)**
- Shodan paid API (full internet scan data)
- Recorded Future / Mandiant / CrowdStrike threat intel
- FlightAware commercial (vs OpenSky's spotty public feed)
- AIS commercial maritime (vs free aisstream)
- Bloomberg/Reuters financial feeds
- Darkweb monitoring (commercial HUMINT feeds)

**Tier C — Your organization's data (the real Foundry play)**
- SIEM/SOAR logs (Splunk, Elastic, Sentinel)
- Internal ticketing (Jira, ServiceNow)
- HR travel records (for geopolitical risk)
- Custom threat watchlists
- Proprietary intelligence reports

**Key:** Tenants bring Tier C. We provide connectors. The LLM correlates across A+B+C.
That correlation is where Palantir makes its money. That's what we build.

---

## 5. Product Architecture

### 5.1 Platform Layers

```
┌──────────────────────────────────────────────────────────────┐
│  PRESENTATION LAYER                                           │
│  Osiris map UI (upstream, submodule)                         │
│  + Workspace dashboard (tenant config, signal feed, alerts)  │
│  + API (queryable signals, webhooks, agent subscriptions)    │
├──────────────────────────────────────────────────────────────┤
│  INTELLIGENCE LAYER  ← our core value                        │
│  Signal Extractor: feed → LLM → structured Signal            │
│  Correlation Engine: cross-source entity resolution          │
│  Digest Engine: batch → briefing → deliver                   │
│  OpenClaw Agent Bridge: session_send / cron_wake / webhook   │
├──────────────────────────────────────────────────────────────┤
│  DATA LAYER                                                   │
│  Tier A: Osiris public feeds (/api/*)                        │
│  Tier B: Commercial feed connectors (pluggable)              │
│  Tier C: Tenant private data connectors (SIEM, internal)     │
│  Storage: PostgreSQL (signals, tenants) + Redis (cache)      │
├──────────────────────────────────────────────────────────────┤
│  GOVERNANCE LAYER  ← enterprise differentiator               │
│  Auth: JWT/SAML/SSO                                          │
│  RECON policy: scope enforcement (legal guardrails)          │
│  Audit log: who queried what, when                           │
│  Data residency: tenant data never leaves their namespace    │
└──────────────────────────────────────────────────────────────┘
```

### 5.2 K8s Deployment (Helm)

```
┌──────────────────────────────────────────────────────────────┐
│  Kubernetes Cluster                                          │
│                                                              │
│  osiris-app (Deployment, HPA 2-10)                          │
│  signal-extractor (CronJob or Deployment)                   │
│  correlation-worker (Deployment)                            │
│  PostgreSQL (StatefulSet → managed migration path)          │
│  Redis (StatefulSet or managed)                             │
│  ingress-nginx (tenant routing: subdomain or header)        │
└──────────────────────────────────────────────────────────────┘
```

### 5.3 Multitenant Model

**Option B (default):** Shared cluster, namespace-isolated data, RLS in Postgres.
**Option A (high-security):** Namespace-per-tenant. Flip of a Helm value.

```typescript
interface Tenant {
  id: string;
  name: string;
  tier: "free" | "pro" | "enterprise";
  api_key: string;                    // hashed
  saml_entity_id?: string;            // SSO
  data_residency_region?: string;     // EU, US, etc.
  recon_policy: ReconPolicy;          // what RECON ops are allowed
  created_at: Date;
}

interface ReconPolicy {
  port_scan_allowed: boolean;         // default false — legal guardrail
  allowed_scan_targets: string[];     // CIDRs/domains tenant owns
  require_target_ownership_proof: boolean;
  audit_all_recon: boolean;           // always true for enterprise
}

interface TenantWorkspace {
  tenant_id: string;
  // Data source subscriptions
  public_feeds: string[];             // Tier A: ["news","gdelt","cyber","telegram"]
  commercial_connectors: string[];    // Tier B: ["shodan","recorded_future"]
  private_connectors: ConnectorConfig[]; // Tier C: SIEM, internal feeds
  // Intelligence filters
  keyword_watchlist: string[];
  entity_watchlist: string[];         // names, IPs, wallets, orgs
  geo_scope: GeoScope | null;         // optional bbox filter
  // OpenClaw agent delivery
  openclaw_subscriptions: OpenClawSignalSubscription[];
  // Alerting
  webhook_url: string | null;
  alert_email: string | null;
  min_alert_severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
}
```

### 5.4 Signal Extraction Pipeline

```
Data Sources (Tier A + B + C)
        │
        ▼
  Ingest Worker — poll, normalize, dedup (content hash)
        │
        ▼
  LLM Extraction (Gemini Flash / pluggable)
  — entities, severity, tags, action items, geo
  — tenant context injected into prompt
        │
        ▼
  Correlation Engine
  — cross-source entity resolution (same IP in news + SIEM + Telegram?)
  — APT campaign stitching
  — supply chain / sector trend detection
        │
        ▼
  Enrichment
  — OFAC SDN cross-check
  — Geo resolution
  — Tenant watchlist match scoring
        │
        ▼
  Delivery
  ├── OpenClaw session_send / cron_wake
  ├── Webhook POST
  ├── Email digest
  └── Persist → queryable /api/signals
```

### 5.5 Native OpenClaw Integration

```typescript
interface OpenClawSignalSubscription {
  agent_id: string;
  tenant_id: string;
  include: {
    sources?: string[];
    tags?: string[];
    min_severity?: Severity;
    geo_bbox?: [number, number, number, number];
    entities?: string[];
  };
  exclude: {
    sources?: string[];
    tags?: string[];
  };
  combine?: {
    window_minutes: number;       // batch into digest
    max_signals: number;
    digest_prompt?: string;
  };
  delivery: "session_send" | "cron_wake" | "webhook";
  session_key?: string;
  webhook_url?: string;
}
```

**`osiris-signals` skill** (OpenClaw native):
- `subscribe(filters)` — register agent for signal delivery
- `unsubscribe()` — remove subscription
- `query(filters)` — ad-hoc signal search
- `digest(window_minutes)` — on-demand briefing
- No Osiris UI dependency — works with signal-extractor service + DB only

---

## 6. Governance Layer (Enterprise Differentiator)

This is where Palantir earns its $100K. We must have it to sell enterprise.

### RECON Policy Enforcement
The video creator calls out the port scanning legal gray area explicitly — Osiris has zero guardrails.
Enterprise buyers **will not purchase** a tool that could expose them to legal liability.

```typescript
// Every RECON op checked against tenant policy before execution
async function enforceReconPolicy(
  tenantId: string,
  op: "port_scan" | "dns" | "whois" | "ssl" | "ip_intel",
  target: string
): Promise<{ allowed: boolean; reason?: string }> {
  const policy = await getTenantReconPolicy(tenantId);
  if (op === "port_scan" && !policy.port_scan_allowed) {
    return { allowed: false, reason: "Port scanning disabled by policy" };
  }
  if (op === "port_scan" && !isTargetInAllowedScope(target, policy.allowed_scan_targets)) {
    return { allowed: false, reason: "Target not in allowed RECON scope" };
  }
  await auditLog(tenantId, op, target);
  return { allowed: true };
}
```

### Audit Log
Every query, every RECON op, every signal access logged with `tenant_id + user_id + timestamp + target`.
Queryable by admins. Exportable (SOC 2 / ISO 27001 evidence).

### Data Residency
Tenant signal data tagged with `data_residency_region`. Query routing enforces region.
EU tenants → EU Postgres replica. Critical for GDPR compliance.

---

## 7. Commercial Positioning vs Competitors

| Capability | Osiris (raw) | **Our Platform** | Palantir Foundry |
|---|---|---|---|
| Public OSINT feeds | ✅ | ✅ (via upstream) | ❌ (not the focus) |
| Private/internal data | ❌ | ✅ Tier C connectors | ✅ Core product |
| LLM intelligence extraction | ⚠️ summary only | ✅ Full structured extraction | ✅ AIP |
| Cross-source correlation | ❌ | ✅ Correlation engine | ✅ |
| Multi-tenant | ❌ | ✅ | ✅ |
| OpenClaw agent delivery | ❌ | ✅ Native | ❌ |
| Self-hosted | ✅ | ✅ | ❌ |
| Air-gapped | ✅ | ✅ | ❌ |
| Governance / audit log | ❌ | ✅ | ✅ |
| RECON policy enforcement | ❌ | ✅ | N/A |
| Day-1 deployable | ✅ | ✅ | ❌ (months) |
| Cost | Free | $0-60K/yr | $100K+/yr |

**Wedge:** We beat Palantir on price, self-hosting, speed-to-value, and OpenClaw-native delivery.
We beat raw Osiris on data depth, intelligence quality, governance, and production-readiness.

---

## 8. Implementation Plan

### Phase 1 — K8s-ready foundation (Week 1)
- [ ] Helm chart `charts/osiris-platform/` — parameterized, HPA, health probes
- [ ] GitHub Actions: build → push GHCR `agencyftw/osiris` → deploy
- [ ] PostgreSQL StatefulSet + S3 backup CronJob (daily `pg_dump → gzip → S3`)
- [ ] Managed Postgres migration path (swap `DATABASE_URL` → zero-downtime)

### Phase 2 — Auth + Tenant Middleware (Week 2)
- [ ] PostgreSQL schema: `tenants`, `workspaces`, `recon_policies`, `audit_log`
- [ ] JWT/API key auth in `middleware.ts` — gate all `/api/*` except health
- [ ] Tenant config API: `GET/PUT /api/workspace`
- [ ] RECON policy enforcement wrapper
- [ ] Audit log writes on every op

### Phase 3 — Signal Extraction Pipeline (Week 3)
- [ ] `packages/signal-extractor/` — TypeScript, Nx library
- [ ] Tier A ingestors: news, GDELT, Telegram, cyber, seismic
- [ ] LLM extraction (Gemini Flash) + structured Signal schema
- [ ] Dedup (content hash), persist to `signals` table
- [ ] OpenClaw delivery: `session_send` + `cron_wake`

### Phase 4 — Correlation Engine (Week 4)
- [ ] Cross-source entity resolution (same entity across feeds)
- [ ] Sector/geo trend detection
- [ ] Digest engine: batch window → briefing → deliver

### Phase 5 — Tenant Workspace UI (Week 5)
- [ ] `/workspace` dashboard: signal feed, map pins, alert config
- [ ] Feed subscription editor
- [ ] RECON scope config (owned CIDRs/domains)
- [ ] Webhook + OpenClaw subscription management

### Phase 6 — Commercial Connectors (Week 6+)
- [ ] Shodan paid API connector
- [ ] Commercial threat feed adapter (Recorded Future / MISP)
- [ ] SIEM connector (Elastic / Splunk webhook ingest)
- [ ] SSO/SAML for enterprise tier

---

## 9. Postgres: Self-Hosted → Managed

### Self-hosted (K8s StatefulSet — default, day 1)
```yaml
# Helm: postgres.mode=statefulset (default)
storageClassName: gp3
storage: 50Gi
image: postgres:16-alpine
```

Backup CronJob (baked into Helm):
```bash
pg_dump $DATABASE_URL | gzip | aws s3 cp - s3://$S3_BUCKET/osiris/$(date +%Y%m%d-%H%M).sql.gz
# Retention: delete objects older than retentionDays
```

### Migration to managed (flip one Helm value)
```
1. pg_dump self-hosted → S3
2. Restore into managed instance
3. Set postgres.mode=external + postgres.externalUrl=...
4. Rolling pod restart → done
```

Supported managed targets: AWS RDS, Neon (serverless + branching per tenant), Supabase (adds auth/realtime), CloudNativePG (operator, stays in K8s).

**Recommendation:** Self-hosted StatefulSet → Neon for dev (branch per tenant) → RDS for prod.

---

## 10. Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Public feeds remain unreliable | Tier B commercial connectors fill gaps; public feeds = bonus, not baseline |
| Osiris upstream diverges | Submodule + thin fork policy; our value is not in the UI |
| Gemini rate limits at scale | Key rotation (up to 8); Redis rate limiting per tenant; pluggable LLM backend |
| RECON legal exposure | Policy enforcement layer + audit log; disabled by default |
| Tenant data isolation bugs | PostgreSQL RLS; middleware always injects tenant_id; integration tests |
| "Palantir replacement" hype trap | We don't claim it. We claim: "Palantir's workflow, at 1/10th the price, self-hosted" |

---

## 11. Open Questions → Decisions

| Question | Recommendation |
|---|---|
| Subdomain vs header tenant routing? | Subdomain (`tenant.osiris.domain`) — cleaner UX, SSL per tenant |
| Self-hosted Postgres vs RDS from day 1? | StatefulSet day 1; migrate to RDS/Neon at first enterprise contract |
| Signal delivery to OpenClaw: webhook or sessions_send? | Both — `session_send` for real-time, webhook for async/external |
| Tenants get map UI or just signal API? | Both; UI is free (Osiris upstream); API is where enterprise value is |
| Open source the intelligence layer? | Open core — signal-extractor OSS, commercial connectors + governance = paid |
| Pricing model? | Usage-based: free (public feeds only) → Pro $299/mo (commercial connectors) → Enterprise custom |
