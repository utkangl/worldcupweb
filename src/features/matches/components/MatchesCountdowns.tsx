"use client";

import { useMemo, useState } from "react";
import { CountdownTimer } from "@/features/countdown/components/CountdownTimer";
import {
  formatKickoffClockTRT,
  formatFixtureDayTitleTRT,
} from "@/features/matches/lib/format";
import type { Match } from "@/lib/types";
import { getNextUpcomingMatch } from "@/lib/match-utils";

function matchLabel(matchId: string): string {
  const n = matchId.match(/(\d+)/)?.[1];
  return n ? `Match ${Number(n)}` : matchId.toUpperCase();
}

export function MatchesCountdowns({ matches }: { matches: Match[] }) {
  const next = useMemo(() => getNextUpcomingMatch(matches), [matches]);
  const selectable = useMemo(
    () => matches.filter((m) => m.status === "upcoming" || m.status === "live"),
    [matches]
  );
  const [selectedId, setSelectedId] = useState(() => next?.id ?? selectable[0]?.id ?? "");

  const selected = matches.find((m) => m.id === selectedId) ?? next;

  return (
    <section className="space-y-4">
      <div className="glass-effect relative overflow-hidden rounded-2xl border border-[#CCFF00]/20 p-5 md:p-7">
        <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-[#CCFF00]/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-12 -left-8 h-40 w-40 rounded-full bg-[#00e0ff]/10 blur-3xl" />

        <div className="relative z-10 grid gap-5 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div>
            <p className="font-label-caps text-[#CCFF00]">Focused countdown</p>
            <h2 className="font-lexend mt-2 text-3xl font-black text-white md:text-4xl">
              {selected ? matchLabel(selected.id) : "Next match"}
            </h2>
            {selected ? (
              <p className="mt-2 text-on-surface-variant">
                {formatFixtureDayTitleTRT(selected.kickoff)} - {formatKickoffClockTRT(selected.kickoff)} TRT
              </p>
            ) : (
              <p className="mt-2 text-on-surface-variant">No upcoming matches right now.</p>
            )}
          </div>

          {selected ? (
            <CountdownTimer
              targetIso={selected.kickoff}
              label="Kick-off in"
              size="hero"
              className="border border-white/10 bg-black/20"
            />
          ) : null}
        </div>
      </div>

      <div className="glass-effect rounded-xl border border-white/10 p-4">
        <label className="font-label-caps text-on-surface-variant">Change focus match</label>
        <select
          className="mt-2 w-full rounded-lg border border-white/10 bg-[#0e0e0f] px-3 py-2 text-sm text-white"
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          disabled={selectable.length === 0}
        >
          {selectable.length === 0 ? (
            <option value="">No upcoming matches</option>
          ) : (
            selectable.map((m) => (
              <option key={m.id} value={m.id}>
                {matchLabel(m.id)} - {formatFixtureDayTitleTRT(m.kickoff)} - {formatKickoffClockTRT(m.kickoff)}
              </option>
            ))
          )}
        </select>
      </div>
    </section>
  );
}
