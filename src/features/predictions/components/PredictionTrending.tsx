"use client";

import { useEffect, useMemo, useState } from "react";
import { predictionFieldTop } from "@/lib/community-stats";
import type { PlayerOption, Team } from "@/lib/types";
import { Card } from "@/components/ui/Card";

const FIELDS = [
  { key: "champion", label: "Champion" },
  { key: "runnerUp", label: "Runner-up" },
  { key: "thirdPlace", label: "Third place" },
  { key: "surprise", label: "Dark horse" },
  { key: "goldenBoot", label: "Golden Boot" },
  { key: "assists", label: "Playmaker" },
  { key: "goldenGlove", label: "Golden Glove" },
  { key: "youngPlayer", label: "Best Young Player" },
] as const;

const TOP_N = 16;

export function PredictionTrending({
  players,
  teams,
}: {
  players: PlayerOption[];
  teams: Team[];
}) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const refresh = () => setTick((t) => t + 1);
    window.addEventListener("wc-pulse-community-stats", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("wc-pulse-community-stats", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  const teamName = useMemo(() => {
    const m = new Map(teams.map((t) => [t.id, t.name] as const));
    return (id: string) => m.get(id) ?? id;
  }, [teams]);

  const playerName = useMemo(() => {
    const m = new Map(players.map((p) => [p.id, p.name] as const));
    return (id: string) => m.get(id) ?? id;
  }, [players]);

  const rowsByField = useMemo(() => {
    void tick;
    return FIELDS.map((f) => ({
      ...f,
      rows: predictionFieldTop(f.key, TOP_N),
    }));
  }, [tick]);

  const anyData = rowsByField.some((x) => x.rows.some((r) => r.count > 0));

  return (
    <Card className="space-y-4 border-white/10 bg-[#201f20]/40 p-5">
      <div>
        <p className="font-label-caps text-[#00e0ff]">Local trends</p>
        <h3 className="font-lexend mt-1 text-lg font-semibold text-white">
          Most-chosen picks
        </h3>
        <p className="mt-1 text-xs text-zinc-500">
          Aggregated from this browser as you change the form — not a global poll.
        </p>
      </div>

      {!anyData ? (
        <p className="text-sm text-zinc-500">
          Nothing counted yet. Update any prediction field above to populate this
          list.
        </p>
      ) : (
        <div className="space-y-5">
          {rowsByField.map(({ key, label, rows }) => {
            const hasCounts = rows.some((r) => r.count > 0);
            if (!hasCounts) return null;
            const isPlayerField =
              key === "goldenBoot" ||
              key === "assists" ||
              key === "goldenGlove" ||
              key === "youngPlayer";
            const labelFn = isPlayerField ? playerName : teamName;
            return (
              <div key={key}>
                <p className="font-label-caps text-xs text-zinc-500">{label}</p>
                <ol className="mt-2 space-y-1.5">
                  {rows.map((r, i) => (
                    <li
                      key={r.id}
                      className="flex items-center justify-between gap-2 rounded-lg border border-white/5 bg-black/25 px-3 py-2 text-sm"
                    >
                      <span className="flex min-w-0 items-baseline gap-2">
                        <span className="shrink-0 font-mono text-xs text-zinc-600">
                          {i + 1}.
                        </span>
                        <span className="truncate text-white">{labelFn(r.id)}</span>
                      </span>
                      <span className="shrink-0 font-mono text-xs tabular-nums text-[#c3f400]">
                        {r.count}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
