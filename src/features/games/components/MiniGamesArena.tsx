"use client";

import { useMemo, useState } from "react";
import type { MiniGameDefinition, MiniGameEntry } from "@/lib/types";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

const BRACKET_SIZES = [16, 32, 64] as const;

type Session = {
  size: number;
  currentRound: MiniGameEntry[];
  nextRound: MiniGameEntry[];
  pairIndex: number;
  completedMatches: number;
  champion: MiniGameEntry | null;
};

function shuffle<T>(items: T[]): T[] {
  const next = [...items];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

function samplePool(pool: MiniGameEntry[], size: number): MiniGameEntry[] {
  return shuffle(pool).slice(0, size);
}

function roundLabel(size: number): string {
  if (size === 2) return "Final";
  if (size === 4) return "Semi-finals";
  if (size === 8) return "Quarter-finals";
  return `Round of ${size}`;
}

function kindLabel(kind: MiniGameDefinition["kind"]): string {
  if (kind === "player") return "Players";
  if (kind === "team") return "Teams";
  return "Scorers and moments";
}

export function MiniGamesArena({ games }: { games: MiniGameDefinition[] }) {
  const [gameId, setGameId] = useState(games[0]?.id ?? "");
  const [size, setSize] = useState<number>(16);
  const [session, setSession] = useState<Session | null>(null);

  const selectedGame = useMemo(
    () => games.find((g) => g.id === gameId) ?? games[0],
    [games, gameId]
  );

  const availableSizes = useMemo(() => {
    if (!selectedGame) return [];
    return BRACKET_SIZES.filter((s) => selectedGame.pool.length >= s);
  }, [selectedGame]);

  const activeSize = availableSizes.includes(size as 16 | 32 | 64)
    ? size
    : availableSizes[0] ?? 16;

  const left = session?.currentRound[session.pairIndex * 2];
  const right = session?.currentRound[session.pairIndex * 2 + 1];

  const totalMatches = session ? session.size - 1 : activeSize - 1;
  const completed = session?.completedMatches ?? 0;
  const progress = totalMatches > 0 ? Math.round((completed / totalMatches) * 100) : 0;

  const startGame = () => {
    if (!selectedGame) return;
    const entrants = samplePool(selectedGame.pool, activeSize);
    setSession({
      size: activeSize,
      currentRound: entrants,
      nextRound: [],
      pairIndex: 0,
      completedMatches: 0,
      champion: null,
    });
  };

  const pickWinner = (winner: MiniGameEntry) => {
    setSession((prev) => {
      if (!prev) return prev;
      const nextRound = [...prev.nextRound, winner];
      const atEndOfRound = prev.pairIndex + 1 >= prev.currentRound.length / 2;
      const completedMatches = prev.completedMatches + 1;

      if (!atEndOfRound) {
        return {
          ...prev,
          pairIndex: prev.pairIndex + 1,
          nextRound,
          completedMatches,
        };
      }

      if (nextRound.length === 1) {
        return {
          ...prev,
          currentRound: nextRound,
          nextRound: [],
          pairIndex: 0,
          completedMatches,
          champion: nextRound[0],
        };
      }

      return {
        ...prev,
        currentRound: nextRound,
        nextRound: [],
        pairIndex: 0,
        completedMatches,
      };
    });
  };

  return (
    <div className="space-y-8">
      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="space-y-4">
          <p className="font-label-caps text-[#00e0ff]">Mini-game selector</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {games.map((g) => {
              const selected = g.id === selectedGame?.id;
              return (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => {
                    setGameId(g.id);
                    setSession(null);
                  }}
                  className={`rounded-xl border px-4 py-3 text-left transition ${
                    selected
                      ? "border-[#CCFF00]/40 bg-[#CCFF00]/10"
                      : "border-white/10 bg-black/20 hover:border-white/20"
                  }`}
                >
                  <p className="font-lexend text-base font-semibold text-white">{g.title}</p>
                  <p className="mt-1 text-xs text-on-surface-variant">{g.description}</p>
                </button>
              );
            })}
          </div>
        </Card>

        <Card className="space-y-4">
          <p className="font-label-caps text-on-surface-variant">Tournament setup</p>
          {selectedGame ? (
            <>
              <h3 className="font-lexend text-2xl font-bold text-white">{selectedGame.title}</h3>
              <p className="text-sm text-on-surface-variant">
                {kindLabel(selectedGame.kind)} · pool {selectedGame.pool.length}
              </p>
              <div className="flex gap-2">
                {availableSizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => {
                      setSize(s);
                      setSession(null);
                    }}
                    className={`rounded-md px-3 py-2 font-label-caps ${
                      activeSize === s
                        ? "bg-[#00e0ff] text-[#00363f]"
                        : "bg-surface-high text-on-surface-variant hover:text-white"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <Button type="button" onClick={startGame} className="w-full">
                Start {activeSize} bracket
              </Button>
            </>
          ) : null}
        </Card>
      </div>

      {session ? (
        session.champion ? (
          <Card className="text-center">
            <p className="font-label-caps text-[#CCFF00]">Champion decided</p>
            <h3 className="font-lexend mt-2 text-4xl font-black text-white">{session.champion.label}</h3>
            {session.champion.meta ? (
              <p className="mt-1 text-on-surface-variant">{session.champion.meta}</p>
            ) : null}
            <p className="mt-4 text-sm text-on-surface-variant">
              {selectedGame?.title} · {session.size} bracket
            </p>
            <div className="mt-6 flex justify-center gap-2">
              <Button type="button" onClick={startGame}>
                Play again
              </Button>
              <Button type="button" variant="ghost" onClick={() => setSession(null)}>
                Change mini-game
              </Button>
            </div>
          </Card>
        ) : (
          <div className="space-y-5">
            <Card className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <p className="font-label-caps text-[#00e0ff]">{roundLabel(session.currentRound.length)}</p>
                <p className="font-label-caps text-on-surface-variant">
                  Match {session.pairIndex + 1} / {session.currentRound.length / 2}
                </p>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-surface-high">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#00e0ff] to-[#CCFF00]"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-on-surface-variant">{completed} / {totalMatches} picks completed</p>
            </Card>

            {left && right ? (
              <div className="relative grid gap-4 md:grid-cols-2">
                <button
                  type="button"
                  onClick={() => pickWinner(left)}
                  className="group relative min-h-[220px] rounded-2xl border border-white/10 bg-[#201f20] p-6 text-left transition hover:border-[#CCFF00]/40 hover:shadow-[0_0_30px_rgba(204,255,0,0.12)]"
                >
                  <p className="font-label-caps text-[#CCFF00]">A</p>
                  <h4 className="font-lexend mt-4 text-3xl font-bold text-white">{left.label}</h4>
                  {left.meta ? <p className="mt-2 text-on-surface-variant">{left.meta}</p> : null}
                </button>
                <button
                  type="button"
                  onClick={() => pickWinner(right)}
                  className="group relative min-h-[220px] rounded-2xl border border-white/10 bg-[#201f20] p-6 text-left transition hover:border-[#00e0ff]/40 hover:shadow-[0_0_30px_rgba(0,224,255,0.12)]"
                >
                  <p className="font-label-caps text-[#00e0ff]">B</p>
                  <h4 className="font-lexend mt-4 text-3xl font-bold text-white">{right.label}</h4>
                  {right.meta ? <p className="mt-2 text-on-surface-variant">{right.meta}</p> : null}
                </button>
                <div className="pointer-events-none absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 md:block">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-black/70">
                    <MaterialIcon name="swords" className="text-xl text-[#00e0ff]" />
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        )
      ) : (
        <Card>
          <p className="text-on-surface-variant">
            Pick a mini-game, choose bracket size (16/32/64 when available), and start voting
            head-to-head like UwUFUFU world cup mode.
          </p>
        </Card>
      )}
    </div>
  );
}
