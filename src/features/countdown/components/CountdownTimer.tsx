"use client";

import { useEffect, useMemo, useState } from "react";
import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
  isPast,
} from "date-fns";

export interface CountdownTimerProps {
  targetIso: string;
  label: string;
  className?: string;
  size?: "default" | "hero";
}

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

export function CountdownTimer({
  targetIso,
  label,
  className = "",
  size = "default",
}: CountdownTimerProps) {
  const target = useMemo(() => new Date(targetIso), [targetIso]);
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const ready = now !== null;
  const ended = ready ? isPast(target) : false;
  const d = ready ? differenceInDays(target, now) : 0;
  const h = ready ? differenceInHours(target, now) % 24 : 0;
  const m = ready ? differenceInMinutes(target, now) % 60 : 0;
  const s = ready ? differenceInSeconds(target, now) % 60 : 0;

  const hero = size === "hero";

  return (
    <div className={`glass-effect rounded-2xl ${hero ? "p-6 md:p-8" : "p-4"} ${className}`}>
      {label ? (
        <p className="font-label-caps text-on-surface-variant">{label}</p>
      ) : null}
      {!ready ? (
        <div
          className={`tabular-nums text-white ${
            hero
              ? "mt-3 flex flex-col gap-2"
              : `flex flex-wrap gap-3 font-mono text-lg ${label ? "mt-2" : ""}`
          }`}
        >
          {hero ? (
            <>
              <div className="flex items-baseline gap-2">
                <span className="font-lexend text-5xl font-black text-[#CCFF00] md:text-6xl">
                  --
                </span>
                <span className="font-label-caps text-on-surface-variant">days</span>
              </div>
              <div className="font-lexend text-4xl font-black text-white md:text-5xl">
                --:--:--
              </div>
            </>
          ) : (
            <span className="text-[#CCFF00]">--:--:--</span>
          )}
        </div>
      ) : ended ? (
        <p
          className={`font-lexend font-semibold text-white ${
            hero ? "mt-3 text-2xl md:text-3xl" : `${label ? "mt-2" : ""} text-lg`
          }`}
        >
          Started
        </p>
      ) : (
        <div
          className={`tabular-nums text-white ${
            hero
              ? "mt-3 flex flex-col gap-2"
              : `flex flex-wrap gap-3 font-mono text-lg ${label ? "mt-2" : ""}`
          }`}
        >
          {hero ? (
            <>
              <div className="flex items-baseline gap-2">
                <span className="font-lexend text-5xl font-black text-[#CCFF00] md:text-6xl">
                  {d}
                </span>
                <span className="font-label-caps text-on-surface-variant">days</span>
              </div>
              <div className="font-lexend text-4xl font-black text-white md:text-5xl">
                {pad(h)}:{pad(m)}:{pad(s)}
              </div>
            </>
          ) : (
            <>
              <span>
                <span className="text-[#CCFF00]">{d}</span>
                <span className="ml-1 font-label-caps text-on-surface-variant">d</span>
              </span>
              <span className="text-[#CCFF00]">
                {pad(h)}:{pad(m)}:{pad(s)}
              </span>
            </>
          )}
        </div>
      )}
    </div>
  );
}
