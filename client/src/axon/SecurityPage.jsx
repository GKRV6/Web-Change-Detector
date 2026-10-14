import React from 'react'
import AxonNav from './AxonNav'

export default function SecurityPage({ setPage, onOpenEarlyAccess }) {
  const SECURITY_PILLARS = [
    {
      title: 'Ephemeral Headless Sandboxes',
      badge: 'Zero Persistent State',
      desc: 'Each worker executes inside an isolated microVM sandbox. Browser profiles, cookies, and cached artifacts are cryptographically scrubbed the millisecond a workflow terminates.',
    },
    {
      title: 'HSM Vault Credential Injection',
      badge: 'AES-256 GCM',
      desc: 'Logins and MFA tokens are injected at runtime via hardware-security-module backed vaults. Your plaintext credentials are never revealed to worker logs, DOM trees, or telemetry.',
    },
    {
      title: 'SOC 2 Type II Certified',
      badge: 'Continuous Compliance',
      desc: 'Audited annually by independent security compliance auditors covering security, availability, confidential handling, and change management procedures.',
    },
    {
      title: 'Immutable Audit Trail',
      badge: 'Tamper-Proof Playback',
      desc: 'Every click, network request, and snapshot is cryptographically signed and stored in immutable, append-only logs for rigorous enterprise compliance inspection.',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F7F6FC] via-white to-[#F2EFFE] text-[#1B133C] flex flex-col font-sans">
      <AxonNav activePage="security" setPage={setPage} onOpenEarlyAccess={onOpenEarlyAccess} />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-xl border border-[#1B133C]/10 bg-white/70 backdrop-blur-sm px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#1B133C] mb-4">
            Security & Compliance First
          </div>
          <h1 className="font-['Instrument_Serif'] text-4xl sm:text-6xl md:text-7xl leading-[1] tracking-tight text-[#1B133C] mb-6">
            Autonomous automation you can safely trust with sensitive workflows
          </h1>
          <p className="text-sm sm:text-base leading-relaxed text-[#1B133C]/70">
            We built Axon with defense-in-depth principles from day one. Trusted by financial institutions, legal teams, and healthcare operators who demand zero-compromise security.
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {SECURITY_PILLARS.map((item, idx) => (
            <div
              key={idx}
              className="bg-white/70 backdrop-blur-md rounded-2xl p-8 border border-[#1B133C]/10 shadow-sm flex flex-col justify-between"
            >
              <div>
                <span className="text-[11px] font-semibold tracking-wider uppercase text-orange-600 bg-orange-50 px-2.5 py-1 rounded-md">
                  {item.badge}
                </span>
                <h3 className="font-['Instrument_Serif'] text-3xl text-[#1B133C] mt-4 mb-3">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm leading-relaxed text-[#1B133C]/70">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Security Diagram Card */}
        <div className="bg-[#1B133C] text-white rounded-2xl p-8 md:p-12 shadow-xl">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-400 bg-orange-400/10 border border-orange-400/20 px-3 py-1 rounded-full">
              Defense In Depth Architecture
            </span>
            <h2 className="font-['Instrument_Serif'] text-3xl sm:text-5xl mt-6 mb-4 leading-tight">
              Isolated Execution Pipeline
            </h2>
            <p className="text-sm text-white/70 leading-relaxed mb-8">
              Every request is gated by zero-trust identity verification, injected into an ephemeral Chromium sandbox, and verified through an encrypted outbound proxy before completing execution.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
              <div className="border border-white/10 rounded-xl p-4 bg-white/5">
                <div className="text-white/40 uppercase mb-1 font-sans text-[10px]">Step 01</div>
                <div className="text-emerald-400 font-bold mb-1">Vault Authorization</div>
                <div className="text-white/70">JIT credential check with mutual TLS verification</div>
              </div>
              <div className="border border-white/10 rounded-xl p-4 bg-white/5">
                <div className="text-white/40 uppercase mb-1 font-sans text-[10px]">Step 02</div>
                <div className="text-orange-400 font-bold mb-1">MicroVM Sandbox</div>
                <div className="text-white/70">Isolated execution without local filesystem retention</div>
              </div>
              <div className="border border-white/10 rounded-xl p-4 bg-white/5">
                <div className="text-white/40 uppercase mb-1 font-sans text-[10px]">Step 03</div>
                <div className="text-cyan-400 font-bold mb-1">Signed Audit Log</div>
                <div className="text-white/70">Immutable cryptographic proof dispatched to customer</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
