"use client";

import { PanelLeft } from "lucide-react";
import { useSidebarStore } from "@/widgets/app-shell/model/sidebarStore";
import { AuthActions } from "@/widgets/app-shell/ui/AuthActions";

export function Header() {
  const toggle = useSidebarStore((state) => state.toggle);
  const openMobile = useSidebarStore((state) => state.openMobile);

  const handleClick = () => {
    if (typeof window !== "undefined" && window.matchMedia("(min-width: 1024px)").matches) {
      toggle();
      return;
    }
    openMobile();
  };

  return (
    <header className="flex h-16 items-center border-b border-border bg-background px-6">
      <button
        type="button"
        onClick={handleClick}
        aria-label="사이드바 토글"
        className="rounded-md p-2 text-foreground hover:bg-accent"
      >
        <PanelLeft className="h-5 w-5" aria-hidden="true" />
      </button>

      <div className="ml-auto">
        <AuthActions />
      </div>
    </header>
  );
}
