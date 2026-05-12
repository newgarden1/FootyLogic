from fastapi import APIRouter, Query
from app.api_client import get
from datetime import date

router = APIRouter(prefix="/matches", tags=["matches"])

SUPPORTED_COMPETITIONS = {2021, 2014, 2002, 2019, 2015}

STATUS_MAP = {
    "SCHEDULED": "NS",
    "TIMED":     "NS",
    "IN_PLAY":   "1H",
    "PAUSED":    "HT",
    "FINISHED":  "FT",
    "POSTPONED": "PST",
    "SUSPENDED": "SUSP",
    "CANCELLED": "CANC",
}


def _transform(m: dict) -> dict:
    status_short = STATUS_MAP.get(m.get("status", ""), "NS")
    score = m.get("score", {})
    full_time = score.get("fullTime", {})
    return {
        "fixture": {
            "id": m["id"],
            "date": m["utcDate"],
            "status": {"short": status_short, "elapsed": m.get("minute")},
        },
        "league": {
            "id": m.get("competition", {}).get("id"),
            "name": m.get("competition", {}).get("name", ""),
            "round": f"Matchday {m.get('matchday', '')}",
        },
        "teams": {
            "home": {"id": m["homeTeam"]["id"], "name": m["homeTeam"]["name"]},
            "away": {"id": m["awayTeam"]["id"], "name": m["awayTeam"]["name"]},
        },
        "goals": {
            "home": full_time.get("home"),
            "away": full_time.get("away"),
        },
    }


@router.get("/today")
async def today_matches(league: int = Query(None)):
    today = date.today().isoformat()
    params: dict = {"dateFrom": today, "dateTo": today}
    if league:
        params["competitions"] = str(league)

    data = await get("matches", params)
    matches = data.get("matches", [])

    if not league:
        matches = [m for m in matches if m.get("competition", {}).get("id") in SUPPORTED_COMPETITIONS]

    return {"response": [_transform(m) for m in matches]}
