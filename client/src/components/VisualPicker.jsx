import React, { useState } from 'react';
import { Eye, Target, RefreshCw, ArrowRight } from 'lucide-react';
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
          <div className="flex items-center gap-2 text-xs font-mono text-purple-600 mb-1">
            <Eye className="w-4 h-4" />
            <span>INTERACTIVE DOM REGION INSPECTOR</span>
          </div>
          <h2 className="font-['Instrument_Serif'] text-3xl sm:text-4xl font-normal text-[#1B133C]">
            Visual Element & Ignore Region Picker
          </h2>
          <p className="text-xs sm:text-sm text-[#1B133C]/60">
            Render live DOM in headless browser. Hover and click elements to watch specific regions or ignore dynamic noise.
          </p>
        </div>
      </div>

      {/* URL Input Bar */}
      <form onSubmit={handleInspect} className="bg-white/80 backdrop-blur-md rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-3 border border-[#1B133C]/10 shadow-sm">
        <div className="relative flex-1 w-full">
          <input
            type="url"
            required
            placeholder="https://example.com"
            value={url}
            onChange={e => setUrl(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#1B133C]/15 text-[#1B133C] placeholder-[#1B133C]/40 text-xs font-mono focus:outline-none focus:border-[#1B133C] shadow-sm"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#1B133C] hover:bg-[#1B133C]/90 text-white font-semibold text-xs uppercase tracking-wider shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Rendering DOM...</span>
            </>
          ) : (
            <>
              <Target className="w-4 h-4 text-orange-400" />
              <span>Inspect & Render</span>
            </>
          )}
        </button>
      </form>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
          {error}
        </div>
      )}

      {/* Interactive Picker Canvas Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Visual Canvas */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white/80 backdrop-blur-md rounded-3xl p-4 overflow-hidden relative border border-[#1B133C]/10 shadow-sm">
            
            <div className="flex items-center justify-between border-b border-[#1B133C]/10 pb-3 mb-3 text-xs font-mono text-[#1B133C]/60">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Headless Viewport (1200 x 750)</span>
              </span>
              <span>{inspectionData ? `${inspectionData.elements.length} Interactive Elements Mapped` : 'Awaiting Inspection'}</span>
            </div>

            {/* Viewport container */}
            <div className="relative w-full min-h-[460px] bg-slate-50 rounded-2xl overflow-hidden border border-[#1B133C]/10 flex items-center justify-center">
              
              {loading && (
                <div className="flex flex-col items-center gap-3 text-[#1B133C]/60 text-xs font-mono">
                  <div className="w-8 h-8 border-2 border-[#1B133C] border-t-transparent rounded-full animate-spin" />
                  <span>Launching headless browser session...</span>
                </div>
              )}

              {!loading && !inspectionData && (
                <div className="text-center p-8 max-w-md">
                  <Eye className="w-10 h-10 text-[#1B133C]/30 mx-auto mb-3" />
                  <p className="text-xs text-[#1B133C]/60">
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
                          isWatch ? 'border-2 border-purple-600 bg-purple-500/20' :
                          isIgnore ? 'border-2 border-rose-500 bg-rose-500/20' :
                          isHovered ? 'border-2 border-orange-500 bg-orange-500/20' :
                          'border border-dashed border-[#1B133C]/30 hover:border-orange-500 hover:bg-orange-500/10'
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
              <div className="mt-3 p-3 rounded-2xl bg-white border border-[#1B133C]/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs shadow-sm">
                <div>
                  <div className="flex items-center gap-2 font-mono text-purple-700">
                    <span className="font-bold">&lt;{hoveredElement.tag}&gt;</span>
                    <span className="text-[#1B133C] text-[11px] truncate max-w-sm">{hoveredElement.selector}</span>
                  </div>
                  <div className="text-[#1B133C]/60 text-[11px] truncate max-w-md mt-0.5">
                    "{hoveredElement.text}"
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    onClick={() => handleAddWatch(hoveredElement.selector)}
                    className="px-3 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-600 text-purple-700 hover:text-white font-bold text-[11px] font-mono transition-all border border-purple-200 cursor-pointer"
                  >
                    + Watch Region
                  </button>
                  <button
                    onClick={() => handleToggleIgnore(hoveredElement.selector)}
                    className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white font-bold text-[11px] font-mono transition-all border border-rose-200 cursor-pointer"
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
          <div className="bg-white/80 backdrop-blur-md rounded-3xl p-5 space-y-5 border border-[#1B133C]/10 shadow-sm">
            
            <h3 className="text-sm font-bold text-[#1B133C] flex items-center gap-2">
              <Target className="w-4 h-4 text-orange-500" />
              <span>Configured Selectors</span>
            </h3>

            {/* Watch Region */}
            <div>
              <label className="block text-xs font-mono text-[#1B133C]/60 mb-1.5 flex items-center justify-between">
                <span>ACTIVE WATCH REGION</span>
                {selectedWatch && (
                  <button onClick={() => setSelectedWatch('')} className="text-rose-500 text-[10px] hover:underline cursor-pointer">
                    Clear
                  </button>
                )}
              </label>

              {selectedWatch ? (
                <div className="p-3 rounded-xl bg-purple-50 border border-purple-200 text-xs font-mono text-purple-900 break-all">
                  {selectedWatch}
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-slate-50 border border-[#1B133C]/10 text-xs text-[#1B133C]/50 font-mono italic">
                  Whole body (Default)
                </div>
              )}
            </div>

            {/* Ignore Regions List */}
            <div>
              <label className="block text-xs font-mono text-[#1B133C]/60 mb-1.5">
                IGNORED NOISE REGIONS ({selectedIgnores.length})
              </label>

              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {selectedIgnores.map((sel, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-rose-50 border border-rose-200/80 text-xs font-mono text-rose-800">
                    <span className="truncate max-w-[200px]">{sel}</span>
                    <button
                      onClick={() => handleToggleIgnore(sel)}
                      className="text-rose-400 hover:text-rose-700 px-1 font-bold cursor-pointer"
                    >
                      ×
                    </button>
                  </div>
                ))}

                {selectedIgnores.length === 0 && (
                  <div className="text-xs text-[#1B133C]/40 italic p-2">No ignore regions selected.</div>
                )}
              </div>
            </div>

            {/* Quick Helper Presets */}
            <div>
              <label className="block text-[11px] font-mono text-[#1B133C]/60 mb-2">QUICK NOISE PRESETS</label>
              <div className="flex flex-wrap gap-1.5">
                {['.ads', 'footer', '.timestamp', '.comments', '.cookie-banner', '.view-counter'].map(preset => (
                  <button
                    key={preset}
                    onClick={() => handleToggleIgnore(preset)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition-all cursor-pointer ${
                      selectedIgnores.includes(preset)
                        ? 'bg-rose-500 text-white font-bold'
                        : 'bg-white text-[#1B133C]/70 hover:text-[#1B133C] border border-[#1B133C]/15 shadow-sm'
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Apply Button */}
            <div className="pt-3 border-t border-[#1B133C]/10">
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
                className="w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-wider shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
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
