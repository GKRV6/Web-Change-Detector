import React, { useState } from 'react';
import { Eye, Target, Shield, Check, RefreshCw, Sparkles, Plus, ExternalLink, ArrowRight } from 'lucide-react';
import { inspectUrl } from '../api';

export default function VisualPicker({ initialUrl = '', onSelectSelectors }) {
  const [url, setUrl] = useState(initialUrl || 'https://news.ycombinator.com');
  const [loading, setLoading] = useState(false);
  const [inspectionData, setInspectionData] = useState(null);
  const [hoveredElement, setHoveredElement] = useState(null);
  const [selectedWatch, setSelectedWatch] = useState('');
  const [selectedIgnores, setSelectedIgnores] = useState(['.score', '.age']);
  const [error, setError] = useState('');

  const handleInspect = async (e) => {
    if (e) e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setError('');
    setHoveredElement(null);

    try {
      const data = await inspectUrl(url.trim());
      if (data.success) {
        setInspectionData(data);
      } else {
        setError(data.error || 'Inspection failed');
      }
    } catch (err) {
      setError(err.message || 'Failed to inspect page');
    } finally {
      setLoading(false);
    }
  };

  const handleAddWatch = (selector) => {
    setSelectedWatch(selector);
  };

  const handleToggleIgnore = (selector) => {
    if (selectedIgnores.includes(selector)) {
      setSelectedIgnores(selectedIgnores.filter(s => s !== selector));
    } else {
      setSelectedIgnores([...selectedIgnores, selector]);
    }
  };

  return (
    <div className="space-y-6 text-left">
      
      {/* Header Info */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-horizon-cyan mb-1">
            <Eye className="w-4 h-4" />
            <span>INTERACTIVE DOM REGION INSPECTOR</span>
          </div>
          <h2 className="text-2xl font-bold text-white">Visual Element & Ignore Region Picker</h2>
          <p className="text-xs text-slate-400">
            Render live DOM in headless browser. Hover and click elements to watch specific regions or ignore dynamic noise.
          </p>
        </div>
      </div>

      {/* URL Input Bar */}
      <form onSubmit={handleInspect} className="horizon-card rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <input
            type="url"
            required
            placeholder="https://example.com"
            value={url}
            onChange={e => setUrl(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-horizon-950 border border-white/10 text-white placeholder-slate-500 text-xs font-mono focus:outline-none focus:border-horizon-cyan"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-horizon-cyan hover:bg-sky-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-glow-cyan transition-all flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Rendering DOM...</span>
            </>
          ) : (
            <>
              <Target className="w-4 h-4" />
              <span>Inspect & Render</span>
            </>
          )}
        </button>
      </form>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
          {error}
        </div>
      )}

      {/* Interactive Picker Canvas Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Visual Canvas */}
        <div className="lg:col-span-2 space-y-4">
          <div className="horizon-card rounded-3xl p-4 overflow-hidden relative">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3 text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Headless Viewport (1200 x 750)</span>
              </span>
              <span>{inspectionData ? `${inspectionData.elements.length} Interactive Elements Mapped` : 'Awaiting Inspection'}</span>
            </div>

            {/* Viewport container */}
            <div className="relative w-full min-h-[460px] bg-horizon-950 rounded-2xl overflow-hidden border border-white/5 flex items-center justify-center">
              
              {loading && (
                <div className="flex flex-col items-center gap-3 text-slate-400 text-xs font-mono">
                  <div className="w-8 h-8 border-2 border-horizon-cyan border-t-transparent rounded-full animate-spin" />
                  <span>Launching headless browser session...</span>
                </div>
              )}

              {!loading && !inspectionData && (
                <div className="text-center p-8 max-w-md">
                  <Eye className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                  <p className="text-xs text-slate-400">
                    Click <strong>Inspect & Render</strong> to capture the target page screenshot and populate the interactive bounding box selector map.
                  </p>
                </div>
              )}

              {!loading && inspectionData && (
                <div className="relative w-full overflow-auto max-h-[580px]">
                  
                  {/* Screenshot Backdrop */}
                  <img
                    src={inspectionData.screenshotUrl}
                    alt="Inspected Page Screenshot"
                    className="w-full h-auto block select-none pointer-events-none"
                  />

                  {/* Interactive Overlays */}
                  {inspectionData.elements.map((el, i) => {
                    const isWatch = selectedWatch === el.selector;
                    const isIgnore = selectedIgnores.includes(el.selector);
                    const isHovered = hoveredElement && hoveredElement.selector === el.selector;

                    return (
                      <div
                        key={i}
                        onMouseEnter={() => setHoveredElement(el)}
                        style={{
                          left: `${el.rect.x}px`,
                          top: `${el.rect.y}px`,
                          width: `${el.rect.width}px`,
                          height: `${el.rect.height}px`
                        }}
                        className={`absolute cursor-pointer transition-all duration-150 z-20 ${
                          isWatch ? 'border-2 border-horizon-cyan bg-cyan-500/20' :
                          isIgnore ? 'border-2 border-rose-500 bg-rose-500/20' :
                          isHovered ? 'border-2 border-horizon-orange bg-horizon-orange/20' :
                          'border border-dashed border-white/20 hover:border-horizon-orange hover:bg-white/5'
                        }`}
                        title={`${el.tag}: ${el.selector}`}
                      />
                    );
                  })}

                </div>
              )}

            </div>

            {/* Hovered element detail pill */}
            {hoveredElement && (
              <div className="mt-3 p-3 rounded-2xl bg-horizon-950/90 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-2 font-mono text-horizon-orange">
                    <span className="font-bold">&lt;{hoveredElement.tag}&gt;</span>
                    <span className="text-white text-[11px] truncate max-w-sm">{hoveredElement.selector}</span>
                  </div>
                  <div className="text-slate-400 text-[11px] truncate max-w-md mt-0.5">
                    "{hoveredElement.text}"
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    onClick={() => handleAddWatch(hoveredElement.selector)}
                    className="px-3 py-1.5 rounded-lg bg-horizon-cyan/20 hover:bg-horizon-cyan text-horizon-cyan hover:text-slate-950 font-bold text-[11px] font-mono transition-all"
                  >
                    + Watch Region
                  </button>
                  <button
                    onClick={() => handleToggleIgnore(hoveredElement.selector)}
                    className="px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white font-bold text-[11px] font-mono transition-all"
                  >
                    - Ignore Region
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Right Col: Selected Configuration Drawer */}
        <div className="space-y-4">
          <div className="horizon-card rounded-3xl p-5 space-y-5">
            
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Target className="w-4 h-4 text-horizon-orange" />
              <span>Configured Selectors</span>
            </h3>

            {/* Watch Region */}
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1.5 flex items-center justify-between">
                <span>ACTIVE WATCH REGION</span>
                {selectedWatch && (
                  <button onClick={() => setSelectedWatch('')} className="text-rose-400 text-[10px] hover:underline">
                    Clear
                  </button>
                )}
              </label>

              {selectedWatch ? (
                <div className="p-3 rounded-xl bg-horizon-cyan/10 border border-horizon-cyan/30 text-xs font-mono text-horizon-cyan break-all">
                  {selectedWatch}
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-horizon-950 border border-white/5 text-xs text-slate-500 font-mono italic">
                  Whole body (Default)
                </div>
              )}
            </div>

            {/* Ignore Regions List */}
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1.5">
                IGNORED NOISE REGIONS ({selectedIgnores.length})
              </label>

              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {selectedIgnores.map((sel, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs font-mono text-rose-300">
                    <span className="truncate max-w-[200px]">{sel}</span>
                    <button
                      onClick={() => handleToggleIgnore(sel)}
                      className="text-slate-400 hover:text-white px-1"
                    >
                      ×
                    </button>
                  </div>
                ))}

                {selectedIgnores.length === 0 && (
                  <div className="text-xs text-slate-500 italic p-2">No ignore regions selected.</div>
                )}
              </div>
            </div>

            {/* Quick Helper Presets */}
            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-2">QUICK NOISE PRESETS</label>
              <div className="flex flex-wrap gap-1.5">
                {['.ads', 'footer', '.timestamp', '.comments', '.cookie-banner', '.view-counter'].map(preset => (
                  <button
                    key={preset}
                    onClick={() => handleToggleIgnore(preset)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition-all ${
                      selectedIgnores.includes(preset)
                        ? 'bg-rose-500 text-white font-bold'
                        : 'bg-horizon-900 text-slate-400 hover:text-white border border-white/10'
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Apply Button */}
            <div className="pt-3 border-t border-white/10">
              <button
                onClick={() => {
                  if (onSelectSelectors) {
                    onSelectSelectors({
                      url,
                      watchSelector: selectedWatch,
                      ignoreSelectors: selectedIgnores
                    });
                  }
                  alert(`Selectors copied! Watch: "${selectedWatch || 'body'}", Ignores: ${selectedIgnores.length}`);
                }}
                className="w-full py-3 rounded-xl bg-horizon-orange hover:bg-horizon-orangeHover text-white font-bold text-xs uppercase tracking-wider shadow-glow-orange flex items-center justify-center gap-2 transition-all"
              >
                <span>Save to Monitor</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
