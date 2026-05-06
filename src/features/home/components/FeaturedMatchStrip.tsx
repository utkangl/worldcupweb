import Image from "next/image";
import Link from "next/link";
import type { Match, Team } from "@/lib/types";
import { flagUrl } from "@/lib/flag-url";
import { formatKickoffLocal, statusLabel } from "@/features/matches/lib/format";
import { CountdownTimer } from "@/features/countdown/components/CountdownTimer";

export function FeaturedMatchStrip({
  match,
  home,
  away,
}: {
  match: Match;
  home: Team;
  away: Team;
}) {
  const live = match.status === "live";
  const poss = match.stats?.possession;
  const homePct = poss ? poss[0] : 50;
  const awayPct = poss ? poss[1] : 50;

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-end justify-between">
        <h2 className="font-lexend flex items-center gap-2 text-2xl font-semibold text-foreground">
          <span
            className={`h-2 w-2 rounded-full ${live ? "animate-pulse bg-red-500" : "bg-white/30"}`}
          />
          Featured Match
        </h2>
        <Link
          href="/matches"
          className="font-label-caps text-[#CCFF00] transition-colors hover:text-white"
        >
          VIEW ALL
        </Link>
      </div>
      <div className="glass-effect group relative overflow-hidden rounded-xl p-6 transition-all duration-300 hover:shadow-[0_0_40px_rgba(195,244,0,0.12)] md:p-8">
        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#c3f400]/5 blur-3xl" />
        <div className="relative z-10 flex flex-col items-center justify-between gap-8 md:flex-row">
          <div className="flex flex-1 flex-col items-center gap-4">
            <div className="relative h-24 w-24 overflow-hidden rounded-full border-2 border-white/10 shadow-[0_0_20px_rgba(255,255,255,0.05)]">
              <Image
                src={flagUrl(home.fifaCode)}
                alt=""
                fill
                unoptimized
                className="object-cover"
                sizes="96px"
              />
            </div>
            <span className="font-lexend text-2xl font-semibold uppercase tracking-wide text-foreground">
              {home.shortName}
            </span>
          </div>
          <div className="flex flex-1 flex-col items-center gap-2 text-center">
            {live ? (
              <span className="font-label-caps mb-2 rounded-full border border-[#c3f400]/20 bg-[#c3f400]/10 px-3 py-1 text-[#c3f400]">
                LIVE
              </span>
            ) : (
              <span className="font-label-caps mb-2 text-on-surface-variant">
                {statusLabel(match.status)}
              </span>
            )}
            <div className="flex items-center gap-4">
              <span className="font-lexend text-5xl font-extrabold tabular-nums text-glow text-white">
                {match.status === "upcoming" ? "—" : match.homeScore ?? 0}
              </span>
              <span className="font-lexend text-4xl text-white/30">–</span>
              <span className="font-lexend text-5xl font-extrabold tabular-nums text-glow text-white">
                {match.status === "upcoming" ? "—" : match.awayScore ?? 0}
              </span>
            </div>
            {match.status === "upcoming" ? (
              <CountdownTimer
                targetIso={match.kickoff}
                label="Kick-off in"
                className="mt-4 w-full max-w-[19rem] border border-white/10 bg-black/20 p-4"
              />
            ) : null}
            <p className="mt-4 text-base text-on-surface-variant">
              {match.round ?? match.stage} · {formatKickoffLocal(match.kickoff)}
            </p>
            <Link
              href={`/matches/${match.id}`}
              className="mt-2 font-label-caps text-[#00e0ff] hover:underline"
            >
              Match centre
            </Link>
          </div>
          <div className="flex flex-1 flex-col items-center gap-4">
            <div className="relative h-24 w-24 overflow-hidden rounded-full border-2 border-white/10 shadow-[0_0_20px_rgba(255,255,255,0.05)]">
              <Image
                src={flagUrl(away.fifaCode)}
                alt=""
                fill
                unoptimized
                className="object-cover"
                sizes="96px"
              />
            </div>
            <span className="font-lexend text-2xl font-semibold uppercase tracking-wide text-foreground">
              {away.shortName}
            </span>
          </div>
        </div>
        {match.stats && (match.status === "live" || match.status === "finished") && (
          <div className="relative z-10 mt-8 flex justify-center gap-12 border-t border-white/5 pt-6 opacity-90">
            <div className="flex flex-col items-center">
              <span className="font-label-caps mb-1 text-on-surface-variant">
                POSSESSION
              </span>
              <div className="flex w-48 max-w-full items-center gap-2">
                <span className="font-inter text-sm text-[#c3f400]">{homePct}%</span>
                <div className="flex h-1 flex-1 overflow-hidden rounded-full bg-surface-high">
                  <div
                    className="h-full bg-[#c3f400]"
                    style={{ width: `${homePct}%` }}
                  />
                  <div
                    className="h-full bg-wc-cyan"
                    style={{ width: `${awayPct}%` }}
                  />
                </div>
                <span className="text-sm text-[#00e0ff]">{awayPct}%</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
