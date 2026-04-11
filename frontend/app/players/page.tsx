'use client'

import { useState } from 'react'
import Topbar from '@/components/Topbar'

interface Player {
  player: {
    id: number
    name: string
    nationality: string
    age: number
    photo: string
  }
  statistics: Array<{
    team: { name: string }
    league: { name: string; country: string }
    games: { appearances: number; rating: string }
    goals: { total: number; assists: number }
  }>
}

export default function PlayersPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Player[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSearch() {
    if (!query.trim()) return
    setLoading(true)
    setError('')
    setResults(null)
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/players/search?name=${encodeURIComponent(query)}`
      )
      if (!res.ok) throw new Error(`서버 오류 (${res.status})`)
      const data = await res.json()
      setResults(data.response ?? [])
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Topbar title="선수 데이터" />
      <div className="px-9 py-8 max-w-4xl">
        {/* 검색바 */}
        <div className="flex gap-3 mb-8">
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            placeholder="선수 이름을 입력하세요 (예: Haaland, Son)"
            className="flex-1 px-5 py-3 rounded-xl text-sm outline-none"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: '#e8eaed',
            }}
          />
          <button
            onClick={handleSearch}
            className="px-6 py-3 rounded-xl text-sm font-bold"
            style={{
              background: 'rgba(0,230,118,0.12)',
              border: '1px solid rgba(0,230,118,0.3)',
              color: '#00e676',
            }}
          >
            검색
          </button>
        </div>

        {/* 로딩 */}
        {loading && (
          <div className="flex items-center justify-center py-20 gap-4" style={{ color: '#7a8399' }}>
            <div
              className="w-7 h-7 rounded-full border-2 animate-spin"
              style={{ borderColor: 'rgba(255,255,255,0.1)', borderTopColor: '#00e676' }}
            />
            <span className="text-sm">검색 중...</span>
          </div>
        )}

        {/* 에러 */}
        {error && (
          <div
            className="px-5 py-4 rounded-xl text-sm mb-4"
            style={{
              background: 'rgba(255,71,87,0.1)',
              border: '1px solid rgba(255,71,87,0.3)',
              color: '#ff4757',
            }}
          >
            ⚠️ {error}
          </div>
        )}

        {/* 결과 없음 */}
        {results !== null && results.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 gap-3" style={{ color: '#7a8399' }}>
            <span className="text-4xl">🔍</span>
            <p className="text-sm">검색 결과가 없습니다. 영문 이름으로 검색해보세요.</p>
          </div>
        )}

        {/* 선수 카드들 */}
        {results && results.length > 0 && (
          <div className="flex flex-col gap-3">
            {results.map(({ player, statistics }) => {
              const stat = statistics?.[0]
              const rating = stat?.games?.rating ? parseFloat(stat.games.rating).toFixed(1) : '—'
              const ratingColor = stat?.games?.rating
                ? parseFloat(stat.games.rating) >= 7.5
                  ? '#00e676'
                  : parseFloat(stat.games.rating) >= 6.5
                  ? '#ffc107'
                  : '#ff4757'
                : '#7a8399'

              return (
                <div
                  key={player.id}
                  className="flex items-center gap-5 px-6 py-5 rounded-2xl"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  {/* 아바타 */}
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-xl flex-shrink-0"
                    style={{ background: 'rgba(0,230,118,0.08)' }}
                  >
                    👤
                  </div>

                  {/* 선수 정보 */}
                  <div className="flex-1">
                    <p className="font-bold text-base" style={{ color: '#e8eaed' }}>
                      {player.name}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: '#7a8399' }}>
                      {player.nationality} · {player.age}세
                      {stat && ` · ${stat.team.name}`}
                    </p>
                  </div>

                  {/* 스탯 */}
                  <div className="flex gap-6 text-center">
                    <div>
                      <p
                        className="text-lg font-black"
                        style={{ fontFamily: 'Montserrat, sans-serif', color: '#e8eaed' }}
                      >
                        {stat?.goals?.total ?? '—'}
                      </p>
                      <p className="text-[11px]" style={{ color: '#7a8399' }}>득점</p>
                    </div>
                    <div>
                      <p
                        className="text-lg font-black"
                        style={{ fontFamily: 'Montserrat, sans-serif', color: '#e8eaed' }}
                      >
                        {stat?.goals?.assists ?? '—'}
                      </p>
                      <p className="text-[11px]" style={{ color: '#7a8399' }}>어시스트</p>
                    </div>
                    <div>
                      <p
                        className="text-lg font-black"
                        style={{ fontFamily: 'Montserrat, sans-serif', color: '#e8eaed' }}
                      >
                        {stat?.games?.appearances ?? '—'}
                      </p>
                      <p className="text-[11px]" style={{ color: '#7a8399' }}>경기</p>
                    </div>
                    <div>
                      <p
                        className="text-lg font-black"
                        style={{ fontFamily: 'Montserrat, sans-serif', color: ratingColor }}
                      >
                        {rating}
                      </p>
                      <p className="text-[11px]" style={{ color: '#7a8399' }}>평점</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* 초기 빈 화면 */}
        {results === null && !loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-3" style={{ color: '#7a8399' }}>
            <span className="text-5xl">👤</span>
            <p className="text-sm">선수 이름을 검색하면 시즌 스탯을 확인할 수 있습니다.</p>
          </div>
        )}
      </div>
    </>
  )
}
