"use client";

import { useState } from "react";
import Link from "next/link";

type PanelId = 1 | 2 | 3 | 4 | 5 | 6;
type StatusColor = "red" | "amber" | "green" | "gray";

const CARDS: Array<{
  id: PanelId;
  title: string;
  tag: string;
  status: { color: StatusColor; text: string };
}> = [
  {
    id: 1,
    title: "Executive Summary",
    tag: "Verdict · Key findings · Exposure level",
    status: { color: "red", text: "High Exposure" },
  },
  {
    id: 2,
    title: "Decision Context Record",
    tag: "Override reconstruction · Evidence captured vs missing",
    status: { color: "amber", text: "Incomplete" },
  },
  {
    id: 3,
    title: "Evidence Integrity",
    tag: "SHA-256 seal · Tamper status · Method",
    status: { color: "amber", text: "Partial" },
  },
  {
    id: 4,
    title: "Oversight Gap Analysis",
    tag: "Art. 14 requirements · What exists · What is missing",
    status: { color: "red", text: "5 of 5 Gaps" },
  },
  {
    id: 5,
    title: "Clinician Override Log",
    tag: "Session-by-session · Override events · Context status",
    status: { color: "amber", text: "47 Events" },
  },
  {
    id: 6,
    title: "Remediation Playbook",
    tag: "Prioritised actions · Timeline · What changes first",
    status: { color: "gray", text: "90-Day Plan" },
  },
];

// ─── Atoms ───────────────────────────────────────────────────────────────────

function StatusPill({ color, text }: { color: StatusColor; text: string }) {
  const cls: Record<StatusColor, string> = {
    red:   "bg-red-50   text-red-700   border-red-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    green: "bg-green-50 text-green-700 border-green-200",
    gray:  "bg-gray-100 text-gray-600  border-gray-200",
  };
  return (
    <span
      className={`inline-flex items-center text-xs font-semibold border rounded px-2 py-0.5 uppercase tracking-wide whitespace-nowrap ${cls[color]}`}
    >
      {text}
    </span>
  );
}

function Label({ children }: { children: string }) {
  return (
    <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
      {children}
    </p>
  );
}

// ─── Panel 1: Executive Summary ──────────────────────────────────────────────

function Panel1() {
  const findings: Array<{ icon: "neutral" | "bad" | "partial"; text: string }> = [
    { icon: "neutral", text: "47 override events recorded in the audit period" },
    { icon: "bad",     text: "0 override events with complete decision context captured" },
    { icon: "bad",     text: "Recommendation as displayed: not captured in any session" },
    { icon: "bad",     text: "Confidence score at decision point: not captured" },
    { icon: "bad",     text: "Model version at override moment: not captured" },
    { icon: "bad",     text: "Clinical context available to reviewer: not captured" },
    { icon: "partial", text: "Clinician rationale: captured in 12 of 47 events (25%)" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <Label>Verdict</Label>
        <div className="bg-white border border-gray-200 rounded-lg p-5 space-y-3">
          {(
            [
              { label: "Overall verdict",  color: "amber" as StatusColor, text: "Decision Context Gap Identified" },
              { label: "Overall exposure", color: "red"   as StatusColor, text: "High" },
              { label: "Art. 14 status",   color: "red"   as StatusColor, text: "Non-compliant — oversight evidence incomplete" },
            ] as const
          ).map((row) => (
            <div key={row.label} className="flex items-center gap-3">
              <span className="text-xs text-gray-500 w-36 flex-shrink-0">{row.label}</span>
              <StatusPill color={row.color} text={row.text} />
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label>Key Findings</Label>
        <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-100">
          {findings.map((f, i) => (
            <div key={i} className="flex items-start gap-3 px-5 py-3">
              <span
                className={`font-bold mt-0.5 flex-shrink-0 ${
                  f.icon === "bad"     ? "text-red-500"   :
                  f.icon === "partial" ? "text-amber-500" :
                  "text-gray-300"
                }`}
              >
                {f.icon === "bad" ? "✗" : f.icon === "partial" ? "⚠" : "·"}
              </span>
              <span className="text-sm text-gray-700">{f.text}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label>Exposure Statement</Label>
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-5">
          <p className="text-sm text-amber-900 leading-relaxed">
            "This system can demonstrate that overrides occurred. It cannot demonstrate how oversight
            was exercised. Under Art. 14, these are not equivalent. A notified body audit requesting
            decision reconstruction would find incomplete evidence for all 47 events."
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Panel 2: Decision Context Record ────────────────────────────────────────

function Panel2() {
  const captured    = ["Override occurred", "Clinician ID", "Timestamp", "Final action taken"];
  const notCaptured = [
    "Recommendation as displayed",
    "Confidence score shown",
    "Model version active",
    "Clinical context available",
    "Intervention options shown",
    "Rationale recorded",
  ];

  return (
    <div className="space-y-8">
      <div>
        <Label>Override Event</Label>
        <div className="bg-white border border-gray-200 rounded-lg p-5 grid grid-cols-2 gap-4">
          {(
            [
              { label: "Event reference", value: "Override #31",                      mono: false },
              { label: "Timestamp",       value: "14 March 2025, 09:48:11 UTC",       mono: true  },
              { label: "Clinician",       value: "Dr. A. Mensah",                     mono: false },
              { label: "System",          value: "ClinicalRisk-v2.3.1",               mono: true  },
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
        <Label>Evidence State</Label>
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="grid grid-cols-2 divide-x divide-gray-200">
            <div>
              <div className="bg-green-50 px-5 py-3 border-b border-green-100">
                <p className="text-xs font-semibold text-green-700 uppercase tracking-wide">Captured</p>
              </div>
              <div className="divide-y divide-gray-100">
                {captured.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 px-5 py-3">
                    <span className="text-green-600 font-bold flex-shrink-0">✓</span>
                    <span className="text-sm text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="bg-red-50 px-5 py-3 border-b border-red-100">
                <p className="text-xs font-semibold text-red-700 uppercase tracking-wide">Not Captured</p>
              </div>
              <div className="divide-y divide-gray-100">
                {notCaptured.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 px-5 py-3">
                    <span className="text-red-500 font-bold flex-shrink-0">✗</span>
                    <span className="text-sm text-red-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <Label>Gap Statement</Label>
        <div className="bg-gray-900 text-white rounded-lg p-5">
          <p className="text-sm leading-relaxed">
            "The decision environment that existed at 09:48:11 UTC on 14 March 2025 cannot be
            reconstructed. The override is evidenced. The oversight is not."
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Panel 3: Evidence Integrity ─────────────────────────────────────────────

function Panel3() {
  const fields: Array<{ label: string; status: "pass" | "partial" | "fail"; note: string }> = [
    { label: "Override event log",                  status: "pass",    note: "SHA-256 sealed"         },
    { label: "Decision context record",             status: "fail",    note: "Not generated"          },
    { label: "Contemporaneous capture",             status: "fail",    note: "Not implemented"        },
    { label: "Tamper-evident at point of decision", status: "fail",    note: "No"                     },
    { label: "Independently verifiable",            status: "partial", note: "Partial — log only"     },
  ];

  const iconCls = { pass: "text-green-600", partial: "text-amber-500", fail: "text-red-500" };
  const noteCls = { pass: "text-green-600", partial: "text-amber-600", fail: "text-red-600" };
  const icons   = { pass: "✓",              partial: "⚠",              fail: "✗"            };

  return (
    <div className="space-y-8">
      <div>
        <Label>Seal Status</Label>
        <div className="bg-white border border-gray-200 rounded-lg p-5 space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500 w-28 flex-shrink-0">Seal status</span>
            <StatusPill color="amber" text="Partial" />
          </div>
          <div className="flex items-start gap-3">
            <span className="text-xs text-gray-500 w-28 flex-shrink-0 pt-0.5">Method</span>
            <span className="text-sm text-gray-700">
              Post-hoc log aggregation (not contemporaneous capture)
            </span>
          </div>
        </div>
      </div>

      <div>
        <Label>Evidence Fields</Label>
        <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-100">
          {fields.map((f, i) => (
            <div key={i} className="flex items-center gap-3 px-5 py-3.5">
              <span className={`font-bold flex-shrink-0 ${iconCls[f.status]}`}>{icons[f.status]}</span>
              <span className="text-sm text-gray-700 flex-1">{f.label}</span>
              <span className={`text-xs ${noteCls[f.status]}`}>{f.note}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label>Integrity Statement</Label>
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-5">
          <p className="text-sm text-amber-900 leading-relaxed">
            "Evidence sealed after the fact reflects what the system recorded — not what the
            clinician saw. Sealing a log of outcomes is not equivalent to sealing a record of the
            decision environment. Reconstruction is not evidence."
          </p>
        </div>
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
        <Label>Art. 14 Requirements vs Evidence</Label>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm border border-gray-200 rounded-lg overflow-hidden">
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
                        className={`font-bold flex-shrink-0 mt-0.5 ${
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

      <div className="bg-gray-900 text-white rounded-lg p-5">
        <p className="text-sm font-medium">
          5 of 5 Art. 14 oversight requirements have evidence gaps at the point of decision.
        </p>
      </div>
    </div>
  );
}

// ─── Panel 5: Clinician Override Log ─────────────────────────────────────────

function Panel5() {
  const events: Array<{
    num: number;
    date: string;
    clinician: string;
    rec: string;
    action: string;
    context: "none" | "partial";
  }> = [
    { num: 31, date: "14 Mar 2025", clinician: "Dr. A. Mensah", rec: "Heparin 5,000 IU",       action: "Alternative selected",         context: "none"    },
    { num: 28, date: "11 Mar 2025", clinician: "Dr. C. Osei",   rec: "Warfarin 5mg",            action: "Dose modified",                context: "none"    },
    { num: 24, date: "07 Mar 2025", clinician: "Dr. A. Mensah", rec: "CT scan ordered",         action: "Deferred — MRI selected",      context: "none"    },
    { num: 19, date: "02 Mar 2025", clinician: "Dr. R. Bakker", rec: "Chemotherapy protocol A", action: "Protocol B selected",          context: "none"    },
    { num: 15, date: "26 Feb 2025", clinician: "Dr. C. Osei",   rec: "Biopsy recommended",      action: "Watchful waiting",             context: "partial" },
    { num: 12, date: "21 Feb 2025", clinician: "Dr. L. Visser", rec: "Referral to oncology",    action: "Managed in-house",             context: "partial" },
    { num:  8, date: "14 Feb 2025", clinician: "Dr. R. Bakker", rec: "Immunotherapy initiated", action: "Delayed — MDT review",         context: "none"    },
    { num:  3, date: "07 Feb 2025", clinician: "Dr. L. Visser", rec: "Palliative referral",     action: "Curative pathway continued",   context: "partial" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <Label>Override Events — Excerpt (8 of 47)</Label>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm border border-gray-200 rounded-lg overflow-hidden">
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
                      <span className="inline-flex items-center gap-1 text-xs text-red-600">
                        <span className="font-bold">✗</span> None
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs text-amber-600">
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

      <div className="bg-amber-50 border border-amber-200 rounded-lg px-5 py-4">
        <p className="text-sm text-amber-900">
          47 override events in audit period.{" "}
          <strong>0 with complete decision context.</strong>{" "}
          12 with partial rationale only.
        </p>
      </div>
    </div>
  );
}

// ─── Panel 6: Remediation Playbook ───────────────────────────────────────────

function Panel6() {
  const priorities = [
    {
      n: 1,
      timeframe: "Immediate (0–30 days)",
      action:
        "Instrument the decision presentation layer to capture recommendation, confidence score, and model version at the moment of display.",
      why:
        "This is the minimum evidence set for Art. 14 reconstruction. Without it, no override event has defensible oversight evidence.",
    },
    {
      n: 2,
      timeframe: "Short term (30–60 days)",
      action:
        "Implement contemporaneous context capture — clinical flags, intervention options, patient data snapshot available at decision point — sealed at the moment of override, not aggregated afterward.",
      why:
        "Sealing after the fact does not meet the 'generatable, not reconstructed' standard for notified body audit.",
    },
    {
      n: 3,
      timeframe: "Medium term (60–90 days)",
      action:
        "Structured rationale capture — a required or optional reason code field at the override moment, stored as part of the decision context record.",
      why:
        "Rationale is the highest-value evidence element for regulatory defence. Currently present in 25% of events — needs to reach 100%.",
    },
    {
      n: 4,
      timeframe: "Ongoing",
      action:
        "Session-level compliance review — monthly audit of decision context completeness against Art. 14 checkpoint list.",
      why:
        "Evidence gaps compound. A missed capture in March cannot be remediated in September.",
    },
  ];

  return (
    <div className="space-y-6">
      {priorities.map((p) => (
        <div key={p.n} className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center text-sm font-semibold">
              {p.n}
            </div>
            <div className="flex-1 space-y-3">
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">
                  Priority {p.n} — {p.timeframe}
                </p>
                <p className="text-sm text-gray-900">{p.action}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Why first</p>
                <p className="text-sm text-gray-600">{p.why}</p>
              </div>
            </div>
          </div>
        </div>
      ))}

      <div className="bg-gray-900 text-white rounded-lg p-5">
        <p className="text-sm leading-relaxed">
          Projected outcome: Full Art. 14 decision context coverage achievable within 90 days with
          correct instrumentation.{" "}
          <strong>Current exposure: HIGH. Post-remediation exposure: LOW.</strong>
        </p>
      </div>
    </div>
  );
}

// ─── Panel shell ─────────────────────────────────────────────────────────────

function PanelShell({ id }: { id: PanelId }) {
  const card = CARDS.find((c) => c.id === id)!;

  return (
    <main className="flex-1 w-full max-w-4xl mx-auto px-6 py-8">
      <div className="mb-6 flex items-start gap-3">
        <span className="text-xs font-mono text-gray-300 mt-1.5">
          {String(id).padStart(2, "0")}
        </span>
        <div>
          <h1 className="text-xl font-semibold text-gray-900 mb-1.5">{card.title}</h1>
          <div className="flex items-center gap-2 flex-wrap">
            <StatusPill color={card.status.color} text={card.status.text} />
            <span className="text-xs text-gray-400">{card.tag}</span>
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
    </main>
  );
}

// ─── Dossier index ────────────────────────────────────────────────────────────

function DossierIndex({ onOpen }: { onOpen: (id: PanelId) => void }) {
  return (
    <>
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-start justify-between gap-6 mb-4">
            <div>
              <p className="text-xs font-mono text-gray-400 mb-1">Case Reference: MC-2025-0314</p>
              <h1 className="text-xl font-semibold text-gray-900">
                ClinicalRisk AI — Oncology Decision Support
              </h1>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                {["High-risk", "Annex III", "EU MDR + EU AI Act Art. 14"].map((tag) => (
                  <span
                    key={tag}
                    className="text-xs bg-gray-100 text-gray-700 border border-gray-200 rounded px-2 py-0.5"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex-shrink-0 pt-1">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-300 rounded px-3 py-1.5 uppercase tracking-wide">
                ⚠ Decision Context Gap Identified
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400 font-mono mb-3">
            <span>SHA-256 sealed</span>
            <span>·</span>
            <span>Generated: 14 March 2025</span>
          </div>
          <p className="text-sm text-gray-500 italic">
            Override events recorded. Decision context not captured. Art. 14 oversight evidence
            incomplete.
          </p>
        </div>
      </div>

      <main className="flex-1 w-full max-w-4xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {CARDS.map((card) => (
            <button
              key={card.id}
              onClick={() => onOpen(card.id)}
              className="text-left bg-white border border-gray-200 rounded-lg p-5 hover:border-gray-400 hover:shadow-sm transition-all group"
            >
              <div className="flex items-start justify-between gap-2 mb-4">
                <span className="text-xs font-mono text-gray-300">
                  {String(card.id).padStart(2, "0")}
                </span>
                <StatusPill color={card.status.color} text={card.status.text} />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">{card.title}</h3>
              <p className="text-xs text-gray-400 leading-relaxed">{card.tag}</p>
              <div className="mt-5 text-xs text-gray-300 group-hover:text-gray-500 transition-colors">
                Open report →
              </div>
            </button>
          ))}
        </div>
      </main>
    </>
  );
}

// ─── Footer ──────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-gray-50 px-6 py-4 text-center space-y-1">
      <p className="text-xs text-gray-400">
        Proof of concept — synthetic data — Giggle AI Innovation
      </p>
      <p className="text-xs text-gray-400">
        This dossier demonstrates the decision context record format. It does not represent a real
        clinical system or real patient data.
      </p>
    </footer>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function DemoPage() {
  const [activePanel, setActivePanel] = useState<PanelId | null>(null);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center">
        {activePanel === null ? (
          <Link
            href="/"
            className="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1.5 transition-colors"
          >
            <span aria-hidden="true">←</span>
            <span>Back to dashboard</span>
          </Link>
        ) : (
          <button
            onClick={() => setActivePanel(null)}
            className="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1.5 transition-colors"
          >
            <span aria-hidden="true">←</span>
            <span>Back to dossier</span>
          </button>
        )}
      </header>

      {activePanel === null ? (
        <DossierIndex onOpen={setActivePanel} />
      ) : (
        <PanelShell id={activePanel} />
      )}

      <Footer />
    </div>
  );
}
