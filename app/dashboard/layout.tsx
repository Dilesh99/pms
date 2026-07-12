"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useSession } from "@/components/providers/session-provider";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { role, isReady } = useSession();

  useEffect(() => {
    if (isReady && !role) {
      router.replace("/login");
    }
  }, [isReady, role, router]);

  if (!isReady || !role) {
    return (
      <div
        className="flex min-h-dvh flex-col items-center justify-center gap-3 text-muted-foreground"
        role="status"
        aria-live="polite"
      >
        <Loader2 className="size-6 animate-spin text-primary" aria-hidden="true" />
        <p className="text-sm">Loading your secure portal…</p>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <DashboardHeader />
        <main id="main-content" className="flex-1 p-4 sm:p-6">
          <div className="mx-auto w-full max-w-6xl">{children}</div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
