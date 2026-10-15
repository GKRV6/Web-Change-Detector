import React from 'react';
import { Plus, Eye, GitCompare, LineChart, ShieldCheck, Bell } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, onOpenAddModal, queueMetrics }) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#1B133C]/10 bg-white/80 backdrop-blur-md transition-all shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        
        {/* Logo & Change Intelligence */}
        <div 
          onClick={() => setActiveTab('dashboard')}
          className="flex items-center gap-3 cursor-pointer group shrink-0"
        >
          {/* Custom SVG logo (two geometric arrow/chevron shapes in #1B133C, 24x24px) */}
          <div className="w-10 h-10 rounded-xl bg-[#1B133C]/5 border border-[#1B133C]/10 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
            <svg
              width="22"
              height="22"
              viewBox="0 0 256 256"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M 256 256 L 128 256 L 0 128 L 128 128 Z" fill="#1B133C" />
              <path d="M 256 128 L 128 128 L 0 0 L 128 0 Z" fill="#1B133C" />
            </svg>
          </div>
          <div className="flex flex-col">
            <div className="text-xl font-bold tracking-tight text-[#1B133C] flex items-center gap-1.5">
              <span>Horizon</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-[#1B133C]/5 text-[#1B133C]/80 border border-[#1B133C]/10">
                Change Intelligence
              </span>
            </div>
            <span className="text-[10px] tracking-wider text-[#1B133C]/50 uppercase font-mono">
              Autonomous Web Monitor
            </span>
          </div>
        </div>

        {/* Center Nav tabs — in frosted pill */}
        <nav className="hidden md:flex items-center gap-1 bg-white/70 p-1.5 rounded-2xl border border-[#1B133C]/10 shadow-sm backdrop-blur-md">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'dashboard'
                ? 'bg-[#1B133C] text-white font-semibold shadow-sm'
                : 'text-[#1B133C]/70 hover:text-[#1B133C] hover:bg-black/5'
            }`}
          >
            Dashboard
          </button>

          <button
            onClick={() => setActiveTab('picker')}
            className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'picker'
                ? 'bg-[#1B133C] text-white font-semibold shadow-sm'
                : 'text-[#1B133C]/70 hover:text-[#1B133C] hover:bg-black/5'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            Visual Picker
          </button>

          <button
            onClick={() => setActiveTab('diff')}
            className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'diff'
                ? 'bg-[#1B133C] text-white font-semibold shadow-sm'
                : 'text-[#1B133C]/70 hover:text-[#1B133C] hover:bg-black/5'
            }`}
          >
            <GitCompare className="w-3.5 h-3.5" />
            Diff Studio
          </button>

          <button
            onClick={() => setActiveTab('number')}
            className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'number'
                ? 'bg-[#1B133C] text-white font-semibold shadow-sm'
                : 'text-[#1B133C]/70 hover:text-[#1B133C] hover:bg-black/5'
            }`}
          >
            <LineChart className="w-3.5 h-3.5" />
            Number Tracker
          </button>

          <button
            onClick={() => setActiveTab('architecture')}
            className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'architecture'
                ? 'bg-[#1B133C] text-white font-semibold shadow-sm'
                : 'text-[#1B133C]/70 hover:text-[#1B133C] hover:bg-black/5'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Architecture Q&A
          </button>

          <button
            onClick={() => setActiveTab('alerts')}
            className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'alerts'
                ? 'bg-[#1B133C] text-white font-semibold shadow-sm'
                : 'text-[#1B133C]/70 hover:text-[#1B133C] hover:bg-black/5'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            Alerts & RSS
          </button>
        </nav>

        {/* Right action & system telemetry */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Live Scheduler telemetry pill */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 border border-[#1B133C]/10 text-[11px] font-mono text-[#1B133C] shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>QUEUE: <strong className="text-[#1B133C]">{queueMetrics?.queueLength || 0}</strong></span>
            <span className="text-[#1B133C]/20">|</span>
            <span>WORKERS: <strong className="text-emerald-600">{queueMetrics?.activeWorkers || 0}/2</strong></span>
          </div>

          {/* Primary Action Button */}
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold tracking-wide shadow-sm hover:shadow active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Monitor URL</span>
          </button>
        </div>

      </div>
    </header>
  );
}
