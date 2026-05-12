// src/features/zone/types.ts

export type RiskGrade = 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY_HIGH'

export interface Zone {
  conzone_id: string
  risk_grade: RiskGrade
  risk_score: number
  center: {
    lat: number
    lng: number
  }
  radius_m: number
}

export interface ZoneDetail {
  conzone_id:     string
  conzone_name:   string
  route_name:     string
  risk_score:     number
  risk_grade:     RiskGrade
  incident_count: number
  peak_hour:      number
}