import type { Metadata } from "next";
import { MiniGamesArena } from "@/features/games/components/MiniGamesArena";
import { getMiniGames } from "@/lib/data/loaders";
import { Card } from "@/components/ui/Card";

export const metadata: Metadata = {
  title: "Games",
  description: "Bracket mini-games inspired by world cup style voting.",
};

export default function GamesPage() {
  const games = getMiniGames();

  return (
    <div className="animate-fade-in space-y-10">
      <header className="text-center md:text-left">
        <p className="font-label-caps text-[#00e0ff]">Arena</p>
        <h1 className="font-lexend mt-2 text-4xl font-extrabold text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.12)] md:text-5xl">
          Football Mini-Games
        </h1>
        <p className="mt-3 max-w-2xl text-lg text-on-surface-variant">
          Choose a bracket, pick winners head-to-head, and crown your champion.
        </p>
      </header>
      <MiniGamesArena games={games} />
      <section>
        <h2 className="font-label-caps mb-3 text-on-surface-variant">More modes soon</h2>
        <Card>
          <p className="text-sm text-on-surface-variant">
            Next wave can include trivia, guess-the-player, and timed challenge rooms.
            For now, bracket sessions run locally in your browser.
          </p>
        </Card>
      </section>
    </div>
  );
}
