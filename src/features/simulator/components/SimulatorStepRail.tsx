"use client";

import { Fragment } from "react";
import { MaterialIcon } from "@/components/ui/MaterialIcon";

const STEPS = [
  {
    id: "groups",
    title: "Groups",
    hint: "1st–4th in each group",
  },
  {
    id: "thirds",
    title: "Third places",
    hint: "Rank 12 → top 8",
  },
  {
    id: "knockout",
    title: "Knockout",
    hint: "R32 through final",
  },
] as const;

export function SimulatorStepRail({
  step,
  onStepChange,
}: {
  step: number;
  onStepChange: (index: number) => void;
}) {
  return (
    <nav
      aria-label="Simulator steps"
      className="rounded-2xl border border-white/10 bg-[#201f20]/70 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-sm"
    >
      {/* Mobile: stacked */}
      <div className="flex flex-col gap-2 md:hidden">
        {STEPS.map((s, i) => (
          <Fragment key={s.id}>
            <StepButton
              index={i}
              title={s.title}
              hint={s.hint}
              active={i === step}
              done={i < step}
              onClick={() => onStepChange(i)}
            />
            {i < STEPS.length - 1 ? (
              <div
                className={`mx-auto h-6 w-px shrink-0 rounded-full ${
                  i < step ? "bg-[#CCFF00]/45" : "bg-white/10"
                }`}
                aria-hidden
              />
            ) : null}
          </Fragment>
        ))}
      </div>

      {/* Desktop: horizontal with connectors */}
      <div className="hidden items-stretch gap-0 md:flex">
        {STEPS.map((s, i) => (
          <Fragment key={s.id}>
            <div className="min-w-0 flex-1">
              <StepButton
                index={i}
                title={s.title}
                hint={s.hint}
                active={i === step}
                done={i < step}
                onClick={() => onStepChange(i)}
              />
            </div>
            {i < STEPS.length - 1 ? (
              <div
                className="flex w-6 shrink-0 items-center justify-center self-center px-0.5"
                aria-hidden
              >
                <div
                  className={`h-0.5 w-full rounded-full ${
                    i < step ? "bg-[#CCFF00]/50" : "bg-white/12"
                  }`}
                />
              </div>
            ) : null}
          </Fragment>
        ))}
      </div>
      <p className="mt-3 text-center text-[11px] text-zinc-500">
        Jump between steps anytime — your picks stay saved.
      </p>
    </nav>
  );
}

function StepButton({
  index,
  title,
  hint,
  active,
  done,
  onClick,
}: {
  index: number;
  title: string;
  hint: string;
  active: boolean;
  done: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-xl border px-3 py-3 text-left transition md:flex-col md:items-center md:gap-1.5 md:px-2 md:py-3 ${
        active
          ? "border-[#CCFF00]/45 bg-[#CCFF00]/[0.09] shadow-[0_0_28px_rgba(204,255,0,0.14)]"
          : done
            ? "border-white/12 bg-white/[0.04] hover:border-white/20"
            : "border-white/[0.07] bg-black/25 hover:border-white/15"
      }`}
    >
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-sm font-bold tabular-nums ${
          active
            ? "border-[#CCFF00] bg-[#CCFF00]/20 text-[#CCFF00]"
            : done
              ? "border-[#CCFF00]/40 bg-[#CCFF00]/10 text-[#CCFF00]"
              : "border-white/15 bg-white/[0.05] text-zinc-500"
        }`}
      >
        {done ? (
          <MaterialIcon name="check" className="!text-xl text-[#CCFF00]" filled />
        ) : (
          index + 1
        )}
      </span>
      <span className="min-w-0 flex-1 md:text-center">
        <span
          className={`block font-lexend text-sm font-semibold ${
            active ? "text-white" : "text-zinc-200"
          }`}
        >
          {title}
        </span>
        <span className="mt-0.5 block text-[11px] leading-snug text-zinc-500">
          {hint}
        </span>
      </span>
    </button>
  );
}
