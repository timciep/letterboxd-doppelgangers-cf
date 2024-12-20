import { type NextRequest } from "next/server";
import { getLetterboxdFansByMovies } from "@/lib/getLetterboxdFansByMovies";
import { getRequestContext } from "@cloudflare/next-on-pages";

export const runtime = "edge";

// /api/letterboxd_fans_by_movies?movies=chinatown
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const username = searchParams.get("username");
  const movieStrings = searchParams.get("movies") || "";

  const movieSlugs = movieStrings.split(",");

  if (!movieSlugs) {
    return new Response("No movies provided", { status: 400 });
  }

  const res = await getLetterboxdFansByMovies(movieSlugs);

  try {
    const db = getRequestContext().env.DB_letterboxd_doppelganger_lookups;

    db.prepare(
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
