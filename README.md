# Override Evidence Explorer — MVP

Help regulated AI / healthcare AI teams prove what happened when a human overrode an AI recommendation.

---

## Folder structure

```
Override-Evidence-Explorer/
├── database/
│   └── schema.sql          ← run once in Supabase SQL editor
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── db.py
│   │   ├── models/schemas.py
│   │   ├── routers/
│   │   │   ├── decisions.py
│   │   │   ├── summary.py
│   │   │   └── seed.py
│   │   └── services/
│   │       ├── evidence.py
│   │       └── ai_summary.py
│   ├── requirements.txt
│   └── .env.example
└── frontend/
    ├── app/page.tsx
    ├── components/
    │   ├── Dashboard.tsx
    │   ├── OverridesTable.tsx
    │   ├── SummaryCards.tsx
    │   └── SeverityBadge.tsx
    ├── lib/
    │   ├── api.ts
    │   └── types.ts
    └── .env.local.example
```

---

## Environment variables

### Backend — `backend/.env`

| Variable | Example | Notes |
|---|---|---|
| `SUPABASE_DB_URL` | `postgresql://postgres:PASSWORD@db.REF.supabase.co:5432/postgres` | Direct connection string from Supabase → Settings → Database |
| `OPENAI_API_KEY` | `sk-...` | Only needed for the AI summary feature |
| `ALLOWED_ORIGINS` | `http://localhost:3000,https://your-app.vercel.app` | Comma-separated CORS origins |

### Frontend — `frontend/.env.local`

| Variable | Example | Notes |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | `http://localhost:8000` | URL of the running FastAPI server |

---

## Local setup

### 1. Supabase database

1. Create a free project at supabase.com
2. Go to **SQL Editor → New query**
3. Paste and run `database/schema.sql`
4. Go to **Settings → Database** and copy the **Connection string (URI)**

### 2. Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env
# Edit .env — paste your SUPABASE_DB_URL and OPENAI_API_KEY

uvicorn app.main:app --reload --port 8000
```

API docs available at: http://localhost:8000/docs

### 3. Seed demo data

```bash
curl -X POST http://localhost:8000/seed-demo-data?clear=true
```

Or click the **"Seed demo data"** button in the UI.

### 4. Frontend

```bash
cd frontend
cp .env.local.example .env.local
# Edit if your backend runs on a different port

npm install
npm run dev
```

Open http://localhost:3000

---

## API endpoints

| Method | Path | Description |
|---|---|---|
| `POST` | `/decision-events` | Ingest a decision event |
| `GET` | `/overrides/high-confidence` | List high-confidence overrides |
| `GET` | `/overrides/high-confidence?incomplete_only=true` | Filter to incomplete evidence only |
| `GET` | `/evidence-summary` | Aggregated stats |
| `GET` | `/evidence-summary?with_ai=true` | Stats + OpenAI narrative summary |
| `POST` | `/seed-demo-data` | Insert 80 synthetic records |
| `POST` | `/seed-demo-data?clear=true` | Clear and re-seed |
| `GET` | `/healthz` | Health check |

---

## Deployment

### Frontend → Vercel

```bash
cd frontend
npx vercel --prod
```

Set environment variable in Vercel dashboard:
- `NEXT_PUBLIC_API_URL` = your backend URL (e.g. `https://override-api.fly.dev`)

### Backend → Railway (recommended for speed)

1. Push this repo to GitHub
2. Create a new Railway project → Deploy from GitHub
3. Set root directory to `backend`
4. Set start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Add environment variables: `SUPABASE_DB_URL`, `OPENAI_API_KEY`, `ALLOWED_ORIGINS`

### Backend → Fly.io alternative

```bash
cd backend
fly launch --name override-evidence-api
fly secrets set SUPABASE_DB_URL="..." OPENAI_API_KEY="..." ALLOWED_ORIGINS="https://your-app.vercel.app"
fly deploy
```

### Backend → Render alternative

1. New Web Service → connect GitHub repo
2. Root directory: `backend`
3. Build command: `pip install -r requirements.txt`
4. Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Add env vars in Render dashboard

---

## Evidence completeness rules

An override decision is **complete** when all of the following are present:
- `model_version`
- `confidence_score`
- `threshold`
- `human_action`
- `final_decision`
- `recommendation_visible` (from decision context)
- `confidence_visible` (from decision context)

Severity: **high** = 3+ missing fields · **medium** = 1–2 · **low** = complete

High-confidence override: `human_action = "override"` AND `confidence_score > threshold`
