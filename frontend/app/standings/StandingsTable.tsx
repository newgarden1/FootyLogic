import { getStandings } from '@/lib/api'

interface Standing {
  rank: number
  team: { id: number; name: string; logo: string }
  played: number
  win: number
  draw: number
  lose: number
  goalsDiff: number
  points: number
  form: string
  description: string | null
}

const formDot = (char: string) => {
  if (char === 'W') return { bg: '#00e676' }
  if (char === 'D') return { bg: '#ffc107' }
  if (char === 'L') return { bg: '#ff4757' }
  return { bg: 'rgba(255,255,255,0.15)' }
}

function posColor(rank: number, total: number) {
  if (rank <= 4)        return '#4db8ff'  // UCL
  if (rank <= 6)        return '#ffb347'  // UEL
  if (rank > total - 3) return '#ff4757'  // 강등
  return 'transparent'
}

export default async function StandingsTable({ leagueId }: { leagueId: number }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: any = await getStandings(leagueId, 2024)
  const standings: Standing[] = data?.response?.[0]?.league?.standings?.[0] ?? []

  if (standings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3" style={{ color: '#7a8399' }}>
        <span className="text-4xl">📊</span>
        <p className="text-sm">순위 데이터가 없습니다.</p>
      </div>
    )
  }

  const leagueName = data?.response?.[0]?.league?.name ?? ''
  const total = standings.length

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ border: '1px solid rgba(255,255,255,0.08)' }}
    >
      {/* 리그명 헤더 */}
      <div
        className="px-6 py-4 text-sm font-bold"
        style={{
          background: 'rgba(255,255,255,0.03)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          color: '#e8eaed',
          fontFamily: 'Montserrat, sans-serif',
        }}
      >
        {leagueName} — 2024/25 시즌
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              {['#', '팀', '경기', '승', '무', '패', '득실', '승점', '최근 폼'].map((h, i) => (
                <th
                  key={h}
                  className={`py-3 px-4 font-semibold text-xs ${i >= 2 ? 'text-center' : 'text-left'}`}
                  style={{ color: '#7a8399', background: 'rgba(255,255,255,0.02)' }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {standings.map(row => {
              const gd = row.goalsDiff >= 0 ? `+${row.goalsDiff}` : `${row.goalsDiff}`
              const form = (row.form ?? '').split('').slice(-5)

              return (
                <tr
                  key={row.team.id}
                  className="transition-colors"
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                >
                  {/* 순위 */}
                  <td className="py-3 pl-5 pr-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-1 h-7 rounded-full flex-shrink-0"
                        style={{ background: posColor(row.rank, total) }}
                      />
                      <span style={{ color: '#7a8399', fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}>
                        {row.rank}
                      </span>
                    </div>
                  </td>

                  {/* 팀명 */}
                  <td className="py-3 px-4">
                    <span className="font-semibold" style={{ color: '#e8eaed' }}>
                      {row.team.name}
                    </span>
                  </td>

                  {/* 수치 */}
                  <td className="py-3 px-4 text-center" style={{ color: '#7a8399' }}>{row.played}</td>
                  <td className="py-3 px-4 text-center" style={{ color: '#7a8399' }}>{row.win}</td>
                  <td className="py-3 px-4 text-center" style={{ color: '#7a8399' }}>{row.draw}</td>
                  <td className="py-3 px-4 text-center" style={{ color: '#7a8399' }}>{row.lose}</td>
                  <td
                    className="py-3 px-4 text-center font-semibold"
                    style={{ color: row.goalsDiff >= 0 ? '#00e676' : '#ff4757', fontFamily: 'Montserrat, sans-serif' }}
                  >
                    {gd}
                  </td>
                  <td
                    className="py-3 px-4 text-center font-bold"
                    style={{ color: '#ffffff', fontFamily: 'Montserrat, sans-serif', fontSize: '0.95rem' }}
                  >
                    {row.points}
                  </td>

                  {/* 폼 */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1">
                      {form.map((c, i) => (
                        <div
                          key={i}
                          className="w-2 h-2 rounded-full"
                          style={{ background: formDot(c).bg }}
                          title={c === 'W' ? '승' : c === 'D' ? '무' : '패'}
                        />
                      ))}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* 범례 */}
      <div
        className="flex gap-6 px-6 py-3 text-xs"
        style={{ borderTop: '1px solid rgba(255,255,255,0.06)', color: '#7a8399' }}
      >
        <span className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full" style={{ background: '#4db8ff' }} /> UCL 진출
        </span>
        <span className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full" style={{ background: '#ffb347' }} /> UEL 진출
        </span>
        <span className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full" style={{ background: '#ff4757' }} /> 강등권
        </span>
      </div>
    </div>
  )
}
