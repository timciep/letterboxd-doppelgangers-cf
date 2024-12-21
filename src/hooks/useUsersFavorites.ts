import { useCallback, useState } from "react";
import { LetterboxdFavorite } from "@/lib/getLetterboxdFavorites";


export const useUsersFavorites = ({
    onError,
}: {
    onError: (errorString: string) => void;
}): {
    movies: LetterboxdFavorite[];
    loadingMovies: boolean;

    fetchMovies: (username: string) => void;
} => {
    const [movies, setMovies] = useState<LetterboxdFavorite[]>([]);
    const [loadingMovies, setLoadingMovies] = useState<boolean>(false);

    const fetchMovies = useCallback(async (username: string) => {
        setLoadingMovies(true);
        setMovies([]);
    
        let response;
    
        try {
          response = await fetch(`/api/letterboxd_favorites?username=${username}`);
        } catch (error) {
          alert(
            `API error. Perhaps Letterboxd is down or has started blocking these requests.`,
          );
          console.error(error);
          setLoadingMovies(false);
          return;
        }
    
        if (!response.ok) {
          onError(`User not found: ${username}`);
          return;
        }
    
        let data: LetterboxdFavorite[] = await response.json();
    
        // remove duplicates
        data = data.filter(
          (movie, index, self) =>
            index === self.findIndex((m) => m.slug === movie.slug),
        );
    
        if (!data || !data.length) {
          alert(`Favorites not found for ${username}`);
          return;
        }
    
        setMovies(data);
        setLoadingMovies(false);
      }, [onError]);
    
        return { movies, loadingMovies, fetchMovies };
}