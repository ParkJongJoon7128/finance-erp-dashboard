"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { Monitor, Moon, Sun, type LucideIcon } from "lucide-react";
import { cva } from "class-variance-authority";
import { cn } from "@/shared/lib";

type ThemeMode = "light" | "dark" | "system";

interface ThemeOption {
  value: ThemeMode;
  label: string;
  icon: LucideIcon;
}

const THEME_OPTIONS: ThemeOption[] = [
  { value: "light", label: "라이트", icon: Sun },
  { value: "dark", label: "다크", icon: Moon },
  { value: "system", label: "시스템", icon: Monitor },
];

function subscribe() {
  return () => {};
}

function getClientSnapshot() {
  return true;
}

function getServerSnapshot() {
  return false;
}

// hydration mismatch 방지: 서버에서는 false, 클라이언트 마운트 후에는 true를 반환한다.
// (next-themes 공식 문서의 mounted 플래그 패턴을 setState-in-effect 없이 구현)
function useMounted() {
  return useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
}

const themeOptionVariants = cva(
  "flex flex-1 flex-col items-center gap-1.5 rounded-md border px-3 py-2.5 text-sm font-medium transition-colors",
  {
    variants: {
      selected: {
        true: "border-primary bg-primary/10 text-primary",
        false: "border-border bg-background text-muted-foreground hover:bg-accent",
      },
    },
    defaultVariants: {
      selected: false,
    },
  }
);

export function ThemeSelector() {
  const { theme, setTheme } = useTheme();
  const mounted = useMounted();

  const currentTheme: ThemeMode =
    theme === "light" || theme === "dark" ? theme : "system";

  return (
    <div
      role="radiogroup"
      aria-label="화면 테마 선택"
      className={cn("flex gap-2", !mounted && "invisible")}
    >
      {THEME_OPTIONS.map(({ value, label, icon: Icon }) => {
        const selected = mounted && currentTheme === value;

        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => setTheme(value)}
            className={cn(themeOptionVariants({ selected }))}
          >
            <Icon className="h-5 w-5" aria-hidden="true" />
            <span>{label}</span>
          </button>
        );
      })}
    </div>
  );
}
