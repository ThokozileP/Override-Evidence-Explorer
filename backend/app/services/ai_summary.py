from __future__ import annotations
import os
from openai import OpenAI

client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY", ""))


def generate_summary(stats: dict) -> str:
    """Ask the model to summarise pre-computed stats. Never invents data."""
    prompt = f"""You are a concise compliance analyst. Summarise the following
evidence completeness statistics for an AI override audit report. Use plain
professional language. Do not invent numbers or fields not present below.
Keep the response to 3-5 sentences.

Statistics:
- Total override decisions: {stats['total_overrides']}
- High-confidence overrides (confidence > threshold): {stats['high_confidence_overrides']}
- Overrides with incomplete evidence: {stats['incomplete_evidence_count']}
- Severity breakdown: {stats['severity_breakdown']}
- Most common missing fields: {stats['top_missing_fields']}

Write the summary now."""

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.2,
        max_tokens=300,
    )
    return response.choices[0].message.content.strip()
