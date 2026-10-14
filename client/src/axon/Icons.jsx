import React from 'react'

// SVG logo matching spec: two geometric chevron shapes, 256x256 viewBox, color #1B133C
export function AxonLogo({ size = 24, color = '#1B133C' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 256 256"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Axon logo"
    >
      <path d="M 256 256 L 128 256 L 0 128 L 128 128 Z" fill={color} />
      <path d="M 256 128 L 128 128 L 0 0 L 128 0 Z" fill={color} opacity="0.55" />
    </svg>
  )
}

// Y Combinator orange badge icon
export function YCIcon() {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 20,
        height: 20,
        borderRadius: 4,
        background: '#F26625',
        flexShrink: 0,
      }}
    >
      <span style={{ color: '#fff', fontWeight: 700, fontSize: 12, lineHeight: 1 }}>Y</span>
    </span>
  )
}

// Tiny arrow right
export function ArrowRight({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

// Check icon
export function CheckIcon({ size = 16, color = '#7c3aed' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="7" stroke={color} strokeWidth="1.25" />
      <path d="M5 8.5l2 2 4-4" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}
