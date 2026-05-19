// src/features/zone/hooks/useNearbyAlert.ts
'use client'

import { useState, useEffect, useRef } from 'react'
import { Zone } from '../types'
import { ALERT_COOLTIME_MS, DEFAULT_RADIUS_M } from '../constants'

interface AlertInfo {
  zone: Zone
  distance_m: number
}

export function useNearbyAlert(
  position: { lat: number; lng: number } | null,
  zones: Zone[]
) {
  const [alert, setAlert] = useState<AlertInfo | null>(null)
  const cooldownRef       = useRef<Record<string, number>>({})
  const currentHour = new Date().getHours()

  useEffect(() => {
    if (!position) return

    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/zones/nearby` +
      `?lat=${position.lat}&lng=${position.lng}&radius=${DEFAULT_RADIUS_M}` +
      `?hour=${currentHour}`
    )
      .then(res => {
        if (!res.ok) throw new Error()
        return res.json()
      })
      .then(data => {
        if (!data.alert_needed || data.zones.length === 0) return

        const nearest = data.zones[0]

        // 쿨타임 체크
        const now = Date.now()
        const lastAlerted = cooldownRef.current[nearest.conzone_id] ?? 0
        if (now - lastAlerted < ALERT_COOLTIME_MS) return

        // zones 배열에서 매칭되는 Zone 찾기
        const matchedZone = zones.find(z => z.conzone_id === nearest.conzone_id)
        if (!matchedZone) return

        cooldownRef.current[nearest.conzone_id] = now
        setAlert({
          zone:       matchedZone,
          distance_m: Math.round(nearest.distance_m),
        })
      })
      .catch(err => console.error('nearby fetch 실패:', err))
  }, [position, zones])

  const dismissAlert = () => setAlert(null)

  return { alert, dismissAlert }
}