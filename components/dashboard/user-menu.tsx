"use client";

import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useSession } from "@/components/providers/session-provider";
import { ROLE_LABELS } from "@/lib/data";

export function UserMenu() {
  const { user, role } = useSession();

  if (!user || !role) return null;

  return (
    <Link
      href="/dashboard/profile"
      className="flex items-center gap-2 rounded-md px-1.5 py-1 transition-colors hover:bg-accent"
      aria-label="Go to profile"
    >
      <Avatar>
        <AvatarFallback className="bg-primary/10 font-medium text-primary">
          {user.avatarInitials}
        </AvatarFallback>
      </Avatar>
      <span className="hidden text-left leading-tight sm:block">
        <span className="block text-sm font-medium">{user.name}</span>
        <span className="block text-xs text-muted-foreground">{ROLE_LABELS[role]}</span>
      </span>
    </Link>
  );
}
