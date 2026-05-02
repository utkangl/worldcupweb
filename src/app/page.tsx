import { FeaturedMatchStrip } from "@/features/home/components/FeaturedMatchStrip";
import { HomeBentoGrid } from "@/features/home/components/HomeBentoGrid";
import { HomeHero } from "@/features/home/components/HomeHero";
import { getMatches, getTeamsMap } from "@/lib/data/loaders";
import { pickFeaturedMatch } from "@/lib/match-utils";

export default function HomePage() {
  const matches = getMatches();
  const teamMap = getTeamsMap();
  const featured = pickFeaturedMatch(matches);
  const homeTeam = featured ? teamMap.get(featured.homeTeamId) : undefined;
  const awayTeam = featured ? teamMap.get(featured.awayTeamId) : undefined;

  return (
    <div className="animate-fade-in flex flex-col gap-10">
      <HomeHero />
      {featured && homeTeam && awayTeam && (
        <FeaturedMatchStrip match={featured} home={homeTeam} away={awayTeam} />
      )}
      <HomeBentoGrid />
    </div>
  );
}
