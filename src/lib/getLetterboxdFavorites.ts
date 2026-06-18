import * as cheerio from "cheerio";
import { fetchPageHtml } from "./fetchPageHtml";

export type LetterboxdFavorite = {
  title: string | null;
  slug: string;
  url: string | null;
  //   posterImgUrl: string | null;
};

export class UserNotFoundError extends Error {
  constructor(username: string) {
    super(`User not found: ${username}`);
    this.name = "UserNotFoundError";
  }
}

export async function getLetterboxdFavorites(
  username: string,
): Promise<LetterboxdFavorite[]> {
  // Fetch the page HTML. The trailing slash is required: Letterboxd 301-redirects
  // the slash-less URL to the canonical `/username/`, and Cloudflare's bot protection
  // serves a "Just a moment..." challenge (403) on that redirecting request. Requesting
  // the canonical URL directly avoids the redirect and returns 200.
  const response = await fetchPageHtml(
    `https://letterboxd.com/${username}/`,
  );

  const html = await response.text();
  const $ = cheerio.load(html);

  // Confirm the response actually came from Letterboxd before trusting the status code,
  // so a CF challenge with any status (incl. 404) is treated as breakage, not a missing user.
  // Use <title> rather than og:site_name because Letterboxd's own 404 page omits og tags.
  const title = $("title").text();
  if (!title.toLowerCase().includes("letterboxd")) {
    throw new Error(`Response does not appear to be from Letterboxd (status ${response.status}, title "${title}")`);
  }

  if (response.status === 404) {
    throw new UserNotFoundError(username);
  }
  if (!response.ok) {
    console.error(`Failed to fetch favorites: ${response.status} ${response.statusText}`);

    throw new Error(`Failed to fetch favorites: ${response.status} ${response.statusText}`);
  }

  // Empty/private profiles legitimately lack a favorites section — not a scrape failure.
  const favoritesSection = $("#favourites");
  if (!favoritesSection.length) {
    return [];
  }

  const favoritesLis = favoritesSection.find("ul.grid > li.griditem");
  if (!favoritesLis.length) {
    return [];
  }

  // Extract favorites data
  const favorites = favoritesLis
    .map((_i, li): LetterboxdFavorite | null => {
      const reactComponent = $(li).find('.react-component[data-component-class="LazyPoster"]');

      const title = reactComponent.attr("data-item-name") || null;
      const slug = reactComponent.attr("data-item-slug") || "";
      const itemLink = reactComponent.attr("data-item-link") || "";
      const url = itemLink ? `https://letterboxd.com${itemLink}` : null;

      return { title, slug, url };
    })
    .get();

  return favorites;
}
