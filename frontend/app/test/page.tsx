import { Suspense } from 'react'
import Topbar from '@/components/Topbar'
import StandingsTable from '@/app/standings/StandingsTable'
import TopScorersTable from './TopScorersTable'

export const dynamic = 'force-dynamic'

const EPL_ID = 39

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center py-16 gap-3" style={{ color: '#7a8399' }}>
      <div
        className="w-6 h-6 rounded-full border-2 animate-spin"
        style={{ borderColor: 'rgba(255,255,255,0.1)', borderTopColor: '#ffc107' }}
      />
      <p className="text-sm">불러오는 중...</p>
    </div>
  )
}

export default function TestPage() {
  return (
    <>
      <Topbar title="테스트" />
      <div className="px-9 py-8 space-y-6">

        {/* 테스트 배너 */}
        <div
          className="flex items-center gap-3 px-5 py-4 rounded-xl text-sm"
          style={{
            background: 'rgba(255,193,7,0.08)',
            border: '1px solid rgba(255,193,7,0.3)',
            color: '#ffc107',
          }}
        >
          <span className="text-lg">⚠️</span>
          <div>
            <p className="font-bold">테스트용 페이지</p>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(255,193,7,0.7)' }}>
              API 연동 확인 목적으로 2024 시즌 EPL 데이터를 표시합니다. 무료 플랜 기준 100회/일 제한이 있습니다.
            </p>
          </div>
        </div>

        {/* 두 테이블 나란히 */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <Suspense fallback={<LoadingFallback />}>
            <StandingsTable leagueId={EPL_ID} />
          </Suspense>
          <Suspense fallback={<LoadingFallback />}>
            <TopScorersTable leagueId={EPL_ID} />
          </Suspense>
        </div>

      </div>
    </>
  )
}
