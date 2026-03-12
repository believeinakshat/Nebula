import * as React from "react";
import { cn } from "@/lib/utils";

export interface AvatarProps
  extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  size?: "sm" | "md" | "lg";
}

export const Avatar = ({
  name,
  size = "md",
  className,
  ...props
}: AvatarProps) => {
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const sizeClasses =
    size === "sm"
      ? "h-7 w-7 text-[10px]"
      : size === "lg"
      ? "h-12 w-12 text-sm"
      : "h-9 w-9 text-xs";

  return (
    <div
      className={cn(
        "inline-flex items-center justify-center rounded-full border border-sky-500/60 bg-slate-900/80 text-sky-200 shadow-glow-soft",
        sizeClasses,
        className
      )}
      {...props}
    >
      {initials}
    </div>
  );
};

