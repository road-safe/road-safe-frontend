// src/features/location/hooks/useGeolocation.ts
'use client'

import { useState, useEffect } from 'react'

interface Position {
  lat: number
  lng: number
}

interface GeolocationState {
  position: Position | null
  error: string | null
  loading: boolean
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    position: null,
    error:    null,
    loading:  true,
  })

  useEffect(() => {
    if (!navigator.geolocation) {
      setState(s => ({ ...s, loading: false, error: '위치 정보를 지원하지 않는 브라우저예요.' }))
      return
    }

    // 최초 1회 위치 가져오기
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setState({
          position: { lat: pos.coords.latitude, lng: pos.coords.longitude },
          error:    null,
          loading:  false,
        })
      },
      (err) => {
        setState({
          position: null,
          error:    '위치 권한을 허용해주세요.',
          loading:  false,
        })
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )

    // 위치 변경 감지 (이동 시 업데이트)
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setState({
          position: { lat: pos.coords.latitude, lng: pos.coords.longitude },
          error:    null,
          loading:  false,
        })
      },
      () => {},
      { enableHighAccuracy: true }
    )

    return () => navigator.geolocation.clearWatch(watchId)
  }, [])

  return state
}