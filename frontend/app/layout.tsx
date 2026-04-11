import type { Metadata } from 'next'
import './globals.css'
import Sidebar from '@/components/Sidebar'

export const metadata: Metadata = {
  title: 'FootyLogic',
  description: '축구 데이터 분석 플랫폼',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;700;900&family=Montserrat:wght@400;600;700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="flex min-h-screen" style={{ backgroundColor: '#0d0f14', color: '#e8eaed' }}>
        <Sidebar />
        <div className="ml-[220px] flex-1 flex flex-col min-h-screen">
          {children}
        </div>
      </body>
    </html>
  )
}
