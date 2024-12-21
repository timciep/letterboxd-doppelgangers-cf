/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import JsonView from "react18-json-view";
import "react18-json-view/src/style.css";

export default function MetricsPage() {
  const [src, setSrc] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/api/metrics");
      const data = await response.json();
      setSrc(data);
    };

    fetchData();
  }, []);

  const customizeNode = (params: any) => {
    if (
      typeof params.node === "string" &&
      (params.node.startsWith("https://") || params.node.startsWith("http://"))
    )
      return (
        <a
          href={params.node}
          target="_blank"
          className="text-blue-800 hover:underline"
        >
          {params.node}
        </a>
      );
  };

  return (
    <div className="bg-white">
      <JsonView {...{ src, customizeNode }} />;
    </div>
  );
}
