"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

type FunnelProps = {
  leadToProspect: number;
  prospectToRsvp: number;
  rsvpToSale: number;
};

function Bar({
  label,
  value,
  color
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs text-slate-300">
        <span>{label}</span>
        <span className="tabular-nums">{value.toFixed(1)}%</span>
      </div>
      <div className="h-3 w-full rounded-full bg-slate-900/80">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, value)}%` }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="h-full rounded-full shadow-glow-soft"
          style={{ background: color }}
        />
      </div>
    </div>
  );
}

export function ConversionFunnel({
  leadToProspect,
  prospectToRsvp,
  rsvpToSale
}: FunnelProps) {
  return (
    <Card className="hover-lift h-full space-y-3 p-4">
      <div className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-400">
        Conversion funnel
      </div>
      <Bar
        label="Lead → Prospect"
        value={leadToProspect}
        color="linear-gradient(to right, #22d3ee, #38bdf8)"
      />
      <Bar
        label="Prospect → RSVP"
        value={prospectToRsvp}
        color="linear-gradient(to right, #a855f7, #6366f1)"
      />
      <Bar
        label="RSVP → Sale"
        value={rsvpToSale}
        color="linear-gradient(to right, #f97316, #facc15)"
      />
    </Card>
  );
}

