import React, { useState } from 'react';
import { X, Globe, Clock, Sliders, Shield, Bell, Target, Hash, Sparkles } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1B133C]/40 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white/95 backdrop-blur-xl border border-[#1B133C]/10 rounded-3xl p-6 sm:p-8 shadow-2xl text-left my-8 text-[#1B133C]">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl text-[#1B133C]/40 hover:text-[#1B133C] hover:bg-black/5 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center text-white shadow-sm">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-['Instrument_Serif'] text-3xl font-normal text-[#1B133C]">Add Monitored URL</h2>
            <p className="text-xs text-[#1B133C]/60">Headless browser rendering with noise filtering & smart deduplication</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* URL & Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#1B133C] uppercase tracking-wider mb-1.5">
                Target URL <span className="text-orange-500">*</span>
              </label>
              <input
                type="url"
                required
                placeholder="https://example.com/pricing"
                value={url}
                onChange={e => setUrl(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#1B133C]/15 text-[#1B133C] placeholder-[#1B133C]/40 text-xs focus:outline-none focus:border-[#1B133C] focus:ring-1 focus:ring-[#1B133C] shadow-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1B133C] uppercase tracking-wider mb-1.5">
                Monitor Name <span className="text-orange-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Competitor SaaS Pricing"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#1B133C]/15 text-[#1B133C] placeholder-[#1B133C]/40 text-xs focus:outline-none focus:border-[#1B133C] focus:ring-1 focus:ring-[#1B133C] shadow-sm"
              />
            </div>
          </div>

          {/* Interval & Sensitivity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#1B133C] uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span>Check Frequency</span>
                <span className="text-orange-600 font-bold">{intervalMinutes} minutes</span>
              </label>
              <select
                value={intervalMinutes}
                onChange={e => setIntervalMinutes(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#1B133C]/15 text-[#1B133C] text-xs focus:outline-none focus:border-[#1B133C] shadow-sm cursor-pointer"
              >
                <option value={1}>Every 1 minute (Fast / Testing)</option>
                <option value={5}>Every 5 minutes</option>
                <option value={15}>Every 15 minutes (Standard)</option>
                <option value={60}>Every 1 hour</option>
                <option value={360}>Every 6 hours</option>
                <option value={1440}>Every 24 hours</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1B133C] uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span>Alert Sensitivity</span>
                <span className="text-orange-600 font-bold">&gt; {sensitivity}% Shift</span>
              </label>
              <input
                type="range"
                min="1"
                max="50"
                value={sensitivity}
                onChange={e => setSensitivity(e.target.value)}
                className="w-full accent-[#1B133C] cursor-pointer mt-2"
              />
              <div className="flex justify-between text-[10px] text-[#1B133C]/50 mt-1">
                <span>1% (High sensitivity)</span>
                <span>25%</span>
                <span>50% (Major changes only)</span>
              </div>
            </div>
          </div>

          {/* Watch & Ignore CSS Selectors */}
          <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-200/40 space-y-4">
            <div className="text-xs font-semibold text-[#1B133C] flex items-center gap-1.5">
              <Target className="w-4 h-4 text-purple-600" />
              <span>Targeted DOM Regions (Leave blank for full page)</span>
            </div>

            <div>
              <label className="block text-xs font-mono text-[#1B133C]/70 mb-1">
                Watch Specific Selector (CSS)
              </label>
              <input
                type="text"
                placeholder="e.g. .pricing-table, #main-content, .status-feed"
                value={watchSelector}
                onChange={e => setWatchSelector(e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-white border border-[#1B133C]/15 text-[#1B133C] placeholder-[#1B133C]/40 text-xs focus:outline-none focus:border-[#1B133C] shadow-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-[#1B133C]/70 mb-1">
                Ignore Dynamic Elements (CSS comma-separated)
              </label>
              <input
                type="text"
                placeholder=".ads, .timestamp, .counter, footer"
                value={ignoreSelectorsInput}
                onChange={e => setIgnoreSelectorsInput(e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-white border border-[#1B133C]/15 text-[#1B133C] placeholder-[#1B133C]/40 text-xs focus:outline-none focus:border-[#1B133C] shadow-sm"
              />
            </div>
          </div>

          {/* Keyword Alerting & Numeric Extraction */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#1B133C] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Bell className="w-3.5 h-3.5 text-orange-500" />
                <span>Keyword Alerts (Comma-separated)</span>
              </label>
              <input
                type="text"
                placeholder="Sold Out, Out of Stock, Launch"
                value={keywordAlertsInput}
                onChange={e => setKeywordAlertsInput(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#1B133C]/15 text-[#1B133C] placeholder-[#1B133C]/40 text-xs focus:outline-none focus:border-[#1B133C] shadow-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1B133C] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-emerald-600" />
                <span>Numeric Price Tracker Selector</span>
              </label>
              <input
                type="text"
                placeholder="e.g. .price-val, span.total-cost"
                value={numberSelector}
                onChange={e => setNumberSelector(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#1B133C]/15 text-[#1B133C] placeholder-[#1B133C]/40 text-xs focus:outline-none focus:border-[#1B133C] shadow-sm"
              />
            </div>
          </div>

          {/* Webhook & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#1B133C] uppercase tracking-wider mb-1.5">
                Discord / Slack Webhook URL
              </label>
              <input
                type="url"
                placeholder="https://discord.com/api/webhooks/..."
                value={webhookUrl}
                onChange={e => setWebhookUrl(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#1B133C]/15 text-[#1B133C] placeholder-[#1B133C]/40 text-xs focus:outline-none focus:border-[#1B133C] shadow-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1B133C] uppercase tracking-wider mb-1.5">
                Alert Email (Simulated)
              </label>
              <input
                type="email"
                placeholder="ops@company.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#1B133C]/15 text-[#1B133C] placeholder-[#1B133C]/40 text-xs focus:outline-none focus:border-[#1B133C] shadow-sm"
              />
            </div>
          </div>

          {/* Modal Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#1B133C]/10">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-[#1B133C]/70 hover:text-[#1B133C] hover:bg-black/5 transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-[#1B133C] hover:bg-[#1B133C]/90 text-white text-xs font-bold uppercase tracking-wider shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'Scheduling Headless Monitor...' : 'Save & Start Monitor'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
