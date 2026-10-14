import React, { useState, useEffect } from 'react';
import { Bell, Rss, Send, CheckCircle2, Copy, ExternalLink, Bookmark, Sparkles, ShieldAlert, AlertTriangle } from 'lucide-react';
import { fetchAlerts, testWebhook } from '../api';

export default function AlertsHub({ monitors }) {
  const [alerts, setAlerts] = useState([]);
  const [webhookTestUrl, setWebhookTestUrl] = useState('https://discord.com/api/webhooks/demo');
  const [testResult, setTestResult] = useState('');
  const [testing, setTesting] = useState(false);
  const [copiedFeed, setCopiedFeed] = useState('');

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    try {
      const res = await fetchAlerts();
      if (res.success && res.alerts) {
        setAlerts(res.alerts);
      }
    } catch (e) {
      console.error('Error fetching alerts:', e);
    }
  };

  const handleTestWebhook = async (e) => {
    e.preventDefault();
    if (!webhookTestUrl) return;
    setTesting(true);
    setTestResult('');
    try {
      const res = await testWebhook(webhookTestUrl);
      setTestResult(res.message || 'Webhook sent!');
    } catch (e) {
      setTestResult('Error sending webhook: ' + e.message);
    } finally {
      setTesting(false);
    }
  };

  const copyRssUrl = (monitorId) => {
    const fullUrl = `${window.location.origin}/api/monitors/${monitorId}/rss.xml`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedFeed(monitorId);
    setTimeout(() => setCopiedFeed(''), 2000);
  };

  // Browser bookmarklet script
  const bookmarkletCode = `javascript:(function(){const u=window.location.href;const t=document.title;window.open('${window.location.origin}/?add_url='+encodeURIComponent(u)+'&name='+encodeURIComponent(t),'_blank');})();`;

  return (
    <div className="space-y-6 text-left">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-horizon-orange mb-1">
          <Bell className="w-4 h-4" />
          <span>INTELLIGENT DISPATCH & SUBSCRIPTION CHANNELS</span>
        </div>
        <h2 className="text-2xl font-bold text-white">Alert Logs, Webhooks & Per-Page RSS</h2>
        <p className="text-xs text-slate-400">
          Real-time delivery to Discord, Telegram, Email, and native RSS feeds with duplicate suppression.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Alert History Stream */}
        <div className="lg:col-span-2 space-y-4">
          <div className="horizon-card rounded-3xl p-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Bell className="w-4 h-4 text-horizon-orange" />
                <span>Recent Alert Notifications ({alerts.length})</span>
              </h3>
              <button 
                onClick={loadAlerts}
                className="text-xs font-mono text-slate-400 hover:text-white"
              >
                Refresh
              </button>
            </div>

            {alerts.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs font-mono">
                No alerts dispatched yet.
              </div>
            ) : (
              <div className="space-y-3 max-h-[540px] overflow-y-auto pr-1">
                {alerts.map(alert => (
                  <div
                    key={alert.id}
                    className="p-4 rounded-2xl bg-horizon-950/80 border border-white/5 hover:border-white/20 transition-all space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {alert.type === 'ANTI_BOT_BLOCK' ? (
                          <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
                            <ShieldAlert className="w-3.5 h-3.5" />
                          </span>
                        ) : alert.type === 'KEYWORD_TRIGGER' ? (
                          <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                            <Sparkles className="w-3.5 h-3.5" />
                          </span>
                        ) : (
                          <span className="p-1.5 rounded-lg bg-horizon-orange/20 text-horizon-orange">
                            <Bell className="w-3.5 h-3.5" />
                          </span>
                        )}
                        <span className="text-xs font-bold text-white">{alert.title}</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">
                        {new Date(alert.timestamp).toLocaleTimeString()}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed pl-7">
                      {alert.summary}
                    </p>

                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pl-7 pt-1 border-t border-white/5">
                      <span>Target: <strong className="text-slate-200">{alert.monitorName}</strong></span>
                      <span className="text-slate-400">Delivered via: {alert.sentTo}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Webhook Tester & RSS Feeds */}
        <div className="space-y-6">
          
          {/* 1. Webhook Dispatch Tester */}
          <div className="horizon-card rounded-3xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Send className="w-4 h-4 text-horizon-orange" />
              <span>Test Discord Webhook</span>
            </h3>
            <p className="text-xs text-slate-400">
              Verify your webhook integration by sending a test alert payload.
            </p>

            <form onSubmit={handleTestWebhook} className="space-y-3">
              <input
                type="url"
                required
                value={webhookTestUrl}
                onChange={e => setWebhookTestUrl(e.target.value)}
                placeholder="https://discord.com/api/webhooks/..."
                className="w-full px-3 py-2 rounded-xl bg-horizon-950 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-horizon-orange"
              />

              <button
                type="submit"
                disabled={testing}
                className="w-full py-2.5 rounded-xl bg-horizon-orange hover:bg-horizon-orangeHover text-white text-xs font-bold font-mono uppercase tracking-wider shadow-glow-orange transition-all"
              >
                {testing ? 'Dispatching...' : 'Send Test Notification'}
              </button>
            </form>

            {testResult && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono">
                ✓ {testResult}
              </div>
            )}
          </div>

          {/* 2. Per-Page RSS Feeds (Bonus) */}
          <div className="horizon-card rounded-3xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Rss className="w-4 h-4 text-amber-400" />
                <span>Per-Page RSS Feeds</span>
              </h3>
              <span className="text-[10px] font-mono text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full">
                BONUS
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Subscribe to version changes of any target in Feedly, Slack, or NetNewsWire.
            </p>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {monitors.map(m => (
                <div key={m.id} className="p-2.5 rounded-xl bg-horizon-950 border border-white/5 flex items-center justify-between text-xs font-mono">
                  <span className="truncate max-w-[150px] text-white">{m.name}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => copyRssUrl(m.id)}
                      className="text-slate-400 hover:text-white p-1 rounded"
                      title="Copy RSS URL"
                    >
                      {copiedFeed === m.id ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <a
                      href={`/api/monitors/${m.id}/rss.xml`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-amber-400 hover:text-amber-300 p-1"
                      title="Open XML feed"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Browser Extension Bookmarklet (Bonus) */}
          <div className="horizon-card rounded-3xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-horizon-cyan" />
                <span>1-Click Bookmarklet</span>
              </h3>
              <span className="text-[10px] font-mono text-horizon-cyan bg-cyan-400/10 px-2 py-0.5 rounded-full">
                BONUS
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Drag this button to your browser Bookmarks Bar to monitor any webpage in 1 click!
            </p>

            <a
              href={bookmarkletCode}
              onClick={(e) => {
                alert('Drag this button to your Bookmarks Bar! When browsing any page, click the bookmark to automatically monitor it in HorizonX.');
              }}
              className="block w-full py-2.5 px-4 rounded-xl bg-horizon-cyan/20 hover:bg-horizon-cyan text-horizon-cyan hover:text-slate-950 font-mono text-xs font-bold text-center border border-horizon-cyan/40 transition-all cursor-grab active:cursor-grabbing"
            >
              + HorizonX Watcher
            </a>
          </div>

        </div>

      </div>

    </div>
  );
}
