import React, { useState } from 'react'
import confetti from 'canvas-confetti'

export default function EarlyAccessModal({ isOpen, onClose }) {
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [submitted, setSubmitted] = useState(false)

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email) return

    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#1B133C', '#F97316', '#A855F7']
      })
    } catch (err) {
      // ignore
    }

    setSubmitted(true)
  }

  const handleReset = () => {
    setSubmitted(false)
    setEmail('')
    setCompany('')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1B133C]/40 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-white rounded-2xl p-6 sm:p-8 shadow-2xl border border-[#1B133C]/10">
        <button
          onClick={handleReset}
          className="absolute top-4 right-4 text-[#1B133C]/40 hover:text-[#1B133C] transition-colors p-1 cursor-pointer"
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {!submitted ? (
          <div>
            <div className="inline-flex items-center gap-2 rounded-xl border border-[#1B133C]/10 bg-[#1B133C]/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#1B133C] mb-4">
              Private Beta
            </div>
            <h2 className="font-['Instrument_Serif'] text-3xl sm:text-4xl text-[#1B133C] mb-2 leading-tight">
              Deploy your first digital worker
            </h2>
            <p className="text-xs sm:text-sm text-[#1B133C]/70 mb-6 leading-relaxed">
              Join 400+ forward-thinking teams on the Axon waitlist. We onboard new teams weekly.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#1B133C] uppercase tracking-wider mb-1.5">
                  Work Email <span className="text-orange-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#1B133C]/15 focus:border-[#1B133C] focus:ring-1 focus:ring-[#1B133C] outline-none text-sm text-[#1B133C] placeholder:text-[#1B133C]/30 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1B133C] uppercase tracking-wider mb-1.5">
                  Company / Organization
                </label>
                <input
                  type="text"
                  placeholder="Acme Corp"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#1B133C]/15 focus:border-[#1B133C] focus:ring-1 focus:ring-[#1B133C] outline-none text-sm text-[#1B133C] placeholder:text-[#1B133C]/30 bg-white"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-3 rounded-xl bg-[#1B133C] hover:bg-[#1B133C]/90 text-white font-semibold text-sm transition-all duration-200 cursor-pointer shadow-md"
              >
                Request Access Now
              </button>
            </form>
          </div>
        ) : (
          <div className="text-center py-6">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="font-['Instrument_Serif'] text-3xl text-[#1B133C] mb-2">
              You&apos;re on the list!
            </h3>
            <p className="text-xs sm:text-sm text-[#1B133C]/70 mb-6">
              We&apos;ve reserved your priority spot. Look for an invite link from our engineering team shortly at <strong className="text-[#1B133C]">{email}</strong>.
            </p>
            <button
              onClick={handleReset}
              className="px-6 py-2.5 rounded-xl bg-[#1B133C] text-white text-xs font-semibold cursor-pointer"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
