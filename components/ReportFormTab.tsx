"use client";

import { useEffect, useMemo, useState } from "react";
import type { Report } from "@/lib/storage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { computeScore } from "@/lib/scoring";
import { toast } from "@/components/ui/toast-provider";
import confetti from "canvas-confetti";

type Props = {
  agents: string[];
  onSave: (report: Report) => void;
  editing?: Report | null;
  clearEditing: () => void;
};

type FormState = {
  agent: string;
  date: string;
  calls: number;
  leads: number;
  prospects: number;
  rsvp: number;
  sales: number;
  meetings: number;
};

const empty: FormState = {
  agent: "",
  date: new Date().toISOString().slice(0, 10),
  calls: 0,
  leads: 0,
  prospects: 0,
  rsvp: 0,
  sales: 0,
  meetings: 0
};

export function ReportFormTab({
  agents,
  onSave,
  editing,
  clearEditing
}: Props) {
  const [state, setState] = useState<FormState>(empty);
  const [lastSales, setLastSales] = useState(0);

  useEffect(() => {
    if (editing) {
      setState({
        agent: editing.agent,
        date: editing.date.slice(0, 10),
        calls: editing.calls,
        leads: editing.leads,
        prospects: editing.prospects,
        rsvp: editing.rsvp,
        sales: editing.sales,
        meetings: editing.meetings
      });
      setLastSales(editing.sales);
    } else {
      setState(empty);
      setLastSales(0);
    }
  }, [editing]);

  const score = useMemo(
    () =>
      computeScore({
        agent: state.agent,
        date: state.date,
        calls: state.calls,
        leads: state.leads,
        prospects: state.prospects,
        rsvp: state.rsvp,
        meetings: state.meetings,
        sales: state.sales
      }),
    [state]
  );

  const handleNumber = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value || "0");
    setState((s) => ({ ...s, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!state.agent || !state.date) {
      toast("Missing fields", {
        description: "Please select an agent and date."
      });
      return;
    }

    const id = editing?.id ?? crypto.randomUUID();
    const report: Report = {
      id,
      agent: state.agent,
      date: state.date,
      calls: state.calls,
      leads: state.leads,
      prospects: state.prospects,
      rsvp: state.rsvp,
      sales: state.sales,
      meetings: state.meetings,
      score
    };

    onSave(report);

    if (state.sales > 0 && lastSales === 0) {
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 }
      });
    }

    toast(editing ? "Report updated" : "Report added", {
      description: "Performance report has been saved."
    });

    if (!editing) {
      setState((s) => ({ ...empty, agent: s.agent }));
      setLastSales(0);
    }
  };

  return (
    <Card className="hover-lift">
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <CardTitle className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-400">
          {editing ? "Edit report" : "Add report"}
        </CardTitle>
        <div className="rounded-lg border border-sky-500/40 bg-sky-500/10 px-3 py-1 text-xs text-sky-200">
          Live score:{" "}
          <span className="font-semibold text-sky-300 tabular-nums">
            {score}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit}
          className="grid gap-4 md:grid-cols-3 lg:grid-cols-4"
        >
          <div className="space-y-1 text-xs">
            <div className="text-slate-300">Agent</div>
            <Select
              value={state.agent}
              onChange={(e) =>
                setState((s) => ({ ...s, agent: e.target.value }))
              }
            >
              <option value="">Select agent…</option>
              {agents.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </Select>
          </div>

          <div className="space-y-1 text-xs">
            <div className="text-slate-300">Date</div>
            <Input
              type="date"
              value={state.date}
              onChange={(e) =>
                setState((s) => ({ ...s, date: e.target.value }))
              }
            />
          </div>

          {(["calls", "leads", "prospects", "rsvp", "sales", "meetings"] as const).map(
            (field) => (
              <div key={field} className="space-y-1 text-xs">
                <div className="capitalize text-slate-300">{field}</div>
                <Input
                  type="number"
                  min={0}
                  value={state[field]}
                  onChange={handleNumber(field)}
                />
              </div>
            )
          )}

          <div className="col-span-full mt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="text-[11px] text-slate-400">
              Score weights: Calls/Leads/Prospects 3 • RSVP 10 • Meetings 12 •
              Sales 20
            </div>
            <div className="space-x-2">
              {editing && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={clearEditing}
                >
                  Cancel edit
                </Button>
              )}
              <Button type="submit" size="sm">
                {editing ? "Save changes" : "Add report"}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

