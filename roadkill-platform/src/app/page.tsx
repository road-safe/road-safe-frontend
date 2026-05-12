// src/app/page.tsx
'use client'

import KakaoMap from '@/features/map/components/KakaoMap'
import { useZones } from '@/features/zone/hooks/useZones'
import { Zone } from '@/features/zone/types'

export default function HomePage() {
  const { zones, loading } = useZones()

  const handleZoneClick = (zone: Zone) => {
    console.log('클릭된 구간:', zone.conzone_id)
    // 나중에 ZoneDetailSheet 열기로 교체
  }

  return (
    <main style={{ position: 'relative', width: '100%', height: '100vh' }}>
      {loading && (
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(255,255,255,0.7)', zIndex: 10,
          fontSize: 14, color: '#555',
        }}>
          지도 불러오는 중...
        </div>
      )}
      <KakaoMap zones={zones} onZoneClick={handleZoneClick} />
    </main>
  )
}