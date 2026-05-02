import type { Metadata } from "next";
import { SimulatorView } from "@/features/simulator/components/SimulatorView";
import { getBracketTemplate, getTeams } from "@/lib/data/loaders";

export const metadata: Metadata = {
  title: "Simulator",
  description:
    "Order groups 1st–4th for the 48-team format, then play out the knockout bracket.",
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
          Set each group&apos;s finish order (1st–4th) for the 12-group World Cup,
          then pick winners from the Round of 32 through the final.
        </p>
      </header>
      <SimulatorView teams={teams} template={template} />
    </div>
  );
}
