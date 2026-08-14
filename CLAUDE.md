@AGENTS.md

# 台股雷達 TWScan

Next.js 16 + Tailwind 4 + TypeScript, deployed on Vercel (twscan.cc).
Taiwan financial market dashboard — indices, alerts, ETF, dividends, podcast summaries.

## Data

- All data is static JSON in `src/data/` — no API routes at build time
- Key files: `market-data.json`, `attention-stocks.json`, `disposition-stocks.json`, `etf-00981a.json`, `dividends.json`, `podcasts.json`, `shareholder-gifts.json`
- Data types defined in `src/data/config.ts` — this is the central type registry
- Data is pre-generated and committed; the site itself does NOT fetch from APIs
- `attention-stocks.json` / `disposition-stocks.json` / `dividends.json` auto-refresh daily at 17:30 via `scripts/refresh-and-deploy.sh` (launchd `com.cc.twscan-data-refresh`) — fetches official TWSE endpoints, commits + pushes only on change (Vercel auto-deploys)
- `market-data.json` / `podcasts.json` / `etf-00981a.json` / `shareholder-gifts.json` are still manually generated

## Architecture

- Server components (`page.tsx`) handle metadata + pass data to client components
- Client components (`client.tsx` / `dashboard-client.tsx`) handle sorting, tabs, filtering
- `DataTable<T>` in `src/components/DataTable.tsx` is the reusable generic sortable table — MUST use it for any new tabular data
- `dashboard-client.tsx` has custom components: GaugeBar, FadeSection, CardLink

## Conventions

- MUST use `config.ts` type interfaces — NEVER add untyped data
- NEVER modify JSON structure without updating corresponding TypeScript interfaces
- Taiwan stock convention: red = up, green = down (opposite of US)
- All formatting helpers in `src/lib/utils.ts` — use existing ones before creating new
- New pages follow pattern: `page.tsx` (server, metadata) + `client.tsx` (interactive)
