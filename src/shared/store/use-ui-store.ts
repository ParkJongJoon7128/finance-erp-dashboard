"use client";

import { create } from "zustand";

type ThemeMode = "light" | "dark";

export type AppSection =
  | "dashboard"
  | "transactions"
  | "autoInput"
  | "analytics"
  | "budget"
  | "subscriptions"
  | "reports"
  | "settings";

type UiState = {
  activeSection: AppSection;
  isSidebarCollapsed: boolean;
  theme: ThemeMode;
  setActiveSection: (section: AppSection) => void;
  toggleSidebar: () => void;
  toggleTheme: () => void;
};

export const useUiStore = create<UiState>((set) => ({
  activeSection: "dashboard",
  isSidebarCollapsed: false,
  theme: "light",
  setActiveSection: (activeSection) => set({ activeSection }),
  toggleSidebar: () =>
    set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
  toggleTheme: () =>
    set((state) => ({ theme: state.theme === "light" ? "dark" : "light" })),
}));
