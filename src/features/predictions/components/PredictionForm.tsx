"use client";

import { useMemo, type ReactNode } from "react";
import { usePredictionStore } from "@/features/predictions/stores/prediction-store";
import { bumpPredictionPick } from "@/lib/community-stats";
import type { PlayerOption, Team } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { PlayerSearchSelect } from "@/features/predictions/components/PlayerSearchSelect";

const SELECT_CLASS =
  "mt-2 w-full appearance-none rounded-xl border border-white/10 bg-[#0e0e0f] px-3 py-3 pr-11 text-sm text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition focus:border-[#c3f400] focus:outline-none focus:ring-1 focus:ring-[#c3f400]";

const INPUT_CLASS =
  "mt-2 w-full rounded-xl border border-white/10 bg-[#0e0e0f] px-3 py-3 text-sm text-white tabular-nums shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition focus:border-[#c3f400] focus:outline-none focus:ring-1 focus:ring-[#c3f400]";

function SelectShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative">
      {children}
      <MaterialIcon
        name="expand_more"
        className="pointer-events-none absolute right-2.5 top-[calc(50%+6px)] -translate-y-1/2 text-xl text-zinc-500"
      />
    </div>
  );
}

function FieldCard({
  icon,
  title,
  hint,
  children,
  accent = "lime",
}: {
  icon: string;
  title: string;
  hint: string;
  children: React.ReactNode;
  accent?: "lime" | "cyan";
}) {
  const ring =
    accent === "cyan"
      ? "from-[#00e0ff]/20 to-transparent"
      : "from-[#c3f400]/15 to-transparent";
  return (
    <div
      className={`rounded-2xl border border-white/10 bg-gradient-to-br ${ring} p-4 shadow-lg shadow-black/20`}
    >
      <div className="mb-3 flex gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
            accent === "cyan"
              ? "bg-[#00e0ff]/10 text-[#00e0ff]"
              : "bg-[#c3f400]/10 text-[#c3f400]"
          }`}
        >
          <MaterialIcon name={icon} className="!text-[22px]" />
        </div>
        <div className="min-w-0">
          <h3 className="font-lexend text-sm font-semibold text-white">{title}</h3>
          <p className="text-xs leading-snug text-zinc-500">{hint}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

export function PredictionForm({
  players,
  teams,
}: {
  players: PlayerOption[];
  teams: Team[];
}) {
  const {
    goldenBootPlayerId,
    topAssistPlayerId,
    goldenGlovePlayerId,
    youngPlayerPlayerId,
    championTeamId,
    runnerUpTeamId,
    thirdPlaceTeamId,
    surpriseTeamId,
    goldenBootGoalTotal,
    setGoldenBoot,
    setTopAssist,
    setGoldenGlove,
    setYoungPlayer,
    setChampion,
    setRunnerUp,
    setThirdPlace,
    setSurprise,
    setGoldenBootGoalTotal,
    reset,
  } = usePredictionStore();

  const teamsSorted = useMemo(
    () => [...teams].sort((a, b) => a.name.localeCompare(b.name)),
    [teams]
  );

  const runnerUpChoices = useMemo(
    () =>
      championTeamId
        ? teamsSorted.filter((t) => t.id !== championTeamId)
        : teamsSorted,
    [teamsSorted, championTeamId]
  );

  const thirdChoices = useMemo(
    () =>
      teamsSorted.filter(
        (t) => t.id !== championTeamId && t.id !== runnerUpTeamId
      ),
    [teamsSorted, championTeamId, runnerUpTeamId]
  );

  const surpriseChoices = useMemo(
    () =>
      championTeamId
        ? teamsSorted.filter((t) => t.id !== championTeamId)
        : teamsSorted,
    [teamsSorted, championTeamId]
  );

  const filledCount = useMemo(() => {
    const keys = [
      goldenBootPlayerId,
      topAssistPlayerId,
      goldenGlovePlayerId,
      youngPlayerPlayerId,
      championTeamId,
      runnerUpTeamId,
      thirdPlaceTeamId,
      surpriseTeamId,
      goldenBootGoalTotal.trim(),
    ];
    return keys.filter(Boolean).length;
  }, [
    goldenBootPlayerId,
    topAssistPlayerId,
    goldenGlovePlayerId,
    youngPlayerPlayerId,
    championTeamId,
    runnerUpTeamId,
    thirdPlaceTeamId,
    surpriseTeamId,
    goldenBootGoalTotal,
  ]);

  const totalFields = 9;
  const progress = Math.round((filledCount / totalFields) * 100);

  const clash =
    championTeamId &&
    runnerUpTeamId &&
    championTeamId === runnerUpTeamId;

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
        <div className="mb-2 flex items-center justify-between gap-3">
          <span className="font-lexend text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Progress
          </span>
          <span className="font-mono text-xs text-[#c3f400]">
            {filledCount}/{totalFields} fields
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-white/5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#c3f400] via-[#d4ff4d] to-[#00e0ff] transition-[width] duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-zinc-500">
          Everything saves in this browser — no account needed.
        </p>
      </div>

      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <MaterialIcon name="emoji_events" className="text-[#c3f400]" />
          <h2 className="font-lexend text-lg font-bold text-white">Podium</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <FieldCard
            icon="military_tech"
            title="Champion"
            hint="Who wins the final?"
            accent="lime"
          >
            <label className="block text-xs font-medium text-zinc-400">
              Winner
            </label>
            <SelectShell>
              <select
                className={SELECT_CLASS}
                value={championTeamId}
                onChange={(e) => {
                  const v = e.target.value;
                  setChampion(v);
                  if (v) bumpPredictionPick("champion", v);
                }}
              >
                <option value="">Select nation</option>
                {teamsSorted.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </SelectShell>
          </FieldCard>

          <FieldCard
            icon="workspace_premium"
            title="Runner-up"
            hint="Losing finalist."
            accent="lime"
          >
            <label className="block text-xs font-medium text-zinc-400">
              Second place
            </label>
            <SelectShell>
              <select
                className={SELECT_CLASS}
                value={runnerUpTeamId}
                onChange={(e) => {
                  const v = e.target.value;
                  setRunnerUp(v);
                  if (v) bumpPredictionPick("runnerUp", v);
                }}
              >
                <option value="">Select nation</option>
                {runnerUpChoices.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </SelectShell>
          </FieldCard>

          <FieldCard
            icon="filter_3"
            title="Third place"
            hint="Bronze / play-off winner."
            accent="cyan"
          >
            <label className="block text-xs font-medium text-zinc-400">
              Third place match
            </label>
            <SelectShell>
              <select
                className={SELECT_CLASS}
                value={thirdPlaceTeamId}
                onChange={(e) => {
                  const v = e.target.value;
                  setThirdPlace(v);
                  if (v) bumpPredictionPick("thirdPlace", v);
                }}
              >
                <option value="">Select nation</option>
                {thirdChoices.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </SelectShell>
          </FieldCard>
        </div>
        {clash ? (
          <p className="text-xs text-amber-400/90">
            Champion and runner-up can&apos;t be the same nation — pick two
            different teams.
          </p>
        ) : null}
      </section>

      <FieldCard
        icon="bolt"
        title="Dark horse"
        hint="A nation that exceeds expectations — not your predicted champion."
        accent="cyan"
      >
        <label className="block text-xs font-medium text-zinc-400">
          Surprise package
        </label>
        <SelectShell>
          <select
            className={SELECT_CLASS}
            value={surpriseTeamId}
            onChange={(e) => {
              const v = e.target.value;
              setSurprise(v);
              if (v) bumpPredictionPick("surprise", v);
            }}
          >
            <option value="">Select nation</option>
            {surpriseChoices.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </SelectShell>
      </FieldCard>

      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <MaterialIcon name="groups" className="text-[#c3f400]" />
          <h2 className="font-lexend text-lg font-bold text-white">
            Player awards
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <FieldCard
            icon="sports_soccer"
            title="Golden Boot"
            hint="Top scorer of the tournament."
          >
            <PlayerSearchSelect
              id="pred-golden-boot"
              label="Player"
              players={players}
              value={goldenBootPlayerId}
              onChange={(id) => {
                setGoldenBoot(id);
                if (id) bumpPredictionPick("goldenBoot", id);
              }}
            />
            <label className="mt-3 block text-xs font-medium text-zinc-400">
              Predicted goal total (optional)
            </label>
            <input
              type="number"
              min={0}
              max={99}
              inputMode="numeric"
              placeholder="e.g. 6"
              className={INPUT_CLASS}
              value={goldenBootGoalTotal}
              onChange={(e) => setGoldenBootGoalTotal(e.target.value)}
            />
          </FieldCard>

          <FieldCard
            icon="handshake"
            title="Playmaker"
            hint="Most assists."
            accent="cyan"
          >
            <PlayerSearchSelect
              id="pred-assists"
              label="Player"
              players={players}
              value={topAssistPlayerId}
              onChange={(id) => {
                setTopAssist(id);
                if (id) bumpPredictionPick("assists", id);
              }}
            />
          </FieldCard>

          <FieldCard
            icon="shield"
            title="Golden Glove"
            hint="Best goalkeeper of the tournament."
          >
            <PlayerSearchSelect
              id="pred-glove"
              label="Player"
              players={players}
              value={goldenGlovePlayerId}
              onChange={setGoldenGlove}
            />
          </FieldCard>

          <FieldCard
            icon="school"
            title="Best Young Player"
            hint="Standout U-21 talent."
            accent="cyan"
          >
            <PlayerSearchSelect
              id="pred-young"
              label="Player"
              players={players}
              value={youngPlayerPlayerId}
              onChange={(id) => {
                setYoungPlayer(id);
                if (id) bumpPredictionPick("youngPlayer", id);
              }}
            />
          </FieldCard>
        </div>
      </section>

      <div className="flex flex-wrap gap-3 border-t border-white/10 pt-6">
        <Button type="button" variant="danger" onClick={() => reset()}>
          Clear all predictions
        </Button>
      </div>
    </div>
  );
}
