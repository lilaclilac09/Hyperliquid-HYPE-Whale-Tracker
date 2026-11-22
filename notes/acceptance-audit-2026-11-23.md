# Acceptance audit — 2026-11-23

Existing `lilaclilac09/Hyperliquid-HYPE-Whale-Tracker` work against
[ACCEPTANCE.md](../ACCEPTANCE.md). Reference: open-kernel-challenge PR #6,
`notes/acceptance-audit-2026-11-22.md`, read earlier in this audit session.

## Failing items

| Item | Source rule quoted | Evidence | Fix status |
|---|---|---|---|
| README run instructions produce a blank page | §6: "This repo's own … README instructions also apply." README: "This contains everything you need to run your app locally." | Vite serves index.html with no entrypoint script; Chromium reports zero root children and zero index.tsx module scripts. | Added the existing `/index.tsx` module entrypoint, not a second implementation. Dashboard now mounts and chart tooltip works locally. |
| Required Gemini key does not match the active feature set | §6: "This repo's own … README instructions also apply." README step 2: "Set the `GEMINI_API_KEY` … to your Gemini API key" | AI service is a removal-comment stub; App mounts only BotSimulator. Vite maps the env name, but no active application code consumes it. Browser/build checks succeeded without a key. | README no longer requires a key; no env file or secret added. |
| UI presents a local simulation as live connectivity | §5: "Demo ≠ product"; "if you cannot prove it on production, do not claim it is fixed." | Layout said LIVE/Mainnet Connected; cards said precompile source, Active QuickNode webhook and 42ms latency. BotSimulator generates prices/alerts locally via Math.random, no RPC/webhook request. | Corrected labels to simulation, local source, not connected and unmeasured latency. No backend added or production claim made. |
| Missing product status/next action | §5: "end with product status `LIVE` / `BLOCKED` / `LOCAL ONLY` + next human action in one line." | Original README ends with npm run dev. Homepage null, Pages 404, AI Studio link redirects to sign-in. | Added LOCAL ONLY and hosting/deployment next action. |
| Existing UI has no mobile screenshot and interaction proof | §4: "no screenshots = not done."; "UI merge/验收 reply with only text, or only stills and no interaction proof = incomplete." | UI was directly uploaded; no UI PR or proof appears in history. Only PR #1 changes policy tooling. | Captured 390×844 dashboard, chart tooltip, empty feed and animated chart-hover/scroll interaction outside git. |

## Inspection and root cause

Read README, AGENTS.md, CLAUDE.md, `.cursor/rules/acceptance.mdc`, all app,
component/service/config/type files, package.json, workflow, template and verifier.
Agent rules point to ACCEPTANCE.md, identical to the earlier-read meme.vote
standard. `git rev-parse --is-shallow-repository` → `false`. Read all eight
commit summaries (`git log --all --format=fuller --stat`) and product/policy
patches (`git log --all -p -- <paths>`).

Blank-page cause is observed, not a missing-key assumption: browser navigation
loads HTML with a root but no app script; zero root children; index.tsx exists
and imports the existing App. Adding its script mounts one root child and
renders the dashboard without a Gemini key. This disproves the key as a
necessary condition for the current dashboard. The local simulator is reachable
through index.tsx → App → Layout/BotSimulator. No production deployment or live
market data was established.

§2: original README readiness claim was runtime-tested, then corrected. No
unsupported verified/fixed doc claim found. PR #1 cites command output and a
pushed SHA; its historical external 107-test claim was not independently rerun.
Current PR-body checker output is recorded below rather than relying on it.

## Checks run with real output

`npm install` (exit 0):

```text
added 143 packages, and audited 144 packages in 5s
15 packages are looking for funding
  run `npm fund` for details
found 0 vulnerabilities
```

Install emitted node-domexception deprecation and allowScripts warnings for
three dependencies, as in the prior repo. Environment check: Node v24.22.3,
npm 11.19.1, `npm config get ignore-scripts` → `false`; Vite/esbuild ran without
approval/bypass. This is npm's dependency-script policy, not evidence of a
missing repo environment. No shared config was changed. No lockfile existed;
generated lockfile not committed, no dependency changes made.

`npm run dev -- --host 127.0.0.1` started Vite at port 3000, used for the browser
check. The host flag restricts it to loopback. Before patch, Playwright printed:

```text
Before patch: root children = 0
Before patch: index.tsx module script = 0
```

After the last product-source edit, ran `npm run build && npx tsc --noEmit`
(exit 0; TypeScript emitted no diagnostics):

```text
> hyperliquid-hype-whale-tracker@0.0.0 build
> vite build
vite v6.4.6 building for production...
transforming...
✓ 443 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                  1.10 kB │ gzip:   0.57 kB
dist/assets/index-CXLKH9U9.js  655.34 kB │ gzip: 194.25 kB
✓ built in 1.81s
```

Vite also warns that a minified chunk exceeds 500kB. No rule mandates bundle
size optimization here, so no code-splitting refactor was done. No test/lint
script or existing product test suite exists. Source inputs were unchanged
after these checks; adding this audit note does not require rerunning the build.

### Visual QA (§4), no key supplied

Playwright Chromium API using installed Google Chrome at 390×844, device scale
1, without mocked data/clock or injected application state. Waited for the
actual timer-generated chart line; hovered the chart to display a real tooltip,
then scrolled to the empty simulated-alert feed. Saved actual captured frames
as animated WebP with Pillow. Tools live in the external `_proof-tools` venv,
not repo dependencies. Output:

```text
Chart tooltip: 6:55:03 PM  price : 34.99792124749043
Root children: 1
Viewport: 390x844; real interaction: chart hover tooltip, then scroll to empty simulated feed
Runtime errors: []
Document width: 390
```

Proof paths (not committed):

- `/home/ubuntu/b2/_proof/Hyperliquid-HYPE-Whale-Tracker/390x844-dashboard.png`
- `/home/ubuntu/b2/_proof/Hyperliquid-HYPE-Whale-Tracker/390x844-chart-tooltip.png`
- `/home/ubuntu/b2/_proof/Hyperliquid-HYPE-Whale-Tracker/390x844-empty-feed.png`
- `/home/ubuntu/b2/_proof/Hyperliquid-HYPE-Whale-Tracker/390x844-dashboard-interaction.webp`

Visually inspected the tooltip still: simulation badge, changing price card,
not-connected webhook status, chart and tooltip all render. Tooltip extends
toward the viewport edge; not represented as a separate rule failure. Normal
mount/chart interaction and empty feed checked; pre-patch blank-root failure
was reproduced. No live RPC error/retry flow exists to exercise. Populated alert
rows, external transaction links and desktop layout were not exercised.

### Deployment/merge (§5)

`gh api repos/lilaclilac09/Hyperliquid-HYPE-Whale-Tracker --jq '{homepage,default_branch,description}'`:

```json
{"default_branch":"main","description":"v1 simulated data","homepage":null}
```

`gh api repos/lilaclilac09/Hyperliquid-HYPE-Whale-Tracker/pages` (exit 1):

```text
gh: Not Found (HTTP 404)
{"message":"Not Found","documentation_url":"https://docs.github.com/rest/pages/pages#get-a-apiname-pages-site","status":"404"}
```

Fetched README's AI Studio URL with
`curl -L --max-time 30 -sS -o /dev/null -w 'AI Studio link: HTTP %{http_code}; final URL: %{url_effective}\n' https://ai.studio/apps/drive/1avGwzAGI8tK_ZCG9uWAZ1M_uxG7lRzdT`.
Output (query parameters omitted):

```text
AI Studio link: HTTP 200; final URL: https://accounts.google.com/v3/signin/identifier
```

No Vercel/Netlify deployment URL found in historical tracked files. This app
was not observed on production; LOCAL ONLY means a locally rendered simulation,
not a live whale-monitoring product. Authenticated/unlinked deployments unknown.

Only PR #1: state MERGED, merge SHA
`689a83e9f6077e95799ea5d7f31d23da43cbe4b0`.
`git merge-base --is-ancestor 689a83e9f6077e95799ea5d7f31d23da43cbe4b0 origin/main`
returned exit 0.

### PR evidence (§8)

Fetched all PRs with
`gh pr list -R lilaclilac09/Hyperliquid-HYPE-Whale-Tracker --state all --json number,title,body,state`
and Python `subprocess.run` passed each body to `python scripts/check_acceptance.py`:

```text
PR count: 1
PR #1 (MERGED)
ACCEPTANCE.md: evidence closer complete
```

No missing historical PR closer found; merged body not modified.

### Secrets (§7)

Scanned every tracked blob across `git rev-list --all` for .env paths,
private-key markers, GitHub/AWS token patterns and long assigned
secret/password/API-key/token values, suppressing values:

```text
History commits scanned: 8
Tracked .env paths: []
Secret-pattern matches (values suppressed): []
Vercel/Netlify deployment URLs: []
Scope: heuristic scan, not a guarantee that no secrets exist.
```

## Production limitation (§7)

| field | value |
|---|---|
| blocked_on | No accessible verified deployment or live data integration. |
| evidence | Homepage null, Pages 404, AI Studio fetch returns sign-in; prices/alerts generated by Math.random. |
| impact | degraded: local simulation check complete, production acceptance unavailable. |
| human_action | Choose hosting and deploy simulation before claiming a live product. |
| not_doing | No localhost-as-production claim, fake RPC proof, new backend or deployment without authorization. |

## Not covered by any rule, not changed

Existing simulator effect depends on currentPrice: its three-second price update
can reset the five-second alert timer, which may prevent simulated alerts.
The short browser session observed the empty feed, not a populated one; a
long-running/discriminating timer test was not performed, so this is a
source-level risk, not a confirmed runtime diagnosis. No repo rule specifies
simulator alert timing; no timer refactor was made. Metadata still describes the
intended real-time tracker; README/UI explicitly identify current behavior as
simulation. No mandate was found to implement live-chain monitoring, shrink the
bundle, replace Tailwind CDN or redesign chart tooltips.

## Evidence closer

```txt
root cause: HTML never loaded the existing React entrypoint; README required a removed-feature key; UI overstated simulated data as connected/live; status and mobile proof were absent.
files changed: index.html; components/Layout.tsx; components/BotSimulator.tsx; README.md; notes/acceptance-audit-2026-11-23.md.
checks run: npm install exit 0; npm run build and npx tsc --noEmit exit 0; pre-patch empty-root repro; post-patch 390x844 chart tooltip/scroll interaction; PR checker complete; merge ancestry exit 0; deployment and history secret-pattern checks above.
manual QA: Visually inspected rendered mobile simulation and tooltip; PNGs and interaction WebP saved outside git; no key supplied.
verification: Dashboard mounts and chart interaction observed locally; not claimed production-fixed or live-chain connected.
remaining risks: Simulated data only; alert timing risk unmodified; no production verification; bundle warning; unlinked deployments/arbitrary secrets cannot be excluded.
manual steps: Owner opens audit PR; choose hosting and deploy simulation before claiming a live product.
safe to merge: yes
```
