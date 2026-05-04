from __future__ import annotations
import json
import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException

from app.db import get_conn
from app.models.schemas import DecisionEventIn, DecisionEventOut
from app.services.evidence import check_completeness

router = APIRouter()


@router.post("/decision-events", response_model=DecisionEventOut, status_code=201)
def create_decision_event(payload: DecisionEventIn):
    ts = payload.timestamp or datetime.now(timezone.utc)
    ctx = payload.context

    event_dict = {
        "model_version": payload.model_version,
        "confidence_score": payload.confidence_score,
        "threshold": payload.threshold,
        "human_action": payload.human_action,
        "final_decision": payload.final_decision,
    }
    ctx_dict = ctx.model_dump() if ctx else {}

    is_complete, missing, severity = check_completeness(event_dict, ctx_dict)

    with get_conn() as conn:
        cur = conn.cursor()

        # Insert decision event
        cur.execute(
            """
            insert into decision_events
              (id, decision_id, system_name, model_version, model_output,
               confidence_score, threshold, human_action, final_decision, timestamp)
            values (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
            on conflict (decision_id) do nothing
            returning *
            """,
            (
                str(uuid.uuid4()),
                payload.decision_id,
                payload.system_name,
                payload.model_version,
                payload.model_output,
                payload.confidence_score,
                payload.threshold,
                payload.human_action,
                payload.final_decision,
                ts,
            ),
        )
        row = cur.fetchone()
        if row is None:
            raise HTTPException(409, f"decision_id '{payload.decision_id}' already exists")

        # Insert context
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
                    payload.decision_id,
                    json.dumps(ctx.ui_context_json) if ctx.ui_context_json else None,
                    ctx.recommendation_visible,
                    ctx.confidence_visible,
                ),
            )

        # Insert evidence status
        cur.execute(
            """
            insert into evidence_status
              (id, decision_id, is_complete, missing_fields, severity)
            values (%s,%s,%s,%s,%s)
            on conflict (decision_id) do nothing
            """,
            (
                str(uuid.uuid4()),
                payload.decision_id,
                is_complete,
                json.dumps(missing),
                severity,
            ),
        )

    return DecisionEventOut(
        id=str(row["id"]),
        decision_id=row["decision_id"],
        system_name=row["system_name"],
        model_version=row["model_version"],
        model_output=row["model_output"],
        confidence_score=float(row["confidence_score"]) if row["confidence_score"] is not None else None,
        threshold=float(row["threshold"]) if row["threshold"] is not None else None,
        human_action=row["human_action"],
        final_decision=row["final_decision"],
        timestamp=row["timestamp"],
        recommendation_visible=ctx.recommendation_visible if ctx else None,
        confidence_visible=ctx.confidence_visible if ctx else None,
        is_complete=is_complete,
        missing_fields=missing,
        severity=severity,
    )


@router.get("/overrides/high-confidence", response_model=list[DecisionEventOut])
def get_high_confidence_overrides(incomplete_only: bool = False):
    with get_conn() as conn:
        cur = conn.cursor()
        cur.execute(
            """
            select
              de.*,
              dc.recommendation_visible,
              dc.confidence_visible,
              es.is_complete,
              es.missing_fields,
              es.severity
            from decision_events de
            left join decision_context dc on dc.decision_id = de.decision_id
            left join evidence_status  es on es.decision_id = de.decision_id
            where de.human_action = 'override'
              and de.confidence_score is not null
              and de.threshold is not null
              and de.confidence_score > de.threshold
            order by de.timestamp desc
            """
        )
        rows = cur.fetchall()

    results = []
    for r in rows:
        missing = r["missing_fields"] if isinstance(r["missing_fields"], list) else (r["missing_fields"] or [])
        is_complete = r["is_complete"]
        if incomplete_only and is_complete:
            continue
        results.append(
            DecisionEventOut(
                id=str(r["id"]),
                decision_id=r["decision_id"],
                system_name=r["system_name"],
                model_version=r["model_version"],
                model_output=r["model_output"],
                confidence_score=float(r["confidence_score"]) if r["confidence_score"] is not None else None,
                threshold=float(r["threshold"]) if r["threshold"] is not None else None,
                human_action=r["human_action"],
                final_decision=r["final_decision"],
                timestamp=r["timestamp"],
                recommendation_visible=r["recommendation_visible"],
                confidence_visible=r["confidence_visible"],
                is_complete=is_complete,
                missing_fields=missing,
                severity=r["severity"],
            )
        )
    return results
