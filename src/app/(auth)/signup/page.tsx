import Link from "next/link";
import { Card } from "@/shared/ui";
import { SignupForm } from "@/features/auth";

export default function Page() {
  return (
    <Card className="w-full max-w-sm">
      <h1 className="text-xl font-semibold text-foreground">회원가입</h1>

      <div className="mt-6">
        <SignupForm />
      </div>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        이미 계정이 있으신가요?{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          로그인
        </Link>
      </p>
    </Card>
  );
}
