"use client";

import { useEffect, useMemo, useState } from "react";
import type { BracketTemplate, GroupStanding, Team } from "@/lib/types";
import {
  reconcileThirdPlaceOrder,
  standingsFromOrder,
} from "@/features/simulator/lib/standings";
import { useSimulatorStore } from "@/features/simulator/stores/simulator-store";
import { GroupStagePanel } from "@/features/simulator/components/GroupStagePanel";
import { ThirdPlaceRankingPanel } from "@/features/simulator/components/ThirdPlaceRankingPanel";
import { BracketTree } from "@/features/simulator/components/BracketTree";
import { SimulatorStepRail } from "@/features/simulator/components/SimulatorStepRail";
import { Button } from "@/components/ui/Button";
import { MaterialIcon } from "@/components/ui/MaterialIcon";

const GROUPS = [
  "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L",
] as const;

const STEP_LAST = 2;

function shortKnockoutTab(roundName: string): string {
  if (roundName.includes("32")) return "R32";
  if (roundName.includes("16")) return "R16";
  if (roundName.includes("Quarter")) return "QF";
  if (roundName.includes("Semi")) return "SF";
  if (roundName.includes("Third")) return "3rd";
  if (roundName === "Final") return "Final";
  return roundName.slice(0, 5);
}

export function SimulatorView({
  teams,
  template,
}: {
  teams: Team[];
  template: BracketTemplate;
}) {
  const [step, setStep] = useState(0);
  const [koRound, setKoRound] = useState(0);

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
  const koLastIndex = Math.max(0, template.knockout.length - 1);

  useEffect(() => {
    setKoRound((r) => Math.min(r, koLastIndex));
  }, [koLastIndex]);

  const handleBack = () => {
    if (step === 2 && koRound > 0) {
      setKoRound((r) => r - 1);
      return;
    }
    setStep((s) => Math.max(0, s - 1));
  };

  const handleNext = () => {
    if (step < STEP_LAST) {
      setStep((s) => s + 1);
      return;
    }
    if (step === STEP_LAST && koRound < koLastIndex) {
      setKoRound((r) => r + 1);
    }
  };

  const nextDisabled = step === STEP_LAST && koRound >= koLastIndex;
  const nextLabel =
    step < STEP_LAST ? "Next" : koRound < koLastIndex ? "Next round" : "Done";

  return (
    <div className="space-y-8">
      <details className="group rounded-2xl border border-white/10 bg-black/20 open:border-[#CCFF00]/25">
        <summary className="cursor-pointer list-none px-4 py-3 font-lexend text-sm font-semibold text-zinc-200 transition hover:text-white">
          <span className="inline-flex items-center gap-2">
            <MaterialIcon
              name="info"
              className="text-lg text-[#CCFF00]/80 group-open:text-[#CCFF00]"
            />
            2026 format (48 teams) — tap to read
          </span>
        </summary>
        <div className="border-t border-white/10 px-4 pb-4 pt-2 text-sm leading-relaxed text-zinc-300">
          <p className="mb-3">
            There are <span className="text-zinc-200">12 groups</span> of four teams
            (A–L). Every team plays three group matches.{" "}
            <span className="text-zinc-200">Winners and runners-up</span> qualify;
            the <span className="text-zinc-200">eight best third-placed</span> teams join
            them; four thirds and all fourths go home.
          </p>
          <p className="mb-2">
            From the <span className="text-zinc-200">Round of 32</span> it is single
            elimination to the final (19 July 2026).
          </p>
          <p className="text-xs text-zinc-500">
            Bracket pairings here are illustrative, not the official FIFA draw.
          </p>
        </div>
      </details>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-zinc-400">
          Work in three steps — only one panel shows at a time. Data saves in this
          browser.
        </p>
        <Button
          type="button"
          variant="danger"
          onClick={() => {
            if (typeof window !== "undefined" && window.confirm("Reset simulator?")) {
              resetAll();
              setStep(0);
            }
          }}
        >
          Reset all
        </Button>
      </div>

      <SimulatorStepRail step={step} onStepChange={setStep} />

      <div className="min-h-[320px]">
        {step === 0 ? (
          <section className="animate-fade-in space-y-4">
            <h2 className="font-lexend text-lg font-semibold text-zinc-100">
              Group stage
            </h2>
            <p className="text-sm text-zinc-500">
              Two groups per row; inside each group, drag teams into 1st–4th order.
            </p>
            <GroupStagePanel teams={teams} />
          </section>
        ) : null}

        {step === 1 ? (
          <section className="animate-fade-in space-y-4">
            <h2 className="font-lexend text-lg font-semibold text-zinc-100">
              Third-placed teams
            </h2>
            <p className="text-sm text-zinc-500">
              Order all 12 third-placed teams — the top eight become T1–T8 in the
              bracket.
            </p>
            <ThirdPlaceRankingPanel
              order={thirdPlacePriority}
              teamById={teamById}
              onReorder={setThirdPlaceOrder}
            />
          </section>
        ) : null}

        {step === 2 ? (
          <section className="animate-fade-in space-y-4">
            <h2 className="font-lexend text-lg font-semibold text-zinc-100">
              Knockout
            </h2>
            <p className="text-sm text-zinc-500">
              Pick winners round by round. Use the tabs to focus one knockout stage at
              a time — less scrolling.
            </p>
            <div
              role="tablist"
              aria-label="Knockout round"
              className="flex flex-wrap gap-2 rounded-xl border border-white/10 bg-black/30 p-2"
            >
              {template.knockout.map((r, i) => (
                <button
                  key={r.round}
                  type="button"
                  role="tab"
                  aria-selected={i === koRound}
                  onClick={() => setKoRound(i)}
                  className={`rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-wide transition ${
                    i === koRound
                      ? "bg-[#CCFF00]/20 text-[#CCFF00] ring-1 ring-[#CCFF00]/45"
                      : "text-zinc-500 hover:bg-white/10 hover:text-zinc-200"
                  }`}
                >
                  <span className="block">{shortKnockoutTab(r.round)}</span>
                  <span className="mt-0.5 block max-w-[8rem] truncate text-[10px] font-normal normal-case tracking-normal text-zinc-500">
                    {r.round}
                  </span>
                </button>
              ))}
            </div>
            <BracketTree
              template={template}
              teamById={teamById}
              standingsByGroup={standingsByGroup}
              thirdPlacePriority={thirdPlacePriority}
              winners={winnersChain}
              onPickWinner={(matchId, teamId) => setKnockoutWinner(matchId, teamId)}
              roundFilterIndex={koRound}
            />
            {champion ? (
              <p className="rounded-xl border border-[#CCFF00]/25 bg-[#CCFF00]/[0.06] py-4 text-center font-lexend text-lg font-semibold text-[#CCFF00]">
                Your winner: {teamById.get(champion)?.name ?? champion}
              </p>
            ) : null}
          </section>
        ) : null}
      </div>

      <div className="sticky bottom-0 z-10 -mx-1 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 bg-[#131314]/95 py-4 backdrop-blur-md supports-[backdrop-filter]:bg-[#131314]/80 md:static md:mx-0 md:border-t-0 md:bg-transparent md:py-0 md:backdrop-blur-none">
        <Button
          type="button"
          variant="ghost"
          className="min-w-[7rem]"
          disabled={step === 0}
          onClick={handleBack}
        >
          <span className="inline-flex items-center gap-1">
            <MaterialIcon name="chevron_left" className="!text-xl" />
            {step === 2 && koRound > 0 ? "Prev round" : "Back"}
          </span>
        </Button>
        <span className="font-mono text-xs text-zinc-500">
          Step {step + 1} / 3
          {step === 2 ? (
            <span className="block text-center text-[10px] text-zinc-600">
              KO {koRound + 1}/{template.knockout.length}
            </span>
          ) : null}
        </span>
        <Button
          type="button"
          variant="primary"
          className="min-w-[7rem]"
          disabled={nextDisabled}
          onClick={handleNext}
        >
          <span className="inline-flex items-center gap-1">
            {nextLabel}
            <MaterialIcon name="chevron_right" className="!text-xl" />
          </span>
        </Button>
      </div>
    </div>
  );
}
