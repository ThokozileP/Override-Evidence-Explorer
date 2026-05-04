from __future__ import annotations
import json
from collections import Counter

from fastapi import APIRouter, Query

from app.db import get_conn
from app.models.schemas import EvidenceSummaryOut
from app.services.ai_summary import generate_summary

router = APIRouter()


@router.get("/evidence-summary", response_model=EvidenceSummaryOut)
def get_evidence_summary(with_ai: bool = Query(False)):
    with get_conn() as conn:
        cur = conn.cursor()

        # Total overrides
        cur.execute(
            "select count(*) as n from decision_events where human_action = 'override'"
        )
        total_overrides = cur.fetchone()["n"]

        # High-confidence overrides
        cur.execute(
            """
            select count(*) as n from decision_events
            where human_action = 'override'
              and confidence_score is not null
              and threshold is not null
              and confidence_score > threshold
            """
        )
        high_confidence_overrides = cur.fetchone()["n"]

        # Incomplete evidence among overrides
        cur.execute(
            """
            select count(*) as n
            from evidence_status es
            join decision_events de on de.decision_id = es.decision_id
            where de.human_action = 'override'
              and es.is_complete = false
            """
        )
        incomplete_evidence_count = cur.fetchone()["n"]

        # Severity breakdown (overrides only)
        cur.execute(
            """
            select es.severity, count(*) as n
            from evidence_status es
            join decision_events de on de.decision_id = es.decision_id
            where de.human_action = 'override'
            group by es.severity
            """
        )
        severity_breakdown = {r["severity"]: r["n"] for r in cur.fetchall()}

        # Top missing fields (overrides only)
        cur.execute(
            """
            select es.missing_fields
            from evidence_status es
            join decision_events de on de.decision_id = es.decision_id
            where de.human_action = 'override'
              and es.is_complete = false
            """
        )
        field_counter: Counter = Counter()
        for row in cur.fetchall():
            fields = row["missing_fields"]
            if isinstance(fields, list):
                field_counter.update(fields)
            elif isinstance(fields, str):
                field_counter.update(json.loads(fields))

        top_missing_fields = [
            {"field": f, "count": c} for f, c in field_counter.most_common(5)
        ]

    stats = {
        "total_overrides": total_overrides,
        "high_confidence_overrides": high_confidence_overrides,
        "incomplete_evidence_count": incomplete_evidence_count,
        "severity_breakdown": severity_breakdown,
        "top_missing_fields": top_missing_fields,
    }

    ai_summary = None
    if with_ai:
        ai_summary = generate_summary(stats)

    return EvidenceSummaryOut(ai_summary=ai_summary, **stats)
