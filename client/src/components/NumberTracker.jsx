import React, { useState, useEffect } from 'react';
import { LineChart, DollarSign, ArrowUpRight, ArrowDownRight } from 'lucide-react';
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
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-600 mb-1">
            <LineChart className="w-4 h-4" />
            <span>NUMERIC TELEMETRY & HISTORICAL TRENDS</span>
          </div>
          <h2 className="font-['Instrument_Serif'] text-3xl sm:text-4xl font-normal text-[#1B133C]">
            Number & Price Fluctuation Tracker
          </h2>
          <p className="text-xs sm:text-sm text-[#1B133C]/60">
            Automatically extracts prices, follower counts, and numerical values into time-series visual trend charts.
          </p>
        </div>

        {/* Monitor Selector */}
        <div className="w-full md:w-72">
          <select
            value={selectedMonitorId}
            onChange={e => setSelectedMonitorId(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-white border border-[#1B133C]/15 text-[#1B133C] text-xs font-mono focus:outline-none focus:border-[#1B133C] shadow-sm cursor-pointer"
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
        
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-5 border border-[#1B133C]/10 shadow-sm hover:shadow-md transition-all">
          <div className="text-[10px] font-mono text-[#1B133C]/60 mb-1">CURRENT VALUE</div>
          <div className="font-['Instrument_Serif'] text-3xl text-[#1B133C] flex items-center gap-1">
            <DollarSign className="w-5 h-5 text-emerald-600" />
            <span>{currentVal.toLocaleString()}</span>
          </div>
          <div className="text-[11px] text-emerald-700 font-mono mt-1 font-medium">Latest snapshot</div>
        </div>

        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-5 border border-[#1B133C]/10 shadow-sm hover:shadow-md transition-all">
          <div className="text-[10px] font-mono text-[#1B133C]/60 mb-1">ALL-TIME LOW</div>
          <div className="font-['Instrument_Serif'] text-3xl text-[#1B133C] flex items-center gap-1">
            <DollarSign className="w-5 h-5 text-orange-500" />
            <span>{minVal.toLocaleString()}</span>
          </div>
          <div className="text-[11px] text-[#1B133C]/50 font-mono mt-1">Best recorded value</div>
        </div>

        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-5 border border-[#1B133C]/10 shadow-sm hover:shadow-md transition-all">
          <div className="text-[10px] font-mono text-[#1B133C]/60 mb-1">ALL-TIME HIGH</div>
          <div className="font-['Instrument_Serif'] text-3xl text-[#1B133C] flex items-center gap-1">
            <DollarSign className="w-5 h-5 text-purple-600" />
            <span>{maxVal.toLocaleString()}</span>
          </div>
          <div className="text-[11px] text-[#1B133C]/50 font-mono mt-1">Peak recorded value</div>
        </div>

        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-5 border border-[#1B133C]/10 shadow-sm hover:shadow-md transition-all">
          <div className="text-[10px] font-mono text-[#1B133C]/60 mb-1">NET CHANGE</div>
          <div className="font-['Instrument_Serif'] text-3xl text-[#1B133C] flex items-center gap-1">
            {netDiff <= 0 ? (
              <span className="text-emerald-700 flex items-center">
                <ArrowDownRight className="w-5 h-5" />
                {netDiffPct}%
              </span>
            ) : (
              <span className="text-rose-700 flex items-center">
                <ArrowUpRight className="w-5 h-5" />
                +{netDiffPct}%
              </span>
            )}
          </div>
          <div className="text-[11px] text-[#1B133C]/50 font-mono mt-1">Since baseline v1</div>
        </div>

      </div>

      {/* Chart Canvas */}
      <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-[#1B133C]/10 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-bold text-[#1B133C] flex items-center gap-2">
            <LineChart className="w-4 h-4 text-orange-500" />
            <span>{currentMonitor?.name} — Numerical Fluctuation Curve</span>
          </h3>
          <span className="text-xs font-mono text-[#1B133C]/50">
            {chartData.length} Data Points Collected
          </span>
        </div>

        {chartData.length === 0 ? (
          <div className="text-center py-16 text-[#1B133C]/50 text-xs font-mono">
            No numeric values recorded for this monitor yet.
            <br />
            Configure a numeric CSS selector (e.g. <code className="text-orange-600">.price</code>) in monitor settings.
          </div>
        ) : (
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="axonGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#7C3AED" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(27,19,60,0.06)" vertical={false} />
                <XAxis 
                  dataKey="version" 
                  stroke="#1B133C" 
                  opacity={0.6}
                  fontSize={11} 
                  tickLine={false} 
                  fontFamily="monospace"
                />
                <YAxis 
                  stroke="#1B133C" 
                  opacity={0.6}
                  fontSize={11} 
                  tickLine={false} 
                  fontFamily="monospace"
                  domain={['dataMin - 100', 'dataMax + 100']}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#FFFFFF', 
                    borderColor: 'rgba(27, 19, 60, 0.15)', 
                    borderRadius: '16px',
                    fontSize: '12px',
                    fontFamily: 'monospace',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.08)'
                  }}
                  itemStyle={{ color: '#7C3AED' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#7C3AED" 
                  strokeWidth={2.5} 
                  fillOpacity={1} 
                  fill="url(#axonGlow)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

    </div>
  );
}
