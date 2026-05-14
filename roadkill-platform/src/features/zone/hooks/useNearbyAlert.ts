// src/features/zone/hooks/useNearbyAlert.ts
'use client'

import { useState, useEffect, useRef } from 'react'
import { Zone } from '../types'
import { ALERT_COOLTIME_MS, DEFAULT_RADIUS_M } from '../constants'

interface AlertInfo {
  zone: Zone
  distance_m: number
}

function getDistanceM(
  lat1: number, lng1: number,
  lat2: number, lng2: number
): number {
  const R = 6371000
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export function useNearbyAlert(
  position: { lat: number; lng: number } | null,
  zones: Zone[]
) {
  const [alert, setAlert]   = useState<AlertInfo | null>(null)
  const cooldownRef         = useRef<Record<string, number>>({})

  useEffect(() => {
    if (!position || zones.length === 0) return

    const now = Date.now()

    // 가장 가까운 위험구간 찾기
    let closest: AlertInfo | null = null

    zones.forEach(zone => {
      const dist = getDistanceM(
        position.lat, position.lng,
        zone.center.lat, zone.center.lng,
      )

      if (dist > 99999999) return
      if (zone.risk_grade === 'LOW') return

      // 쿨타임 체크
      const lastAlerted = cooldownRef.current[zone.conzone_id] ?? 0
      if (now - lastAlerted < ALERT_COOLTIME_MS) return

      if (!closest || dist < closest.distance_m) {
        closest = { zone, distance_m: Math.round(dist) }
      }
    })

    if (closest) {
      cooldownRef.current[(closest as AlertInfo).zone.conzone_id] = now
      setAlert(closest)
    }
  }, [position, zones])

  const dismissAlert = () => setAlert(null)

  return { alert, dismissAlert }
}