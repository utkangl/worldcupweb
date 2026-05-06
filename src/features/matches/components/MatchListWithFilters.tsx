"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  formatFixtureDayPillTRT,
  formatFixtureDayTitleTRT,
  formatKickoffClockTRT,
  kickoffCalendarKeyTRT,
  statusLabel,
} from "@/features/matches/lib/format";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { flagUrl } from "@/lib/flag-url";
import type { Match, Team } from "@/lib/types";

type Stage = "all" | "group" | "knockout";

type DayBucket = {
  dayKey: string;
  title: string;
  pill: string;
  matches: Match[];
};

export function MatchListWithFilters({
  matches,
  teams,
  featuredMatchId,
  onSelectFeatured,
}: {
  matches: Match[];
  teams: Team[];
  featuredMatchId?: string;
  onSelectFeatured?: (matchId: string) => void;
}) {
  const [stage, setStage] = useState<Stage>("all");
  const [selectedDay, setSelectedDay] = useState<string>("");
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const daysStripRef = useRef<HTMLDivElement | null>(null);

  const teamMap = useMemo(() => new Map(teams.map((t) => [t.id, t])), [teams]);

  const filtered = useMemo(() => {
    if (stage === "all") return matches;
    return matches.filter((m) => m.stage === stage);
  }, [matches, stage]);

  const buckets = useMemo<DayBucket[]>(() => {
    const sorted = [...filtered].sort(
      (a, b) => +new Date(a.kickoff) - +new Date(b.kickoff)
    );

    const map = new Map<string, DayBucket>();
    for (const m of sorted) {
      const key = kickoffCalendarKeyTRT(m.kickoff);
      const bucket = map.get(key);
      if (bucket) {
        bucket.matches.push(m);
      } else {
        map.set(key, {
          dayKey: key,
          title: formatFixtureDayTitleTRT(m.kickoff),
          pill: formatFixtureDayPillTRT(m.kickoff),
          matches: [m],
        });
      }
    }

    return [...map.values()];
  }, [filtered]);

  useEffect(() => {
    if (!buckets.length) {
      setSelectedDay("");
      return;
    }
    const exists = buckets.some((b) => b.dayKey === selectedDay);
    if (!selectedDay || !exists) {
      setSelectedDay(buckets[0].dayKey);
    }
  }, [buckets, selectedDay]);

  useEffect(() => {
    const el = daysStripRef.current;
    if (!el) return;

    const update = () => {
      const maxScroll = el.scrollWidth - el.clientWidth;
      setCanScrollLeft(el.scrollLeft > 8);
      setCanScrollRight(el.scrollLeft < maxScroll - 8);
    };

    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [buckets]);

  const active = buckets.find((b) => b.dayKey === selectedDay) ?? buckets[0];

  const scrollDays = (dir: "left" | "right") => {
    const el = daysStripRef.current;
    if (!el) return;
    const amount = Math.max(220, Math.floor(el.clientWidth * 0.7));
    el.scrollBy({
      left: dir === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full items-center rounded-lg bg-surface-high p-1 sm:w-auto">
          {(
            [
              ["all", "All fixtures"],
              ["group", "Group stage"],
              ["knockout", "Knockout"],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setStage(key)}
              className={`flex-1 rounded-md px-4 py-2 font-label-caps transition-all sm:flex-none ${
                stage === key
                  ? "bg-[#00e0ff] text-[#00363f] shadow-[0_0_10px_rgba(0,224,255,0.3)]"
                  : "text-on-surface-variant hover:text-white"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <p className="text-sm text-on-surface-variant">
          Kick-offs in <span className="text-[#CCFF00]">TRT</span> (Istanbul)
        </p>
      </div>

      <div className="glass-effect rounded-xl border border-white/10 p-2">
        <div className="mb-1 hidden items-center justify-end gap-2 px-1 md:flex">
          <button
            type="button"
            onClick={() => scrollDays("left")}
            disabled={!canScrollLeft}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-[#0e0e0f]/90 text-white transition hover:border-[#00e0ff]/50 hover:text-[#00e0ff] disabled:cursor-default disabled:opacity-30"
            aria-label="Scroll days left"
          >
            <MaterialIcon name="chevron_left" className="!text-xl" />
          </button>
          <button
            type="button"
            onClick={() => scrollDays("right")}
            disabled={!canScrollRight}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-[#0e0e0f]/90 text-white transition hover:border-[#00e0ff]/50 hover:text-[#00e0ff] disabled:cursor-default disabled:opacity-30"
            aria-label="Scroll days right"
          >
            <MaterialIcon name="chevron_right" className="!text-xl" />
          </button>
        </div>
        <div
          ref={daysStripRef}
          className="hide-scrollbar overflow-x-auto scroll-smooth px-1 pb-1"
        >
          <div className="flex min-w-max gap-2">
          {buckets.map((b) => {
            const isActive = b.dayKey === active?.dayKey;
            return (
              <button
                key={b.dayKey}
                type="button"
                onClick={() => setSelectedDay(b.dayKey)}
                className={`shrink-0 rounded-lg px-4 py-2.5 text-left transition ${
                  isActive
                    ? "border border-[#CCFF00]/40 bg-[#CCFF00]/10 text-white shadow-[0_0_20px_rgba(204,255,0,0.12)]"
                    : "border border-transparent text-on-surface-variant hover:border-white/10 hover:bg-white/5 hover:text-white"
                }`}
              >
                <span className="font-label-caps block text-[10px] tracking-wide text-on-surface-variant">
                  {b.matches.length} {b.matches.length === 1 ? "match" : "matches"}
                </span>
                <span className="font-lexend mt-0.5 block text-sm font-semibold">
                  {b.pill}
                </span>
              </button>
            );
          })}
          </div>
        </div>
      </div>

      {!active ? (
        <div className="glass-effect rounded-xl border border-white/10 p-8 text-center text-on-surface-variant">
          No fixtures for this filter.
        </div>
      ) : (
        <div className="space-y-4">
          <div className="glass-effect rounded-xl border border-white/10 px-5 py-4">
            <h2 className="font-lexend text-2xl font-bold text-white md:text-3xl">
              {active.title}
            </h2>
            <p className="mt-1 text-sm text-on-surface-variant">
              {active.matches.length} {active.matches.length === 1 ? "match" : "matches"}{" "}
              · TRT
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {active.matches.map((m) => {
              const home = teamMap.get(m.homeTeamId);
              const away = teamMap.get(m.awayTeamId);
              if (!home || !away) return null;

              const live = m.status === "live";
              const finished = m.status === "finished";

              const canFeature = m.status === "upcoming" || m.status === "live";
              const isFeatured = featuredMatchId === m.id;

              return (
                <div
                  key={m.id}
                  className={`glass-effect group relative overflow-hidden rounded-xl border p-4 transition-all duration-300 md:p-5 ${
                    live
                      ? "border-[#00e0ff]/50 shadow-[0_0_20px_rgba(0,224,255,0.1)]"
                      : "border-white/10 hover:border-[#CCFF00]/30"
                  } ${finished ? "opacity-90 grayscale-[15%] hover:grayscale-0" : ""}`}
                >
                  {live ? (
                    <div className="pointer-events-none absolute left-1/2 top-1/2 h-3/4 w-3/4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#00e0ff]/10 blur-[60px]" />
                  ) : null}
                  <div className="relative z-10 mb-3 flex justify-end">
                    <button
                      type="button"
                      disabled={!canFeature}
                      onClick={() => canFeature && onSelectFeatured?.(m.id)}
                      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 font-label-caps text-[10px] transition ${
                        isFeatured
                          ? "border-[#CCFF00]/40 bg-[#CCFF00]/10 text-[#CCFF00]"
                          : "border-white/10 bg-black/20 text-on-surface-variant hover:border-[#00e0ff]/40 hover:text-[#00e0ff]"
                      } ${!canFeature ? "cursor-default opacity-40" : ""}`}
                    >
                      <MaterialIcon name="schedule" className="!text-sm" />
                      {isFeatured ? "Featured" : "Set featured"}
                    </button>
                  </div>
                  <Link href={`/matches/${m.id}`} className="block">
                  <div className="relative z-10 mb-3 flex items-start justify-between gap-2">
                    <span className="font-label-caps text-on-surface-variant">
                      {home.shortName} vs {away.shortName}
                    </span>
                    <div className="flex flex-col items-end gap-1">
                      {live ? (
                        <span className="font-label-caps text-[#00e0ff]">LIVE</span>
                      ) : (
                        <span className="font-label-caps text-on-surface-variant">
                          {statusLabel(m.status).toUpperCase()}
                        </span>
                      )}
                      <span className="font-label-caps rounded-full bg-[#201f20] px-2.5 py-0.5 text-[10px] text-on-surface-variant">
                        {m.round ?? m.stage}
                      </span>
                    </div>
                  </div>

                  <div className="relative z-10 space-y-3">
                    {[home, away].map((team) => (
                      <div key={team.id} className="flex items-center gap-3">
                        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-white/10 bg-[#201f20]">
                          <Image
                            src={flagUrl(team.fifaCode)}
                            alt=""
                            fill
                            unoptimized
                            className="object-cover"
                            sizes="40px"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-lexend truncate text-lg font-semibold text-white">
                            {team.shortName}
                          </p>
                          <p className="truncate text-xs text-on-surface-variant">
                            {team.name}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="relative z-10 mt-4 border-t border-white/10 pt-3 text-center">
                    {m.status === "upcoming" ? (
                      <>
                        <p className="font-lexend text-3xl font-extrabold tabular-nums text-white/90">
                          {formatKickoffClockTRT(m.kickoff)}
                        </p>
                        <p className="font-label-caps mt-1 text-on-surface-variant">
                          KICKOFF TRT
                        </p>
                      </>
                    ) : (
                      <div className="flex items-center justify-center gap-3">
                        <span
                          className={`font-lexend text-4xl font-extrabold tabular-nums ${live ? "text-[#00e0ff]" : "text-white"}`}
                        >
                          {m.homeScore ?? 0}
                        </span>
                        <span className="font-lexend text-2xl text-white/35">–</span>
                        <span className="font-lexend text-4xl font-extrabold tabular-nums text-white/90">
                          {m.awayScore ?? 0}
                        </span>
                      </div>
                    )}
                  </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
