# Letterboxd Doppelgängers

Find Letterboxd users who share the same favorite films as you.

Live site: https://letterboxd-doppelgangers.timcieplowski.com/

![image](https://github.com/user-attachments/assets/69779fe7-29c7-469b-857e-5a64902dd762)

## How it works

1. Enter a Letterboxd username
2. The app scrapes the user's profile to extract their four favorite films
3. It searches Letterboxd for other users who are also fans of those same films
4. Results are displayed as a list of "doppelgängers" — users with matching taste

## Tech stack

- [Next.js](https://nextjs.org/) 15 (App Router, Edge Runtime)
- [Cloudflare Pages](https://pages.cloudflare.com/) via [`@cloudflare/next-on-pages`](https://github.com/cloudflare/next-on-pages)
- [Cloudflare D1](https://developers.cloudflare.com/d1/) for lookup metrics
- [Cheerio](https://cheerio.js.org/) for HTML parsing
- [Tailwind CSS](https://tailwindcss.com/) for styling

## Getting started

```bash
npm install
npm run preview
```

Open [http://localhost:8788](http://localhost:8788) to see the app.

> **Note:** The app requires Cloudflare bindings (D1 database) to function, so `npm run dev` (plain Next.js dev server) won't work for the full flow. Use `npm run preview` which builds and runs locally via wrangler with all bindings available.

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Next.js dev server (no Cloudflare bindings) |
| `npm run preview` | Build and run locally with wrangler (full CF bindings) |
| `npm run deploy` | Build and deploy to Cloudflare Pages |
| `npm run migrations_apply_local` | Apply D1 migrations locally |
| `npm run migrations_apply_prod` | Apply D1 migrations to production |

## Deployment

The app is deployed to Cloudflare Pages. The D1 database binding (`DB_letterboxd_doppelganger_lookups`) is configured in `wrangler.toml` and must also be set up in the Cloudflare dashboard.
