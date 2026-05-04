import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-20 text-center">
      <p className="font-label-caps text-[#00e0ff]">404</p>
      <h1 className="font-lexend mt-3 text-3xl font-bold text-white md:text-4xl">
        Page not found
      </h1>
      <p className="mt-4 text-on-surface-variant">
        That route does not exist or the link is out of date.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="inline-flex min-h-11 min-w-[10rem] items-center justify-center rounded-xl bg-[#c3f400] px-4 py-2 text-sm font-medium text-[#283500] shadow-[0_0_20px_rgba(195,244,0,0.25)] transition hover:bg-[#abd600] active:scale-[0.98]"
        >
          Back to home
        </Link>
        <Link
          href="/matches"
          className="inline-flex min-h-11 min-w-[10rem] items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10 active:scale-[0.98]"
        >
          Matches
        </Link>
      </div>
    </div>
  );
}
