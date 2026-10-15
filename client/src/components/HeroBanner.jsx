import React from 'react';
import { ArrowRight, Eye, Database, Filter, Cpu, Plus } from 'lucide-react';

export default function HeroBanner({ onOpenAddModal, onExperienceClick, metrics }) {
  return (
    <section className="relative min-h-[85vh] flex flex-col justify-between pt-8 pb-12">
      {/* Hero content — centered */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex-1 flex flex-col items-center justify-center mt-4 mb-8">
        
        {/* Status Badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-xl border border-[#1B133C]/10 bg-white/70 backdrop-blur-sm px-4 py-2 text-xs font-mono font-medium text-[#1B133C] shadow-sm">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-semibold tracking-wider uppercase text-[11px]">
            Autonomous Web Change Intelligence
          </span>
        </div>

        {/* Heading */}
        <h1 className="font-['Instrument_Serif'] text-4xl sm:text-5xl md:text-7xl lg:text-8xl leading-[0.95] tracking-tight text-[#1B133C] max-w-4xl text-center">
          Detect changes that matter
          <br />
          <em className="italic font-normal">and filter out the noise</em>
        </h1>

        {/* Subtitle */}
        <p className="mt-5 sm:mt-6 max-w-3xl text-xs sm:text-sm md:text-base leading-relaxed text-[#1B133C]/70 text-center">
          Autonomous headless sandboxes tracking DOM mutations, visual regressions, and price thresholds with real-time noise suppression, request coalescing, and instant alerts.
        </p>

        {/* CTA Buttons */}
        <div className="mt-7 sm:mt-8 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={onExperienceClick}
            className="rounded-xl bg-[#FEFEFE] px-8 py-3.5 text-sm font-semibold text-[#1B133C] shadow-[0px_4px_12px_rgba(0,0,0,0.15)] hover:shadow-[0px_6px_16px_rgba(0,0,0,0.2)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 flex items-center gap-2 cursor-pointer"
          >
            <span>Experience Visual Picker</span>
            <Eye className="w-4 h-4 text-orange-500" />
          </button>

          <button
            onClick={onOpenAddModal}
            className="rounded-xl bg-[#1B133C] hover:bg-[#1B133C]/90 text-white px-8 py-3.5 text-sm font-semibold shadow-sm hover:shadow hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-orange-400" />
            <span>Add Monitor Target</span>
          </button>
        </div>

      </div>

      {/* KPI Cards Strip sitting over the landscape/water */}
      <div className="relative z-10 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 mt-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
              {metrics?.totalChecksPerformed ?? 1596}
            </div>
            <div className="text-[11px] text-[#1B133C]/50 mt-1">Zero domain spamming</div>
          </div>
        </div>
      </div>

    </section>
  );
}
