'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  const isRateLimit = error.message === 'API_RATE_LIMIT'

  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4" style={{ color: '#7a8399' }}>
      <span className="text-4xl">{isRateLimit ? '⏱️' : '⚠️'}</span>
      <p className="text-sm">{isRateLimit ? 'API 요청 한도를 초과했습니다.' : '데이터를 불러오는 데 실패했습니다.'}</p>
      <p className="text-xs" style={{ color: '#4a5568' }}>
        {isRateLimit
          ? '무료 플랜 제한: 분당 10회 / 하루 100회. 잠시 후 다시 시도해주세요.'
          : '잠시 후 다시 시도해주세요.'}
      </p>
      <button
        onClick={reset}
        className="mt-2 text-xs px-4 py-1.5 rounded-full font-bold"
        style={{
          background: 'rgba(0,230,118,0.1)',
          border: '1px solid rgba(0,230,118,0.3)',
          color: '#00e676',
        }}
      >
        다시 시도
      </button>
    </div>
  )
}
