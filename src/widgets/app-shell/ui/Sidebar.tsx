"use client";

import { Wallet } from "lucide-react";
import { SidebarNav } from "@/widgets/app-shell/ui/SidebarNav";
import { useSidebarStore } from "@/widgets/app-shell/model/sidebarStore";
import { cn } from "@/shared/lib";

export function Sidebar() {
  const isCollapsed = useSidebarStore((state) => state.isCollapsed);
  const isMobileOpen = useSidebarStore((state) => state.isMobileOpen);
  const closeMobile = useSidebarStore((state) => state.closeMobile);

  return (
    <>
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={closeMobile}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          "z-50 flex h-full flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-all duration-200",
          isCollapsed ? "w-16" : "w-64",
          "fixed inset-y-0 left-0 lg:static",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-4">
          <Wallet className="h-6 w-6 shrink-0 text-sidebar-primary" aria-hidden="true" />
          {!isCollapsed && (
            <span className="truncate text-sm font-semibold">가계부</span>
          )}
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          <SidebarNav />
        </div>
      </aside>
    </>
  );
}
