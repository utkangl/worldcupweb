import { MatchesCountdowns } from "@/features/matches/components/MatchesCountdowns";
import { MatchListWithFilters } from "@/features/matches/components/MatchListWithFilters";
import { getMatches, getTeams } from "@/lib/data/loaders";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Matches",
  description: "Live scores, fixtures, and match centre for the World Cup.",
};

export default function MatchesPage() {
  const matches = getMatches();
  const teams = getTeams();

  return (
    <div className="animate-fade-in flex flex-col gap-10">
      <header className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="font-lexend text-4xl font-extrabold leading-tight tracking-tight text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.08)] md:text-5xl">
            Match Center
          </h1>
          <p className="mt-2 max-w-2xl text-lg text-on-surface-variant">
            Real-time scores, schedules, and immersive match data.
          </p>
        </div>
      </header>
      <MatchesCountdowns matches={matches} />
      <MatchListWithFilters matches={matches} teams={teams} />
    </div>
  );
}
