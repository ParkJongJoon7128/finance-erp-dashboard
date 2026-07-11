"use client";

import Link from "next/link";
import { Card } from "@/shared/ui";
import { LoginForm } from "@/features/auth";

export function LoginPageContent() {
  return (
    <Card className="w-full max-w-sm">
      <h1 className="text-xl font-semibold text-foreground">로그인</h1>

      <div className="mt-6">
        <LoginForm />
      </div>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        아직 계정이 없으신가요?{" "}
        <Link href="/signup" className="font-medium text-primary hover:underline">
          회원가입
        </Link>
      </p>
    </Card>
  );
}
