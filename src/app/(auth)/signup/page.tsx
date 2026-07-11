import Link from "next/link";
import { Button, Card } from "@/shared/ui";

export default function Page() {
  return (
    <Card className="w-full max-w-sm">
      <h1 className="text-xl font-semibold text-foreground">회원가입</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        회원가입 기능은 준비 중입니다. 아래 폼은 화면 구성 확인용입니다.
      </p>

      <form className="mt-6 flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-sm font-medium text-foreground">
            이메일
          </label>
          <input
            id="email"
            type="email"
            disabled
            placeholder="you@example.com"
            className="h-9 rounded-md border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground disabled:opacity-50"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="password" className="text-sm font-medium text-foreground">
            비밀번호
          </label>
          <input
            id="password"
            type="password"
            disabled
            placeholder="********"
            className="h-9 rounded-md border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground disabled:opacity-50"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="passwordConfirm" className="text-sm font-medium text-foreground">
            비밀번호 확인
          </label>
          <input
            id="passwordConfirm"
            type="password"
            disabled
            placeholder="********"
            className="h-9 rounded-md border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground disabled:opacity-50"
          />
        </div>

        <Button type="submit" disabled className="mt-2 w-full">
          회원가입 (준비 중)
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        이미 계정이 있으신가요?{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          로그인
        </Link>
      </p>
    </Card>
  );
}
