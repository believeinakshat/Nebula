"use client";

import { useMemo } from "react";
import type { Report } from "@/lib/storage";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";

type Props = {
  reports: Report[];
};

type StreakStats = {
  agent: string;
  leadStreak: number;
  salesStreak: number;
  bestLeadStreak: number;
  bestSalesStreak: number;
};

export function StreaksTab({ reports }: Props) {
  const streaks = useMemo<StreakStats[]>(() => {
    const byAgent: Record<string, Report[]> = {};
    for (const r of reports) {
      (byAgent[r.agent] ||= []).push(r);
    }

    const stats: StreakStats[] = [];

    for (const [agent, list] of Object.entries(byAgent)) {
      const sorted = [...list].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );

      let leadStreak = 0;
      let salesStreak = 0;
      let bestLeadStreak = 0;
      let bestSalesStreak = 0;

      for (const r of sorted) {
        if (r.leads > 0) {
          leadStreak += 1;
          bestLeadStreak = Math.max(bestLeadStreak, leadStreak);
        } else {
          leadStreak = 0;
        }
        if (r.sales > 0) {
          salesStreak += 1;
          bestSalesStreak = Math.max(bestSalesStreak, salesStreak);
        } else {
          salesStreak = 0;
        }
      }

      stats.push({
        agent,
        leadStreak,
        salesStreak,
        bestLeadStreak,
        bestSalesStreak
      });
    }

    stats.sort(
      (a, b) =>
        b.leadStreak +
        b.salesStreak +
        b.bestLeadStreak +
        b.bestSalesStreak -
        (a.leadStreak + a.salesStreak + a.bestLeadStreak + a.bestSalesStreak)
    );

    return stats;
  }, [reports]);

  return (
    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
      {streaks.map((s) => {
        const score =
          s.leadStreak + s.salesStreak + s.bestLeadStreak + s.bestSalesStreak;
        const showFire = s.leadStreak >= 5 || s.salesStreak >= 5;

        return (
          <Card key={s.agent} className="hover-lift">
            <CardContent className="flex items-center gap-4 p-4">
              <Avatar name={s.agent} />
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="font-semibold text-slate-100">{s.agent}</div>
                  <div className="text-[11px] text-sky-300">
                    Streak score {score}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
                  <div>
                    <div className="flex items-center justify-between">
                      <span>Lead streak</span>
                      <span className="tabular-nums">{s.leadStreak}</span>
                    </div>
                    <div className="mt-1 h-1.5 w-full rounded-full bg-slate-900/80">
                      <div
                        className="h-full rounded-full bg-sky-500"
                        style={{
                          width: `${Math.min(100, (s.leadStreak / 10) * 100)}%`
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <span>Sales streak</span>
                      <span className="tabular-nums">{s.salesStreak}</span>
                    </div>
                    <div className="mt-1 h-1.5 w-full rounded-full bg-slate-900/80">
                      <div
                        className="h-full rounded-full bg-amber-400"
                        style={{
                          width: `${Math.min(100, (s.salesStreak / 10) * 100)}%`
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <span>Best lead streak</span>
                      <span className="tabular-nums">{s.bestLeadStreak}</span>
                    </div>
                    <div className="mt-1 h-1.5 w-full rounded-full bg-slate-900/80">
                      <div
                        className="h-full rounded-full bg-emerald-400"
                        style={{
                          width: `${Math.min(
                            100,
                            (s.bestLeadStreak / 10) * 100
                          )}%`
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <span>Best sales streak</span>
                      <span className="tabular-nums">{s.bestSalesStreak}</span>
                    </div>
                    <div className="mt-1 h-1.5 w-full rounded-full bg-slate-900/80">
                      <div
                        className="h-full rounded-full bg-pink-400"
                        style={{
                          width: `${Math.min(
                            100,
                            (s.bestSalesStreak / 10) * 100
                          )}%`
                        }}
                      />
                    </div>
                  </div>
                </div>
                {showFire && (
                  <div className="mt-1 text-[13px]">
                    <span className="mr-1">🔥</span>
                    <span className="text-amber-200">On fire</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
      {streaks.length === 0 && (
        <div className="text-xs text-slate-400">
          Add some reports to see streak analytics.
        </div>
      )}
    </div>
  );
}

