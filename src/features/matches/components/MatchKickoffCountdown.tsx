"use client";

import type { MatchStatus } from "@/lib/types";
import { CountdownTimer } from "@/features/countdown/components/CountdownTimer";

export function MatchKickoffCountdown({
  kickoff,
  status,
}: {
  kickoff: string;
  status: MatchStatus;
}) {
  if (status !== "upcoming") return null;

  return (
    <section className="glass-effect rounded-2xl p-5 md:p-6">
      <h2 className="font-lexend mb-1 text-sm font-semibold text-white">
        Countdown to kick-off
      </h2>
      <p className="mb-4 text-xs text-on-surface-variant">
        Local time from your device — updates every second.
      </p>
      <CountdownTimer targetIso={kickoff} label="" size="hero" />
    </section>
  );
}
