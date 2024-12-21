/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import JsonView from "react18-json-view";
import "react18-json-view/src/style.css";

export default function MatchesPage() {
  const [src, setSrc] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/api/matches");
      const data = await response.json();
      setSrc(data);
    };

    fetchData();
  }, []);

  return (
    <div className="bg-white">
      <JsonView {...{ src }} />;
    </div>
  );
}
