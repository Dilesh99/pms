import { HeartPulse } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { BRAND } from "@/lib/data";

interface LogoProps {
  href?: string;
  className?: string;
  /** Hide the wordmark and show only the icon */
  iconOnly?: boolean;
  labelClassName?: string;
}

export function Logo({ href = "/", className, iconOnly, labelClassName }: LogoProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-2 rounded-md font-semibold tracking-tight focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        className,
      )}
      aria-label={`${BRAND.full} home`}
    >
      <span
        className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm"
        aria-hidden="true"
      >
        <HeartPulse className="size-5" />
      </span>
      {!iconOnly && (
        <span className={cn("text-lg leading-none", labelClassName)}>
          {BRAND.name}
          <span className="text-primary">.</span>
        </span>
      )}
    </Link>
  );
}
