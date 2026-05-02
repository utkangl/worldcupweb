"use client";

import dynamic from "next/dynamic";
import { usePredictionStore } from "@/features/predictions/stores/prediction-store";
import type { PlayerOption, Team } from "@/lib/types";

const ShareCardGenerator = dynamic(
  () =>
    import("@/features/share/components/ShareCardGenerator").then(
      (m) => m.ShareCardGenerator
    ),
  { ssr: false, loading: () => <p className="text-sm text-zinc-500">Loading exporter…</p> }
);

export function PredictionsShareSection({
  players,
  teams,
}: {
  players: PlayerOption[];
  teams: Team[];
}) {
  const { goldenBootPlayerId, topAssistPlayerId, championTeamId } =
    usePredictionStore();

  const gb = players.find((p) => p.id === goldenBootPlayerId);
  const ta = players.find((p) => p.id === topAssistPlayerId);
  const ch = teams.find((t) => t.id === championTeamId);

  const title =
    ch?.name ?? "My World Cup 2026 predictions";
  const subtitle = [
    gb ? `Golden boot: ${gb.name}` : null,
    ta ? `Assists: ${ta.name}` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <ShareCardGenerator
      title={title}
      subtitle={subtitle || "Golden boot · Assists · Champion"}
      footer="Share your picks"
    />
  );
}
