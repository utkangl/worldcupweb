import Link from "next/link";
import { MaterialIcon } from "@/components/ui/MaterialIcon";

function CornerGlow({ color }: { color: "lime" | "cyan" | "purple" }) {
  const map = {
    lime: "from-[#CCFF00]/25 to-[#CCFF00]/0",
    cyan: "from-[#00e0ff]/22 to-[#00e0ff]/0",
    purple: "from-purple-400/20 to-purple-500/0",
  } as const;
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden rounded-xl"
      aria-hidden
    >
      <div
        className={`absolute -bottom-16 -right-16 h-56 w-56 rounded-full bg-gradient-to-tl ${map[color]} blur-3xl`}
      />
      <div
        className={`absolute -top-10 -left-10 h-40 w-40 rounded-full bg-gradient-to-br ${map[color]} opacity-40 blur-2xl`}
      />
    </div>
  );
}

export function HomeBentoGrid() {
  return (
    <section className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Link
        href="/matches"
        className="glass-effect group relative flex min-h-[160px] flex-col justify-between overflow-hidden rounded-xl border border-white/10 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#CCFF00]/50"
      >
        <CornerGlow color="lime" />
        <div className="relative z-10 flex justify-between">
          <MaterialIcon name="sports_soccer" className="text-3xl text-[#CCFF00]" />
          <MaterialIcon
            name="arrow_forward"
            className="text-on-surface-variant group-hover:text-[#CCFF00]"
          />
        </div>
        <div className="relative z-10 mt-auto">
          <h3 className="font-lexend text-2xl font-semibold text-foreground">Matches</h3>
          <p className="mt-1 text-sm text-on-surface-variant">Live scores & fixtures</p>
        </div>
      </Link>
      <Link
        href="/simulator"
        className="glass-effect group relative flex min-h-[160px] flex-col justify-between overflow-hidden rounded-xl border border-white/10 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#00e0ff]/50"
      >
        <CornerGlow color="cyan" />
        <div className="relative z-10 flex justify-between">
          <MaterialIcon name="account_tree" className="text-3xl text-[#00e0ff]" />
          <MaterialIcon
            name="arrow_forward"
            className="text-on-surface-variant group-hover:text-[#00e0ff]"
          />
        </div>
        <div className="relative z-10 mt-auto">
          <h3 className="font-lexend text-2xl font-semibold text-foreground">Simulator</h3>
          <p className="mt-1 text-sm text-on-surface-variant">Build your tournament bracket</p>
        </div>
      </Link>
      <Link
        href="/predictions"
        className="glass-effect group relative flex min-h-[160px] flex-col justify-between overflow-hidden rounded-xl border border-white/10 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-purple-400/50"
      >
        <CornerGlow color="purple" />
        <div className="relative z-10 flex justify-between">
          <MaterialIcon name="query_stats" className="text-3xl text-purple-300" />
          <MaterialIcon
            name="arrow_forward"
            className="text-on-surface-variant group-hover:text-purple-300"
          />
        </div>
        <div className="relative z-10 mt-auto">
          <h3 className="font-lexend text-2xl font-semibold text-foreground">Predictions</h3>
          <p className="mt-1 text-sm text-on-surface-variant">Awards & champion picks</p>
        </div>
      </Link>
      <Link
        href="/games"
        className="glass-effect group relative flex min-h-[160px] flex-col justify-between overflow-hidden rounded-xl border border-white/10 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#CCFF00]/50"
      >
        <CornerGlow color="lime" />
        <div className="relative z-10 flex justify-between">
          <MaterialIcon name="sports_esports" className="text-3xl text-[#CCFF00]" />
          <MaterialIcon
            name="arrow_forward"
            className="text-on-surface-variant group-hover:text-[#CCFF00]"
          />
        </div>
        <div className="relative z-10 mt-auto">
          <h3 className="font-lexend text-2xl font-semibold text-foreground">Games</h3>
          <p className="mt-1 text-sm text-on-surface-variant">This or that duels</p>
        </div>
      </Link>
    </section>
  );
}
