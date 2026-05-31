"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/lib/types";

interface AppState {
  // Theme
  theme: "light" | "dark";
  toggleTheme: () => void;

  // Auth
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;

  // Reader preferences
  readerFont: "Lora" | "Inter";
  readerFontSize: "sm" | "md" | "lg";
  readerTheme: "parchment" | "sepia" | "dark";
  setReaderFont: (font: "Lora" | "Inter") => void;
  setReaderFontSize: (size: "sm" | "md" | "lg") => void;
  setReaderTheme: (theme: "parchment" | "sepia" | "dark") => void;

  // Search
  recentSearches: string[];
  addRecentSearch: (q: string) => void;
  clearRecentSearches: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      theme: "light",
      toggleTheme: () =>
        set((s) => {
          const next = s.theme === "light" ? "dark" : "light";
          if (typeof document !== "undefined") {
            document.documentElement.classList.toggle("dark", next === "dark");
          }
          return { theme: next };
        }),

      user: null,
      token: null,
      setAuth: (user, token) => {
        if (typeof window !== "undefined") localStorage.setItem("tv_token", token);
        set({ user, token });
      },
      clearAuth: () => {
        if (typeof window !== "undefined") localStorage.removeItem("tv_token");
        set({ user: null, token: null });
      },

      readerFont: "Lora",
      readerFontSize: "md",
      readerTheme: "parchment",
      setReaderFont: (font) => set({ readerFont: font }),
      setReaderFontSize: (size) => set({ readerFontSize: size }),
      setReaderTheme: (theme) => set({ readerTheme: theme }),

      recentSearches: [],
      addRecentSearch: (q) =>
        set((s) => ({
          recentSearches: [q, ...s.recentSearches.filter((x) => x !== q)].slice(0, 8),
        })),
      clearRecentSearches: () => set({ recentSearches: [] }),
    }),
    {
      name: "thivien-store",
      partialize: (s) => ({
        theme: s.theme,
        readerFont: s.readerFont,
        readerFontSize: s.readerFontSize,
        readerTheme: s.readerTheme,
        recentSearches: s.recentSearches,
        token: s.token,
        user: s.user,
      }),
    }
  )
);
