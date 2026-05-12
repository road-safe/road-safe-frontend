// src/app/layout.tsx
import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'

export const metadata: Metadata = {
  title: '로드킬 위험구간 알림',
  description: '실시간 로드킬 위험구간 시각화 플랫폼',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const kakaoKey = process.env.NEXT_PUBLIC_KAKAO_MAP_KEY

  return (
    <html lang="ko">
      <body>
        
        {children}
        <Script
          src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoKey}&autoload=false`}
          strategy="afterInteractive"
        />
      </body>
    </html>
  )
}