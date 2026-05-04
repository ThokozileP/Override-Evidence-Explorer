-- Override Evidence Explorer — Supabase schema
-- Run this in your Supabase SQL editor (Project > SQL Editor > New query)

create extension if not exists "pgcrypto";

-- ─── decision_events ────────────────────────────────────────────────────────
create table if not exists decision_events (
  id               uuid primary key default gen_random_uuid(),
  decision_id      text unique not null,
  system_name      text not null,
  model_version    text,
  model_output     text not null,
  confidence_score numeric,
  threshold        numeric,
  human_action     text not null,   -- "override" | "accepted" | "deferred"
  final_decision   text not null,
  timestamp        timestamptz not null default now()
);

create index if not exists idx_de_human_action       on decision_events (human_action);
create index if not exists idx_de_confidence_score   on decision_events (confidence_score);
create index if not exists idx_de_timestamp          on decision_events (timestamp desc);

-- ─── decision_context ───────────────────────────────────────────────────────
create table if not exists decision_context (
  id                      uuid primary key default gen_random_uuid(),
  decision_id             text not null references decision_events(decision_id) on delete cascade,
  ui_context_json         jsonb,
  recommendation_visible  boolean,
  confidence_visible      boolean
);

create unique index if not exists idx_dc_decision_id on decision_context (decision_id);

-- ─── evidence_status ────────────────────────────────────────────────────────
create table if not exists evidence_status (
  id             uuid primary key default gen_random_uuid(),
  decision_id    text not null references decision_events(decision_id) on delete cascade,
  is_complete    boolean not null,
  missing_fields jsonb,             -- array of field name strings
  severity       text not null,     -- "low" | "medium" | "high"
  checked_at     timestamptz not null default now()
);

create unique index if not exists idx_es_decision_id on evidence_status (decision_id);
create index        if not exists idx_es_severity    on evidence_status (severity);
