'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV = [
  { href: '/matches',   icon: '📅', label: '오늘의 경기',  group: '메인' },
  { href: '/standings', icon: '🏆', label: '리그 순위',    group: '메인' },
  { href: '/teams',     icon: '🛡️', label: '팀 분석',     group: '분석' },
  { href: '/players',   icon: '👤', label: '선수 데이터',  group: '분석' },
]

export default function Sidebar() {
  const pathname = usePathname()

  const groups = Array.from(new Set(NAV.map(n => n.group)))

  return (
    <aside
      className="fixed top-0 left-0 h-full w-[220px] flex flex-col z-50"
      style={{
        background: 'rgba(0,0,0,0.5)',
        borderRight: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      {/* 로고 */}
      <div className="px-6 py-7" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <h1
          className="text-2xl font-black tracking-tight"
          style={{ fontFamily: 'Montserrat, sans-serif', color: '#00e676' }}
        >
          FootyLogic
        </h1>
        <span className="text-xs mt-1 block" style={{ color: '#7a8399' }}>
          축구 데이터 분석 플랫폼
        </span>
      </div>

      {/* 네비게이션 */}
      <nav className="flex-1 px-3 pt-4">
        {groups.map(group => (
          <div key={group} className="mb-5">
            <p
              className="text-[11px] font-bold uppercase tracking-widest px-3 mb-2"
              style={{ color: '#7a8399' }}
            >
              {group}
            </p>
            {NAV.filter(n => n.group === group).map(item => {
              const active = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm mb-0.5 transition-all"
                  style={
                    active
                      ? {
                          background: 'rgba(0,230,118,0.12)',
                          color: '#00e676',
                          fontWeight: 700,
                        }
                      : { color: '#7a8399' }
                  }
                  onMouseEnter={e => {
                    if (!active) {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
                      e.currentTarget.style.color = '#e8eaed'
                    }
                  }}
                  onMouseLeave={e => {
                    if (!active) {
                      e.currentTarget.style.background = ''
                      e.currentTarget.style.color = '#7a8399'
                    }
                  }}
                >
                  <span className="w-5 text-center text-base">{item.icon}</span>
                  {item.label}
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      {/* 하단 배지 */}
      <div className="px-6 pb-7 text-xs" style={{ color: '#7a8399' }}>
        <div
          className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md mb-2 text-[11px] font-semibold"
          style={{
            background: 'rgba(0,230,118,0.08)',
            border: '1px solid rgba(0,230,118,0.25)',
            color: '#00e676',
          }}
        >
          ⚡ API-Football
        </div>
        <p className="leading-relaxed">데이터 출처: api-football.com</p>
      </div>
    </aside>
  )
}
