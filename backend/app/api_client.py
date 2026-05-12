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
            data = res.json()
            errors = data.get("errors")
            if errors and errors != [] and errors != {}:
                msg = " ".join(str(v) for v in (errors.values() if isinstance(errors, dict) else errors))
                if any(k in msg.lower() for k in ("rate", "limit", "quota", "requests")):
                    raise HTTPException(status_code=429, detail="API 요청 한도 초과. 잠시 후 다시 시도해주세요.")
                raise HTTPException(status_code=500, detail=f"API-Football 오류: {msg}")
            return data
    except httpx.HTTPStatusError as e:
        if e.response.status_code == 429:
            raise HTTPException(status_code=429, detail="API 요청 한도 초과. 잠시 후 다시 시도해주세요.")
        raise HTTPException(
            status_code=e.response.status_code,
            detail=f"API-Football 오류: {e.response.status_code}",
        )
    except httpx.TimeoutException:
        raise HTTPException(status_code=504, detail="API-Football 응답 시간 초과")
