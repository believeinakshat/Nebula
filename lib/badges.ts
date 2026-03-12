import type { Report } from "./storage";

export type BadgeId =
  | "hot-streak"
  | "rising-star"
  | "top-closer"
  | "lead-generator";

export type Badge = {
  id: BadgeId;
  label: string;
};

export function getAgentBadges(
  agent: string,
  reports: Report[],
  now = new Date()
): Badge[] {
  const agentReports = reports.filter((r) => r.agent === agent);
  if (agentReports.length === 0) return [];

  const sorted = [...agentReports].sort(
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

  const last7 = new Date(now);
  last7.setDate(now.getDate() - 7);
  const last7Leads = agentReports
    .filter((r) => new Date(r.date) >= last7)
    .reduce((sum, r) => sum + r.leads, 0);

  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthSales = agentReports
    .filter((r) => new Date(r.date) >= monthStart)
    .reduce((sum, r) => sum + r.sales, 0);

  const lifetimeLeads = agentReports.reduce(
    (sum, r) => sum + r.leads,
    0
  );

  const badges: Badge[] = [];

  if (bestLeadStreak >= 5 || bestSalesStreak >= 5) {
    badges.push({ id: "hot-streak", label: "Hot Streak" });
  }
  if (last7Leads >= 10) {
    badges.push({ id: "rising-star", label: "Rising Star" });
  }
  if (monthSales >= 5) {
    badges.push({ id: "top-closer", label: "Top Closer" });
  }
  if (lifetimeLeads >= 50) {
    badges.push({ id: "lead-generator", label: "Lead Generator" });
  }

  return badges;
}

