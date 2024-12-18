import { type NextRequest } from "next/server";
import { getLetterboxdFavorites } from "@/lib/getLetterboxdFavorites";

export const runtime = "edge";

// /api/letterboxd_favorites?username=timciep
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const username = formatUsername(searchParams.get("username") || "");

  if (!username) {
    return new Response("No username provided", { status: 400 });
  }

  const res = await getLetterboxdFavorites(username);

  if (!res) {
    return new Response("User favorites not found", { status: 404 });
  }

  return new Response(JSON.stringify(res), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}

// If URL is given, extract the last part as the username.
function formatUsername(username: string): string | undefined {
  // If username is a URL...
  if (username.includes("http")) {
    // Remove trailing slash.
    if (username.endsWith("/")) {
      username = username.slice(0, -1);
    }

    // Extract the last part of the URL.
    const url = new URL(username);
    return url.pathname.split("/").pop();
  }

  return username;
}
