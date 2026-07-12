"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, StethoscopeIcon, X } from "lucide-react";
import { useSession } from "@/components/providers/session-provider";
import { navForRole } from "@/lib/nav";
import { BRAND, ROLE_LABELS } from "@/lib/data";
import { cn } from "@/lib/utils";
import type { Role } from "@/lib/types";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import { HeartPulse } from "lucide-react";

export function AppSidebar() {
  const pathname = usePathname();
  const { role, logout } = useSession();
  const { setOpenMobile, isMobile } = useSidebar();

  const activeRole: Role = role ?? "patient";
  const items = navForRole(activeRole);
  const roleLabel = ROLE_LABELS[activeRole];

  function handleNavClick() {
    if (isMobile) setOpenMobile(false);
  }

  return (
    <Sidebar collapsible="icon" className="bg-sidebar">
      {/* ── Header: logo + brand + role subtitle ── */}
      <SidebarHeader className="relative items-center border-b border-border/60 pb-4 pt-5 group-data-[collapsible=icon]:pb-3 group-data-[collapsible=icon]:pt-4">
        {isMobile && (
          <button
            onClick={() => setOpenMobile(false)}
            className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground md:hidden"
            aria-label="Close sidebar"
          >
            <X className="size-5" />
          </button>
        )}
        <Link
          href="/dashboard"
          className="flex flex-col items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg group-data-[collapsible=icon]:flex-row group-data-[collapsible=icon]:gap-0"
          aria-label={`${BRAND.full} home`}
        >
          {/* Icon */}
          <span
            className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-md group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:rounded-lg transition-all"
            aria-hidden="true"
          >
            <StethoscopeIcon className="size-6 group-data-[collapsible=icon]:size-4" />
          </span>

          {/* Brand name */}
          <span className="mt-2 text-base font-bold tracking-tight text-foreground group-data-[collapsible=icon]:hidden">
            {BRAND.name}
            <span className="text-primary">.</span>
          </span>
        </Link>

        {/* Role subtitle */}
        <p className="mt-0.5 text-[0.75rem] font-medium text-muted-foreground group-data-[collapsible=icon]:hidden">
          {roleLabel} Dashboard
        </p>
      </SidebarHeader>

      {/* ── Nav items ── */}
      <SidebarContent className="px-3 py-4">
        <nav aria-label="Main navigation">
          <ul className="flex flex-col gap-1">
            {items.map((item) => {
              const normalised = pathname.replace(/\/$/, "") || "/";
              const isActive =
                item.href === "/dashboard"
                  ? normalised === "/dashboard"
                  : normalised.startsWith(item.href);

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={handleNavClick}
                    aria-label={item.description}
                    aria-current={isActive ? "page" : undefined}
                    title={item.title}
                     className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-all duration-200 ${
                            isActive
                              ? "bg-emerald-100 text-emerald-700 border-l-4 border-emerald-500 shadow-sm"
                              : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                          }`}
                  >
                    <item.icon
                      className={cn(
                        "size-[1.125rem] shrink-0 transition-colors",
                        isActive ? "text-primary" : "text-muted-foreground/80",
                      )}
                      aria-hidden="true"
                    />
                    <span className="truncate group-data-[collapsible=icon]:hidden">
                      {item.title}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </SidebarContent>

      {/* ── Footer: solid emerald Logout button ── */}
      <SidebarFooter className="border-t border-border/60 px-3 py-4">
        <button
          type="button"
          onClick={logout}
          className={cn(
            "flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-all duration-150",
            "bg-primary hover:bg-primary/90 active:scale-[0.98] shadow-md shadow-primary/30",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            // collapsed: icon only, square
            "group-data-[collapsible=icon]:w-10 group-data-[collapsible=icon]:h-10 group-data-[collapsible=icon]:rounded-lg group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:p-0",
          )}
          aria-label="Sign out"
        >
          <LogOut className="size-4 shrink-0" aria-hidden="true" />
          <span className="group-data-[collapsible=icon]:hidden">Logout</span>
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}
