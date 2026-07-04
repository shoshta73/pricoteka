import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export type RuntimeMode = "browser" | "api";

interface SettingsStore {
  apiUrl: string;
  runtimeMode: RuntimeMode;
  setApiUrl: (apiUrl: string) => void;
  setRuntimeMode: (runtimeMode: RuntimeMode) => void;
}

export const useSettingsStore = create<SettingsStore>()(
  devtools(
    persist(
      (set) => ({
        apiUrl: "",
        runtimeMode: "browser",
        setApiUrl: (apiUrl) => set({ apiUrl }),
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
