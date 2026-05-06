import { FeaturedMatchFromSelection } from "@/features/home/components/FeaturedMatchFromSelection";
import { HomeBentoGrid } from "@/features/home/components/HomeBentoGrid";
import { HomeHero } from "@/features/home/components/HomeHero";
import { getMatches, getTeams } from "@/lib/data/loaders";

export default function HomePage() {
  const matches = getMatches();
  const teams = getTeams();

  return (
    <div className="animate-fade-in flex flex-col gap-10">
      <HomeHero />
      <FeaturedMatchFromSelection matches={matches} teams={teams} />
      <HomeBentoGrid />
    </div>
  );
}
