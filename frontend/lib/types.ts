export interface DecisionEvent {
  id: string;
  decision_id: string;
  system_name: string;
  model_version: string | null;
  model_output: string;
  confidence_score: number | null;
  threshold: number | null;
  human_action: string;
  final_decision: string;
  timestamp: string;
  recommendation_visible: boolean | null;
  confidence_visible: boolean | null;
  is_complete: boolean | null;
  missing_fields: string[] | null;
  severity: "low" | "medium" | "high" | null;
}

export interface EvidenceSummary {
  total_overrides: number;
  high_confidence_overrides: number;
  incomplete_evidence_count: number;
  severity_breakdown: Record<string, number>;
  top_missing_fields: Array<{ field: string; count: number }>;
  ai_summary: string | null;
}
