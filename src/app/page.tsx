"use client";

import { Lookup } from "@/components/Lookup";

export default function Home() {
  return (
    <main>
      <div className="text-center pt-8 pb-10 mx-2">
        <h1 className="text-3xl md:text-4xl font-bol">
          Letterboxd Doppelgängers
        </h1>

        <p className="text-lg text-shark-200 mt-2">
          Find other{" "}
          <a
            href="https://letterboxd.com"
            target="_blank"
            className="text-apple-400 hover:text-apple-200"
          >
            Letterboxd
          </a>{" "}
          users with the same favorites as&nbsp;you!
        </p>

        <p className="text-xs text-shark-300 mt-3">
          (Created by a fan. Not officially affiliated with Letterboxd.)
        </p>
      </div>

      <div className="flex justify-center mt-2">
        <div className="w-full md:w-1/2">
          <Lookup />
        </div>
      </div>
    </main>
  );
}
