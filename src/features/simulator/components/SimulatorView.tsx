"use client";

import { useMemo } from "react";
import type { BracketTemplate, GroupStanding, Team } from "@/lib/types";
import {
  reconcileThirdPlaceOrder,
  standingsFromOrder,
} from "@/features/simulator/lib/standings";
import { useSimulatorStore } from "@/features/simulator/stores/simulator-store";
import { GroupStagePanel } from "@/features/simulator/components/GroupStagePanel";
import { ThirdPlaceRankingPanel } from "@/features/simulator/components/ThirdPlaceRankingPanel";
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
  const {
    groupOrder,
    thirdPlaceOrder,
    knockoutWinners,
    setKnockoutWinner,
    setThirdPlaceOrder,
    resetAll,
  } = useSimulatorStore();

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
      map.set(g, standingsFromOrder(ids, groupOrder[g], fallback, g));
    }
    return map;
  }, [teams, groupOrder]);

  const thirdPlacePriority = useMemo(
    () => reconcileThirdPlaceOrder(thirdPlaceOrder, standingsByGroup),
    [thirdPlaceOrder, standingsByGroup]
  );

  const winnersChain = useMemo(() => {
    const w: Record<string, string | undefined> = { ...knockoutWinners };
    return w;
  }, [knockoutWinners]);

  const champion = winnersChain["ko-104"];

  return (
    <div className="space-y-10">
      <section className="rounded-2xl border border-white/10 bg-black/20 p-5 text-sm leading-relaxed text-zinc-300">
        <h2 className="mb-3 text-base font-semibold text-zinc-100">
          2026 format (48 teams)
        </h2>
        <p className="mb-3">
          There are <span className="text-zinc-200">12 groups</span> of four teams
          (A–L). Every team plays three group matches. The{" "}
          <span className="text-zinc-200">group winners and runners-up</span> go straight
          to the knockouts. The{" "}
          <span className="text-zinc-200">eight best third-placed</span> teams also
          advance; four thirds miss out, and all fourth-placed teams are eliminated.
        </p>
        <p className="mb-3">
          From the new <span className="text-zinc-200">Round of 32</span> onward, it is
          single elimination through to the final (19 July 2026).
        </p>
        <p className="text-xs text-zinc-500">
          You set each group&apos;s 1st–4th order, then rank the 12 third-placed teams
          to pick which eight become T1–T8. Bracket pairings are illustrative, not the
          official FIFA draw.
        </p>
      </section>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-zinc-400">
          Order groups, rank the 12 thirds (top 8 advance), then pick knockout winners.
          Data saves in this browser.
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
        <h2 className="mb-4 text-lg font-semibold text-zinc-100">
          Third-placed teams
        </h2>
        <ThirdPlaceRankingPanel
          order={thirdPlacePriority}
          teamById={teamById}
          onReorder={setThirdPlaceOrder}
        />
      </section>
      <section>
        <h2 className="mb-4 text-lg font-semibold text-zinc-100">Knockout</h2>
        <BracketTree
          template={template}
          teamById={teamById}
          standingsByGroup={standingsByGroup}
          thirdPlacePriority={thirdPlacePriority}
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
