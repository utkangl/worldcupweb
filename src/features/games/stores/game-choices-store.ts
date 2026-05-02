"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

/** pairId -> 'left' | 'right' */
export type ChoiceMap = Record<string, "left" | "right">;

export interface GameChoicesState {
  choices: ChoiceMap;
  recordChoice: (pairId: string, side: "left" | "right") => void;
  clearChoices: () => void;
}

export const useGameChoicesStore = create<GameChoicesState>()(
  persist(
    (set) => ({
      choices: {},
      recordChoice: (pairId, side) =>
        set((s) => ({ choices: { ...s.choices, [pairId]: side } })),
      clearChoices: () => set({ choices: {} }),
    }),
    { name: "wc-game-choices" }
  )
);
