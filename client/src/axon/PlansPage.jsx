import React, { useState } from 'react'
import AxonNav from './AxonNav'
import { CheckIcon } from './Icons'

const PLANS = [
  {
    name: 'Starter',
    price: 0,
    period: '/mo',
    tagline: 'Perfect for solo operators and side projects.',
    highlight: false,
    features: [
      '3 active digital workers',
      '500 worker runs / month',
      'Basic observability dashboard',
      'Community support',
      'Public webhook triggers',
    ],
    cta: 'Start Free',
    ctaStyle: 'outline',
  },
  {
    name: 'Growth',
    price: 79,
    period: '/mo',
    tagline: 'Built for growing teams that need scale and reliability.',
    highlight: true,
    badge: 'Most Popular',
    features: [
      '25 active digital workers',
      '10,000 worker runs / month',
      'Parallel execution (up to 10×)',
      'Full audit logs & screenshots',
      'Slack + Webhook integrations',
      'Priority email support',
    ],
    cta: 'Get Early Access',
    ctaStyle: 'filled',
  },
  {
    name: 'Enterprise',
    price: null,
    period: '',
    tagline: 'Custom SLAs, SSO, and dedicated infrastructure for large teams.',
    highlight: false,
    features: [
      'Unlimited workers & runs',
      'Dedicated worker infrastructure',
      'SOC 2 Type II compliance',
      'SSO / SAML support',
      'Custom integrations & API',
      'Dedicated success manager',
      'SLA-backed uptime (99.99%)',
    ],
    cta: 'Contact Sales',
    ctaStyle: 'outline',
  },
]

export default function PlansPage({ setPage }) {
  const [annual, setAnnual] = useState(false)

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(170deg, #f8f5ff 0%, #fdfcff 50%, #eef6ff 100%)', position: 'relative', overflow: 'hidden' }}>

      {/* Blobs */}
      <div className="axon-blob" style={{ width: 600, height: 600, top: -200, left: '50%', transform: 'translateX(-50%)', background: 'radial-gradient(circle, rgba(167,139,250,0.18) 0%, transparent 65%)' }} />

      <AxonNav activePage="plans" setPage={setPage} />

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '4rem 24px 6rem', position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <div className="fade-up" style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div className="axon-pill" style={{ marginBottom: 20, display: 'inline-flex' }}>Pricing</div>
          <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', lineHeight: 1.05, letterSpacing: '-0.02em', color: '#1B133C', marginBottom: '1rem' }}>
            Simple, transparent <em>pricing</em>
          </h2>
          <p style={{ maxWidth: 480, margin: '0 auto 1.75rem', fontSize: 15, lineHeight: 1.7, color: 'rgba(27,19,60,0.62)' }}>
            Start free. Scale as your team grows. No hidden fees, no per-seat gotchas.
          </p>

          {/* Annual toggle */}
          <button
            onClick={() => setAnnual(a => !a)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              background: annual ? '#1B133C' : 'rgba(27,19,60,0.06)',
              color: annual ? '#fff' : '#1B133C',
              border: 'none', borderRadius: 9999, padding: '0.5rem 1.25rem',
              fontSize: 13, fontWeight: 600, fontFamily: 'Inter, sans-serif',
              cursor: 'pointer', transition: 'background 0.25s, color 0.25s',
            }}
          >
            <span>{annual ? '✓ ' : ''}Annual billing</span>
            {annual && <span style={{ background: '#F26625', color: '#fff', borderRadius: 9999, padding: '0.15rem 0.6rem', fontSize: 11, fontWeight: 700 }}>Save 20%</span>}
          </button>
        </div>

        {/* Plans grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, alignItems: 'stretch' }}>
          {PLANS.map((plan, i) => (
            <div
              key={plan.name}
              className={`axon-card fade-up delay-${i + 1}`}
              style={{
                padding: '2rem 1.75rem',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                ...(plan.highlight ? {
                  background: '#1B133C',
                  border: '1px solid rgba(167,139,250,0.3)',
                  boxShadow: '0 8px 40px rgba(124,58,237,0.30)',
                } : {}),
              }}
            >
              {plan.badge && (
                <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: '#F26625', color: '#fff', borderRadius: 9999, padding: '0.2rem 0.85rem', fontSize: 11, fontWeight: 700, letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>
                  {plan.badge}
                </div>
              )}

              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: plan.highlight ? 'rgba(255,255,255,0.55)' : 'rgba(27,19,60,0.50)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>{plan.name}</div>
                <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: plan.price !== null ? 48 : 36, lineHeight: 1.1, color: plan.highlight ? '#fff' : '#1B133C', marginBottom: 6 }}>
                  {plan.price !== null
                    ? `$${annual ? Math.round(plan.price * 0.8) : plan.price}`
                    : 'Custom'}
                  {plan.period && <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 15, fontWeight: 400, color: plan.highlight ? 'rgba(255,255,255,0.50)' : 'rgba(27,19,60,0.45)' }}>{plan.period}</span>}
                </div>
                <p style={{ fontSize: 13.5, lineHeight: 1.6, color: plan.highlight ? 'rgba(255,255,255,0.62)' : 'rgba(27,19,60,0.58)' }}>{plan.tagline}</p>
              </div>

              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.75rem', display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
                {plan.features.map(f => (
                  <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13.5, color: plan.highlight ? 'rgba(255,255,255,0.82)' : '#1B133C' }}>
                    <span style={{ marginTop: 1, flexShrink: 0 }}>
                      <CheckIcon size={15} color={plan.highlight ? '#a78bfa' : '#7c3aed'} />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>

              <button
                style={{
                  width: '100%',
                  borderRadius: 10,
                  padding: '0.8rem',
                  fontSize: 14,
                  fontWeight: 600,
                  fontFamily: 'Inter, sans-serif',
                  cursor: 'pointer',
                  transition: 'all 0.22s',
                  ...(plan.ctaStyle === 'filled'
                    ? { background: '#FEFEFE', color: '#1B133C', border: 'none', boxShadow: '0 4px 16px rgba(255,255,255,0.25)' }
                    : plan.highlight
                    ? { background: 'rgba(255,255,255,0.10)', color: '#fff', border: '1px solid rgba(255,255,255,0.20)' }
                    : { background: 'transparent', color: '#1B133C', border: '1px solid rgba(27,19,60,0.20)' }),
                }}
                onMouseEnter={e => { e.currentTarget.style.opacity = '0.85'; e.currentTarget.style.transform = 'translateY(-1px)' }}
                onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)' }}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="fade-up" style={{ marginTop: '5rem' }}>
          <h3 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 28, textAlign: 'center', color: '#1B133C', marginBottom: '2.5rem' }}>Common questions</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
            {[
              { q: 'Can I change plans later?', a: 'Yes — upgrade or downgrade at any time. Prorations are applied automatically.' },
              { q: 'What counts as a "worker run"?', a: 'A single end-to-end execution of one digital worker, regardless of how many steps it contains.' },
              { q: 'Do you store my passwords?', a: 'Never in plaintext. All secrets are encrypted with AES-256 at rest and in transit.' },
              { q: 'Is there a free trial for Growth?', a: 'Yes — 14 days free, no credit card required. Downgrade or cancel any time.' },
            ].map(item => (
              <div key={item.q} className="axon-card" style={{ padding: '1.25rem 1.5rem' }}>
                <div style={{ fontWeight: 600, fontSize: 14, color: '#1B133C', marginBottom: 6 }}>{item.q}</div>
                <div style={{ fontSize: 13.5, lineHeight: 1.65, color: 'rgba(27,19,60,0.60)' }}>{item.a}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
