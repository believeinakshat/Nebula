"use client";

import {
  Line,
  LineChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as ReTooltip,
  XAxis,
  YAxis,
  Legend
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

type TimeBucket = "daily" | "weekly" | "monthly";

export type TimeSeriesPoint = {
  label: string;
  calls: number;
  leads: number;
  prospects: number;
  rsvp: number;
  sales: number;
  meetings: number;
};

export function TimeSeriesSection({
  dataDaily,
  dataWeekly,
  dataMonthly
}: {
  dataDaily: TimeSeriesPoint[];
  dataWeekly: TimeSeriesPoint[];
  dataMonthly: TimeSeriesPoint[];
}) {
  const [bucket, setBucket] = useState<TimeBucket>("daily");
  const data =
    bucket === "daily" ? dataDaily : bucket === "weekly" ? dataWeekly : dataMonthly;

  return (
    <Card className="hover-lift col-span-2 space-y-4 p-4">
      <div className="flex items-center justify-between">
        <CardTitle className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-400">
          Activity over time
        </CardTitle>
        <Tabs value={bucket} onValueChange={(v) => setBucket(v as TimeBucket)}>
          <TabsList>
            <TabsTrigger value="daily">Daily</TabsTrigger>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <CardContent className="grid gap-4 md:grid-cols-2">
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="label" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <ReTooltip
                contentStyle={{
                  background: "#020617",
                  border: "1px solid #1e293b",
                  borderRadius: 8
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="calls"
                stroke="#38bdf8"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="leads"
                stroke="#a855f7"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="label" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <ReTooltip
                contentStyle={{
                  background: "#020617",
                  border: "1px solid #1e293b",
                  borderRadius: 8
                }}
              />
              <Legend />
              <Bar dataKey="prospects" stackId="a" fill="#22c55e" />
              <Bar dataKey="rsvp" stackId="a" fill="#f97316" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="label" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <ReTooltip
                contentStyle={{
                  background: "#020617",
                  border: "1px solid #1e293b",
                  borderRadius: 8
                }}
              />
              <Bar dataKey="sales" fill="#eab308" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="label" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <ReTooltip
                contentStyle={{
                  background: "#020617",
                  border: "1px solid #1e293b",
                  borderRadius: 8
                }}
              />
              <Line
                type="monotone"
                dataKey="meetings"
                stroke="#4ade80"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

