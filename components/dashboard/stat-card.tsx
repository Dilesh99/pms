import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  hint?: string;
  /** Tailwind text color class for the icon, e.g. "text-primary" */
  accent?: string;
}

export function StatCard({ label, value, icon: Icon, hint, accent = "text-primary" }: StatCardProps) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4">
        <span
          className={cn("flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10", accent)}
          aria-hidden="true"
        >
          <Icon className="size-5" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold tracking-tight">{value}</p>
          {hint && <p className="truncate text-xs text-muted-foreground">{hint}</p>}
        </div>
      </CardContent>
    </Card>
  );
}
