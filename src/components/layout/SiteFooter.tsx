import Link from "next/link";

const links = [
  { href: "#", label: "Privacy Policy" },
  { href: "#", label: "Terms of Service" },
  { href: "#", label: "Tournament Rules" },
  { href: "#", label: "Support" },
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
        <p className="text-center font-lexend text-xs tracking-wide text-white/30 md:text-right">
          © 2026 WORLD CUP DIGITAL SIMULATOR. ALL RIGHTS RESERVED.
        </p>
      </div>
    </footer>
  );
}
