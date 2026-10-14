import React from 'react'
import AxonNav from './AxonNav'

const VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260714_113715_c7e0daa0-8bdd-4486-a2da-040901f8f0ea.mp4'

export default function HeroPage({ setPage, onOpenEarlyAccess }) {
  return (
    <section className="relative h-screen w-full overflow-hidden flex flex-col">
      {/* Background video: absolute inset-0 z-0, w-full h-[130%] object-cover object-top */}
      <video
        className="absolute inset-0 z-0 w-full h-[130%] object-cover object-top pointer-events-none"
        src={VIDEO_URL}
        autoPlay
        muted
        loop
        playsInline
      />

      {/* Navigation bar */}
      <AxonNav activePage="hero" setPage={setPage} onOpenEarlyAccess={onOpenEarlyAccess} />

      {/* Hero content — centered below nav with mt-8 md:mt-16, stacked vertically */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4 mt-8 md:mt-16">
        {/* Badge: mb-6, inline-flex pill with rounded-xl border border-[#1B133C]/10 bg-white/70 backdrop-blur-sm px-4 py-2 text-sm font-medium */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-xl border border-[#1B133C]/10 bg-white/70 backdrop-blur-sm px-4 py-2 text-sm font-medium text-[#1B133C]">
          <div className="bg-orange-500 rounded w-5 h-5 flex items-center justify-center text-white font-bold text-xs select-none">
            Y
          </div>
          <span>Funded by Y Combinator</span>
        </div>

        {/* Heading: font-['Instrument_Serif'] text-4xl sm:text-5xl md:text-7xl lg:text-8xl leading-[0.95] tracking-tight text-[#1B133C] max-w-4xl */}
        <h1 className="font-['Instrument_Serif'] text-4xl sm:text-5xl md:text-7xl lg:text-8xl leading-[0.95] tracking-tight text-[#1B133C] max-w-4xl text-center">
          Deploy digital workers
          <br />
          for mundane workflows
        </h1>

        {/* Subtitle: mt-5 sm:mt-6 max-w-3xl text-xs sm:text-sm md:text-base leading-relaxed text-[#1B133C]/70 */}
        <p className="mt-5 sm:mt-6 max-w-3xl text-xs sm:text-sm md:text-base leading-relaxed text-[#1B133C]/70 text-center">
          Eliminate your tedious browser work and 10x your team&apos;s capacity. Put intelligent agents on every routine process so you grow faster and deliver more for clients — effortlessly.
        </p>

        {/* CTA button: mt-7 sm:mt-8, styled as rounded-xl bg-[#FEFEFE] px-6 sm:px-8 py-3 sm:py-3.5 text-sm font-semibold text-[#1B133C] shadow-[0px_4px_12px_rgba(0,0,0,0.15)] with hover shadow shadow-[0px_6px_16px_rgba(0,0,0,0.2)] and transition-all duration-300 */}
        <button
          onClick={onOpenEarlyAccess}
          className="mt-7 sm:mt-8 rounded-xl bg-[#FEFEFE] px-6 sm:px-8 py-3 sm:py-3.5 text-sm font-semibold text-[#1B133C] shadow-[0px_4px_12px_rgba(0,0,0,0.15)] hover:shadow-[0px_6px_16px_rgba(0,0,0,0.2)] transition-all duration-300 cursor-pointer active:scale-95"
        >
          Get Early Access
        </button>
      </div>
    </section>
  )
}
