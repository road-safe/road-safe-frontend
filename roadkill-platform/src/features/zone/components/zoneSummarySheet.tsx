// src/features/zone/components/ZoneSummarySheet.tsx
'use client'

import { useState, useEffect } from 'react'
import { Zone } from '../types'
import { GRADE_COLOR } from '../constants'

//임시 데이터
const MOCK_SUMMARY: Record<string, string> = {
  Z001: '이 구간은 총 23건의 로드킬 사고가 집중된 매우 위험한 구역입니다. 주변 산림과 인접해 야생동물 이동이 잦으며, 특히 야간 시간대에 고라니와 너구리 출몰이 빈번합니다. 도로 조명이 부족하고 커브 구간이 많아 동물 발견이 늦어지는 경향이 있습니다.',
  Z002: '이 구간은 계절성 로드킬이 집중되는 구역입니다. 봄철 번식기와 가을철 먹이 활동 시기에 사고가 급증하며, 인근 하천을 따라 동물 이동 경로가 형성되어 있습니다.',
  Z003: '이 구간은 중간 수준의 위험도를 가진 구역입니다. 주로 오전 이른 시간대에 사고가 발생하며, 주변 농경지와 산림 경계부에 위치해 다양한 야생동물이 도로를 횡단합니다.',
  Z004: '이 구간은 상대적으로 낮은 위험도를 보이나 주의가 필요합니다. 소형 동물 위주의 로드킬이 간헐적으로 발생하고 있으며, 야간 주행 시 전조등 확인을 권장합니다.',
}

interface Props {
  zone: Zone | null
  onClose: () => void
}

const GRADE_LABEL: Record<string, string> = {
  LOW:       '낮음',
  MEDIUM:    '보통',
  HIGH:      '위험',
  VERY_HIGH: '매우위험',
}

export default function ZoneSummarySheet({ zone, onClose }: Props) {
  const [summary, setSummary]   = useState<string | null>(null)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState<string | null>(null)

/*
useEffect(() => {
  if (!zone) return

  setSummary(null)
  setError(null)
  setLoading(true)

  // mock 딜레이 (실제 GPT 응답처럼 보이게)
  setTimeout(() => {
    const text = MOCK_SUMMARY[zone.conzone_id] ?? '해당 구간의 위험 분석 정보를 준비 중입니다.'
    setSummary(text)
    setLoading(false)
  }, 1200)
}, [zone])
*/

 //api 연결 하면 이걸로
useEffect(() => {
  if (!zone) return

  setSummary(null)
  setError(null)
  setLoading(true)

  fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/zones/${zone.conzone_id}/summary`)
    .then(res => {
      if (!res.ok) throw new Error()
      return res.json()
    })
    .then(data => setSummary(data.summary))
    .catch(() => setError('설명을 불러오지 못했어요. 다시 시도해주세요.'))
    .finally(() => setLoading(false))
}, [zone])


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
          zIndex: 40,
          background: 'rgba(0,0,0,0.3)',
        }}
      />

      {/* 시트 */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          background: '#fff',
          borderRadius: '16px 16px 0 0',
          boxShadow: '0 -4px 24px rgba(0,0,0,0.15)',
          padding: '12px 20px 40px',
          animation: 'slideUp 0.25s ease',
          maxHeight: '70vh',
          overflowY: 'auto',
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

        {/* 헤더 */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
        }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a' }}>
              위험 이유 분석
            </div>
            <div style={{ fontSize: 12, color: '#999', marginTop: 2 }}>
              {zone.conzone_id} 구간
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{
              padding: '3px 10px',
              borderRadius: 20,
              fontSize: 12,
              fontWeight: 600,
              background: color + '22',
              color,
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
        </div>

        {/* 구분선 */}
        <div style={{ height: 1, background: '#f0f0f0', marginBottom: 16 }} />

        {/* 본문 */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '32px 0' }}>
            <LoadingDots color={color} />
            <div style={{ fontSize: 13, color: '#999', marginTop: 12 }}>
              AI가 위험 이유를 분석 중이에요...
            </div>
          </div>
        )}

        {error && (
          <div style={{
            padding: '16px',
            background: '#fff5f5',
            borderRadius: 10,
            color: '#e53e3e',
            fontSize: 13,
            textAlign: 'center',
          }}>
            {error}
          </div>
        )}

        {summary && (
          <>
            <div style={{
              fontSize: 14,
              color: '#333',
              lineHeight: 1.8,
              marginBottom: 16,
            }}>
              {summary}
            </div>

            {/* 행동 가이드 */}
            <div style={{
              background: color + '11',
              border: `1px solid ${color}33`,
              borderRadius: 10,
              padding: '12px 14px',
            }}>
              <div style={{ fontSize: 12, fontWeight: 600, color, marginBottom: 6 }}>
                행동 가이드
              </div>
              <div style={{ fontSize: 13, color: '#555', lineHeight: 1.7 }}>
                감속 운행 · 전조등 상향 조정 · 급제동 주의
              </div>
            </div>
          </>
        )}
      </div>

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to   { transform: translateY(0); }
        }
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40%           { transform: scale(1); }
        }
      `}</style>
    </>
  )
}

function LoadingDots({ color }: { color: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: 6 }}>
      {[0, 1, 2].map(i => (
        <div
          key={i}
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: color,
            animation: `bounce 1.4s ease-in-out ${i * 0.16}s infinite`,
          }}
        />
      ))}
    </div>
  )
}