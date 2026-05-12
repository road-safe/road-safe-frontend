// src/features/zone/hooks/useZones.ts
'use client'

import { useState, useEffect } from 'react'
import { Zone } from '../types'

const MOCK_ZONES: Zone[] = [
  {
    conzone_id: 'Z001',
    risk_grade: 'VERY_HIGH',
    risk_score: 91,
    center: { lat: 37.4512, lng: 127.1235 },
    radius_m: 300,
  },
  {
    conzone_id: 'Z002',
    risk_grade: 'HIGH',
    risk_score: 74,
    center: { lat: 37.3950, lng: 127.0990 },
    radius_m: 250,
  },
  {
    conzone_id: 'Z003',
    risk_grade: 'MEDIUM',
    risk_score: 52,
    center: { lat: 37.4230, lng: 127.0850 },
    radius_m: 200,
  },
  {
    conzone_id: 'Z004',
    risk_grade: 'LOW',
    risk_score: 21,
    center: { lat: 37.4740, lng: 127.1540 },
    radius_m: 150,
  },
]

export function useZones() {
  const [zones, setZones]     = useState<Zone[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<string | null>(null)

  useEffect(() => {
    // 나중에 fetch('/api/zones/heatmap') 로 교체
    setLoading(true)
    setTimeout(() => {
      setZones(MOCK_ZONES)
      setLoading(false)
    }, 300)
  }, [])

  return { zones, loading, error }
}