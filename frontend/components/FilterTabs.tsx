'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'

interface Tab {
  key: string
  label: string
}

interface FilterTabsProps {
  tabs: Tab[]
  paramName?: string
}

export default function FilterTabs({ tabs, paramName = 'league' }: FilterTabsProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const current = searchParams.get(paramName) ?? tabs[0]?.key

  function handleClick(key: string) {
    const params = new URLSearchParams(searchParams.toString())
    params.set(paramName, key)
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {tabs.map(tab => {
        const active = current === tab.key
        return (
          <button
            key={tab.key}
            onClick={() => handleClick(tab.key)}
            className="px-4 py-1.5 rounded-full text-xs font-semibold transition-all"
            style={
              active
                ? {
                    background: 'rgba(0,230,118,0.12)',
                    border: '1px solid rgba(0,230,118,0.35)',
                    color: '#00e676',
                  }
                : {
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: '#7a8399',
                  }
            }
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}
