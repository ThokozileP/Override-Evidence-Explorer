from __future__ import annotations

REQUIRED_EVENT_FIELDS = [
    "model_version",
    "confidence_score",
    "threshold",
    "human_action",
    "final_decision",
]
REQUIRED_CONTEXT_FIELDS = [
    "recommendation_visible",
    "confidence_visible",
]


def check_completeness(
    event: dict,
    context: dict | None,
) -> tuple[bool, list[str], str]:
    """Return (is_complete, missing_fields, severity)."""
    missing: list[str] = []

    for field in REQUIRED_EVENT_FIELDS:
        if event.get(field) is None:
            missing.append(field)

    ctx = context or {}
    for field in REQUIRED_CONTEXT_FIELDS:
        if ctx.get(field) is None:
            missing.append(field)

    if len(missing) == 0:
        severity = "low"
    elif len(missing) <= 2:
        severity = "medium"
    else:
        severity = "high"

    return len(missing) == 0, missing, severity
