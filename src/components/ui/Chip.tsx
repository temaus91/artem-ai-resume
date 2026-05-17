import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type ChipVariant = "default" | "accent" | "success" | "warning" | "muted";

const variants: Record<ChipVariant, string> = {
  default: "border-border bg-card text-foreground",
  accent: "border-accent/35 bg-accent/10 text-accent",
  success: "border-success/30 bg-success-muted/70 text-success",
  warning: "border-warning/35 bg-warning-muted/70 text-warning",
  muted: "border-border bg-secondary text-muted-foreground",
};

interface ChipProps {
  children: ReactNode;
  className?: string;
  variant?: ChipVariant;
}

export function Chip({ children, className, variant = "default" }: ChipProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium",
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
