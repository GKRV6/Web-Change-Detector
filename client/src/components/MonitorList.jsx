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
          className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-amber-50 border border-amber-200 text-amber-800"
        >
          <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
          <span>BLOCKED (ANTI-BOT)</span>
        </span>
      );
    } else if (status === 'ERROR') {
      return (
        <span 
          title={reason || 'Outage or fetch error'}
          className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-rose-50 border border-rose-200 text-rose-800"
        >
          <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
          <span>ERROR (OUTAGE)</span>
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-emerald-50 border border-emerald-200 text-emerald-800">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
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
          <Search className="w-4 h-4 text-[#1B133C]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search targets or URLs..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/80 border border-[#1B133C]/15 text-[#1B133C] placeholder-[#1B133C]/40 text-xs focus:outline-none focus:border-[#1B133C] shadow-sm"
          />
        </div>

        {/* Status filters */}
        <div className="flex items-center gap-2 self-start sm:self-auto overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {['ALL', 'OK', 'BLOCKED', 'ERROR'].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                statusFilter === status
                  ? 'bg-[#1B133C] text-white font-bold shadow-sm'
                  : 'bg-white/80 text-[#1B133C]/70 hover:text-[#1B133C] border border-[#1B133C]/10 shadow-sm'
              }`}
            >
              {status}
            </button>
          ))}

          <button
            onClick={onRefresh}
            title="Refresh monitor list"
            className="p-2 rounded-lg bg-white/80 border border-[#1B133C]/10 text-[#1B133C]/70 hover:text-[#1B133C] hover:border-[#1B133C]/30 transition-all cursor-pointer shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Monitor Cards List */}
      {filteredMonitors.length === 0 ? (
        <div className="bg-white/75 backdrop-blur-md rounded-3xl p-12 text-center border border-[#1B133C]/10 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-[#1B133C]/5 border border-[#1B133C]/10 flex items-center justify-center mx-auto mb-4 text-[#1B133C]">
            <SlidersHorizontal className="w-6 h-6" />
          </div>
          <h3 className="font-['Instrument_Serif'] text-2xl text-[#1B133C] mb-2">No Monitored Targets Found</h3>
          <p className="text-xs text-[#1B133C]/60 max-w-sm mx-auto mb-6">
            Add a public URL with custom check intervals to begin autonomous headless change tracking.
          </p>
          <button
            onClick={onOpenAddModal}
            className="px-6 py-2.5 rounded-xl bg-[#1B133C] text-white text-xs font-bold uppercase tracking-wider shadow-sm hover:bg-[#1B133C]/90 transition-all cursor-pointer"
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
                className="bg-white/80 backdrop-blur-md hover:border-[#1B133C]/20 transition-all rounded-3xl p-5 sm:p-6 text-left relative overflow-hidden group border border-[#1B133C]/10 shadow-sm hover:shadow-md"
              >
                
                {/* Accent line */}
                <div className={`absolute top-0 left-0 right-0 h-[2px] ${
                  monitor.status === 'OK' ? 'bg-gradient-to-r from-emerald-500/0 via-emerald-400 to-emerald-500/0' :
                  monitor.status === 'BLOCKED' ? 'bg-gradient-to-r from-amber-500/0 via-amber-400 to-amber-500/0' :
                  'bg-gradient-to-r from-rose-500/0 via-rose-400 to-rose-500/0'
                }`} />

                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                  
                  {/* Left Info */}
                  <div className="space-y-2 max-w-2xl">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h3 className="text-base font-bold text-[#1B133C] flex items-center gap-2">
                        {monitor.name}
                      </h3>
                      {getStatusBadge(monitor.status, monitor.statusReason)}
                      
                      {!monitor.active && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-slate-100 text-slate-600 border border-slate-200">
                          PAUSED
                        </span>
                      )}

                      {monitor.tags && monitor.tags.map(t => (
                        <span key={t} className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-[#1B133C]/5 text-[#1B133C]/70 border border-[#1B133C]/10">
                          #{t}
                        </span>
                      ))}
                    </div>

                    {/* URL */}
                    <div className="flex items-center gap-2 text-xs font-mono text-[#1B133C]/60">
                      <a 
                        href={monitor.url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="hover:text-purple-600 flex items-center gap-1.5 truncate max-w-md transition-colors"
                      >
                        <span>{monitor.url}</span>
                        <ExternalLink className="w-3 h-3 flex-shrink-0" />
                      </a>
                    </div>

                    {/* AI Change Summary Banner */}
                    {latestSnap && latestSnap.aiSummary && (
                      <div className="flex items-start gap-2.5 p-3 rounded-xl bg-purple-50 border border-purple-200/60 text-xs text-[#1B133C]">
                        <Sparkles className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold text-purple-900 mr-1.5">AI Change Summary:</span>
                          <span className="text-[#1B133C]/80">{latestSnap.aiSummary}</span>
                        </div>
                      </div>
                    )}

                    {/* Meta stats */}
                    <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono text-[#1B133C]/50 pt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>Interval: {monitor.intervalMinutes}m</span>
                      </span>
                      <span>•</span>
                      <span>Checked: {formatRelativeTime(monitor.lastChecked)}</span>
                      <span>•</span>
                      <span>Snapshots: {monitor.snapshotsCount || 0}</span>
                      {monitor.latestSnapshot?.changePercentage !== undefined && (
                        <>
                          <span>•</span>
                          <span className="font-semibold text-[#1B133C]">
                            Change: {monitor.latestSnapshot.changePercentage}%
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Right Actions Toolbar */}
                  <div className="flex flex-wrap items-center gap-2 self-stretch lg:self-center justify-end border-t lg:border-t-0 pt-3 lg:pt-0 border-[#1B133C]/10">
                    
                    {/* Check Now button */}
                    <button
                      onClick={() => handleCheckNow(monitor.id)}
                      disabled={isChecking}
                      className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-[#1B133C] text-[#1B133C] hover:text-white border border-[#1B133C]/15 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer disabled:opacity-50"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isChecking ? 'animate-spin text-orange-500' : ''}`} />
                      <span>{isChecking ? 'Checking...' : 'Check Now'}</span>
                    </button>

                    {/* Diff Studio button */}
                    <button
                      onClick={() => onSelectDiff(monitor.id)}
                      className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#1B133C] text-[#1B133C] hover:text-white border border-[#1B133C]/15 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                    >
                      <GitCompare className="w-3.5 h-3.5" />
                      <span>Diff</span>
                    </button>

                    {/* Visual Picker */}
                    <button
                      onClick={() => onSelectPicker(monitor.url)}
                      className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#1B133C] text-[#1B133C] hover:text-white border border-[#1B133C]/15 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Picker</span>
                    </button>

                    {/* RSS feed link */}
                    <a
                      href={`/api/monitors/${monitor.id}/rss.xml`}
                      target="_blank"
                      rel="noreferrer"
                      title="Open RSS 2.0 XML Feed"
                      className="p-2 rounded-xl bg-white hover:bg-orange-500 text-[#1B133C] hover:text-white border border-[#1B133C]/15 text-xs transition-all shadow-sm flex items-center"
                    >
                      <Rss className="w-3.5 h-3.5" />
                    </a>

                    {/* Pause/Resume Toggle */}
                    <button
                      onClick={() => handleToggle(monitor.id)}
                      title={monitor.active ? 'Pause monitor' : 'Resume monitor'}
                      className="p-2 rounded-xl bg-white hover:bg-[#1B133C] text-[#1B133C] hover:text-white border border-[#1B133C]/15 text-xs transition-all shadow-sm cursor-pointer flex items-center"
                    >
                      {monitor.active ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-emerald-600" />}
                    </button>

                    {/* Delete button */}
                    <button
                      onClick={() => handleDelete(monitor.id, monitor.name)}
                      title="Delete monitor"
                      className="p-2 rounded-xl bg-white hover:bg-rose-600 text-[#1B133C]/70 hover:text-white border border-[#1B133C]/15 text-xs transition-all shadow-sm cursor-pointer flex items-center"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

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
