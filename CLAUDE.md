# Letterboxd Doppelgangers

Find Letterboxd users who share the same favorite films as you.

## Tech stack

- **Framework**: Next.js 15 (App Router, Edge Runtime)
- **Hosting**: Cloudflare Pages via `@cloudflare/next-on-pages`
- **Database**: Cloudflare D1 (SQLite) for lookup metrics
- **Styling**: Tailwind CSS
- **Scraping**: Cheerio for HTML parsing

## Project structure

```
src/
├── app/                    # Next.js App Router pages and API routes
│   ├── api/
│   │   ├── letterboxd_favorites/   # GET /api/letterboxd_favorites?username=
│   │   ├── letterboxd_fans_by_movies/  # GET /api/letterboxd_fans_by_movies?movies=&username=
│   │   ├── matches/                # Combined lookup endpoint
│   │   └── metrics/                # Usage metrics from D1
│   ├── matches/            # Matches results page
│   └── metrics/            # Metrics dashboard page
├── components/             # React components (Lookup, UsernameInput, etc.)
├── hooks/                  # Custom hooks (useUsersFavorites, useLookalikes)
└── lib/                    # Scraping logic
    ├── fetchPageHtml.ts    # Shared fetch wrapper with browser headers
    ├── getLetterboxdFavorites.ts    # Scrapes user's favorite films
    └── getLetterboxdFansByMovies.ts # Searches for users by favorite films
```

## Commands

- `npm run dev` — Next.js dev server (no Cloudflare bindings)
- `npm run preview` — Build and run with wrangler (full CF bindings, D1)
- `npm run deploy` — Build and deploy to Cloudflare Pages
- `npm run migrations_apply_local` — Apply D1 migrations locally
- `npm run migrations_apply_prod` — Apply D1 migrations to production

## Key files

- `wrangler.toml` — Cloudflare Pages config, D1 binding
- `env.d.ts` — TypeScript types for `CloudflareEnv` bindings
- `.dev.vars` — Local secrets (not committed)

## Scraping notes

- Letterboxd uses Cloudflare for bot protection. Bare `fetch()` calls from Cloudflare's network get challenged. `fetchPageHtml.ts` sets browser-like headers (User-Agent, Accept, Accept-Language) to avoid triggering the challenge.
- Letterboxd periodically changes their HTML structure. If scraping breaks, inspect the live HTML and update CSS selectors in `getLetterboxdFavorites.ts` and `getLetterboxdFansByMovies.ts`.
- Current favorites selector: `#favourites` section → `ul.grid > li.griditem` → `.react-component[data-component-class="LazyPoster"]`
- Current fans selector: `ul.results > li` → `a.avatar`
