import React, { useState } from 'react';
import { 
  Play, Pause, RefreshCw, GitCompare, Eye, Rss, Trash2, 
  ExternalLink, ShieldAlert, CheckCircle2, AlertTriangle, Clock, 
  Search, SlidersHorizontal, Sparkles, Hash
} from 'lucide-react';
import { triggerCheck, toggleMonitor, deleteMonitor } from '../api';

export default function MonitorList({ 
  monitors, 
  onRefresh, 
  onSelectDiff, 
  onSelectPicker,
  onOpenAddModal
}) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [checkingIds, setCheckingIds] = useState(new Set());

  const handleCheckNow = async (id) => {
    setCheckingIds(prev => new Set(prev).add(id));
    try {
      await triggerCheck(id);
      // Wait a moment then refresh
      setTimeout(() => {
        onRefresh();
        setCheckingIds(prev => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      }, 2000);
    } catch (e) {
      setCheckingIds(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const handleToggle = async (id) => {
    await toggleMonitor(id);
    onRefresh();
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete monitor: "${name}"?`)) {
      await deleteMonitor(id);
      onRefresh();
    }
  };

  const filteredMonitors = monitors.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase()) || 
                          m.url.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || m.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status, reason) => {
    if (status === 'BLOCKED') {
      return (
        <span 
          title={reason || 'Anti-bot / CAPTCHA challenge wall detected'}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-medium bg-amber-500/10 border border-amber-500/30 text-amber-400"
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>BLOCKED (ANTI-BOT)</span>
        </span>
      );
    } else if (status === 'ERROR') {
      return (
        <span 
          title={reason || 'Outage or fetch error'}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-medium bg-rose-500/10 border border-rose-500/30 text-rose-400"
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>ERROR (OUTAGE)</span>
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-medium bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>OPERATIONAL</span>
        </span>
      );
    }
  };

  const formatRelativeTime = (isoString) => {
    if (!isoString) return 'Never';
    const diffMs = Date.now() - new Date(isoString).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${Math.floor(diffHours / 24)}d ago`;
  };

  return (
    <div className="space-y-6">
      
      {/* Top Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search targets or URLs..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-horizon-900 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-horizon-orange"
          />
        </div>

        {/* Status filters */}
        <div className="flex items-center gap-2 self-start sm:self-auto overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {['ALL', 'OK', 'BLOCKED', 'ERROR'].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                statusFilter === status
                  ? 'bg-horizon-orange text-white font-bold shadow-glow-orange'
                  : 'bg-horizon-900 text-slate-400 hover:text-white border border-white/5'
              }`}
            >
              {status}
            </button>
          ))}

          <button
            onClick={onRefresh}
            title="Refresh monitor list"
            className="p-2 rounded-lg bg-horizon-900 border border-white/10 text-slate-400 hover:text-white hover:border-horizon-orange transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Monitor Cards List */}
      {filteredMonitors.length === 0 ? (
        <div className="horizon-card rounded-3xl p-12 text-center">
          <div className="w-12 h-12 rounded-2xl bg-horizon-800 border border-white/10 flex items-center justify-center mx-auto mb-4 text-slate-400">
            <SlidersHorizontal className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">No Monitored Targets Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mb-6">
            Add a public URL with custom check intervals to begin autonomous headless change tracking.
          </p>
          <button
            onClick={onOpenAddModal}
            className="px-6 py-2.5 rounded-xl bg-horizon-orange text-white text-xs font-bold uppercase tracking-wider shadow-glow-orange hover:bg-horizon-orangeHover transition-all"
          >
            + Add Target
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredMonitors.map(monitor => {
            const isChecking = checkingIds.has(monitor.id);
            const latestSnap = monitor.latestSnapshot;

            return (
              <div 
                key={monitor.id}
                className="horizon-card hover:border-white/20 transition-all rounded-3xl p-5 sm:p-6 text-left relative overflow-hidden group"
              >
                
                {/* Accent glow line */}
                <div className={`absolute top-0 left-0 right-0 h-[2px] ${
                  monitor.status === 'OK' ? 'bg-gradient-to-r from-emerald-500/0 via-emerald-400 to-emerald-500/0' :
                  monitor.status === 'BLOCKED' ? 'bg-gradient-to-r from-amber-500/0 via-amber-400 to-amber-500/0' :
                  'bg-gradient-to-r from-rose-500/0 via-rose-400 to-rose-500/0'
                }`} />

                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                  
                  {/* Left Info */}
                  <div className="space-y-2 max-w-2xl">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h3 className="text-base font-bold text-white flex items-center gap-2 group-hover:text-horizon-orange transition-colors">
                        {monitor.name}
                      </h3>
                      {getStatusBadge(monitor.status, monitor.statusReason)}
                      
                      {!monitor.active && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-slate-800 text-slate-400 border border-slate-700">
                          PAUSED
                        </span>
                      )}

                      {monitor.tags && monitor.tags.map(t => (
                        <span key={t} className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-white/5 text-slate-300 border border-white/10">
                          #{t}
                        </span>
                      ))}
                    </div>

                    {/* URL */}
                    <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                      <a 
                        href={monitor.url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="hover:text-horizon-cyan flex items-center gap-1.5 truncate max-w-md"
                      >
                        <span>{monitor.url}</span>
                        <ExternalLink className="w-3 h-3 flex-shrink-0" />
                      </a>
                    </div>

                    {/* AI Change Summary Banner */}
                    {latestSnap && latestSnap.aiSummary && (
                      <div className="p-2.5 rounded-xl bg-horizon-950/70 border border-white/5 flex items-start gap-2 text-xs text-slate-300">
                        <Sparkles className="w-3.5 h-3.5 text-horizon-orange flex-shrink-0 mt-0.5" />
                        <span className="leading-relaxed">
                          <strong className="text-white font-medium">Latest AI Insight:</strong> {latestSnap.aiSummary}
                        </span>
                      </div>
                    )}

                    {/* Status details or error notice */}
                    {monitor.statusReason && monitor.status !== 'OK' && (
                      <div className="text-xs font-mono text-amber-300/90 bg-amber-500/10 p-2 rounded-lg border border-amber-500/20">
                        ⚠️ {monitor.statusReason}
                      </div>
                    )}
                  </div>

                  {/* Right Telemetry & Actions */}
                  <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-start sm:items-center gap-4 w-full lg:w-auto justify-between lg:justify-end border-t lg:border-t-0 pt-4 lg:pt-0 border-white/10">
                    
                    {/* Telemetry pill */}
                    <div className="grid grid-cols-3 gap-3 text-center bg-horizon-950/80 p-2.5 rounded-2xl border border-white/5 text-xs font-mono">
                      <div>
                        <div className="text-[10px] text-slate-400">INTERVAL</div>
                        <div className="text-slate-200 font-semibold">{monitor.intervalMinutes}m</div>
                      </div>
                      <div className="border-x border-white/10 px-2">
                        <div className="text-[10px] text-slate-400">LAST CHECK</div>
                        <div className="text-slate-200 font-semibold">{formatRelativeTime(monitor.lastChecked)}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400">VERSIONS</div>
                        <div className="text-horizon-orange font-bold">{monitor.snapshotCount || 1}</div>
                      </div>
                    </div>

                    {/* Action buttons bar */}
                    <div className="flex items-center gap-1.5">
                      
                      {/* Check Now button */}
                      <button
                        onClick={() => handleCheckNow(monitor.id)}
                        disabled={isChecking}
                        title="Run check immediately"
                        className="p-2.5 rounded-xl bg-horizon-800 hover:bg-horizon-700 text-slate-300 hover:text-white border border-white/10 transition-all flex items-center gap-1 text-xs font-semibold"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${isChecking ? 'animate-spin text-horizon-orange' : ''}`} />
                        <span className="hidden sm:inline">Check</span>
                      </button>

                      {/* Diff Studio button */}
                      <button
                        onClick={() => onSelectDiff(monitor.id)}
                        title="Open Diff Studio for this target"
                        className="p-2.5 rounded-xl bg-horizon-orange/20 hover:bg-horizon-orange text-horizon-orange hover:text-white border border-horizon-orange/30 transition-all flex items-center gap-1 text-xs font-semibold"
                      >
                        <GitCompare className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Diff</span>
                      </button>

                      {/* Visual Picker inspector button */}
                      <button
                        onClick={() => onSelectPicker(monitor.url)}
                        title="Inspect elements in Visual Picker"
                        className="p-2.5 rounded-xl bg-horizon-800 hover:bg-horizon-700 text-slate-300 hover:text-white border border-white/10 transition-all"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      {/* RSS Feed direct link */}
                      <a
                        href={`/api/monitors/${monitor.id}/rss.xml`}
                        target="_blank"
                        rel="noreferrer"
                        title="Open per-page RSS 2.0 Feed"
                        className="p-2.5 rounded-xl bg-horizon-800 hover:bg-horizon-700 text-amber-400 border border-white/10 transition-all"
                      >
                        <Rss className="w-3.5 h-3.5" />
                      </a>

                      {/* Toggle Pause/Resume */}
                      <button
                        onClick={() => handleToggle(monitor.id)}
                        title={monitor.active ? "Pause monitoring" : "Resume monitoring"}
                        className="p-2.5 rounded-xl bg-horizon-800 hover:bg-horizon-700 text-slate-300 hover:text-white border border-white/10 transition-all"
                      >
                        {monitor.active ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => handleDelete(monitor.id, monitor.name)}
                        title="Delete monitor"
                        className="p-2.5 rounded-xl bg-horizon-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-white/10 transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                    </div>

                  </div>

                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
