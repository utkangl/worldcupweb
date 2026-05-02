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
import { MaterialIcon } from "@/components/ui/MaterialIcon";

const listModifiers = [restrictToVerticalAxis, restrictToParentElement];

function SortableThirdRow({
  id,
  position,
  seedLabel,
  groupLabel,
  name,
  advances,
  canMoveUp,
  canMoveDown,
  onMoveUp,
  onMoveDown,
  isAnyDragging,
}: {
  id: string;
  position: number;
  seedLabel: string;
  groupLabel: string;
  name: string;
  advances: boolean;
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
      className={`relative flex select-none list-none items-center gap-2 rounded-xl border px-2 py-2 transition-[box-shadow,background-color,border-color] duration-150 ${
        advances
          ? "border-[#CCFF00]/20 bg-[#CCFF00]/[0.04]"
          : "border-white/[0.05] bg-black/20"
      } ${
        isDragging
          ? "z-10 cursor-grabbing border-[#CCFF00]/45 bg-white/[0.05] shadow-[0_12px_30px_rgba(0,0,0,0.45),0_0_0_1px_rgba(204,255,0,0.18)]"
          : `border-white/[0.06] ${isAnyDragging ? "" : "hover:border-white/15 hover:bg-white/[0.04]"} cursor-grab`
      }`}
      {...attributes}
      {...listeners}
    >
      <span className="flex w-8 shrink-0 flex-col items-center justify-center font-mono text-[10px] leading-tight text-zinc-500">
        <span className="text-zinc-400">{position}</span>
        <span
          className={
            advances ? "font-semibold text-[#CCFF00]" : "text-zinc-600"
          }
        >
          {seedLabel}
        </span>
      </span>
      <span className="w-7 shrink-0 text-center font-mono text-xs font-semibold text-zinc-500">
        {groupLabel}
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
          aria-label="Yukarı"
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
          aria-label="Aşağı"
        >
          <MaterialIcon name="keyboard_arrow_down" />
        </button>
      </div>
    </li>
  );
}

export function ThirdPlaceRankingPanel({
  order,
  teamById,
  onReorder,
}: {
  /** Reconciled list of 12 third-placed team ids, best first */
  order: string[];
  teamById: Map<string, Team>;
  onReorder: (teamIds: string[]) => void;
}) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
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
    onReorder(arrayMove(order, oldIndex, newIndex));
  };

  const onDragCancel = () => setActiveId(null);

  return (
    <section className="rounded-2xl border border-white/10 bg-black/15 p-4">
      <h3 className="mb-1 text-sm font-semibold text-zinc-100">
        Üçüncüler — Round of 32&apos;ye hangi 8 takım?
      </h3>
      <p className="mb-3 text-xs leading-relaxed text-zinc-500">
        Skor olmadığı için sırayı siz belirliyorsunuz.{" "}
        <span className="text-zinc-400">Üstteki 8</span> (T1–T8) elemede yer alır;{" "}
        <span className="text-zinc-400">alttaki 4</span> elenir. Sürükleyin veya okları
        kullanın. Grup sıranız değişince yeni üçüncüler listeye eklenir (sona).
      </p>
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
          <ul className="flex max-h-[min(28rem,55vh)] flex-col gap-1 overflow-y-auto pr-1">
            {order.map((teamId, i) => {
              const t = teamById.get(teamId);
              const advances = i < 8;
              const seedLabel = advances ? `T${i + 1}` : "—";
              return (
                <SortableThirdRow
                  key={teamId}
                  id={teamId}
                  position={i + 1}
                  seedLabel={seedLabel}
                  groupLabel={t?.group ?? "?"}
                  name={t?.name ?? teamId}
                  advances={advances}
                  canMoveUp={i > 0}
                  canMoveDown={i < order.length - 1}
                  onMoveUp={() => onReorder(arrayMove(order, i, i - 1))}
                  onMoveDown={() => onReorder(arrayMove(order, i, i + 1))}
                  isAnyDragging={activeId !== null}
                />
              );
            })}
          </ul>
        </SortableContext>
      </DndContext>
    </section>
  );
}
