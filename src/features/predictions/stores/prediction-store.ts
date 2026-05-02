"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface PredictionState {
  goldenBootPlayerId: string;
  topAssistPlayerId: string;
  goldenGlovePlayerId: string;
  youngPlayerPlayerId: string;
  championTeamId: string;
  runnerUpTeamId: string;
  thirdPlaceTeamId: string;
  surpriseTeamId: string;
  /** User’s guess for golden boot total goals (numeric string) */
  goldenBootGoalTotal: string;
  setGoldenBoot: (id: string) => void;
  setTopAssist: (id: string) => void;
  setGoldenGlove: (id: string) => void;
  setYoungPlayer: (id: string) => void;
  setChampion: (id: string) => void;
  setRunnerUp: (id: string) => void;
  setThirdPlace: (id: string) => void;
  setSurprise: (id: string) => void;
  setGoldenBootGoalTotal: (value: string) => void;
  reset: () => void;
}

const empty: Omit<
  PredictionState,
  | "setGoldenBoot"
  | "setTopAssist"
  | "setGoldenGlove"
  | "setYoungPlayer"
  | "setChampion"
  | "setRunnerUp"
  | "setThirdPlace"
  | "setSurprise"
  | "setGoldenBootGoalTotal"
  | "reset"
> = {
  goldenBootPlayerId: "",
  topAssistPlayerId: "",
  goldenGlovePlayerId: "",
  youngPlayerPlayerId: "",
  championTeamId: "",
  runnerUpTeamId: "",
  thirdPlaceTeamId: "",
  surpriseTeamId: "",
  goldenBootGoalTotal: "",
};

export const usePredictionStore = create<PredictionState>()(
  persist(
    (set) => ({
      ...empty,
      setGoldenBoot: (id) => set({ goldenBootPlayerId: id }),
      setTopAssist: (id) => set({ topAssistPlayerId: id }),
      setGoldenGlove: (id) => set({ goldenGlovePlayerId: id }),
      setYoungPlayer: (id) => set({ youngPlayerPlayerId: id }),
      setChampion: (id) => set({ championTeamId: id }),
      setRunnerUp: (id) => set({ runnerUpTeamId: id }),
      setThirdPlace: (id) => set({ thirdPlaceTeamId: id }),
      setSurprise: (id) => set({ surpriseTeamId: id }),
      setGoldenBootGoalTotal: (value) => set({ goldenBootGoalTotal: value }),
      reset: () => set({ ...empty }),
    }),
    {
      name: "wc-predictions-v2",
      partialize: (state) => ({
        goldenBootPlayerId: state.goldenBootPlayerId,
        topAssistPlayerId: state.topAssistPlayerId,
        goldenGlovePlayerId: state.goldenGlovePlayerId,
        youngPlayerPlayerId: state.youngPlayerPlayerId,
        championTeamId: state.championTeamId,
        runnerUpTeamId: state.runnerUpTeamId,
        thirdPlaceTeamId: state.thirdPlaceTeamId,
        surpriseTeamId: state.surpriseTeamId,
        goldenBootGoalTotal: state.goldenBootGoalTotal,
      }),
    }
  )
);
