// src/features/zone/constants.ts

import { RiskGrade } from './types'

export const GRADE_COLOR: Record<RiskGrade, string> = {
  LOW:       '#2ECC71',
  MEDIUM:    '#F1C40F',
  HIGH:      '#E67E22',
  VERY_HIGH: '#C0392B',
}

// 원형 히트맵 투명도
export const GRADE_OPACITY: Record<RiskGrade, number> = {
  LOW:       0.15,
  MEDIUM:    0.25,
  HIGH:      0.35,
  VERY_HIGH: 0.45,
}

export const ALERT_COOLTIME_MS = 5 * 60 * 1000  // 5분
export const DEFAULT_RADIUS_M  = 500             // 근접 알림 탐색 반경