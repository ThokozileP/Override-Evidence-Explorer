from __future__ import annotations
from datetime import datetime
from typing import Any
from pydantic import BaseModel, Field


class DecisionContextIn(BaseModel):
    ui_context_json: dict[str, Any] | None = None
    recommendation_visible: bool | None = None
    confidence_visible: bool | None = None


class DecisionEventIn(BaseModel):
    decision_id: str
    system_name: str
    model_version: str | None = None
    model_output: str
    confidence_score: float | None = None
    threshold: float | None = None
    human_action: str
    final_decision: str
    timestamp: datetime | None = None
    context: DecisionContextIn | None = None


class DecisionEventOut(BaseModel):
    id: str
    decision_id: str
    system_name: str
    model_version: str | None
    model_output: str
    confidence_score: float | None
    threshold: float | None
    human_action: str
    final_decision: str
    timestamp: datetime
    # joined
    recommendation_visible: bool | None = None
    confidence_visible: bool | None = None
    is_complete: bool | None = None
    missing_fields: list[str] | None = None
    severity: str | None = None


class EvidenceSummaryOut(BaseModel):
    total_overrides: int
    high_confidence_overrides: int
    incomplete_evidence_count: int
    severity_breakdown: dict[str, int]
    top_missing_fields: list[dict[str, Any]]
    ai_summary: str | None = None
