"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { toPng } from "html-to-image";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { HERO_STADIUM_IMAGE } from "@/lib/constants";

type Aspect = "1:1" | "16:9";

export function ShareCardGenerator({
  title,
  subtitle,
  footer,
}: {
  title: string;
  subtitle?: string;
  footer?: string;
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

  const boxClass =
    aspect === "1:1"
      ? "aspect-square max-w-[360px]"
      : "aspect-video max-w-[640px]";

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
          className={`relative mx-auto flex w-full flex-col justify-between overflow-hidden rounded-xl bg-[#131314] p-8 text-white shadow-[0_0_40px_rgba(195,244,0,0.15)] ${boxClass}`}
        >
          <Image
            src={HERO_STADIUM_IMAGE}
            alt=""
            fill
            className="object-cover opacity-30 mix-blend-luminosity"
            sizes="(max-width: 640px) 100vw, 640px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#131314] via-[#131314]/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#c3f400]/10 to-[#00e0ff]/5 mix-blend-overlay" />
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "radial-gradient(circle at center, #c3f400 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />
          <div className="relative z-10 flex h-full flex-col justify-between">
            <div className="flex w-full items-start justify-between">
              <div className="flex flex-col leading-none">
                <span className="font-lexend text-xl font-semibold italic tracking-tighter text-[#c3f400]">
                  WORLD CUP
                </span>
                <span className="font-lexend text-xl font-black uppercase tracking-widest text-white">
                  Pulse
                </span>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-[#201f20]/80 shadow-[0_0_15px_rgba(195,244,0,0.2)] backdrop-blur-md">
                <span className="text-lg text-[#c3f400]">🌐</span>
              </div>
            </div>
            <div className="flex flex-1 flex-col items-center justify-center gap-4 py-6 text-center">
              <div>
                <span className="font-label-caps block tracking-[0.2em] text-[#a5eeff]">
                  My prediction
                </span>
                <h2 className="font-lexend mt-2 text-3xl font-black uppercase tracking-tight text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.25)] md:text-4xl">
                  {title}
                </h2>
                {subtitle && (
                  <p className="mt-3 text-sm text-white/75">{subtitle}</p>
                )}
              </div>
            </div>
            <div className="flex w-full items-end justify-between border-t border-white/10 pt-4">
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
                <span className="font-mono text-xs tracking-widest text-white/50">
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
          Renders in-browser for PNG export. For social link previews, add{" "}
          <code className="text-white/60">openGraph</code> metadata on the
          server.
        </p>
      </Card>
    </div>
  );
}
