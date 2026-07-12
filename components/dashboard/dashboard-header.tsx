"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Check, Menu } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserMenu } from "@/components/dashboard/user-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { useSidebar } from "@/components/ui/sidebar";

const TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/appointments": "Appointments",
  "/dashboard/records": "Medical Records",
  "/dashboard/prescriptions": "Prescriptions",
  "/dashboard/lab-reports": "Lab Reports",
  "/dashboard/payments": "Payments",
  "/dashboard/profile": "Profile & Settings",
};

const notifications = [
  { title: "Lab results ready", detail: "Your Lipid Panel results are available.", time: "2h ago" },
  { title: "Appointment reminder", detail: "Cardiology with Dr. Rahman on Sat 18 Jul.", time: "1d ago" },
  { title: "Payment due", detail: "Invoice INV-2201 is due in 5 days.", time: "2d ago" },
];

export function DashboardHeader() {
  const pathname = usePathname();
  const { toggleSidebar } = useSidebar();
  const isRoot = pathname === "/dashboard";
  
  let title = TITLES[pathname];
  if (!title) {
    const segments = pathname.split("/").filter(Boolean);
    const last = segments[segments.length - 1] || "Dashboard";
    title = last.charAt(0).toUpperCase() + last.slice(1).replace(/-/g, " ");
  }

  return (
    <header
      role="banner"
      aria-label="Application header"
      className="sticky top-0 z-30 flex h-16 items-center gap-2 border-b bg-background/90 px-3 backdrop-blur supports-[backdrop-filter]:bg-background/70 sm:px-4"
    >
      <Button
        variant="ghost"
        size="icon"
        className="-ml-1 md:hidden shrink-0"
        onClick={toggleSidebar}
        aria-label="Toggle navigation menu"
        aria-controls="sidebar"
      >
        <Menu className="size-5" aria-hidden="true" />
        <span className="sr-only">Toggle Sidebar</span>
      </Button>
      <Breadcrumb className="min-w-0 flex-1">
        <BreadcrumbList>
          
          <BreadcrumbItem>
            <BreadcrumbPage className="truncate text-base font-semibold text-foreground">
              {title}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center gap-1.5">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="outline" size="icon" className="relative" aria-label="Notifications (3 unread)">
                <Bell className="size-4" aria-hidden="true" />
                <span
                  className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white"
                  aria-hidden="true"
                >
                  3
                </span>
              </Button>
            }
          />
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="flex items-center justify-between">
                <span>Notifications</span>
                <Badge variant="secondary">3 new</Badge>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {notifications.map((n) => (
                <DropdownMenuItem key={n.title} className="flex-col items-start gap-0.5 py-2" role="menuitem">
                  <span className="text-sm font-medium">{n.title}</span>
                  <span className="text-xs text-muted-foreground">{n.detail}</span>
                  <time className="text-[11px] text-muted-foreground" dateTime="">{n.time}</time>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem className="justify-center text-sm font-medium text-primary">
                <Check aria-hidden="true" /> Mark all as read
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

       {/* <ThemeToggle />*/}
       {/* <Separator orientation="vertical" className="mx-0.5 h-6" />*/}
        <UserMenu />
      </div>
    </header>
  );
}
