import { type NextRequest } from "next/server";
import { getLetterboxdFavorites } from "@/lib/getLetterboxdFavorites";
import { getRequestContext } from "@cloudflare/next-on-pages";

export const runtime = "edge";

// /api/letterboxd_favorites?username=timciep
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const username = formatUsername(searchParams.get("username") || "");

  if (!username) {
    return new Response("No username provided", { status: 400 });
  }

  try {
    const res = await getLetterboxdFavorites(username);

    getRequestContext().env.KV_status.put("up", new Date().toISOString());

    return new Response(JSON.stringify(res), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error(error);

    const message = `${error}`;
    const is404 = message.includes("404");
    if (!is404) {
      getRequestContext().env.KV_status.put("down", new Date().toISOString());
    }

    return new Response(message, { status: 500 });
  }
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

  return username.trim();
}
