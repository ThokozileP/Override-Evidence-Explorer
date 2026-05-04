import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from app.routers import decisions, summary, seed

load_dotenv()

app = FastAPI(title="Override Evidence Explorer API", version="0.1.0")

allowed_origins = os.environ.get("ALLOWED_ORIGINS", "http://localhost:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(decisions.router)
app.include_router(summary.router)
app.include_router(seed.router)


@app.get("/healthz")
def health():
    return {"status": "ok"}
