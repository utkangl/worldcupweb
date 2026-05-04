# World Cup Pulse · FWC 2026

Live demo: **https://worldcupweb.vercel.app/**

Dark, neon-accented hub for **fixtures**, **knockout simulation**, **saved predictions**, **bracket mini-games**, and **share cards**. Data is static JSON; state persists in the browser where noted.

## Stack

| Layer | Choice |
| ----- | ------ |
| Framework | [Next.js 16](https://nextjs.org/) (App Router) · React 19 · TypeScript |
| Styling | Tailwind CSS v4 |
| State | [Zustand](https://github.com/pmndrs/zustand) + `persist` (simulator, predictions, etc.) |
| Dates | [date-fns](https://date-fns.org/) for countdowns and TRT formatting |
| Export | [html-to-image](https://github.com/bubkoo/html-to-image) for prediction share PNGs |

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — **Home** is the landing page (`/`).

### Scripts

| Command | Description |
| ------- | ----------- |
| `npm run dev` | Dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run lint` | ESLint |
| `npm run data:fixtures` | Regenerate fixture-related data (see `scripts/`) |

## App routes

| Path | What it does |
| ---- | -------------- |
| `/` | Hero, featured match strip, bento navigation |
| `/matches` | Match center: TRT-focused countdown, filters by day/stage, cards link to detail |
| `/matches/[id]` | Single match: scoreline, events, stats |
| `/simulator` | Group order, third-place flow, bracket steps + fullscreen-friendly KO navigation |
| `/predictions` | Podium, dark horse, awards form + local persistence + share card panel |
| `/games` | Mini-game arena: mode cards, bracket size, **fullscreen head-to-head** bracket, local pick leaderboard |
| `/privacy` | MVP privacy overview (localStorage, no accounts) |
| `/terms` | MVP terms of use (unofficial fan project, as-is) |

## MVP (launch-ready baseline)

This repo is aligned with a **shippable MVP**: core UX, static data, browser persistence, basic legal pages, SEO entry points, and error surfaces.

- [x] **Legal** — [`/privacy`](./src/app/privacy/page.tsx), [`/terms`](./src/app/terms/page.tsx); footer links.
- [x] **SEO** — [`src/app/sitemap.ts`](./src/app/sitemap.ts), [`src/app/robots.ts`](./src/app/robots.ts); `metadataBase` from [`getSiteUrl()`](./src/lib/site-url.ts).
- [x] **Errors** — [`not-found`](./src/app/not-found.tsx), [`error`](./src/app/error.tsx) boundary.
- [x] **Config** — [`.env.example`](./.env.example) documents `NEXT_PUBLIC_SITE_URL` for production.

**Before you go live:** copy `.env.example` → `.env.production` (or set vars in the host UI) with your real `NEXT_PUBLIC_SITE_URL`, run `npm run build`, deploy (e.g. Vercel), and re-read Privacy/Terms for your jurisdiction.

## Roadmap (after MVP)

| Phase | Focus |
| ----- | ----- |
| **Next** | Live or scheduled fixture API, caching, “live” state from real data; optional auth to sync picks server-side. |
| **Then** | Push / favourites, richer analytics, i18n, moderation if UGC appears. |
| **Later (post–post-MVP)** | **Games:** hero photography per mode, licensed or original art, and additional “real” game types beyond bracket JSON — intentionally deferred past the phases above. |

## Features (high level)

- **Matches** — Kickoffs and copy in **Europe/Istanbul (TRT)**; countdown shows real fixture names (not generic “Match N”).
- **Simulator** — Template-driven bracket; step rail; `BracketTree` for knockout picks.
- **Predictions** — `PredictionForm` + optional “trending on this device” style stats from the same browser’s picks.
- **Games** — Pool sampling (16 / 32 / 64); **BracketFullscreenLayer**: pick resolution motion (loser exits, next pair enters); no spammy “new matchup” toasts.
- **Share** — Export cards for social ratios where implemented.

## Project layout

```
src/app/          # App Router pages + metadata
src/components/   # AppShell, StickyTabNav, UI primitives (Button, Card, …)
src/features/     # matches, countdown, simulator, predictions, games, share, home
src/data/         # teams, matches, bracket template, mini-games, players (JSON)
src/lib/          # types, loaders, match-utils, community-stats (localStorage)
```

## Data

Tournament content is **static JSON** under `src/data/`. Swap or extend those files to refresh fixtures, pools, or bracket shape without rewriting UI logic.

## Privacy / “community” stats

Pick counters used for Games / Predictions trending UIs are stored in **`localStorage`** on the device only — not a global backend. See **`/privacy`** for the short MVP-facing explanation.

## Docs for agents

See [`AGENTS.md`](./AGENTS.md) (and `CLAUDE.md` pointer) for Next.js version notes in this repo.

## License

Private — adjust as you like.
