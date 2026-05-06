"use client";

import { useEffect, useMemo, useState } from "react";
import { FeaturedMatchStrip } from "@/features/home/components/FeaturedMatchStrip";
import { onFeaturedMatchChange, loadFeaturedMatchId } from "@/lib/featured-match";
import { pickFeaturedMatch } from "@/lib/match-utils";
import type { Match, Team } from "@/lib/types";

export function FeaturedMatchFromSelection({
  matches,
  teams,
}: {
  matches: Match[];
  teams: Team[];
}) {
  const [selectedId, setSelectedId] = useState<string>(() => loadFeaturedMatchId());
  const teamMap = useMemo(() => new Map(teams.map((t) => [t.id, t])), [teams]);

  useEffect(() => onFeaturedMatchChange(setSelectedId), []);

  const featured = useMemo(() => {
    const selectable = matches.filter((m) => m.status === "upcoming" || m.status === "live");
    if (selectedId) {
      const selected = selectable.find((m) => m.id === selectedId);
      if (selected) return selected;
    }
    return pickFeaturedMatch(matches);
  }, [matches, selectedId]);

  const home = featured ? teamMap.get(featured.homeTeamId) : undefined;
  const away = featured ? teamMap.get(featured.awayTeamId) : undefined;

  if (!featured || !home || !away) return null;
  return <FeaturedMatchStrip match={featured} home={home} away={away} />;
}
