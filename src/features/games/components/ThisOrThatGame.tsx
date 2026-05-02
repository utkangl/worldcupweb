"use client";

import { useCallback, useRef, useState } from "react";
import type { ThisOrThatPair } from "@/lib/types";
import { useGameChoicesStore } from "@/features/games/stores/game-choices-store";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { MaterialIcon } from "@/components/ui/MaterialIcon";

export function ThisOrThatGame({ pairs }: { pairs: ThisOrThatPair[] }) {
  const [index, setIndex] = useState(0);
  const { choices, recordChoice, clearChoices } = useGameChoicesStore();
  const drag = useRef<{ x: number; active: boolean }>({ x: 0, active: false });

  const current = pairs[index];
  const total = pairs.length;
  const progress = total
    ? Math.min(100, Math.round(((index + 1) / total) * 100))
    : 0;

  const pick = useCallback(
    (side: "left" | "right") => {
      if (!current) return;
      recordChoice(current.id, side);
      setIndex((i) => Math.min(i + 1, total));
    },
    [current, recordChoice, total]
  );

  if (!current) {
    return (
      <Card className="text-center">
        <p className="font-lexend text-lg text-white">Deck complete</p>
        <p className="mt-2 text-sm text-on-surface-variant">
          Choices recorded: {Object.keys(choices).length}
        </p>
        <Button
          type="button"
          variant="ghost"
          className="mt-6"
          onClick={() => {
            clearChoices();
            setIndex(0);
          }}
        >
          Reset deck
        </Button>
      </Card>
    );
  }

  const kindLabel =
    current.kind === "player"
      ? "Player"
      : current.kind === "team"
        ? "Team"
        : "Moment";

  return (
    <div className="relative flex flex-col gap-10">
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-3/4 w-3/4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#c3f400]/5 blur-[150px]" />
      <div className="mx-auto w-full max-w-md">
        <div className="mb-2 flex justify-between font-label-caps text-[#00e0ff]">
          <span>
            ROUND {index + 1} OF {total}
          </span>
          <span>{progress}% COMPLETE</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full border border-white/5 bg-surface-high">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#00e0ff] to-[#c3f400] transition-[width] duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      <div className="text-center">
        <p className="font-label-caps tracking-[0.2em] text-[#00e0ff]">
          {kindLabel} · This or That
        </p>
        <h2 className="font-lexend mt-2 text-4xl font-extrabold tracking-tight text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.15)] md:text-5xl">
          Pick your side
        </h2>
      </div>
      <div
        className="relative grid w-full grid-cols-1 gap-4 md:grid-cols-2 md:gap-8"
        onPointerDown={(e) => {
          drag.current = { x: e.clientX, active: true };
          (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
        }}
        onPointerMove={(e) => {
          if (!drag.current.active) return;
          const dx = e.clientX - drag.current.x;
          if (dx > 80) {
            drag.current.active = false;
            pick("right");
          } else if (dx < -80) {
            drag.current.active = false;
            pick("left");
          }
        }}
        onPointerUp={() => {
          drag.current.active = false;
        }}
        onPointerCancel={() => {
          drag.current.active = false;
        }}
      >
        <button
          type="button"
          onClick={() => pick("left")}
          className="group relative flex min-h-[320px] w-full flex-col justify-end overflow-hidden rounded-2xl border border-white/10 bg-[#201f20] text-left transition-all hover:scale-[1.02] hover:border-[#c3f400]/50 hover:shadow-[0_0_40px_rgba(195,244,0,0.15)] active:scale-[0.98] md:min-h-[380px]"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/50 to-transparent" />
          <div className="relative z-10 p-8">
            <span className="font-label-caps rounded border border-[#c3f400]/30 bg-[#c3f400]/10 px-2 py-1 text-[#c3f400]">
              A
            </span>
            <h3 className="font-lexend mt-4 text-2xl font-bold uppercase leading-tight text-white md:text-3xl">
              {current.left.label}
            </h3>
            {current.left.meta && (
              <p className="mt-2 text-sm text-on-surface-variant">
                {current.left.meta}
              </p>
            )}
          </div>
        </button>
        <button
          type="button"
          onClick={() => pick("right")}
          className="group relative flex min-h-[320px] w-full flex-col justify-end overflow-hidden rounded-2xl border border-white/10 bg-[#201f20] text-left transition-all hover:scale-[1.02] hover:border-[#00e0ff]/50 hover:shadow-[0_0_40px_rgba(0,224,255,0.15)] active:scale-[0.98] md:min-h-[380px]"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-l from-background/50 to-transparent" />
          <div className="relative z-10 flex flex-col items-end p-8 text-right">
            <span className="font-label-caps rounded border border-[#00e0ff]/30 bg-[#00e0ff]/10 px-2 py-1 text-[#00e0ff]">
              B
            </span>
            <h3 className="font-lexend mt-4 text-2xl font-bold uppercase leading-tight text-white md:text-3xl">
              {current.right.label}
            </h3>
            {current.right.meta && (
              <p className="mt-2 text-sm text-on-surface-variant">
                {current.right.meta}
              </p>
            )}
          </div>
        </button>
        <div className="pointer-events-none absolute left-1/2 top-1/2 z-20 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
          <div className="relative flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-[#050505]/80 shadow-[0_0_30px_rgba(0,224,255,0.35)] backdrop-blur-xl md:h-20 md:w-20">
            <span className="font-lexend text-2xl italic text-[#00e0ff] md:text-3xl">
              VS
            </span>
          </div>
        </div>
      </div>
      <p className="font-label-caps flex items-center justify-center gap-2 text-center text-on-surface-variant/70">
        <MaterialIcon name="touch_app" className="text-base" />
        Tap a card or swipe to choose
      </p>
    </div>
  );
}
