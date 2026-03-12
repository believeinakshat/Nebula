"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import type { Report } from "@/lib/storage";
import { getAgentBadges } from "@/lib/badges";

type Props = {
  reports: Report[];
};

export function LeaderboardTab({ reports }: Props) {
  const leaderboard = useMemo(() => {
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

    const rows = Object.entries(byAgent).map(([agent, stats]) => ({
      agent,
      ...stats
    }));
    rows.sort((a, b) => b.score - a.score);
    return rows;
  }, [reports]);

  const top3 = leaderboard.slice(0, 3);

  return (
    <div className="grid gap-4 md:grid-cols-[minmax(0,1.2fr)_minmax(0,2fr)]">
      <Card className="hover-lift flex flex-col justify-between">
        <CardHeader>
          <CardTitle className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-400">
            Podium
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-1 items-end justify-center gap-4 pb-6">
          {top3.length === 0 && (
            <div className="text-xs text-slate-400">
              Add some reports to see the leaderboard.
            </div>
          )}
          {top3.map((entry, idx) => {
            const rank = idx + 1;
            const heights = { 1: "h-40", 2: "h-32", 3: "h-28" } as const;
            const colors = {
              1: "from-yellow-400/80 to-amber-600/80",
              2: "from-slate-300/80 to-slate-500/80",
              3: "from-amber-700/80 to-orange-600/80"
            } as const;
            const label = rank === 1 ? "Gold" : rank === 2 ? "Silver" : "Bronze";

            return (
              <div key={entry.agent} className="flex flex-col items-center gap-2">
                <Avatar name={entry.agent} size="lg" />
                <div
                  className={`relative w-28 rounded-t-xl bg-gradient-to-t ${colors[rank as 1 | 2 | 3]} ${heights[rank as 1 | 2 | 3]} shadow-glow-soft`}
                >
                  <div className="absolute inset-x-0 -top-5 flex flex-col items-center text-center text-xs">
                    <div className="rounded-full bg-slate-950/80 px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] text-slate-300">
                      {label}
                    </div>
                    <div className="mt-1 text-xs font-semibold text-slate-50">
                      {entry.agent}
                    </div>
                    <div className="text-[11px] text-slate-200/80">
                      Score {entry.score.toLocaleString()}
                    </div>
                  </div>
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-2xl font-black text-slate-950/80">
                    #{rank}
                  </div>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Card className="hover-lift">
        <CardHeader>
          <CardTitle className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-400">
            Full rankings
          </CardTitle>
        </CardHeader>
        <CardContent className="max-h-[420px] overflow-auto scroll-thin">
          <Table>
            <THead>
              <TR>
                <TH>Rank</TH>
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
              {leaderboard.slice(0, 20).map((row, idx) => {
                const rank = idx + 1;
                const glow =
                  rank === 1
                    ? "shadow-[0_0_30px_rgba(250,204,21,0.5)]"
                    : rank === 2
                    ? "shadow-[0_0_24px_rgba(148,163,184,0.5)]"
                    : rank === 3
                    ? "shadow-[0_0_24px_rgba(248,113,113,0.5)]"
                    : "";
                const badges = getAgentBadges(row.agent, reports);

                return (
                  <TR
                    key={row.agent}
                    className={rank <= 3 ? `bg-slate-900/70 ${glow}` : ""}
                  >
                    <TD className="tabular-nums font-semibold text-slate-100">
                      #{rank}
                    </TD>
                    <TD>
                      <div className="flex items-center gap-2">
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

