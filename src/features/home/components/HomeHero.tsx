"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  isPast,
} from "date-fns";
import { HERO_STADIUM_IMAGE, TOURNAMENT_START_ISO } from "@/lib/constants";

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

export function HomeHero() {
  const target = useMemo(() => new Date(TOURNAMENT_START_ISO), []);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const ended = isPast(target);
  const d = Math.max(0, differenceInDays(target, now));
  const h = Math.max(0, differenceInHours(target, now) % 24);
  const m = Math.max(0, differenceInMinutes(target, now) % 60);

  return (
    <section className="relative flex min-h-[400px] w-full flex-col items-center justify-center overflow-hidden rounded-xl border border-white/10 p-8 text-center glass-effect ambient-glow md:p-12">
      <Image
        src={HERO_STADIUM_IMAGE}
        alt=""
        fill
        className="object-cover opacity-20 mix-blend-overlay"
        sizes="100vw"
        priority
      />
      <div className="relative z-10 flex flex-col items-center gap-6">
        <h1 className="font-lexend text-2xl font-bold uppercase tracking-wider text-foreground md:text-[32px] md:leading-tight">
          Kickoff In
        </h1>
        {ended ? (
          <p className="font-lexend text-xl font-semibold text-white">
            Tournament underway
          </p>
        ) : (
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8">
            <div className="flex flex-col items-center">
              <span className="font-lexend text-5xl font-extrabold tabular-nums text-glow md:text-7xl">
                <span className="bg-gradient-urgent">{d}</span>
              </span>
              <span className="font-label-caps mt-2 text-on-surface-variant">
                DAYS
              </span>
            </div>
            <span className="mb-6 font-lexend text-4xl text-white/50">:</span>
            <div className="flex flex-col items-center">
              <span className="font-lexend text-5xl font-extrabold tabular-nums text-glow md:text-7xl">
                <span className="bg-gradient-urgent">{pad(h)}</span>
              </span>
              <span className="font-label-caps mt-2 text-on-surface-variant">
                HRS
              </span>
            </div>
            <span className="mb-6 font-lexend text-4xl text-white/50">:</span>
            <div className="flex flex-col items-center">
              <span className="font-lexend text-5xl font-extrabold tabular-nums text-glow md:text-7xl">
                <span className="bg-gradient-urgent">{pad(m)}</span>
              </span>
              <span className="font-label-caps mt-2 text-on-surface-variant">
                MINS
              </span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
