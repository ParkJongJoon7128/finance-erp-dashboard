"use client";

import {
  BarChart3,
  Bell,
  CalendarDays,
  CreditCard,
  FileSearch,
  LayoutDashboard,
  Menu,
  Moon,
  ReceiptText,
  Settings,
  Sun,
  UploadCloud,
  WalletCards,
} from "lucide-react";
import type { ReactNode } from "react";
import { AccountStatusPill } from "@/features/account/ui/account-status-pill";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/cn";
import { type AppSection, useUiStore } from "@/shared/store/use-ui-store";

const navigation: Array<{
  id: AppSection;
  label: string;
  icon: typeof LayoutDashboard;
}> = [
  { id: "dashboard", label: "대시보드", icon: LayoutDashboard },
  { id: "transactions", label: "거래 내역", icon: ReceiptText },
  { id: "autoInput", label: "자동 입력", icon: UploadCloud },
  { id: "analytics", label: "분석", icon: BarChart3 },
  { id: "budget", label: "예산", icon: WalletCards },
  { id: "subscriptions", label: "구독", icon: CreditCard },
  { id: "reports", label: "보고서", icon: FileSearch },
  { id: "settings", label: "설정", icon: Settings },
];

export function AppShell({ children }: { children: ReactNode }) {
  const {
    activeSection,
    isSidebarCollapsed,
    setActiveSection,
    theme,
    toggleSidebar,
    toggleTheme,
  } = useUiStore();
  const currentNavigation =
    navigation.find((item) => item.id === activeSection) ?? navigation[0];

  return (
    <div className="min-h-screen bg-surface-muted text-foreground">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 hidden border-r border-border bg-surface lg:flex lg:flex-col",
          isSidebarCollapsed ? "w-20" : "w-64",
        )}
      >
        <div className="flex h-16 items-center gap-3 border-b border-border px-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary text-white dark:text-toss-grey-900">
            <WalletCards className="h-5 w-5" aria-hidden="true" />
          </div>
          {!isSidebarCollapsed && (
            <div className="min-w-0">
              <p className="truncate text-tds-6 font-semibold">Finance ERP</p>
              <p className="truncate text-tds-7 text-muted">
                개인 재무 운영 대시보드
              </p>
            </div>
          )}
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {navigation.map((item) => (
            <button
              key={item.label}
              aria-current={activeSection === item.id ? "page" : undefined}
              className={cn(
                "flex h-10 w-full items-center gap-3 rounded-md px-3 text-tds-6 text-toss-grey-600 transition-colors hover:bg-toss-grey-100 hover:text-foreground dark:text-toss-grey-300 dark:hover:bg-toss-grey-800",
                activeSection === item.id &&
                  "bg-primary text-white hover:bg-primary-hover hover:text-white dark:text-toss-grey-900",
                isSidebarCollapsed && "justify-center px-0",
              )}
              onClick={() => setActiveSection(item.id)}
              type="button"
              title={item.label}
            >
              <item.icon className="h-4 w-4 shrink-0" aria-hidden="true" />
              {!isSidebarCollapsed && <span className="truncate">{item.label}</span>}
            </button>
          ))}
        </nav>
      </aside>

      <div className={cn("lg:pl-64", isSidebarCollapsed && "lg:pl-20")}>
        <header className="sticky top-0 z-20 border-b border-border bg-surface/95 backdrop-blur">
          <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
            <Button
              aria-label="사이드바 전환"
              onClick={toggleSidebar}
              size="icon"
              type="button"
              variant="ghost"
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </Button>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 text-tds-7 text-muted">
                <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
                2026년 6월 운영 현황
              </div>
              <h1 className="truncate text-tds-5 font-semibold">
                {currentNavigation.label}
              </h1>
            </div>
            <Button
              aria-label="테마 전환"
              onClick={toggleTheme}
              size="icon"
              type="button"
              variant="secondary"
            >
              {theme === "light" ? (
                <Moon className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Sun className="h-4 w-4" aria-hidden="true" />
              )}
            </Button>
            <AccountStatusPill />
            <Button aria-label="알림" size="icon" type="button" variant="secondary">
              <Bell className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </header>
        <main className="px-4 py-5 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
