'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'

function shiftDate(dateStr: string, days: number): string {
  const d = new Date(dateStr + 'T12:00:00')
  d.setDate(d.getDate() + days)
  return d.toISOString().split('T')[0]
}

function formatKo(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00')
  const days = ['일', '월', '화', '수', '목', '금', '토']
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일 (${days[d.getDay()]})`
}

export default function DateNav({ date, today }: { date: string; today: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const isToday = date === today

  function navigate(targetDate: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (targetDate === today) {
      params.delete('date')
    } else {
      params.set('date', targetDate)
    }
    router.push(`${pathname}?${params.toString()}`)
  }

  const btnStyle = {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    color: '#7a8399',
    borderRadius: '50%',
    width: '28px',
    height: '28px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    fontSize: '16px',
    flexShrink: 0 as const,
  }

  return (
    <div className="flex items-center gap-3 mb-5">
      <button style={btnStyle} onClick={() => navigate(shiftDate(date, -1))}>‹</button>
      <span className="text-sm font-semibold" style={{ color: '#e8eaed' }}>
        {formatKo(date)}
        {isToday && (
          <span
            className="ml-2 text-xs px-2 py-0.5 rounded-full font-bold"
            style={{ background: 'rgba(0,230,118,0.12)', border: '1px solid rgba(0,230,118,0.3)', color: '#00e676' }}
          >
            오늘
          </span>
        )}
      </span>
      <button style={btnStyle} onClick={() => navigate(shiftDate(date, 1))}>›</button>
      {!isToday && (
        <button
          onClick={() => navigate(today)}
          className="text-xs px-3 py-1 rounded-full font-semibold"
          style={{
            background: 'rgba(0,230,118,0.08)',
            border: '1px solid rgba(0,230,118,0.25)',
            color: '#00e676',
            cursor: 'pointer',
          }}
        >
          오늘로
        </button>
      )}
    </div>
  )
}
