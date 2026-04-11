'use client'

import { useState } from 'react'
import Topbar from '@/components/Topbar'

interface Team {
  team: { id: number; name: string; country: string; founded: number; logo: string }
  venue: { name: string; city: string; capacity: number }
}

export default function TeamsPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Team[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSearch() {
    if (!query.trim()) return
    setLoading(true)
    setError('')
    setResults(null)
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/teams/search?name=${encodeURIComponent(query)}`
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
      <Topbar title="팀 분석" />
      <div className="px-9 py-8 max-w-4xl">
        {/* 검색바 */}
        <div className="flex gap-3 mb-8">
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            placeholder="팀 이름을 입력하세요 (예: Arsenal, 전북)"
            className="flex-1 px-5 py-3 rounded-xl text-sm outline-none transition-all"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: '#e8eaed',
            }}
          />
          <button
            onClick={handleSearch}
            className="px-6 py-3 rounded-xl text-sm font-bold transition-all"
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
            <p className="text-sm">검색 결과가 없습니다. 영문 팀명으로 검색해보세요.</p>
          </div>
        )}

        {/* 결과 카드 */}
        {results && results.length > 0 && (
          <div className="flex flex-col gap-3">
            {results.map(({ team, venue }) => (
              <div
                key={team.id}
                className="flex items-center gap-5 px-6 py-5 rounded-2xl"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ background: 'rgba(0,230,118,0.08)' }}
                >
                  🛡️
                </div>
                <div className="flex-1">
                  <p className="font-bold text-base" style={{ color: '#e8eaed' }}>
                    {team.name}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: '#7a8399' }}>
                    {team.country} · 창단 {team.founded}년
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold" style={{ color: '#e8eaed' }}>
                    {venue.name ?? '—'}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: '#7a8399' }}>
                    {venue.city ?? ''} {venue.capacity ? `· ${venue.capacity.toLocaleString()}석` : ''}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 초기 빈 화면 */}
        {results === null && !loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-3" style={{ color: '#7a8399' }}>
            <span className="text-5xl">🛡️</span>
            <p className="text-sm">팀 이름을 검색하면 상세 정보를 확인할 수 있습니다.</p>
          </div>
        )}
      </div>
    </>
  )
}
