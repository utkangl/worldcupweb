"use client";

import { usePredictionStore } from "@/features/predictions/stores/prediction-store";
import type { PlayerOption, Team } from "@/lib/types";
import { Button } from "@/components/ui/Button";

export function PredictionForm({
  players,
  teams,
}: {
  players: PlayerOption[];
  teams: Team[];
}) {
  const {
    goldenBootPlayerId,
    topAssistPlayerId,
    championTeamId,
    setGoldenBoot,
    setTopAssist,
    setChampion,
    reset,
  } = usePredictionStore();

  return (
    <div className="space-y-8">
      <div>
        <label className="font-lexend text-sm font-medium text-white">
          Golden boot
        </label>
        <select
          className="mt-2 w-full rounded-xl border border-white/10 bg-[#0e0e0f] px-3 py-3 text-sm text-white focus:border-[#c3f400] focus:outline-none focus:ring-1 focus:ring-[#c3f400]"
          value={goldenBootPlayerId}
          onChange={(e) => setGoldenBoot(e.target.value)}
        >
          <option value="">Select player</option>
          {players.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} ({p.country})
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="font-lexend text-sm font-medium text-white">
          Top assists
        </label>
        <select
          className="mt-2 w-full rounded-xl border border-white/10 bg-[#0e0e0f] px-3 py-3 text-sm text-white focus:border-[#c3f400] focus:outline-none focus:ring-1 focus:ring-[#c3f400]"
          value={topAssistPlayerId}
          onChange={(e) => setTopAssist(e.target.value)}
        >
          <option value="">Select player</option>
          {players.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} ({p.country})
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="font-lexend text-sm font-medium text-white">
          Champion
        </label>
        <select
          className="mt-2 w-full rounded-xl border border-white/10 bg-[#0e0e0f] px-3 py-3 text-sm text-white focus:border-[#c3f400] focus:outline-none focus:ring-1 focus:ring-[#c3f400]"
          value={championTeamId}
          onChange={(e) => setChampion(e.target.value)}
        >
          <option value="">Select nation</option>
          {teams.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
      </div>
      <Button type="button" variant="ghost" onClick={() => reset()}>
        Clear predictions
      </Button>
    </div>
  );
}
