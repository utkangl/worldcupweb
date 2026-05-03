"use client";

import type { BracketTemplate, Team } from "@/lib/types";
import { isPlainSeedSlot, resolveTeamForSlot } from "@/features/simulator/lib/bracket";
import type { GroupStanding } from "@/lib/types";
import { resolveSimulatorSlot } from "@/features/simulator/lib/standings";
import { Card } from "@/components/ui/Card";
import { MaterialIcon } from "@/components/ui/MaterialIcon";

function PickButton({
  label,
  selected,
  otherSelected,
  onPick,
}: {
  label: string;
  selected: boolean;
  otherSelected: boolean;
  onPick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onPick}
      className={`group relative flex min-h-12 w-full min-w-0 items-center gap-2 rounded-xl border-2 px-3 py-2.5 text-left text-sm font-medium leading-snug transition-[background-color,border-color,box-shadow,opacity,transform] duration-200 ${
        selected
          ? "border-[#CCFF00] bg-[#CCFF00]/20 text-zinc-50 shadow-[0_0_0_1px_rgba(204,255,0,0.35),0_8px_28px_rgba(204,255,0,0.18)]"
          : otherSelected
            ? "border-white/[0.08] bg-black/20 text-zinc-500 opacity-60 hover:opacity-90"
            : "border-white/15 bg-white/[0.07] text-zinc-200 hover:border-white/25 hover:bg-white/[0.1]"
      }`}
    >
      <span className="min-w-0 flex-1">{label}</span>
      {selected ? (
        <span className="flex shrink-0 items-center gap-1 rounded-md bg-[#CCFF00]/25 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-[#CCFF00]">
          <MaterialIcon name="check_circle" className="!text-lg text-[#CCFF00]" filled />
          Winner
        </span>
      ) : (
        <MaterialIcon
          name="radio_button_unchecked"
          className={`shrink-0 !text-xl ${otherSelected ? "text-zinc-600" : "text-zinc-500 opacity-40 group-hover:opacity-70"}`}
        />
      )}
    </button>
  );
}

export function BracketTree({
  template,
  teamById,
  standingsByGroup,
  thirdPlacePriority,
  winners,
  onPickWinner,
  /** Show only one knockout round (0-based index). Omit to show all rounds. */
  roundFilterIndex,
}: {
  template: BracketTemplate;
  teamById: Map<string, Team>;
  standingsByGroup: Map<string, GroupStanding[]>;
  /** 12 third-placed team ids, best first — first 8 = T1…T8 */
  thirdPlacePriority: string[];
  winners: Record<string, string | undefined>;
  onPickWinner: (matchId: string, teamId: string | null) => void;
  roundFilterIndex?: number;
}) {
  const groupResolver = (slot: string) =>
    resolveSimulatorSlot(standingsByGroup, slot, thirdPlacePriority);

  const rounds =
    roundFilterIndex !== undefined &&
    roundFilterIndex >= 0 &&
    roundFilterIndex < template.knockout.length
      ? [template.knockout[roundFilterIndex]]
      : template.knockout;

  return (
    <div className="space-y-10">
      {rounds.map((round) => (
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
                winners,
                template
              );
              const awayId = resolveTeamForSlot(
                awaySlot,
                groupResolver,
                winners,
                template
              );
              const homeTeam = homeId ? teamById.get(homeId) : undefined;
              const awayTeam = awayId ? teamById.get(awayId) : undefined;
              const ready = Boolean(homeId && awayId);
              const picked = winners[m.id];
              const hasPick = Boolean(picked);

              const hideSeedLine =
                isPlainSeedSlot(homeSlot) && isPlainSeedSlot(awaySlot);

              return (
                <Card
                  key={m.id}
                  className={`space-y-3 transition-[box-shadow,border-color] duration-200 ${
                    hasPick
                      ? "border-[#CCFF00]/35 shadow-[0_0_32px_rgba(204,255,0,0.08)]"
                      : ""
                  }`}
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className="text-xs text-zinc-500">
                      {m.id}
                      {!hideSeedLine ? (
                        <span className="ml-2 text-zinc-600">
                          ({homeSlot} vs {awaySlot})
                        </span>
                      ) : null}
                    </p>
                    {hasPick && (
                      <span className="text-[11px] font-medium uppercase tracking-wide text-[#CCFF00]/90">
                        Pick saved
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col gap-1.5 sm:flex-row sm:items-stretch sm:gap-3">
                    <div
                      className={`flex min-h-10 flex-1 items-center rounded-lg px-2 py-1 text-sm leading-snug transition-colors ${
                        picked === homeId && homeId
                          ? "bg-[#CCFF00]/10 font-semibold text-[#CCFF00]"
                          : "text-zinc-300"
                      }`}
                    >
                      {homeTeam?.name ?? (homeId ? "?" : "TBD")}
                    </div>
                    <span className="hidden shrink-0 self-center text-xs font-medium text-zinc-600 sm:inline">
                      vs
                    </span>
                    <div
                      className={`flex min-h-10 flex-1 items-center rounded-lg px-2 py-1 text-sm leading-snug transition-colors ${
                        picked === awayId && awayId
                          ? "bg-[#CCFF00]/10 font-semibold text-[#CCFF00]"
                          : "text-zinc-300"
                      }`}
                    >
                      {awayTeam?.name ?? (awayId ? "?" : "TBD")}
                    </div>
                  </div>
                  {ready ? (
                    <div className="flex flex-col gap-2 sm:flex-row">
                      <PickButton
                        label={homeTeam?.name ?? "?"}
                        selected={picked === homeId}
                        otherSelected={Boolean(
                          picked && picked !== homeId && awayId
                        )}
                        onPick={() => onPickWinner(m.id, homeId!)}
                      />
                      <PickButton
                        label={awayTeam?.name ?? "?"}
                        selected={picked === awayId}
                        otherSelected={Boolean(
                          picked && picked !== awayId && homeId
                        )}
                        onPick={() => onPickWinner(m.id, awayId!)}
                      />
                    </div>
                  ) : (
                    <p className="text-xs text-amber-400/90">
                      Set group order (1st–4th), then pick earlier rounds — or this tie
                      waits on a previous winner.
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
