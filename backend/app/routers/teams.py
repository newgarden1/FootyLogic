from fastapi import APIRouter, Query
from app.api_client import get

router = APIRouter(prefix="/teams", tags=["teams"])


@router.get("/search")
async def search_teams(name: str = Query(..., description="팀 이름 (영문)")):
    """팀 이름으로 검색."""
    return await get("teams", {"search": name})


@router.get("/{team_id}")
async def team_info(team_id: int):
    """팀 기본 정보."""
    return await get("teams", {"id": team_id})


@router.get("/{team_id}/statistics")
async def team_statistics(
    team_id: int,
    league_id: int = Query(..., description="리그 ID"),
    season: int = Query(2024),
):
    """팀 시즌 상세 스탯 (득점, 실점, 점유율 등)."""
    return await get("teams/statistics", {
        "team": team_id,
        "league": league_id,
        "season": season,
    })


@router.get("/{team_id}/fixtures")
async def team_fixtures(
    team_id: int,
    season: int = Query(2024),
    last: int = Query(5, description="최근 N경기"),
):
    """팀 최근 경기 결과."""
    return await get("fixtures", {
        "team": team_id,
        "season": season,
        "last": last,
    })
