import React from 'react'
import AxonNav from './AxonNav'
import { CheckIcon } from './Icons'

const CERTS = [
  { icon: '🏛️', title: 'SOC 2 Type II', desc: 'Annual third-party audit of our security controls, availability, and confidentiality practices.' },
  { icon: '🔐', title: 'AES-256 Encryption', desc: 'All secrets, session tokens, and user data encrypted at rest and in transit — always.' },
  { icon: '🛡️', title: 'Zero-Trust Architecture', desc: 'Workers never hold persistent credentials. Secrets are injected ephemerally per-run and discarded.' },
  { icon: '🌐', title: 'GDPR & CCPA Ready', desc: 'Data residency controls, right-to-erasure tooling, and DPA templates available on request.' },
]

const PRACTICES = [
  'Automated dependency vulnerability scanning on every commit',
  'Penetration testing by third parties twice per year',
  'Bug bounty program with responsible disclosure process',
  'Immutable audit logs stored separately from primary infrastructure',
  'Role-based access control with principle of least privilege',
  'Isolated worker sandboxes — no cross-tenant data leakage possible',
  '24/7 on-call security engineering rotation',
  'SBOM (Software Bill of Materials) published for every release',
]

export default function SecurityPage({ setPage }) {
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(155deg, #f4f0ff 0%, #fdfcff 45%, #f0f7ff 100%)', position: 'relative', overflow: 'hidden' }}>

      {/* Blobs */}
      <div className="axon-blob" style={{ width: 480, height: 480, top: -80, left: -100, background: 'radial-gradient(circle, rgba(196,165,253,0.20) 0%, transparent 70%)' }} />
      <div className="axon-blob" style={{ width: 360, height: 360, bottom: 60, right: -60, background: 'radial-gradient(circle, rgba(147,197,253,0.20) 0%, transparent 70%)' }} />

      <AxonNav activePage="security" setPage={setPage} />

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '4rem 24px 6rem', position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <div className="fade-up" style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div className="axon-pill" style={{ marginBottom: 20, display: 'inline-flex' }}>Security & Trust</div>
          <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', lineHeight: 1.05, letterSpacing: '-0.02em', color: '#1B133C', marginBottom: '1rem' }}>
            Built secure from <em>day one</em>
          </h2>
          <p style={{ maxWidth: 540, margin: '0 auto', fontSize: 15, lineHeight: 1.7, color: 'rgba(27,19,60,0.62)' }}>
            Axon is designed for teams that can't afford a data breach. We've embedded security at every layer — not bolted on after the fact.
          </p>
        </div>

        {/* Certifications grid */}
        <div className="fade-up delay-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: '4rem' }}>
          {CERTS.map(c => (
            <div key={c.title} className="axon-card" style={{ padding: '1.75rem 1.5rem', textAlign: 'center' }}>
              <div style={{ fontSize: 36, marginBottom: 14 }}>{c.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 15, color: '#1B133C', marginBottom: 8 }}>{c.title}</div>
              <div style={{ fontSize: 13, lineHeight: 1.65, color: 'rgba(27,19,60,0.58)' }}>{c.desc}</div>
            </div>
          ))}
        </div>

        {/* Architecture diagram (visual card) */}
        <div className="fade-up axon-card" style={{ padding: '2.5rem', marginBottom: '3rem', background: 'rgba(27,19,60,0.96)', border: '1px solid rgba(167,139,250,0.3)' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '2.5rem' }}>
            <div style={{ flex: '0 0 auto', maxWidth: 380 }}>
              <div className="axon-pill" style={{ marginBottom: 16, background: 'rgba(167,139,250,0.15)', border: '1px solid rgba(167,139,250,0.25)', color: '#c4b5fd' }}>Zero-Trust Model</div>
              <h3 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 28, color: '#fff', lineHeight: 1.15, marginBottom: 12 }}>
                Ephemeral secrets, isolated sandboxes
              </h3>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: 'rgba(255,255,255,0.60)' }}>
                Every worker run starts with a fresh, isolated browser context. Credentials are injected from our encrypted vault for that run only and destroyed on completion — never written to disk or logs.
              </p>
            </div>
            <div style={{ flex: 1, minWidth: 260 }}>
              {[
                { label: 'Request Layer', color: '#c4b5fd', detail: 'TLS 1.3, cert pinning, rate limiting' },
                { label: 'Secrets Vault', color: '#a78bfa', detail: 'AES-256, HSM-backed, ephemeral injection' },
                { label: 'Worker Sandbox', color: '#7c3aed', detail: 'Isolated chromium, no disk persistence' },
                { label: 'Audit Log Store', color: '#5b21b6', detail: 'Immutable, append-only, separate VPC' },
              ].map((l, i) => (
                <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: i < 3 ? 12 : 0 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: l.color, flexShrink: 0, boxShadow: `0 0 8px ${l.color}` }} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{l.label}</div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>{l.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Security practices checklist */}
        <div className="fade-up delay-2" style={{ marginBottom: '4rem' }}>
          <h3 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 26, color: '#1B133C', marginBottom: '1.5rem' }}>Our security practices</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 10 }}>
            {PRACTICES.map(p => (
              <div key={p} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '0.75rem 1rem', borderRadius: 10, background: 'rgba(255,255,255,0.60)', border: '1px solid rgba(27,19,60,0.07)' }}>
                <span style={{ marginTop: 1, flexShrink: 0 }}><CheckIcon size={15} /></span>
                <span style={{ fontSize: 13.5, lineHeight: 1.55, color: '#1B133C' }}>{p}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Contact security team */}
        <div className="fade-up axon-card" style={{ padding: '2rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem' }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16, color: '#1B133C', marginBottom: 5 }}>Report a vulnerability</div>
            <div style={{ fontSize: 13.5, color: 'rgba(27,19,60,0.60)' }}>We take reports seriously and respond within 24 hours. All researchers are credited and rewarded.</div>
          </div>
          <a href="mailto:security@axon.ai" style={{ display: 'inline-block', borderRadius: 10, background: '#1B133C', color: '#fff', padding: '0.7rem 1.5rem', fontSize: 14, fontWeight: 600, fontFamily: 'Inter, sans-serif', textDecoration: 'none', transition: 'opacity 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.opacity='0.82'}
            onMouseLeave={e => e.currentTarget.style.opacity='1'}
          >
            security@axon.ai →
          </a>
        </div>

      </div>
    </div>
  )
}
