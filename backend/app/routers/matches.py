from fastapi import APIRouter, Query
from app.api_client import get
from datetime import date as Date, timedelta, timezone, datetime as DT

router = APIRouter(prefix="/matches", tags=["matches"])

SUPPORTED_COMPETITIONS = {2021, 2014, 2002, 2019, 2015}
KST = timezone(timedelta(hours=9))

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


def _utc_to_kst_date(utc_str: str) -> str:
    dt = DT.fromisoformat(utc_str.replace("Z", "+00:00"))
    return dt.astimezone(KST).date().isoformat()


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
async def today_matches(
    league: int = Query(None),
    date: str = Query(None, description="YYYY-MM-DD KST 기준, 없으면 오늘"),
):
    # KST 기준 오늘 날짜 사용
    target = date or DT.now(KST).date().isoformat()
    target_date = Date.fromisoformat(target)

    # KST 하루 = UTC 전날 15:00 ~ 당일 14:59
    # dateFrom/To를 ±1일로 넓혀서 KST 날짜 기준 경기를 모두 포함
    date_from = (target_date - timedelta(days=1)).isoformat()
    date_to = (target_date + timedelta(days=1)).isoformat()

    params: dict = {"dateFrom": date_from, "dateTo": date_to}
    if league:
        params["competitions"] = str(league)

    data = await get("matches", params)
    matches = data.get("matches", [])

    # KST 날짜 기준으로 필터링
    matches = [m for m in matches if _utc_to_kst_date(m.get("utcDate", "")) == target]

    if not league:
        matches = [m for m in matches if m.get("competition", {}).get("id") in SUPPORTED_COMPETITIONS]

    return {"response": [_transform(m) for m in matches]}
