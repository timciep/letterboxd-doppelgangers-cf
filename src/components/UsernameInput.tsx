"use client";

import { ReactElement } from "react";

export function UsernameInput({
  onSubmit,
}: {
  onSubmit: (username: string) => void;
}): ReactElement {
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const username = event.currentTarget["lb-un"].value;
    onSubmit(username);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="mx-5 text-center" x-data="data">
        <form onSubmit={handleSubmit}>
          <div className="text-shark-100">
            <label htmlFor="lb-un">
              Enter your <span className="font-black text-white">username</span>{" "}
              or <span className="font-black text-white">profile URL</span>:
            </label>
          </div>

          <div className="mt-3">
            <input
              type="text"
              className="rounded text-lg p-2 w-full max-w-sm text-center text-shark-900 bg-shark-100"
              id="lb-un"
              name="lb-un"
              autoComplete="off"
              required
            />
          </div>

          <div className="mt-4">
            <button
              type="submit"
              className="rounded bg-orange-800 hover:bg-orange-900 text-shark-100 p-2 w-full max-w-xs"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
