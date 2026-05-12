from fastapi import APIRouter
from app.api_client import get

router = APIRouter(prefix="/leagues", tags=["leagues"])

COMPETITIONS = {
    "epl":        2021,
    "laliga":     2014,
    "bundesliga": 2002,
    "seriea":     2019,
    "ligue1":     2015,
}


@router.get("/")
async def list_leagues():
    return {"leagues": COMPETITIONS}


@router.get("/{league_id}/standings")
async def standings(league_id: int):
    data = await get(f"competitions/{league_id}/standings")

    competition_name = data.get("competition", {}).get("name", "")
    total = next(
        (s for s in data.get("standings", []) if s.get("type") == "TOTAL"),
        None,
    )
    table = total.get("table", []) if total else []

    transformed = [
        {
            "rank": row["position"],
            "team": {
                "id": row["team"]["id"],
                "name": row["team"]["name"],
                "logo": row["team"].get("crest", ""),
            },
            "played": row["playedGames"],
            "win": row["won"],
            "draw": row["draw"],
            "lose": row["lost"],
            "goalsDiff": row["goalDifference"],
            "points": row["points"],
            "form": row.get("form", ""),
            "description": None,
        }
        for row in table
    ]

    season = data.get("season", {})
    season_label = f"{season.get('startDate', '')[:4]}/{season.get('endDate', '')[2:4]}" if season else ""

    return {
        "response": [
            {
                "league": {
                    "name": competition_name,
                    "season_label": season_label,
                    "standings": [transformed],
                }
            }
        ]
    }


@router.get("/{league_id}/top-scorers")
async def top_scorers(league_id: int):
    data = await get(f"competitions/{league_id}/scorers")
    scorers = data.get("scorers", [])
    competition_name = data.get("competition", {}).get("name", "")

    transformed = [
        {
            "player": {
                "id": s["player"]["id"],
                "name": s["player"]["name"],
                "photo": "",
            },
            "statistics": [
                {
                    "team": {"name": s["team"]["name"]},
                    "league": {"name": competition_name, "country": ""},
                    "games": {"appearances": 0, "rating": None},
                    "goals": {"total": s.get("goals", 0), "assists": s.get("assists", 0)},
                }
            ],
        }
        for s in scorers
    ]

    return {"response": transformed}
