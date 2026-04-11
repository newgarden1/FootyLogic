import { Suspense } from 'react'

export const dynamic = 'force-dynamic'
import Topbar from '@/components/Topbar'
import FilterTabs from '@/components/FilterTabs'
import MatchList from './MatchList'

const LEAGUE_TABS = [
  { key: 'all',        label: '전체' },
  { key: '39',         label: '🏴󠁧󠁢󠁥󠁮󠁧󠁿 EPL' },
  { key: '140',        label: '🇪🇸 라리가' },
  { key: '78',         label: '🇩🇪 분데스리가' },
  { key: '135',        label: '🇮🇹 세리에A' },
  { key: '61',         label: '🇫🇷 리그앙' },
  { key: '292',        label: '🇰🇷 K리그1' },
]

function todayKo() {
  const d = new Date()
  const days = ['일', '월', '화', '수', '목', '금', '토']
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일 (${days[d.getDay()]})`
}

export default async function MatchesPage({
  searchParams,
}: {
  searchParams: Promise<{ league?: string }>
}) {
  const { league = 'all' } = await searchParams

  return (
    <>
      <Topbar title="오늘의 경기" date={todayKo()} showRefresh />
      <div className="px-9 py-8">
        <FilterTabs tabs={LEAGUE_TABS} paramName="league" />
        <Suspense fallback={<MatchesLoadingFallback />}>
          <MatchList leagueFilter={league} />
        </Suspense>
      </div>
    </>
  )
}

function MatchesLoadingFallback() {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4" style={{ color: '#7a8399' }}>
      <div
        className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
        style={{ borderColor: 'rgba(255,255,255,0.1)', borderTopColor: '#00e676' }}
      />
      <p className="text-sm">경기 일정을 불러오는 중...</p>
    </div>
  )
}
