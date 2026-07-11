import {
  ArrowLeftRight,
  BarChart3,
  FileText,
  LayoutDashboard,
  Repeat,
  Settings,
  Wallet,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const NAV_ITEMS: NavItem[] = [
  { label: "대시보드", href: "/", icon: LayoutDashboard },
  { label: "거래 내역 관리", href: "/transactions", icon: ArrowLeftRight },
  { label: "분석 및 차트", href: "/analytics", icon: BarChart3 },
  { label: "구독 관리", href: "/subscriptions", icon: Repeat },
  { label: "예산 관리", href: "/budgets", icon: Wallet },
  { label: "보고서", href: "/reports", icon: FileText },
  { label: "설정", href: "/settings", icon: Settings },
];
