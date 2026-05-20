// src/app/layout.tsx
import type { Metadata, Viewport} from 'next'
import Script from 'next/script'
import './globals.css'

export const metadata: Metadata = {
  title: '로드킬 위험구간 알림',
  description: '실시간 로드킬 위험구간 시각화 플랫폼',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,        // 핀치줌 방지 (지도 앱 특성상)
  userScalable: false,
  viewportFit: 'cover',   // 노치/홈바 영역까지 확장
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const kakaoKey = process.env.NEXT_PUBLIC_KAKAO_MAP_KEY
  console.log('kakaoKey:', kakaoKey)

  return (
    <html lang="ko">
        <Script
            src={`https://dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoKey}&autoload=false`}
            strategy="beforeInteractive"
        />

        <body
            style={{
            margin: 0,
            padding: 0,
            overscrollBehavior: 'none',
            }}
        >
            {children}
        </body>
    </html>
  )
}