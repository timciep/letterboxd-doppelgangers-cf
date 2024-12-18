import { LetterboxdFavorite } from "@/lib/getLetterboxdFavorites";
import { ReactElement } from "react";

export function UserFavoritesList({
  movies,
  selectedMovieSlugs,
  onMovieSelected,
}: {
  movies: LetterboxdFavorite[];
  selectedMovieSlugs: string[];
  onMovieSelected: (selectedMovieSlug: string) => void;
}): ReactElement {
  return (
    <div className="flex gap-2 justify-center flex-wrap">
      {movies.map((movie) => (
        <button
          key={movie.slug}
          className={
            "p-2 rounded border-solid border-2 " +
            (selectedMovieSlugs.includes(movie.slug)
              ? "border-orange-600 hover:border-orange-400"
              : "border-shark-600 hover:border-shark-400 text-shark-200")
          }
          onClick={() => onMovieSelected(movie.slug)}
        >
          {movie.title}
        </button>
      ))}
    </div>
  );
}
