"use client";

import { useMemo, useState } from "react";
import type { Report } from "@/lib/storage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { toast } from "@/components/ui/toast-provider";

type Props = {
  reports: Report[];
  onEdit: (report: Report) => void;
  onDelete: (id: string) => void;
};

type SortKey = keyof Pick<
  Report,
  "agent" | "date" | "calls" | "leads" | "prospects" | "rsvp" | "sales" | "meetings" | "score"
>;

export function ReportsTableTab({ reports, onEdit, onDelete }: Props) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const pageSize = 10;

  const filtered = useMemo(() => {
    let next = reports;
    if (search.trim()) {
      const term = search.toLowerCase();
      next = next.filter((r) => r.agent.toLowerCase().includes(term));
    }

    next = [...next].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (typeof av === "string" && typeof bv === "string") {
        return sortDir === "asc"
          ? av.localeCompare(bv)
          : bv.localeCompare(av);
      }
      return sortDir === "asc"
        ? (av as number) - (bv as number)
        : (bv as number) - (av as number);
    });

    return next;
  }, [reports, search, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages - 1);
  const pageData = filtered.slice(
    currentPage * pageSize,
    currentPage * pageSize + pageSize
  );

  const requestDelete = (id: string) => {
    if (window.confirm("Delete this report? This cannot be undone.")) {
      onDelete(id);
      toast("Report deleted", {
        description: "The report has been removed from the dataset."
      });
    }
  };

  const handleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const sortIcon = (key: SortKey) =>
    sortKey === key ? (sortDir === "asc" ? "▲" : "▼") : "⇅";

  return (
    <Card className="hover-lift">
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <CardTitle className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-400">
          Reports table
        </CardTitle>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search by agent…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
            className="h-9 w-52"
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="max-h-[420px] overflow-auto scroll-thin">
          <Table>
            <THead>
              <TR>
                <TH onClick={() => handleSort("agent")} className="cursor-pointer">
                  Agent {sortIcon("agent")}
                </TH>
                <TH onClick={() => handleSort("date")} className="cursor-pointer">
                  Date {sortIcon("date")}
                </TH>
                <TH onClick={() => handleSort("calls")} className="cursor-pointer">
                  Calls {sortIcon("calls")}
                </TH>
                <TH onClick={() => handleSort("leads")} className="cursor-pointer">
                  Leads {sortIcon("leads")}
                </TH>
                <TH
                  onClick={() => handleSort("prospects")}
                  className="cursor-pointer"
                >
                  Prospects {sortIcon("prospects")}
                </TH>
                <TH onClick={() => handleSort("rsvp")} className="cursor-pointer">
                  RSVP {sortIcon("rsvp")}
                </TH>
                <TH onClick={() => handleSort("sales")} className="cursor-pointer">
                  Sales {sortIcon("sales")}
                </TH>
                <TH
                  onClick={() => handleSort("meetings")}
                  className="cursor-pointer"
                >
                  Meetings {sortIcon("meetings")}
                </TH>
                <TH onClick={() => handleSort("score")} className="cursor-pointer">
                  Score {sortIcon("score")}
                </TH>
                <TH>Actions</TH>
              </TR>
            </THead>
            <TBody>
              {pageData.map((r) => (
                <TR key={r.id}>
                  <TD className="text-xs text-slate-100">{r.agent}</TD>
                  <TD className="text-xs text-slate-300">
                    {new Date(r.date).toLocaleDateString()}
                  </TD>
                  <TD className="tabular-nums">{r.calls}</TD>
                  <TD className="tabular-nums">{r.leads}</TD>
                  <TD className="tabular-nums">{r.prospects}</TD>
                  <TD className="tabular-nums">{r.rsvp}</TD>
                  <TD className="tabular-nums">{r.sales}</TD>
                  <TD className="tabular-nums">{r.meetings}</TD>
                  <TD className="tabular-nums font-semibold text-sky-300">
                    {r.score}
                  </TD>
                  <TD className="space-x-1">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 px-2 text-[11px]"
                      onClick={() => onEdit(r)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="h-7 px-2 text-[11px]"
                      onClick={() => requestDelete(r.id)}
                    >
                      Delete
                    </Button>
                  </TD>
                </TR>
              ))}
              {pageData.length === 0 && (
                <TR>
                  <TD colSpan={10} className="py-6 text-center text-xs text-slate-400">
                    No reports found.
                  </TD>
                </TR>
              )}
            </TBody>
          </Table>
        </div>

        <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
          <div>
            Page {currentPage + 1} of {totalPages} • {filtered.length} reports
          </div>
          <div className="space-x-1">
            <Button
              size="sm"
              variant="outline"
              disabled={currentPage === 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
            >
              Previous
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={currentPage >= totalPages - 1}
              onClick={() =>
                setPage((p) => Math.min(totalPages - 1, p + 1))
              }
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

