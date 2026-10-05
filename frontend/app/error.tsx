"use client";

import { useEffect } from "react";

export default function Error({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex flex-1 items-center justify-center bg-gray-50 px-6 py-24">
      <div className="max-w-md text-center">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
          Error
        </p>

        <h1 className="mt-3 text-3xl font-bold text-gray-900">
          Something went wrong
        </h1>

        <p className="mt-3 text-gray-600">
          We couldn&apos;t load this page. This is usually temporary.
        </p>

        <button
          onClick={() => retry()}
          className="mt-8 rounded-full bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-700"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
