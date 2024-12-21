import { useState, useCallback, useEffect } from "react";
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

    const fetchUsers = useCallback(
    async (movieSlugs: string[]) => {
      setLoadingUsers(true);

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

    return { users, loadingUsers };
}