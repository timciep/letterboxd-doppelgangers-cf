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
  try {
    res = await getLetterboxdFansByMovies(movieSlugs);

    await markUp(getRequestContext().env.KV_status);
  } catch (error) {
    console.error(error);

    await markDown(getRequestContext().env.KV_status);

    return new Response(`${error}`, { status: 500 });
  }

  if (!notrack) try {
    const db = getRequestContext().env.DB_letterboxd_doppelganger_lookups;

    await db
      .prepare(
        "INSERT INTO lookups (username, favorites, matches, datetime) VALUES (?, ?, ?, ?)",
      )
      .bind(
        username,
        movieSlugs.length,
        res.length - 1,
        new Date().toISOString(),
      )
      .run();
  } catch (error) {
    console.error(error);
  }

  return new Response(JSON.stringify(res), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}
