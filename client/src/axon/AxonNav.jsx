import React from 'react'
import { AxonLogo } from './Icons'

const NAV_LINKS = ['Features', 'Plans', 'Security', 'About']

export default function AxonNav({ activePage, setPage }) {
  return (
    <div
      className="relative z-10 flex justify-center"
      style={{ paddingTop: 'clamp(1rem, 2vw, 1.5rem)' }}
    >
      <nav
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '2rem',
          background: 'rgba(255,255,255,0.70)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          borderRadius: 14,
          padding: '0.75rem 1.5rem',
          boxShadow: '0 2px 12px rgba(27,19,60,0.10)',
          border: '1px solid rgba(27,19,60,0.07)',
        }}
      >
        {/* Logo */}
        <button
          onClick={() => setPage('home')}
          style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          aria-label="Go home"
        >
          <AxonLogo size={24} color="#1B133C" />
          <span style={{ fontWeight: 700, fontSize: 15, color: '#1B133C', letterSpacing: '-0.01em' }}>Axon</span>
        </button>

        {/* Nav links — hidden below sm */}
        <div style={{ display: 'flex', gap: '1.5rem' }} className="axon-links">
          {NAV_LINKS.map(link => (
            <button
              key={link}
              onClick={() => setPage(link.toLowerCase())}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: 500,
                fontFamily: 'Inter, sans-serif',
                color: activePage === link.toLowerCase() ? '#1B133C' : 'rgba(27,19,60,0.60)',
                transition: 'color 0.2s',
                padding: 0,
                textDecoration: activePage === link.toLowerCase() ? 'underline' : 'none',
                textUnderlineOffset: 4,
              }}
              onMouseEnter={e => { e.currentTarget.style.color = '#1B133C' }}
              onMouseLeave={e => { e.currentTarget.style.color = activePage === link.toLowerCase() ? '#1B133C' : 'rgba(27,19,60,0.60)' }}
            >
              {link}
            </button>
          ))}
        </div>

        {/* CTA pill in nav */}
        <button
          onClick={() => setPage('home')}
          style={{
            background: '#1B133C',
            color: '#fff',
            border: 'none',
            borderRadius: 10,
            padding: '0.45rem 1rem',
            fontSize: 13,
            fontWeight: 600,
            fontFamily: 'Inter, sans-serif',
            cursor: 'pointer',
            transition: 'opacity 0.2s, transform 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.opacity = '0.85' }}
          onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
        >
          Get Early Access
        </button>
      </nav>

      {/* Hide links on mobile via inline media — fallback style block injected in root */}
      <style>{`
        @media (max-width: 580px) {
          .axon-links { display: none !important; }
        }
      `}</style>
    </div>
  )
}
