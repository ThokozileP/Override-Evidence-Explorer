"use client";

import type { EvidenceSummary } from "@/lib/types";

function Stat({ label, value, highlight }: { label: string; value: number | string; highlight?: boolean }) {
  return (
    <div className="border border-gray-200 rounded-lg p-5 bg-white">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className={`text-3xl font-semibold tabular-nums ${highlight ? "text-red-600" : "text-gray-900"}`}>
        {value}
      </p>
    </div>
  );
}

export default function SummaryCards({ summary }: { summary: EvidenceSummary }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Stat label="Total overrides" value={summary.total_overrides} />
        <Stat label="High-confidence overrides" value={summary.high_confidence_overrides} />
        <Stat
          label="Incomplete evidence"
          value={summary.incomplete_evidence_count}
          highlight={summary.incomplete_evidence_count > 0}
        />
        <Stat label="High severity" value={summary.severity_breakdown["high"] ?? 0} highlight />
      </div>

      {summary.top_missing_fields.length > 0 && (
        <div className="border border-gray-200 rounded-lg p-5 bg-white">
          <p className="text-sm font-medium text-gray-700 mb-3">Top missing fields</p>
          <div className="flex flex-wrap gap-2">
            {summary.top_missing_fields.map(({ field, count }) => (
              <span key={field} className="text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full">
                {field} <span className="font-semibold text-red-600">×{count}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {summary.ai_summary && (
        <div className="border border-blue-100 rounded-lg p-5 bg-blue-50">
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-2">AI Evidence Summary</p>
          <p className="text-sm text-gray-800 leading-relaxed">{summary.ai_summary}</p>
        </div>
      )}
    </div>
  );
}
