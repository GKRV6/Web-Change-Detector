import React from 'react'
import AxonNav from './AxonNav'

const FEATURES = [
  {
    icon: (
      <svg className="w-6 h-6 text-[#1B133C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: 'Self-Healing Browser Workers',
    desc: 'Digital workers adapt autonomously to CSS selector shifts, redesigned layouts, and DOM updates without human intervention.',
    tag: 'Resilient DOM Engine',
  },
  {
    icon: (
      <svg className="w-6 h-6 text-[#1B133C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    title: 'Natural Language Automation',
    desc: 'Describe any repetitive workflow in plain English: "Download supplier invoices every Monday and reconcile them against QuickBooks."',
    tag: 'Zero Code Required',
  },
  {
    icon: (
      <svg className="w-6 h-6 text-[#1B133C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    title: 'Zero-Credential Exposure',
    desc: 'Ephemeral headless sandboxes execute logins in isolated HSM-backed vaults. Passwords and tokens never touch plain text.',
    tag: 'Enterprise Cryptography',
  },
  {
    icon: (
      <svg className="w-6 h-6 text-[#1B133C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
    title: 'Infinite Parallel Scaling',
    desc: 'Deploy 1 or 1,000 digital workers simultaneously across geographic regions with automatic rate limiting and queue management.',
    tag: 'Global Edge Fleet',
  },
  {
    icon: (
      <svg className="w-6 h-6 text-[#1B133C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: 'Visual Diff & Full Audit Logs',
    desc: 'Every click, keystroke, and downloaded artifact is captured with visual playback, structured JSON diffs, and timestamped receipts.',
    tag: '100% Traceability',
  },
  {
    icon: (
      <svg className="w-6 h-6 text-[#1B133C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
      </svg>
    ),
    title: 'Bi-directional Webhooks & API',
    desc: 'Trigger workers from Slack, HubSpot, Salesforce, or your backend. Feed verified output data directly into your warehouse.',
    tag: 'Universal Webhooks',
  },
]

export default function FeaturesPage({ setPage, onOpenEarlyAccess }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F7F6FC] via-white to-[#F2EFFE] text-[#1B133C] flex flex-col font-sans">
      <AxonNav activePage="features" setPage={setPage} onOpenEarlyAccess={onOpenEarlyAccess} />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-xl border border-[#1B133C]/10 bg-white/70 backdrop-blur-sm px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#1B133C] mb-4">
            Engineered for Autonomous Execution
          </div>
          <h1 className="font-['Instrument_Serif'] text-4xl sm:text-6xl md:text-7xl leading-[1] tracking-tight text-[#1B133C] mb-6">
            Intelligent digital workers built for real-world chaos
          </h1>
          <p className="text-sm sm:text-base leading-relaxed text-[#1B133C]/70">
            Unlike fragile traditional RPA scripts that shatter the moment a button moves by 2 pixels, Axon&apos;s digital workers understand context, semantics, and website logic.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {FEATURES.map((feature, idx) => (
            <div
              key={idx}
              className="bg-white/70 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-[#1B133C]/10 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#1B133C]/5 flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <div className="inline-block text-[11px] font-semibold tracking-wider uppercase text-[#1B133C]/60 mb-2">
                  {feature.tag}
                </div>
                <h3 className="font-['Instrument_Serif'] text-2xl text-[#1B133C] leading-snug mb-3">
                  {feature.title}
                </h3>
                <p className="text-xs sm:text-sm leading-relaxed text-[#1B133C]/70">
                  {feature.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Interactive Comparison Strip */}
        <div className="bg-white/70 backdrop-blur-md rounded-2xl p-8 border border-[#1B133C]/10 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-orange-600 bg-orange-50 px-2.5 py-1 rounded-md">
                Why Legacy Automation Fails
              </span>
              <h2 className="font-['Instrument_Serif'] text-3xl sm:text-4xl text-[#1B133C] mt-4 mb-4">
                Humans shouldn&apos;t spend 4 hours a day clicking repetitive forms
              </h2>
              <p className="text-sm leading-relaxed text-[#1B133C]/70 mb-6">
                Axon digital workers observe browser workflows like a senior operations analyst, verifying each step with multi-modal inspection before committing state changes.
              </p>
              <button
                onClick={onOpenEarlyAccess}
                className="rounded-xl bg-[#1B133C] px-6 py-3 text-sm font-semibold text-white shadow-sm hover:opacity-90 transition-opacity cursor-pointer"
              >
                Deploy Your First Worker
              </button>
            </div>

            <div className="bg-[#1B133C] text-white rounded-xl p-6 font-mono text-xs space-y-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-white/60">WORKER_ID</span>
                <span className="text-emerald-400 font-semibold">axon-agent-0929 #RUNNING</span>
              </div>
              <div className="space-y-1.5 text-white/80">
                <p className="text-white/40">// Autonomous Browser Session</p>
                <p>&gt; Target: Supplier Portal (OAuth2 verified)</p>
                <p>&gt; Navigating to `/invoices/pending`</p>
                <p>&gt; Detected layout change: button shifted from `.btn-dl` to `#download-v2`</p>
                <p className="text-emerald-400">&gt; Self-healed selector: confidence 99.8%</p>
                <p>&gt; Downloaded 42 PDF invoices (SHA-256 verified)</p>
                <p className="text-emerald-300">&gt; Reconciled with ERP: 0 errors, 100% matched</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
