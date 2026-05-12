'use client'

import { useState, useRef, useEffect } from 'react'
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

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay()
}

export default function DateNav({ date, today }: { date: string; today: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const isToday = date === today
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const [calYear, setCalYear] = useState(() => parseInt(date.split('-')[0]))
  const [calMonth, setCalMonth] = useState(() => parseInt(date.split('-')[1]) - 1)


  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function navigate(targetDate: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (targetDate === today) {
      params.delete('date')
    } else {
      params.set('date', targetDate)
    }
    router.push(`${pathname}?${params.toString()}`)
    setOpen(false)
  }

  function openCalendar() {
    setCalYear(parseInt(date.split('-')[0]))
    setCalMonth(parseInt(date.split('-')[1]) - 1)
    setOpen(true)
  }

  const daysInMonth = getDaysInMonth(calYear, calMonth)
  const firstDay = getFirstDayOfMonth(calYear, calMonth)
  const DAY_LABELS = ['일', '월', '화', '수', '목', '금', '토']

  const btnStyle: React.CSSProperties = {
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
    flexShrink: 0,
  }

  return (
    <div className="relative mb-5" ref={ref}>
      <div className="flex items-center gap-3">
        <button style={btnStyle} onClick={() => navigate(shiftDate(date, -1))}>‹</button>

        <button
          onClick={openCalendar}
          className="text-sm font-semibold transition-colors"
          style={{ color: '#e8eaed', cursor: 'pointer', background: 'none', border: 'none' }}
        >
          {formatKo(date)}
          {isToday && (
            <span
              className="ml-2 text-xs px-2 py-0.5 rounded-full font-bold"
              style={{ background: 'rgba(0,230,118,0.12)', border: '1px solid rgba(0,230,118,0.3)', color: '#00e676' }}
            >
              오늘
            </span>
          )}
        </button>

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

      {open && (
        <div
          className="absolute top-10 left-0 z-50 rounded-2xl p-4 w-72"
          style={{
            background: '#161920',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
          }}
        >
          {/* 월 네비게이션 */}
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={() => { if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1) } else setCalMonth(m => m - 1) }}
              style={{ ...btnStyle, borderRadius: '8px' }}
            >‹</button>
            <span className="text-sm font-bold" style={{ color: '#e8eaed' }}>
              {calYear}년 {calMonth + 1}월
            </span>
            <button
              onClick={() => { if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1) } else setCalMonth(m => m + 1) }}
              style={{ ...btnStyle, borderRadius: '8px' }}
            >›</button>
          </div>

          {/* 요일 헤더 */}
          <div className="grid grid-cols-7 mb-1">
            {DAY_LABELS.map((d, i) => (
              <div
                key={d}
                className="text-center text-xs py-1 font-semibold"
                style={{ color: i === 0 ? '#ff4757' : i === 6 ? '#4db8ff' : '#7a8399' }}
              >
                {d}
              </div>
            ))}
          </div>

          {/* 날짜 그리드 */}
          <div className="grid grid-cols-7 gap-0.5">
            {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1
              const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
              const isSelected = dateStr === date
              const isTodayCell = dateStr === today
              const dow = (firstDay + i) % 7

              return (
                <button
                  key={day}
                  onClick={() => navigate(dateStr)}
                  className="text-xs py-1.5 rounded-lg font-medium transition-all"
                  style={{
                    color: isSelected
                      ? '#0d0f14'
                      : isTodayCell
                      ? '#00e676'
                      : dow === 0
                      ? '#ff6b7a'
                      : dow === 6
                      ? '#7ab8ff'
                      : '#e8eaed',
                    background: isSelected
                      ? '#00e676'
                      : isTodayCell
                      ? 'rgba(0,230,118,0.1)'
                      : 'transparent',
                    fontWeight: isSelected || isTodayCell ? 700 : 400,
                    cursor: 'pointer',
                  }}
                >
                  {day}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
