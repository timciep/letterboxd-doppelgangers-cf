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
  blocked: boolean;
} => {
  const [users, setUsers] = useState<UserResult[]>([]);
  const [loadingUsers, setLoadingUsers] = useState<boolean>(false);
  const [blocked, setBlocked] = useState<boolean>(false);

  const fetchCache = useMemo(() => new Map<string, UserResult[]>(), []);

  const fetchUsers = useCallback(
    async (movieSlugs: string[]) => {
      setLoadingUsers(true);
      setBlocked(false);

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
        // Network error or Letterboxd blocked the request. Fall back to a
        // click-through link instead of showing a misleading "Nobody!".
        console.error(error);
        setUsers([]);
        setBlocked(true);
        setLoadingUsers(false);
        return;
      }

      if (!response.ok) {
        // Letterboxd blocked or errored the request. Fall back to a
        // click-through link instead of showing a misleading "Nobody!".
        console.error(
          `Failed to fetch fans: ${response.status} ${response.statusText}`,
        );
        setUsers([]);
        setBlocked(true);
        setLoadingUsers(false);
        return;
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

  return { users, loadingUsers, blocked };
};
