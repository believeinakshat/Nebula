import type { Report } from "./storage";

export function computeScore(report: Omit<Report, "score" | "id">): number {
  return (
    report.calls * 3 +
    report.leads * 1 +
    report.prospects * 3 +
    report.rsvp * 10 +
    report.meetings * 15 +
    report.sales * 20
  );
}

export function withScore(
  partial: Omit<Report, "score"> & { score?: number }
): Report {
  const { score, ...rest } = partial;
  return {
    ...rest,
    score:
      score ??
      computeScore({
        agent: partial.agent,
        date: partial.date,
        calls: partial.calls,
        leads: partial.leads,
        prospects: partial.prospects,
        rsvp: partial.rsvp,
        meetings: partial.meetings,
        sales: partial.sales
      })
  };
}

