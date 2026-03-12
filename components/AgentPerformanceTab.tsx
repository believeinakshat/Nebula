"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import type { Report } from "@/lib/storage";
import { getAgentBadges } from "@/lib/badges";
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  Bar,
  XAxis,
  YAxis,
  Tooltip as ReTooltip,
  Legend,
  CartesianGrid
} from "recharts";

type Props = {
  reports: Report[];
};

const METRICS = [
  "calls",
  "leads",
  "prospects",
  "rsvp",
  "sales",
  "meetings"
] as const;

export function AgentPerformanceTab({ reports }: Props) {
  const [visible, setVisible] = useState<Record<(typeof METRICS)[number], boolean>>({
    calls: true,
    leads: true,
    prospects: true,
    rsvp: true,
    sales: true,
    meetings: true
  });

  const summary = useMemo(() => {
    const byAgent: Record<
      string,
      {
        calls: number;
        leads: number;
        prospects: number;
        rsvp: number;
        sales: number;
        meetings: number;
        score: number;
      }
    > = {};

    for (const r of reports) {
      if (!byAgent[r.agent]) {
        byAgent[r.agent] = {
          calls: 0,
          leads: 0,
          prospects: 0,
          rsvp: 0,
          sales: 0,
          meetings: 0,
          score: 0
        };
      }
      const s = byAgent[r.agent];
      s.calls += r.calls;
      s.leads += r.leads;
      s.prospects += r.prospects;
      s.rsvp += r.rsvp;
      s.sales += r.sales;
      s.meetings += r.meetings;
      s.score += r.score;
    }

    const rows = Object.entries(byAgent).map(([agent, m]) => ({
      agent,
      ...m
    }));
    rows.sort((a, b) => b.score - a.score);

    const top = rows[0]?.agent;
    const bottom = rows[rows.length - 1]?.agent;

    return { rows, top, bottom };
  }, [reports]);

  const chartData = useMemo(
    () =>
      summary.rows.map((row) => ({
        agent: row.agent,
        calls: row.calls,
        leads: row.leads,
        prospects: row.prospects,
        rsvp: row.rsvp,
        sales: row.sales,
        meetings: row.meetings
      })),
    [summary.rows]
  );

  return (
    <div className="space-y-4">
      <Card className="hover-lift">
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <CardTitle className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-400">
            Agent multi-metric comparison
          </CardTitle>
          <div className="flex flex-wrap gap-2 text-[11px]">
            {METRICS.map((m) => (
              <Button
                key={m}
                size="sm"
                variant={visible[m] ? "default" : "outline"}
                className="h-7 px-2 capitalize"
                onClick={() =>
                  setVisible((v) => ({
                    ...v,
                    [m]: !v[m]
                  }))
                }
              >
                {visible[m] ? "●" : "○"} {m}
              </Button>
            ))}
          </div>
        </CardHeader>
        <CardContent className="h-[360px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData}>
              <CartesianGrid stroke="#1f2937" strokeDasharray="3 3" />
              <XAxis dataKey="agent" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <ReTooltip
                contentStyle={{
                  background: "#020617",
                  border: "1px solid #1e293b",
                  borderRadius: 8
                }}
              />
              <Legend />
              {visible.calls && (
                <Line
                  type="monotone"
                  dataKey="calls"
                  stroke="#38bdf8"
                  strokeWidth={2}
                  dot={false}
                />
              )}
              {visible.leads && (
                <Line
                  type="monotone"
                  dataKey="leads"
                  stroke="#a855f7"
                  strokeWidth={2}
                  dot={false}
                />
              )}
              {visible.prospects && (
                <Area
                  type="monotone"
                  dataKey="prospects"
                  fill="#22c55e33"
                  stroke="#22c55e"
                />
              )}
              {visible.rsvp && (
                <Bar dataKey="rsvp" barSize={14} fill="#f97316" />
              )}
              {visible.sales && (
                <Bar dataKey="sales" barSize={14} fill="#eab308" />
              )}
              {visible.meetings && (
                <Bar dataKey="meetings" barSize={14} fill="#22c55e" />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="hover-lift">
        <CardHeader>
          <CardTitle className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-400">
            Agent summary
          </CardTitle>
        </CardHeader>
        <CardContent className="max-h-[360px] overflow-auto scroll-thin">
          <Table>
            <THead>
              <TR>
                <TH>Agent</TH>
                <TH>Calls</TH>
                <TH>Leads</TH>
                <TH>Prospects</TH>
                <TH>RSVP</TH>
                <TH>Sales</TH>
                <TH>Meetings</TH>
                <TH>Score</TH>
              </TR>
            </THead>
            <TBody>
              {summary.rows.map((row) => {
                const badges = getAgentBadges(row.agent, reports);
                const isTop = row.agent === summary.top;
                const isBottom = row.agent === summary.bottom;
                return (
                  <TR
                    key={row.agent}
                    className={
                      isTop
                        ? "bg-emerald-950/40"
                        : isBottom
                        ? "bg-red-950/30"
                        : ""
                    }
                  >
                    <TD className="flex items-center gap-2 py-2">
                      <Avatar name={row.agent} size="sm" />
                      <div>
                        <div className="text-xs font-medium text-slate-100">
                          {row.agent}
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
                    </TD>
                    <TD className="tabular-nums">{row.calls}</TD>
                    <TD className="tabular-nums">{row.leads}</TD>
                    <TD className="tabular-nums">{row.prospects}</TD>
                    <TD className="tabular-nums">{row.rsvp}</TD>
                    <TD className="tabular-nums">{row.sales}</TD>
                    <TD className="tabular-nums">{row.meetings}</TD>
                    <TD className="tabular-nums font-semibold text-sky-300">
                      {row.score}
                    </TD>
                  </TR>
                );
              })}
            </TBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

