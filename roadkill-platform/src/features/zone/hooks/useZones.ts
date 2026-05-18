// src/features/zone/hooks/useZones.ts
'use client'

import { useState, useEffect } from 'react'
import { Zone } from '../types'

type Period = 'all' | 'dawn' | 'morning' | 'afternoon'

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

const MOCK_ZONES_BY_PERIOD: Record<Period, Zone[]> = {
  all: [
    { conzone_id: 'Z001', risk_grade: 'VERY_HIGH', risk_score: 91, center: { lat: 37.4512, lng: 127.1235 }, radius_m: 300 },
    { conzone_id: 'Z002', risk_grade: 'HIGH',      risk_score: 74, center: { lat: 37.3950, lng: 127.0990 }, radius_m: 250 },
    { conzone_id: 'Z003', risk_grade: 'MEDIUM',    risk_score: 52, center: { lat: 37.4230, lng: 127.0850 }, radius_m: 200 },
    { conzone_id: 'Z004', risk_grade: 'LOW',       risk_score: 21, center: { lat: 37.4740, lng: 127.1540 }, radius_m: 150 },
  ],
  dawn: [
    { conzone_id: 'Z001', risk_grade: 'VERY_HIGH', risk_score: 95, center: { lat: 37.4512, lng: 127.1235 }, radius_m: 350 },
    { conzone_id: 'Z005', risk_grade: 'HIGH',      risk_score: 80, center: { lat: 37.4100, lng: 127.1050 }, radius_m: 270 },
  ],
  morning: [
    { conzone_id: 'Z002', risk_grade: 'MEDIUM',    risk_score: 55, center: { lat: 37.3950, lng: 127.0990 }, radius_m: 200 },
    { conzone_id: 'Z003', risk_grade: 'LOW',       risk_score: 30, center: { lat: 37.4230, lng: 127.0850 }, radius_m: 150 },
  ],
  afternoon: [
    { conzone_id: 'Z003', risk_grade: 'HIGH',      risk_score: 78, center: { lat: 37.4230, lng: 127.0850 }, radius_m: 280 },
    { conzone_id: 'Z004', risk_grade: 'VERY_HIGH', risk_score: 88, center: { lat: 37.4740, lng: 127.1540 }, radius_m: 320 },
    { conzone_id: 'Z006', risk_grade: 'MEDIUM',    risk_score: 60, center: { lat: 37.4400, lng: 127.1300 }, radius_m: 220 },
  ],
}

export function useZones(period: Period = 'all') {
  const [zones, setZones]     = useState<Zone[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<string | null>(null)

//   useEffect(() => {
//     // 나중에 fetch('/api/zones/heatmap') 로 교체
//     setLoading(true)
//     setTimeout(() => {
//       setZones(MOCK_ZONES_BY_PERIOD[period])
//       setLoading(false)
//     }, 300)
//   }, [period])

    useEffect(() => {
        setLoading(true)
        setError(null)

        const params = period !== 'all' ? `?period=${period}` : ''

        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/zones/heatmap${params}`)
        .then(res => {
            if (!res.ok) throw new Error(`HTTP ${res.status}`)
            return res.json()
        })
        .then(data => setZones(data.zones))
        .catch(err => {
            console.error('zones fetch 실패:', err)
            setError('데이터를 불러오지 못했어요.')
        })
      .finally(() => setLoading(false))
    }, [period])


  return { zones, loading, error }

}