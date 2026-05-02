"use client";

import { useMemo } from "react";
import type { BracketTemplate, GroupStanding, Team } from "@/lib/types";
import { standingsFromOrder } from "@/features/simulator/lib/standings";
import { useSimulatorStore } from "@/features/simulator/stores/simulator-store";
import { GroupStagePanel } from "@/features/simulator/components/GroupStagePanel";
import { BracketTree } from "@/features/simulator/components/BracketTree";
import { Button } from "@/components/ui/Button";

const GROUPS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"] as const;

export function SimulatorView({
  teams,
  template,
}: {
  teams: Team[];
  template: BracketTemplate;
}) {
  const { groupOrder, knockoutWinners, setKnockoutWinner, resetAll } =
    useSimulatorStore();

  const teamById = useMemo(
    () => new Map(teams.map((t) => [t.id, t])),
    [teams]
  );

  const standingsByGroup = useMemo(() => {
    const map = new Map<string, GroupStanding[]>();
    for (const g of GROUPS) {
      const tg = teams.filter((t) => t.group === g);
      const ids = tg.map((t) => t.id);
      const fallback = tg.map((t) => t.id);
      map.set(g, standingsFromOrder(ids, groupOrder[g], fallback));
    }
    return map;
  }, [teams, groupOrder]);

  const winnersChain = useMemo(() => {
    const w: Record<string, string | undefined> = { ...knockoutWinners };
    return w;
  }, [knockoutWinners]);

  const champion = winnersChain["final"];

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-zinc-400">
          Order each group 1st–4th, then pick knockout winners. Data saves in this
          browser.
        </p>
        <Button
          type="button"
          variant="danger"
          onClick={() => {
            if (typeof window !== "undefined" && window.confirm("Reset simulator?")) {
              resetAll();
            }
          }}
        >
          Reset all
        </Button>
      </div>
      <section>
        <h2 className="mb-4 text-lg font-semibold text-zinc-100">Group stage</h2>
        <GroupStagePanel teams={teams} />
      </section>
      <section>
        <h2 className="mb-4 text-lg font-semibold text-zinc-100">Knockout</h2>
        <BracketTree
          template={template}
          teamById={teamById}
          standingsByGroup={standingsByGroup}
          winners={winnersChain}
          onPickWinner={(matchId, teamId) => setKnockoutWinner(matchId, teamId)}
        />
      </section>
      {champion && (
        <p className="text-center text-lg font-semibold text-[var(--accent)]">
          Your winner: {teamById.get(champion)?.name ?? champion}
        </p>
      )}
    </div>
  );
}
