"use client";

import type { BracketTemplate, Team } from "@/lib/types";
import { isGroupSlot, resolveTeamForSlot } from "@/features/simulator/lib/bracket";
import type { GroupStanding } from "@/lib/types";
import { positionToTeamId } from "@/features/simulator/lib/standings";
import { Card } from "@/components/ui/Card";

export function BracketTree({
  template,
  teamById,
  standingsByGroup,
  winners,
  onPickWinner,
}: {
  template: BracketTemplate;
  teamById: Map<string, Team>;
  standingsByGroup: Map<string, GroupStanding[]>;
  winners: Record<string, string | undefined>;
  onPickWinner: (matchId: string, teamId: string | null) => void;
}) {
  const groupResolver = (slot: string) =>
    positionToTeamId(standingsByGroup, slot);

  return (
    <div className="space-y-10">
      {template.knockout.map((round) => (
        <section key={round.round}>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-zinc-500">
            {round.round}
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            {round.matches.map((m) => {
              const homeSlot = m.home;
              const awaySlot = m.away;
              const homeId = resolveTeamForSlot(
                homeSlot,
                groupResolver,
                winners
              );
              const awayId = resolveTeamForSlot(
                awaySlot,
                groupResolver,
                winners
              );
              const homeTeam = homeId ? teamById.get(homeId) : undefined;
              const awayTeam = awayId ? teamById.get(awayId) : undefined;
              const ready = Boolean(homeId && awayId);
              const picked = winners[m.id];

              return (
                <Card key={m.id} className="space-y-3">
                  <p className="text-xs text-zinc-500">
                    {m.id}
                    {!isGroupSlot(homeSlot) && !isGroupSlot(awaySlot) ? (
                      <span className="ml-2 text-zinc-600">
                        ({homeSlot} vs {awaySlot})
                      </span>
                    ) : null}
                  </p>
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <span className="font-medium text-zinc-200">
                      {homeTeam?.shortName ?? (homeId ? "?" : "TBD")}
                    </span>
                    <span className="text-zinc-600">vs</span>
                    <span className="font-medium text-zinc-200">
                      {awayTeam?.shortName ?? (awayId ? "?" : "TBD")}
                    </span>
                  </div>
                  {ready ? (
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => onPickWinner(m.id, homeId!)}
                        className={`min-h-10 flex-1 rounded-lg px-3 text-sm font-medium transition ${
                          picked === homeId
                            ? "bg-[var(--accent)] text-[var(--accent-foreground)]"
                            : "bg-white/10 text-zinc-200 hover:bg-white/15"
                        }`}
                      >
                        {homeTeam?.shortName}
                      </button>
                      <button
                        type="button"
                        onClick={() => onPickWinner(m.id, awayId!)}
                        className={`min-h-10 flex-1 rounded-lg px-3 text-sm font-medium transition ${
                          picked === awayId
                            ? "bg-[var(--accent)] text-[var(--accent-foreground)]"
                            : "bg-white/10 text-zinc-200 hover:bg-white/15"
                        }`}
                      >
                        {awayTeam?.shortName}
                      </button>
                    </div>
                  ) : (
                    <p className="text-xs text-amber-400/90">
                      Set group order (or complete earlier rounds) to unlock this tie.
                    </p>
                  )}
                </Card>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
