import React from 'react'
import AxonNav from './AxonNav'
import { YCIcon } from './Icons'

const VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260714_113715_c7e0daa0-8bdd-4486-a2da-040901f8f0ea.mp4'

export default function HeroPage({ setPage }) {
  return (
    <section
      style={{
        position: 'relative',
        height: '100vh',
        width: '100%',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* ── Background video ── */}
      <video
        src={VIDEO_URL}
        autoPlay
        muted
        loop
        playsInline
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          width: '100%',
          height: '130%',
          objectFit: 'cover',
          objectPosition: 'top',
          pointerEvents: 'none',
        }}
      />

      {/* Subtle vignette / tint so text pops */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          background:
            'linear-gradient(180deg, rgba(240,236,255,0.28) 0%, rgba(255,255,255,0.12) 60%, rgba(245,243,255,0.45) 100%)',
        }}
      />

      {/* ── Navbar ── */}
      <div style={{ position: 'relative', zIndex: 10 }}>
        <AxonNav activePage="home" setPage={setPage} />
      </div>

      {/* ── Hero content ── */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          paddingLeft: 24,
          paddingRight: 24,
          paddingBottom: '6vh',
          marginTop: 'clamp(2rem, 4vw, 4rem)',
        }}
      >
        {/* Badge */}
        <div
          className="fade-up"
          style={{
            marginBottom: 28,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            borderRadius: 14,
            border: '1px solid rgba(27,19,60,0.10)',
            background: 'rgba(255,255,255,0.70)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            padding: '0.5rem 1rem',
            fontSize: 14,
            fontWeight: 500,
            color: '#1B133C',
          }}
        >
          <YCIcon />
          <span>Funded by Y Combinator</span>
        </div>

        {/* Heading */}
        <h1
          className="fade-up delay-1 font-instrument"
          style={{
            fontFamily: "'Instrument Serif', serif",
            fontSize: 'clamp(2.6rem, 7vw, 6rem)',
            lineHeight: 0.95,
            letterSpacing: '-0.02em',
            color: '#1B133C',
            maxWidth: 900,
            fontWeight: 400,
          }}
        >
          Deploy digital workers
          <br />
          <em style={{ fontStyle: 'italic' }}>for mundane workflows</em>
        </h1>

        {/* Subtitle */}
        <p
          className="fade-up delay-2"
          style={{
            marginTop: 'clamp(1.1rem, 2.5vw, 1.5rem)',
            maxWidth: 640,
            fontSize: 'clamp(0.8rem, 1.4vw, 1rem)',
            lineHeight: 1.7,
            color: 'rgba(27,19,60,0.68)',
          }}
        >
          Eliminate your tedious browser work and 10x your team&apos;s capacity.
          Put intelligent agents on every routine process so you grow faster and
          deliver more for clients &mdash; effortlessly.
        </p>

        {/* CTA */}
        <div className="fade-up delay-3" style={{ marginTop: 'clamp(1.6rem, 3vw, 2rem)', display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
          <button
            className="axon-btn-shine"
            style={{
              position: 'relative',
              overflow: 'hidden',
              borderRadius: 12,
              background: '#FEFEFE',
              padding: 'clamp(0.65rem, 1.4vw, 0.875rem) clamp(1.4rem, 2.5vw, 2rem)',
              fontSize: 14,
              fontWeight: 600,
              fontFamily: 'Inter, sans-serif',
              color: '#1B133C',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0px 4px 12px rgba(0,0,0,0.15)',
              transition: 'box-shadow 0.3s, transform 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.boxShadow = '0px 6px 16px rgba(0,0,0,0.20)'
              e.currentTarget.style.transform = 'translateY(-1px)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.boxShadow = '0px 4px 12px rgba(0,0,0,0.15)'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            Get Early Access
          </button>

          <button
            onClick={() => setPage('features')}
            style={{
              borderRadius: 12,
              background: 'rgba(255,255,255,0.50)',
              backdropFilter: 'blur(10px)',
              padding: 'clamp(0.65rem, 1.4vw, 0.875rem) clamp(1.4rem, 2.5vw, 2rem)',
              fontSize: 14,
              fontWeight: 500,
              fontFamily: 'Inter, sans-serif',
              color: '#1B133C',
              border: '1px solid rgba(27,19,60,0.12)',
              cursor: 'pointer',
              transition: 'background 0.25s, transform 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.75)'
              e.currentTarget.style.transform = 'translateY(-1px)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.50)'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            See How It Works →
          </button>
        </div>

        {/* Social proof strip */}
        <div
          className="fade-up delay-4"
          style={{
            marginTop: 'clamp(2rem, 5vw, 3.5rem)',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            fontSize: 12,
            color: 'rgba(27,19,60,0.50)',
            fontWeight: 500,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {/* Avatar stack */}
            {['#c4b5fd','#a78bfa','#7c3aed'].map((c, i) => (
              <div key={i} style={{ width: 28, height: 28, borderRadius: '50%', background: c, border: '2px solid #fff', marginLeft: i > 0 ? -10 : 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#fff' }}>
                {['JK','AM','SR'][i]}
              </div>
            ))}
          </div>
          <span>Join <strong style={{ color: '#1B133C' }}>400+</strong> teams on the waitlist</span>
          <span style={{ width: 1, height: 14, background: 'rgba(27,19,60,0.15)' }} />
          <span>No credit card required</span>
        </div>
      </div>

      {/* ── Scroll cue ── */}
      <div
        style={{
          position: 'absolute',
          bottom: 28,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 6,
          opacity: 0.4,
          animation: 'fadeUp 1s 1.2s both',
        }}
      >
        <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Scroll</span>
        <svg width="14" height="20" viewBox="0 0 14 20" fill="none">
          <rect x="1" y="1" width="12" height="18" rx="6" stroke="#1B133C" strokeWidth="1.25"/>
          <circle cx="7" cy="6" r="2" fill="#1B133C">
            <animate attributeName="cy" values="6;13;6" dur="1.8s" repeatCount="indefinite"/>
          </circle>
        </svg>
      </div>
    </section>
  )
}
