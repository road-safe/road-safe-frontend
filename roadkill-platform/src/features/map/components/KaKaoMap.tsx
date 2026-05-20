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
  myPosition?: { lat: number; lng: number } | null
  onZoneClick?: (zone: Zone) => void
  onMapReady?: (moveFn: (lat: number, lng: number) => void) => void
  
}

export default function KakaoMap({
  zones,
  myPosition,
  onZoneClick,
  onMapReady,
}: Props) {
  const containerRef   = useRef<HTMLDivElement>(null)
  const mapRef         = useRef<any>(null)
  const circlesRef     = useRef<any[]>([])
  const onMapReadyRef  = useRef(onMapReady)
  const onZoneClickRef = useRef(onZoneClick)
  const myMarkerRef     = useRef<any>(null)

  // props 바뀔 때마다 ref 동기화
  useEffect(() => { onMapReadyRef.current  = onMapReady  }, [onMapReady])
  useEffect(() => { onZoneClickRef.current = onZoneClick }, [onZoneClick])

  // 지도 초기화 — 최초 1회
// useEffect(() => {
//   console.log('map effect start')

//   if (!containerRef.current) {
//     console.log('container 없음')
//     return
//   }

//   const initMap = () => {
//     if (!window.kakao?.maps) {
//       console.log('kakao maps 없음')
//       return
//     }

//     console.log('kakao maps 존재')

//     window.kakao.maps.load(() => {
//       console.log('kakao maps load 진입')

//       const options = {
//         center: new window.kakao.maps.LatLng(
//           MAP_CONFIG.center.lat,
//           MAP_CONFIG.center.lng,
//         ),
//         level: MAP_CONFIG.level,
//       }

//       mapRef.current = new window.kakao.maps.Map(
//         containerRef.current!,
//         options,
//       )

//       console.log('지도 생성 완료')

//       onMapReadyRef.current?.((lat, lng) => {
//         const position =
//           new window.kakao.maps.LatLng(lat, lng)

//         mapRef.current.setLevel(6)
//         mapRef.current.panTo(position)

//         console.log(
//           'after level:',
//           mapRef.current.getLevel()
//         )
//       })
//     })
//   }

//   // SDK 이미 로드됨
//   if (window.kakao?.maps) {
//     initMap()
//     return
//   }

//   // SDK 로드 대기
//   const timer = setInterval(() => {
//     if (window.kakao?.maps) {
//       clearInterval(timer)
//       initMap()
//     }
//   }, 100)

//   return () => clearInterval(timer)
// }, [])



//테스트용
useEffect(() => {
  console.log('map effect start')

  if (!containerRef.current) {
    console.log('container 없음')
    return
  }

  const waitForKakao = setInterval(() => {
    console.log('sdk check', window.kakao)

    // sdk 아직 없음
    if (!window.kakao?.maps?.load) return

    clearInterval(waitForKakao)

    console.log('sdk 감지 완료')

    window.kakao.maps.load(() => {
      console.log('maps load 완료')

      mapRef.current =
        new window.kakao.maps.Map(
          containerRef.current!,
          {
            center:
              new window.kakao.maps.LatLng(
                MAP_CONFIG.center.lat,
                MAP_CONFIG.center.lng,
              ),
            level: MAP_CONFIG.level,
          }
        )

      console.log('지도 생성 완료')
        // 이동 함수 등록
        onMapReadyRef.current?.((lat, lng) => {
        const position =
         new window.kakao.maps.LatLng(
            lat,
            lng
        )

        mapRef.current.setLevel(4)
        mapRef.current.panTo(position)
        })

    })
  }, 100)

  return () => clearInterval(waitForKakao)
}, [])



  // 현재 위치 마커
  useEffect(() => {
    if (!myPosition) return

    const timer = setInterval(() => {
      if (!mapRef.current) return
      clearInterval(timer)

      // 기존 마커 제거
      if (myMarkerRef.current) {
        myMarkerRef.current.setMap(null)
      }

      // 커스텀 마커 이미지 (파란 원)
      const markerContent = `
        <div style="
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #185FA5;
          border: 3px solid #fff;
          box-shadow: 0 0 0 2px #185FA5;
        "></div>
      `

      const customOverlay = new window.kakao.maps.CustomOverlay({
        position: new window.kakao.maps.LatLng(myPosition.lat, myPosition.lng),
        content:  markerContent,
        zIndex:   10,
      })

      customOverlay.setMap(mapRef.current)
      myMarkerRef.current = customOverlay
    }, 100)

    return () => clearInterval(timer)
  }, [myPosition])




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