import Image from "next/image";
import Link from "next/link";
import type { Match, Team } from "@/lib/types";
import { flagUrl } from "@/lib/flag-url";
import {
  formatKickoffLocal,
  scoreLine,
  statusLabel,
} from "@/features/matches/lib/format";

export function MatchCard({
  match,
  home,
  away,
}: {
  match: Match;
  home: Team;
  away: Team;
}) {
  const live = match.status === "live";
  const finished = match.status === "finished";

  return (
    <Link
      href={`/matches/${match.id}`}
      className={`glass-effect group relative block overflow-hidden rounded-xl border p-4 transition-all duration-300 md:p-5 ${
        live
          ? "border-[#00e0ff]/50 shadow-[0_0_20px_rgba(0,224,255,0.1)]"
          : "border-white/10 hover:border-[#CCFF00]/30"
      } ${finished ? "opacity-90 grayscale-[15%] hover:grayscale-0" : ""}`}
    >
      {live ? (
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-3/4 w-3/4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#00e0ff]/10 blur-[60px]" />
      ) : null}
      <div className="relative z-10 mb-4 flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          {live ? (
            <>
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#00e0ff] shadow-[0_0_8px_#00e0ff]" />
              <span className="font-label-caps text-[#00e0ff]">LIVE</span>
            </>
          ) : (
            <span className="font-label-caps text-on-surface-variant">
              {statusLabel(match.status).toUpperCase()}
            </span>
          )}
        </div>
        <span className="font-label-caps rounded-full bg-[#201f20] px-3 py-1 text-on-surface-variant">
          {match.round ?? match.stage}
        </span>
      </div>
      <div className="relative z-10 flex items-center justify-between gap-4">
        <div className="flex flex-1 flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-white/10 bg-[#201f20]">
              <Image
                src={flagUrl(home.fifaCode)}
                alt=""
                fill
                unoptimized
                className="object-cover"
                sizes="40px"
              />
            </div>
            <span className="font-lexend text-xl font-semibold text-white">
              {home.shortName}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-white/10 bg-[#201f20]">
              <Image
                src={flagUrl(away.fifaCode)}
                alt=""
                fill
                unoptimized
                className="object-cover"
                sizes="40px"
              />
            </div>
            <span
              className={`font-lexend text-xl font-semibold ${finished ? "text-on-surface-variant" : "text-white"}`}
            >
              {away.shortName}
            </span>
          </div>
        </div>
        <div className="flex flex-1 flex-col items-center justify-center gap-1">
          {match.status === "upcoming" ? (
            <>
              <span className="font-lexend text-4xl font-extrabold tabular-nums text-white/80">
                {new Date(match.kickoff).toLocaleTimeString(undefined, {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })}
              </span>
              <span className="font-label-caps text-on-surface-variant">KICKOFF</span>
            </>
          ) : (
            <>
              <span
                className={`font-lexend text-5xl font-extrabold tabular-nums ${live ? "text-[#00e0ff]" : "text-white"}`}
              >
                {match.homeScore ?? 0}
              </span>
              <span className="font-lexend text-5xl font-extrabold tabular-nums text-white/80">
                {match.awayScore ?? 0}
              </span>
            </>
          )}
        </div>
        <div className="flex flex-1 justify-end">
          <span className="font-label-caps rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-[#00e0ff] transition-colors group-hover:bg-[#00e0ff] group-hover:text-[#00363f]">
            STATS
          </span>
        </div>
      </div>
      <p className="relative z-10 mt-3 text-xs text-on-surface-variant">
        {formatKickoffLocal(match.kickoff)}
      </p>
      <p className="sr-only">{scoreLine(match, home, away)}</p>
    </Link>
  );
}
