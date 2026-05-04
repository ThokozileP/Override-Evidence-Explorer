"use client";

import { useState, useTransition } from "react";
import type { DecisionEvent, EvidenceSummary } from "@/lib/types";
import { getEvidenceSummary, triggerSeedData } from "@/lib/api";
import SummaryCards from "./SummaryCards";
import OverridesTable from "./OverridesTable";

interface Props {
  initialRows: DecisionEvent[];
  initialSummary: EvidenceSummary;
}

export default function Dashboard({ initialRows, initialSummary }: Props) {
  const [summary, setSummary] = useState(initialSummary);
  const [rows] = useState(initialRows);
  const [aiPending, startAi] = useTransition();
  const [seedPending, startSeed] = useTransition();
  const [seedMsg, setSeedMsg] = useState<string | null>(null);

  function handleGenerateSummary() {
    startAi(async () => {
      const s = await getEvidenceSummary(true);
      setSummary(s);
    });
  }

  function handleSeed() {
    startSeed(async () => {
      const r = await triggerSeedData();
      setSeedMsg(`Seeded ${r.inserted} records. Reload to refresh table.`);
    });
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Override Evidence Explorer</h1>
          <p className="text-xs text-gray-500 mt-0.5">Regulated AI · Human override audit</p>
        </div>
        <button
          onClick={handleSeed}
          disabled={seedPending}
          className="text-xs text-gray-500 border border-gray-300 rounded px-3 py-1.5 hover:bg-gray-50 disabled:opacity-50 transition-colors"
        >
          {seedPending ? "Seeding…" : "Seed demo data"}
        </button>
      </header>

      <main className="max-w-screen-xl mx-auto px-6 py-8 space-y-8">
        {seedMsg && (
          <div className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-md px-4 py-3">
            {seedMsg}
          </div>
        )}

        {/* Summary section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Evidence Summary</h2>
            <button
              onClick={handleGenerateSummary}
              disabled={aiPending}
              className="text-xs bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-700 disabled:opacity-50 transition-colors"
            >
              {aiPending ? "Generating…" : "Generate AI summary"}
            </button>
          </div>
          <SummaryCards summary={summary} />
        </section>

        {/* High-confidence overrides table */}
        <section>
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">
            High-Confidence Overrides
          </h2>
          <OverridesTable rows={rows} />
        </section>
      </main>
    </div>
  );
}
