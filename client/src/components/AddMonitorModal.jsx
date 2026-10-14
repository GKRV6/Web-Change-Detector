import React, { useState } from 'react';
import { X, Globe, Clock, Sliders, Shield, Bell, Target, Hash, Sparkles, Bookmark } from 'lucide-react';
import { createMonitor } from '../api';

export default function AddMonitorModal({ isOpen, onClose, onCreated }) {
  if (!isOpen) return null;

  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [intervalMinutes, setIntervalMinutes] = useState(15);
  const [watchSelector, setWatchSelector] = useState('');
  const [ignoreSelectorsInput, setIgnoreSelectorsInput] = useState('.ads, .timestamp, footer, .view-counter');
  const [noiseRegexInput, setNoiseRegexInput] = useState('\\d+\\s+points?, \\d+\\s+comments?');
  const [sensitivity, setSensitivity] = useState(5);
  const [keywordAlertsInput, setKeywordAlertsInput] = useState('');
  const [numberSelector, setNumberSelector] = useState('');
  const [webhookUrl, setWebhookUrl] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url.trim() || !name.trim()) {
      setError('Please provide a URL and a friendly Name.');
      return;
    }

    try {
      new URL(url.trim());
    } catch (err) {
      setError('Please enter a valid URL including http:// or https://');
      return;
    }

    setIsSubmitting(true);
    setError('');

    const payload = {
      name: name.trim(),
      url: url.trim(),
      intervalMinutes: parseInt(intervalMinutes) || 15,
      watchSelector: watchSelector.trim(),
      ignoreSelectors: ignoreSelectorsInput.split(',').map(s => s.trim()).filter(Boolean),
      noiseRegexes: noiseRegexInput.split(',').map(s => s.trim()).filter(Boolean),
      sensitivity: parseInt(sensitivity) || 5,
      keywordAlerts: keywordAlertsInput.split(',').map(s => s.trim()).filter(Boolean),
      numberSelector: numberSelector.trim(),
      webhookUrl: webhookUrl.trim(),
      email: email.trim(),
      tags: ['Custom']
    };

    try {
      const res = await createMonitor(payload);
      if (res.success) {
        onCreated(res.monitor);
        onClose();
      } else {
        setError(res.error || 'Failed to create monitor');
      }
    } catch (err) {
      setError(err.message || 'Network error creating monitor');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-horizon-900 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl text-left my-8">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-horizon-orange/20 border border-horizon-orange/30 flex items-center justify-center text-horizon-orange">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Add Monitored URL</h2>
            <p className="text-xs text-slate-400">Headless browser rendering with noise filtering & smart deduplication</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* URL & Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5">
                Target URL <span className="text-horizon-orange">*</span>
              </label>
              <input
                type="url"
                required
                placeholder="https://example.com/pricing"
                value={url}
                onChange={e => setUrl(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-horizon-950/80 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-horizon-orange focus:ring-1 focus:ring-horizon-orange"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5">
                Monitor Name <span className="text-horizon-orange">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Competitor SaaS Pricing"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-horizon-950/80 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-horizon-orange focus:ring-1 focus:ring-horizon-orange"
              />
            </div>
          </div>

          {/* Interval & Sensitivity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-horizon-orange" />
                <span>Check Interval</span>
              </label>
              <select
                value={intervalMinutes}
                onChange={e => setIntervalMinutes(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-horizon-950/80 border border-white/10 text-white text-xs focus:outline-none focus:border-horizon-orange"
              >
                <option value={15}>Every 15 minutes (High Frequency)</option>
                <option value={30}>Every 30 minutes</option>
                <option value={60}>Every 1 hour (Recommended)</option>
                <option value={360}>Every 6 hours</option>
                <option value={720}>Every 12 hours</option>
                <option value={1440}>Every 24 hours</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-horizon-orange" />
                  <span>Noise Sensitivity: {sensitivity}%</span>
                </span>
                <span className="text-[10px] text-slate-400">
                  {sensitivity === 0 ? 'Strict (0% diff)' : sensitivity <= 10 ? 'Balanced' : 'Major shifts only'}
                </span>
              </label>
              <input
                type="range"
                min={0}
                max={50}
                step={1}
                value={sensitivity}
                onChange={e => setSensitivity(e.target.value)}
                className="w-full accent-horizon-orange h-2 bg-horizon-950 rounded-lg cursor-pointer mt-2"
              />
            </div>
          </div>

          {/* Region Selectors: Watch & Ignore */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-horizon-cyan" />
                <span>Watch Region (CSS Selector)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. .pricing-table, article, #main-content"
                value={watchSelector}
                onChange={e => setWatchSelector(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-horizon-950/80 border border-white/10 text-white placeholder-slate-500 text-xs font-mono focus:outline-none focus:border-horizon-cyan"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">Leave empty to monitor entire page body.</span>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-rose-400" />
                <span>Ignore Regions (CSS Selectors)</span>
              </label>
              <input
                type="text"
                placeholder=".ads, .comments, footer, #clock"
                value={ignoreSelectorsInput}
                onChange={e => setIgnoreSelectorsInput(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-horizon-950/80 border border-white/10 text-white placeholder-slate-500 text-xs font-mono focus:outline-none focus:border-rose-400"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">Comma-separated selectors stripped before hashing.</span>
            </div>
          </div>

          {/* Bonus Features: Keyword Alerts & Numeric Tracker */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-horizon-950/50 border border-white/5">
            <div>
              <label className="block text-xs font-mono text-amber-300 mb-1.5 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Keyword-Only Alerts (Bonus)</span>
              </label>
              <input
                type="text"
                placeholder="In Stock, Sale, Waitlist, Release"
                value={keywordAlertsInput}
                onChange={e => setKeywordAlertsInput(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-horizon-900 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-amber-400"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">Alert only when specified keywords trigger.</span>
            </div>

            <div>
              <label className="block text-xs font-mono text-emerald-300 mb-1.5 flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-emerald-400" />
                <span>Number Tracking Selector (Bonus)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. .price-value, .follower-count"
                value={numberSelector}
                onChange={e => setNumberSelector(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-horizon-900 border border-white/10 text-white placeholder-slate-500 text-xs font-mono focus:outline-none focus:border-emerald-400"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">Extracts numeric price/counter for time-series charts.</span>
            </div>
          </div>

          {/* Alerts: Webhook & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Bell className="w-3.5 h-3.5 text-horizon-orange" />
                <span>Discord / Telegram Webhook</span>
              </label>
              <input
                type="url"
                placeholder="https://discord.com/api/webhooks/..."
                value={webhookUrl}
                onChange={e => setWebhookUrl(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-horizon-950/80 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-horizon-orange"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5">
                Email Notification
              </label>
              <input
                type="email"
                placeholder="alert@yourdomain.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-horizon-950/80 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-horizon-orange"
              />
            </div>
          </div>

          {/* Submit buttons */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/5 transition-all"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-horizon-orange hover:bg-horizon-orangeHover disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider shadow-glow-orange transition-all"
            >
              {isSubmitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span>Initializing...</span>
                </>
              ) : (
                <span>Launch Monitor</span>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
