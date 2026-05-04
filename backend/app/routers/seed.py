from __future__ import annotations
import json
import uuid
import random
from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, HTTPException

from app.db import get_conn
from app.services.evidence import check_completeness

router = APIRouter()

SYSTEMS = [
    ("RadTriage-AI", "radiology triage"),
    ("OncologyRisk-v2", "oncology risk scoring"),
    ("CDPX-Deterioration", "clinical deterioration prediction"),
    ("PreOpPlanner", "pre-op planning"),
]

MODEL_VERSIONS = ["v1.0", "v1.2", "v2.0", "v2.1", None]

OUTPUTS = {
    "radiology triage": [
        "Pneumothorax suspected — priority escalation recommended",
        "No acute abnormality detected",
        "Pulmonary consolidation — possible pneumonia",
        "Pleural effusion detected — further review advised",
    ],
    "oncology risk scoring": [
        "High malignancy risk (0.87) — biopsy recommended",
        "Low malignancy risk (0.12) — routine follow-up",
        "Intermediate risk (0.54) — 3-month surveillance",
        "High recurrence risk (0.91) — adjuvant therapy consideration",
    ],
    "clinical deterioration prediction": [
        "Deterioration within 6 h — ICU consult recommended",
        "Stable trajectory — standard monitoring",
        "Moderate deterioration risk (0.73) — increase observation frequency",
        "Sepsis early warning — escalation advised",
    ],
    "pre-op planning": [
        "High surgical risk (ASA-IV equivalent) — anaesthesia review required",
        "Routine risk profile — standard pre-op pathway",
        "Cardiac risk elevated — cardiology clearance advised",
        "Airway concern flagged — senior anaesthetist required",
    ],
}

HUMAN_ACTIONS = ["override", "accepted", "deferred"]


def _random_ts(days_back: int = 90) -> datetime:
    delta = timedelta(seconds=random.randint(0, days_back * 86400))
    return datetime.now(timezone.utc) - delta


def _build_record(force_override: bool = False, force_high_conf: bool = False) -> dict:
    system_name, category = random.choice(SYSTEMS)
    model_version = random.choice(MODEL_VERSIONS)
    model_output = random.choice(OUTPUTS[category])

    # Confidence / threshold
    has_confidence = random.random() > 0.15
    has_threshold = random.random() > 0.15
    confidence_score = round(random.uniform(0.5, 0.99), 2) if has_confidence else None
    threshold = round(random.uniform(0.55, 0.80), 2) if has_threshold else None

    if force_high_conf:
        confidence_score = round(random.uniform(0.82, 0.99), 2)
        threshold = round(random.uniform(0.55, 0.75), 2)

    human_action = "override" if force_override else random.choice(HUMAN_ACTIONS)
    final_decision = (
        "Clinician decision recorded — AI recommendation not followed"
        if human_action == "override"
        else "AI recommendation followed"
    )

    # Context — sometimes missing fields
    rec_visible = random.choice([True, False, None])
    conf_visible = random.choice([True, False, None])

    return {
        "decision_id": f"DEC-{uuid.uuid4().hex[:10].upper()}",
        "system_name": system_name,
        "model_version": model_version,
        "model_output": model_output,
        "confidence_score": confidence_score,
        "threshold": threshold,
        "human_action": human_action,
        "final_decision": final_decision,
        "timestamp": _random_ts(),
        "context": {
            "recommendation_visible": rec_visible,
            "confidence_visible": conf_visible,
        },
    }


@router.post("/seed-demo-data", status_code=201)
def seed_demo_data(clear: bool = False):
    records = []

    # 25 high-confidence overrides (guaranteed)
    for _ in range(25):
        records.append(_build_record(force_override=True, force_high_conf=True))

    # 25 regular overrides (mixed completeness)
    for _ in range(25):
        records.append(_build_record(force_override=True))

    # 30 non-override decisions
    for _ in range(30):
        records.append(_build_record())

    with get_conn() as conn:
        cur = conn.cursor()

        if clear:
            cur.execute("delete from evidence_status")
            cur.execute("delete from decision_context")
            cur.execute("delete from decision_events")

        inserted = 0
        for r in records:
            ctx = r.pop("context", {})
            event_dict = {
                "model_version": r["model_version"],
                "confidence_score": r["confidence_score"],
                "threshold": r["threshold"],
                "human_action": r["human_action"],
                "final_decision": r["final_decision"],
            }
            is_complete, missing, severity = check_completeness(event_dict, ctx)

            cur.execute(
                """
                insert into decision_events
                  (id, decision_id, system_name, model_version, model_output,
                   confidence_score, threshold, human_action, final_decision, timestamp)
                values (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
                on conflict (decision_id) do nothing
                """,
                (
                    str(uuid.uuid4()),
                    r["decision_id"],
                    r["system_name"],
                    r["model_version"],
                    r["model_output"],
                    r["confidence_score"],
                    r["threshold"],
                    r["human_action"],
                    r["final_decision"],
                    r["timestamp"],
                ),
            )

            if cur.rowcount:
                if ctx:
                    cur.execute(
                        """
                        insert into decision_context
                          (id, decision_id, ui_context_json, recommendation_visible, confidence_visible)
                        values (%s,%s,%s,%s,%s)
                        on conflict (decision_id) do nothing
                        """,
                        (
                            str(uuid.uuid4()),
                            r["decision_id"],
                            None,
                            ctx.get("recommendation_visible"),
                            ctx.get("confidence_visible"),
                        ),
                    )

                cur.execute(
                    """
                    insert into evidence_status
                      (id, decision_id, is_complete, missing_fields, severity)
                    values (%s,%s,%s,%s,%s)
                    on conflict (decision_id) do nothing
                    """,
                    (
                        str(uuid.uuid4()),
                        r["decision_id"],
                        is_complete,
                        json.dumps(missing),
                        severity,
                    ),
                )
                inserted += 1

    return {"inserted": inserted, "total_attempted": len(records)}
