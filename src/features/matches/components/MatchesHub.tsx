"use client";

import { useEffect, useMemo, useState } from "react";
import { MatchesCountdowns } from "@/features/matches/components/MatchesCountdowns";
import { MatchListWithFilters } from "@/features/matches/components/MatchListWithFilters";
import { getNextUpcomingMatch } from "@/lib/match-utils";
import { loadFeaturedMatchId, saveFeaturedMatchId } from "@/lib/featured-match";
import type { Match, Team } from "@/lib/types";

export function MatchesHub({
  matches,
  teams,
}: {
  matches: Match[];
  teams: Team[];
}) {
  const selectable = useMemo(
    () => matches.filter((m) => m.status === "upcoming" || m.status === "live"),
    [matches]
  );
  const selectableSet = useMemo(() => new Set(selectable.map((m) => m.id)), [selectable]);
  const next = useMemo(() => getNextUpcomingMatch(matches), [matches]);
  const [featuredMatchId, setFeaturedMatchId] = useState<string>(
    () => {
      const stored = loadFeaturedMatchId();
      if (stored && selectable.some((m) => m.id === stored)) return stored;
      return next?.id ?? selectable[0]?.id ?? "";
    }
  );

  useEffect(() => {
    if (!featuredMatchId || !selectableSet.has(featuredMatchId)) {
      const fallback = next?.id ?? selectable[0]?.id ?? "";
      setFeaturedMatchId(fallback);
      if (fallback) saveFeaturedMatchId(fallback);
    }
  }, [featuredMatchId, selectableSet, next, selectable]);

  const selectFeatured = (matchId: string) => {
    setFeaturedMatchId(matchId);
    saveFeaturedMatchId(matchId);
  };

  return (
    <>
      <MatchesCountdowns
        matches={matches}
        teams={teams}
        selectedId={featuredMatchId}
        onSelectedIdChange={selectFeatured}
      />
      <MatchListWithFilters
        matches={matches}
        teams={teams}
        featuredMatchId={featuredMatchId}
        onSelectFeatured={selectFeatured}
      />
    </>
  );
}
