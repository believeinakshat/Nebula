"use client";

import * as XLSX from "xlsx";
import type { Report } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type Props = {
  reports: Report[];
};

function buildRows(reports: Report[]) {
  return reports.map((r) => ({
    Agent: r.agent,
    Date: r.date,
    Calls: r.calls,
    Leads: r.leads,
    Prospects: r.prospects,
    RSVP: r.rsvp,
    Sales: r.sales,
    Meetings: r.meetings,
    Score: r.score
  }));
}

export function ExportControls({ reports }: Props) {
  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(buildRows(reports));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Reports");
    XLSX.writeFile(wb, "real-estate-reports.xlsx");
  };

  const exportCsv = () => {
    const rows = buildRows(reports);
    if (!rows.length) return;
    const headers = Object.keys(rows[0]);
    const csv = [
      headers.join(","),
      ...rows.map((row) =>
        headers
          .map((h) => {
            const v = (row as any)[h] ?? "";
            const s = String(v).replace(/"/g, '""');
            return `"${s}"`;
          })
          .join(",")
      )
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "real-estate-reports.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="glass-panel flex items-center gap-2 rounded-lg border border-slate-700/70 bg-slate-950/80 px-3 py-2 text-xs">
      <div className="text-slate-300">Export</div>
      <Button
        size="sm"
        variant="outline"
        className="h-7 px-2 text-[11px]"
        onClick={exportExcel}
      >
        Export Excel
      </Button>
      <Button
        size="sm"
        variant="outline"
        className="h-7 px-2 text-[11px]"
        onClick={exportCsv}
      >
        Export CSV
      </Button>
    </Card>
  );
}

