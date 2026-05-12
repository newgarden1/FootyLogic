# FootyLogic — 축구 데이터 분석 플랫폼

football-data.org의 실시간 축구 데이터를 기반으로 경기 일정, 리그 순위, 팀 정보를 조회할 수 있는 웹 애플리케이션입니다.

**배포 주소:** https://footylogic.newgarden2000.workers.dev

---

## 기술 스택

| 구분 | 기술 |
|------|------|
| 프론트엔드 | Next.js 16 (App Router), TypeScript, Tailwind CSS |
| 백엔드 | FastAPI (Python 3.11), uvicorn, httpx |
| 외부 API | football-data.org v4 |
| 프론트엔드 배포 | Cloudflare Workers (OpenNext 어댑터) |
| 백엔드 배포 | Railway |
| 패키지 관리 | npm (프론트엔드), uv (백엔드) |

---

## 시스템 아키텍처

```
사용자 브라우저
      │
      ▼
Cloudflare Workers              ← 프론트엔드 (Next.js)
(footylogic.newgarden2000.workers.dev)
      │  서버사이드 API 요청
      ▼
Railway                         ← 백엔드 (FastAPI)
(footylogic-production.up.railway.app)
      │  외부 API 호출
      ▼
football-data.org               ← 데이터 소스
(api.football-data.org/v4)
```

- 프론트엔드는 **서버 컴포넌트**(SSR)에서 백엔드 API를 직접 호출해 데이터를 받아 렌더링합니다.
- 백엔드는 football-data.org에서 데이터를 가져와 프론트엔드에 전달하는 **프록시** 역할을 합니다. API 키를 서버에서만 관리하여 외부 노출을 방지합니다.

---

## 구현 기능

### 1. 경기 일정 (`/matches`)
- 날짜별 경기 일정 조회 (날짜 클릭 시 **미니 달력** 팝업)
- `‹ 날짜 ›` 버튼으로 하루씩 이동, "오늘로" 버튼 제공
- EPL, 라리가, 분데스리가, 세리에A, 리그앙 필터 탭
- 경기 상태(예정 / LIVE / 종료) 및 스코어 표시
- 오늘 경기 조회 시 **60초마다 자동 새로고침** (라이브 업데이트)
- KST(한국 표준시) 기준으로 날짜 및 시간 표시

### 2. 리그 순위 (`/standings`)
- 주요 5개 리그의 **현재 시즌(2025/26)** 순위표
- 팀별 경기 수·승·무·패·득실차·승점·최근 5경기 폼 표시
- UCL 진출권(파란색) / UEL 진출권(주황색) / 강등권(빨간색) 시각적 구분

### 3. 팀 분석 (`/teams`)
- 팀 이름으로 검색 (5개 리그 팀 대상)
- 팀 국가, 창단 연도, 홈 구장명 표시

### 4. 선수 데이터 (`/players`)
- football-data.org 무료 플랜 제한으로 선수 검색 미지원

---

## 프로젝트 구조

```
footylogic/
├── backend/                    # FastAPI 백엔드
│   ├── app/
│   │   ├── main.py             # FastAPI 앱 진입점, CORS 설정
│   │   ├── config.py           # 환경변수 로드 (API 키 등)
│   │   ├── api_client.py       # football-data.org HTTP 클라이언트
│   │   └── routers/
│   │       ├── matches.py      # /matches 엔드포인트
│   │       ├── leagues.py      # /leagues 엔드포인트 (순위, 득점왕 등)
│   │       ├── teams.py        # /teams 엔드포인트
│   │       └── players.py      # /players 엔드포인트
│   ├── Procfile                # Railway 실행 명령
│   └── pyproject.toml          # Python 의존성
│
└── frontend/                   # Next.js 프론트엔드
    ├── app/
    │   ├── layout.tsx          # 공통 레이아웃 (Sidebar 포함)
    │   ├── error.tsx           # 전역 에러 바운더리
    │   ├── matches/
    │   │   ├── page.tsx        # 경기 일정 페이지
    │   │   └── MatchList.tsx   # 경기 목록 서버 컴포넌트
    │   ├── standings/
    │   │   ├── page.tsx        # 리그 순위 페이지
    │   │   └── StandingsTable.tsx  # 순위표 서버 컴포넌트
    │   ├── teams/page.tsx      # 팀 검색 페이지 (클라이언트 컴포넌트)
    │   └── players/page.tsx    # 선수 검색 페이지 (클라이언트 컴포넌트)
    ├── components/
    │   ├── Sidebar.tsx         # 좌측 네비게이션
    │   ├── Topbar.tsx          # 상단 헤더
    │   ├── FilterTabs.tsx      # 리그 필터 탭
    │   ├── DateNav.tsx         # 날짜 네비게이션 + 달력 팝업
    │   └── AutoRefresh.tsx     # 자동 새로고침 (오늘 경기 전용)
    ├── lib/
    │   └── api.ts              # 백엔드 API 호출 함수 모음
    └── wrangler.jsonc          # Cloudflare Workers 배포 설정
```

---

## 백엔드 API 명세

백엔드 서버: `https://footylogic-production.up.railway.app`

| 메서드 | 엔드포인트 | 설명 |
|--------|-----------|------|
| GET | `/` | 서버 상태 확인 |
| GET | `/health` | API 키 설정 여부 확인 |
| GET | `/matches/today?date=YYYY-MM-DD` | 날짜별 경기 목록 (KST 기준, 생략 시 오늘) |
| GET | `/leagues/{id}/standings` | 리그 순위표 (현재 시즌) |
| GET | `/leagues/{id}/top-scorers` | 리그 득점 순위 |
| GET | `/teams/search?name=` | 팀 검색 |
| GET | `/players/search?name=` | 선수 검색 (미지원) |

### 지원 리그 ID

| 리그 | ID |
|------|----|
| Premier League (EPL) | 2021 |
| La Liga | 2014 |
| Bundesliga | 2002 |
| Serie A | 2019 |
| Ligue 1 | 2015 |

---

## 로컬 실행 방법

### 백엔드

```bash
cd backend

# .env 파일 생성
echo "FOOTBALL_DATA_KEY=발급받은_API_키" > .env

# 의존성 설치 및 실행 (uv 사용)
uv run uvicorn app.main:app --reload
```

백엔드 실행 후 http://localhost:8000/docs 에서 API 문서 확인 가능

### 프론트엔드

```bash
cd frontend

# 환경변수 설정
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local

# 의존성 설치 및 실행
npm install
npm run dev
```

http://localhost:3000 에서 확인

---

## 구현 시 주요 설계 결정

### 서버 컴포넌트 vs 클라이언트 컴포넌트 분리
- **경기·순위 페이지**: Next.js 서버 컴포넌트(SSR)로 구현 → 페이지 로드 시 서버에서 데이터를 미리 받아 렌더링
- **팀·선수 검색 페이지**: 클라이언트 컴포넌트로 구현 → 사용자 입력에 반응하는 검색 기능 필요
- **날짜 네비게이션·자동 새로고침**: 클라이언트 컴포넌트로 분리 → 서버 컴포넌트의 SSR 이점 유지

### API 키 보안
- football-data.org 키를 백엔드 서버 환경변수로만 관리
- 프론트엔드는 백엔드를 통해서만 데이터 요청 → 키가 브라우저에 노출되지 않음

### KST 시간대 처리
- football-data.org는 UTC 기준으로 날짜를 반환
- 백엔드에서 UTC → KST(+9) 변환 후 필터링하여 한국 기준 날짜로 경기 표시

### Cloudflare Workers 배포
- Next.js를 Cloudflare Workers에 배포하기 위해 **OpenNext** 어댑터 사용
- `NEXT_PUBLIC_` 환경변수는 빌드 타임에 주입 (런타임 vars 미적용)

---

## 사용 데이터 및 제한사항

- 데이터 출처: [football-data.org](https://www.football-data.org/)
- 무료 플랜 제한: 분당 10회 API 호출
- 지원 리그: EPL, 라리가, 분데스리가, 세리에A, 리그앙 (K리그 미지원)
- 선수 상세 통계 및 팀 상세 스탯은 유료 플랜 필요
