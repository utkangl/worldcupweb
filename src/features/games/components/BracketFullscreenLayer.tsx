"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { MiniGameDefinition, MiniGameEntry } from "@/lib/types";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { Button } from "@/components/ui/Button";

const PICK_RESOLVE_MS = 520;

function roundLabel(size: number): string {
  if (size === 2) return "Final";
  if (size === 4) return "Semi-finals";
  if (size === 8) return "Quarter-finals";
  return `Round of ${size}`;
}

function kindShort(kind: MiniGameDefinition["kind"]): string {
  if (kind === "player") return "Player";
  if (kind === "team") return "Team";
  return "Moment";
}

function nameLines(label: string): string[] {
  return label.split(/\s+/).filter(Boolean);
}

function metaChip(meta: string | undefined): string | null {
  if (!meta?.trim()) return null;
  const t = meta.trim();
  return t.length <= 4 ? t.toUpperCase() : `${t.slice(0, 3).toUpperCase()}…`;
}

type SessionShape = {
  size: number;
  currentRound: MiniGameEntry[];
  pairIndex: number;
  completedMatches: number;
  champion: MiniGameEntry | null;
};

type PickResolution = { winnerId: string; loserId: string };

function PickBattleCard({
  side,
  entry,
  kind,
  onPick,
  resolve,
}: {
  side: "left" | "right";
  entry: MiniGameEntry;
  kind: MiniGameDefinition["kind"];
  onPick: () => void;
  resolve: PickResolution | null;
}) {
  const lines = nameLines(entry.label);
  const chip = metaChip(entry.meta);
  const isLeft = side === "left";

  const hoverBorder = isLeft
    ? "hover:border-[#c3f400]/70 hover:shadow-[0_0_40px_rgba(195,244,0,0.15)]"
    : "hover:border-[#00e0ff]/70 hover:shadow-[0_0_40px_rgba(0,224,255,0.15)]";
  const focusRing = isLeft
    ? "focus-visible:ring-[#c3f400]/50"
    : "focus-visible:ring-[#00e0ff]/50";
  const meshFrom = isLeft
    ? "from-[#1a1c14]/90 via-[#0e0e0f] to-[#0a1418]/95"
    : "from-[#0a1418]/90 via-[#0e0e0f] to-[#1a1c14]/95";
  const meshSpot = isLeft
    ? "bg-[radial-gradient(ellipse_85%_55%_at_50%_-15%,rgba(195,244,0,0.18),transparent_55%)]"
    : "bg-[radial-gradient(ellipse_85%_55%_at_50%_-15%,rgba(0,224,255,0.2),transparent_55%)]";
  const sideFade = isLeft
    ? "bg-gradient-to-r from-[#050505]/50 to-transparent"
    : "bg-gradient-to-l from-[#050505]/50 to-transparent";
  const cornerPos = isLeft ? "left-4 top-4" : "right-4 top-4";
  const bottomPos = isLeft
    ? "bottom-0 left-0 items-start text-left"
    : "bottom-0 right-0 items-end text-right";
  const badgeRow = isLeft ? "flex-row" : "flex-row-reverse";

  const roleBadge = isLeft
    ? "border-[#c3f400]/30 bg-[#c3f400]/10 text-[#c3f400]"
    : "border-[#00e0ff]/30 bg-[#00e0ff]/10 text-[#00e0ff]";

  const resolving = Boolean(resolve);
  const isLoser = resolve?.loserId === entry.id;
  const isWinner = resolve?.winnerId === entry.id;

  const resolveMotion = isLoser
    ? isLeft
      ? "-translate-x-[26%] scale-[0.68] opacity-0 blur-[3px]"
      : "translate-x-[26%] scale-[0.68] opacity-0 blur-[3px]"
    : isWinner
      ? isLeft
        ? "z-[5] scale-[1.05] shadow-[0_0_50px_rgba(195,244,0,0.18)]"
        : "z-[5] scale-[1.05] shadow-[0_0_50px_rgba(0,224,255,0.2)]"
      : "";

  const idleHover =
    !resolving &&
    "hover:scale-[1.02] active:scale-[0.98] motion-reduce:hover:scale-100 motion-reduce:active:scale-100";

  return (
    <button
      type="button"
      onClick={() => {
        if (!resolving) onPick();
      }}
      disabled={resolving}
      className={`group relative h-full min-h-[11rem] w-full min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-white/5 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-md focus:outline-none focus-visible:ring-4 md:min-h-[14rem] ${idleHover} ${hoverBorder} ${focusRing} ${resolveMotion} ${
        resolving
          ? "pointer-events-none cursor-default transition-[transform,opacity,filter,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
          : "transition-all duration-300"
      } `}
    >
      {/* Depth mesh (no photo — data-driven gradient) */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${meshFrom} opacity-100 transition-opacity duration-500 group-hover:opacity-95 motion-reduce:group-hover:opacity-100`}
        aria-hidden
      />
      <div
        className={`pointer-events-none absolute inset-0 ${meshSpot} opacity-90 transition-transform duration-500 group-hover:scale-105 motion-reduce:group-hover:scale-100`}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/45 to-transparent"
        aria-hidden
      />
      <div
        className={`pointer-events-none absolute inset-0 ${sideFade}`}
        aria-hidden
      />

      {chip ? (
        <div
          className={`absolute ${cornerPos} z-[1] flex h-8 min-w-[2.5rem] items-center justify-center rounded border border-white/20 bg-black/50 px-2 shadow-lg backdrop-blur-md`}
        >
          <span className="font-label-caps text-[10px] tracking-wider text-white">
            {chip}
          </span>
        </div>
      ) : null}

      <div
        className={`absolute ${bottomPos} z-[1] flex w-full flex-col gap-1.5 p-4 pb-5 transition-transform duration-300 will-change-transform group-hover:-translate-y-2 motion-reduce:group-hover:translate-y-0 md:gap-2 md:p-6 md:pb-7`}
      >
        <div className={`flex items-center gap-2 ${badgeRow}`}>
          <span
            className={`rounded border px-2 py-1 font-label-caps text-[10px] backdrop-blur-md ${roleBadge}`}
          >
            {kindShort(kind)}
          </span>
        </div>
        <h3 className="font-lexend text-xl font-bold uppercase leading-[1.08] tracking-tight text-white drop-shadow-[0_0_12px_rgba(0,0,0,0.6)] sm:text-2xl md:text-3xl lg:text-4xl">
          {lines.map((line, i) => (
            <span key={`${line}-${i}`}>
              {i > 0 ? <br /> : null}
              {line}
            </span>
          ))}
        </h3>
        {entry.meta ? (
          <p
            className={`mt-1 max-w-[90%] font-lexend text-sm text-on-surface-variant opacity-70 transition-opacity duration-300 group-hover:opacity-100 ${isLeft ? "" : "ml-auto text-right"}`}
          >
            {entry.meta}
          </p>
        ) : null}
      </div>
    </button>
  );
}

type Props = {
  session: SessionShape;
  selectedGame: MiniGameDefinition | undefined;
  progress: number;
  completed: number;
  totalMatches: number;
  left: MiniGameEntry | undefined;
  right: MiniGameEntry | undefined;
  onPick: (winner: MiniGameEntry) => void;
  onClose: () => void;
  onPlayAgain: () => void;
};

export function BracketFullscreenLayer({
  session,
  selectedGame,
  progress,
  completed,
  totalMatches,
  left,
  right,
  onPick,
  onClose,
  onPlayAgain,
}: Props) {
  const matchesInRound = session.currentRound.length / 2;
  const roundName = roundLabel(session.currentRound.length);
  const kind = selectedGame?.kind ?? "player";
  const pct = Math.round(progress);

  const pairKey = useMemo(
    () =>
      left && right
        ? `${session.pairIndex}-${left.id}-vs-${right.id}`
        : "",
    [session.pairIndex, left, right]
  );

  const [pickResolve, setPickResolve] = useState<PickResolution | null>(null);
  const onPickRef = useRef(onPick);
  onPickRef.current = onPick;

  const liveMatchSummary =
    left && right
      ? `${roundName}, match ${session.pairIndex + 1} of ${matchesInRound}. ${left.label} versus ${right.label}.`
      : "";

  const handlePick = useCallback(
    (winner: MiniGameEntry) => {
      if (!left || !right || pickResolve) return;
      if (
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        onPickRef.current(winner);
        return;
      }
      const loser = winner.id === left.id ? right : left;
      setPickResolve({ winnerId: winner.id, loserId: loser.id });
    },
    [left, right, pickResolve]
  );

  useEffect(() => {
    if (!pickResolve) return;
    const t = window.setTimeout(() => {
      const wId = pickResolve.winnerId;
      const winner =
        left?.id === wId ? left : right?.id === wId ? right : null;
      if (winner) onPickRef.current(winner);
      setPickResolve(null);
    }, PICK_RESOLVE_MS);
    return () => window.clearTimeout(t);
  }, [pickResolve, left, right]);

  useEffect(() => {
    setPickResolve(null);
  }, [pairKey]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const resolveForCards = pickResolve;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="bracket-play-title"
      className="fixed inset-0 z-[200] flex flex-col bg-[#050505] text-foreground"
    >
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-[75vh] w-[85vw] max-w-4xl -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#c3f400]/5 blur-[120px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden opacity-60"
        aria-hidden
      >
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#c3f400]/6 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-[#00e0ff]/8 blur-3xl" />
      </div>

      <header className="relative z-10 flex shrink-0 items-center justify-between gap-3 border-b border-white/10 bg-[#050505]/80 px-4 py-3 backdrop-blur-xl md:px-6">
        <div className="min-w-0">
          <p className="font-label-caps truncate tracking-[0.12em] text-[#00e0ff]">
            {selectedGame?.title ?? "Bracket"}
          </p>
          <p className="mt-0.5 truncate font-mono text-[10px] text-zinc-500">
            {session.size}-team bracket · {completed}/{totalMatches} picks
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:bg-white/10 active:scale-95"
          aria-label="Exit bracket"
        >
          <MaterialIcon name="close" className="!text-2xl" />
        </button>
      </header>

      {session.champion ? (
        <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 py-10 text-center">
          <p className="font-label-caps tracking-[0.2em] text-[#00e0ff]">
            Champion
          </p>
          <h2
            id="bracket-play-title"
            className="font-lexend mt-4 max-w-[min(100%,28rem)] text-4xl font-black uppercase leading-tight tracking-tight text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.15)] md:text-5xl"
          >
            {session.champion.label}
          </h2>
          {session.champion.meta ? (
            <p className="mt-3 text-lg text-on-surface-variant">
              {session.champion.meta}
            </p>
          ) : null}
          <p className="mt-6 text-sm text-zinc-500">
            {selectedGame?.title} · {session.size} bracket
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Button type="button" onClick={onPlayAgain}>
              Play again
            </Button>
            <Button type="button" variant="ghost" onClick={onClose}>
              Back to arena
            </Button>
          </div>
        </div>
      ) : (
        <div className="relative z-10 flex min-h-0 flex-1 flex-col overflow-y-auto overflow-x-hidden">
          <div className="mx-auto flex min-h-0 w-full max-w-5xl flex-1 flex-col gap-1.5 px-3 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom,0px))] md:gap-2 md:px-6 md:py-3">
            {/* Progress — Stitch-style dual caps + bar */}
            <div className="flex shrink-0 flex-col items-center gap-1.5">
              <p className="sr-only" role="status" aria-live="polite" aria-atomic>
                {liveMatchSummary}
              </p>
              <div className="w-full max-w-md">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <span className="inline-block origin-left font-label-caps text-[11px] tracking-[0.14em] text-[#00e0ff]">
                    {roundName.toUpperCase()} · MATCH {session.pairIndex + 1}{" "}
                    OF {matchesInRound}
                  </span>
                  <span className="font-label-caps text-[11px] tracking-[0.14em] text-[#c3f400]">
                    {pct}% COMPLETE
                  </span>
                </div>
                <div className="h-3 overflow-hidden rounded-full border border-white/5 bg-[#353436]">
                  <div
                    className="relative h-full overflow-hidden rounded-full bg-gradient-to-r from-[#00e0ff] to-[#c3f400] transition-[width] duration-300"
                    style={{ width: `${progress}%` }}
                  >
                    <div
                      className="animate-bracket-progress-shimmer pointer-events-none absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/35 to-transparent opacity-70"
                      aria-hidden
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-0.5 text-center">
                <h2 className="font-label-caps text-[10px] tracking-[0.18em] text-[#00e0ff] md:text-[11px]">
                  {selectedGame?.title ?? "This or that"}
                </h2>
                <h1
                  id="bracket-play-title"
                  className="font-lexend text-2xl font-extrabold leading-tight tracking-tight text-balance text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.18)] sm:text-3xl md:text-4xl md:leading-[1.12]"
                >
                  Who wins this matchup?
                </h1>
                {selectedGame?.description ? (
                  <p className="mx-auto line-clamp-2 max-w-xl px-1 text-xs leading-snug text-on-surface-variant/85 md:text-sm">
                    {selectedGame.description}
                  </p>
                ) : null}
              </div>
            </div>

            {/* Versus arena — fills remaining viewport under header copy */}
            {left && right ? (
              <div
                key={pairKey}
                className="animate-bracket-arena-swap relative grid min-h-0 w-full min-w-0 flex-1 grid-cols-1 grid-rows-2 gap-2.5 md:max-h-[calc(100dvh-8.25rem)] md:grid-cols-2 md:grid-rows-1 md:gap-4 max-md:max-h-[calc(100dvh-10.25rem)]"
              >
                <PickBattleCard
                  side="left"
                  entry={left}
                  kind={kind}
                  resolve={resolveForCards}
                  onPick={() => handlePick(left)}
                />
                <PickBattleCard
                  side="right"
                  entry={right}
                  kind={kind}
                  resolve={resolveForCards}
                  onPick={() => handlePick(right)}
                />

                <div
                  className={`pointer-events-none absolute left-1/2 top-1/2 z-20 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center transition-[transform,opacity] duration-500 ease-out motion-reduce:transition-none ${
                    resolveForCards
                      ? "scale-75 opacity-0 motion-reduce:scale-100 motion-reduce:opacity-100"
                      : "opacity-100"
                  }`}
                >
                  <div className="animate-bracket-vs-pop relative flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-[#050505]/85 shadow-[0_0_30px_rgba(0,224,255,0.28)] backdrop-blur-xl md:h-20 md:w-20">
                    <div
                      className="absolute inset-0 animate-ping rounded-full border border-[#00e0ff]/40 opacity-25 motion-reduce:animate-none"
                      aria-hidden
                    />
                    <span className="font-lexend text-2xl font-black italic tracking-tighter text-[#00e0ff] md:text-3xl">
                      VS
                    </span>
                  </div>
                </div>
              </div>
            ) : null}

            <p className="font-label-caps flex shrink-0 items-center justify-center gap-1.5 py-0.5 text-center text-[10px] tracking-[0.1em] text-on-surface-variant/50 md:text-[11px]">
              <MaterialIcon name="touch_app" className="!text-sm md:!text-base" />
              Tap a card to make your selection
            </p>
          </div>
        </div>
      )}
    </div>,
    document.body
  );
}
