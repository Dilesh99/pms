import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type Tone = "success" | "warning" | "danger" | "info" | "neutral";

const toneClasses: Record<Tone, string> = {
  success:
    "border-green-600/30 bg-green-600/10 text-green-800 dark:border-green-400/30 dark:bg-green-400/10 dark:text-green-300",
  warning:
    "border-amber-600/30 bg-amber-500/10 text-amber-800 dark:border-amber-400/30 dark:bg-amber-400/10 dark:text-amber-300",
  danger:
    "border-red-600/30 bg-red-600/10 text-red-800 dark:border-red-400/30 dark:bg-red-400/10 dark:text-red-300",
  info: "border-blue-600/30 bg-blue-600/10 text-blue-800 dark:border-blue-400/30 dark:bg-blue-400/10 dark:text-blue-300",
  neutral:
    "border-border bg-muted text-muted-foreground dark:bg-muted/60",
};

interface StatusBadgeProps {
  tone: Tone;
  children: React.ReactNode;
  className?: string;
}

export function StatusBadge({ tone, children, className }: StatusBadgeProps) {
  return (
    <Badge variant="outline" className={cn("gap-1", toneClasses[tone], className)}>
      {children}
    </Badge>
  );
}
