import React, { useState } from 'react';
import { 
  ShieldCheck, Users, Filter, Clock, CheckCircle2, 
  ShieldAlert, Zap 
} from 'lucide-react';
import { runCaptchaTest, runDedupTest, runNoiseTest, runRateLimitTest } from '../api';

export default function ArchitectureHub() {
  const [activeQuestion, setActiveQuestion] = useState(1);

  // Q1: Captcha simulator state
  const [captchaSimResult, setCaptchaSimResult] = useState(null);
  const [captchaLoading, setCaptchaLoading] = useState(false);

  // Q2: Deduplication simulator state
  const [watchersCount, setWatchersCount] = useState(200);
  const [dedupResult, setDedupResult] = useState(null);

  // Q3: Noise filter simulator state
  const [noiseSampleText, setNoiseSampleText] = useState(
    "OpenAI GPT-5 Announcement\nPrice: $20/mo\nLast updated: 2026-10-15T00:21:20Z (just now)\nLive viewers: 1,420 watching\nSession Token: nonce=8f9a21bcf71e\nSponsored Ad: Try SuperCloud today!"
  );
  const [customRegex, setCustomRegex] = useState("Sponsored Ad:.*");
  const [noiseResult, setNoiseResult] = useState(null);

  // Q4: Rate limiter simulator state
  const [queuedRequests, setQueuedRequests] = useState(5);
  const [rateLimitResult, setRateLimitResult] = useState(null);

  const testCaptcha = async (isCaptcha) => {
    setCaptchaLoading(true);
    try {
      const res = await runCaptchaTest(isCaptcha);
      setCaptchaSimResult(res);
    } finally {
      setCaptchaLoading(false);
    }
  };

  const testDedup = async () => {
    const res = await runDedupTest(watchersCount);
    setDedupResult(res);
  };

  const testNoise = async () => {
    const res = await runNoiseTest(noiseSampleText, customRegex);
    setNoiseResult(res);
  };

  const testRateLimit = async () => {
    const res = await runRateLimitTest(queuedRequests);
    setRateLimitResult(res);
  };

  return (
    <div className="space-y-6 text-left">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-purple-600 mb-1">
          <ShieldCheck className="w-4 h-4" />
          <span>SYSTEM DESIGN SPECIFICATION & ARCHITECTURAL SOLUTIONS</span>
        </div>
        <h2 className="font-['Instrument_Serif'] text-3xl sm:text-4xl font-normal text-[#1B133C]">
          Core Requirements & Architecture Hub
        </h2>
        <p className="text-xs sm:text-sm text-[#1B133C]/60">
          In-depth architectural analysis and live interactive simulators resolving the 4 core design challenges.
        </p>
      </div>

      {/* 4 Questions Navigation Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { id: 1, title: 'Q1: Outages & CAPTCHA', subtitle: 'Is an outage or CAPTCHA a change?', icon: ShieldAlert, color: 'text-amber-600' },
          { id: 2, title: 'Q2: 200 Users Deduplication', subtitle: 'Fetched 200 times for 200 users?', icon: Users, color: 'text-emerald-600' },
          { id: 3, title: 'Q3: Endless Alerts & Noise', subtitle: 'How to avoid flapping changes?', icon: Filter, color: 'text-orange-500' },
          { id: 4, title: 'Q4: Site Hammering & Limits', subtitle: 'How to avoid hammering a site?', icon: Clock, color: 'text-purple-600' }
        ].map(q => {
          const Icon = q.icon;
          const isActive = activeQuestion === q.id;
          return (
            <button
              key={q.id}
              onClick={() => setActiveQuestion(q.id)}
              className={`p-4 rounded-2xl text-left transition-all border cursor-pointer ${
                isActive
                  ? 'bg-white border-[#1B133C] shadow-md ring-1 ring-[#1B133C]'
                  : 'bg-white/70 border-[#1B133C]/10 hover:border-[#1B133C]/30 shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold text-[#1B133C]">{q.title}</span>
                <Icon className={`w-4 h-4 ${q.color}`} />
              </div>
              <div className="text-[11px] text-[#1B133C]/60 truncate">{q.subtitle}</div>
            </button>
          );
        })}
      </div>

      {/* ACTIVE QUESTION PANEL & SIMULATOR */}
      <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 sm:p-8 space-y-8 border border-[#1B133C]/10 shadow-sm text-[#1B133C]">
        
        {/* ================= QUESTION 1 ================= */}
        {activeQuestion === 1 && (
          <div className="space-y-6">
            <div className="border-b border-[#1B133C]/10 pb-4">
              <span className="text-xs font-mono text-amber-700 font-bold">CORE REQUIREMENT 1</span>
              <h3 className="font-['Instrument_Serif'] text-2xl sm:text-3xl font-normal text-[#1B133C] mt-1">
                Is a site outage or CAPTCHA challenge considered a content change?
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-[#1B133C]/80 leading-relaxed">
              <div className="space-y-3">
                <h4 className="font-mono text-rose-700 text-sm font-semibold flex items-center gap-1.5">
                  <span>❌ The Problem With Naive Crawlers:</span>
                </h4>
                <p>
                  If a target website experiences a 503 Service Unavailable, DNS timeout, or presents a Cloudflare Turnstile / anti-bot challenge wall, a naive change detector will treat the challenge page or 404/500 error page as a <strong>100% content change</strong>.
                </p>
                <p>
                  This triggers catastrophic false alarms to users, replaces valid baseline snapshots with anti-bot junk HTML, and corrupts historical version diffs.
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-mono text-emerald-800 text-sm font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Axon Architectural Solution:</span>
                </h4>
                <p>
                  Axon treats outages and CAPTCHA challenges as <strong>System Availability Incidents</strong>, never as content changes:
                </p>
                <ul className="list-disc pl-4 space-y-1 text-[#1B133C]/80">
                  <li><strong>Status Separation:</strong> The monitor transitions to <code className="text-amber-700 bg-amber-50 px-1 py-0.5 rounded">BLOCKED</code> or <code className="text-rose-700 bg-rose-50 px-1 py-0.5 rounded">ERROR</code>.</li>
                  <li><strong>Snapshot Preservation:</strong> Baseline snapshot remains completely untouched.</li>
                  <li><strong>Diff Alert Suppression:</strong> Content change notifications are halted; a distinct availability alert is sent.</li>
                  <li><strong>Automatic Self-Healing:</strong> When the challenge clears, normal diffing resumes without artificial diff spikes.</li>
                </ul>
              </div>
            </div>

            {/* Interactive Live Simulator */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-[#1B133C]/10 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-mono font-bold text-[#1B133C] flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-600" />
                  <span>Interactive Simulator: Anti-Bot Wall Interception</span>
                </h4>
                <span className="text-[11px] font-mono text-[#1B133C]/50">Live API Test</span>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => testCaptcha(true)}
                  disabled={captchaLoading}
                  className="px-4 py-2 rounded-xl bg-amber-100 hover:bg-amber-500 hover:text-white text-amber-900 font-mono text-xs font-bold transition-all border border-amber-200 cursor-pointer"
                >
                  Simulate Cloudflare 403 / Turnstile
                </button>

                <button
                  onClick={() => testCaptcha(false)}
                  disabled={captchaLoading}
                  className="px-4 py-2 rounded-xl bg-emerald-100 hover:bg-emerald-600 hover:text-white text-emerald-900 font-mono text-xs font-bold transition-all border border-emerald-200 cursor-pointer"
                >
                  Simulate Legitimate Page Load (200 OK)
                </button>
              </div>

              {captchaSimResult && (
                <div className="p-4 rounded-xl bg-white border border-[#1B133C]/10 font-mono text-xs space-y-2 shadow-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-[#1B133C]/60">SYSTEM VERDICT:</span>
                    <span className="font-bold text-[#1B133C] px-2 py-0.5 rounded bg-[#1B133C]/5 border border-[#1B133C]/10">
                      {captchaSimResult.verdict}
                    </span>
                  </div>
                  <div className="text-[#1B133C]">
                    <strong className="text-orange-600">Action Taken:</strong> {captchaSimResult.action}
                  </div>
                  <div className="text-[#1B133C]/60 text-[11px]">
                    {captchaSimResult.explanation}
                  </div>
                </div>
              )}
            </div>

          </div>
        )}

        {/* ================= QUESTION 2 ================= */}
        {activeQuestion === 2 && (
          <div className="space-y-6">
            <div className="border-b border-[#1B133C]/10 pb-4">
              <span className="text-xs font-mono text-emerald-700 font-bold">CORE REQUIREMENT 2</span>
              <h3 className="font-['Instrument_Serif'] text-2xl sm:text-3xl font-normal text-[#1B133C] mt-1">
                If 200 users watch the same URL, is it fetched 200 times?
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-[#1B133C]/80 leading-relaxed">
              <div className="space-y-3">
                <h4 className="font-mono text-rose-700 text-sm font-semibold">
                  ❌ The Waste of 1:1 Polling:
                </h4>
                <p>
                  If 200 users configure monitors for <code>https://news.ycombinator.com</code>, launching 200 headless Chromium browser instances will consume 12+ GB of server RAM, trigger IP rate limits from Hacker News, and waste 99% of CPU time.
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-mono text-emerald-800 text-sm font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Axon URL Request Coalescing Pool:</span>
                </h4>
                <p>
                  Axon employs a <strong>URL Coalescing & Fanout Scheduler</strong>:
                </p>
                <ul className="list-disc pl-4 space-y-1">
                  <li><strong>Single Master Fetch:</strong> When multiple jobs require the same URL within the interval window, exactly 1 headless fetch is scheduled.</li>
                  <li><strong>Render Cache:</strong> The rendered DOM tree, text, and screenshot are cached in memory for the coalescing window.</li>
                  <li><strong>Fanout Evaluation:</strong> Each watcher's custom ignore selectors, sensitivity thresholds, keyword alerts, and webhook targets are evaluated client-side against the shared snapshot.</li>
                </ul>
              </div>
            </div>

            {/* Interactive Deduplication Benchmark Simulator */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-[#1B133C]/10 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-mono font-bold text-[#1B133C] flex items-center gap-2">
                  <Zap className="w-4 h-4 text-emerald-600" />
                  <span>Interactive Simulator: Request Coalescing Savings</span>
                </h4>
                <button
                  onClick={testDedup}
                  className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-xs font-bold transition-all shadow-sm cursor-pointer"
                >
                  Simulate Concurrent Batch
                </button>
              </div>

              <div>
                <label className="block text-xs font-mono text-[#1B133C]/70 mb-2">
                  Simulate Concurrent Watchers: <strong className="text-[#1B133C]">{watchersCount} Users</strong>
                </label>
                <input
                  type="range"
                  min={10}
                  max={500}
                  step={10}
                  value={watchersCount}
                  onChange={e => setWatchersCount(parseInt(e.target.value))}
                  className="w-full accent-[#1B133C] h-2 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>

              {dedupResult && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs text-center">
                  <div className="p-3 rounded-xl bg-white border border-[#1B133C]/10 shadow-sm">
                    <div className="text-[#1B133C]/50 text-[10px]">HEADLESS BROWSER RUNS</div>
                    <div className="text-xl font-bold text-emerald-700">{dedupResult.actualHeadlessFetches} Fetch</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-[#1B133C]/10 shadow-sm">
                    <div className="text-[#1B133C]/50 text-[10px]">SAVED DUPLICATE REQUESTS</div>
                    <div className="text-xl font-bold text-[#1B133C]">{dedupResult.savedRequests} Saved</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-[#1B133C]/10 shadow-sm">
                    <div className="text-[#1B133C]/50 text-[10px]">BANDWIDTH EFFICIENCY</div>
                    <div className="text-xl font-bold text-purple-700">{dedupResult.bandwidthSavedPercent}%</div>
                  </div>
                </div>
              )}
            </div>

          </div>
        )}

        {/* ================= QUESTION 3 ================= */}
        {activeQuestion === 3 && (
          <div className="space-y-6">
            <div className="border-b border-[#1B133C]/10 pb-4">
              <span className="text-xs font-mono text-orange-600 font-bold">CORE REQUIREMENT 3</span>
              <h3 className="font-['Instrument_Serif'] text-2xl sm:text-3xl font-normal text-[#1B133C] mt-1">
                How to avoid endless alerts on pages that differ on every load?
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-[#1B133C]/80 leading-relaxed">
              <div className="space-y-3">
                <h4 className="font-mono text-rose-700 text-sm font-semibold">
                  ❌ The Noise Dilemma:
                </h4>
                <p>
                  Modern web pages change dynamically on every request: timestamps ("3 minutes ago"), live viewer widgets ("24 people viewing"), rotating banner ads, CSRF nonces, and random query tokens. A basic SHA-256 detector triggers non-stop false alarms.
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-mono text-orange-700 text-sm font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-orange-500" />
                  <span>Axon Multi-Layer Noise Suppression:</span>
                </h4>
                <ul className="list-disc pl-4 space-y-1">
                  <li><strong>DOM Element Pruning:</strong> Removes elements matching <code>ignoreSelectors</code> (.ads, .timestamp, footer).</li>
                  <li><strong>Regex Sanitization Pipeline:</strong> Strips ISO dates, relative times, tokens, and nonces.</li>
                  <li><strong>Token Similarity Threshold:</strong> Changes below the sensitivity slider (e.g. 5% token shift) are suppressed as noise.</li>
                  <li><strong>Consecutive Change Dampener:</strong> Warns when a page is flapping and auto-suggests tighter selectors.</li>
                </ul>
              </div>
            </div>

            {/* Interactive Live Noise Tester */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-[#1B133C]/10 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-mono font-bold text-[#1B133C] flex items-center gap-2">
                  <Zap className="w-4 h-4 text-orange-500" />
                  <span>Interactive Live Noise Stripping Engine</span>
                </h4>
                <button
                  onClick={testNoise}
                  className="px-4 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-mono text-xs font-bold transition-all shadow-sm cursor-pointer"
                >
                  Sanitize & Compute Hash
                </button>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-[#1B133C]/60 mb-1">
                  RAW INPUT (With Dynamic Noise, Timestamps & Nonces):
                </label>
                <textarea
                  rows={3}
                  value={noiseSampleText}
                  onChange={e => setNoiseSampleText(e.target.value)}
                  className="w-full p-3 rounded-xl bg-white border border-[#1B133C]/15 text-[#1B133C] text-xs font-mono focus:outline-none focus:border-[#1B133C] shadow-sm"
                />
              </div>

              {noiseResult && (
                <div className="space-y-3 font-mono text-xs">
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 shadow-sm">
                    <div className="text-[10px] text-emerald-700 mb-1 font-bold">CLEANED TEXT (Noise & Tokens Stripped):</div>
                    <pre className="whitespace-pre-wrap">{noiseResult.cleanedText}</pre>
                  </div>
                  <div className="flex items-center gap-2 text-[#1B133C]/70 text-[11px]">
                    <span>STABLE CONTENT HASH:</span>
                    <code className="text-orange-600 bg-white px-2 py-0.5 rounded border border-[#1B133C]/10 shadow-xs font-bold">
                      {noiseResult.contentHash}
                    </code>
                  </div>
                </div>
              )}
            </div>

          </div>
        )}

        {/* ================= QUESTION 4 ================= */}
        {activeQuestion === 4 && (
          <div className="space-y-6">
            <div className="border-b border-[#1B133C]/10 pb-4">
              <span className="text-xs font-mono text-purple-700 font-bold">CORE REQUIREMENT 4</span>
              <h3 className="font-['Instrument_Serif'] text-2xl sm:text-3xl font-normal text-[#1B133C] mt-1">
                How to avoid hammering a site with requests?
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-[#1B133C]/80 leading-relaxed">
              <div className="space-y-3">
                <h4 className="font-mono text-rose-700 text-sm font-semibold">
                  ❌ The Risk of Aggressive Crawling:
                </h4>
                <p>
                  Rapid bursts of parallel requests trigger HTTP 429 Too Many Requests, firewall blocks, or accidental denial-of-service on small websites.
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-mono text-purple-800 text-sm font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-purple-600" />
                  <span>Axon Polite Crawler Guarantees:</span>
                </h4>
                <ul className="list-disc pl-4 space-y-1">
                  <li><strong>Per-Domain Concurrency (Max 1):</strong> Never issues concurrent requests to the same hostname.</li>
                  <li><strong>Mandatory 5-Second Host Cooldown:</strong> Forces minimum 5000ms delay between fetches to the same domain.</li>
                  <li><strong>Jitter Scheduling (±5%):</strong> Randomizes check intervals to prevent synchronized spikes.</li>
                  <li><strong>Polite Headers:</strong> Configurable User-Agent with operator contact URI and politeness notices.</li>
                </ul>
              </div>
            </div>

            {/* Interactive Domain Rate Limiter Simulator */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-[#1B133C]/10 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-mono font-bold text-[#1B133C] flex items-center gap-2">
                  <Zap className="w-4 h-4 text-purple-600" />
                  <span>Interactive Simulator: Domain Serializer & Cooldown Queue</span>
                </h4>
                <button
                  onClick={testRateLimit}
                  className="px-4 py-1.5 rounded-xl bg-[#1B133C] hover:bg-[#1B133C]/90 text-white font-mono text-xs font-bold transition-all shadow-sm cursor-pointer"
                >
                  Queue 5 Concurrent Domain Checks
                </button>
              </div>

              {rateLimitResult && (
                <div className="space-y-3 font-mono text-xs">
                  <div className="text-[#1B133C]/70 text-[11px]">
                    Target Domain: <strong className="text-[#1B133C]">{rateLimitResult.domain}</strong> — Policy: {rateLimitResult.policy}
                  </div>
                  <div className="space-y-2">
                    {rateLimitResult.queueTimeline.map(item => (
                      <div key={item.requestIndex} className="p-2.5 rounded-xl bg-white border border-[#1B133C]/10 flex items-center justify-between shadow-xs">
                        <span>Check #{item.requestIndex}</span>
                        <span className="text-purple-700 font-bold">Delay: +{item.scheduledDelaySec}s</span>
                        <span className="text-[#1B133C]/60 text-[11px]">{item.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
