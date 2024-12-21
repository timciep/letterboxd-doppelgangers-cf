import { getRequestContext } from "@cloudflare/next-on-pages";

export const runtime = "edge";

export async function GET() {
  const db = getRequestContext().env.DB_letterboxd_doppelganger_lookups;

  const matches = await db
    .prepare(
      `
      select username, min(datetime) as date
      from lookups
      where favorites = 4 and matches > 0
      group by username
      order by datetime desc
      `,
    )
    .all();

  return new Response(JSON.stringify(matches.results), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}
