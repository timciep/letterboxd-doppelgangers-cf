import { ReactElement, useState, useCallback, useEffect, useMemo } from "react";
import { UsernameInput } from "./UsernameInput";
import { UserFavoritesList } from "./UserFavoritesList";
import { UserSearchResults } from "./UserSearchResults";
import { sendGAEvent } from "@next/third-parties/google";
import { Spinner } from "./Spinner";
import { useLookalikes } from "@/hooks/useLookalikes";
import { useUsersFavorites } from "@/hooks/useUsersFavorites";

export enum Step {
  Form,
  Results,
}

export function Lookup(): ReactElement {
  const [step, setStep] = useState<Step>(Step.Form);

  const [username, setUsername] = useState<string>("");

  const [selectedMovieSlugs, setSelectedMovieSlugs] = useState<string[]>([]);

  const movieSlugsQuery = useMemo(
    () => selectedMovieSlugs.map((slug) => `fan:${slug}`).join("+"),
    [selectedMovieSlugs],
  );

  const onError = useCallback((errorString: string) => {
    alert(errorString);
    setStep(Step.Form);
  }, []);

  const { movies, loadingMovies, fetchMovies } = useUsersFavorites({ onError });

  const onSubmit = useCallback(
    async (username: string) => {
      const formattedUsername = formatUsername(username);

      sendGAEvent("event", "lookup", {
        value: formattedUsername,
      });

      setUsername(formattedUsername || "");
      fetchMovies(formattedUsername || "");
      setStep(Step.Results);
    },
    [fetchMovies],
  );

  // When movies are loaded, set all movie slugs as selected.
  useEffect(() => {
    setSelectedMovieSlugs(movies.map((movie) => movie.slug));
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

  const { users, loadingUsers } = useLookalikes({
    username,
    selectedMovieSlugs,
  });

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
          {selectedMovieSlugs.length === 4 ? (
            // exactly 4
            <div className="text-lg">
              ...are also the{" "}
              <span className="text-orange-300 font-bold">
                {selectedMovieSlugs.length}
              </span>{" "}
              favorites of:
            </div>
          ) : selectedMovieSlugs.length > 1 ? (
            // more than 1 (plural)
            <div className="text-lg">
              ...are also{" "}
              <span className="text-orange-300 font-bold">
                {selectedMovieSlugs.length}
              </span>{" "}
              of the favorites of:
            </div>
          ) : (
            selectedMovieSlugs.length === 1 && (
              // 1
              <div className="text-lg">
                ...is also{" "}
                <span className="text-orange-300 font-bold">
                  {selectedMovieSlugs.length}
                </span>{" "}
                of the favorites of:
              </div>
            )
          )}
        </>
      )}

      {!loadingUsers &&
        selectedMovieSlugs.length > 0 &&
        movies.length > 0 &&
        (users.length > 0 ? (
          <UserSearchResults users={users} />
        ) : (
          <div className="text-center">
            <div className="italic text-lg text-red-300 mb-1">Nobody!</div>

            <div>Try deselecting one or more of your favorites, above.</div>
          </div>
        ))}

      {(loadingMovies || loadingUsers) && <Spinner />}

      <div className="flex justify-between w-full mt-5">
        <button
          className="py-1 px-2 text-sm rounded bg-shark-800 hover:bg-shark-700"
          onClick={() => setStep(Step.Form)}
        >
          &larr; Back
        </button>

        {users.length > 0 && (
          <a
            href={`https://letterboxd.com/search/${movieSlugsQuery}`}
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

// If URL is given, extract the last part as the username.
export function formatUsername(username: string): string | undefined {
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
