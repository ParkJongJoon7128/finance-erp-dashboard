import { Suspense } from "react";
import { LoginPageContent } from "@/app/(auth)/login/LoginPageContent";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <LoginPageContent />
    </Suspense>
  );
}
