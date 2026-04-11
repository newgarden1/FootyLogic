from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import matches, leagues, teams, players

app = FastAPI(
    title="FootyLogic API",
    description="API-Football 기반 축구 데이터 분석 백엔드",
    version="0.1.0",
)

# Next.js 개발 서버 / 배포 도메인 허용
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://footylogic.vercel.app",  # 추후 배포 주소로 교체
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
    from app.config import API_FOOTBALL_KEY
    return {
        "status": "ok",
        "api_key_set": bool(API_FOOTBALL_KEY),
    }
