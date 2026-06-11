"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";

type PanelId = 1 | 2 | 3 | 4 | 5 | 6;
type EvidenceStatus = "complete" | "partial" | "missing";

// ─── Module registry ─────────────────────────────────────────────────────────

const MODULES: Array<{
  id: PanelId;
  title: string;
  description: string;
  status: EvidenceStatus;
}> = [
  {
    id: 1,
    title: "Executive Summary",
    description:
      "Primary finding and exposure assessment. Decision reconstruction determined not possible across all 47 override events in scope.",
    status: "partial",
  },
  {
    id: 2,
    title: "Decision Context Record",
    description:
      "Forensic reconstruction attempt for Override #31. Evidence available is insufficient to reproduce the decision environment at time of override.",
    status: "missing",
  },
  {
    id: 3,
    title: "Evidence Integrity Assessment",
    description:
      "SHA-256 seal status and evidence maturity assessment. Contemporaneous capture not implemented. Evidence collected post-session.",
    status: "partial",
  },
  {
    id: 4,
    title: "Oversight Gap Analysis",
    description:
      "Assessment against five Article 14 oversight requirements. All five contain evidence deficiencies at the point of decision.",
    status: "partial",
  },
  {
    id: 5,
    title: "Clinician Override Log",
    description:
      "Session-by-session override record. 47 events in audit period. Complete decision context absent from all records.",
    status: "partial",
  },
  {
    id: 6,
    title: "Remediation Playbook",
    description:
      "Prioritised 90-day remediation pathway to establish compliant decision context capture and restore Article 14 readiness.",
    status: "complete",
  },
];

// ─── Atoms ───────────────────────────────────────────────────────────────────

function EvidenceBadge({ status }: { status: EvidenceStatus }) {
  const styles: Record<EvidenceStatus, string> = {
    complete: "bg-green-50 text-green-700 border-green-200",
    partial:  "bg-amber-50 text-amber-700 border-amber-200",
    missing:  "bg-red-50   text-red-700   border-red-200",
  };
  const label: Record<EvidenceStatus, string> = {
    complete: "COMPLETE",
    partial:  "PARTIAL",
    missing:  "MISSING",
  };
  return (
    <span className={`inline-flex items-center text-xs font-bold border rounded px-2 py-0.5 uppercase tracking-widest whitespace-nowrap ${styles[status]}`}>
      {label[status]}
    </span>
  );
}

function SectionLabel({ children }: { children: string }) {
  return (
    <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
      {children}
    </p>
  );
}

function DarkFinding({ children }: { children: ReactNode }) {
  return (
    <div className="bg-gray-900 text-white rounded-lg p-5">
      <div className="text-sm leading-relaxed space-y-2">{children}</div>
    </div>
  );
}

function AmberFinding({ children }: { children: ReactNode }) {
  return (
    <div className="border-l-4 border-amber-400 bg-amber-50 px-5 py-4 rounded-r-lg">
      <div className="text-sm leading-relaxed space-y-2 text-amber-900">{children}</div>
    </div>
  );
}

function RedFinding({ children }: { children: ReactNode }) {
  return (
    <div className="border-l-4 border-red-400 bg-red-50 px-5 py-4 rounded-r-lg">
      <div className="text-sm leading-relaxed space-y-2 text-red-900">{children}</div>
    </div>
  );
}

// ─── Finding rail ─────────────────────────────────────────────────────────────

function FindingRail() {
  const items = [
    { label: "Primary Finding",          value: "Decision Reconstruction\nNot Possible", color: "amber" },
    { label: "Exposure",                 value: "HIGH",          color: "red"   },
    { label: "Article 14 Status",        value: "NON-COMPLIANT", color: "red"   },
    { label: "Override Events",          value: "47",            color: "gray"  },
    { label: "Complete Context Records", value: "0",             color: "red"   },
  ] as const;

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
      <div className="bg-gray-900 px-4 py-3">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
          Case Summary
        </p>
        <p className="text-xs font-mono text-gray-300 mt-0.5">MC-2025-0314</p>
      </div>
      <div className="divide-y divide-gray-100">
        {items.map((item) => (
          <div key={item.label} className="px-4 py-3">
            <p className="text-xs text-gray-400 mb-1">{item.label}</p>
            <p
              className={`text-sm font-semibold whitespace-pre-line ${
                item.color === "red"   ? "text-red-700"   :
                item.color === "amber" ? "text-amber-700" :
                "text-gray-900"
              }`}
            >
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Top bar ─────────────────────────────────────────────────────────────────

function TopBar({
  activePanel,
  onBack,
}: {
  activePanel: PanelId | null;
  onBack: () => void;
}) {
  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 lg:px-6 h-12 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {activePanel === null ? (
            <Link
              href="/"
              className="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1.5 transition-colors"
            >
              <span aria-hidden="true">←</span>
              <span>Dashboard</span>
            </Link>
          ) : (
            <button
              onClick={onBack}
              className="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1.5 transition-colors"
            >
              <span aria-hidden="true">←</span>
              <span>Dossier Index</span>
            </button>
          )}
          <span className="hidden sm:block text-gray-200 select-none">|</span>
          <span className="hidden sm:block text-xs font-mono text-gray-400">MC-2025-0314</span>
        </div>
        <span className="hidden lg:flex items-center gap-1.5 text-xs font-semibold text-amber-700">
          <span>⚠</span>
          <span>Decision Reconstruction Not Possible</span>
        </span>
      </div>
    </header>
  );
}

// ─── Dossier header ───────────────────────────────────────────────────────────

function DossierHeader() {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 lg:px-6 py-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-400 uppercase tracking-wide">Case Reference</span>
              <span className="text-xs font-mono font-semibold text-gray-700">MC-2025-0314</span>
            </div>
            <h1 className="text-xl font-semibold text-gray-900">
              ClinicalRisk AI — Oncology Decision Support
            </h1>
            <p className="text-xs text-gray-500">
              Article 14 Oversight Readiness Assessment
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {["High-risk AI System", "Annex III", "EU MDR", "EU AI Act Art. 14"].map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-gray-100 text-gray-600 border border-gray-200 rounded px-2 py-0.5"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="flex flex-col items-start lg:items-end gap-2 flex-shrink-0">
            <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-300 rounded px-3 py-2">
              <span>⚠</span>
              <span className="text-xs font-bold text-amber-800 uppercase tracking-wide">
                Decision Reconstruction Not Possible
              </span>
            </div>
            <div className="text-xs text-gray-400 space-y-0.5 text-left lg:text-right">
              <p>Generated: 14 March 2025</p>
              <p className="font-mono">SHA-256 Sealed</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Assessment question ──────────────────────────────────────────────────────

function AssessmentQuestion() {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 lg:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:divide-x lg:divide-gray-200">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
              Question Posed During Assessment
            </p>
            <p className="text-sm text-gray-700 leading-relaxed italic border-l-2 border-gray-300 pl-4">
              "Can this organisation reconstruct what the clinician saw at the moment an AI
              recommendation was overridden?"
            </p>
          </div>
          <div className="lg:pl-6">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
              Assessment Result
            </p>
            <p className="text-sm font-bold text-red-700 mb-2">No.</p>
            <p className="text-sm text-gray-700 leading-relaxed">
              Override events were recorded.
            </p>
            <p className="text-sm text-gray-700 leading-relaxed mt-1">
              The decision environment present at the point of override was not captured.
            </p>
            <p className="text-sm text-gray-700 leading-relaxed mt-2 font-medium">
              Oversight therefore cannot be independently reconstructed or verified.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Module list ─────────────────────────────────────────────────────────────

function ModuleList({ onOpen }: { onOpen: (id: PanelId) => void }) {
  const borderColor: Record<EvidenceStatus, string> = {
    complete: "border-l-green-400",
    partial:  "border-l-amber-400",
    missing:  "border-l-red-500",
  };

  return (
    <div>
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
        Dossier Sections
      </p>
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        {MODULES.map((mod) => (
          <button
            key={mod.id}
            onClick={() => onOpen(mod.id)}
            className={`w-full text-left flex items-start gap-4 px-5 py-4 bg-white hover:bg-gray-50 transition-colors group border-b border-gray-100 last:border-b-0 border-l-4 ${borderColor[mod.status]}`}
          >
            <span className="text-xs font-mono text-gray-300 pt-0.5 flex-shrink-0 w-5">
              {String(mod.id).padStart(2, "0")}
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4 mb-1">
                <p className="text-sm font-semibold text-gray-900">{mod.title}</p>
                <EvidenceBadge status={mod.status} />
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">{mod.description}</p>
            </div>
            <span className="text-gray-300 group-hover:text-gray-600 transition-colors text-sm flex-shrink-0 pt-0.5">
              →
            </span>
          </button>
        ))}
      </div>
      <p className="text-xs text-gray-400 mt-3">
        5 of 6 sections contain partial or missing evidence. 1 complete.
      </p>
    </div>
  );
}

// ─── Panel 1: Executive Summary ──────────────────────────────────────────────

function Panel1() {
  const findings: Array<{ type: "bad" | "partial" | "neutral"; text: string }> = [
    { type: "neutral", text: "47 override events recorded in the audit period" },
    { type: "bad",     text: "0 override events with complete decision context captured" },
    { type: "bad",     text: "Recommendation as displayed: not captured in any session" },
    { type: "bad",     text: "Confidence score at decision point: not captured" },
    { type: "bad",     text: "Model version at override moment: not captured" },
    { type: "bad",     text: "Clinical context available to reviewer: not captured" },
    { type: "partial", text: "Clinician rationale: captured in 12 of 47 events (25%)" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <SectionLabel>Primary Finding</SectionLabel>
        <AmberFinding>
          <p className="font-semibold text-amber-900">Decision Reconstruction Not Possible</p>
          <div className="flex flex-wrap items-center gap-4 pt-1">
            <span className="text-xs text-amber-700">
              Exposure:{" "}
              <span className="font-bold text-red-700">HIGH</span>
            </span>
            <span className="text-xs text-amber-700">
              Article 14 Status:{" "}
              <span className="font-bold text-red-700">NON-COMPLIANT</span>
            </span>
          </div>
        </AmberFinding>
      </div>

      <div>
        <SectionLabel>Key Findings</SectionLabel>
        <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-100">
          {findings.map((f, i) => (
            <div key={i} className="flex items-start gap-3 px-5 py-3">
              <span
                className={`font-bold mt-0.5 flex-shrink-0 text-sm ${
                  f.type === "bad"     ? "text-red-500"   :
                  f.type === "partial" ? "text-amber-500" :
                  "text-gray-300"
                }`}
              >
                {f.type === "bad" ? "✗" : f.type === "partial" ? "⚠" : "·"}
              </span>
              <span className="text-sm text-gray-700">{f.text}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <SectionLabel>Why This Matters</SectionLabel>
        <DarkFinding>
          <p>
            The organisation can demonstrate that clinicians intervened.
          </p>
          <p>
            It cannot demonstrate the decision environment that existed when those interventions
            occurred.
          </p>
          <p className="font-medium">
            Under Article 14, evidence of intervention and evidence of oversight are not equivalent.
          </p>
        </DarkFinding>
      </div>
    </div>
  );
}

// ─── Panel 2: Decision Context Record ────────────────────────────────────────

function Panel2() {
  const available    = ["Override occurred", "Clinician identified", "Timestamp recorded", "Final action taken"];
  const unavailable  = [
    "Recommendation as displayed",
    "Confidence score shown to clinician",
    "Model version active at override",
    "Clinical context visible at decision",
    "Intervention options presented",
    "Clinician rationale",
  ];

  return (
    <div className="space-y-8">
      <div>
        <SectionLabel>Override Event</SectionLabel>
        <div className="bg-white border border-gray-200 rounded-lg p-5 grid grid-cols-2 gap-4">
          {(
            [
              { label: "Event reference", value: "Override #31",                mono: false },
              { label: "Date and time",   value: "14 March 2025, 09:48:11 UTC", mono: true  },
              { label: "Clinician",       value: "Dr. A. Mensah",               mono: false },
              { label: "System version",  value: "ClinicalRisk-v2.3.1",         mono: true  },
            ] as const
          ).map((row) => (
            <div key={row.label}>
              <p className="text-xs text-gray-400 mb-0.5">{row.label}</p>
              <p className={`text-sm font-medium text-gray-900 ${row.mono ? "font-mono" : ""}`}>
                {row.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <SectionLabel>Evidence Available vs Evidence Required</SectionLabel>
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="grid grid-cols-2 divide-x divide-gray-200">
            <div>
              <div className="bg-green-50 px-5 py-3 border-b border-green-100">
                <p className="text-xs font-bold text-green-700 uppercase tracking-widest">
                  Evidence Available
                </p>
              </div>
              <div className="divide-y divide-gray-100">
                {available.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 px-5 py-3">
                    <span className="text-green-600 font-bold flex-shrink-0 text-sm">✓</span>
                    <span className="text-sm text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="bg-red-50 px-5 py-3 border-b border-red-100">
                <p className="text-xs font-bold text-red-700 uppercase tracking-widest">
                  Required — Not Captured
                </p>
              </div>
              <div className="divide-y divide-gray-100">
                {unavailable.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 px-5 py-3">
                    <span className="text-red-500 font-bold flex-shrink-0 text-sm">✗</span>
                    <span className="text-sm text-red-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <SectionLabel>Reconstruction Outcome</SectionLabel>
        <DarkFinding>
          <p>
            The decision environment present at the time of override cannot be reproduced.
          </p>
          <p>
            The organisation can prove that a decision changed.
          </p>
          <p className="font-semibold">
            It cannot prove what information was available when that change occurred.
          </p>
        </DarkFinding>
      </div>
    </div>
  );
}

// ─── Panel 3: Evidence Integrity ─────────────────────────────────────────────

function Panel3() {
  const maturityLevels = [
    {
      label: "Captured at Decision Time",
      description: "Evidence sealed at the exact moment the decision was made.",
      state: "above",
    },
    {
      label: "Captured During Session",
      description: "Evidence recorded within the same clinical session as the decision.",
      state: "above",
    },
    {
      label: "Captured After Session",
      description: "Evidence aggregated from system logs after the session concluded.",
      state: "current",
    },
    {
      label: "Reconstructed Later",
      description: "Evidence derived from records after the fact — not contemporaneous.",
      state: "below",
    },
  ];

  const fields: Array<{ label: string; status: "pass" | "partial" | "fail"; note: string }> = [
    { label: "Override event log",                  status: "pass",    note: "SHA-256 sealed"      },
    { label: "Decision context record",             status: "fail",    note: "Not generated"        },
    { label: "Contemporaneous capture",             status: "fail",    note: "Not implemented"      },
    { label: "Tamper-evident at point of decision", status: "fail",    note: "No"                   },
    { label: "Independently verifiable",            status: "partial", note: "Partial — log only"   },
  ];

  const iconCls = { pass: "text-green-600", partial: "text-amber-500", fail: "text-red-500" };
  const noteCls = { pass: "text-green-600", partial: "text-amber-600", fail: "text-red-600" };
  const icons   = { pass: "✓", partial: "⚠", fail: "✗" };

  return (
    <div className="space-y-8">
      <div>
        <SectionLabel>Seal Status</SectionLabel>
        <div className="bg-white border border-gray-200 rounded-lg p-5 space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500 w-36 flex-shrink-0">Seal status</span>
            <EvidenceBadge status="partial" />
          </div>
          <div className="flex items-start gap-3">
            <span className="text-xs text-gray-500 w-36 flex-shrink-0 pt-0.5">Method</span>
            <span className="text-sm text-gray-700">
              Post-hoc log aggregation — not contemporaneous capture
            </span>
          </div>
        </div>
      </div>

      <div>
        <SectionLabel>Evidence Maturity Scale</SectionLabel>
        <div className="relative space-y-2">
          <div className="absolute left-[19px] top-5 bottom-5 w-px bg-gray-200" aria-hidden="true" />
          {maturityLevels.map((level, i) => (
            <div
              key={i}
              className={`flex items-start gap-4 p-3.5 rounded-lg relative ${
                level.state === "current"
                  ? "bg-amber-50 border border-amber-200"
                  : "bg-white border border-gray-100"
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-semibold relative z-10 ${
                  level.state === "current"
                    ? "bg-amber-500 text-white"
                    : level.state === "above"
                    ? "bg-gray-100 text-gray-400"
                    : "bg-gray-50 text-gray-300 border border-gray-200"
                }`}
              >
                {i + 1}
              </div>
              <div>
                <p
                  className={`text-sm font-semibold ${
                    level.state === "current" ? "text-amber-800" : "text-gray-500"
                  }`}
                >
                  {level.label}
                  {level.state === "current" && (
                    <span className="ml-2 text-xs font-normal text-amber-600">← Current state</span>
                  )}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">{level.description}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-3">
          Evidence quality decreases with distance from the original decision moment.
        </p>
      </div>

      <div>
        <SectionLabel>Evidence Fields</SectionLabel>
        <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-100">
          {fields.map((f, i) => (
            <div key={i} className="flex items-center gap-3 px-5 py-3.5">
              <span className={`font-bold flex-shrink-0 text-sm ${iconCls[f.status]}`}>
                {icons[f.status]}
              </span>
              <span className="text-sm text-gray-700 flex-1">{f.label}</span>
              <span className={`text-xs ${noteCls[f.status]}`}>{f.note}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <SectionLabel>Integrity Conclusion</SectionLabel>
        <DarkFinding>
          <p>
            Sealing evidence after the fact protects records from alteration.
          </p>
          <p className="font-medium">
            It does not prove that the records contain the information required to reconstruct
            oversight.
          </p>
        </DarkFinding>
      </div>
    </div>
  );
}

// ─── Panel 4: Oversight Gap Analysis ─────────────────────────────────────────

function Panel4() {
  const rows: Array<{
    req: string;
    evidence: string;
    current: string;
    gap: string;
    severity: "partial" | "fail";
  }> = [
    {
      req:      "Understand AI capabilities and limitations",
      evidence: "Documented system card available at decision point",
      current:  "System card exists in documentation",
      gap:      "Not surfaced at point of decision",
      severity: "partial",
    },
    {
      req:      "Monitor operation",
      evidence: "Runtime behavioural log, session by session",
      current:  "Override log exists",
      gap:      "No session-level context captured",
      severity: "fail",
    },
    {
      req:      "Correctly interpret outputs",
      evidence: "Evidence that recommendation context was presented",
      current:  "Recommendation value logged",
      gap:      "Confidence score and model version not captured",
      severity: "fail",
    },
    {
      req:      "Intervene where necessary",
      evidence: "Evidence that intervention options were available",
      current:  "Override action logged",
      gap:      "Options presented to clinician not captured",
      severity: "fail",
    },
    {
      req:      "Disregard or override outputs",
      evidence: "Contemporaneous decision context record",
      current:  "Override event logged",
      gap:      "Decision environment not captured",
      severity: "fail",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <SectionLabel>Article 14 Requirements vs Evidence</SectionLabel>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm border border-gray-200 rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                {["Art. 14 Requirement", "Evidence Needed", "Current State", "Gap"].map((h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {rows.map((row, i) => (
                <tr key={i}>
                  <td className="px-4 py-3.5 text-sm font-medium text-gray-900 align-top">{row.req}</td>
                  <td className="px-4 py-3.5 text-sm text-gray-600 align-top">{row.evidence}</td>
                  <td className="px-4 py-3.5 text-sm text-gray-600 align-top">{row.current}</td>
                  <td className="px-4 py-3.5 align-top">
                    <div className="flex items-start gap-1.5">
                      <span
                        className={`font-bold flex-shrink-0 mt-0.5 text-sm ${
                          row.severity === "partial" ? "text-amber-500" : "text-red-500"
                        }`}
                      >
                        {row.severity === "partial" ? "⚠" : "✗"}
                      </span>
                      <span
                        className={`text-sm ${
                          row.severity === "partial" ? "text-amber-700" : "text-red-700"
                        }`}
                      >
                        {row.gap}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <SectionLabel>Oversight Readiness Result</SectionLabel>
        <RedFinding>
          <p className="font-semibold">
            5 of 5 oversight requirements contain evidence deficiencies at the point of decision.
          </p>
          <p>
            Current oversight evidence is insufficient to support complete decision reconstruction.
          </p>
          <p className="font-bold uppercase tracking-wide text-xs pt-1">
            Status: NON-COMPLIANT
          </p>
        </RedFinding>
      </div>
    </div>
  );
}

// ─── Panel 5: Clinician Override Log ─────────────────────────────────────────

function Panel5() {
  const summaryItems = [
    { label: "Override Events",          value: "47", sub: "Audit period total",    color: "gray"  },
    { label: "Complete Decision Context", value: "0",  sub: "0% of events",          color: "red"   },
    { label: "Partial Context Only",     value: "12", sub: "25% of events",         color: "amber" },
    { label: "Missing Context",          value: "35", sub: "75% of events",         color: "red"   },
  ] as const;

  const events: Array<{
    num: number;
    date: string;
    clinician: string;
    rec: string;
    action: string;
    context: "none" | "partial";
  }> = [
    { num: 31, date: "14 Mar 2025", clinician: "Dr. A. Mensah", rec: "Heparin 5,000 IU",       action: "Alternative selected",       context: "none"    },
    { num: 28, date: "11 Mar 2025", clinician: "Dr. C. Osei",   rec: "Warfarin 5mg",            action: "Dose modified",              context: "none"    },
    { num: 24, date: "07 Mar 2025", clinician: "Dr. A. Mensah", rec: "CT scan ordered",         action: "Deferred — MRI selected",    context: "none"    },
    { num: 19, date: "02 Mar 2025", clinician: "Dr. R. Bakker", rec: "Chemotherapy protocol A", action: "Protocol B selected",        context: "none"    },
    { num: 15, date: "26 Feb 2025", clinician: "Dr. C. Osei",   rec: "Biopsy recommended",      action: "Watchful waiting",           context: "partial" },
    { num: 12, date: "21 Feb 2025", clinician: "Dr. L. Visser", rec: "Referral to oncology",    action: "Managed in-house",           context: "partial" },
    { num:  8, date: "14 Feb 2025", clinician: "Dr. R. Bakker", rec: "Immunotherapy initiated", action: "Delayed — MDT review",       context: "none"    },
    { num:  3, date: "07 Feb 2025", clinician: "Dr. L. Visser", rec: "Palliative referral",     action: "Curative pathway continued", context: "partial" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <SectionLabel>Evidence Summary</SectionLabel>
        <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-100">
          {summaryItems.map((item) => (
            <div key={item.label} className="flex items-center justify-between px-5 py-3.5">
              <div>
                <p className="text-sm text-gray-700">{item.label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{item.sub}</p>
              </div>
              <p
                className={`text-lg font-semibold tabular-nums ${
                  item.color === "red"   ? "text-red-600"   :
                  item.color === "amber" ? "text-amber-600" :
                  "text-gray-900"
                }`}
              >
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <SectionLabel>Override Events — Excerpt (8 of 47)</SectionLabel>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-sm border border-gray-200 rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                {["Event", "Date", "Clinician", "AI Recommendation", "Action Taken", "Context"].map((h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {events.map((ev) => (
                <tr key={ev.num}>
                  <td className="px-4 py-3 text-xs font-mono text-gray-400">#{ev.num}</td>
                  <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">{ev.date}</td>
                  <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">{ev.clinician}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{ev.rec}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{ev.action}</td>
                  <td className="px-4 py-3">
                    {ev.context === "none" ? (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-red-600">
                        <span className="font-bold">✗</span> None
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-600">
                        <span className="font-bold">⚠</span> Partial
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AmberFinding>
        <p className="font-semibold">
          47 override events in audit period.
        </p>
        <p>
          0 with complete decision context. 12 with partial rationale only. 35 with no context
          whatsoever.
        </p>
        <p>
          No override event in this dossier contains sufficient evidence to independently reconstruct
          the decision environment.
        </p>
      </AmberFinding>
    </div>
  );
}

// ─── Panel 6: Remediation Playbook ───────────────────────────────────────────

function Panel6() {
  const priorities = [
    {
      n: 1,
      timeframe: "0–30 days",
      objective: "Capture the minimum reconstructable decision record.",
      action:
        "Record recommendation, confidence score, and model version at the moment of presentation to the clinician.",
      impact:
        "Enables reconstruction of recommendation context during notified body review. Establishes baseline Art. 14 evidence for all future override events.",
    },
    {
      n: 2,
      timeframe: "30–60 days",
      objective: "Establish contemporaneous context capture.",
      action:
        "Implement sealed capture of clinical flags, intervention options, and patient data snapshot at the moment of override — not aggregated afterward.",
      impact:
        "Meets the 'generatable, not reconstructed' standard for notified body audit. Post-hoc aggregation no longer the sole evidence method.",
    },
    {
      n: 3,
      timeframe: "60–90 days",
      objective: "Achieve structured rationale coverage.",
      action:
        "Introduce a required or optional reason code field at override moment, stored as part of the sealed decision context record.",
      impact:
        "Rationale coverage increases from 25% to 100%. Highest-value Art. 14 evidence element becomes systematically captured.",
    },
    {
      n: 4,
      timeframe: "Ongoing",
      objective: "Sustain compliance through session-level review.",
      action:
        "Monthly audit of decision context completeness against Art. 14 checkpoint list. Gaps flagged before they compound.",
      impact:
        "Evidence gaps cannot be remediated retroactively. Ongoing review prevents future audit exposure from accumulating.",
    },
  ];

  const timeline = [
    { label: "Today",   state: "HIGH EXPOSURE",        color: "red"   },
    { label: "30 Days", state: "Priority 1 complete",  color: "amber" },
    { label: "60 Days", state: "Priority 2 complete",  color: "amber" },
    { label: "90 Days", state: "LOW EXPOSURE",          color: "green" },
  ] as const;

  return (
    <div className="space-y-8">
      <div>
        <SectionLabel>Remediation Timeline</SectionLabel>
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="flex items-start justify-between relative">
            <div
              className="absolute top-3 left-[12%] right-[12%] h-px bg-gray-200"
              aria-hidden="true"
            />
            {timeline.map((m, i) => (
              <div key={i} className="flex flex-col items-center flex-1 relative z-10">
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-semibold ${
                    m.color === "red"   ? "bg-red-50   border-red-300   text-red-600"   :
                    m.color === "green" ? "bg-green-50 border-green-300 text-green-600" :
                    "bg-gray-50 border-gray-300 text-gray-500"
                  }`}
                >
                  {i + 1}
                </div>
                <p className="text-xs font-semibold text-gray-700 mt-2">{m.label}</p>
                <p
                  className={`text-xs mt-0.5 font-medium text-center ${
                    m.color === "red"   ? "text-red-600"   :
                    m.color === "green" ? "text-green-600" :
                    "text-gray-500"
                  }`}
                >
                  {m.state}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div>
        <SectionLabel>Prioritised Actions</SectionLabel>
        <div className="space-y-4">
          {priorities.map((p) => (
            <div key={p.n} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 border-b border-gray-200 px-5 py-2.5 flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-gray-900 text-white flex items-center justify-center text-xs font-semibold flex-shrink-0">
                  {p.n}
                </div>
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-widest">
                  Priority {p.n} — {p.timeframe}
                </p>
              </div>
              <div className="divide-y divide-gray-100">
                <div className="px-5 py-3.5">
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Objective</p>
                  <p className="text-sm font-medium text-gray-900">{p.objective}</p>
                </div>
                <div className="px-5 py-3.5">
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Action</p>
                  <p className="text-sm text-gray-700">{p.action}</p>
                </div>
                <div className="px-5 py-3.5">
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Regulatory Impact</p>
                  <p className="text-sm text-gray-700">{p.impact}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <DarkFinding>
        <p className="font-medium">Projected outcome</p>
        <p>
          Full Article 14 decision context coverage achievable within 90 days with correct
          instrumentation.
        </p>
        <p className="font-semibold">
          Current exposure: HIGH. Post-remediation exposure: LOW.
        </p>
      </DarkFinding>
    </div>
  );
}

// ─── Panel shell ─────────────────────────────────────────────────────────────

function PanelShell({ id }: { id: PanelId }) {
  const mod = MODULES.find((m) => m.id === id)!;

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-start gap-3 mb-1">
          <span className="text-xs font-mono text-gray-300 mt-1.5 flex-shrink-0">
            {String(id).padStart(2, "0")}
          </span>
          <div>
            <h1 className="text-xl font-semibold text-gray-900 mb-1.5">{mod.title}</h1>
            <div className="flex items-center gap-2 flex-wrap">
              <EvidenceBadge status={mod.status} />
              <span className="text-xs text-gray-400">{mod.description}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-200 pt-6">
        {id === 1 && <Panel1 />}
        {id === 2 && <Panel2 />}
        {id === 3 && <Panel3 />}
        {id === 4 && <Panel4 />}
        {id === 5 && <Panel5 />}
        {id === 6 && <Panel6 />}
      </div>
    </div>
  );
}

// ─── Footer ──────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white px-4 lg:px-6 py-6 mt-auto">
      <div className="max-w-6xl mx-auto space-y-1.5">
        <p className="text-xs text-gray-400">
          Proof of concept — synthetic data — Giggle AI Innovation
        </p>
        <p className="text-xs text-gray-400">
          This dossier illustrates how oversight evidence may be assessed under Article 14 of the EU
          AI Act. The example is synthetic and does not represent a real healthcare organisation,
          clinician, patient, or clinical system.
        </p>
        <p className="text-xs text-gray-400">
          Full production dossiers with live execution evidence are available under NDA. Contact{" "}
          <a
            href="mailto:info@giggleaiinnovation.com"
            className="underline hover:text-gray-600 transition-colors"
          >
            info@giggleaiinnovation.com
          </a>{" "}
          to begin the conversation.
        </p>
      </div>
    </footer>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function DemoPage() {
  const [activePanel, setActivePanel] = useState<PanelId | null>(null);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <TopBar activePanel={activePanel} onBack={() => setActivePanel(null)} />

      {activePanel === null && (
        <>
          <DossierHeader />
          <AssessmentQuestion />
        </>
      )}

      <div className="flex-1 max-w-6xl mx-auto w-full px-4 lg:px-6 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <aside className="w-full lg:w-64 flex-shrink-0 lg:sticky lg:top-12 lg:self-start">
            <FindingRail />
          </aside>
          <div className="flex-1 min-w-0">
            {activePanel === null ? (
              <ModuleList onOpen={setActivePanel} />
            ) : (
              <PanelShell id={activePanel} />
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
