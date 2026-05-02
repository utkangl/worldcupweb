"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import { usePredictionStore } from "@/features/predictions/stores/prediction-store";
import type { PlayerOption, Team } from "@/lib/types";
import type { SharePredictionRow } from "@/features/share/components/ShareCardGenerator";

const ShareCardGenerator = dynamic(
  () =>
    import("@/features/share/components/ShareCardGenerator").then(
      (m) => m.ShareCardGenerator
    ),
  {
    ssr: false,
    loading: () => <p className="text-sm text-zinc-500">Loading exporter…</p>,
  }
);

export function PredictionsShareSection({
  players,
  teams,
}: {
  players: PlayerOption[];
  teams: Team[];
}) {
  const {
    goldenBootPlayerId,
    topAssistPlayerId,
    goldenGlovePlayerId,
    youngPlayerPlayerId,
    championTeamId,
    runnerUpTeamId,
    thirdPlaceTeamId,
    surpriseTeamId,
    goldenBootGoalTotal,
  } = usePredictionStore();

  const gb = players.find((p) => p.id === goldenBootPlayerId);
  const ta = players.find((p) => p.id === topAssistPlayerId);
  const gg = players.find((p) => p.id === goldenGlovePlayerId);
  const yp = players.find((p) => p.id === youngPlayerPlayerId);
  const ch = teams.find((t) => t.id === championTeamId);
  const ru = teams.find((t) => t.id === runnerUpTeamId);
  const tp = teams.find((t) => t.id === thirdPlaceTeamId);
  const dh = teams.find((t) => t.id === surpriseTeamId);

  const title = ch?.name ?? "My World Cup 2026 predictions";

  const predictionRows = useMemo((): SharePredictionRow[] => {
    const rows: SharePredictionRow[] = [];
    if (ch) rows.push({ label: "Champion", value: ch.name });
    if (ru) rows.push({ label: "Runner-up", value: ru.name });
    if (tp) rows.push({ label: "Third", value: tp.name });
    if (dh) rows.push({ label: "Dark horse", value: dh.name });
    if (gb) {
      const goals =
        goldenBootGoalTotal.trim() !== ""
          ? `${goldenBootGoalTotal} goals`
          : "";
      const value =
        goals !== "" ? `${gb.name} (${goals})` : gb.name;
      rows.push({ label: "Golden Boot", value });
    }
    if (ta) rows.push({ label: "Assists", value: ta.name });
    if (gg) rows.push({ label: "Golden Glove", value: gg.name });
    if (yp) rows.push({ label: "Young player", value: yp.name });
    return rows;
  }, [
    ch,
    ru,
    tp,
    dh,
    gb,
    ta,
    gg,
    yp,
    goldenBootGoalTotal,
  ]);

  return (
    <ShareCardGenerator
      title={title}
      predictionRows={predictionRows}
      subtitle="Podium · Players · Dark horse — fill the form to preview"
      footer="Share your picks"
    />
  );
}
