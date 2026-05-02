"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { toPng } from "html-to-image";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { HERO_STADIUM_IMAGE } from "@/lib/constants";

type Aspect = "1:1" | "16:9";

export type SharePredictionRow = {
  label: string;
  value: string;
};

export function ShareCardGenerator({
  title,
  subtitle,
  footer,
  predictionRows,
}: {
  title: string;
  subtitle?: string;
  footer?: string;
  /**
   * When set (including `[]`), uses the prediction card layout: auto height, no scrollbars.
   * Rows render in a compact 2- or 3-column grid.
   */
  predictionRows?: SharePredictionRow[];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState(false);
  const [aspect, setAspect] = useState<Aspect>("1:1");

  const download = useCallback(async () => {
    const node = ref.current;
    if (!node) return;
    setBusy(true);
    try {
      const dataUrl = await toPng(node, {
        pixelRatio: 2,
        cacheBust: true,
      });
      const a = document.createElement("a");
      a.download = `worldcup-pulse-${aspect.replace(":", "x")}.png`;
      a.href = dataUrl;
      a.click();
    } finally {
      setBusy(false);
    }
  }, [aspect]);

  const usePredictionLayout = predictionRows !== undefined;
  const hasRows = predictionRows && predictionRows.length > 0;

  const widthClass =
    usePredictionLayout && aspect === "16:9"
      ? "w-[min(100%,640px)]"
      : "w-[360px] max-w-full";

  const gridClass =
    usePredictionLayout &&
    aspect === "16:9" &&
    (predictionRows?.length ?? 0) > 4
      ? "grid-cols-3"
      : "grid-cols-2";

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant={aspect === "1:1" ? "primary" : "ghost"}
          onClick={() => setAspect("1:1")}
        >
          1:1 · Instagram
        </Button>
        <Button
          type="button"
          variant={aspect === "16:9" ? "primary" : "ghost"}
          onClick={() => setAspect("16:9")}
        >
          16:9 · X / Twitter
        </Button>
      </div>
      <div className="overflow-x-auto rounded-xl border border-dashed border-white/20 p-4">
        <div
          ref={ref}
          className={`relative mx-auto ${widthClass} shrink-0 overflow-hidden rounded-2xl bg-[#131314] text-white shadow-[0_0_48px_rgba(195,244,0,0.12)] ring-1 ring-white/10 ${
            usePredictionLayout ? "" : aspect === "1:1" ? "aspect-square max-w-[360px]" : "aspect-video max-w-[640px]"
          }`}
        >
          {/* Background — separate layer so in-flow content sets card height (no clipped scroll) */}
          <div className="pointer-events-none absolute inset-0 z-0">
            <Image
              src={HERO_STADIUM_IMAGE}
              alt=""
              fill
              className="object-cover opacity-25 mix-blend-luminosity"
              sizes="(max-width: 640px) 100vw, 640px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#131314] via-[#131314]/90 to-[#131314]/70" />
            <div className="absolute inset-0 bg-gradient-to-br from-[#c3f400]/14 via-transparent to-[#00e0ff]/10" />
            <div
              className="absolute inset-0 opacity-[0.11]"
              style={{
                backgroundImage:
                  "radial-gradient(circle at center, #c3f400 1px, transparent 1px)",
                backgroundSize: "18px 18px",
              }}
            />
          </div>

          <div
            className={`relative z-10 flex flex-col gap-5 p-6 ${
              usePredictionLayout ? "" : "h-full min-h-0 justify-between"
            }`}
          >
            <div className="flex w-full items-start justify-between gap-3">
              <div className="flex flex-col leading-none">
                <span className="font-lexend text-lg font-semibold italic tracking-tighter text-[#c3f400]">
                  WORLD CUP
                </span>
                <span className="font-lexend text-lg font-black uppercase tracking-widest text-white">
                  Pulse
                </span>
              </div>
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-[#201f20]/90 shadow-[0_0_15px_rgba(195,244,0,0.2)] backdrop-blur-md">
                <span className="text-base text-[#c3f400]">🌐</span>
              </div>
            </div>

            {usePredictionLayout ? (
              <div className="space-y-4">
                <div className="text-center">
                  <span className="font-label-caps block tracking-[0.2em] text-[#a5eeff]">
                    My predictions
                  </span>
                  <h2 className="font-lexend mt-2 text-[clamp(1.25rem,4vw,1.75rem)] font-black uppercase leading-tight tracking-tight text-white drop-shadow-[0_0_14px_rgba(255,255,255,0.2)]">
                    {title}
                  </h2>
                </div>

                {hasRows ? (
                  <div className={`grid ${gridClass} gap-2`}>
                    {predictionRows!.map((row, i) => (
                      <div
                        key={`${row.label}-${i}`}
                        className="rounded-xl border border-white/12 bg-black/40 px-2.5 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-sm"
                      >
                        <p className="font-label-caps mb-0.5 text-[9px] leading-none tracking-[0.14em] text-zinc-500">
                          {row.label}
                        </p>
                        <p className="text-left text-[13px] font-semibold leading-snug text-white">
                          {row.value}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="rounded-xl border border-dashed border-white/15 bg-black/30 px-3 py-3 text-center text-xs leading-relaxed text-zinc-400">
                    {subtitle ??
                      "Fill the Predictions form — your picks will appear here."}
                  </p>
                )}
              </div>
            ) : (
              <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-4 py-4 text-center">
                <div>
                  <span className="font-label-caps block tracking-[0.2em] text-[#a5eeff]">
                    My prediction
                  </span>
                  <h2 className="font-lexend mt-2 text-3xl font-black uppercase tracking-tight text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.25)] md:text-4xl">
                    {title}
                  </h2>
                  {subtitle && (
                    <p className="mt-3 text-left text-sm leading-relaxed text-white/75 whitespace-pre-line">
                      {subtitle}
                    </p>
                  )}
                </div>
              </div>
            )}

            <div className="flex w-full items-end justify-between gap-3 border-t border-white/10 pt-4">
              <div>
                <span className="font-label-caps block text-white/70">
                  Share
                </span>
                <span className="font-lexend text-sm font-semibold text-white">
                  World Cup Pulse
                </span>
              </div>
              <div className="text-right">
                <span className="font-label-caps block text-[#c3f400]">
                  Join the pulse
                </span>
                <span className="font-mono text-[10px] tracking-widest text-white/50">
                  {footer ?? "LOCAL PREVIEW"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Button type="button" onClick={download} disabled={busy}>
        {busy ? "Exporting…" : "Download PNG"}
      </Button>
      <Card>
        <p className="text-xs text-on-surface-variant">
          PNG export uses the full card height — no scrollbars. Wider 16:9 layout uses
          three columns when you have many picks.
        </p>
      </Card>
    </div>
  );
}
