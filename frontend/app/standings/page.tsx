import { Suspense } from 'react'

export const dynamic = 'force-dynamic'
import Topbar from '@/components/Topbar'
import FilterTabs from '@/components/FilterTabs'
import StandingsTable from './StandingsTable'

const LEAGUE_TABS = [
  { key: '39',  label: '🏴󠁧󠁢󠁥󠁮󠁧󠁿 프리미어리그' },
  { key: '140', label: '🇪🇸 라리가' },
  { key: '78',  label: '🇩🇪 분데스리가' },
  { key: '135', label: '🇮🇹 세리에A' },
  { key: '61',  label: '🇫🇷 리그앙' },
  { key: '292', label: '🇰🇷 K리그1' },
]

export default async function StandingsPage({
  searchParams,
}: {
  searchParams: Promise<{ league?: string }>
}) {
  const { league = '39' } = await searchParams

  return (
    <>
      <Topbar title="리그 순위" showRefresh />
      <div className="px-9 py-8">
        <FilterTabs tabs={LEAGUE_TABS} paramName="league" />
        <Suspense fallback={<StandingsLoadingFallback />}>
          <StandingsTable leagueId={Number(league)} />
        </Suspense>
      </div>
    </>
  )
}

function StandingsLoadingFallback() {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4" style={{ color: '#7a8399' }}>
      <div
        className="w-8 h-8 rounded-full border-2 animate-spin"
        style={{ borderColor: 'rgba(255,255,255,0.1)', borderTopColor: '#00e676' }}
      />
      <p className="text-sm">순위표를 불러오는 중...</p>
    </div>
  )
}
