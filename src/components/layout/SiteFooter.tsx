import Link from "next/link";

const links = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
] as const;

export function SiteFooter() {
  return (
    <footer className="mt-20 w-full border-t border-white/5 bg-[#050505] py-12 pb-28 md:pb-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-8 md:flex-row">
        <span className="text-xl font-black italic tracking-tighter text-[#CCFF00]">
          FWC 26
        </span>
        <nav className="flex flex-wrap justify-center gap-6 font-lexend text-sm tracking-wide">
          {links.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className="text-white/30 transition-colors hover:text-[#CCFF00]"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <p className="max-w-sm text-center font-lexend text-xs leading-snug tracking-wide text-white/35 md:text-right">
          Unofficial fan companion · not affiliated with FIFA. Fixtures and
          branding on the site are for demonstration — not a claim of ownership
          over tournament rights or data.
        </p>
      </div>
    </footer>
  );
}
