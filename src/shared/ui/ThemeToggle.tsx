"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { Moon, Monitor, Sun } from "lucide-react";
import { cn } from "@/shared/lib";

type ThemeMode = "light" | "dark" | "system";

const NEXT_THEME: Record<ThemeMode, ThemeMode> = {
  light: "dark",
  dark: "system",
  system: "light",
};

const THEME_LABEL: Record<ThemeMode, string> = {
  light: "라이트 모드",
  dark: "다크 모드",
  system: "시스템 설정",
};

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

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const mounted = useMounted();

  if (!mounted) {
    return (
      <button
        type="button"
        aria-label="테마 전환"
        className={cn(
          "rounded-md p-2 text-foreground hover:bg-accent",
          "invisible"
        )}
      >
        <Monitor className="h-5 w-5" aria-hidden="true" />
      </button>
    );
  }

  const currentTheme: ThemeMode =
    theme === "light" || theme === "dark" ? theme : "system";
  const nextTheme = NEXT_THEME[currentTheme];

  const Icon =
    currentTheme === "light" ? Sun : currentTheme === "dark" ? Moon : Monitor;

  return (
    <button
      type="button"
      onClick={() => setTheme(nextTheme)}
      aria-label={`현재 ${THEME_LABEL[currentTheme]}, ${THEME_LABEL[nextTheme]}(으)로 전환`}
      className={cn("rounded-md p-2 text-foreground hover:bg-accent")}
    >
      <Icon className="h-5 w-5" aria-hidden="true" />
    </button>
  );
}
