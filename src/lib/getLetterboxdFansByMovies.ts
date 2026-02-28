import * as cheerio from "cheerio";
import { fetchPageHtml } from "./fetchPageHtml";

export type UserResult = {
  username: string;
  name?: string;
  url?: string;
  avatarImgUrl?: string;
};

export async function getLetterboxdFansByMovies(
  movieSlugs: string[],
): Promise<UserResult[]> {
  const movieSlugsQuery = movieSlugs.map((slug) => `fan:${slug}`).join("%20");

  // Fetch the page HTML
  const response = await fetchPageHtml(
    `https://letterboxd.com/s/search/${movieSlugsQuery}`,
  );
  if (!response.ok) {
    throw new Error(
      `Failed to fetch search page: ${response.status} ${response.statusText}`,
    );
  }

  const html = await response.text();
  const $ = cheerio.load(html);

  // Locate the list of fans
  const fansLis = $("ul.results > li");

  // Extract fans data
  const fans = fansLis
    .map((_i, li) => {
      const avatarAnchor = $(li).find("a.avatar");
      const avatarImg = avatarAnchor.find("img");

      const username = avatarAnchor.attr("href")?.replace(/\//g, "") || "";
      const url = `https://letterboxd.com/${username}`;
      const avatarImgUrl = avatarImg.attr("src");
      const name = avatarImg.attr("alt");

      return { username, url, avatarImgUrl, name };
    })
    .get();

  return fans;
}
