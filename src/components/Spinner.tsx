import { ReactElement } from "react";

export function Spinner(): ReactElement {
  return (
    <div className="flex justify-center items-center h-64">
      <svg
        className="animate-spin h-12 w-12 text-shark-200"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A8.001 8.001 0 0112 4.472v3.999a4 4 0 00-4 4h4v-4z"
        ></path>
      </svg>
    </div>
  );
}
