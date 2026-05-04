import type { Metadata } from "next";
import { MiniGamesArena } from "@/features/games/components/MiniGamesArena";
import { getMiniGames } from "@/lib/data/loaders";

export const metadata: Metadata = {
  title: "Games",
  description:
    "Arena bracket mini-games — pick a mode, draft your pool size, and battle head-to-head.",
};

export default function GamesPage() {
  const games = getMiniGames();

  return (
    <div className="animate-fade-in">
      <MiniGamesArena games={games} />
    </div>
  );
}
