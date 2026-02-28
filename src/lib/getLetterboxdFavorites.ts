import * as cheerio from "cheerio";
import { fetchPageHtml } from "./fetchPageHtml";

export type LetterboxdFavorite = {
  title: string | null;
  slug: string;
  url: string | null;
  //   posterImgUrl: string | null;
};

export async function getLetterboxdFavorites(
  username: string,
): Promise<LetterboxdFavorite[] | null> {
  // Fetch the page HTML
  const response = await fetchPageHtml(
    `https://letterboxd.com/${username}`,
  );
  if (!response.ok) {
    return null;
  }

  const html = await response.text();
  const $ = cheerio.load(html);

  // Locate the favorites section
  const favoritesSection = $("#favourites");
  if (!favoritesSection.length) {
    throw new Error("No favorites section found");
  }

  // Select the list items containing favorites
  const favoritesLis = favoritesSection.find("ul.grid > li.griditem");
  if (!favoritesLis.length) {
    throw new Error("No favorites found");
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
