from fastapi import APIRouter, Query

router = APIRouter(prefix="/players", tags=["players"])


@router.get("/search")
async def search_players(name: str = Query(...)):
    """football-data.org 무료 플랜은 선수 검색을 지원하지 않습니다."""
    return {"response": [], "notice": "선수 검색은 현재 지원되지 않습니다."}
