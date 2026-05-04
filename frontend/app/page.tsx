import { getHighConfidenceOverrides, getEvidenceSummary } from "@/lib/api";
import type { DecisionEvent, EvidenceSummary } from "@/lib/types";
import Dashboard from "@/components/Dashboard";

export const dynamic = "force-dynamic";

const emptySummary: EvidenceSummary = {
  total_overrides: 0,
  high_confidence_overrides: 0,
  incomplete_evidence_count: 0,
  severity_breakdown: {},
  top_missing_fields: [],
  ai_summary: null,
};

export default async function Home() {
  let rows: DecisionEvent[] = [];
  let summary: EvidenceSummary = emptySummary;

  try {
    [rows, summary] = await Promise.all([
      getHighConfidenceOverrides(),
      getEvidenceSummary(),
    ]);
  } catch {
    // Backend not yet running — render empty state
  }

  return <Dashboard initialRows={rows} initialSummary={summary} />;
}
