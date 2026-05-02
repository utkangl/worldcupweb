"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type KnockoutWinnerMap = Record<string, string | undefined>;

/** Group letter → team ids in table order (index 0 = 1st place) */
export type GroupOrderMap = Record<string, string[]>;

export interface SimulatorState {
  groupOrder: GroupOrderMap;
  /** User-ordered list of third-placed team ids (up to 12); reconciled against live groups */
  thirdPlaceOrder: string[];
  knockoutWinners: KnockoutWinnerMap;
  setGroupOrder: (groupLetter: string, orderedTeamIds: string[]) => void;
  setThirdPlaceOrder: (orderedThirdTeamIds: string[]) => void;
  setKnockoutWinner: (matchId: string, teamId: string | null) => void;
  resetAll: () => void;
}

const initial = {
  groupOrder: {} as GroupOrderMap,
  thirdPlaceOrder: [] as string[],
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
      setThirdPlaceOrder: (orderedThirdTeamIds) =>
        set({ thirdPlaceOrder: orderedThirdTeamIds }),
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
      name: "wc-simulator-v3",
      partialize: (state) => ({
        groupOrder: state.groupOrder,
        thirdPlaceOrder: state.thirdPlaceOrder,
        knockoutWinners: state.knockoutWinners,
      }),
    }
  )
);
