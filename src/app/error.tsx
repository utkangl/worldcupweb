"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-20 text-center">
      <p className="font-label-caps text-[#00e0ff]">Something went wrong</p>
      <h1 className="font-lexend mt-3 text-2xl font-bold text-white md:text-3xl">
        We couldn&apos;t load this view
      </h1>
      <p className="mt-4 text-sm text-on-surface-variant">
        {error.message ? (
          <span className="font-mono text-xs text-zinc-500">{error.message}</span>
        ) : (
          "An unexpected error occurred. You can try again or go back."
        )}
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="inline-flex min-h-11 min-w-[10rem] items-center justify-center rounded-xl bg-[#c3f400] px-4 py-2 text-sm font-medium text-[#283500] shadow-[0_0_20px_rgba(195,244,0,0.25)] transition hover:bg-[#abd600] active:scale-[0.98]"
        >
          Try again
        </button>
        <Link
          href="/"
          className="inline-flex min-h-11 min-w-[10rem] items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10 active:scale-[0.98]"
        >
          Home
        </Link>
      </div>
    </div>
  );
}
