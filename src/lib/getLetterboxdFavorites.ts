import * as cheerio from "cheerio";

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
  const response = await fetch(`https://letterboxd.com/${username}`);
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
  const favoritesLis = favoritesSection.find("ul > li");
  if (!favoritesLis.length) {
    throw new Error("No favorites found");
  }

  // Extract favorites data
  const favorites = favoritesLis
    .map((_i, li): LetterboxdFavorite | null => {
      const filmDiv = $(li).find('[data-type="film"]');
      const imgDiv = filmDiv.find("img");

      const slug = filmDiv.attr("data-film-slug") || "";
      const title = imgDiv.attr("alt") || null;
      const url = slug ? `https://letterboxd.com/${slug}` : null;

      return { title, slug, url };
    })
    .get();

  return favorites;
}
