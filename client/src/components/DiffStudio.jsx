import React, { useState, useEffect } from 'react';
import { GitCompare, Sliders, Image, FileText, Sparkles, Hash, ArrowRight, ShieldCheck } from 'lucide-react';
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

  const currentMonitor = monitors.find(m => m.id === monitorId);

  return (
    <div className="space-y-6 text-left">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-horizon-orange mb-1">
            <GitCompare className="w-4 h-4" />
            <span>VERSION ARTIFACT & DIFF STUDIO</span>
          </div>
          <h2 className="text-2xl font-bold text-white">Visual, Pixel & Word-Level Text Diff</h2>
          <p className="text-xs text-slate-400">
            Compare any two historical snapshots with interactive swipe slider, pixelmatch heatmap, or line-by-line diff.
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1 bg-horizon-900 p-1.5 rounded-2xl border border-white/10">
          <button
            onClick={() => setViewMode('slider')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all flex items-center gap-1.5 ${
              viewMode === 'slider' ? 'bg-horizon-orange text-white font-bold shadow-glow-orange' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Swipe Slider</span>
          </button>

          <button
            onClick={() => setViewMode('pixel')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all flex items-center gap-1.5 ${
              viewMode === 'pixel' ? 'bg-horizon-orange text-white font-bold shadow-glow-orange' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Image className="w-3.5 h-3.5" />
            <span>Pixel Highlight</span>
          </button>

          <button
            onClick={() => setViewMode('text-unified')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all flex items-center gap-1.5 ${
              viewMode === 'text-unified' ? 'bg-horizon-orange text-white font-bold shadow-glow-orange' : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Unified Diff</span>
          </button>

          <button
            onClick={() => setViewMode('text-split')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all flex items-center gap-1.5 ${
              viewMode === 'text-split' ? 'bg-horizon-orange text-white font-bold shadow-glow-orange' : 'text-slate-400 hover:text-white'
            }`}
          >
            <GitCompare className="w-3.5 h-3.5" />
            <span>Side-by-Side</span>
          </button>
        </div>
      </div>

      {/* Target & Version Selectors Bar */}
      <div className="horizon-card rounded-2xl p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Monitor dropdown */}
        <div>
          <label className="block text-[11px] font-mono text-slate-400 mb-1">TARGET MONITOR</label>
          <select
            value={monitorId}
            onChange={e => {
              setMonitorId(e.target.value);
              if (onSelectMonitor) onSelectMonitor(e.target.value);
            }}
            className="w-full px-3 py-2 rounded-xl bg-horizon-950 border border-white/10 text-white text-xs focus:outline-none focus:border-horizon-orange font-mono"
          >
            {monitors.map(m => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
        </div>

        {/* Old Version v1 */}
        <div>
          <label className="block text-[11px] font-mono text-slate-400 mb-1">BASELINE VERSION (OLD)</label>
          <select
            value={v1}
            onChange={e => setV1(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-horizon-950 border border-white/10 text-white text-xs focus:outline-none focus:border-horizon-orange font-mono"
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
          <label className="block text-[11px] font-mono text-slate-400 mb-1">COMPARISON VERSION (NEW)</label>
          <select
            value={v2}
            onChange={e => setV2(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-horizon-950 border border-white/10 text-white text-xs focus:outline-none focus:border-horizon-orange font-mono"
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
        <div className="p-4 rounded-2xl bg-gradient-to-r from-horizon-orange/15 to-transparent border border-horizon-orange/30 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-horizon-orange/20 text-horizon-orange">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-mono text-horizon-orange tracking-wider uppercase font-bold">
                AI Change Synthesis ({diffData.newSnapshot.changePercent}% diff)
              </div>
              <p className="text-sm font-medium text-white leading-relaxed">
                {diffData.newSnapshot.aiSummary}
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-400 bg-horizon-950/80 px-3 py-1.5 rounded-xl border border-white/5">
            <Hash className="w-3.5 h-3.5 text-horizon-orange" />
            <span>SHA: {diffData.newSnapshot.contentHash.slice(0, 10)}...</span>
          </div>
        </div>
      )}

      {/* DIFF CANVAS DISPLAY */}
      <div className="horizon-card rounded-3xl p-5 min-h-[500px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-400 text-xs font-mono">
            <div className="w-8 h-8 border-2 border-horizon-orange border-t-transparent rounded-full animate-spin mb-3" />
            <span>Computing pixel and text differential...</span>
          </div>
        ) : !diffData ? (
          <div className="text-center p-12 text-slate-400 text-xs">
            No snapshots found for comparison.
          </div>
        ) : (
          <div>
            
            {/* 1. VISUAL SWIPE SLIDER */}
            {viewMode === 'slider' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                  <span className="text-slate-300">← Baseline (Old Version)</span>
                  <span className="text-horizon-orange font-bold">Slide to Reveal ({sliderPos}%)</span>
                  <span className="text-horizon-orange">Comparison (New Version) →</span>
                </div>

                {/* Draggable Slider Viewport */}
                <div className="relative w-full h-[520px] bg-horizon-950 rounded-2xl overflow-hidden border border-white/10 select-none">
                  
                  {/* New Image (Base Layer) */}
                  <img
                    src={diffData.newSnapshot.screenshotUrl || '/horizonx-hero.png'}
                    alt="New Version"
                    className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                  />

                  {/* Old Image (Clipped Layer on Left) */}
                  <div
                    style={{ width: `${sliderPos}%` }}
                    className="absolute inset-y-0 left-0 overflow-hidden border-r-2 border-horizon-orange shadow-2xl"
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
                    className="absolute inset-y-0 -ml-[1px] w-[2px] bg-horizon-orange pointer-events-none z-20 flex items-center justify-center shadow-glow-orange"
                  >
                    <div className="w-8 h-8 rounded-full bg-horizon-orange text-white flex items-center justify-center text-xs font-black shadow-lg">
                      ↔
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* 2. PIXEL DIFF HIGHLIGHT (Pixelmatch) */}
            {viewMode === 'pixel' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                  <span>Pixel Diff Highlight Area</span>
                  <span className="text-horizon-orange font-semibold">
                    {diffData.visualDiff?.diffPercent ?? 0}% Changed Pixels ({diffData.visualDiff?.numDiffPixels ?? 0} px)
                  </span>
                </div>

                <div className="relative w-full h-[520px] bg-horizon-950 rounded-2xl overflow-hidden border border-white/10 flex items-center justify-center">
                  {diffData.visualDiff?.diffScreenshotUrl ? (
                    <img
                      src={diffData.visualDiff.diffScreenshotUrl}
                      alt="Pixel Diff Highlight"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="text-center p-8 text-slate-400 text-xs font-mono">
                      Visual pixel diff unavailable. Both versions share identical visual rendering.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 3. UNIFIED TEXT DIFF */}
            {viewMode === 'text-unified' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-b border-white/10 pb-3">
                  <div className="flex items-center gap-4">
                    <span className="text-emerald-400">+{diffData.textDiff?.stats?.additions || 0} additions</span>
                    <span className="text-rose-400">-{diffData.textDiff?.stats?.deletions || 0} deletions</span>
                  </div>
                  <span>Unified Text Patch</span>
                </div>

                <div className="p-4 rounded-2xl bg-horizon-950 font-mono text-xs overflow-x-auto max-h-[500px] space-y-1">
                  {diffData.textDiff?.lineDiff?.map((part, index) => {
                    const color = part.added
                      ? 'bg-emerald-500/15 text-emerald-300 border-l-2 border-emerald-500 pl-2'
                      : part.removed
                      ? 'bg-rose-500/15 text-rose-300 border-l-2 border-rose-500 pl-2'
                      : 'text-slate-400 pl-2';
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
                  <div className="text-xs font-mono text-slate-400 flex items-center justify-between p-2 rounded-xl bg-horizon-950 border border-white/5">
                    <span>Baseline (Old Version)</span>
                    <span className="text-rose-400">v{diffData.oldSnapshot.version}</span>
                  </div>
                  <pre className="p-4 rounded-2xl bg-horizon-950 font-mono text-xs text-slate-300 overflow-auto max-h-[460px] whitespace-pre-wrap leading-relaxed border border-white/5">
                    {diffData.oldSnapshot.cleanedText || 'No text extracted'}
                  </pre>
                </div>

                {/* Right: New */}
                <div className="space-y-2">
                  <div className="text-xs font-mono text-slate-400 flex items-center justify-between p-2 rounded-xl bg-horizon-950 border border-white/5">
                    <span>Comparison (New Version)</span>
                    <span className="text-emerald-400">v{diffData.newSnapshot.version}</span>
                  </div>
                  <pre className="p-4 rounded-2xl bg-horizon-950 font-mono text-xs text-slate-200 overflow-auto max-h-[460px] whitespace-pre-wrap leading-relaxed border border-white/5">
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
