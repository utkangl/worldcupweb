"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { MiniGameDefinition, MiniGameEntry } from "@/lib/types";
import {
  bumpMiniGameWinner,
  miniGameLeaderboard,
} from "@/lib/community-stats";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { BracketFullscreenLayer } from "@/features/games/components/BracketFullscreenLayer";

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

function kindLabel(kind: MiniGameDefinition["kind"]): string {
  if (kind === "player") return "Players";
  if (kind === "team") return "Teams";
  return "Scorers and moments";
}

export function MiniGamesArena({ games }: { games: MiniGameDefinition[] }) {
  const [gameId, setGameId] = useState(games[0]?.id ?? "");
  const [size, setSize] = useState<number>(16);
  const [session, setSession] = useState<Session | null>(null);
  const [leaderboardTick, setLeaderboardTick] = useState(0);
  const [portalReady, setPortalReady] = useState(false);

  useEffect(() => {
    setPortalReady(true);
  }, []);

  useEffect(() => {
    const refresh = () => setLeaderboardTick((t) => t + 1);
    window.addEventListener("wc-pulse-community-stats", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("wc-pulse-community-stats", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

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

  const poolLeaderboard = useMemo(() => {
    if (!selectedGame) return [];
    void leaderboardTick;
    return miniGameLeaderboard(selectedGame.id, selectedGame.pool);
  }, [selectedGame, leaderboardTick]);

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
    if (selectedGame) bumpMiniGameWinner(selectedGame.id, winner.id);
    setLeaderboardTick((t) => t + 1);
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

  const closeFullscreen = useCallback(() => {
    setSession((cur) => {
      if (!cur) return cur;
      if (!cur.champion) {
        if (!window.confirm("Exit bracket? Your progress will be lost.")) {
          return cur;
        }
      }
      return null;
    });
  }, []);

  return (
    <div className="space-y-8">
      {portalReady && session ? (
        <BracketFullscreenLayer
          session={session}
          selectedGame={selectedGame}
          progress={progress}
          completed={completed}
          totalMatches={totalMatches}
          left={left}
          right={right}
          onPick={pickWinner}
          onClose={closeFullscreen}
          onPlayAgain={startGame}
        />
      ) : null}
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

      {selectedGame ? (
        <Card className="space-y-3">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className="font-label-caps text-[#CCFF00]">Pick popularity</p>
              <h3 className="font-lexend mt-1 text-lg font-semibold text-white">
                {selectedGame.title} — ranked
              </h3>
              <p className="mt-1 text-xs text-on-surface-variant">
                Counts from head-to-head taps on this device (local only).
              </p>
            </div>
            <span className="rounded-md border border-white/10 bg-black/30 px-2 py-1 font-mono text-[10px] text-zinc-400">
              {selectedGame.pool.length} entries
            </span>
          </div>
          <div className="max-h-[min(70vh,28rem)] overflow-y-auto rounded-xl border border-white/10">
            <table className="w-full text-left text-sm">
              <thead className="sticky top-0 z-[1] bg-[#1a1a1b] text-xs uppercase tracking-wide text-zinc-500">
                <tr>
                  <th className="px-3 py-2 font-medium">#</th>
                  <th className="px-3 py-2 font-medium">Choice</th>
                  <th className="px-3 py-2 text-right font-medium">Picks</th>
                </tr>
              </thead>
              <tbody>
                {poolLeaderboard.map((row, i) => {
                  const entry = selectedGame.pool.find((e) => e.id === row.id);
                  return (
                    <tr
                      key={row.id}
                      className="border-t border-white/5 odd:bg-black/15 hover:bg-white/[0.04]"
                    >
                      <td className="px-3 py-2 font-mono text-zinc-500">{i + 1}</td>
                      <td className="px-3 py-2 text-white">
                        {entry?.label ?? row.id}
                        {entry?.meta ? (
                          <span className="ml-2 text-xs text-zinc-500">{entry.meta}</span>
                        ) : null}
                      </td>
                      <td className="px-3 py-2 text-right font-mono tabular-nums text-[#00e0ff]">
                        {row.count}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      ) : null}

      {!session ? (
        <Card>
          <p className="text-on-surface-variant">
            Pick a mini-game, choose bracket size (16/32/64 when available), then{" "}
            <span className="text-white">Start bracket</span> — the matchup opens in a
            full-screen arena so the flow is obvious.
          </p>
        </Card>
      ) : null}
    </div>
  );
}
