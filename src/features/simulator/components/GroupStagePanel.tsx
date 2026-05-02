"use client";

import { useState } from "react";
import {
  DndContext,
  type DragEndEvent,
  type DragStartEvent,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  defaultDropAnimationSideEffects,
  type DropAnimation,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  restrictToParentElement,
  restrictToVerticalAxis,
} from "@dnd-kit/modifiers";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Team } from "@/lib/types";
import {
  normalizeGroupOrder,
  standingsFromOrder,
} from "@/features/simulator/lib/standings";
import { useSimulatorStore } from "@/features/simulator/stores/simulator-store";
import { MaterialIcon } from "@/components/ui/MaterialIcon";

const GROUPS = [
  "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L",
] as const;

/** Vertical-only drag + keep preview inside the list (`ul` parent of rows). Must match on `DragOverlay`. */
const listDragModifiers = [restrictToVerticalAxis, restrictToParentElement];

const dropAnimation: DropAnimation = {
  duration: 220,
  easing: "cubic-bezier(0.25, 1, 0.5, 1)",
  sideEffects: defaultDropAnimationSideEffects({
    styles: { active: { opacity: "0.35" } },
  }),
};

function RowPreview({
  rank,
  shortName,
}: {
  rank: number;
  shortName: string;
}) {
  return (
    <div
      className="flex cursor-grabbing items-center gap-3 rounded-xl border border-[#CCFF00]/35 bg-[#2a2a2b] px-3 py-3 shadow-[0_16px_40px_rgba(0,0,0,0.55),0_0_0_1px_rgba(204,255,0,0.12)]"
      style={{ transform: "scale(1.02)" }}
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#CCFF00]/15 font-mono text-sm font-semibold text-[#CCFF00]">
        {rank}
      </span>
      <span className="min-w-0 flex-1 font-semibold tracking-tight text-zinc-50">
        {shortName}
      </span>
      <MaterialIcon name="drag_indicator" className="text-xl text-zinc-400" />
    </div>
  );
}

function SortableTeamRow({
  id,
  rank,
  shortName,
  canMoveUp,
  canMoveDown,
  onMoveUp,
  onMoveDown,
}: {
  id: string;
  rank: number;
  shortName: string;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`relative rounded-xl border border-white/[0.06] bg-black/25 transition-[box-shadow,background-color,border-color,opacity] duration-200 ${
        isDragging
          ? "z-10 border-[#CCFF00]/20 bg-white/[0.03] opacity-45 shadow-[inset_0_0_0_1px_rgba(204,255,0,0.1)]"
          : "hover:border-white/10 hover:bg-white/[0.04]"
      }`}
    >
      <div className="flex items-center gap-2 px-2 py-2.5">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/[0.06] font-mono text-sm text-zinc-400">
          {rank}
        </span>
        <span className="min-w-0 flex-1 font-medium text-zinc-100">
          {shortName}
        </span>
        <button
          type="button"
          className="flex shrink-0 touch-none items-center justify-center rounded-lg p-2 text-zinc-500 transition-colors hover:bg-white/10 hover:text-[#CCFF00] active:cursor-grabbing"
          title="Drag to reorder"
          aria-label="Drag to reorder"
          {...attributes}
          {...listeners}
        >
          <MaterialIcon name="drag_indicator" className="text-xl" />
        </button>
        <div className="flex shrink-0 gap-0.5">
          <button
            type="button"
            disabled={!canMoveUp}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              onMoveUp();
            }}
            className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-white/10 hover:text-zinc-100 disabled:pointer-events-none disabled:opacity-25"
            aria-label="Move up"
          >
            <MaterialIcon name="keyboard_arrow_up" />
          </button>
          <button
            type="button"
            disabled={!canMoveDown}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              onMoveDown();
            }}
            className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-white/10 hover:text-zinc-100 disabled:pointer-events-none disabled:opacity-25"
            aria-label="Move down"
          >
            <MaterialIcon name="keyboard_arrow_down" />
          </button>
        </div>
      </div>
    </li>
  );
}

function SortableGroupList({
  letter,
  tg,
  ids,
  fallback,
}: {
  letter: string;
  tg: Team[];
  ids: string[];
  fallback: string[];
}) {
  const { groupOrder, setGroupOrder } = useSimulatorStore();
  const order = normalizeGroupOrder(ids, groupOrder[letter], fallback);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const onDragStart = (e: DragStartEvent) => {
    setActiveId(String(e.active.id));
  };

  const onDragEnd = (e: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIndex = order.indexOf(String(active.id));
    const newIndex = order.indexOf(String(over.id));
    if (oldIndex < 0 || newIndex < 0) return;
    setGroupOrder(letter, arrayMove(order, oldIndex, newIndex));
  };

  const activeTeam = activeId
    ? tg.find((x) => x.id === activeId)
    : undefined;
  const activeRank = activeId ? order.indexOf(activeId) + 1 : 0;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      modifiers={listDragModifiers}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <SortableContext items={order} strategy={verticalListSortingStrategy}>
        <ul className="mb-4 flex flex-col gap-1.5 rounded-xl border border-white/[0.08] bg-black/15 p-2">
          {order.map((teamId, i) => {
            const t = tg.find((x) => x.id === teamId);
            return (
              <SortableTeamRow
                key={teamId}
                id={teamId}
                rank={i + 1}
                shortName={t?.shortName ?? teamId}
                canMoveUp={i > 0}
                canMoveDown={i < order.length - 1}
                onMoveUp={() =>
                  setGroupOrder(letter, arrayMove(order, i, i - 1))
                }
                onMoveDown={() =>
                  setGroupOrder(letter, arrayMove(order, i, i + 1))
                }
              />
            );
          })}
        </ul>
      </SortableContext>
      <DragOverlay modifiers={listDragModifiers} dropAnimation={dropAnimation}>
        {activeId && activeTeam ? (
          <RowPreview rank={activeRank} shortName={activeTeam.shortName} />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

export function GroupStagePanel({ teams }: { teams: Team[] }) {
  const { groupOrder } = useSimulatorStore();

  const byGroup = GROUPS.map((g) => ({
    letter: g,
    teams: teams.filter((t) => t.group === g),
  }));

  return (
    <div className="space-y-8">
      {byGroup.map(({ letter, teams: tg }) => {
        const ids = tg.map((t) => t.id);
        const fallback = tg.map((t) => t.id);
        const table = standingsFromOrder(ids, groupOrder[letter], fallback);

        return (
          <details
            key={letter}
            className="group rounded-2xl border border-white/10 bg-[var(--surface)] open:border-[var(--accent)]/30"
            open={letter === "A"}
          >
            <summary className="cursor-pointer list-none px-4 py-3 font-semibold text-zinc-200">
              Group {letter}
            </summary>
            <div className="border-t border-white/10 px-4 pb-4 pt-2">
              <p className="mb-3 text-xs text-zinc-500">
                Drag the handle (or use arrows) to reorder — top is 1st place. Rows
                animate like a playlist when you move them.
              </p>
              <SortableGroupList
                letter={letter}
                tg={tg}
                ids={ids}
                fallback={fallback}
              />
              <div className="overflow-x-auto">
                <table className="w-full min-w-[320px] text-left text-sm">
                  <thead>
                    <tr className="text-xs text-zinc-500">
                      <th className="py-2">#</th>
                      <th className="py-2">Team</th>
                      <th className="py-2">P</th>
                      <th className="py-2">GD</th>
                      <th className="py-2">Pts</th>
                    </tr>
                  </thead>
                  <tbody>
                    {table.map((row) => {
                      const t = tg.find((x) => x.id === row.teamId);
                      return (
                        <tr key={row.teamId} className="border-t border-white/5">
                          <td className="py-2 font-mono text-zinc-400">
                            {row.rank}
                          </td>
                          <td className="py-2 text-zinc-200">{t?.shortName}</td>
                          <td className="py-2 text-zinc-500">{row.played}</td>
                          <td className="py-2 text-zinc-500">
                            {row.goalDifference > 0 ? "+" : ""}
                            {row.goalDifference}
                          </td>
                          <td className="py-2 font-semibold text-zinc-100">
                            {row.points}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </details>
        );
      })}
    </div>
  );
}
