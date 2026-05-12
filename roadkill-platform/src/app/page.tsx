// src/app/page.tsx
'use client'

import KakaoMap from '@/features/map/components/KakaoMap'
import { useZones } from '@/features/zone/hooks/useZones'
import { Zone } from '@/features/zone/types'
import ZoneDetailSheet from '@/features/zone/components/zoneDetailSheet'
import ZoneSummarySheet from '@/features/zone/components/zoneSummarySheet'
import SearchBar from '@/features/location/components/SeacrhBar'
import { useRef, useState } from 'react'

interface SearchResult {
  lat: number
  lng: number
  place_name: string
}

export default function HomePage() {
  const { zones, loading } = useZones()
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null)
  const [summaryZone, setSummaryZone] = useState<Zone | null>(null)

  const handleZoneClick = (zone: Zone) => {
    setSelectedZone(zone)
  }

  const handleClose = () => {
    setSelectedZone(null)
  }  

  const handleSummaryClick = (zone: Zone) => {
    
    console.log('위험 이유 보기:', zone.conzone_id)
    setSelectedZone(null)   // 상세 시트 닫고
    setSummaryZone(zone)    // 설명 시트 열기
  }

  const handleSummaryClose = () => setSummaryZone(null)

  const mapMoveRef = useRef<((lat: number, lng: number) => void) | null>(null)

  const handleSearchSelect = (result: SearchResult) => {
    // KakaoMap에서 올려준 이동 함수 호출
    console.log('mapMoveRef:', mapMoveRef.current)
    mapMoveRef.current?.(result.lat, result.lng)
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
      <KakaoMap 
        zones={zones} onZoneClick={handleZoneClick}
        onMapReady={(moveFn) => {
        console.log('map ready')
        mapMoveRef.current = moveFn
        }} 
      />

      <SearchBar onSelect={handleSearchSelect} />

      <ZoneDetailSheet
        zone={selectedZone}
        onClose={handleClose}
        onSummaryClick={handleSummaryClick}
      />

      <ZoneSummarySheet
        zone={summaryZone}
        onClose={handleSummaryClose}
      />

    </main>
  )
}