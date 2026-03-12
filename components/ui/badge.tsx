import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "outline" | "success" | "warning";
}

export const Badge = ({
  className,
  variant = "default",
  ...props
}: BadgeProps) => {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
        variant === "default" &&
          "border-sky-500/60 bg-sky-500/15 text-sky-200",
        variant === "outline" &&
          "border-slate-600 bg-transparent text-slate-200",
        variant === "success" &&
          "border-emerald-500/70 bg-emerald-500/15 text-emerald-200",
        variant === "warning" &&
          "border-amber-500/70 bg-amber-500/15 text-amber-100",
        className
      )}
      {...props}
    />
  );
};

