"use client";

import type { ReactNode } from "react";
import { Sidebar } from "@/widgets/app-shell/ui/Sidebar";
import { Header } from "@/widgets/app-shell/ui/Header";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex h-full">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Header />
        <main className="flex-1 overflow-y-auto bg-background px-6 py-8">{children}</main>
      </div>
    </div>
  );
}
