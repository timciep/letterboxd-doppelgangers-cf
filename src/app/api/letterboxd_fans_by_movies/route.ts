import { type NextRequest } from "next/server";
import { getLetterboxdFansByMovies } from "@/lib/getLetterboxdFansByMovies";

export const runtime = "edge";

// /api/letterboxd_fans_by_movies?movies=chinatown
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const movieStrings = searchParams.get("movies") || "";

  const movieSlugs = movieStrings.split(",");

  if (!movieSlugs) {
    return new Response("No movies provided", { status: 400 });
  }

  const res = await getLetterboxdFansByMovies(movieSlugs);

  return new Response(JSON.stringify(res), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}
