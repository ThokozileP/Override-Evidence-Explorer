import type { DecisionEvent, EvidenceSummary } from "./types";

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

async function apiFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`API error ${res.status}: ${path}`);
  return res.json() as Promise<T>;
}

export function getHighConfidenceOverrides(incompleteOnly = false): Promise<DecisionEvent[]> {
  const qs = incompleteOnly ? "?incomplete_only=true" : "";
  return apiFetch<DecisionEvent[]>(`/overrides/high-confidence${qs}`);
}

export function getEvidenceSummary(withAi = false): Promise<EvidenceSummary> {
  const qs = withAi ? "?with_ai=true" : "";
  return apiFetch<EvidenceSummary>(`/evidence-summary${qs}`);
}

export async function triggerSeedData(): Promise<{ inserted: number }> {
  const res = await fetch(`${BASE}/seed-demo-data?clear=true`, { method: "POST", cache: "no-store" });
  if (!res.ok) throw new Error(`Seed error ${res.status}`);
  return res.json();
}
