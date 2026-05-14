// src/features/location/components/SearchBar.tsx
'use client'

import { useState, useRef, useEffect } from 'react'

interface SearchResult {
  lat: number
  lng: number
  place_name: string
}

interface Props {
  onSelect: (result: SearchResult) => void
}

export default function SearchBar({ onSelect }: Props) {
  const [query, setQuery]       = useState('')
  const [results, setResults]   = useState<SearchResult[]>([])
  const [loading, setLoading]   = useState(false)
  const [focused, setFocused]   = useState(false)
  const timerRef                = useRef<NodeJS.Timeout | null>(null)

  // 입력 후 400ms 대기 후 검색 (디바운스)
  /* api연결 후 변경
  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }

    if (timerRef.current) clearTimeout(timerRef.current)

    timerRef.current = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await fetch(
          `/api/search/location?query=${encodeURIComponent(query)}`
        )
        if (!res.ok) throw new Error()
        const data = await res.json()
        // 백엔드 완성 전까지 mock
        setResults(MOCK_RESULTS.filter(r =>
          r.place_name.includes(query)
        ))
      } catch {
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 400)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [query])
  */

  //목데이터------
  useEffect(() => {
  if (!query.trim()) {
    setResults([])
    return
  }

  if (timerRef.current) clearTimeout(timerRef.current)

  timerRef.current = setTimeout(() => {
    // fetch 없이 바로 mock 필터링
    const filtered = MOCK_RESULTS.filter(r =>
      r.place_name.includes(query)
    )
    setResults(filtered)
  }, 400)

  return () => {
    if (timerRef.current) clearTimeout(timerRef.current)
  }
}, [query])
//목데이터-----


  const handleSelect = (result: SearchResult) => {
    onSelect(result)
    setQuery(result.place_name)
    setResults([])
    setFocused(false)
  }

  const handleClear = () => {
    setQuery('')
    setResults([])
  }

  const showDropdown = focused && (loading || results.length > 0)

  return (
    <div style={{
      position: 'absolute',
      top: 16,
      left: 16,
      right: 16,
      zIndex: 20,
    }}>
      {/* 검색창 */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        background: '#1a1a1a',
        borderRadius: showDropdown ? '12px 12px 0 0' : 12,
        boxShadow: '0 2px 12px rgba(0,0,0,0.4)',
        padding: '0 14px',
        gap: 10,
        border: focused ? '1.5px solid #444' : '1.5px solid transparent',
        transition: 'border 0.15s',
      }}>
        {/* 검색 아이콘 */}
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2.5">
          <circle cx="11" cy="11" r="7"/>
          <path d="m21 21-4.35-4.35"/>
        </svg>

        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
          placeholder="지역, 도로명 검색"
          style={{
            flex: 1,
            border: 'none',
            outline: 'none',
            fontSize: 15,
            padding: '13px 0',
            background: 'transparent',
            color: '#fff',
          }}
        />

        {/* 지우기 버튼 */}
        {query && (
          <button
            onClick={handleClear}
            style={{
              background: '#333',
              border: 'none',
              borderRadius: '50%',
              width: 18,
              height: 18,
              fontSize: 12,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#888',
              flexShrink: 0,
            }}
          >
            ×
          </button>
        )}
      </div>

   {/* 드롭다운 */}
      {showDropdown && (
        <div style={{
          background: '#1a1a1a',
          borderRadius: '0 0 12px 12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
          borderTop: '1px solid #2a2a2a',
          overflow: 'hidden',
        }}>
          {results.map((r, i) => (
            <button
              key={i}
              onMouseDown={() => handleSelect(r)}
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'none',
                border: 'none',
                borderBottom: i < results.length - 1 ? '1px solid #2a2a2a' : 'none',
                textAlign: 'left',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              <span style={{ fontSize: 14, color: '#ddd' }}>
                {r.place_name}
              </span>
            </button>
          ))}
        </div>
      )}


      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

// 백엔드 완성 전 mock 데이터
const MOCK_RESULTS: SearchResult[] = [
  { place_name: '판교 나들목',      lat: 37.3947, lng: 127.1108 },
  { place_name: '양재 나들목',      lat: 37.4691, lng: 127.0364 },
  { place_name: '경부고속도로',     lat: 37.1234, lng: 127.0456 },
  { place_name: '수원 나들목',      lat: 37.2636, lng: 127.0286 },
  { place_name: '기흥 나들목',      lat: 37.2789, lng: 127.1145 },
]
