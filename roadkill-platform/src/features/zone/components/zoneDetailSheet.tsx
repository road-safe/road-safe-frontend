// src/features/zone/components/ZoneDetailSheet.tsx
'use client'

import { useState, useEffect } from 'react'
import { Zone, ZoneDetail } from '../types'
import { GRADE_COLOR } from '../constants'

interface Props {
  zone: Zone | null
  onClose: () => void
  onSummaryClick: (zone: Zone) => void
}

const GRADE_LABEL: Record<string, string> = {
  LOW:       '낮음',
  MEDIUM:    '보통',
  HIGH:      '위험',
  VERY_HIGH: '매우위험',
}

export default function ZoneDetailSheet({ zone, onClose, onSummaryClick }: Props) {
  const [detail, setDetail]   = useState<ZoneDetail | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!zone) return

    setDetail(null)
    setLoading(true)

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/zones/${zone.conzone_id}`)
      .then(res => {
        if (!res.ok) throw new Error()
        return res.json()
      })
      .then(data => setDetail(data))
      .catch(() => setDetail(null))
      .finally(() => setLoading(false))
  }, [zone])

  if (!zone) return null

  const color = GRADE_COLOR[zone.risk_grade]

  // peak_hour → 텍스트 변환
  const peakHourLabel = (hour: number) => {
    if (hour >= 0  && hour < 6)  return '새벽'
    if (hour >= 6  && hour < 12) return '오전'
    if (hour >= 12 && hour < 18) return '오후'
    return '야간'
  }

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 20 }} />

      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 30,
        background: '#1a1a1a',
        borderRadius: '20px 20px 0 0',
        boxShadow: '0 -4px 24px rgba(0,0,0,0.4)',
        padding: '14px 24px calc(48px + env(safe-area-inset-bottom))',
        animation: 'slideUp 0.25s ease',
      }}>
        {/* 핸들 */}
        <div style={{
          width: 40,
          height: 4,
          background: '#444',
          borderRadius: 2,
          margin: '0 auto 20px',
        }} />

        {/* 등급 뱃지 + 닫기 */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 10,
        }}>
          <span style={{
            padding: '4px 12px',
            borderRadius: 20,
            fontSize: 12,
            fontWeight: 600,
            background: color + '33',
            color,
          }}>
            {GRADE_LABEL[zone.risk_grade]}
          </span>
          <button
            onClick={onClose}
            style={{
              background: '#333',
              border: 'none',
              borderRadius: '50%',
              width: 28,
              height: 28,
              fontSize: 16,
              color: '#aaa',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ×
          </button>
        </div>

        {/* 구간명 */}
        <div style={{ fontSize: 22, fontWeight: 700, color: '#fff', marginBottom: 4 }}>
          {loading ? '불러오는 중...' : detail?.conzone_name ?? zone.conzone_id}
        </div>
        <div style={{ fontSize: 13, color: '#888', marginBottom: 20 }}>
          {detail?.route_name ?? ''}
        </div>

        {/* 정보 칩 3개 */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
          <InfoChip
            label="총 사고"
            value={detail ? `${detail.incident_count}건` : '-'}
            color={color}
          />
          <InfoChip
            label="위험 점수"
            value={detail ? `${detail.risk_score}점` : '-'}
            color={color}
          />
          <InfoChip
            label="위험 시간"
            value={detail ? peakHourLabel(detail.peak_hour) : '-'}
            color={color}
          />
        </div>

        {/* 버튼 */}
        <button
          onClick={() => onSummaryClick(zone)}
          style={{
            width: '100%',
            padding: '15px 0',
            background: '#185FA5',
            color: '#fff',
            border: 'none',
            borderRadius: 12,
            fontSize: 16,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          위험 이유 자세히 보기
        </button>
      </div>

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to   { transform: translateY(0); }
        }
      `}</style>
    </>
  )
}

function InfoChip({
  label,
  value,
  color,
}: {
  label: string
  value: string
  color: string
}) {
  return (
    <div style={{
      flex: 1,
      background: '#2a2a2a',
      borderRadius: 12,
      padding: '12px 14px',
    }}>
      <div style={{ fontSize: 11, color: '#666', marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 18, fontWeight: 700, color }}>{value}</div>
    </div>
  )
}