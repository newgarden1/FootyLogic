from fastapi import APIRouter, Query
from app.api_client import get

router = APIRouter(prefix="/matches", tags=["matches"])


@router.get("/today")
async def today_matches(
    league: int = Query(None, description="리그 ID (없으면 전체)"),
    season: int = Query(2025, description="시즌 연도"),
):
    """오늘 경기 목록 반환."""
    from datetime import date
    today = date.today().isoformat()
    params = {"date": today, "season": season}
    if league:
        params["league"] = league
    return await get("fixtures", params)


@router.get("/{fixture_id}")
async def match_detail(fixture_id: int):
    """특정 경기 상세 정보 (라인업, 이벤트, 스탯)."""
    data = await get("fixtures", {"id": fixture_id})
    stats = await get("fixtures/statistics", {"fixture": fixture_id})
    events = await get("fixtures/events", {"fixture": fixture_id})
    lineups = await get("fixtures/lineups", {"fixture": fixture_id})
    return {
        "fixture": data,
        "statistics": stats,
        "events": events,
        "lineups": lineups,
    }
