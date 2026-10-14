import React, { useState } from 'react'
import AxonNav from './AxonNav'

export default function PlansPage({ setPage, onOpenEarlyAccess }) {
  const [isAnnual, setIsAnnual] = useState(true)

  const PLANS = [
    {
      name: 'Starter',
      badge: 'Free During Beta',
      price: isAnnual ? '$0' : '$0',
      period: 'forever',
      description: 'Ideal for individual operators automating personal repetitive browser chores.',
      features: [
        'Up to 3 concurrent digital workers',
        '500 monthly workflow runs',
        'Standard self-healing DOM engine',
        'Visual execution audit logs (7 days)',
        'Community Discord & email support',
      ],
      buttonText: 'Start Free',
      highlighted: false,
    },
    {
      name: 'Growth',
      badge: 'Most Popular',
      price: isAnnual ? '$79' : '$99',
      period: 'per month',
      description: 'Designed for fast-growing operations, finance, and agency teams scaling capacity.',
      features: [
        'Up to 25 concurrent digital workers',
        'Unlimited workflow runs',
        'Sub-second parallel headless execution',
        'Custom webhooks & REST API trigger',
        'Enterprise encrypted credential vault',
        'Priority 24/7 engineering support',
      ],
      buttonText: 'Get Early Access',
      highlighted: true,
    },
    {
      name: 'Enterprise',
      badge: 'Dedicated Fleet',
      price: 'Custom',
      period: 'tailored SLA',
      description: 'Private VPC deployment, custom compliance guardrails, and dedicated worker fleet.',
      features: [
        'Unlimited dedicated worker sandboxes',
        'Custom SSO / SAML & SCIM provisioning',
        'SOC 2 Type II compliance reports',
        'Air-gapped private on-premise runner option',
        'Dedicated Solutions Architect',
        '99.99% execution uptime SLA',
      ],
      buttonText: 'Contact Sales',
      highlighted: false,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F7F6FC] via-white to-[#F2EFFE] text-[#1B133C] flex flex-col font-sans">
      <AxonNav activePage="plans" setPage={setPage} onOpenEarlyAccess={onOpenEarlyAccess} />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 rounded-xl border border-[#1B133C]/10 bg-white/70 backdrop-blur-sm px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#1B133C] mb-4">
            Transparent Pricing
          </div>
          <h1 className="font-['Instrument_Serif'] text-4xl sm:text-6xl md:text-7xl leading-[1] tracking-tight text-[#1B133C] mb-6">
            Predictable plans that scale with your digital workforce
          </h1>
          <p className="text-sm sm:text-base leading-relaxed text-[#1B133C]/70 mb-8">
            Deploy tireless digital workers for a fraction of the cost of manual contractor hours. Zero per-seat penalties.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center bg-white/80 backdrop-blur-md p-1.5 rounded-xl border border-[#1B133C]/10 shadow-sm">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all cursor-pointer ${
                !isAnnual
                  ? 'bg-[#1B133C] text-white shadow-sm'
                  : 'text-[#1B133C]/70 hover:text-[#1B133C]'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                isAnnual
                  ? 'bg-[#1B133C] text-white shadow-sm'
                  : 'text-[#1B133C]/70 hover:text-[#1B133C]'
              }`}
            >
              <span>Annual Billing</span>
              <span className="bg-orange-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch mb-20">
          {PLANS.map((plan, idx) => (
            <div
              key={idx}
              className={`relative rounded-2xl p-8 flex flex-col justify-between transition-all duration-300 ${
                plan.highlighted
                  ? 'bg-[#1B133C] text-white shadow-xl scale-[1.02] border-2 border-[#1B133C]'
                  : 'bg-white/70 backdrop-blur-md text-[#1B133C] border border-[#1B133C]/10 shadow-sm hover:shadow-md'
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                  {plan.badge}
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3
                    className={`font-['Instrument_Serif'] text-3xl ${
                      plan.highlighted ? 'text-white' : 'text-[#1B133C]'
                    }`}
                  >
                    {plan.name}
                  </h3>
                  {!plan.highlighted && (
                    <span className="text-[11px] font-semibold text-[#1B133C]/60 bg-[#1B133C]/5 px-2.5 py-1 rounded-full">
                      {plan.badge}
                    </span>
                  )}
                </div>

                <p
                  className={`text-xs sm:text-sm leading-relaxed mb-6 ${
                    plan.highlighted ? 'text-white/75' : 'text-[#1B133C]/70'
                  }`}
                >
                  {plan.description}
                </p>

                <div className="flex items-baseline gap-2 mb-8 border-b pb-6 border-current/10">
                  <span
                    className={`font-['Instrument_Serif'] text-5xl font-normal ${
                      plan.highlighted ? 'text-white' : 'text-[#1B133C]'
                    }`}
                  >
                    {plan.price}
                  </span>
                  <span
                    className={`text-xs ${
                      plan.highlighted ? 'text-white/60' : 'text-[#1B133C]/60'
                    }`}
                  >
                    / {plan.period}
                  </span>
                </div>

                <div className="space-y-3.5 mb-8">
                  <div
                    className={`text-xs font-semibold uppercase tracking-wider ${
                      plan.highlighted ? 'text-white/60' : 'text-[#1B133C]/50'
                    }`}
                  >
                    Included Capabilities
                  </div>
                  {plan.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-2.5 text-xs sm:text-sm">
                      <svg
                        className={`w-4 h-4 mt-0.5 shrink-0 ${
                          plan.highlighted ? 'text-emerald-400' : 'text-emerald-600'
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className={plan.highlighted ? 'text-white/90' : 'text-[#1B133C]/80'}>
                        {feat}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={onOpenEarlyAccess}
                className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 cursor-pointer ${
                  plan.highlighted
                    ? 'bg-white text-[#1B133C] hover:bg-white/90 shadow-sm'
                    : 'bg-[#1B133C] text-white hover:bg-[#1B133C]/90 shadow-sm'
                }`}
              >
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
