"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type KnockoutWinnerMap = Record<string, string | undefined>;

/** Group letter → team ids in table order (index 0 = 1st place) */
export type GroupOrderMap = Record<string, string[]>;

export interface SimulatorState {
  groupOrder: GroupOrderMap;
  knockoutWinners: KnockoutWinnerMap;
  setGroupOrder: (groupLetter: string, orderedTeamIds: string[]) => void;
  setKnockoutWinner: (matchId: string, teamId: string | null) => void;
  resetAll: () => void;
}

const initial = {
  groupOrder: {} as GroupOrderMap,
  knockoutWinners: {} as KnockoutWinnerMap,
};

export const useSimulatorStore = create<SimulatorState>()(
  persist(
    (set) => ({
      ...initial,
      setGroupOrder: (groupLetter, orderedTeamIds) =>
        set((s) => ({
          groupOrder: { ...s.groupOrder, [groupLetter]: orderedTeamIds },
        })),
      setKnockoutWinner: (matchId, teamId) =>
        set((s) => ({
          knockoutWinners: {
            ...s.knockoutWinners,
            [matchId]: teamId ?? undefined,
          },
        })),
      resetAll: () => set({ ...initial }),
    }),
    {
      name: "wc-simulator-v2",
      partialize: (state) => ({
        groupOrder: state.groupOrder,
        knockoutWinners: state.knockoutWinners,
      }),
    }
  )
);
