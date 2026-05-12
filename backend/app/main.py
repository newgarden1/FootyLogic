from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import matches, leagues, teams, players

app = FastAPI(
    title="FootyLogic API",
    description="football-data.org 기반 축구 데이터 분석 백엔드",
    version="0.2.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://footylogic.newgarden2000.workers.dev",
    ],
    allow_methods=["GET"],
    allow_headers=["*"],
)

app.include_router(matches.router)
app.include_router(leagues.router)
app.include_router(teams.router)
app.include_router(players.router)


@app.get("/")
async def root():
    return {"status": "ok", "message": "FootyLogic API is running"}


@app.get("/health")
async def health():
    from app.config import FOOTBALL_DATA_KEY
    return {
        "status": "ok",
        "api_key_set": bool(FOOTBALL_DATA_KEY),
    }
