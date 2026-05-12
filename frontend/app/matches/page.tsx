import { Suspense } from 'react'

export const dynamic = 'force-dynamic'
import Topbar from '@/components/Topbar'
import FilterTabs from '@/components/FilterTabs'
import DateNav from '@/components/DateNav'
import AutoRefresh from '@/components/AutoRefresh'
import MatchList from './MatchList'

const LEAGUE_TABS = [
  { key: 'all',    label: '전체' },
  { key: '2021',   label: '🏴󠁧󠁢󠁥󠁮󠁧󠁿 EPL' },
  { key: '2014',   label: '🇪🇸 라리가' },
  { key: '2002',   label: '🇩🇪 분데스리가' },
  { key: '2019',   label: '🇮🇹 세리에A' },
  { key: '2015',   label: '🇫🇷 리그앙' },
]

export default async function MatchesPage({
  searchParams,
}: {
  searchParams: Promise<{ league?: string; date?: string }>
}) {
  const { league = 'all', date } = await searchParams
  const kst = new Date(Date.now() + 9 * 60 * 60 * 1000)
  const today = kst.toISOString().split('T')[0]
  const targetDate = date || today
  const isToday = targetDate === today

  return (
    <>
      <Topbar title="경기 일정" showRefresh />
      <div className="px-9 py-8">
        <DateNav date={targetDate} today={today} />
        <FilterTabs tabs={LEAGUE_TABS} paramName="league" />
        {isToday && <AutoRefresh intervalMs={60000} />}
        <Suspense key={targetDate + league} fallback={<MatchesLoadingFallback />}>
          <MatchList leagueFilter={league} date={targetDate} />
        </Suspense>
      </div>
    </>
  )
}

function MatchesLoadingFallback() {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4" style={{ color: '#7a8399' }}>
      <div
        className="w-8 h-8 rounded-full border-2 animate-spin"
        style={{ borderColor: 'rgba(255,255,255,0.1)', borderTopColor: '#00e676' }}
      />
      <p className="text-sm">경기 일정을 불러오는 중...</p>
    </div>
  )
}
