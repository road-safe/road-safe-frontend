// src/features/location/components/PeriodFilter.tsx
'use client'

type Period = 'all' | 'dawn' | 'morning' | 'afternoon'

interface Props {
  selected: Period
  onChange: (period: Period) => void
}

const PERIODS: { value: Period; label: string }[] = [
  { value: 'all',       label: '전체' },
  { value: 'dawn',      label: '새벽' },
  { value: 'morning',   label: '오전' },
  { value: 'afternoon', label: '오후' },
]

export default function PeriodFilter({ selected, onChange }: Props) {
  return (
    <div style={{
      position: 'absolute',
      bottom: 32,
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 20,
      display: 'flex',
      gap: 6,
      background: '#fff',
      borderRadius: 40,
      padding: '5px 6px',
      boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
      whiteSpace: 'nowrap',
    }}>
      {PERIODS.map(p => (
        <button
          key={p.value}
          onClick={() => onChange(p.value)}
          style={{
            padding: '7px 12px',
            borderRadius: 40,
            border: 'none',
            fontSize: 12,
            fontWeight: selected === p.value ? 600 : 400,
            background: selected === p.value ? '#1a1a1a' : 'transparent',
            color: selected === p.value ? '#fff' : '#666',
            cursor: 'pointer',
            transition: 'all 0.15s',
            whiteSpace: 'nowrap', 
          }}
        >
          {p.label}
        </button>
      ))}
    </div>
  )
}