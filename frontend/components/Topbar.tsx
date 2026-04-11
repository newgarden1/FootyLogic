'use client'

import { useRouter } from 'next/navigation'

interface TopbarProps {
  title: string
  date?: string
  showRefresh?: boolean
}

export default function Topbar({ title, date, showRefresh = false }: TopbarProps) {
  const router = useRouter()

  return (
    <div
      className="sticky top-0 z-40 flex items-center justify-between px-9 py-5"
      style={{
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        background: 'rgba(13,15,20,0.85)',
        backdropFilter: 'blur(12px)',
      }}
    >
      <h2
        className="text-lg font-bold"
        style={{ fontFamily: 'Montserrat, sans-serif', color: '#e8eaed' }}
      >
        {title}
      </h2>
      <div className="flex items-center gap-3">
        {date && (
          <span
            className="text-xs px-3.5 py-1.5 rounded-full"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: '#7a8399',
            }}
          >
            {date}
          </span>
        )}
        {showRefresh && (
          <button
            onClick={() => router.refresh()}
            className="text-xs px-4 py-1.5 rounded-full font-bold transition-all"
            style={{
              background: 'rgba(0,230,118,0.1)',
              border: '1px solid rgba(0,230,118,0.3)',
              color: '#00e676',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(0,230,118,0.2)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(0,230,118,0.1)'
            }}
          >
            ↻ 새로고침
          </button>
        )}
      </div>
    </div>
  )
}
