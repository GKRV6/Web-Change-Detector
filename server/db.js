import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '..', 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');
const SCREENSHOTS_DIR = path.join(DATA_DIR, 'screenshots');

// Ensure directories exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

// Initial seed data with realistic monitors to explore immediately
const SEED_DATA = {
  monitors: [
    {
      id: "mon-1",
      name: "Hacker News Top Stories",
      url: "https://news.ycombinator.com",
      intervalMinutes: 15,
      watchSelector: ".athing",
      ignoreSelectors: [".score", ".age", ".subline"],
      noiseRegexes: ["\\d+\\s+points?", "\\d+\\s+comments?", "\\d+\\s+(minutes?|hours?|days?)\\s+ago"],
      sensitivity: 5,
      keywordAlerts: ["AI", "Release", "Show HN", "Launch"],
      numberSelector: "",
      status: "OK",
      statusReason: "Normal operations. 30 story items monitored.",
      lastChecked: new Date(Date.now() - 4 * 60 * 1000).toISOString(),
      lastChanged: new Date(Date.now() - 42 * 60 * 1000).toISOString(),
      nextCheck: new Date(Date.now() + 11 * 60 * 1000).toISOString(),
      responseTimeMs: 342,
      active: true,
      consecutiveFailures: 0,
      tags: ["Tech", "Headlines"],
      webhookUrl: "https://discord.com/api/webhooks/demo",
      email: "alerts@horizonx.local"
    },
    {
      id: "mon-2",
      name: "GitHub System Status",
      url: "https://www.githubstatus.com",
      intervalMinutes: 30,
      watchSelector: ".page-status",
      ignoreSelectors: ["time", ".color-secondary"],
      noiseRegexes: ["Last updated.*", "UTC"],
      sensitivity: 0,
      keywordAlerts: ["Degraded", "Major Outage", "Incident"],
      numberSelector: "",
      status: "OK",
      statusReason: "All Systems Operational.",
      lastChecked: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
      lastChanged: new Date(Date.now() - 180 * 60 * 1000).toISOString(),
      nextCheck: new Date(Date.now() + 18 * 60 * 1000).toISOString(),
      responseTimeMs: 215,
      active: true,
      consecutiveFailures: 0,
      tags: ["DevOps", "Status"],
      webhookUrl: "",
      email: "devops-team@company.internal"
    },
    {
      id: "mon-3",
      name: "SpaceX Starship Updates",
      url: "https://www.spacex.com/vehicles/starship/",
      intervalMinutes: 60,
      watchSelector: "main section",
      ignoreSelectors: ["footer", ".cookie-notice"],
      noiseRegexes: ["copyright \\d{4}"],
      sensitivity: 10,
      keywordAlerts: ["Flight 7", "Static Fire", "Launch Window"],
      numberSelector: "",
      status: "OK",
      statusReason: "Starship integrated flight test countdown monitored.",
      lastChecked: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
      lastChanged: new Date(Date.now() - 860 * 60 * 1000).toISOString(),
      nextCheck: new Date(Date.now() + 35 * 60 * 1000).toISOString(),
      responseTimeMs: 512,
      active: true,
      consecutiveFailures: 0,
      tags: ["Space", "Starship"],
      webhookUrl: "",
      email: ""
    },
    {
      id: "mon-4",
      name: "GPU Pricing Tracker (RTX 5090)",
      url: "https://example.com/store/gpu-5090",
      intervalMinutes: 15,
      watchSelector: ".product-price-val",
      ignoreSelectors: [".viewers-watching", ".stock-counter"],
      noiseRegexes: [],
      sensitivity: 0,
      keywordAlerts: ["In Stock"],
      numberSelector: ".product-price-val",
      status: "OK",
      statusReason: "Tracking numeric price fluctuation over time.",
      lastChecked: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
      lastChanged: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
      nextCheck: new Date(Date.now() + 12 * 60 * 1000).toISOString(),
      responseTimeMs: 180,
      active: true,
      consecutiveFailures: 0,
      tags: ["E-Commerce", "Hardware", "Price"],
      webhookUrl: "",
      email: ""
    },
    {
      id: "mon-5",
      name: "Cloudflare Protected Target (Demo Anti-Bot Guard)",
      url: "https://challenge-demo.cloudflare.com",
      intervalMinutes: 60,
      watchSelector: "body",
      ignoreSelectors: [],
      noiseRegexes: [],
      sensitivity: 10,
      keywordAlerts: [],
      numberSelector: "",
      status: "BLOCKED",
      statusReason: "Cloudflare Turnstile challenge wall detected (403/503). Change alert suppressed.",
      lastChecked: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
      lastChanged: new Date(Date.now() - 300 * 60 * 1000).toISOString(),
      nextCheck: new Date(Date.now() + 52 * 60 * 1000).toISOString(),
      responseTimeMs: 780,
      active: true,
      consecutiveFailures: 2,
      tags: ["Security", "CAPTCHA"],
      webhookUrl: "",
      email: ""
    }
  ],
  snapshots: [
    {
      id: "snap-1-v1",
      monitorId: "mon-1",
      version: 1,
      timestamp: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
      contentHash: "4c7182ec838a1a9e52e42b2600d8b584e03d3c11f77d5440d99fae5bfa780d09",
      textSnapshot: "1. OpenAI reveals Strawberry reasoning model benchmarks\n2. Show HN: Fast SQLite search engine in Rust\n3. PostgreSQL 17 Officially Released\n4. Why we migrated from Kubernetes to Bare Metal\n5. Linux 6.12 Kernel Updates",
      cleanedText: "OpenAI reveals Strawberry reasoning model benchmarks Show HN Fast SQLite search engine in Rust PostgreSQL 17 Officially Released Why we migrated from Kubernetes to Bare Metal Linux 6.12 Kernel Updates",
      screenshotUrl: "/screenshots/mock-hn-v1.png",
      status: "OK",
      changePercent: 0,
      aiSummary: "Baseline initial snapshot captured with top 5 stories.",
      extractedNumber: null
    },
    {
      id: "snap-1-v2",
      monitorId: "mon-1",
      version: 2,
      timestamp: new Date(Date.now() - 42 * 60 * 1000).toISOString(),
      contentHash: "a9108cb90fa9601d8bbd4c679a834e941198642a86dbf8e32c748bf4921f0081",
      textSnapshot: "1. DeepSeek releases Open-Source V3 Model with MoE Architecture\n2. Show HN: Fast SQLite search engine in Rust\n3. PostgreSQL 17 Officially Released\n4. Anthropic Claude 3.5 Sonnet Updated Benchmarks\n5. Linux 6.12 Kernel Updates",
      cleanedText: "DeepSeek releases Open-Source V3 Model with MoE Architecture Show HN Fast SQLite search engine in Rust PostgreSQL 17 Officially Released Anthropic Claude 3.5 Sonnet Updated Benchmarks Linux 6.12 Kernel Updates",
      screenshotUrl: "/screenshots/mock-hn-v2.png",
      status: "OK",
      changePercent: 38.5,
      aiSummary: "2 new frontpage stories: DeepSeek V3 release and Claude 3.5 Sonnet updates replaced Strawberry and Bare metal stories.",
      extractedNumber: null
    },
    {
      id: "snap-4-v1",
      monitorId: "mon-4",
      version: 1,
      timestamp: new Date(Date.now() - 180 * 60 * 1000).toISOString(),
      contentHash: "f320984a1e94819dfb40a823efb089cfa291bc9e47209148dbe480391ab9c832",
      textSnapshot: "NVIDIA GeForce RTX 5090 Founders Edition\nPrice: $1,999.00\nAvailability: Out of Stock\nShips within 24 hours when restocked.",
      cleanedText: "NVIDIA GeForce RTX 5090 Founders Edition Price 1999.00 Availability Out of Stock Ships within 24 hours when restocked.",
      screenshotUrl: "/screenshots/mock-gpu-v1.png",
      status: "OK",
      changePercent: 0,
      aiSummary: "Baseline price recorded at $1,999.00 (Out of Stock).",
      extractedNumber: 1999.00
    },
    {
      id: "snap-4-v2",
      monitorId: "mon-4",
      version: 2,
      timestamp: new Date(Date.now() - 95 * 60 * 1000).toISOString(),
      contentHash: "820d8bb091bc840a4e723049b1fa8902c384918ef94b8e219714890cbe0a9143",
      textSnapshot: "NVIDIA GeForce RTX 5090 Founders Edition\nPrice: $1,899.00\nAvailability: Pre-order Available\nShips within 24 hours when restocked.",
      cleanedText: "NVIDIA GeForce RTX 5090 Founders Edition Price 1899.00 Availability Pre-order Available Ships within 24 hours when restocked.",
      screenshotUrl: "/screenshots/mock-gpu-v2.png",
      status: "OK",
      changePercent: 12.0,
      aiSummary: "Price discounted by $100 (-5.0%) from $1,999 to $1,899; Pre-order now open.",
      extractedNumber: 1899.00
    },
    {
      id: "snap-4-v3",
      monitorId: "mon-4",
      version: 3,
      timestamp: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
      contentHash: "09e8432a7bc4092189dbe7189fa80293c847120938472918472093847129048a",
      textSnapshot: "NVIDIA GeForce RTX 5090 Founders Edition\nPrice: $1,799.00\nAvailability: In Stock\nShips within 24 hours when restocked.",
      cleanedText: "NVIDIA GeForce RTX 5090 Founders Edition Price 1799.00 Availability In Stock Ships within 24 hours when restocked.",
      screenshotUrl: "/screenshots/mock-gpu-v3.png",
      status: "OK",
      changePercent: 14.5,
      aiSummary: "Price dropped further by $100 to $1,799.00 (In Stock keyword triggered!).",
      extractedNumber: 1799.00
    }
  ],
  alerts: [
    {
      id: "alert-1",
      monitorId: "mon-1",
      monitorName: "Hacker News Top Stories",
      timestamp: new Date(Date.now() - 42 * 60 * 1000).toISOString(),
      type: "CONTENT_CHANGE",
      title: "Content Change Detected on Hacker News",
      summary: "38.5% text variation detected. DeepSeek V3 release story broke onto top page.",
      diffPercent: 38.5,
      sentTo: "discord-webhook, alerts@horizonx.local",
      delivered: true
    },
    {
      id: "alert-2",
      monitorId: "mon-4",
      monitorName: "GPU Pricing Tracker (RTX 5090)",
      timestamp: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
      type: "KEYWORD_TRIGGER",
      title: "Keyword Alert: 'In Stock' matched on RTX 5090",
      summary: "Price dropped to $1,799.00. Status shifted to 'In Stock'.",
      diffPercent: 14.5,
      sentTo: "discord-webhook",
      delivered: true
    },
    {
      id: "alert-3",
      monitorId: "mon-5",
      monitorName: "Cloudflare Protected Target",
      timestamp: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
      type: "ANTI_BOT_BLOCK",
      title: "Target Blocked: Cloudflare Turnstile Challenge",
      summary: "HTTP 403 / Bot Challenge encountered. Content diffing safely suspended to prevent false alerts.",
      diffPercent: 0,
      sentTo: "system-audit",
      delivered: true
    }
  ],
  systemMetrics: {
    totalChecksPerformed: 1428,
    coalescedRequestsSaved: 614,
    noiseAlertsSuppressed: 982,
    activeMonitorsCount: 5,
    domainCooldownQueue: 0
  }
};

class Database {
  constructor() {
    this.data = null;
    this.init();
  }

  init() {
    if (!fs.existsSync(DB_FILE)) {
      this.data = JSON.parse(JSON.stringify(SEED_DATA));
      this.save();
    } else {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(raw);
      } catch (err) {
        console.error('Error reading db.json, falling back to seed:', err);
        this.data = JSON.parse(JSON.stringify(SEED_DATA));
        this.save();
      }
    }
  }

  save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error writing db.json:', err);
    }
  }

  getMonitors() {
    return this.data.monitors || [];
  }

  getMonitor(id) {
    return (this.data.monitors || []).find(m => m.id === id);
  }

  addMonitor(monitor) {
    if (!this.data.monitors) this.data.monitors = [];
    this.data.monitors.unshift(monitor);
    this.save();
    return monitor;
  }

  updateMonitor(id, updates) {
    const idx = (this.data.monitors || []).findIndex(m => m.id === id);
    if (idx !== -1) {
      this.data.monitors[idx] = { ...this.data.monitors[idx], ...updates };
      this.save();
      return this.data.monitors[idx];
    }
    return null;
  }

  deleteMonitor(id) {
    this.data.monitors = (this.data.monitors || []).filter(m => m.id !== id);
    this.data.snapshots = (this.data.snapshots || []).filter(s => s.monitorId !== id);
    this.data.alerts = (this.data.alerts || []).filter(a => a.monitorId !== id);
    this.save();
    return true;
  }

  getSnapshots(monitorId) {
    return (this.data.snapshots || [])
      .filter(s => s.monitorId === monitorId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  getSnapshot(id) {
    return (this.data.snapshots || []).find(s => s.id === id);
  }

  addSnapshot(snapshot) {
    if (!this.data.snapshots) this.data.snapshots = [];
    this.data.snapshots.unshift(snapshot);
    this.save();
    return snapshot;
  }

  getAlerts(limit = 50) {
    return (this.data.alerts || []).slice(0, limit);
  }

  addAlert(alert) {
    if (!this.data.alerts) this.data.alerts = [];
    this.data.alerts.unshift(alert);
    if (this.data.alerts.length > 200) {
      this.data.alerts = this.data.alerts.slice(0, 200);
    }
    this.save();
    return alert;
  }

  getMetrics() {
    return this.data.systemMetrics || {
      totalChecksPerformed: 0,
      coalescedRequestsSaved: 0,
      noiseAlertsSuppressed: 0,
      activeMonitorsCount: (this.data.monitors || []).filter(m => m.active).length
    };
  }

  updateMetrics(updater) {
    if (!this.data.systemMetrics) {
      this.data.systemMetrics = {
        totalChecksPerformed: 0,
        coalescedRequestsSaved: 0,
        noiseAlertsSuppressed: 0,
        activeMonitorsCount: 0
      };
    }
    this.data.systemMetrics = updater(this.data.systemMetrics);
    this.save();
  }
}

export const db = new Database();
export { DATA_DIR, SCREENSHOTS_DIR };
