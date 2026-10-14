import React from 'react';
import { ArrowRight, ShieldCheck, Zap, Filter, Eye, Cpu, Database } from 'lucide-react';

export default function HeroBanner({ onOpenAddModal, onExperienceClick, metrics }) {
  return (
    <section className="relative overflow-hidden pt-8 pb-14 border-b border-white/10 bg-horizon-950">
      
      {/* Background artwork inspired by HorizonX template */}
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
        <img 
          src="/horizonx-hero.png" 
          alt="HorizonX Cosmic Backdrop" 
          className="w-full h-full object-cover object-center filter saturate-125 contrast-110"
        />
        {/* Cosmic gradient vignettes */}
        <div className="absolute inset-0 bg-gradient-to-t from-horizon-950 via-horizon-950/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-horizon-950 via-transparent to-horizon-950" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Subtle pill tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-horizon-900/90 border border-horizon-orange/30 text-xs font-mono text-horizon-orange mb-6 shadow-glow-orange backdrop-blur-md">
          <Zap className="w-3.5 h-3.5 animate-bounce" />
          <span>AUTONOMOUS WEB CHANGE DETECTION & NOISE SUPPRESSION</span>
        </div>

        {/* Hero Title styled exactly like HorizonX template */}
        <h1 className="text-5xl sm:text-7xl font-black tracking-tight text-white mb-4">
          Horizon<span className="text-horizon-orange drop-shadow-[0_0_35px_rgba(255,122,41,0.6)]">X</span>
        </h1>

        <p className="max-w-2xl mx-auto text-lg sm:text-xl text-slate-300 font-light leading-relaxed mb-8">
          Monitors public web pages with headless browser rendering and alerts to <span className="text-white font-medium underline decoration-horizon-orange decoration-2">meaningful changes</span> while filtering timestamps, dynamic tokens, counters, and ads.
        </p>

        {/* Buttons matching template: EXPERIENCE -> */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
          <button
            onClick={onExperienceClick}
            className="flex items-center gap-3 px-8 py-3.5 rounded-xl border-2 border-white/20 bg-black/40 hover:bg-white/10 hover:border-horizon-orange text-white text-xs font-bold uppercase tracking-widest backdrop-blur-md transition-all group shadow-glass"
          >
            <span>EXPERIENCE</span>
            <ArrowRight className="w-4 h-4 text-horizon-orange group-hover:translate-x-1.5 transition-transform" />
          </button>

          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-horizon-orange hover:bg-horizon-orangeHover text-white text-xs font-bold uppercase tracking-widest shadow-glow-orange hover:shadow-glow-orange-lg active:scale-95 transition-all"
          >
            <span>START MONITORING</span>
          </button>
        </div>

        {/* Telemetry Stats strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="horizon-card rounded-2xl p-4 text-left border-l-2 border-l-horizon-orange">
            <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-1">
              <span>ACTIVE TARGETS</span>
              <Eye className="w-4 h-4 text-horizon-orange" />
            </div>
            <div className="text-2xl font-black text-white">{metrics?.activeMonitorsCount ?? 5}</div>
            <div className="text-[11px] text-slate-400 mt-1">Headless scheduled</div>
          </div>

          <div className="horizon-card rounded-2xl p-4 text-left border-l-2 border-l-emerald-400">
            <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-1">
              <span>SAVED FETCHES</span>
              <Database className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-white">{metrics?.coalescedRequestsSaved ?? 614}</div>
            <div className="text-[11px] text-emerald-400/80 mt-1">Request deduplication pool</div>
          </div>

          <div className="horizon-card rounded-2xl p-4 text-left border-l-2 border-l-amber-400">
            <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-1">
              <span>NOISE FILTERED</span>
              <Filter className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-black text-white">{metrics?.noiseAlertsSuppressed ?? 982}</div>
            <div className="text-[11px] text-amber-400/80 mt-1">Timestamps & ads suppressed</div>
          </div>

          <div className="horizon-card rounded-2xl p-4 text-left border-l-2 border-l-cyan-400">
            <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-1">
              <span>CHECKS COMPLETED</span>
              <Cpu className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-black text-white">{metrics?.totalChecksPerformed ?? 1428}</div>
            <div className="text-[11px] text-slate-400 mt-1">Zero domain spamming</div>
          </div>
        </div>

      </div>
    </section>
  );
}
