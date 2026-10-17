import { db } from './db.js';
import { crawlPage } from './crawler.js';
import { cleanText, computeContentHash, calculateChangePercentage, extractNumber } from './noiseFilter.js';
import { generateAiSummary } from './diffEngine.js';
import { dispatchAlert } from './alertDispatcher.js';

class SchedulerQueue {
  constructor() {
    this.concurrency = 2; // Maximum concurrent headless browser jobs
    this.activeWorkers = 0;
    this.queue = [];
    this.domainLastRequestTime = new Map(); // Domain -> epoch ms
    this.domainCooldownMs = 5000; // Polite spacing per domain (Question 4)
    this.urlFetchCache = new Map(); // URL -> { timestamp, rawResult } (Question 2)
    this.cacheWindowMs = 60 * 1000; // 60s coalescing window
    this.isRunning = false;
    this.timer = null;
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    console.log('[Scheduler] Background engine started. Polling every 5 seconds.');
    this.timer = setInterval(() => this.tick(), 5000);
    this.tick();
  }

  stop() {
    this.isRunning = false;
    if (this.timer) clearInterval(this.timer);
  }

  getMetrics() {
    return {
      activeWorkers: this.activeWorkers,
      queueLength: this.queue.length,
      domainCooldownsTracked: this.domainLastRequestTime.size,
      activeCoalescedEntries: this.urlFetchCache.size
    };
  }

  /**
   * Main scheduler loop: checks for due monitors and queues them
   */
  tick() {
    const now = Date.now();
    const monitors = db.getMonitors().filter(m => m.active);

    for (const monitor of monitors) {
      const nextCheckTime = new Date(monitor.nextCheck || 0).getTime();
      const isDue = now >= nextCheckTime;
      const isAlreadyQueued = this.queue.some(j => j.monitorId === monitor.id);

      if (isDue && !isAlreadyQueued) {
        this.enqueue(monitor.id, 'SCHEDULED');
      }
    }

    this.processQueue();
  }

  /**
   * Push monitor check job to queue
   */
  enqueue(monitorId, trigger = 'MANUAL') {
    if (this.queue.some(j => j.monitorId === monitorId)) {
      console.log(`[Scheduler] Monitor ${monitorId} already in queue.`);
      return false;
    }

    this.queue.push({
      id: `job-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      monitorId,
      trigger,
      enqueuedAt: Date.now(),
      retries: 0
    });

    this.processQueue();
    return true;
  }

  /**
   * Process next jobs while respecting concurrency and per-domain rate limits
   */
  async processQueue() {
    if (this.activeWorkers >= this.concurrency || this.queue.length === 0) {
      return;
    }

    const now = Date.now();

    // Find the next job whose domain is not currently cooling down
    let selectedIndex = -1;
    let selectedDomain = '';

    for (let i = 0; i < this.queue.length; i++) {
      const job = this.queue[i];
      const monitor = db.getMonitor(job.monitorId);
      if (!monitor) {
        this.queue.splice(i, 1);
        i--;
        continue;
      }

      let domain = 'unknown';
      try {
        domain = new URL(monitor.url).hostname;
      } catch (e) {}

      const lastDomainReq = this.domainLastRequestTime.get(domain) || 0;
      if (now - lastDomainReq >= this.domainCooldownMs) {
        selectedIndex = i;
        selectedDomain = domain;
        break;
      }
    }

    if (selectedIndex === -1) {
      // All queued items are in domain cooldown
      return;
    }

    const [job] = this.queue.splice(selectedIndex, 1);
    this.activeWorkers++;
    this.domainLastRequestTime.set(selectedDomain, Date.now());

    this.executeJob(job)
      .catch(err => {
        console.error(`[Scheduler] Job ${job.id} unexpected error:`, err);
      })
      .finally(() => {
        this.activeWorkers--;
        // Immediately try processing next
        this.processQueue();
      });
  }

  /**
   * Execute single monitor check with URL coalescing, noise filtering, and diffing
   */
  async executeJob(job) {
    const monitor = db.getMonitor(job.monitorId);
    if (!monitor) return;

    console.log(`[Scheduler] Executing check for: "${monitor.name}" (${monitor.url})`);

    // Clean old cache entries
    const now = Date.now();
    for (const [key, item] of this.urlFetchCache.entries()) {
      if (now - item.timestamp > this.cacheWindowMs) {
        this.urlFetchCache.delete(key);
      }
    }

    let crawlResult = null;
    let wasCoalesced = false;

    // URL Request Coalescing Key: Include selector configuration to prevent cross-contamination
    const ignoreKey = Array.isArray(monitor.ignoreSelectors) ? monitor.ignoreSelectors.slice().sort().join(',') : '';
    const coalescingKey = `${monitor.url}::${monitor.watchSelector || ''}::${ignoreKey}::${monitor.numberSelector || ''}`;

    if (this.urlFetchCache.has(coalescingKey)) {
      const cached = this.urlFetchCache.get(coalescingKey);
      if (now - cached.timestamp <= this.cacheWindowMs) {
        crawlResult = cached.result;
        wasCoalesced = true;
        console.log(`[Scheduler] Coalescing hit! Re-using fetched page for ${monitor.url} (0 duplicate browser hits)`);
        db.updateMetrics(m => ({ ...m, coalescedRequestsSaved: m.coalescedRequestsSaved + 1 }));
      }
    }

    if (!crawlResult) {
      crawlResult = await crawlPage({
        url: monitor.url,
        watchSelector: monitor.watchSelector,
        ignoreSelectors: monitor.ignoreSelectors,
        numberSelector: monitor.numberSelector,
        screenshotName: `snap_${monitor.id}_${Date.now()}.png`
      });

      // Cache valid results for other monitors targeting this URL with identical extraction rules
      if (crawlResult.status === 'OK') {
        this.urlFetchCache.set(coalescingKey, {
          timestamp: Date.now(),
          result: crawlResult
        });
      }
    }

    db.updateMetrics(m => ({ ...m, totalChecksPerformed: m.totalChecksPerformed + 1 }));

    // Calculate next scheduled check with ±5% jitter
    const intervalMinutes = monitor.intervalMinutes || 60;
    const jitterSeconds = Math.floor((Math.random() * 0.1 - 0.05) * intervalMinutes * 60);
    const nextCheckMs = Date.now() + intervalMinutes * 60 * 1000 + jitterSeconds * 1000;
    const nextCheckIso = new Date(nextCheckMs).toISOString();

    // Handle non-fatal selector warning (e.g. element not mounted or renamed)
    if (crawlResult.status === 'WARNING') {
      db.updateMonitor(monitor.id, {
        status: 'WARNING',
        statusReason: crawlResult.statusReason,
        lastChecked: new Date().toISOString(),
        nextCheck: nextCheckIso,
        responseTimeMs: crawlResult.responseTimeMs,
        consecutiveFailures: 0
      });
      return;
    }

    // Question 1: Handle Outage & Anti-Bot Block
    if (crawlResult.status !== 'OK') {
      const isBlocked = crawlResult.isCaptcha || crawlResult.status === 'BLOCKED';
      const newStatus = isBlocked ? 'BLOCKED' : 'ERROR';
      const consecutiveFailures = (monitor.consecutiveFailures || 0) + 1;

      // Retry up to 2 times for transient errors before failing
      if (!isBlocked && job.retries < 2) {
        console.log(`[Scheduler] Retrying job for ${monitor.name} (Attempt ${job.retries + 1}/3)...`);
        job.retries++;
        this.queue.unshift(job);
        return;
      }

      db.updateMonitor(monitor.id, {
        status: newStatus,
        statusReason: crawlResult.statusReason,
        lastChecked: new Date().toISOString(),
        nextCheck: nextCheckIso,
        responseTimeMs: crawlResult.responseTimeMs,
        consecutiveFailures
      });

      if (isBlocked) {
        await dispatchAlert({
          monitor,
          snapshot: { contentHash: 'BLOCKED' },
          changePercent: 0,
          aiSummary: crawlResult.statusReason,
          alertType: 'ANTI_BOT_BLOCK'
        });
      }

      return;
    }

    // Clean text and calculate content hash (Question 3: Noise Filtering)
    const cleanedText = cleanText(crawlResult.rawText, monitor.noiseRegexes);
    const contentHash = computeContentHash(cleanedText);

    // Extract numeric value if numberSelector configured
    const extractedNum = extractNumber(crawlResult.extractedNumericText || crawlResult.rawText);

    // Retrieve previous snapshot to compare
    const existingSnapshots = db.getSnapshots(monitor.id);
    const previousSnapshot = existingSnapshots[0] || null;

    let isMeaningfulChange = false;
    let changePercent = 0;
    let matchedKeywords = [];

    if (!previousSnapshot) {
      // First snapshot ever! Save as baseline
      isMeaningfulChange = true;
      changePercent = 0;
    } else if (previousSnapshot.contentHash !== contentHash) {
      // Hash changed! Now calculate percentage change
      changePercent = calculateChangePercentage(previousSnapshot.cleanedText, cleanedText);

      // Evaluate sensitivity threshold (Requirement 4)
      const userSensitivity = monitor.sensitivity ?? 5;
      if (changePercent < userSensitivity) {
        console.log(`[Scheduler] Change of ${changePercent}% suppressed due to sensitivity threshold (${userSensitivity}%)`);
        db.updateMetrics(m => ({ ...m, noiseAlertsSuppressed: m.noiseAlertsSuppressed + 1 }));
        isMeaningfulChange = false;
      } else {
        isMeaningfulChange = true;
      }

      // Check Keyword-Only Alerts: Trigger if keyword newly appeared
      if (monitor.keywordAlerts && monitor.keywordAlerts.length > 0) {
        const lowerCleaned = cleanedText.toLowerCase();
        const lowerPrev = (previousSnapshot ? previousSnapshot.cleanedText : '').toLowerCase();
        for (const kw of monitor.keywordAlerts) {
          if (kw) {
            const kwLower = kw.toLowerCase().trim();
            if (lowerCleaned.includes(kwLower) && !lowerPrev.includes(kwLower)) {
              matchedKeywords.push(kw.trim());
            }
          }
        }
        // Explicit keyword appearance overrides sensitivity threshold
        if (matchedKeywords.length > 0) {
          console.log(`[Scheduler] Keyword trigger detected: "${matchedKeywords.join(', ')}"! Overriding sensitivity threshold.`);
          isMeaningfulChange = true;
        }
      }

      // Check Numeric shifts: If tracking numbers and the value changed, trigger alert
      if (
        extractedNum !== null &&
        previousSnapshot &&
        previousSnapshot.extractedNumber !== null &&
        extractedNum !== previousSnapshot.extractedNumber
      ) {
        console.log(`[Scheduler] Numeric shift detected (${previousSnapshot.extractedNumber} -> ${extractedNum})! Overriding sensitivity threshold.`);
        isMeaningfulChange = true;
      }
    }

    const nowIso = new Date().toISOString();

    if (isMeaningfulChange) {
      const versionNum = (previousSnapshot ? previousSnapshot.version : 0) + 1;
      const aiSummary = generateAiSummary({
        oldText: previousSnapshot ? previousSnapshot.cleanedText : '',
        newText: cleanedText,
        oldNumber: previousSnapshot ? previousSnapshot.extractedNumber : null,
        newNumber: extractedNum,
        changePercent,
        keywordMatches: matchedKeywords
      });

      const newSnapshot = {
        id: `snap-${monitor.id}-v${versionNum}`,
        monitorId: monitor.id,
        version: versionNum,
        timestamp: nowIso,
        contentHash,
        textSnapshot: crawlResult.rawText,
        cleanedText,
        screenshotUrl: crawlResult.screenshotUrl,
        status: 'OK',
        changePercent,
        aiSummary,
        extractedNumber: extractedNum
      };

      db.addSnapshot(newSnapshot);

      db.updateMonitor(monitor.id, {
        status: 'OK',
        statusReason: `Change detected (v${versionNum}, ${changePercent}% diff)`,
        lastChecked: nowIso,
        lastChanged: nowIso,
        nextCheck: nextCheckIso,
        responseTimeMs: crawlResult.responseTimeMs,
        consecutiveFailures: 0
      });

      // Dispatch alert if not baseline initial check
      if (previousSnapshot) {
        const alertType = matchedKeywords.length > 0 ? 'KEYWORD_TRIGGER' : 'CONTENT_CHANGE';
        await dispatchAlert({
          monitor,
          snapshot: newSnapshot,
          oldSnapshot: previousSnapshot,
          changePercent,
          aiSummary,
          keywordMatches: matchedKeywords,
          alertType
        });
      }
    } else {
      // Content hash unchanged or noise filtered out
      db.updateMonitor(monitor.id, {
        status: 'OK',
        statusReason: 'Checked. No meaningful changes detected.',
        lastChecked: nowIso,
        nextCheck: nextCheckIso,
        responseTimeMs: crawlResult.responseTimeMs,
        consecutiveFailures: 0
      });
    }
  }
}

export const scheduler = new SchedulerQueue();
