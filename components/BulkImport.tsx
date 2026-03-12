"use client";

import { useState } from "react";
import * as XLSX from "xlsx";
import type { Report } from "@/lib/storage";
import { withScore } from "@/lib/scoring";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast-provider";

type Props = {
  onImported: (reports: Report[], newAgents: string[]) => void;
};

type Summary = {
  imported: number;
  skipped: number;
  createdAgents: number;
};

export function BulkImport({ onImported }: Props) {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = async (file: File) => {
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data, { type: "array" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const json: any[] = XLSX.utils.sheet_to_json(sheet, { defval: "" });

    const imported: Report[] = [];
    const newAgentsSet = new Set<string>();
    let skipped = 0;

    for (const row of json) {
      const lower: Record<string, any> = {};
      for (const [k, v] of Object.entries(row)) {
        lower[k.toLowerCase()] = v;
      }

      const agent = String(
        lower["agent"] ?? lower["name"] ?? ""
      ).trim();
      const dateRaw = String(lower["date"] ?? "").trim();
      if (!agent || !dateRaw) {
        skipped++;
        continue;
      }
      const date = new Date(dateRaw);
      if (isNaN(date.getTime())) {
        skipped++;
        continue;
      }

      const makeNum = (key: string) =>
        Number(lower[key] ?? 0) || 0;

      const base = {
        id: crypto.randomUUID(),
        agent,
        date: date.toISOString().slice(0, 10),
        calls: makeNum("calls"),
        leads: makeNum("leads"),
        prospects: makeNum("prospects"),
        rsvp: makeNum("rsvp"),
        sales: makeNum("sales"),
        meetings: makeNum("meetings")
      };

      imported.push(withScore(base));
      newAgentsSet.add(agent);
    }

    const newAgents = Array.from(newAgentsSet);
    onImported(imported, newAgents);
    const summaryValue: Summary = {
      imported: imported.length,
      skipped,
      createdAgents: newAgents.length
    };
    setSummary(summaryValue);
    toast("Import complete", {
      description: `${summaryValue.imported} rows imported • ${summaryValue.createdAgents} new agents`
    });
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      void handleFiles(file);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) void handleFiles(file);
  };

  return (
    <Card className="hover-lift mt-4">
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <CardTitle className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-400">
          Bulk import (Excel / CSV)
        </CardTitle>
        <input
          type="file"
          accept=".xlsx,.xls,.csv"
          className="hidden"
          id="bulk-file"
          onChange={onFileChange}
        />
        <Button
          size="sm"
          variant="outline"
          onClick={() => document.getElementById("bulk-file")?.click()}
        >
          Choose file
        </Button>
      </CardHeader>
      <CardContent>
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            setIsDragging(false);
          }}
          onDrop={onDrop}
          className={`flex h-32 items-center justify-center rounded-lg border border-dashed ${
            isDragging
              ? "border-sky-400 bg-sky-500/10"
              : "border-slate-700 bg-slate-900/40"
          } text-xs text-slate-300`}
        >
          Drag & drop Excel or CSV here
        </div>
        <p className="mt-2 text-[11px] text-slate-400">
          Auto-detects columns like <span className="font-mono">agent</span>,{" "}
          <span className="font-mono">date</span>, <span className="font-mono">calls</span>,{" "}
          <span className="font-mono">leads</span>, <span className="font-mono">prospects</span>,{" "}
          <span className="font-mono">rsvp</span>, <span className="font-mono">sales</span>,{" "}
          <span className="font-mono">meetings</span>.
        </p>
        {summary && (
          <div className="mt-3 rounded-lg border border-slate-700 bg-slate-900/60 p-3 text-[11px] text-slate-300">
            <div>Imported rows: {summary.imported}</div>
            <div>Skipped rows: {summary.skipped}</div>
            <div>New agents created: {summary.createdAgents}</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

