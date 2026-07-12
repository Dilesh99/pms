"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to login page on mount
    router.replace("/login");
  }, [router]);

  return (
    <div className="login-page-wrapper">
      <div className="flex flex-col items-center justify-center gap-4 text-white">
        <Loader2 className="size-8 animate-spin" aria-hidden="true" />
        <p className="text-sm font-medium tracking-wide text-white/90">
          Loading secure login...
        </p>
      </div>
    </div>
  );
}
