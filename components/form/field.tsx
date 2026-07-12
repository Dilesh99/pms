"use client";

import { AlertCircle } from "lucide-react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export interface FieldRenderProps {
  id: string;
  "aria-invalid": boolean | undefined;
  "aria-describedby": string | undefined;
  "aria-required": boolean | undefined;
}

interface FieldProps {
  /** Unique field id / name */
  name: string;
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  className?: string;
  /** Render prop wiring accessibility attributes into the control */
  children: (props: FieldRenderProps) => React.ReactNode;
}

/**
 * Accessible field wrapper: associates a label, optional hint, and an
 * error message (announced via role="alert") with its control and wires up
 * `aria-invalid` / `aria-describedby` for screen readers.
 */
export function Field({ name, label, error, hint, required, className, children }: FieldProps) {
  const hintId = hint ? `${name}-hint` : undefined;
  const errorId = error ? `${name}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={cn("grid gap-1.5", className)}>
      <Label htmlFor={name}>
        {label}
        {required && (
          <span className="text-destructive" aria-hidden="true">
            *
          </span>
        )}
        {required && <span className="sr-only"> (required)</span>}
      </Label>

      {children({
        id: name,
        "aria-invalid": error ? true : undefined,
        "aria-describedby": describedBy,
        "aria-required": required || undefined,
      })}

      {hint && !error && (
        <p id={hintId} className="text-xs text-muted-foreground">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} role="alert" className="flex items-center gap-1 text-xs font-medium text-destructive">
          <AlertCircle className="size-3.5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
}
