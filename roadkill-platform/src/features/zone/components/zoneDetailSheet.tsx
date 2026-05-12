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
  // zone 없으면 렌더링 안 함
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
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 30,
          background: '#fff',
          borderRadius: '16px 16px 0 0',
          boxShadow: '0 -4px 24px rgba(0,0,0,0.12)',
          padding: '12px 20px 32px',
          animation: 'slideUp 0.25s ease',
        }}
      >
        {/* 핸들 */}
        <div style={{
          width: 36,
          height: 4,
          background: '#e0e0e0',
          borderRadius: 2,
          margin: '0 auto 16px',
        }} />

        {/* 등급 뱃지 + 닫기 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <span style={{
            display: 'inline-block',
            padding: '3px 10px',
            borderRadius: 20,
            fontSize: 12,
            fontWeight: 600,
            background: color + '22',
            color: color,
          }}>
            {GRADE_LABEL[zone.risk_grade]}
          </span>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: 20,
              color: '#999',
              cursor: 'pointer',
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>

        {/* 구간 ID (실데이터 연동 전 임시) */}
        <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4, color: '#1a1a1a' }}>
          {zone.conzone_id} 구간
        </div>
        <div style={{ fontSize: 13, color: '#888', marginBottom: 16 }}>
          위험 반경 {zone.radius_m}m
        </div>

        {/* 정보 카드 */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          <InfoChip label="위험 점수" value={`${zone.risk_score}점`} color={color} />
          <InfoChip label="위험 등급" value={GRADE_LABEL[zone.risk_grade]} color={color} />
        </div>

        {/* 위험 이유 버튼 */}
        <button
          onClick={() => onSummaryClick(zone)}
          style={{
            width: '100%',
            padding: '13px 0',
            background: color,
            color: '#fff',
            border: 'none',
            borderRadius: 10,
            fontSize: 15,
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

function InfoChip({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{
      flex: 1,
      background: '#f7f7f7',
      borderRadius: 10,
      padding: '10px 12px',
    }}>
      <div style={{ fontSize: 11, color: '#999', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 16, fontWeight: 700, color }}>{value}</div>
    </div>
  )
}