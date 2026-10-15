import React from 'react';
import { ArrowRight, Zap, Filter, Eye, Cpu, Database } from 'lucide-react';

export default function HeroBanner({ onOpenAddModal, onExperienceClick, metrics }) {
  return (
    <section className="relative overflow-hidden pt-8 pb-14 border-b border-[#1B133C]/10 bg-gradient-to-b from-[#F7F6FC] via-white to-[#F2EFFE]">
      
      {/* Subtle ambient glow blobs */}
      <div 
        className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full pointer-events-none opacity-40 blur-[80px]" 
        style={{ background: 'radial-gradient(circle, rgba(167,139,250,0.35) 0%, transparent 70%)' }}
      />
      <div 
        className="absolute bottom-0 right-10 w-[350px] h-[250px] rounded-full pointer-events-none opacity-30 blur-[70px]" 
        style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.25) 0%, transparent 70%)' }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Subtle pill tag */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/70 border border-[#1B133C]/10 text-xs font-medium text-[#1B133C] mb-6 shadow-sm backdrop-blur-sm">
          <div className="bg-orange-500 rounded w-4 h-4 flex items-center justify-center text-white font-bold text-[10px]">
            <Zap className="w-2.5 h-2.5 fill-current" />
          </div>
          <span className="font-semibold tracking-wide uppercase text-[11px]">
            AUTONOMOUS WEB CHANGE DETECTION & NOISE SUPPRESSION
          </span>
        </div>

        {/* Hero Title styled with Instrument Serif */}
        <h1 className="font-['Instrument_Serif'] text-5xl sm:text-7xl font-normal tracking-tight text-[#1B133C] mb-4">
          Autonomous Web <em className="italic text-[#1B133C]">Change Intelligence</em>
        </h1>

        <p className="max-w-2xl mx-auto text-sm sm:text-base text-[#1B133C]/75 font-normal leading-relaxed mb-8">
          Monitors public web pages with headless browser rendering and alerts to{' '}
          <strong className="text-[#1B133C] font-semibold underline decoration-orange-500 decoration-2 underline-offset-4">
            meaningful changes
          </strong>{' '}
          while filtering timestamps, dynamic tokens, counters, and ads.
        </p>

        {/* Buttons matching Axon template */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
          <button
            onClick={onExperienceClick}
            className="flex items-center gap-2.5 px-8 py-3.5 rounded-xl bg-[#FEFEFE] text-[#1B133C] text-xs font-bold uppercase tracking-wider shadow-[0px_4px_12px_rgba(0,0,0,0.12)] hover:shadow-[0px_6px_16px_rgba(0,0,0,0.18)] hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer group"
          >
            <span>EXPERIENCE</span>
            <ArrowRight className="w-4 h-4 text-orange-500 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#1B133C] hover:bg-[#1B133C]/90 text-white text-xs font-bold uppercase tracking-wider shadow-sm hover:shadow hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
          >
            <span>START MONITORING</span>
          </button>
        </div>

        {/* Telemetry Stats strip in Axon glass cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="bg-white/75 backdrop-blur-md rounded-2xl p-5 text-left border border-[#1B133C]/10 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between text-[#1B133C]/60 text-xs font-mono mb-1">
              <span>ACTIVE TARGETS</span>
              <Eye className="w-4 h-4 text-orange-500" />
            </div>
            <div className="font-['Instrument_Serif'] text-4xl font-normal text-[#1B133C]">
              {metrics?.activeMonitorsCount ?? 5}
            </div>
            <div className="text-[11px] text-[#1B133C]/50 mt-1">Headless scheduled</div>
          </div>

          <div className="bg-white/75 backdrop-blur-md rounded-2xl p-5 text-left border border-[#1B133C]/10 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between text-[#1B133C]/60 text-xs font-mono mb-1">
              <span>SAVED FETCHES</span>
              <Database className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="font-['Instrument_Serif'] text-4xl font-normal text-[#1B133C]">
              {metrics?.coalescedRequestsSaved ?? 616}
            </div>
            <div className="text-[11px] text-emerald-700 font-medium mt-1">Request deduplication pool</div>
          </div>

          <div className="bg-white/75 backdrop-blur-md rounded-2xl p-5 text-left border border-[#1B133C]/10 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between text-[#1B133C]/60 text-xs font-mono mb-1">
              <span>NOISE FILTERED</span>
              <Filter className="w-4 h-4 text-amber-600" />
            </div>
            <div className="font-['Instrument_Serif'] text-4xl font-normal text-[#1B133C]">
              {metrics?.noiseAlertsSuppressed ?? 983}
            </div>
            <div className="text-[11px] text-amber-700 font-medium mt-1">Timestamps & ads suppressed</div>
          </div>

          <div className="bg-white/75 backdrop-blur-md rounded-2xl p-5 text-left border border-[#1B133C]/10 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between text-[#1B133C]/60 text-xs font-mono mb-1">
              <span>CHECKS COMPLETED</span>
              <Cpu className="w-4 h-4 text-purple-600" />
            </div>
            <div className="font-['Instrument_Serif'] text-4xl font-normal text-[#1B133C]">
              {metrics?.totalChecksPerformed ?? 1593}
            </div>
            <div className="text-[11px] text-[#1B133C]/50 mt-1">Zero domain spamming</div>
          </div>
        </div>

      </div>
    </section>
  );
}
