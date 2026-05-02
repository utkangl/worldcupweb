"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface PredictionState {
  goldenBootPlayerId: string;
  topAssistPlayerId: string;
  championTeamId: string;
  setGoldenBoot: (id: string) => void;
  setTopAssist: (id: string) => void;
  setChampion: (id: string) => void;
  reset: () => void;
}

const empty = {
  goldenBootPlayerId: "",
  topAssistPlayerId: "",
  championTeamId: "",
};

export const usePredictionStore = create<PredictionState>()(
  persist(
    (set) => ({
      ...empty,
      setGoldenBoot: (id) => set({ goldenBootPlayerId: id }),
      setTopAssist: (id) => set({ topAssistPlayerId: id }),
      setChampion: (id) => set({ championTeamId: id }),
      reset: () => set({ ...empty }),
    }),
    { name: "wc-predictions" }
  )
);
