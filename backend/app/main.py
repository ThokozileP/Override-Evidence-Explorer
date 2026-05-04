import os
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
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


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    # Return CORS headers even on unhandled errors so the browser can read the response.
    origin = request.headers.get("origin", "")
    headers = {"access-control-allow-origin": origin} if origin in allowed_origins else {}
    return JSONResponse(status_code=500, content={"detail": str(exc)}, headers=headers)

app.include_router(decisions.router)
app.include_router(summary.router)
app.include_router(seed.router)


@app.get("/healthz")
def health():
    return {"status": "ok"}
