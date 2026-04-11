import httpx
from app.config import BASE_URL, HEADERS


async def get(endpoint: str, params: dict = {}) -> dict:
    """API-Football REST 호출 공통 클라이언트."""
    async with httpx.AsyncClient(timeout=10) as client:
        res = await client.get(
            f"{BASE_URL}/{endpoint}",
            headers=HEADERS,
            params=params,
        )
        res.raise_for_status()
        return res.json()
