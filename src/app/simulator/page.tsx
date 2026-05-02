import type { Metadata } from "next";
import { SimulatorView } from "@/features/simulator/components/SimulatorView";
import { getBracketTemplate, getTeams } from "@/lib/data/loaders";

export const metadata: Metadata = {
  title: "Simulator",
  description: "Predict group results and play out the knockout bracket.",
};

export default function SimulatorPage() {
  const teams = getTeams();
  const template = getBracketTemplate();

  return (
    <div className="animate-fade-in space-y-8">
      <header>
        <h1 className="font-lexend text-4xl font-extrabold text-white md:text-5xl">
          Tournament{" "}
          <span className="text-[#c3f400]">Simulator</span>
        </h1>
        <p className="mt-3 max-w-2xl text-lg text-on-surface-variant">
          Predict group scores, generate standings, then play out the knockout
          path to crown your champion.
        </p>
      </header>
      <SimulatorView teams={teams} template={template} />
    </div>
  );
}
