"use client";

import { useMemo, useState } from "react";
import type { Report } from "@/lib/storage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/toast-provider";
import { getAgentBadges } from "@/lib/badges";

type Props = {
  agents: string[];
  reports: Report[];
  onAddAgent: (name: string) => boolean;
  onDeleteAgent: (name: string) => void;
};

export function AgentsTab({
  agents,
  reports,
  onAddAgent,
  onDeleteAgent
}: Props) {
  const [name, setName] = useState("");

  const summary = useMemo(() => {
    const byAgent: Record<
      string,
      { reports: number; leads: number; sales: number }
    > = {};
    for (const a of agents) {
      byAgent[a] = { reports: 0, leads: 0, sales: 0 };
    }
    for (const r of reports) {
      const entry = (byAgent[r.agent] ??= { reports: 0, leads: 0, sales: 0 });
      entry.reports += 1;
      entry.leads += r.leads;
      entry.sales += r.sales;
    }
    return byAgent;
  }, [agents, reports]);

  const handleAdd = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    const ok = onAddAgent(trimmed);
    if (ok) {
      toast("Agent added", {
        description: `${trimmed} is now tracked in the dashboard.`
      });
      setName("");
    } else {
      toast("Duplicate agent", {
        description: "An agent with that name already exists."
      });
    }
  };

  const requestDelete = (agent: string) => {
    if (
      window.confirm(
        `Delete ${agent} and all their reports? This cannot be undone.`
      )
    ) {
      onDeleteAgent(agent);
      toast("Agent deleted", {
        description: "The agent and all related reports have been removed."
      });
    }
  };

  return (
    <Card className="hover-lift">
      <CardHeader>
        <CardTitle className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-400">
          Manage agents
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Input
            placeholder="Add agent name…"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-9 max-w-xs"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAdd();
            }}
          />
          <Button size="sm" onClick={handleAdd}>
            Add Agent
          </Button>
        </div>

        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {agents.map((agent) => {
            const s = summary[agent] ?? {
              reports: 0,
              leads: 0,
              sales: 0
            };
            const badges = getAgentBadges(agent, reports);
            return (
              <div
                key={agent}
                className="glass-panel hover-lift flex items-center justify-between rounded-lg p-3"
              >
                <div className="flex items-center gap-3">
                  <Avatar name={agent} />
                  <div className="space-y-1">
                    <div className="text-xs font-semibold text-slate-100">
                      {agent}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {s.reports} reports • {s.leads} leads • {s.sales} sales
                    </div>
                    <div className="mt-0.5 flex flex-wrap gap-1">
                      {badges.map((b) => (
                        <Badge
                          key={b.id}
                          variant={
                            b.id === "top-closer" || b.id === "hot-streak"
                              ? "success"
                              : "default"
                          }
                        >
                          {b.label}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 px-2 text-[11px]"
                  onClick={() => requestDelete(agent)}
                >
                  Delete
                </Button>
              </div>
            );
          })}
          {agents.length === 0 && (
            <div className="text-xs text-slate-400">
              No agents yet. Add your first agent to begin tracking performance.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

