import httpx
from fastapi import HTTPException
from app.config import BASE_URL, HEADERS


async def get(endpoint: str, params: dict = {}) -> dict:
    """API-Football REST 호출 공통 클라이언트."""
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            res = await client.get(
                f"{BASE_URL}/{endpoint}",
                headers=HEADERS,
                params=params,
            )
            res.raise_for_status()
            return res.json()
    except httpx.HTTPStatusError as e:
        raise HTTPException(
            status_code=e.response.status_code,
            detail=f"API-Football 오류: {e.response.status_code}",
        )
    except httpx.TimeoutException:
        raise HTTPException(status_code=504, detail="API-Football 응답 시간 초과")
