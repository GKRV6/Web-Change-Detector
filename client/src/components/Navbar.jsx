import React from 'react';
import { Radio, Plus, Eye, GitCompare, LineChart, ShieldCheck, Bell, ChevronDown } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, onOpenAddModal, queueMetrics }) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-horizon-950/80 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* HorizonX Logo matching the template */}
        <div 
          onClick={() => setActiveTab('dashboard')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-horizon-orange/20 to-horizon-800 border border-horizon-orange/40 shadow-glow-orange group-hover:scale-105 transition-transform">
            <Radio className="w-5 h-5 text-horizon-orange animate-pulse-subtle" />
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-horizon-orange animate-ping" />
          </div>
          <div className="flex flex-col">
            <div className="text-2xl font-black tracking-tight flex items-center">
              <span className="text-white">Horizon</span>
              <span className="text-horizon-orange text-3xl font-black transition-transform group-hover:translate-x-0.5">X</span>
            </div>
            <span className="text-[10px] tracking-widest text-slate-400 uppercase -mt-1 font-mono">
              Change Intelligence
            </span>
          </div>
        </div>

        {/* Center Nav tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-horizon-900/60 p-1.5 rounded-2xl border border-white/5 backdrop-blur-md">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-2 ${
              activeTab === 'dashboard'
                ? 'bg-horizon-orange text-white shadow-glow-orange font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            Dashboard
          </button>

          <button
            onClick={() => setActiveTab('picker')}
            className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-2 ${
              activeTab === 'picker'
                ? 'bg-horizon-orange text-white shadow-glow-orange font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            Visual Picker
          </button>

          <button
            onClick={() => setActiveTab('diff')}
            className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-2 ${
              activeTab === 'diff'
                ? 'bg-horizon-orange text-white shadow-glow-orange font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <GitCompare className="w-3.5 h-3.5" />
            Diff Studio
          </button>

          <button
            onClick={() => setActiveTab('number')}
            className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-2 ${
              activeTab === 'number'
                ? 'bg-horizon-orange text-white shadow-glow-orange font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <LineChart className="w-3.5 h-3.5" />
            Number Tracker
          </button>

          <button
            onClick={() => setActiveTab('architecture')}
            className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-2 ${
              activeTab === 'architecture'
                ? 'bg-horizon-orange text-white shadow-glow-orange font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Architecture Q&A
          </button>

          <button
            onClick={() => setActiveTab('alerts')}
            className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-2 ${
              activeTab === 'alerts'
                ? 'bg-horizon-orange text-white shadow-glow-orange font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            Alerts & RSS
          </button>
        </nav>

        {/* Right action & system telemetry */}
        <div className="flex items-center gap-3">
          {/* Live Scheduler telemetry pill */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-horizon-900/80 border border-emerald-500/30 text-[11px] font-mono text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>QUEUE: <strong className="text-white">{queueMetrics?.queueLength || 0}</strong></span>
            <span className="text-slate-500">|</span>
            <span>WORKERS: <strong className="text-emerald-400">{queueMetrics?.activeWorkers || 0}/2</strong></span>
          </div>

          {/* Language dropdown as in template */}
          <div className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 text-xs text-slate-300 rounded-lg hover:bg-white/5 cursor-pointer border border-transparent hover:border-white/10">
            <span>EN</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </div>

          {/* Primary Action Button matching HorizonX minimalist styling */}
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-horizon-orange hover:bg-horizon-orangeHover text-white text-xs font-bold tracking-wide uppercase shadow-glow-orange hover:shadow-glow-orange-lg active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Monitor URL</span>
          </button>
        </div>

      </div>
    </header>
  );
}
