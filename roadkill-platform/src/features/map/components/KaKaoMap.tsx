// src/features/map/components/KakaoMap.tsx
'use client'

import { useEffect, useRef } from 'react'
import { Zone } from '@/features/zone/types'
import { GRADE_COLOR, GRADE_OPACITY } from '@/features/zone/constants'
import { MAP_CONFIG } from '@/shared/constants/map'

declare global {
  interface Window { kakao: any }
}

interface Props {
  zones: Zone[]
  onZoneClick?: (zone: Zone) => void
}

export default function KakaoMap({ zones, onZoneClick }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef       = useRef<any>(null)
  const circlesRef   = useRef<any[]>([])

  // 지도 초기화
  useEffect(() => {
    const timer = setInterval(() => {

      if (!window.kakao?.maps || !containerRef.current) return
      clearInterval(timer)

      window.kakao.maps.load(() => {
        const options = {
          center: new window.kakao.maps.LatLng(
            MAP_CONFIG.center.lat,
            MAP_CONFIG.center.lng,
          ),
          level: MAP_CONFIG.level,
        }
        mapRef.current = new window.kakao.maps.Map(
          containerRef.current,
          options,
        )
      })
    }, 100)

    return () => clearInterval(timer)
  }, [])

  // zones 변경될 때마다 원 다시 그리기
  useEffect(() => {
    if (!mapRef.current || zones.length === 0) return

    // 기존 원 제거
    circlesRef.current.forEach(c => c.setMap(null))
    circlesRef.current = []

    zones.forEach(zone => {
      const circle = new window.kakao.maps.Circle({
        center: new window.kakao.maps.LatLng(
          zone.center.lat,
          zone.center.lng,
        ),
        radius:          zone.radius_m,
        strokeWeight:    2,
        strokeColor:     GRADE_COLOR[zone.risk_grade],
        strokeOpacity:   0.8,
        strokeStyle:     'solid',
        fillColor:       GRADE_COLOR[zone.risk_grade],
        fillOpacity:     GRADE_OPACITY[zone.risk_grade],
      })

      circle.setMap(mapRef.current)
      circlesRef.current.push(circle)

      // 클릭 이벤트
      if (onZoneClick) {
        window.kakao.maps.event.addListener(circle, 'click', () => {
          onZoneClick(zone)
        })
      }
    })
  }, [zones, onZoneClick])

  return (
    <div
      ref={containerRef}
      style={{ width: '100%', height: '100vh' }}
    />
  )
}