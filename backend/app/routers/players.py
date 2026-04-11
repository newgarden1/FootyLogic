from fastapi import APIRouter, Query
from app.api_client import get

router = APIRouter(prefix="/players", tags=["players"])


@router.get("/search")
async def search_players(name: str = Query(..., description="선수 이름 (영문)")):
    """선수 이름으로 검색."""
    return await get("players/profiles", {"search": name})


@router.get("/{player_id}")
async def player_info(
    player_id: int,
    season: int = Query(2024),
):
    """선수 시즌 스탯 (득점, 어시스트, 평점 등)."""
    return await get("players", {"id": player_id, "season": season})


@router.get("/{player_id}/transfers")
async def player_transfers(player_id: int):
    """선수 이적 기록."""
    return await get("transfers", {"player": player_id})


@router.get("/{player_id}/trophies")
async def player_trophies(player_id: int):
    """선수 수상 기록."""
    return await get("trophies", {"player": player_id})
