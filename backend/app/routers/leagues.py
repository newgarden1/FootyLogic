from fastapi import APIRouter, Query
from app.api_client import get

router = APIRouter(prefix="/leagues", tags=["leagues"])

# 주요 리그 ID 상수
LEAGUE_IDS = {
    "epl":        39,
    "laliga":     140,
    "bundesliga": 78,
    "seriea":     135,
    "ligue1":     61,
    "kleague1":   292,
}


@router.get("/")
async def list_leagues():
    """지원하는 주요 리그 목록 반환."""
    return {"leagues": LEAGUE_IDS}


@router.get("/{league_id}/standings")
async def standings(
    league_id: int,
    season: int = Query(2024, description="시즌 연도"),
):
    """리그 순위표 반환."""
    return await get("standings", {"league": league_id, "season": season})


@router.get("/{league_id}/top-scorers")
async def top_scorers(
    league_id: int,
    season: int = Query(2024),
):
    """득점 순위 반환."""
    return await get("players/topscorers", {"league": league_id, "season": season})


@router.get("/{league_id}/top-assists")
async def top_assists(
    league_id: int,
    season: int = Query(2024),
):
    """어시스트 순위 반환."""
    return await get("players/topassists", {"league": league_id, "season": season})
