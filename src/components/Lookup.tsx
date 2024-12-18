import { ReactElement, useState, useCallback, useEffect, useMemo } from "react";
import { UsernameInput } from "./UsernameInput";
import { UserFavoritesList } from "./UserFavoritesList";
import { LetterboxdFavorite } from "@/lib/getLetterboxdFavorites";
import { UserSearchResults } from "./UserSearchResults";
import { UserResult } from "@/lib/getLetterboxdFansByMovies";

enum Step {
  Form,
  Results,
}

export function Lookup(): ReactElement {
  const [step, setStep] = useState<Step>(Step.Form);

  const [username, setUsername] = useState<string>("");
  const [movies, setMovies] = useState<LetterboxdFavorite[]>([]);
  const [loadingMovies, setLoadingMovies] = useState<boolean>(false);
  const [selectedMovieSlugs, setSelectedMovieSlugs] = useState<string[]>([]);
  const [users, setUsers] = useState<UserResult[]>([]);
  const [loadingUsers, setLoadingUsers] = useState<boolean>(false);

  const movieSlugsQuery = useMemo(
    () => selectedMovieSlugs.map((slug) => `fan:${slug}`).join("%20"),
    [selectedMovieSlugs],
  );

  const fetchMovies = useCallback(async (username: string) => {
    setLoadingMovies(true);

    const response = await fetch(
      `/api/letterboxd_favorites?username=${username}`,
    );

    if (!response.ok) {
      alert(`User not found: ${username}`);
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
  }, []);

  const fetchUsers = useCallback(
    async (movieSlugs: string[]) => {
      setLoadingUsers(true);

      const response = await fetch(
        `/api/letterboxd_fans_by_movies?movies=${movieSlugs.join(",")}`,
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch fans: ${response.status} ${response.statusText}`,
        );
      }

      let data: UserResult[] = await response.json();

      // remove the searched user from the list
      data = data.filter((user) => user.username !== username);

      setUsers(data);
      setLoadingUsers(false);
    },
    [username],
  );

  // When selected movie slugs change, fetch fans for those movies.
  useEffect(() => {
    if (selectedMovieSlugs.length) {
      fetchUsers(selectedMovieSlugs);
    }
  }, [selectedMovieSlugs, fetchUsers]);

  const onSubmit = useCallback(
    async (username: string) => {
      setLoadingMovies(true);
      setLoadingUsers(true);
      setUsername(username);
      fetchMovies(username);
      setStep(Step.Results);
    },
    [fetchMovies],
  );

  // When movies are loaded, set all movie slugs as selected.
  useEffect(() => {
    if (movies.length) {
      setSelectedMovieSlugs(movies.map((movie) => movie.slug));
    }
  }, [movies]);

  const onMovieSelected = useCallback((slug: string) => {
    setSelectedMovieSlugs((prevSelectedMovieSlugs) => {
      if (prevSelectedMovieSlugs.includes(slug)) {
        return prevSelectedMovieSlugs.filter(
          (selectedSlug) => selectedSlug !== slug,
        );
      }

      return [...prevSelectedMovieSlugs, slug];
    });
  }, []);

  if (step === Step.Form) {
    return <UsernameInput {...{ onSubmit }} />;
  }

  return (
    <div className="flex flex-col gap-3 items-center p-3 rounded z-10 bg-shark-900">
      <div className="text-lg">{username}&apos;s favorite(s)...</div>

      {!loadingMovies && (
        <>
          <UserFavoritesList
            {...{
              movies,
              selectedMovieSlugs,
              onMovieSelected,
            }}
          />
          {selectedMovieSlugs.length > 1 ? (
            <div className="text-lg">
              ...are also the{" "}
              <span className="text-orange-300 font-bold">
                {selectedMovieSlugs.length}
              </span>{" "}
              favorites of:
            </div>
          ) : (
            <div className="text-lg">...is also the favorite of:</div>
          )}
        </>
      )}

      {!loadingUsers &&
        movies.length > 0 &&
        (users.length > 0 ? (
          <UserSearchResults users={users} />
        ) : (
          <div className="text-center">
            <div className="italic text-lg text-red-300 mb-1">Nobody!</div>

            <div>Try deselecting one or more of your favorites, above.</div>
          </div>
        ))}

      <div className="flex justify-between w-full mt-5">
        <button
          className="py-1 px-2 text-sm rounded bg-shark-800 hover:bg-shark-700"
          onClick={() => setStep(Step.Form)}
        >
          &larr; Back
        </button>

        {users.length > 0 && (
          <a
            href={`https://letterboxd.com/s/search/${movieSlugsQuery}`}
            target="_blank"
            className="py-1 px-2 rounded bg-apple-900 hover:bg-apple-800 text-apple-100"
          >
            See all results on Letterboxd
          </a>
        )}
      </div>
    </div>
  );
}
