"use client";

import { useState } from "react";
import type { Report } from "@/lib/storage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast-provider";

type Props = {
  reports: Report[];
};

type ClaudeMessage = {
  role: "user";
  content: string;
};

export function AiManagerReport({ reports }: Props) {
  const [apiKey, setApiKey] = useState<string>(() => {
    if (typeof window === "undefined") return "";
    return window.localStorage.getItem("re_claude_key") ?? "";
  });
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState<string>("");

  const saveKey = (value: string) => {
    setApiKey(value);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("re_claude_key", value);
    }
  };

  const generate = async () => {
    if (!apiKey) {
      toast("Missing API key", {
        description: "Add your Claude API key to generate a report."
      });
      return;
    }
    if (reports.length === 0) {
      toast("No data", {
        description: "Add some reports before generating an AI summary."
      });
      return;
    }

    setLoading(true);
    setOutput("");

    try {
      const payload: {
        totalReports: number;
        byAgent: Record<
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
        >;
      } = {
        totalReports: reports.length,
        byAgent: {}
      };

      for (const r of reports) {
        const agg =
          payload.byAgent[r.agent] ??
          (payload.byAgent[r.agent] = {
            calls: 0,
            leads: 0,
            prospects: 0,
            rsvp: 0,
            sales: 0,
            meetings: 0,
            score: 0
          });
        agg.calls += r.calls;
        agg.leads += r.leads;
        agg.prospects += r.prospects;
        agg.rsvp += r.rsvp;
        agg.sales += r.sales;
        agg.meetings += r.meetings;
        agg.score += r.score;
      }

      const messages: ClaudeMessage[] = [
        {
          role: "user",
          content: [
            "You are a sales performance manager for a real estate brokerage.",
            "Using the JSON data below, write a concise 400-word performance report.",
            "Highlight top performers, underperformers, patterns in performance, correlations between activities and outcomes, and end with exactly 3 numbered actionable recommendations.",
            "",
            "JSON data:",
            "```json",
            JSON.stringify(payload),
            "```"
          ].join("\n")
        }
      ];

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01"
        },
        body: JSON.stringify({
          model: "claude-3-opus-20240229",
          max_tokens: 700,
          messages
        })
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Request failed");
      }

      const json = await response.json();
      const content = json?.content?.[0]?.text ?? "No content returned.";
      setOutput(content);
    } catch (err: any) {
      console.error(err);
      toast("Claude error", {
        description: "Failed to generate report. Check your key and try again."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="hover-lift mt-4">
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <CardTitle className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-400">
          AI manager report
        </CardTitle>
        <div className="flex items-center gap-2 text-xs">
          <Input
            type="password"
            className="h-8 w-60 text-xs"
            placeholder="Claude API key"
            value={apiKey}
            onChange={(e) => saveKey(e.target.value)}
          />
          <Button size="sm" onClick={generate} disabled={loading}>
            {loading ? "Generating…" : "Generate AI Report"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border border-slate-700 bg-slate-950/80 p-3 font-mono text-xs text-slate-200 shadow-inner">
          {output ? (
            <pre className="max-h-72 overflow-auto whitespace-pre-wrap text-xs">
              {output}
            </pre>
          ) : (
            <div className="text-slate-500">
              The generated report will appear here in a terminal-style view.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

