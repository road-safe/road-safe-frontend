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
  onMapReady?: (moveFn: (lat: number, lng: number) => void) => void
}

export default function KakaoMap({
  zones,
  onZoneClick,
  onMapReady,
}: Props) {
  const containerRef   = useRef<HTMLDivElement>(null)
  const mapRef         = useRef<any>(null)
  const circlesRef     = useRef<any[]>([])
  const onMapReadyRef  = useRef(onMapReady)
  const onZoneClickRef = useRef(onZoneClick)

  // props 바뀔 때마다 ref 동기화
  useEffect(() => { onMapReadyRef.current  = onMapReady  }, [onMapReady])
  useEffect(() => { onZoneClickRef.current = onZoneClick }, [onZoneClick])

  // 지도 초기화 — 최초 1회
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

        // ref로 접근 — 항상 최신 콜백 읽음
        onMapReadyRef.current?.((lat, lng) => {
            const position =
            new window.kakao.maps.LatLng(lat, lng)

            mapRef.current.setLevel(6)
            mapRef.current.panTo(position)

            console.log(
                'after level:',
                mapRef.current.getLevel()
            )

        })
      })
    }, 100)

    return () => clearInterval(timer)
  }, []) // 빈 배열이어도 ref라서 안전

  // zones 변경될 때마다 원 다시 그리기
  useEffect(() => {
    if (zones.length === 0) return

    const timer = setInterval(() => {
      if (!mapRef.current) return
      clearInterval(timer)

      circlesRef.current.forEach(c => c.setMap(null))
      circlesRef.current = []

      zones.forEach(zone => {
        const circle = new window.kakao.maps.Circle({
          center: new window.kakao.maps.LatLng(
            zone.center.lat,
            zone.center.lng,
          ),
          radius:        zone.radius_m,
          strokeWeight:  2,
          strokeColor:   GRADE_COLOR[zone.risk_grade],
          strokeOpacity: 0.8,
          strokeStyle:   'solid',
          fillColor:     GRADE_COLOR[zone.risk_grade],
          fillOpacity:   GRADE_OPACITY[zone.risk_grade],
        })

        circle.setMap(mapRef.current)
        circlesRef.current.push(circle)

        window.kakao.maps.event.addListener(circle, 'click', () => {
          onZoneClickRef.current?.(zone)
        })
      })
    }, 100)

    return () => clearInterval(timer)
  }, [zones])

  return (
    <div
      ref={containerRef}
      style={{ width: '100%', height: '100vh' }}
    />
  )
}