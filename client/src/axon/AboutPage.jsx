import React from 'react'
import AxonNav from './AxonNav'
import { YCIcon } from './Icons'

const TEAM = [
  { name: 'Priya Mehta', role: 'CEO & Co-founder', bg: '#c4b5fd', initials: 'PM', bio: 'Former PM at Stripe. Built the payment automation team that processed $40B+ annually.' },
  { name: 'James Okafor', role: 'CTO & Co-founder', bg: '#a78bfa', initials: 'JO', bio: 'Previously Staff Engineer at Figma. Led the multiplayer infra rewrite powering 8M+ concurrent users.' },
  { name: 'Selin Yıldız', role: 'Head of Design', bg: '#7c3aed', initials: 'SY', bio: 'Design lead at Linear. Obsessed with reducing friction between human intent and software action.' },
  { name: 'David Park', role: 'Head of Growth', bg: '#5b21b6', initials: 'DP', bio: 'Ran growth at Loom from $0 to $50M ARR. Expert in PLG and bottom-up enterprise expansion.' },
]

const VALUES = [
  { icon: '🧠', title: 'Intelligence first', desc: 'We believe automation should understand context, not just follow scripts.' },
  { icon: '🎯', title: 'Radical simplicity', desc: "If a non-technical person can't use it, we haven't finished building it yet." },
  { icon: '🔍', title: 'Relentless transparency', desc: 'Every worker run is observable. No black boxes, no mystery failures.' },
  { icon: '🤝', title: 'Customer obsession', desc: "We measure success by your team's capacity — not our feature count." },
]

const TIMELINE = [
  { year: '2023', event: 'Founded by Priya and James after experiencing the pain of manual browser workflows firsthand at their previous companies.' },
  { year: 'Jan 2024', event: 'Accepted into Y Combinator W24 batch. Built the first working prototype in 3 weeks.' },
  { year: 'Mar 2024', event: 'Launched private beta to 50 teams. First customer: a fintech firm automating 1,200 daily compliance checks.' },
  { year: 'Jun 2024', event: 'Seed round closed. Full team assembled. Expanded to 400+ teams on the waitlist.' },
  { year: 'Today', event: 'Public launch imminent. Join the waitlist and be among the first to deploy your digital workers.' },
]

export default function AboutPage({ setPage }) {
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(168deg, #f9f6ff 0%, #fdfbff 50%, #f0f4ff 100%)', position: 'relative', overflow: 'hidden' }}>

      {/* Blobs */}
      <div className="axon-blob" style={{ width: 500, height: 500, top: -100, right: -150, background: 'radial-gradient(circle, rgba(167,139,250,0.18) 0%, transparent 68%)' }} />
      <div className="axon-blob" style={{ width: 400, height: 400, bottom: 80, left: -80, background: 'radial-gradient(circle, rgba(196,165,253,0.15) 0%, transparent 70%)' }} />

      <AxonNav activePage="about" setPage={setPage} />

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '4rem 24px 6rem', position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <div className="fade-up" style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div className="axon-pill" style={{ marginBottom: 20, display: 'inline-flex' }}>Our Story</div>
          <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', lineHeight: 1.05, letterSpacing: '-0.02em', color: '#1B133C', marginBottom: '1.2rem' }}>
            We got tired of watching smart people do <em>dumb busywork</em>
          </h2>
          <p style={{ maxWidth: 600, margin: '0 auto 1.25rem', fontSize: 15, lineHeight: 1.75, color: 'rgba(27,19,60,0.62)' }}>
            Axon started because its founders spent years watching talented engineers, analysts, and operators burn hours on repetitive browser tasks that computers should handle. We built the platform we always wished existed.
          </p>
          {/* YC badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '0.5rem 1rem', borderRadius: 12, background: 'rgba(242,102,37,0.08)', border: '1px solid rgba(242,102,37,0.18)', fontSize: 13, fontWeight: 600, color: '#c2410c' }}>
            <YCIcon />
            <span>Y Combinator W24</span>
          </div>
        </div>

        {/* Mission banner */}
        <div className="fade-up axon-card" style={{ padding: '2.5rem', marginBottom: '4rem', textAlign: 'center', background: 'rgba(27,19,60,0.96)', border: '1px solid rgba(167,139,250,0.25)' }}>
          <p style={{ fontFamily: "'Instrument Serif', serif", fontSize: 'clamp(1.4rem, 3vw, 2.2rem)', lineHeight: 1.35, color: '#fff', maxWidth: 680, margin: '0 auto', fontStyle: 'italic' }}>
            "Every minute a person spends on a task a computer could do is a minute stolen from the work only humans can do."
          </p>
          <div style={{ marginTop: 20, fontSize: 13, color: 'rgba(255,255,255,0.45)', fontWeight: 500 }}>— Priya Mehta, CEO of Axon</div>
        </div>

        {/* Values */}
        <div className="fade-up delay-1" style={{ marginBottom: '4rem' }}>
          <h3 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 28, color: '#1B133C', textAlign: 'center', marginBottom: '2rem' }}>What we believe</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 16 }}>
            {VALUES.map(v => (
              <div key={v.title} className="axon-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
                <div style={{ fontSize: 30, marginBottom: 12 }}>{v.icon}</div>
                <div style={{ fontWeight: 700, fontSize: 14, color: '#1B133C', marginBottom: 7 }}>{v.title}</div>
                <div style={{ fontSize: 13, lineHeight: 1.65, color: 'rgba(27,19,60,0.58)' }}>{v.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div className="fade-up delay-2" style={{ marginBottom: '4rem' }}>
          <h3 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 28, color: '#1B133C', textAlign: 'center', marginBottom: '2rem' }}>The team</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
            {TEAM.map(member => (
              <div key={member.name} className="axon-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
                <div style={{ width: 60, height: 60, borderRadius: '50%', background: member.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, color: '#fff', margin: '0 auto 14px', letterSpacing: '0.02em' }}>
                  {member.initials}
                </div>
                <div style={{ fontWeight: 700, fontSize: 15, color: '#1B133C', marginBottom: 3 }}>{member.name}</div>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: '#7c3aed', marginBottom: 10, letterSpacing: '0.02em' }}>{member.role}</div>
                <div style={{ fontSize: 13, lineHeight: 1.6, color: 'rgba(27,19,60,0.58)' }}>{member.bio}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="fade-up delay-2" style={{ marginBottom: '4rem' }}>
          <h3 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 28, color: '#1B133C', marginBottom: '2rem' }}>Our journey</h3>
          <div style={{ position: 'relative', paddingLeft: 24 }}>
            {/* Vertical line */}
            <div style={{ position: 'absolute', left: 7, top: 8, bottom: 8, width: 2, background: 'linear-gradient(180deg, #c4b5fd, #7c3aed)' }} />
            {TIMELINE.map((t, i) => (
              <div key={t.year} style={{ position: 'relative', paddingLeft: 28, marginBottom: i < TIMELINE.length - 1 ? '2rem' : 0 }}>
                <div style={{ position: 'absolute', left: 0, top: 5, width: 14, height: 14, borderRadius: '50%', background: '#7c3aed', border: '2px solid #fff', boxShadow: '0 0 0 2px #7c3aed' }} />
                <div style={{ fontSize: 11, fontWeight: 700, color: '#7c3aed', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>{t.year}</div>
                <div style={{ fontSize: 14, lineHeight: 1.65, color: 'rgba(27,19,60,0.72)' }}>{t.event}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="fade-up" style={{ textAlign: 'center', padding: '3rem 2rem', borderRadius: 20, background: 'linear-gradient(135deg, rgba(196,181,253,0.25) 0%, rgba(167,139,250,0.12) 100%)', border: '1px solid rgba(124,58,237,0.18)' }}>
          <h3 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 28, color: '#1B133C', marginBottom: 10 }}>Ready to deploy your first digital worker?</h3>
          <p style={{ fontSize: 14, color: 'rgba(27,19,60,0.60)', marginBottom: '1.75rem' }}>Join 400+ teams on the waitlist. Free plan available, no credit card required.</p>
          <button
            onClick={() => setPage('home')}
            style={{ borderRadius: 12, background: '#1B133C', color: '#fff', border: 'none', padding: '0.875rem 2rem', fontSize: 15, fontWeight: 600, fontFamily: 'Inter, sans-serif', cursor: 'pointer', boxShadow: '0 4px 24px rgba(124,58,237,0.28)', transition: 'transform 0.2s, box-shadow 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(124,58,237,0.38)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 24px rgba(124,58,237,0.28)' }}
          >
            Get Early Access →
          </button>
        </div>

      </div>
    </div>
  )
}
