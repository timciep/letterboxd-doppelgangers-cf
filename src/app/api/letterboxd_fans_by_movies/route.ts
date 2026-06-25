import { type NextRequest } from "next/server";
import { getLetterboxdFansByMovies } from "@/lib/getLetterboxdFansByMovies";
import { getRequestContext } from "@cloudflare/next-on-pages";
import { markDown, markUp } from "@/lib/status";

export const runtime = "edge";

// /api/letterboxd_fans_by_movies?movies=chinatown
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const username = searchParams.get("username");
  const notrack = searchParams.has("notrack");
  const movieStrings = searchParams.get("movies") || "";

  const movieSlugs = movieStrings.split(",").filter(Boolean);

  if (!movieSlugs.length) {
    return new Response("No movies provided", { status: 400 });
  }

  let res;
  let error;
  try {
    res = await getLetterboxdFansByMovies(movieSlugs);

    await markUp(getRequestContext().env.KV_status);
  } catch (e) {
    console.error(e);

    error = e;

    await markDown(getRequestContext().env.KV_status);
  }

  // Record the lookup either way. On failure we write -1 matches so usage is
  // still tracked even when Letterboxd is blocking the search.
  if (!notrack) try {
    const db = getRequestContext().env.DB_letterboxd_doppelganger_lookups;

    await db
      .prepare(
        "INSERT INTO lookups (username, favorites, matches, datetime) VALUES (?, ?, ?, ?)",
      )
      .bind(
        username,
        movieSlugs.length,
        res ? res.length - 1 : -1,
        new Date().toISOString(),
      )
      .run();
  } catch (e) {
    console.error(e);
  }

  if (error) {
    return new Response(`${error}`, { status: 500 });
  }

  return new Response(JSON.stringify(res), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}
