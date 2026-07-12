"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LifeBuoy, LogOut } from "lucide-react";
import { Logo } from "@/components/logo";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useSession } from "@/components/providers/session-provider";
import { navForRole } from "@/lib/nav";
import { ROLE_LABELS } from "@/lib/data";
import type { Role } from "@/lib/types";

export function AppSidebar() {
  const pathname = usePathname();
  const { role, logout } = useSession();
  const { setOpenMobile, isMobile } = useSidebar();

  const activeRole: Role = role ?? "patient";
  const items = navForRole(activeRole);

  function handleNavClick() {
    if (isMobile) setOpenMobile(false);
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b">
        <div className="flex h-12 items-center px-1 group-data-[collapsible=icon]:justify-center">
          <Logo href="/dashboard" />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{ROLE_LABELS[activeRole]} menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const normalised = pathname.replace(/\/$/, "") || "/";
                const isActive =
                  item.href === "/dashboard"
                    ? normalised === "/dashboard"
                    : normalised.startsWith(item.href);
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      isActive={isActive}
                      tooltip={item.title}
                      render={
                        <Link href={item.href} onClick={handleNavClick} aria-label={item.description} />
                      }
                    >
                      <item.icon aria-hidden="true" />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Help & support" render={<Link href="/dashboard" />}>
              <LifeBuoy aria-hidden="true" />
              <span>Help &amp; support</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Sign out" onClick={logout}>
              <LogOut aria-hidden="true" />
              <span>Sign out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
