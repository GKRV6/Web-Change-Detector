import React from 'react'
import AxonNav from './AxonNav'

export default function AboutPage({ setPage, onOpenEarlyAccess }) {
  const VALUES = [
    {
      title: 'Dignity in Work',
      desc: 'Human beings are creative, empathetic problem-solvers. Forcing people to copy-paste between 14 browser tabs 8 hours a day is a misallocation of human potential.',
    },
    {
      title: 'Contextual Intelligence',
      desc: 'Simple scripts break when a button changes color. True digital workers must understand semantic intent, recover from unexpected edge cases, and self-heal automatically.',
    },
    {
      title: 'Radical Transparency',
      desc: 'No black boxes. Every autonomous action taken by an Axon worker is fully recorded, visually verifiable, and inspectable by human oversight at all times.',
    },
  ]

  const MILESTONES = [
    { date: 'Winter 2024', event: 'Founded & backed by Y Combinator (W24 batch).' },
    { date: 'Spring 2024', event: 'Released first generation self-healing DOM inspection engine.' },
    { date: 'Summer 2024', event: 'Crossed 1,000,000 automated workflow tasks executed with 99.8% precision.' },
    { date: 'Today', event: 'Powering automated operations for hundreds of forward-thinking teams globally.' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F7F6FC] via-white to-[#F2EFFE] text-[#1B133C] flex flex-col font-sans">
      <AxonNav activePage="about" setPage={setPage} onOpenEarlyAccess={onOpenEarlyAccess} />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-xl border border-[#1B133C]/10 bg-white/70 backdrop-blur-sm px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#1B133C] mb-4">
            Our Mission & Purpose
          </div>
          <h1 className="font-['Instrument_Serif'] text-4xl sm:text-6xl md:text-7xl leading-[1] tracking-tight text-[#1B133C] mb-6">
            Eliminating mundane browser toil so teams can build what matters
          </h1>
          <p className="text-sm sm:text-base leading-relaxed text-[#1B133C]/70">
            Axon was founded by engineers and operations veterans who grew frustrated watching brilliant teams squander their best hours on repetitive, mechanical browser workflows.
          </p>
        </div>

        {/* Story Section */}
        <div className="bg-white/70 backdrop-blur-md rounded-2xl p-8 md:p-12 border border-[#1B133C]/10 shadow-sm mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-200/60 rounded-lg px-3 py-1 mb-4">
                <div className="bg-orange-500 rounded w-4 h-4 flex items-center justify-center text-white font-bold text-[10px]">
                  Y
                </div>
                <span className="text-xs font-semibold text-orange-950">Backed by Y Combinator</span>
              </div>
              <h2 className="font-['Instrument_Serif'] text-3xl sm:text-4xl text-[#1B133C] mb-4">
                The browser is where mundane work goes to hide
              </h2>
              <p className="text-xs sm:text-sm leading-relaxed text-[#1B133C]/70 mb-4">
                Modern work takes place across dozens of disjointed web portals, legacy enterprise software, and third-party dashboards that lack clean APIs. 
              </p>
              <p className="text-xs sm:text-sm leading-relaxed text-[#1B133C]/70 mb-6">
                Axon bridges this gap by deploying digital workers that navigate the web with human-like precision and programmatic reliability.
              </p>
              <button
                onClick={onOpenEarlyAccess}
                className="rounded-xl bg-[#1B133C] px-6 py-3 text-sm font-semibold text-white shadow-sm hover:opacity-90 transition-opacity cursor-pointer"
              >
                Join Our Early Access
              </button>
            </div>

            <div className="space-y-4">
              <h3 className="font-['Instrument_Serif'] text-2xl text-[#1B133C]">Journey & Milestones</h3>
              <div className="space-y-3 font-sans">
                {MILESTONES.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-white/50 border border-[#1B133C]/5 flex items-start gap-3"
                  >
                    <span className="text-xs font-bold text-orange-600 shrink-0 mt-0.5">
                      {item.date}
                    </span>
                    <span className="text-xs sm:text-sm text-[#1B133C]/80">
                      {item.event}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {VALUES.map((val, idx) => (
            <div
              key={idx}
              className="bg-white/70 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-[#1B133C]/10 shadow-sm"
            >
              <span className="text-xs font-bold text-[#1B133C]/40 uppercase tracking-wider">
                Principle 0{idx + 1}
              </span>
              <h3 className="font-['Instrument_Serif'] text-2xl text-[#1B133C] mt-2 mb-3">
                {val.title}
              </h3>
              <p className="text-xs sm:text-sm leading-relaxed text-[#1B133C]/70">
                {val.desc}
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
