import { getTopScorers } from '@/lib/api'

interface Scorer {
  player: { id: number; name: string; nationality: string; photo: string }
  statistics: { goals: { total: number }; games: { appearences: number } }[]
}

export default async function TopScorersTable({ leagueId }: { leagueId: number }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: any = await getTopScorers(leagueId, 2024)
  const scorers: Scorer[] = data?.response ?? []

  if (scorers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3" style={{ color: '#7a8399' }}>
        <span className="text-3xl">⚽</span>
        <p className="text-sm">득점 데이터가 없습니다.</p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
      <div
        className="px-6 py-4 text-sm font-bold"
        style={{
          background: 'rgba(255,255,255,0.03)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          color: '#e8eaed',
          fontFamily: 'Montserrat, sans-serif',
        }}
      >
        득점 순위 — 2024/25 시즌
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            {['#', '선수', '국적', '출장', '득점'].map((h, i) => (
              <th
                key={h}
                className={`py-3 px-4 font-semibold text-xs ${i >= 3 ? 'text-center' : 'text-left'}`}
                style={{ color: '#7a8399', background: 'rgba(255,255,255,0.02)' }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {scorers.slice(0, 10).map((s, idx) => (
            <tr
              key={s.player.id}
              style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
            >
              <td className="py-3 pl-5 pr-2 font-semibold" style={{ color: '#7a8399', fontFamily: 'Montserrat, sans-serif' }}>
                {idx + 1}
              </td>
              <td className="py-3 px-4 font-semibold" style={{ color: '#e8eaed' }}>{s.player.name}</td>
              <td className="py-3 px-4 text-sm" style={{ color: '#7a8399' }}>{s.player.nationality}</td>
              <td className="py-3 px-4 text-center" style={{ color: '#7a8399' }}>{s.statistics[0]?.games?.appearences ?? '-'}</td>
              <td className="py-3 px-4 text-center font-bold" style={{ color: '#00e676', fontFamily: 'Montserrat, sans-serif' }}>
                {s.statistics[0]?.goals?.total ?? 0}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
