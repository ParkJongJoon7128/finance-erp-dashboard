import Link from "next/link";
import { buttonVariants } from "@/shared/ui";
import { cn } from "@/shared/lib";

export function AuthActions() {
  return (
    <div className="flex items-center gap-2">
      <Link href="/login" className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}>
        로그인
      </Link>
      <Link href="/signup" className={cn(buttonVariants({ variant: "primary", size: "sm" }))}>
        회원가입
      </Link>
    </div>
  );
}
