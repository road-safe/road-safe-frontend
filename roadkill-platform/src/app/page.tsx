// src/app/page.tsx
'use client'

import KakaoMap from '@/features/map/components/KakaoMap'
import { useZones } from '@/features/zone/hooks/useZones'
import { Zone } from '@/features/zone/types'
import ZoneDetailSheet from '@/features/zone/components/zoneDetailSheet'
import ZoneSummarySheet from '@/features/zone/components/zoneSummarySheet'
import SearchBar from '@/features/location/components/SeacrhBar'
import PeriodFilter from '@/features/location/components/PeriodFilter'
import { useGeolocation } from '@/features/location/hooks/useGeolocation'
import AlertToast from '@/features/zone/components/AlertToast'
import { useNearbyAlert } from '@/features/zone/hooks/useNearbyAlert'
import { useRef, useState, useEffect } from 'react'

type Period = 'all' | 'dawn' | 'morning' | 'afternoon'

interface SearchResult {
  lat: number
  lng: number
  place_name: string
}

export default function HomePage() {
  const [period, setPeriod] = useState<Period>('all')
  const { zones, loading } = useZones(period)
  const { position } = useGeolocation()
  const { alert, dismissAlert } = useNearbyAlert(position, zones)
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null)
  const [summaryZone, setSummaryZone] = useState<Zone | null>(null)
  const initialMoveRef = useRef(false)  // 추가
  
  //시작화면 내 위치
  useEffect(() => {
    if (!position || initialMoveRef.current) return

    const timer = setInterval(() => {
      if (!mapMoveRef.current) return
      clearInterval(timer)
      initialMoveRef.current = true
      mapMoveRef.current(position.lat, position.lng)
    }, 100)

    return () => clearInterval(timer)
  }, [position])

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

  //내위치로 이동
  const handleMoveToMyLocation = () => {
    if (!position) return
    mapMoveRef.current?.(position.lat, position.lng)
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
        myPosition={position}
        onMapReady={(moveFn) => {
        console.log('map ready')
        mapMoveRef.current = moveFn
        }} 
      />

      <AlertToast alert={alert} onDismiss={dismissAlert} />

      <SearchBar onSelect={handleSearchSelect} />

      <PeriodFilter
        selected={period}
        onChange={setPeriod}
      />

      <button
        onClick={handleMoveToMyLocation}
        style={{
            position: 'absolute',
            bottom: 100,           // PeriodFilter 위
            right: 16,
            zIndex: 20,
            width: 44,
            height: 44,
            borderRadius: '50%',
            background: '#fff',
            border: 'none',
            boxShadow: '0 2px 12px rgba(0,0,0,0.2)',
            cursor: position ? 'pointer' : 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: position ? 1 : 0.5,
            }}
        title="내 위치로 이동"
        >       
    {/* 위치 아이콘 */}
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#185FA5" strokeWidth="2.5">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
        <circle cx="12" cy="10" r="3"/>
        </svg>
    </button>

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