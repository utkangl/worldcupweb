import Link from "next/link";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { StickyTabNav } from "@/components/layout/StickyTabNav";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-1 flex-col pb-20 md:pb-0">
      <StickyTabNav />
      <header className="sticky top-0 z-30 flex items-center border-b border-white/5 bg-background/90 px-4 py-4 backdrop-blur-xl md:hidden">
        <Link
          href="/"
          className="font-lexend text-xl font-black italic tracking-tighter text-[#CCFF00]"
        >
          FWC 26
        </Link>
      </header>
      <main className="mx-auto w-full max-w-[1280px] flex-1 px-4 pt-6 md:px-5 md:pt-8">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
