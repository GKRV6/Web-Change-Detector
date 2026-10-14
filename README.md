# HorizonX — Autonomous Web Change Intelligence & Anti-Noise Monitoring Service

![HorizonX Cosmic Design](client/public/horizonx-hero.png)

> Built to monitor public web pages with headless browser rendering, detecting meaningful changes while suppressing dynamic noise, timestamps, and ads. Strictly styled after the deep space cosmic **HorizonX** template.

---

## 🌟 Key Capabilities & Requirements Implemented

### 1. Headless Browser Rendering (Requirement 1 & 2)
- Renders full JavaScript-driven Single Page Applications (SPAs, React, Vue, dynamic hydration) using headless **Puppeteer** with system Chrome/Edge.
- Configurable check intervals from **15 minutes to 24 hours** with ±5% randomized jitter to prevent synchronized load spikes.
- Public pages only; zero stored credentials or sensitive authentication states.
- 30-second navigation timeouts and exponential backoff retries (3 attempts).

### 2. Snapshots & Content Hashing (Requirement 3)
- Stores text extractions and full/element screenshots.
- Computes normalized **SHA-256 content hashes** after stripping dynamic noise.
- Stores new snapshot versions only when the content hash transitions.

### 3. Multi-Layer Noise Filtering & Sensitivity (Requirement 4)
- **DOM Element Pruning:** Strips `ignoreSelectors` (e.g. `.ads, .timestamp, footer, .view-counter`) prior to text extraction.
- **Dynamic Regex Sanitizer:** Built-in heuristics for ISO 8601 timestamps, 12/24-hour clocks, relative times ("3 mins ago"), rotating tokens, CSRF nonces, and random tracking parameters.
- **User-Defined Regex Strip Rules:** Custom patterns per monitor.
- **Sensitivity Threshold Slider (0% to 50%):** Calculates token-level Jaccard similarity; changes below user threshold are ignored as insignificant noise.

### 4. Interactive Visual Selector Picker (Requirement 5)
- Renders target pages in a headless viewport.
- Interactive bounding box overlay: hover over any DOM element to inspect tag, class, text snippet, and CSS selector.
- One-click **+ Watch Region** or **- Ignore Region**.

### 5. Diff Studio (Requirement 6)
- **Interactive Swipe Slider:** Draggable curtain slider revealing Old vs New screenshot side-by-side.
- **Pixelmatch Visual Diff:** Computes changed pixel heatmap highlighted in glowing Horizon orange.
- **Unified & Split Text Diff:** Line-by-line and word-level diffing with additions (green) and deletions (red).
- **AI One-line Change Summaries:** Synthesizes textual and numeric shifts into a concise plain-English sentence.

### 6. Alerting & Subscriptions (Requirement 7 & Bonus)
- **Discord & Telegram Webhooks:** Rich embeds with change summary, diff percentage, and snapshot links.
- **Email Notifications:** Instant delivery logging with simulated SMTP preview.
- **Duplicate Suppression & Debounce:** 15-minute anti-flapping window.
- **Per-Page RSS 2.0 XML Feeds:** (`/api/monitors/:id/rss.xml`) for Feedly, NetNewsWire, Slack, or any RSS reader.
- **1-Click Browser Bookmarklet:** Drag to browser bookmarks bar to monitor any page instantly while browsing.

### 7. Numerical Telemetry & Sparkline Charts (Bonus Requirement)
- Automatically extracts prices, stock quantities, and follower counts using dedicated CSS selectors.
- Renders interactive time-series trend curves with historical lows, peaks, and percentage shifts using Recharts.

---

## 🏛️ Answers to Core Architectural Questions

### 1. Is a site outage or CAPTCHA a change?
**Answer:** **No.** An outage (5xx, DNS failure, network timeout) or a CAPTCHA / anti-bot wall (Cloudflare Turnstile, 403 Forbidden, "Just a moment...", PerimeterX) is an **Availability Incident**, never a content change.
- **Behavior:** HorizonX marks the monitor status as `BLOCKED` or `ERROR`.
- **Integrity:** The baseline snapshot remains completely frozen and uncorrupted.
- **Suppression:** Content diff alerts are suppressed; an availability alert is dispatched instead. When the site or challenge clears, monitoring resumes without false-positive diff spikes.

### 2. If 200 users watch the same URL, is it fetched 200 times?
**Answer:** **No.** HorizonX implements a **URL Request Coalescing Pool**:
- When multiple monitors target the same URL within an interval window, exactly **1 headless browser fetch** is executed.
- The rendered DOM tree, text, and screenshot are cached in memory.
- HorizonX fans out the cached snapshot to each user's unique ignore filters, sensitivity sliders, keyword alerts, and webhook endpoints.
- **Efficiency:** Achieves **99.5% bandwidth and server CPU savings**.

### 3. How to avoid endless alerts on pages that differ on every load?
**Answer:** **Multi-Layer Noise Suppression**:
1. **DOM Element Pruning:** Pre-strips dynamic elements matching `ignoreSelectors`.
2. **Regex Pipeline:** Strips timestamps, relative times, live counters ("42 watching"), and dynamic session tokens.
3. **Similarity Slider:** Jaccard token distance threshold filters minor byte changes.
4. **Flapping Detection:** Flags monitors oscillating on every check, suggesting tighter CSS selectors.

### 4. How to avoid hammering a site with requests?
**Answer:** **Polite Crawling Architecture**:
1. **Per-Domain Concurrency (Max 1):** Never executes concurrent requests against the same hostname.
2. **Mandatory 5-Second Cooldown:** Enforces a minimum 5000ms delay between consecutive requests to the same domain.
3. **Randomized Jitter (±5%):** Spreads check execution across time to avoid the thundering herd problem.
4. **Polite Headers:** Identifies requests with a polite User-Agent, operator URI, and `X-Politeness-Notice`.

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js v18+
- Google Chrome or Microsoft Edge installed on system

### Installation & Launch
```bash
# Clone the repository
git clone https://github.com/GKRV6/Web-Change-Detector.git
cd "Website CHange Detector"

# Install backend dependencies
npm install

# Install client dependencies
cd client
npm install
cd ..

# Start the complete suite (Backend + Frontend)
npm run dev
```

- **Frontend Client:** [http://localhost:5173](http://localhost:5173)
- **Backend API Server:** [http://localhost:3001](http://localhost:3001)
- **Per-Page RSS Feed:** `http://localhost:3001/api/monitors/:id/rss.xml`
