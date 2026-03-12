import * as React from "react";
import { cn } from "@/lib/utils";

export interface TabsProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
}

export function Tabs({ value, onValueChange, children }: TabsProps) {
  return (
    <div data-value={value} className="w-full">
      {React.Children.map(children, (child: any) => {
        if (!React.isValidElement(child)) return child;
        if (child.type === TabsList) {
          return React.cloneElement(child as any, { value, onValueChange });
        }
        if (child.type === TabsContent) {
          return value === (child as any).props.value ? child : null;
        }
        return child;
      })}
    </div>
  );
}

export const TabsList = ({
  className,
  value,
  onValueChange,
  children
}: React.HTMLAttributes<HTMLDivElement> & {
  value?: string;
  onValueChange?: (value: string) => void;
}) => {
  return (
    <div
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-lg bg-slate-900/80 p-1 text-muted-foreground",
        className
      )}
    >
      {React.Children.map(children, (child: any) => {
        if (!React.isValidElement(child)) return child;
        
        const childProps = (child as any).props;
        const selected = childProps.value === value;
        
        return React.cloneElement(child as any, {
          selected,
          onSelect: () => onValueChange?.(childProps.value)
        });
      })}
    </div>
  );
};

export const TabsTrigger = ({
  className,
  selected,
  onSelect,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  selected?: boolean;
  onSelect?: () => void;
}) => {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-xs font-medium transition-all",
        selected
          ? "bg-slate-800 text-sky-300 shadow-glow"
          : "text-muted-foreground hover:bg-slate-800/70 hover:text-sky-200",
        className
      )}
      onClick={onSelect}
      {...props}
    />
  );
};

export const TabsContent = ({
  className,
  value,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { value: string }) => {
  return (
    <div
      data-value={value}
      className={cn("mt-6 animate-in fade-in-50", className)}
      {...props}
    />
  );
};