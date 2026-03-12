"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { BarChart3, Users, Trophy, Flame, Table2, Settings2, PlusSquare } from "lucide-react";

const tabs = [
  { id: "dashboard", label: "Dashboard", icon: BarChart3 },
  { id: "agent-performance", label: "Agent Performance", icon: Users },
  { id: "leaderboard", label: "Leaderboard", icon: Trophy },
  { id: "streaks", label: "Streaks", icon: Flame },
  { id: "reports", label: "Reports Table", icon: Table2 },
  { id: "agents", label: "Manage Agents", icon: Settings2 },
  { id: "add-report", label: "Add / Edit Report", icon: PlusSquare }
] as const;

export type TabId = (typeof tabs)[number]["id"];

export function Sidebar({
  active,
  onChange
}: {
  active: TabId;
  onChange: (tab: TabId) => void;
}) {
  return (
    <aside className="glass-panel hover-lift flex h-full flex-col justify-between rounded-xl p-4">
      <div>
        <div className="mb-6 flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-500 shadow-glow" />
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-400">
              Nebula
            </div>
            <div className="text-sm font-semibold text-slate-100">
              Real Estate Ops
            </div>
          </div>
        </div>

        <nav className="space-y-1 text-xs">
          {tabs.map(({ id, label, icon: Icon }) => {
            const selected = id === active;
            return (
              <Button
                key={id}
                variant={selected ? "default" : "ghost"}
                size="sm"
                className={cn(
                  "group flex w-full items-center justify-start gap-2 rounded-lg px-2.5 py-2 text-xs",
                  selected && "bg-sky-500/20 text-sky-100 shadow-glow"
                )}
                onClick={() => onChange(id)}
              >
                <Icon
                  className={cn(
                    "h-4 w-4 text-sky-400 transition-colors group-hover:text-sky-300",
                    selected && "text-sky-200"
                  )}
                />
                <span>{label}</span>
              </Button>
            );
          })}
        </nav>
      </div>

      <div className="mt-6 rounded-lg border border-sky-900/60 bg-gradient-to-br from-slate-950/90 to-slate-900/70 p-3 text-[11px] text-slate-300">
        <div className="mb-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-sky-400">
          AI insights
        </div>
        <p className="text-xs text-slate-300/90">
          Use Claude to generate weekly performance briefings for your sales meeting.
        </p>
      </div>
    </aside>
  );
}

