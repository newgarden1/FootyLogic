import { getMatchesToday } from '@/lib/api'

const LEAGUE_NAMES: Record<number, string> = {
  39: '🏴󠁧󠁢󠁥󠁮󠁧󠁿 Premier League',
  140: '🇪🇸 La Liga',
  78: '🇩🇪 Bundesliga',
  135: '🇮🇹 Serie A',
  61: '🇫🇷 Ligue 1',
  292: '🇰🇷 K리그1',
}

interface Fixture {
  fixture: {
    id: number
    date: string
    status: { short: string; elapsed: number | null }
  }
  league: { id: number; name: string; round: string }
  teams: {
    home: { id: number; name: string }
    away: { id: number; name: string }
  }
  goals: { home: number | null; away: number | null }
}

export default async function MatchList({ leagueFilter }: { leagueFilter: string }) {
  const leagueId = leagueFilter !== 'all' ? Number(leagueFilter) : undefined
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: any = await getMatchesToday(leagueId)

  const fixtures: Fixture[] = data?.response ?? []

  if (fixtures.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3" style={{ color: '#7a8399' }}>
        <span className="text-4xl">📭</span>
        <p className="text-sm">오늘 예정된 경기가 없습니다.</p>
      </div>
    )
  }

  // 리그별 그룹핑
  const grouped = fixtures.reduce<Record<number, Fixture[]>>((acc, f) => {
    const id = f.league.id
    if (!acc[id]) acc[id] = []
    acc[id].push(f)
    return acc
  }, {})

  return (
    <div className="flex flex-col gap-8">
      {Object.entries(grouped).map(([leagueId, matches]) => (
        <div key={leagueId}>
          {/* 리그 헤더 */}
          <div className="flex items-center gap-2 mb-3">
            <span className="font-bold text-sm" style={{ color: '#e8eaed' }}>
              {LEAGUE_NAMES[Number(leagueId)] ?? matches[0].league.name}
            </span>
            <span className="text-xs" style={{ color: '#7a8399' }}>
              {matches[0].league.round}
            </span>
            <span className="text-xs ml-auto" style={{ color: '#7a8399' }}>
              {matches.length}경기
            </span>
          </div>

          {/* 경기 카드들 */}
          <div className="flex flex-col gap-2">
            {matches.map(m => (
              <MatchCard key={m.fixture.id} fixture={m} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function MatchCard({ fixture: m }: { fixture: Fixture }) {
  const status = m.fixture.status.short
  const isLive = ['1H', '2H', 'HT', 'ET', 'P'].includes(status)
  const isDone = status === 'FT' || status === 'AET' || status === 'PEN'
  const elapsed = m.fixture.status.elapsed

  const homeGoals = m.goals.home
  const awayGoals = m.goals.away
  const homeWin = isDone && homeGoals !== null && awayGoals !== null && homeGoals > awayGoals
  const awayWin = isDone && homeGoals !== null && awayGoals !== null && awayGoals > homeGoals

  const timeLabel = isLive
    ? `${elapsed ?? status}'`
    : isDone
    ? 'FT'
    : new Date(m.fixture.date).toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'Asia/Seoul',
      })

  return (
    <div
      className="flex items-center gap-0 rounded-xl px-5 py-4 relative overflow-hidden"
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      {/* 좌측 상태 줄 */}
      <div
        className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-xl"
        style={{
          background: isLive ? '#ff4757' : isDone ? 'rgba(255,255,255,0.12)' : 'transparent',
        }}
      />

      {/* 시간 */}
      <div
        className="w-14 text-center text-xs font-bold flex-shrink-0"
        style={{ color: isLive ? '#ff4757' : '#7a8399' }}
      >
        {timeLabel}
      </div>

      {/* 팀 이름들 */}
      <div className="flex-1 flex flex-col gap-1.5 px-4">
        <div className="flex items-center gap-2">
          <span
            className="text-sm font-semibold"
            style={{ color: isDone && !homeWin ? '#7a8399' : '#e8eaed' }}
          >
            {m.teams.home.name}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="text-sm font-semibold"
            style={{ color: isDone && !awayWin ? '#7a8399' : '#e8eaed' }}
          >
            {m.teams.away.name}
          </span>
        </div>
      </div>

      {/* 스코어 */}
      <div className="w-12 flex flex-col items-center flex-shrink-0" style={{ fontFamily: 'Montserrat, sans-serif' }}>
        <span className="text-lg font-bold leading-tight" style={{ color: '#e8eaed' }}>
          {homeGoals ?? '-'}
        </span>
        <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.2)' }}>─</span>
        <span className="text-lg font-bold leading-tight" style={{ color: '#e8eaed' }}>
          {awayGoals ?? '-'}
        </span>
      </div>

      {/* 상태 태그 */}
      <div className="w-14 text-right flex-shrink-0">
        {isLive && (
          <span
            className="text-[11px] font-bold px-2 py-0.5 rounded-full"
            style={{ background: 'rgba(255,71,87,0.15)', border: '1px solid rgba(255,71,87,0.3)', color: '#ff4757' }}
          >
            LIVE
          </span>
        )}
        {isDone && (
          <span
            className="text-[11px] font-bold px-2 py-0.5 rounded-full"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#7a8399' }}
          >
            종료
          </span>
        )}
        {!isLive && !isDone && (
          <span
            className="text-[11px] font-bold px-2 py-0.5 rounded-full"
            style={{ background: 'rgba(0,230,118,0.08)', border: '1px solid rgba(0,230,118,0.2)', color: '#00b25a' }}
          >
            예정
          </span>
        )}
      </div>
    </div>
  )
}
