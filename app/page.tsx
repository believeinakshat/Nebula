"use client";

import { useEffect, useMemo, useState } from "react";
import { Sidebar, type TabId } from "@/components/Sidebar";
import { KPICard } from "@/components/KPICard";
import { ConversionFunnel } from "@/components/ConversionFunnel";
import { TimeSeriesSection, type TimeSeriesPoint } from "@/components/TimeSeriesSection";
import { AgentPerformanceTab } from "@/components/AgentPerformanceTab";
import { LeaderboardTab } from "@/components/LeaderboardTab";
import { StreaksTab } from "@/components/StreaksTab";
import { ReportsTableTab } from "@/components/ReportsTableTab";
import { AgentsTab } from "@/components/AgentsTab";
import { ReportFormTab } from "@/components/ReportFormTab";
import { BulkImport } from "@/components/BulkImport";
import { AiManagerReport } from "@/components/AiManagerReport";
import { ExportControls } from "@/components/ExportControls";
import { Toaster } from "@/components/ui/toast-provider";
import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { getAgents, getReports, saveAgents, saveReports, type Report } from "@/lib/storage";

type DateFilter = "today" | "7" | "30" | "month" | "custom";

function filterByDate(reports: Report[], filter: DateFilter, custom: { start?: string; end?: string }) {
  if (!reports.length) return reports;
  const today = new Date();
  let start: Date | null = null;
  let end: Date | null = null;

  if (filter === "today") {
    start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    end = new Date(start);
    end.setDate(end.getDate() + 1);
  } else if (filter === "7") {
    start = new Date(today);
    start.setDate(today.getDate() - 6);
  } else if (filter === "30") {
    start = new Date(today);
    start.setDate(today.getDate() - 29);
  } else if (filter === "month") {
    start = new Date(today.getFullYear(), today.getMonth(), 1);
  } else if (filter === "custom" && custom.start && custom.end) {
    start = new Date(custom.start);
    end = new Date(custom.end);
    end.setDate(end.getDate() + 1);
  }

  if (!start) return reports;
  return reports.filter((r) => {
    const d = new Date(r.date);
    if (end) {
      return d >= start! && d < end;
    }
    return d >= start!;
  });
}

function buildTimeSeries(reports: Report[]): {
  daily: TimeSeriesPoint[];
  weekly: TimeSeriesPoint[];
  monthly: TimeSeriesPoint[];
} {
  const byDay = new Map<string, TimeSeriesPoint>();
  for (const r of reports) {
    const key = r.date.slice(0, 10);
    const existing =
      byDay.get(key) ??
      ({
        label: key,
        calls: 0,
        leads: 0,
        prospects: 0,
        rsvp: 0,
        sales: 0,
        meetings: 0
      } as TimeSeriesPoint);
    existing.calls += r.calls;
    existing.leads += r.leads;
    existing.prospects += r.prospects;
    existing.rsvp += r.rsvp;
    existing.sales += r.sales;
    existing.meetings += r.meetings;
    byDay.set(key, existing);
  }
  const daily = Array.from(byDay.values()).sort((a, b) =>
    a.label.localeCompare(b.label)
  );

  const toWeekKey = (iso: string) => {
    const d = new Date(iso);
    const year = d.getFullYear();
    const oneJan = new Date(d.getFullYear(), 0, 1);
    const week = Math.ceil(
      ((d.getTime() - oneJan.getTime()) / 86400000 + oneJan.getDay() + 1) / 7
    );
    return `${year}-W${week.toString().padStart(2, "0")}`;
  };

  const weeklyMap = new Map<string, TimeSeriesPoint>();
  for (const d of daily) {
    const key = toWeekKey(d.label);
    const existing =
      weeklyMap.get(key) ??
      ({
        label: key,
        calls: 0,
        leads: 0,
        prospects: 0,
        rsvp: 0,
        sales: 0,
        meetings: 0
      } as TimeSeriesPoint);
    existing.calls += d.calls;
    existing.leads += d.leads;
    existing.prospects += d.prospects;
    existing.rsvp += d.rsvp;
    existing.sales += d.sales;
    existing.meetings += d.meetings;
    weeklyMap.set(key, existing);
  }
  const weekly = Array.from(weeklyMap.values()).sort((a, b) =>
    a.label.localeCompare(b.label)
  );

  const monthlyMap = new Map<string, TimeSeriesPoint>();
  for (const d of daily) {
    const month = d.label.slice(0, 7);
    const existing =
      monthlyMap.get(month) ??
      ({
        label: month,
        calls: 0,
        leads: 0,
        prospects: 0,
        rsvp: 0,
        sales: 0,
        meetings: 0
      } as TimeSeriesPoint);
    existing.calls += d.calls;
    existing.leads += d.leads;
    existing.prospects += d.prospects;
    existing.rsvp += d.rsvp;
    existing.sales += d.sales;
    existing.meetings += d.meetings;
    monthlyMap.set(month, existing);
  }
  const monthly = Array.from(monthlyMap.values()).sort((a, b) =>
    a.label.localeCompare(b.label)
  );

  return { daily, weekly, monthly };
}

export default function Page() {
  const [tab, setTab] = useState<TabId>("dashboard");
  const [agents, setAgents] = useState<string[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [dateFilter, setDateFilter] = useState<DateFilter>("30");
  const [agentFilter, setAgentFilter] = useState<string>("all");
  const [customRange, setCustomRange] = useState<{ start?: string; end?: string }>({});
  const [editing, setEditing] = useState<Report | null>(null);

  useEffect(() => {
    const initialAgents = getAgents();
    const initialReports = getReports();
    setAgents(initialAgents);
    setReports(initialReports);
  }, []);

  const filteredReports = useMemo(() => {
    let base = filterByDate(reports, dateFilter, customRange);
    if (agentFilter !== "all") {
      base = base.filter((r) => r.agent === agentFilter);
    }
    return base;
  }, [reports, dateFilter, customRange, agentFilter]);

  const totals = useMemo(() => {
    return filteredReports.reduce(
      (acc, r) => {
        acc.calls += r.calls;
        acc.leads += r.leads;
        acc.prospects += r.prospects;
        acc.rsvp += r.rsvp;
        acc.sales += r.sales;
        acc.meetings += r.meetings;
        return acc;
      },
      {
        calls: 0,
        leads: 0,
        prospects: 0,
        rsvp: 0,
        sales: 0,
        meetings: 0
      }
    );
  }, [filteredReports]);

  const funnel = useMemo(() => {
    const leadToProspect =
      totals.leads === 0 ? 0 : (totals.prospects / totals.leads) * 100;
    const prospectToRsvp =
      totals.prospects === 0 ? 0 : (totals.rsvp / totals.prospects) * 100;
    const rsvpToSale =
      totals.rsvp === 0 ? 0 : (totals.sales / totals.rsvp) * 100;
    return { leadToProspect, prospectToRsvp, rsvpToSale };
  }, [totals]);

  const kpiSeries = useMemo(() => {
    const points = filteredReports.slice(-16);
    const toSpark = (map: (r: Report) => number) =>
      points.map((r) => ({ value: map(r) || 0 }));
    return {
      calls: toSpark((r) => r.calls),
      leads: toSpark((r) => r.leads),
      prospects: toSpark((r) => r.prospects),
      rsvp: toSpark((r) => r.rsvp),
      sales: toSpark((r) => r.sales),
      meetings: toSpark((r) => r.meetings)
    };
  }, [filteredReports]);

  const timeSeries = useMemo(
    () => buildTimeSeries(filteredReports),
    [filteredReports]
  );

  const handleSaveReport = (report: Report) => {
    setReports((prev) => {
      const existingIdx = prev.findIndex((r) => r.id === report.id);
      const next =
        existingIdx === -1
          ? [...prev, report]
          : prev.map((r) => (r.id === report.id ? report : r));
      saveReports(next);
      return next;
    });
    if (!agents.includes(report.agent)) {
      const nextAgents = [...agents, report.agent];
      setAgents(nextAgents);
      saveAgents(nextAgents);
    }
    setEditing(null);
  };

  const handleDeleteReport = (id: string) => {
    setReports((prev) => {
      const next = prev.filter((r) => r.id !== id);
      saveReports(next);
      return next;
    });
  };

  const handleAddAgent = (name: string) => {
    if (agents.some((a) => a.toLowerCase() === name.toLowerCase())) {
      return false;
    }
    const next = [...agents, name];
    setAgents(next);
    saveAgents(next);
    return true;
  };

  const handleDeleteAgent = (name: string) => {
    setAgents((prev) => {
      const next = prev.filter((a) => a !== name);
      saveAgents(next);
      return next;
    });
    setReports((prev) => {
      const next = prev.filter((r) => r.agent !== name);
      saveReports(next);
      return next;
    });
  };

  const handleImported = (rows: Report[], newAgents: string[]) => {
    setReports((prev) => {
      const next = [...prev, ...rows];
      saveReports(next);
      return next;
    });
    if (newAgents.length) {
      setAgents((prev) => {
        const set = new Set(prev);
        for (const a of newAgents) set.add(a);
        const list = Array.from(set);
        saveAgents(list);
        return list;
      });
    }
  };

  const dashboardContent = (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-400">
            Real estate sales control room
          </div>
          <div className="text-sm text-slate-300">
            Monitor calls → closings, streaks, and AI insights in one view.
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <Select
            value={dateFilter}
            onChange={(e) =>
              setDateFilter(e.target.value as DateFilter)
            }
            className="h-8 w-40"
          >
            <option value="today">Today</option>
            <option value="7">Last 7 Days</option>
            <option value="30">Last 30 Days</option>
            <option value="month">This Month</option>
            <option value="custom">Custom Range</option>
          </Select>
          {dateFilter === "custom" && (
            <>
              <Input
                type="date"
                className="h-8 w-32"
                value={customRange.start ?? ""}
                onChange={(e) =>
                  setCustomRange((c) => ({ ...c, start: e.target.value }))
                }
              />
              <Input
                type="date"
                className="h-8 w-32"
                value={customRange.end ?? ""}
                onChange={(e) =>
                  setCustomRange((c) => ({ ...c, end: e.target.value }))
                }
              />
            </>
          )}
          <Select
            value={agentFilter}
            onChange={(e) => setAgentFilter(e.target.value)}
            className="h-8 w-40"
          >
            <option value="all">All agents</option>
            {agents.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-6">
        <KPICard
          label="Total Calls"
          value={totals.calls}
          color="#38bdf8"
          data={kpiSeries.calls}
        />
        <KPICard
          label="Leads"
          value={totals.leads}
          color="#a855f7"
          data={kpiSeries.leads}
        />
        <KPICard
          label="Prospects"
          value={totals.prospects}
          color="#22c55e"
          data={kpiSeries.prospects}
        />
        <KPICard
          label="RSVP"
          value={totals.rsvp}
          color="#f97316"
          data={kpiSeries.rsvp}
        />
        <KPICard
          label="Sales"
          value={totals.sales}
          color="#eab308"
          data={kpiSeries.sales}
        />
        <KPICard
          label="Meetings"
          value={totals.meetings}
          color="#4ade80"
          data={kpiSeries.meetings}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-[minmax(0,2.4fr)_minmax(0,1.2fr)]">
        <TimeSeriesSection
          dataDaily={timeSeries.daily}
          dataWeekly={timeSeries.weekly}
          dataMonthly={timeSeries.monthly}
        />
        <ConversionFunnel
          leadToProspect={funnel.leadToProspect}
          prospectToRsvp={funnel.prospectToRsvp}
          rsvpToSale={funnel.rsvpToSale}
        />
      </div>

      <AiManagerReport reports={filteredReports} />
    </div>
  );

  return (
    <main className="flex min-h-screen flex-col">
      <Toaster richColors theme="dark" />
      <div className="flex flex-1 flex-col p-4 md:p-6">
        <div className="mx-auto flex w-full max-w-7xl flex-1 gap-4">
          <div className="hidden w-60 md:block">
            <Sidebar active={tab} onChange={setTab} />
          </div>
          <div className="flex-1 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 md:hidden">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-400">
                Nebula • Real Estate Ops
              </div>
              <Select
                value={tab}
                onChange={(e) => setTab(e.target.value as TabId)}
                className="h-8 w-48"
              >
                <option value="dashboard">Dashboard</option>
                <option value="agent-performance">Agent Performance</option>
                <option value="leaderboard">Leaderboard</option>
                <option value="streaks">Streaks</option>
                <option value="reports">Reports Table</option>
                <option value="agents">Manage Agents</option>
                <option value="add-report">Add / Edit Report</option>
              </Select>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <Card className="glass-panel flex items-center gap-3 rounded-lg border border-slate-700/70 bg-slate-950/80 px-4 py-2 text-xs text-slate-300">
                <div className="text-[11px] uppercase tracking-[0.2em] text-sky-400">
                  Sales telemetry
                </div>
                <div>
                  {reports.length === 0
                    ? "No reports yet • import or add your first report to begin."
                    : `${reports.length} reports • ${agents.length} agents tracked`}
                </div>
              </Card>
              <ExportControls reports={filteredReports} />
            </div>

            {tab === "dashboard" && dashboardContent}
            {tab === "agent-performance" && (
              <AgentPerformanceTab reports={filteredReports} />
            )}
            {tab === "leaderboard" && (
              <LeaderboardTab reports={filteredReports} />
            )}
            {tab === "streaks" && <StreaksTab reports={filteredReports} />}
            {tab === "reports" && (
              <ReportsTableTab
                reports={filteredReports}
                onEdit={(r) => {
                  setEditing(r);
                  setTab("add-report");
                }}
                onDelete={handleDeleteReport}
              />
            )}
            {tab === "agents" && (
              <AgentsTab
                agents={agents}
                reports={filteredReports}
                onAddAgent={handleAddAgent}
                onDeleteAgent={handleDeleteAgent}
              />
            )}
            {tab === "add-report" && (
              <>
                <ReportFormTab
                  agents={agents}
                  onSave={handleSaveReport}
                  editing={editing ?? undefined}
                  clearEditing={() => setEditing(null)}
                />
                <BulkImport onImported={handleImported} />
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

