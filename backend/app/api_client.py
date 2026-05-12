import httpx
from fastapi import HTTPException
from app.config import BASE_URL, HEADERS


async def get(endpoint: str, params: dict = {}) -> dict:
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
        if e.response.status_code == 429:
            raise HTTPException(status_code=429, detail="API 요청 한도 초과. 잠시 후 다시 시도해주세요.")
        raise HTTPException(
            status_code=e.response.status_code,
            detail=f"API 오류: {e.response.status_code}",
        )
    except httpx.TimeoutException:
        raise HTTPException(status_code=504, detail="API 응답 시간 초과")
