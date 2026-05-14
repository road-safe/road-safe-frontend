// src/features/zone/components/AlertToast.tsx
'use client'

import { useEffect } from 'react'
import { Zone } from '../types'
import { GRADE_COLOR } from '../constants'

interface AlertInfo {
  zone: Zone
  distance_m: number
}

interface Props {
  alert: AlertInfo | null
  onDismiss: () => void
}

const GRADE_LABEL: Record<string, string> = {
  LOW:       '낮음',
  MEDIUM:    '보통',
  HIGH:      '위험',
  VERY_HIGH: '매우위험',
}

// 토스트 배경색 — 위험도별
const GRADE_BG: Record<string, string> = {
  LOW:       '#2d4a2d',
  MEDIUM:    '#4a3d00',
  HIGH:      '#7a1f1f',
  VERY_HIGH: '#8b0000',
}

const GRADE_BORDER: Record<string, string> = {
  LOW:       '#2ECC71',
  MEDIUM:    '#F1C40F',
  HIGH:      '#E67E22',
  VERY_HIGH: '#C0392B',
}

export default function AlertToast({ alert, onDismiss }: Props) {
  // 5초 후 자동 소멸
  useEffect(() => {
    if (!alert) return
    const timer = setTimeout(onDismiss, 7000)
    return () => clearTimeout(timer)
  }, [alert, onDismiss])

  if (!alert) return null

  const color  = GRADE_COLOR[alert.zone.risk_grade]
  const bg     = GRADE_BG[alert.zone.risk_grade]
  const border = GRADE_BORDER[alert.zone.risk_grade]

  return (
    <div
      onClick={onDismiss}
      style={{
        position: 'fixed',
        top: 80,
        left: 16,
        right: 16,
        zIndex: 50,
        background: bg,
        borderRadius: 14,
        padding: '14px 16px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.35)',
        animation: 'slideDown 0.2s ease',
        border: `1.5px solid ${border}`,
        cursor: 'pointer',
      }}
    >
      {/* 제목 */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        marginBottom: 6,
      }}>
        {/* 경고 삼각형 */}
        <svg width="18" height="18" viewBox="0 0 24 24" fill={color}>
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
          <line x1="12" y1="9"  x2="12"   y2="13" stroke={bg} strokeWidth="2"/>
          <line x1="12" y1="17" x2="12.01" y2="17" stroke={bg} strokeWidth="2.5"/>
        </svg>
        <span style={{ fontSize: 17, fontWeight: 700, color: '#fff' }}>
          앞 {alert.distance_m}m 위험구간
        </span>
      </div>

      {/* 구간명 */}
      <div style={{
        fontSize: 13,
        color: 'rgba(255,255,255,0.75)',
        marginBottom: 10,
        paddingLeft: 2,
      }}>
        {alert.zone.conzone_id} 구간
      </div>

      {/* 구분선 */}
      <div style={{
        height: 1,
        background: 'rgba(255,255,255,0.15)',
        marginBottom: 10,
      }} />

      {/* 행동 가이드 */}
      <div style={{
        fontSize: 13,
        color: 'rgba(255,255,255,0.6)',
      }}>
        감속 권장 · 전조등 확인
      </div>

      <style>{`
        @keyframes slideDown {
          from { transform: translateY(-16px); opacity: 0; }
          to   { transform: translateY(0);     opacity: 1; }
        }
      `}</style>
    </div>
  )
}