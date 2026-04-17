# FootyLogic 프로젝트

API-Football 데이터를 사용한 축구 데이터 분석 웹사이트.

**GitHub:** https://github.com/newgarden1/FootyLogic

## 스택
- 프론트엔드: Next.js (`frontend/`)
- 백엔드: FastAPI + uvicorn (`backend/`), Python 3.11, uv 패키지 관리
- 외부 API: API-Football (v3.football.api-sports.io), 키는 `backend/.env`의 `API_FOOTBALL_KEY`

## 배포 계획
- 프론트엔드 → Cloudflare Workers/Pages
- 백엔드 → Railway
- Railway URL → 프론트엔드 환경변수 `NEXT_PUBLIC_API_URL`에 설정
- Railway URL → 백엔드 `app/main.py` CORS `allow_origins`에 추가

## 현재 상태
- 코드 완성, GitHub 연동 완료
- `backend/Procfile` 추가 완료
- Railway 배포 아직 안 됨 → **다음 할 일**
- 백엔드 CORS의 `https://footylogic.vercel.app`을 실제 Cloudflare URL로 교체 필요
