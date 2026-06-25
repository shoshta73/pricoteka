import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { Theme } from "@/types";

interface ThemeStore {
  theme: Theme;
  toggle: () => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      theme: "dark",
      toggle: () =>
        set((state) => ({
          theme: state.theme === "dark" ? "light" : "dark",
        })),
    }),
    {
      name: "theme-storage",
    },
  ),
);
