import { UserResult } from "@/lib/getLetterboxdFansByMovies";
import { ReactElement } from "react";

export function UserSearchResults({
  users,
}: {
  users: UserResult[];
}): ReactElement {
  return (
    <div className="flex gap-2 flex-col">
      {users.map((user) => (
        <div key={user.username} className="flex gap-3 items-center">
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={user.avatarImgUrl}
              alt={user.username}
              className="w-10 h-10 rounded-full"
            />
          </div>

          <div>
            <a
              href={user.url}
              target="_blank"
              className="text-apple-300 hover:text-apple-100"
            >
              {user.name || user.username}
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}
