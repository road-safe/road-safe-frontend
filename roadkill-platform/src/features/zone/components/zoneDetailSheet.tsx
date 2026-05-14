// src/features/zone/components/ZoneDetailSheet.tsx
'use client'

import { Zone } from '../types'
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
  if (!zone) return null

  const color = GRADE_COLOR[zone.risk_grade]

  return (
    <>
      {/* 배경 딤 */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 20,
        }}
      />

      {/* 하단 시트 */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 30,
        background: '#1a1a1a',
        borderRadius: '20px 20px 0 0',
        boxShadow: '0 -4px 24px rgba(0,0,0,0.4)',
        padding: '14px 24px 48px',
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
            display: 'inline-block',
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
          {zone.conzone_id} 구간
        </div>
        <div style={{ fontSize: 13, color: '#888', marginBottom: 20 }}>
          위험 반경 {zone.radius_m}m
        </div>

        {/* 정보 칩 */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
          <InfoChip label="위험 점수" value={`${zone.risk_score}점`} color={color} />
          <InfoChip label="위험 등급" value={GRADE_LABEL[zone.risk_grade]} color={color} />
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