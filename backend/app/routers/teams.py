from fastapi import APIRouter, Query
from app.api_client import get

router = APIRouter(prefix="/teams", tags=["teams"])

SUPPORTED_COMPETITIONS = [2021, 2014, 2002, 2019, 2015]

_teams_cache: list | None = None


async def _get_all_teams() -> list:
    global _teams_cache
    if _teams_cache is not None:
        return _teams_cache

    seen: set = set()
    result: list = []
    for comp_id in SUPPORTED_COMPETITIONS:
        try:
            data = await get(f"competitions/{comp_id}/teams")
            for team in data.get("teams", []):
                if team["id"] not in seen:
                    seen.add(team["id"])
                    result.append(team)
        except Exception:
            continue

    _teams_cache = result
    return result


@router.get("/search")
async def search_teams(name: str = Query(...)):
    all_teams = await _get_all_teams()
    q = name.lower()
    filtered = [
        t for t in all_teams
        if q in t["name"].lower() or q in t.get("shortName", "").lower() or q in t.get("tla", "").lower()
    ]

    transformed = [
        {
            "team": {
                "id": t["id"],
                "name": t["name"],
                "country": t.get("area", {}).get("name", ""),
                "founded": t.get("founded"),
                "logo": t.get("crest", ""),
            },
            "venue": {
                "name": t.get("venue", ""),
                "city": "",
                "capacity": None,
            },
        }
        for t in filtered
    ]

    return {"response": transformed}
