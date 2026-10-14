import React from 'react'
import AxonNav from './AxonNav'
import { CheckIcon } from './Icons'

const FEATURES = [
  {
    icon: '🤖',
    title: 'Intelligent Automation',
    desc: 'Axon workers watch, click, fill, and submit — exactly like a human would, but without fatigue, errors, or vacations.',
    tags: ['AI-driven', 'Self-healing'],
  },
  {
    icon: '🔗',
    title: 'No-code Workflow Builder',
    desc: 'Record any browser workflow in minutes. Axon learns the pattern and deploys a digital worker instantly — no engineers needed.',
    tags: ['Visual editor', 'Instant deploy'],
  },
  {
    icon: '📊',
    title: 'Real-time Observability',
    desc: 'Every worker run is logged, timestamped, and screenshotted. Full audit trail for compliance and debugging.',
    tags: ['Audit logs', 'Screenshots'],
  },
  {
    icon: '⚡',
    title: 'Parallel Execution',
    desc: 'Scale to hundreds of concurrent workers with no infrastructure management. Axon handles the orchestration layer.',
    tags: ['Horizontally scaled', 'Auto-retry'],
  },
  {
    icon: '🔒',
    title: 'Enterprise Security',
    desc: 'SOC 2 Type II compliant. Secrets are encrypted at rest and in transit. Workers never store credentials in plaintext.',
    tags: ['SOC 2', 'Zero-trust'],
  },
  {
    icon: '🔌',
    title: 'Integrations Hub',
    desc: 'Trigger workers from Slack, Zapier, Webhooks, or your own API. Receive results wherever your team already works.',
    tags: ['Slack', 'Webhooks', 'REST API'],
  },
]

const PILLARS = [
  { label: '10×', sub: 'Team capacity boost' },
  { label: '< 5 min', sub: 'Average setup time' },
  { label: '99.9%', sub: 'Uptime SLA' },
  { label: '0', sub: 'Infrastructure to manage' },
]

export default function FeaturesPage({ setPage }) {
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #f5f0ff 0%, #fffbf7 40%, #eef6ff 100%)', position: 'relative', overflow: 'hidden' }}>

      {/* Ambient blobs */}
      <div className="axon-blob" style={{ width: 520, height: 520, top: -120, right: -140, background: 'radial-gradient(circle, rgba(167,139,250,0.22) 0%, transparent 70%)' }} />
      <div className="axon-blob" style={{ width: 380, height: 380, bottom: 100, left: -80, background: 'radial-gradient(circle, rgba(196,165,253,0.18) 0%, transparent 70%)' }} />

      <AxonNav activePage="features" setPage={setPage} />

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '4rem 24px 6rem', position: 'relative', zIndex: 1 }}>

        {/* Section header */}
        <div className="fade-up" style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div className="axon-pill" style={{ marginBottom: 20, display: 'inline-flex' }}>
            Platform Capabilities
          </div>
          <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 'clamp(2.4rem, 5vw, 4rem)', lineHeight: 1.05, letterSpacing: '-0.02em', color: '#1B133C', maxWidth: 680, margin: '0 auto 1.2rem' }}>
            Everything you need to replace <em>manual browser work</em>
          </h2>
          <p style={{ maxWidth: 560, margin: '0 auto', fontSize: 15, lineHeight: 1.7, color: 'rgba(27,19,60,0.62)' }}>
            Axon doesn't just automate tasks — it deploys purpose-built digital workers that understand context, handle errors, and report back with structured data.
          </p>
        </div>

        {/* Stats strip */}
        <div className="fade-up delay-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, marginBottom: '4rem' }}>
          {PILLARS.map(p => (
            <div key={p.label} className="axon-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
              <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 'clamp(2rem, 4vw, 2.8rem)', color: '#7c3aed', lineHeight: 1.1 }}>{p.label}</div>
              <div style={{ fontSize: 13, color: 'rgba(27,19,60,0.58)', marginTop: 6, fontWeight: 500 }}>{p.sub}</div>
            </div>
          ))}
        </div>

        {/* Feature grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20, marginBottom: '4rem' }}>
          {FEATURES.map((f, i) => (
            <div key={f.title} className={`axon-card fade-up delay-${(i % 4) + 1}`} style={{ padding: '1.75rem 1.5rem' }}>
              <div style={{ fontSize: 32, marginBottom: 14 }}>{f.icon}</div>
              <h3 style={{ fontSize: 17, fontWeight: 600, color: '#1B133C', marginBottom: 10, letterSpacing: '-0.01em' }}>{f.title}</h3>
              <p style={{ fontSize: 14, lineHeight: 1.65, color: 'rgba(27,19,60,0.62)', marginBottom: 16 }}>{f.desc}</p>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {f.tags.map(t => (
                  <span key={t} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11.5, fontWeight: 600, color: '#7c3aed', background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.15)', borderRadius: 6, padding: '0.2rem 0.55rem' }}>
                    <CheckIcon size={11} /> {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* How it works strip */}
        <div className="axon-card fade-up" style={{ padding: '2.5rem', textAlign: 'center' }}>
          <div className="axon-pill" style={{ marginBottom: 18, display: 'inline-flex' }}>How It Works</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 24, marginTop: 12 }}>
            {[
              { step: '01', title: 'Record', body: 'Open any website and click through your workflow once. Axon captures every step.' },
              { step: '02', title: 'Review', body: 'Inspect the generated automation graph. Tweak selectors, add conditionals, schedule triggers.' },
              { step: '03', title: 'Deploy', body: 'One click launches your digital worker. It runs on schedule, on-demand, or via webhook.' },
              { step: '04', title: 'Monitor', body: 'View live runs, screenshots, and extracted data in your Axon dashboard or your own tooling.' },
            ].map(s => (
              <div key={s.step} style={{ textAlign: 'left' }}>
                <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 32, color: '#c4b5fd', lineHeight: 1 }}>{s.step}</div>
                <div style={{ fontWeight: 600, fontSize: 15, color: '#1B133C', margin: '8px 0 6px' }}>{s.title}</div>
                <div style={{ fontSize: 13.5, lineHeight: 1.6, color: 'rgba(27,19,60,0.60)' }}>{s.body}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA bar */}
        <div className="fade-up" style={{ textAlign: 'center', marginTop: '4rem' }}>
          <button
            onClick={() => setPage('home')}
            style={{ borderRadius: 12, background: '#1B133C', color: '#fff', border: 'none', padding: '0.875rem 2rem', fontSize: 15, fontWeight: 600, fontFamily: 'Inter, sans-serif', cursor: 'pointer', boxShadow: '0 4px 24px rgba(124,58,237,0.3)', transition: 'transform 0.2s, box-shadow 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(124,58,237,0.38)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 24px rgba(124,58,237,0.3)' }}
          >
            Start for Free — No Credit Card
          </button>
        </div>

      </div>
    </div>
  )
}
