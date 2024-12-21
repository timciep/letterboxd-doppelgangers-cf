import { useState, useCallback, useEffect, useMemo } from "react";
import { UserResult } from "@/lib/getLetterboxdFansByMovies";

export const useLookalikes = ({
  username,
  selectedMovieSlugs,
}: {
  username: string;
  selectedMovieSlugs: string[];
}): {
  users: UserResult[];
  loadingUsers: boolean;
} => {
  const [users, setUsers] = useState<UserResult[]>([]);
  const [loadingUsers, setLoadingUsers] = useState<boolean>(false);

  const fetchCache = useMemo(() => new Map<string, UserResult[]>(), []);

  const fetchUsers = useCallback(
    async (movieSlugs: string[]) => {
      setLoadingUsers(true);

      // If we've already fetched these users, don't do it again.
      const cacheKey = movieSlugs.sort().join(",");
      if (fetchCache.has(cacheKey)) {
        setUsers(fetchCache.get(cacheKey)!);
        setLoadingUsers(false);
        return;
      }

      let response;
      try {
        response = await fetch(
          `/api/letterboxd_fans_by_movies?movies=${movieSlugs.join(",")}&username=${username}`,
        );
      } catch (error) {
        alert(
          `API error. Perhaps Letterboxd is down or has started blocking these requests.`,
        );
        console.error(error);
        setLoadingUsers(false);
        return;
      }

      if (!response.ok) {
        throw new Error(
          `Failed to fetch fans: ${response.status} ${response.statusText}`,
        );
      }

      let data: UserResult[] = await response.json();

      // remove the searched user from the list
      data = data.filter(
        (user) => user.username.toLowerCase() !== username.toLowerCase(),
      );

      // add to cache
      fetchCache.set(cacheKey, data);

      setUsers(data);
      setLoadingUsers(false);
    },
    [fetchCache, username],
  );

  // When selected movie slugs change, fetch fans for those movies.
  useEffect(() => {
    if (selectedMovieSlugs.length) {
      fetchUsers(selectedMovieSlugs);
    }
  }, [selectedMovieSlugs, fetchUsers]);

  return { users, loadingUsers };
};
