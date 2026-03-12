import * as React from "react";
import { cn } from "@/lib/utils";

export const Table = ({
  className,
  ...props
}: React.TableHTMLAttributes<HTMLTableElement>) => (
  <table
    className={cn(
      "w-full border-collapse text-sm text-left text-muted-foreground",
      className
    )}
    {...props}
  />
);

export const THead = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <thead
    className={cn("bg-slate-900/80 text-xs uppercase tracking-wide", className)}
    {...props}
  />
);

export const TBody = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <tbody className={cn("divide-y divide-slate-800/80", className)} {...props} />
);

export const TR = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableRowElement>) => (
  <tr
    className={cn(
      "hover:bg-slate-900/80 transition-colors cursor-default",
      className
    )}
    {...props}
  />
);

export const TH = ({
  className,
  ...props
}: React.ThHTMLAttributes<HTMLTableCellElement>) => (
  <th
    className={cn(
      "px-3 py-2 font-medium text-xs text-slate-300 whitespace-nowrap",
      className
    )}
    {...props}
  />
);

export const TD = ({
  className,
  ...props
}: React.TdHTMLAttributes<HTMLTableCellElement>) => (
  <td className={cn("px-3 py-2 align-middle", className)} {...props} />
);

