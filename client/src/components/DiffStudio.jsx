import React, { useState, useEffect } from 'react';
import { GitCompare, Sliders, Image, FileText, Sparkles, Hash } from 'lucide-react';
import { fetchDiff, fetchSnapshots } from '../api';

export default function DiffStudio({ monitors, selectedMonitorId, onSelectMonitor }) {
  const [monitorId, setMonitorId] = useState(selectedMonitorId || (monitors[0]?.id || ''));
  const [snapshots, setSnapshots] = useState([]);
  const [v1, setV1] = useState('');
  const [v2, setV2] = useState('');
  const [diffData, setDiffData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState('slider'); // 'slider', 'pixel', 'text-unified', 'text-split'
  const [sliderPos, setSliderPos] = useState(50); // 0 to 100%

  // Sync monitorId if prop changed
  useEffect(() => {
    if (selectedMonitorId) {
      setMonitorId(selectedMonitorId);
    }
  }, [selectedMonitorId]);

  // Load snapshots when monitor changes
  useEffect(() => {
    if (!monitorId) return;
    loadSnapshots(monitorId);
  }, [monitorId]);

  const loadSnapshots = async (mId) => {
    try {
      const res = await fetchSnapshots(mId);
      if (res.success && res.snapshots) {
        setSnapshots(res.snapshots);
        if (res.snapshots.length >= 2) {
          setV1(res.snapshots[res.snapshots.length - 1].id); // oldest
          setV2(res.snapshots[0].id); // newest
        } else if (res.snapshots.length === 1) {
          setV1(res.snapshots[0].id);
          setV2(res.snapshots[0].id);
        }
      }
    } catch (e) {
      console.error('Error fetching snapshots:', e);
    }
  };

  // Run diff calculation
  useEffect(() => {
    if (!monitorId || !v1 || !v2) return;
    runDiff(monitorId, v1, v2);
  }, [monitorId, v1, v2]);

  const runDiff = async (mId, id1, id2) => {
    setLoading(true);
    try {
      const res = await fetchDiff(mId, id1, id2);
      if (res.success) {
        setDiffData(res);
      }
    } catch (e) {
      console.error('Error running diff:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 text-left">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-purple-600 mb-1">
            <GitCompare className="w-4 h-4" />
            <span>VERSION ARTIFACT & DIFF STUDIO</span>
          </div>
          <h2 className="font-['Instrument_Serif'] text-3xl sm:text-4xl font-normal text-[#1B133C]">
            Visual, Pixel & Word-Level Text Diff
          </h2>
          <p className="text-xs sm:text-sm text-[#1B133C]/60">
            Compare any two historical snapshots with interactive swipe slider, pixelmatch heatmap, or line-by-line diff.
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1 bg-white/80 p-1.5 rounded-2xl border border-[#1B133C]/10 shadow-sm">
          <button
            onClick={() => setViewMode('slider')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'slider' ? 'bg-[#1B133C] text-white font-bold shadow-sm' : 'text-[#1B133C]/70 hover:text-[#1B133C]'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Swipe Slider</span>
          </button>

          <button
            onClick={() => setViewMode('pixel')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'pixel' ? 'bg-[#1B133C] text-white font-bold shadow-sm' : 'text-[#1B133C]/70 hover:text-[#1B133C]'
            }`}
          >
            <Image className="w-3.5 h-3.5" />
            <span>Pixel Highlight</span>
          </button>

          <button
            onClick={() => setViewMode('text-unified')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'text-unified' ? 'bg-[#1B133C] text-white font-bold shadow-sm' : 'text-[#1B133C]/70 hover:text-[#1B133C]'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Unified Diff</span>
          </button>

          <button
            onClick={() => setViewMode('text-split')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'text-split' ? 'bg-[#1B133C] text-white font-bold shadow-sm' : 'text-[#1B133C]/70 hover:text-[#1B133C]'
            }`}
          >
            <GitCompare className="w-3.5 h-3.5" />
            <span>Side-by-Side</span>
          </button>
        </div>
      </div>

      {/* Target & Version Selectors Bar */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 grid grid-cols-1 md:grid-cols-3 gap-4 border border-[#1B133C]/10 shadow-sm">
        
        {/* Monitor dropdown */}
        <div>
          <label className="block text-[11px] font-mono text-[#1B133C]/60 mb-1">TARGET MONITOR</label>
          <select
            value={monitorId}
            onChange={e => {
              setMonitorId(e.target.value);
              if (onSelectMonitor) onSelectMonitor(e.target.value);
            }}
            className="w-full px-3 py-2 rounded-xl bg-white border border-[#1B133C]/15 text-[#1B133C] text-xs focus:outline-none focus:border-[#1B133C] font-mono shadow-sm cursor-pointer"
          >
            {monitors.map(m => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
        </div>

        {/* Old Version v1 */}
        <div>
          <label className="block text-[11px] font-mono text-[#1B133C]/60 mb-1">BASELINE VERSION (OLD)</label>
          <select
            value={v1}
            onChange={e => setV1(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-white border border-[#1B133C]/15 text-[#1B133C] text-xs focus:outline-none focus:border-[#1B133C] font-mono shadow-sm cursor-pointer"
          >
            {snapshots.map(s => (
              <option key={s.id} value={s.id}>
                v{s.version} ({new Date(s.timestamp).toLocaleTimeString()}) - {s.changePercent}% diff
              </option>
            ))}
          </select>
        </div>

        {/* New Version v2 */}
        <div>
          <label className="block text-[11px] font-mono text-[#1B133C]/60 mb-1">COMPARISON VERSION (NEW)</label>
          <select
            value={v2}
            onChange={e => setV2(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-white border border-[#1B133C]/15 text-[#1B133C] text-xs focus:outline-none focus:border-[#1B133C] font-mono shadow-sm cursor-pointer"
          >
            {snapshots.map(s => (
              <option key={s.id} value={s.id}>
                v{s.version} ({new Date(s.timestamp).toLocaleTimeString()}) - {s.changePercent}% diff
              </option>
            ))}
          </select>
        </div>

      </div>

      {/* AI One-line Summary Strip */}
      {diffData?.newSnapshot?.aiSummary && (
        <div className="p-4 rounded-2xl bg-purple-50/80 border border-purple-200/70 flex items-center justify-between gap-4 text-[#1B133C]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-100 text-purple-700">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-mono text-purple-900 tracking-wider uppercase font-bold">
                AI Change Synthesis ({diffData.newSnapshot.changePercent}% diff)
              </div>
              <p className="text-sm font-medium text-[#1B133C] leading-relaxed">
                {diffData.newSnapshot.aiSummary}
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-[#1B133C]/60 bg-white px-3 py-1.5 rounded-xl border border-[#1B133C]/10 shadow-sm">
            <Hash className="w-3.5 h-3.5 text-orange-500" />
            <span>SHA: {diffData.newSnapshot.contentHash.slice(0, 10)}...</span>
          </div>
        </div>
      )}

      {/* DIFF CANVAS DISPLAY */}
      <div className="bg-white/80 backdrop-blur-md rounded-3xl p-5 min-h-[500px] border border-[#1B133C]/10 shadow-sm">
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] text-[#1B133C]/60 text-xs font-mono">
            <div className="w-8 h-8 border-2 border-[#1B133C] border-t-transparent rounded-full animate-spin mb-3" />
            <span>Computing pixel and text differential...</span>
          </div>
        ) : !diffData ? (
          <div className="text-center p-12 text-[#1B133C]/50 text-xs">
            No snapshots found for comparison.
          </div>
        ) : (
          <div>
            
            {/* 1. VISUAL SWIPE SLIDER */}
            {viewMode === 'slider' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs font-mono text-[#1B133C]/60">
                  <span className="text-[#1B133C]">← Baseline (Old Version)</span>
                  <span className="text-orange-600 font-bold">Slide to Reveal ({sliderPos}%)</span>
                  <span className="text-[#1B133C]">Comparison (New Version) →</span>
                </div>

                {/* Draggable Slider Viewport */}
                <div className="relative w-full h-[520px] bg-slate-50 rounded-2xl overflow-hidden border border-[#1B133C]/10 select-none">
                  
                  {/* New Image (Base Layer) */}
                  <img
                    src={diffData.newSnapshot.screenshotUrl || '/horizonx-hero.png'}
                    alt="New Version"
                    className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                  />

                  {/* Old Image (Clipped Layer on Left) */}
                  <div
                    style={{ width: `${sliderPos}%` }}
                    className="absolute inset-y-0 left-0 overflow-hidden border-r-2 border-orange-500 shadow-xl"
                  >
                    <img
                      src={diffData.oldSnapshot.screenshotUrl || '/horizonx-hero.png'}
                      alt="Old Version"
                      className="absolute inset-0 w-full h-full object-contain pointer-events-none max-w-none"
                      style={{ width: '100%' }}
                    />
                  </div>

                  {/* Interactive Slider Input Overlay */}
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={sliderPos}
                    onChange={e => setSliderPos(e.target.value)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
                  />

                  {/* Vertical Divider Handle Line */}
                  <div
                    style={{ left: `${sliderPos}%` }}
                    className="absolute inset-y-0 -ml-[1px] w-[2px] bg-orange-500 pointer-events-none z-20 flex items-center justify-center shadow-md"
                  >
                    <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs font-black shadow-lg">
                      ↔
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* 2. PIXEL DIFF HIGHLIGHT (Pixelmatch) */}
            {viewMode === 'pixel' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs font-mono text-[#1B133C]/60">
                  <span>Pixel Diff Highlight Area</span>
                  <span className="text-orange-600 font-semibold">
                    {diffData.visualDiff?.diffPercent ?? 0}% Changed Pixels ({diffData.visualDiff?.numDiffPixels ?? 0} px)
                  </span>
                </div>

                <div className="relative w-full h-[520px] bg-slate-50 rounded-2xl overflow-hidden border border-[#1B133C]/10 flex items-center justify-center">
                  {diffData.visualDiff?.diffScreenshotUrl ? (
                    <img
                      src={diffData.visualDiff.diffScreenshotUrl}
                      alt="Pixel Diff Highlight"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="text-center p-8 text-[#1B133C]/50 text-xs font-mono">
                      Visual pixel diff unavailable. Both versions share identical visual rendering.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 3. UNIFIED TEXT DIFF */}
            {viewMode === 'text-unified' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs font-mono text-[#1B133C]/60 border-b border-[#1B133C]/10 pb-3">
                  <div className="flex items-center gap-4">
                    <span className="text-emerald-700 font-bold">+{diffData.textDiff?.stats?.additions || 0} additions</span>
                    <span className="text-rose-700 font-bold">-{diffData.textDiff?.stats?.deletions || 0} deletions</span>
                  </div>
                  <span>Unified Text Patch</span>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-[#1B133C]/10 font-mono text-xs overflow-x-auto max-h-[500px] space-y-1 shadow-inner">
                  {diffData.textDiff?.lineDiff?.map((part, index) => {
                    const color = part.added
                      ? 'bg-emerald-50 text-emerald-800 border-l-2 border-emerald-500 pl-2'
                      : part.removed
                      ? 'bg-rose-50 text-rose-800 border-l-2 border-rose-500 pl-2'
                      : 'text-[#1B133C]/70 pl-2';
                    const prefix = part.added ? '+ ' : part.removed ? '- ' : '  ';

                    return (
                      <div key={index} className={`${color} py-0.5 rounded leading-relaxed whitespace-pre-wrap`}>
                        {part.value.split('\n').filter(Boolean).map((line, lIdx) => (
                          <div key={lIdx}>{prefix}{line}</div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 4. SIDE-BY-SIDE SPLIT TEXT DIFF */}
            {viewMode === 'text-split' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Left: Old */}
                <div className="space-y-2">
                  <div className="text-xs font-mono text-[#1B133C]/70 flex items-center justify-between p-2 rounded-xl bg-white border border-[#1B133C]/10 shadow-sm">
                    <span>Baseline (Old Version)</span>
                    <span className="text-rose-700 font-bold">v{diffData.oldSnapshot.version}</span>
                  </div>
                  <pre className="p-4 rounded-2xl bg-white border border-[#1B133C]/10 font-mono text-xs text-[#1B133C] overflow-auto max-h-[460px] whitespace-pre-wrap leading-relaxed shadow-inner">
                    {diffData.oldSnapshot.cleanedText || 'No text extracted'}
                  </pre>
                </div>

                {/* Right: New */}
                <div className="space-y-2">
                  <div className="text-xs font-mono text-[#1B133C]/70 flex items-center justify-between p-2 rounded-xl bg-white border border-[#1B133C]/10 shadow-sm">
                    <span>Comparison (New Version)</span>
                    <span className="text-emerald-700 font-bold">v{diffData.newSnapshot.version}</span>
                  </div>
                  <pre className="p-4 rounded-2xl bg-white border border-[#1B133C]/10 font-mono text-xs text-[#1B133C] overflow-auto max-h-[460px] whitespace-pre-wrap leading-relaxed shadow-inner">
                    {diffData.newSnapshot.cleanedText || 'No text extracted'}
                  </pre>
                </div>
              </div>
            )}

          </div>
        )}
      </div>

    </div>
  );
}
