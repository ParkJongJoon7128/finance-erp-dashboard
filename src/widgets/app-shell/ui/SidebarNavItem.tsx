"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavItem } from "@/widgets/app-shell/config/navItems";
import { useSidebarStore } from "@/widgets/app-shell/model/sidebarStore";
import { cn } from "@/shared/lib";

interface SidebarNavItemProps {
  item: NavItem;
}

export function SidebarNavItem({ item }: SidebarNavItemProps) {
  const pathname = usePathname();
  const isCollapsed = useSidebarStore((state) => state.isCollapsed);
  const closeMobile = useSidebarStore((state) => state.closeMobile);
  const Icon = item.icon;

  const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

  return (
    <Link
      href={item.href}
      onClick={closeMobile}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
        isActive
          ? "bg-sidebar-accent text-sidebar-accent-foreground"
          : "text-sidebar-foreground hover:bg-sidebar-accent/50"
      )}
    >
      <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
      {!isCollapsed && <span className="truncate">{item.label}</span>}
    </Link>
  );
}
