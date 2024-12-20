import { getRequestContext } from "@cloudflare/next-on-pages";

export const runtime = "edge";

export async function GET() {
  const db = getRequestContext().env.DB_letterboxd_doppelganger_lookups;

  const countsByDay = await db
    .prepare(
      `
      select
        date(datetime) as date,
        count(distinct username) as usernames,
        count(*) as lookups
      from lookups
      group by date
      order by date desc
    `,
    )
    .all();

  const uniqueUsernames = await db
    .prepare(
      `
      select
        username,
        "https://letterboxd.com/" || username as url,
        min(datetime) as min_date,
        max(datetime) as max_date,
        count(*) as lookups
      from lookups
      group by username
      order by min_date desc
    `,
    )
    .all();

  return new Response(
    JSON.stringify({
      "Counts by day": countsByDay.results,
      "Unique usernames, most recent first": uniqueUsernames.results,
    }),
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
}
