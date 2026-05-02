import type { Metadata } from "next";
import { PredictionForm } from "@/features/predictions/components/PredictionForm";
import { PredictionsShareSection } from "@/features/share/components/PredictionsShareSection";
import { getPlayers, getTeams } from "@/lib/data/loaders";
import { Card } from "@/components/ui/Card";

export const metadata: Metadata = {
  title: "Predictions",
  description: "Golden boot, assists, and champion — saved locally.",
};

export default function PredictionsPage() {
  const players = getPlayers();
  const teams = getTeams();

  return (
    <div className="animate-fade-in space-y-10">
      <header>
        <h1 className="font-lexend text-4xl font-extrabold tracking-tight text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.08)] md:text-5xl">
          Lock In Your Prophecies
        </h1>
        <p className="mt-3 max-w-2xl text-lg text-on-surface-variant">
          Golden boot, top assists, and champion — saved on this device until we
          add accounts.
        </p>
      </header>
      <section>
        <h2 className="font-lexend mb-4 text-xl font-semibold text-white">
          Your picks
        </h2>
        <Card>
          <PredictionForm players={players} teams={teams} />
        </Card>
      </section>
      <section>
        <h2 className="font-lexend mb-4 text-xl font-semibold text-white">
          Share card
        </h2>
        <PredictionsShareSection players={players} teams={teams} />
      </section>
    </div>
  );
}
