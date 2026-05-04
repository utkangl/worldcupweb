"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { MiniGameDefinition, MiniGameEntry } from "@/lib/types";
import {
  bumpMiniGameWinner,
  miniGameLeaderboard,
} from "@/lib/community-stats";
import { Button } from "@/components/ui/Button";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { BracketFullscreenLayer } from "@/features/games/components/BracketFullscreenLayer";

const BRACKET_SIZES = [16, 32, 64] as const;

const MODE_CARD_BACKDROPS = [
  "from-[#1a3d22]/90 via-[#0e1210]/95 to-[#050505]",
  "from-[#0c2436]/90 via-[#0e1014]/95 to-[#050505]",
  "from-[#301a24]/90 via-[#100e10]/95 to-[#050505]",
  "from-[#24201a]/90 via-[#0f0e0c]/95 to-[#050505]",
] as const;

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
  return "Moments";
}

function modeCategory(kind: MiniGameDefinition["kind"]): string {
  if (kind === "player") return "Tournament";
  if (kind === "team") return "Versus";
  return "Predictor";
}

function initials(label: string): string {
  const parts = label.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0]![0] ?? ""}${parts[1]![0] ?? ""}`.toUpperCase();
  }
  return label.slice(0, 2).toUpperCase();
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

  const totalPickEvents = useMemo(
    () => poolLeaderboard.reduce((sum, r) => sum + r.count, 0),
    [poolLeaderboard]
  );

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
    <div>
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

      <div className="mx-auto w-full max-w-[1280px] px-4 pb-10 md:px-6">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-x-6 lg:gap-y-8">
          {/* Page hero */}
          <header className="lg:col-span-12">
            <h1 className="font-lexend text-3xl font-extrabold uppercase leading-tight tracking-tight text-white drop-shadow-[0_0_18px_rgba(255,255,255,0.08)] sm:text-4xl md:text-5xl">
              Football Mini-Games
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-on-surface-variant md:text-lg">
              Step into the arena: pick a mode, set your bracket size, then run
              head-to-head duels in fullscreen. Pick counts build a local popularity
              board on this device.
            </p>
          </header>

          {/* Mode grid */}
          <section className="flex flex-col gap-4 lg:col-span-8">
            <h2 className="font-lexend text-lg font-semibold text-white md:text-xl">
              Select mode
            </h2>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {games.map((g, idx) => {
                const selected = g.id === selectedGame?.id;
                const backdrop = MODE_CARD_BACKDROPS[idx % MODE_CARD_BACKDROPS.length];
                return (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => {
                      setGameId(g.id);
                      setSession(null);
                    }}
                    className={`group relative z-0 h-48 w-full cursor-pointer overflow-hidden rounded-xl border text-left transition-all duration-300 hover:-translate-y-1 ${
                      selected
                        ? "z-10 scale-[1.02] border-2 border-[#c3f400] shadow-[0_0_22px_rgba(195,244,0,0.22)]"
                        : "border border-white/10 bg-[#0e0e0f] hover:border-white/25"
                    }`}
                  >
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${backdrop}`}
                      aria-hidden
                    />
                    <div
                      className="pointer-events-none absolute inset-0 opacity-30 mix-blend-overlay"
                      style={{
                        backgroundImage:
                          "repeating-linear-gradient(-12deg, transparent, transparent 12px, rgba(255,255,255,0.04) 12px, rgba(255,255,255,0.04) 13px)",
                      }}
                      aria-hidden
                    />
                    <div
                      className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#131314] via-[#131314]/85 to-transparent"
                      aria-hidden
                    />
                    <div className="absolute bottom-0 left-0 z-[1] w-full p-4 md:p-5">
                      <div className="flex items-end justify-between gap-3">
                        <div className="min-w-0">
                          <span
                            className={`font-label-caps mb-1 block text-[11px] tracking-[0.14em] ${
                              selected ? "text-[#c3f400]" : "text-on-surface-variant"
                            }`}
                          >
                            {modeCategory(g.kind)}
                          </span>
                          <h3 className="font-lexend text-lg font-bold leading-snug text-white md:text-xl">
                            {g.title}
                          </h3>
                          <p className="mt-1 line-clamp-2 text-xs text-zinc-500 md:text-sm">
                            {g.description}
                          </p>
                        </div>
                        {selected ? (
                          <MaterialIcon
                            name="check_circle"
                            className="!text-3xl shrink-0 text-[#c3f400]"
                            filled
                          />
                        ) : null}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Setup sidebar */}
          <aside className="flex flex-col gap-5 lg:col-span-4">
            <h2 className="font-lexend text-lg font-semibold text-white md:text-xl">
              Setup draft
            </h2>
            {selectedGame ? (
              <div className="relative overflow-hidden rounded-xl border border-white/10 bg-[rgba(255,255,255,0.03)] p-5 shadow-[0_4px_30px_rgba(0,0,0,0.45)] backdrop-blur-md md:p-6">
                <div
                  className="pointer-events-none absolute -right-4 -top-4 h-36 w-36 rounded-full bg-[#c3f400]/10 blur-3xl"
                  aria-hidden
                />
                <div className="relative z-10">
                  <div className="mb-4 flex items-center gap-2">
                    <MaterialIcon
                      name="emoji_events"
                      className="!text-2xl text-[#c3f400]"
                      filled
                    />
                    <span className="font-label-caps text-[11px] tracking-[0.12em] text-[#c3f400]">
                      {selectedGame.title}
                    </span>
                  </div>
                  <h3 className="font-lexend text-xl font-bold text-white md:text-2xl">
                    Bracket size
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
                    {selectedGame.pool.length} entries in this pool ·{" "}
                    {kindLabel(selectedGame.kind)}. Choose how many enter this run.
                  </p>
                  <div className="mb-6 mt-5 grid grid-cols-3 gap-2">
                    {availableSizes.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => {
                          setSize(s);
                          setSession(null);
                        }}
                        className={`rounded-lg py-2.5 font-lexend text-base font-semibold transition ${
                          activeSize === s
                            ? "border-2 border-[#c3f400] bg-[#c3f400] text-[#283500] hover:bg-[#d4ff4d]"
                            : "border border-white/10 bg-transparent text-on-surface-variant hover:border-white/25 hover:text-white"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                  <Button
                    type="button"
                    onClick={startGame}
                    className="flex w-full items-center justify-center gap-2 py-3 font-lexend text-sm font-bold uppercase tracking-wide"
                  >
                    Start {activeSize} bracket
                    <MaterialIcon name="arrow_forward" className="!text-xl" />
                  </Button>
                  <p className="mt-4 text-center text-[11px] leading-snug text-zinc-500">
                    Opens fullscreen duel view — exit anytime from the header.
                  </p>
                </div>
              </div>
            ) : null}

            <div className="mt-auto hidden rounded-xl border border-white/10 bg-[#0e0e0f] p-4 lg:block">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-gradient-to-br from-[#c3f400]/25 to-[#00e0ff]/15">
                  <MaterialIcon
                    name="bar_chart"
                    className="!text-2xl text-[#c3f400]"
                  />
                </div>
                <div>
                  <p className="font-label-caps text-[10px] tracking-[0.12em] text-[#00e0ff]">
                    Head-to-head picks
                  </p>
                  <p className="font-lexend text-xl font-bold tabular-nums text-white">
                    {totalPickEvents.toLocaleString()}
                  </p>
                  <p className="text-xs text-zinc-500">This device · current mode</p>
                </div>
              </div>
            </div>
          </aside>

          {/* Leaderboard */}
          {selectedGame ? (
            <section className="lg:col-span-12">
              <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h2 className="font-lexend text-lg font-semibold text-white md:text-xl">
                    Pick popularity
                  </h2>
                  <p className="mt-1 max-w-xl text-sm text-on-surface-variant">
                    Ranked by taps in this browser for{" "}
                    <span className="text-white">{selectedGame.title}</span>.
                  </p>
                </div>
                <span className="rounded-md border border-white/10 bg-black/40 px-2.5 py-1 font-mono text-[10px] text-zinc-400">
                  {selectedGame.pool.length} pool entries
                </span>
              </div>
              <div className="overflow-hidden rounded-xl border border-white/10 bg-[rgba(255,255,255,0.03)] backdrop-blur-md">
                <div className="max-h-[min(60vh,26rem)] overflow-y-auto">
                  <table className="w-full border-collapse text-left text-sm">
                    <thead>
                      <tr className="border-b border-white/10 bg-[#0e0e0f]">
                        <th className="px-4 py-3 font-label-caps text-[10px] tracking-wider text-on-surface-variant md:px-5">
                          Rank
                        </th>
                        <th className="px-4 py-3 font-label-caps text-[10px] tracking-wider text-on-surface-variant md:px-5">
                          Choice
                        </th>
                        <th className="px-4 py-3 text-right font-label-caps text-[10px] tracking-wider text-on-surface-variant md:px-5">
                          Picks
                        </th>
                        <th className="hidden w-28 px-4 py-3 text-right font-label-caps text-[10px] tracking-wider text-on-surface-variant sm:table-cell md:px-5">
                          Heat
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-on-surface">
                      {poolLeaderboard.map((row, i) => {
                        const entry = selectedGame.pool.find((e) => e.id === row.id);
                        const label = entry?.label ?? row.id;
                        const heat =
                          row.count === 0
                            ? "none"
                            : i < 3
                              ? "up"
                              : "down";
                        return (
                          <tr
                            key={row.id}
                            className="border-b border-white/5 transition-colors hover:bg-white/[0.04]"
                          >
                            <td
                              className={`px-4 py-3 font-lexend text-base font-semibold tabular-nums md:px-5 ${
                                i === 0 ? "text-[#c3f400]" : "text-on-surface-variant"
                              }`}
                            >
                              {i + 1}
                            </td>
                            <td className="px-4 py-3 md:px-5">
                              <div className="flex min-w-0 items-center gap-3">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-[#2a2a2b] font-mono text-[10px] font-bold text-zinc-300">
                                  {initials(label)}
                                </div>
                                <div className="min-w-0">
                                  <p className="truncate font-medium text-white">
                                    {label}
                                  </p>
                                  {entry?.meta ? (
                                    <p className="truncate text-xs text-zinc-500">
                                      {entry.meta}
                                    </p>
                                  ) : null}
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-right font-mono tabular-nums text-[#00e0ff] md:px-5">
                              {row.count.toLocaleString()}
                            </td>
                            <td className="hidden px-4 py-3 text-right sm:table-cell md:px-5">
                              {heat === "none" ? (
                                <span className="text-zinc-600">—</span>
                              ) : heat === "up" ? (
                                <span className="inline-flex justify-end text-[#c3f400]">
                                  <MaterialIcon
                                    name="trending_up"
                                    className="!text-lg"
                                  />
                                </span>
                              ) : (
                                <span className="inline-flex justify-end text-zinc-500">
                                  <MaterialIcon
                                    name="trending_flat"
                                    className="!text-lg"
                                  />
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          ) : null}

          <p className="text-center text-xs text-zinc-600 lg:col-span-12">
            More bracket flavours and timed rooms are on the roadmap.
          </p>
        </div>
      </div>
    </div>
  );
}
