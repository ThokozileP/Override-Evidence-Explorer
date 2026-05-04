"use client";

import { useMemo, useState } from "react";
import type { DecisionEvent } from "@/lib/types";
import SeverityBadge from "./SeverityBadge";

function fmt(ts: string) {
  return new Date(ts).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function pct(n: number | null) {
  if (n === null) return <span className="text-gray-400">—</span>;
  return `${(n * 100).toFixed(0)}%`;
}

export default function OverridesTable({ rows }: { rows: DecisionEvent[] }) {
  const [incompleteOnly, setIncompleteOnly] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    let r = rows;
    if (incompleteOnly) r = r.filter((x) => !x.is_complete);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      r = r.filter(
        (x) =>
          x.decision_id.toLowerCase().includes(q) ||
          x.system_name.toLowerCase().includes(q)
      );
    }
    return r;
  }, [rows, incompleteOnly, search]);

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <input
          type="text"
          placeholder="Search by Decision ID or System…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-72 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
        />
        <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={incompleteOnly}
            onChange={(e) => setIncompleteOnly(e.target.checked)}
            className="w-4 h-4 rounded border-gray-300"
          />
          Show incomplete evidence only
        </label>
        <span className="text-xs text-gray-400 ml-auto">{filtered.length} row{filtered.length !== 1 ? "s" : ""}</span>
      </div>

      {/* Table */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {[
                  "Decision ID",
                  "System",
                  "Model Ver.",
                  "Confidence",
                  "Threshold",
                  "Human Action",
                  "Final Decision",
                  "Evidence",
                  "Missing Fields",
                  "Severity",
                  "Timestamp",
                ].map((h) => (
                  <th key={h} className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={11} className="px-4 py-8 text-center text-gray-400 text-sm">
                    No records match the current filters.
                  </td>
                </tr>
              )}
              {filtered.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-gray-700 whitespace-nowrap">{row.decision_id}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-gray-800">{row.system_name}</td>
                  <td className="px-4 py-3 font-mono text-xs whitespace-nowrap">
                    {row.model_version ?? <span className="text-red-500 font-medium">missing</span>}
                  </td>
                  <td className="px-4 py-3 tabular-nums text-gray-700">
                    {row.confidence_score !== null ? (
                      <span className="font-semibold">{pct(row.confidence_score)}</span>
                    ) : (
                      <span className="text-red-500 font-medium">missing</span>
                    )}
                  </td>
                  <td className="px-4 py-3 tabular-nums text-gray-700">
                    {row.threshold !== null ? pct(row.threshold) : <span className="text-red-500 font-medium">missing</span>}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                      row.human_action === "override"
                        ? "bg-orange-50 text-orange-700 border border-orange-200"
                        : "bg-gray-100 text-gray-600"
                    }`}>
                      {row.human_action}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-700 max-w-[200px] truncate" title={row.final_decision}>
                    {row.final_decision}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {row.is_complete ? (
                      <span className="text-green-600 font-medium text-xs">Complete</span>
                    ) : (
                      <span className="text-red-600 font-medium text-xs">Incomplete</span>
                    )}
                  </td>
                  <td className="px-4 py-3 max-w-[180px]">
                    {row.missing_fields && row.missing_fields.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {row.missing_fields.map((f) => (
                          <span key={f} className="text-xs bg-red-50 text-red-600 border border-red-200 px-1.5 py-0.5 rounded">
                            {f}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-400 text-xs">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <SeverityBadge severity={row.severity} />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-500">{fmt(row.timestamp)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
