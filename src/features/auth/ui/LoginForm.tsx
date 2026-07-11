"use client";

import { AlertCircle } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Button } from "@/shared/ui";
import { cn } from "@/shared/lib";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
      <div
        role="status"
        className="flex items-start gap-2 rounded-md border border-border bg-muted/40 p-3 text-sm text-muted-foreground"
      >
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        <p>인증 기능은 현재 준비 중입니다. 로그인은 아직 이용할 수 없습니다.</p>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-sm font-medium text-foreground">
          이메일
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          disabled
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          className={cn(
            "h-9 rounded-md border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-60",
          )}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-sm font-medium text-foreground">
          비밀번호
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          disabled
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="********"
          className={cn(
            "h-9 rounded-md border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-60",
          )}
        />
      </div>

      <Button type="submit" className="mt-2 w-full" disabled>
        로그인 (준비 중)
      </Button>
    </form>
  );
}
