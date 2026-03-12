"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip as ReTooltip
} from "recharts";

type KPICardProps = {
  label: string;
  value: number;
  color: string;
  data: { value: number }[];
};

export function KPICard({ label, value, color, data }: KPICardProps) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const duration = 500;
    const start = performance.now();

    const animate = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      setDisplay(Math.round(value * progress));
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [value]);

  return (
    <motion.div
      className="hover-lift h-full w-full"
      whileHover={{ boxShadow: "0 0 35px rgba(56,189,248,0.55)" }}
    >
      <Card className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-1 opacity-70"
          style={{
            background: `linear-gradient(to right, ${color}, transparent)`
          }}
        />
        <CardHeader className="flex flex-row items-center justify-between pb-0">
          <CardTitle className="text-xs font-medium text-slate-300">
            {label}
          </CardTitle>
          <span
            className="h-2 w-2 rounded-full shadow-glow-soft"
            style={{ backgroundColor: color }}
          />
        </CardHeader>
        <CardContent className="flex flex-col gap-2 pt-3">
          <div className="text-2xl font-semibold tabular-nums text-slate-50">
            {display.toLocaleString()}
          </div>
          <div className="h-12 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id={`kpi-${label}`} x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity={0.6} />
                    <stop offset="100%" stopColor={color} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <ReTooltip
                  contentStyle={{
                    background: "#020617",
                    border: "1px solid #1e293b",
                    borderRadius: 8
                  }}
                  labelFormatter={() => label}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={color}
                  fillOpacity={1}
                  fill={`url(#kpi-${label})`}
                  strokeWidth={1.5}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

