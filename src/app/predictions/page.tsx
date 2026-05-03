import type { Metadata } from "next";
import { PredictionForm } from "@/features/predictions/components/PredictionForm";
import { PredictionTrending } from "@/features/predictions/components/PredictionTrending";
import { PredictionsShareSection } from "@/features/share/components/PredictionsShareSection";
import { getPlayers, getTeams } from "@/lib/data/loaders";
import { Card } from "@/components/ui/Card";

export const metadata: Metadata = {
  title: "Predictions",
  description:
    "Podium, dark horse, awards, and more — your World Cup 2026 picks saved locally.",
};

export default function PredictionsPage() {
  const players = getPlayers();
  const teams = getTeams();

  return (
    <div className="animate-fade-in space-y-10">
      <header className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#1a1a1b] via-[#131314] to-[#0a0a0b] p-6 shadow-[0_0_60px_rgba(195,244,0,0.06)] md:p-10">
        <div
          className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#c3f400]/10 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-[#00e0ff]/8 blur-3xl"
          aria-hidden
        />
        <div className="relative">
          <p className="font-label-caps mb-2 text-[#00e0ff]/90">World Cup Pulse</p>
          <h1 className="font-lexend text-4xl font-extrabold tracking-tight text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.08)] md:text-5xl">
            Lock In Your{" "}
            <span className="bg-gradient-to-r from-[#c3f400] to-[#e8ff7a] bg-clip-text text-transparent">
              Prophecies
            </span>
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-on-surface-variant">
            Podium finishes, a dark horse, golden boot with an optional goal tally,
            assists, glove, and young player — all in one place. Saved on this device
            until accounts arrive.
          </p>
        </div>
      </header>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_min(100%,380px)] lg:items-start lg:gap-12">
        <section className="min-w-0 space-y-4">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h2 className="font-lexend text-xl font-semibold text-white">
              Your picks
            </h2>
            <span className="text-xs text-zinc-500">Local storage · private</span>
          </div>
          <Card className="border-white/10 bg-[#201f20]/40 p-5 md:p-7">
            <PredictionForm players={players} teams={teams} />
          </Card>
          <PredictionTrending players={players} teams={teams} />
        </section>

        <aside className="space-y-4 lg:sticky lg:top-24">
          <h2 className="font-lexend text-xl font-semibold text-white">
            Share card
          </h2>
          <p className="text-sm text-zinc-500">
            Export a PNG with your headline picks — lines update as you fill the form.
          </p>
          <PredictionsShareSection players={players} teams={teams} />
        </aside>
      </div>
    </div>
  );
}
