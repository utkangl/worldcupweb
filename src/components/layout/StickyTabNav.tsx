"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MaterialIcon } from "@/components/ui/MaterialIcon";

const tabs = [
  { href: "/", label: "Home", icon: "home" },
  { href: "/matches", label: "Matches", icon: "sports_soccer" },
  { href: "/simulator", label: "Simulator", icon: "account_tree" },
  { href: "/predictions", label: "Predictions", icon: "query_stats" },
  { href: "/games", label: "Games", icon: "sports_esports" },
] as const;

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function StickyTabNav() {
  const pathname = usePathname();

  return (
    <>
      <nav
        className="sticky top-0 z-40 hidden border-b border-white/10 bg-[#050505]/80 shadow-[0_4px_20px_rgba(204,255,0,0.05)] backdrop-blur-xl md:block"
        aria-label="Primary"
      >
        <div className="mx-auto flex w-full max-w-[1280px] items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="font-lexend text-2xl font-black italic tracking-tighter text-[#CCFF00]"
          >
            FIFA WORLD CUP 2026
          </Link>
          <ul className="flex items-center gap-2 lg:gap-6">
            {tabs.map((t) => {
              const active = isActive(pathname, t.href);
              return (
                <li key={t.href}>
                  <Link
                    href={t.href}
                    className={`font-lexend px-3 py-2 text-sm font-medium uppercase tracking-tight transition-all duration-200 ${
                      active
                        ? "border-b-2 border-[#CCFF00] pb-1 font-bold text-[#CCFF00]"
                        : "text-white/60 hover:bg-white/5 hover:text-[#CCFF00]"
                    }`}
                  >
                    {t.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around rounded-t-2xl border-t border-white/10 bg-[#050505]/90 px-2 pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_30px_rgba(0,0,0,0.5)] backdrop-blur-2xl md:hidden"
        aria-label="Primary mobile"
      >
        {tabs.map((t) => {
          const active = isActive(pathname, t.href);
          return (
            <Link
              key={t.href}
              href={t.href}
              className={`flex w-14 min-w-0 flex-col items-center justify-center rounded-xl py-1 text-[10px] font-bold uppercase tracking-tight transition-transform active:scale-90 ${
                active
                  ? "bg-[#CCFF00]/10 text-[#CCFF00]"
                  : "text-white/40 hover:text-white"
              }`}
            >
              <MaterialIcon
                name={t.icon}
                className="mb-0.5 text-2xl"
                filled={active}
              />
              <span className="font-lexend truncate">{t.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
