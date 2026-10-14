import React, { useState, useEffect } from 'react';
import { LineChart, TrendingDown, TrendingUp, DollarSign, ArrowUpRight, ArrowDownRight, Hash, Sparkles } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { fetchSnapshots } from '../api';

export default function NumberTracker({ monitors }) {
  const numericMonitors = monitors.filter(m => m.numberSelector || m.id === 'mon-4');
  const [selectedMonitorId, setSelectedMonitorId] = useState(numericMonitors[0]?.id || monitors[0]?.id || '');
  const [snapshots, setSnapshots] = useState([]);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (selectedMonitorId) {
      loadSnapshots(selectedMonitorId);
    }
  }, [selectedMonitorId]);

  const loadSnapshots = async (mId) => {
    try {
      const res = await fetchSnapshots(mId);
      if (res.success && res.snapshots) {
        setSnapshots(res.snapshots);
        // Build chart points sorted chronologically
        const points = res.snapshots
          .filter(s => s.extractedNumber !== null && s.extractedNumber !== undefined)
          .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
          .map(s => ({
            version: `v${s.version}`,
            time: new Date(s.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            date: new Date(s.timestamp).toLocaleDateString(),
            value: s.extractedNumber,
            summary: s.aiSummary
          }));
        setChartData(points);
      }
    } catch (e) {
      console.error('Error fetching numeric history:', e);
    }
  };

  const currentMonitor = monitors.find(m => m.id === selectedMonitorId);

  // Compute stats
  const values = chartData.map(d => d.value);
  const currentVal = values.length > 0 ? values[values.length - 1] : 0;
  const initialVal = values.length > 0 ? values[0] : 0;
  const minVal = values.length > 0 ? Math.min(...values) : 0;
  const maxVal = values.length > 0 ? Math.max(...values) : 0;
  const netDiff = currentVal - initialVal;
  const netDiffPct = initialVal ? Math.round((netDiff / initialVal) * 1000) / 10 : 0;

  return (
    <div className="space-y-6 text-left">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
            <LineChart className="w-4 h-4" />
            <span>NUMERIC TELEMETRY & HISTORICAL TRENDS</span>
          </div>
          <h2 className="text-2xl font-bold text-white">Number & Price Fluctuation Tracker</h2>
          <p className="text-xs text-slate-400">
            Automatically extracts prices, follower counts, and numerical values into time-series visual trend charts.
          </p>
        </div>

        {/* Monitor Selector */}
        <div className="w-full md:w-72">
          <select
            value={selectedMonitorId}
            onChange={e => setSelectedMonitorId(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-horizon-900 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-horizon-orange"
          >
            {monitors.map(m => (
              <option key={m.id} value={m.id}>
                {m.name} {m.numberSelector ? '(Numeric)' : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        <div className="horizon-card rounded-2xl p-4 border-l-2 border-l-emerald-400">
          <div className="text-[10px] font-mono text-slate-400 mb-1">CURRENT VALUE</div>
          <div className="text-2xl font-black text-white flex items-center gap-1">
            <DollarSign className="w-5 h-5 text-emerald-400" />
            <span>{currentVal.toLocaleString()}</span>
          </div>
          <div className="text-[11px] text-emerald-400 font-mono mt-1">Latest snapshot</div>
        </div>

        <div className="horizon-card rounded-2xl p-4 border-l-2 border-l-horizon-orange">
          <div className="text-[10px] font-mono text-slate-400 mb-1">ALL-TIME LOW</div>
          <div className="text-2xl font-black text-white flex items-center gap-1">
            <DollarSign className="w-5 h-5 text-horizon-orange" />
            <span>{minVal.toLocaleString()}</span>
          </div>
          <div className="text-[11px] text-slate-400 font-mono mt-1">Best recorded value</div>
        </div>

        <div className="horizon-card rounded-2xl p-4 border-l-2 border-l-rose-400">
          <div className="text-[10px] font-mono text-slate-400 mb-1">ALL-TIME HIGH</div>
          <div className="text-2xl font-black text-white flex items-center gap-1">
            <DollarSign className="w-5 h-5 text-rose-400" />
            <span>{maxVal.toLocaleString()}</span>
          </div>
          <div className="text-[11px] text-slate-400 font-mono mt-1">Peak recorded value</div>
        </div>

        <div className="horizon-card rounded-2xl p-4 border-l-2 border-l-horizon-cyan">
          <div className="text-[10px] font-mono text-slate-400 mb-1">NET CHANGE</div>
          <div className="text-2xl font-black text-white flex items-center gap-1">
            {netDiff <= 0 ? (
              <span className="text-emerald-400 flex items-center">
                <ArrowDownRight className="w-5 h-5" />
                {netDiffPct}%
              </span>
            ) : (
              <span className="text-rose-400 flex items-center">
                <ArrowUpRight className="w-5 h-5" />
                +{netDiffPct}%
              </span>
            )}
          </div>
          <div className="text-[11px] text-slate-400 font-mono mt-1">Since baseline v1</div>
        </div>

      </div>

      {/* Chart Canvas */}
      <div className="horizon-card rounded-3xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <LineChart className="w-4 h-4 text-horizon-orange" />
            <span>{currentMonitor?.name} — Numerical Fluctuation Curve</span>
          </h3>
          <span className="text-xs font-mono text-slate-400">
            {chartData.length} Data Points Collected
          </span>
        </div>

        {chartData.length === 0 ? (
          <div className="text-center py-16 text-slate-400 text-xs font-mono">
            No numeric values recorded for this monitor yet.
            <br />
            Configure a numeric CSS selector (e.g. <code className="text-horizon-orange">.price</code>) in monitor settings.
          </div>
        ) : (
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="horizonGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF7A29" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#FF7A29" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                <XAxis 
                  dataKey="version" 
                  stroke="#64748B" 
                  fontSize={11} 
                  tickLine={false} 
                  fontFamily="monospace"
                />
                <YAxis 
                  stroke="#64748B" 
                  fontSize={11} 
                  tickLine={false} 
                  fontFamily="monospace"
                  domain={['dataMin - 100', 'dataMax + 100']}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#080C16', 
                    borderColor: 'rgba(255, 122, 41, 0.3)', 
                    borderRadius: '16px',
                    fontSize: '12px',
                    fontFamily: 'monospace'
                  }}
                  itemStyle={{ color: '#FF7A29' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#FF7A29" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#horizonGlow)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

    </div>
  );
}
