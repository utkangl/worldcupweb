"use client";

import { useState } from "react";
import {
  DndContext,
  type DragEndEvent,
  type DragStartEvent,
  KeyboardSensor,
  MeasuringStrategy,
  PointerSensor,
  closestCenter,
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
import { normalizeGroupOrder } from "@/features/simulator/lib/standings";
import { useSimulatorStore } from "@/features/simulator/stores/simulator-store";
import { MaterialIcon } from "@/components/ui/MaterialIcon";

const GROUPS = [
  "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L",
] as const;

const listModifiers = [restrictToVerticalAxis, restrictToParentElement];

function rankClasses(rank: number) {
  if (rank === 1) return "bg-[#CCFF00]/15 text-[#CCFF00]";
  if (rank === 2) return "bg-white/[0.12] text-zinc-100";
  return "bg-white/[0.06] text-zinc-400";
}

function SortableTeamRow({
  id,
  rank,
  name,
  canMoveUp,
  canMoveDown,
  onMoveUp,
  onMoveDown,
  isAnyDragging,
}: {
  id: string;
  rank: number;
  name: string;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isAnyDragging: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    touchAction: "none",
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`relative flex select-none list-none items-center gap-2 rounded-xl border bg-black/25 px-2 py-2 transition-[box-shadow,background-color,border-color] duration-150 ${
        isDragging
          ? "z-10 cursor-grabbing border-[#CCFF00]/45 bg-white/[0.05] shadow-[0_12px_30px_rgba(0,0,0,0.45),0_0_0_1px_rgba(204,255,0,0.18)]"
          : `border-white/[0.06] ${isAnyDragging ? "" : "hover:border-white/15 hover:bg-white/[0.04]"} cursor-grab`
      }`}
      {...attributes}
      {...listeners}
    >
      <span
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg font-mono text-sm font-semibold ${rankClasses(rank)}`}
      >
        {rank}
      </span>
      <span className="min-w-0 flex-1 truncate text-sm font-medium text-zinc-100">
        {name}
      </span>
      <MaterialIcon
        name="drag_indicator"
        className="shrink-0 text-lg text-zinc-500"
      />
      <div className="flex shrink-0 gap-0.5">
        <button
          type="button"
          disabled={!canMoveUp}
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            onMoveUp();
          }}
          className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-white/10 hover:text-zinc-100 disabled:pointer-events-none disabled:opacity-25"
          aria-label="Bir yukarı"
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
          className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-white/10 hover:text-zinc-100 disabled:pointer-events-none disabled:opacity-25"
          aria-label="Bir aşağı"
        >
          <MaterialIcon name="keyboard_arrow_down" />
        </button>
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
      activationConstraint: { distance: 5 },
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

  const onDragCancel = () => setActiveId(null);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      modifiers={listModifiers}
      measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragCancel={onDragCancel}
    >
      <SortableContext items={order} strategy={verticalListSortingStrategy}>
        <ul className="flex flex-col gap-1.5">
          {order.map((teamId, i) => {
            const t = tg.find((x) => x.id === teamId);
            return (
              <SortableTeamRow
                key={teamId}
                id={teamId}
                rank={i + 1}
                name={t?.name ?? teamId}
                canMoveUp={i > 0}
                canMoveDown={i < order.length - 1}
                onMoveUp={() =>
                  setGroupOrder(letter, arrayMove(order, i, i - 1))
                }
                onMoveDown={() =>
                  setGroupOrder(letter, arrayMove(order, i, i + 1))
                }
                isAnyDragging={activeId !== null}
              />
            );
          })}
        </ul>
      </SortableContext>
    </DndContext>
  );
}

export function GroupStagePanel({ teams }: { teams: Team[] }) {
  const byGroup = GROUPS.map((g) => ({
    letter: g,
    teams: teams.filter((t) => t.group === g),
  }));

  return (
    <div>
      <p className="mb-4 text-xs text-zinc-500">
        Her grup tek sütun halinde 4 takım gösterir. Sıralamayı değiştirmek için
        bir takımı tutup grubun içinde yukarı / aşağı sürükleyin (kart kutudan
        çıkmaz). Oklar tek basamak kaydırır.
      </p>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {byGroup.map(({ letter, teams: tg }) => {
          const ids = tg.map((t) => t.id);
          const fallback = tg.map((t) => t.id);

          return (
            <section
              key={letter}
              className="rounded-2xl border border-white/10 bg-[var(--surface)] p-3"
            >
              <header className="mb-2 flex items-center justify-between px-1">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-300">
                  Group {letter}
                </h3>
                <span className="text-[11px] text-zinc-600">
                  {tg.length} takım
                </span>
              </header>
              <SortableGroupList
                letter={letter}
                tg={tg}
                ids={ids}
                fallback={fallback}
              />
            </section>
          );
        })}
      </div>
    </div>
  );
}
