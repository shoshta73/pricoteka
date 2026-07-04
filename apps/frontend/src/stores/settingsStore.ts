import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export type RuntimeMode = "browser" | "api";

interface SettingsStore {
  runtimeMode: RuntimeMode;
  setRuntimeMode: (runtimeMode: RuntimeMode) => void;
}

export const useSettingsStore = create<SettingsStore>()(
  devtools(
    persist(
      (set) => ({
        runtimeMode: "browser",
        setRuntimeMode: (runtimeMode) => set({ runtimeMode }),
      }),
      {
        name: "settings-storage",
        version: 1,
      },
    ),
    {
      name: "settings-store",
    },
  ),
);
