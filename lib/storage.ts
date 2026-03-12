export type Report = {
  id: string;
  agent: string;
  date: string;
  calls: number;
  leads: number;
  prospects: number;
  rsvp: number;
  sales: number;
  meetings: number;
  score: number;
};

const REPORTS_KEY = "re_reports";
const AGENTS_KEY = "re_agents";

function safeParse<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function getReports(): Report[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(REPORTS_KEY);
  return safeParse<Report[]>(raw, []);
}

export function saveReports(reports: Report[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(REPORTS_KEY, JSON.stringify(reports));
}

export function getAgents(): string[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(AGENTS_KEY);
  return safeParse<string[]>(raw, []);
}

export function saveAgents(agents: string[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(AGENTS_KEY, JSON.stringify(agents));
}

