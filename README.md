# World Cup 2026 Hub

Interactive web app to follow matches, simulate the knockout path, save predictions (local storage), play “this or that” games, and export share cards.

## Stack

- [Next.js](https://nextjs.org/) (App Router) · React 19 · TypeScript
- Tailwind CSS v4
- [Zustand](https://github.com/pmndrs/zustand) with `persist` for simulator, predictions, and game choices
- [date-fns](https://date-fns.org/) for countdowns
- [html-to-image](https://github.com/bubkoo/html-to-image) for PNG card export

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you’ll be redirected to `/matches`.

## Scripts

| Command       | Description              |
| ------------- | ------------------------ |
| `npm run dev` | Development server       |
| `npm run build` | Production build       |
| `npm run start` | Start production server |
| `npm run lint` | ESLint                   |

## Project layout

- `src/app` — routes and metadata (`/matches`, `/matches/[id]`, `/simulator`, `/games`, `/predictions`)
- `src/components` — shared UI (`AppShell`, `StickyTabNav`, primitives)
- `src/features` — feature modules (matches, countdown, simulator, predictions, games, share)
- `src/data` — static JSON (teams, matches, bracket template, mini-game pairs, players)
- `src/lib` — types, constants, data loaders, match helpers

## Data

All tournament content is static JSON for the MVP. Replace or extend files under `src/data/` to refresh fixtures and bracket structure without changing core UI.

## License

Private / your project — adjust as needed.
