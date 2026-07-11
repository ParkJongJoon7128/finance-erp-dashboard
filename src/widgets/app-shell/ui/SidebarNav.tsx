import { NAV_ITEMS } from "@/widgets/app-shell/config/navItems";
import { SidebarNavItem } from "@/widgets/app-shell/ui/SidebarNavItem";

export function SidebarNav() {
  return (
    <nav className="flex flex-col gap-1 px-2">
      {NAV_ITEMS.map((item) => (
        <SidebarNavItem key={item.href} item={item} />
      ))}
    </nav>
  );
}
