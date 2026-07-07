import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

type Theme = "dark" | "light";

interface ThemeStore {
  theme: Theme;
  toggle: () => void;
}

export const useThemeStore = create<ThemeStore>()(
  devtools(
    persist(
      (set) => ({
        theme: "dark",
        toggle: () =>
          set((state) => ({
            theme: state.theme === "dark" ? "light" : "dark",
          })),
      }),
      {
        name: "website-theme-storage",
      },
    ),
    {
      name: "website-theme-store",
    },
  ),
);
