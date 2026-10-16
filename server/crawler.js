import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';
import { SCREENSHOTS_DIR } from './db.js';

// Search candidate paths for Chrome or Edge
const BROWSER_EXECUTABLE_CANDIDATES = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium-browser'
];

function getBrowserExecutable() {
  for (const p of BROWSER_EXECUTABLE_CANDIDATES) {
    if (fs.existsSync(p)) {
      return p;
    }
  }
  return null;
}

let browserInstance = null;

async function getBrowser() {
  const executablePath = getBrowserExecutable();
  if (!executablePath) {
    throw new Error('No local Chrome or Edge browser executable found.');
  }

  if (!browserInstance || !browserInstance.isConnected()) {
    browserInstance = await puppeteer.launch({
      executablePath,
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-blink-features=AutomationControlled',
        '--disable-gpu',
        '--window-size=1280,800'
      ]
    });
  }
  return browserInstance;
}

// Signatures indicating Anti-bot or CAPTCHA walls
const CAPTCHA_SIGNATURES = [
  'just a moment...',
  'attention required! | cloudflare',
  'cf-turnstile',
  'cf-challenge',
  'please verify you are a human',
  'verify you are human',
  'access denied | error 1020',
  'captcha-delivery',
  'datadome',
  'perimeterx'
];

/**
 * Fetch and render a web page using headless browser
 */
export async function crawlPage({
  url,
  watchSelector = '',
  ignoreSelectors = [],
  numberSelector = '',
  screenshotName = `snap_${Date.now()}.png`
}) {
  const startTime = Date.now();
  let page = null;

  try {
    const browser = await getBrowser();
    page = await browser.newPage();

    // Stealth: Remove navigator.webdriver flag
    await page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
    });

    // Set standard desktop viewport and modern Chrome User-Agent
    await page.setViewport({ width: 1280, height: 800 });
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36');

    // Politeness header
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'en-US,en;q=0.9',
      'X-Politeness-Notice': 'Automated change monitoring via HorizonX. For rate inquiries contact operator.'
    });

    let httpStatus = 200;
    let responseHeaders = {};

    try {
      // First attempt networkidle2 with a timeout fallback for dynamic SPAs
      const response = await page.goto(url, {
        waitUntil: ['domcontentloaded', 'networkidle2'],
        timeout: 25000
      });

      if (response) {
        httpStatus = response.status();
        responseHeaders = response.headers();
      }
    } catch (navError) {
      // If networkidle2 timed out, check if DOM content loaded anyway
      const hasBody = await page.evaluate(() => !!document.body).catch(() => false);
      if (!hasBody) {
        const responseTimeMs = Date.now() - startTime;
        return {
          status: 'ERROR',
          statusReason: `Navigation Outage: ${navError.message}`,
          httpStatus: 0,
          responseTimeMs,
          rawText: '',
          screenshotUrl: null,
          isCaptcha: false,
          isOutage: true
        };
      }
      // Page loaded partially or had ongoing streaming connections; proceed safely
    }

    const responseTimeMs = Date.now() - startTime;

    // Check for 5xx Server Outages
    if (httpStatus >= 500) {
      return {
        status: 'ERROR',
        statusReason: `Target Site Server Outage (HTTP ${httpStatus})`,
        httpStatus,
        responseTimeMs,
        rawText: '',
        screenshotUrl: null,
        isCaptcha: false,
        isOutage: true
      };
    }

    // Evaluate page content for CAPTCHA / Cloudflare blocks
    const pageTitle = await page.title();
    const pageHtml = await page.content();
    const lowerHtml = (pageHtml + ' ' + pageTitle).toLowerCase();

    const isCaptchaBlocked = CAPTCHA_SIGNATURES.some(sig => lowerHtml.includes(sig)) || httpStatus === 403;

    if (isCaptchaBlocked) {
      return {
        status: 'BLOCKED',
        statusReason: `Anti-bot / CAPTCHA challenge wall detected (HTTP ${httpStatus}). Diff alert suppressed.`,
        httpStatus,
        responseTimeMs,
        rawText: '',
        screenshotUrl: null,
        isCaptcha: true,
        isOutage: false
      };
    }

    // Wait for fonts to finish loading to prevent layout shifts
    await page.evaluate(() => (document.fonts ? document.fonts.ready : Promise.resolve())).catch(() => {});

    // Stabilization delay for dynamic client hydration (React/Vue/Angular/Canvas)
    await new Promise(r => setTimeout(r, 1000));

    // If watchSelector is defined, wait specifically for it to mount (up to 6s)
    if (watchSelector && watchSelector.trim()) {
      try {
        await page.waitForSelector(watchSelector.trim(), { timeout: 6000 });
      } catch (e) {
        // Selector may be missing or dynamic; evaluate below
      }
    }

    // Remove ignoreSelectors from DOM before text extraction
    if (Array.isArray(ignoreSelectors) && ignoreSelectors.length > 0) {
      await page.evaluate((selectors) => {
        for (const sel of selectors) {
          if (!sel) continue;
          try {
            const elements = document.querySelectorAll(sel);
            elements.forEach(el => el.remove());
          } catch (e) {}
        }
      }, ignoreSelectors);
    }

    // Extract watched text with precision (DO NOT fallback to body if watchSelector was specified)
    let extractedText = '';
    let selectorFound = true;

    if (watchSelector && watchSelector.trim()) {
      const result = await page.evaluate((selector) => {
        try {
          const els = document.querySelectorAll(selector);
          if (els.length === 0) return { found: false, text: '' };
          const text = Array.from(els)
            .map(el => el.innerText || el.textContent || '')
            .join('\n')
            .trim();
          return { found: true, text };
        } catch (e) {
          return { found: false, text: '', error: e.message };
        }
      }, watchSelector.trim());

      selectorFound = result.found;
      extractedText = result.text || '';
    } else {
      // Default to document body text only when no specific selector was configured
      extractedText = await page.evaluate(() => {
        return document.body ? (document.body.innerText || document.body.textContent || '') : '';
      });
    }

    // Extract numeric selector if specified
    let extractedNumericText = '';
    if (numberSelector && numberSelector.trim()) {
      extractedNumericText = await page.evaluate((selector) => {
        try {
          const el = document.querySelector(selector);
          return el ? (el.innerText || el.textContent || '') : '';
        } catch (e) {
          return '';
        }
      }, numberSelector.trim());
    }

    // Take screenshot (clipped to watched element if present)
    const screenshotFilePath = path.join(SCREENSHOTS_DIR, screenshotName);
    let screenshotUrl = `/screenshots/${screenshotName}`;

    try {
      if (watchSelector && watchSelector.trim() && selectorFound) {
        const el = await page.$(watchSelector.trim());
        if (el) {
          await el.screenshot({ path: screenshotFilePath });
        } else {
          await page.screenshot({ path: screenshotFilePath, fullPage: false });
        }
      } else {
        await page.screenshot({ path: screenshotFilePath, fullPage: false });
      }
    } catch (ssErr) {
      console.warn('Screenshot capture fallback:', ssErr.message);
      screenshotUrl = null;
    }

    let status = 'OK';
    let statusReason = `Successfully checked (${httpStatus} OK, ${extractedText.length} chars)`;

    if (watchSelector && watchSelector.trim() && !selectorFound) {
      status = 'WARNING';
      statusReason = `Watched selector "${watchSelector.trim()}" not found on page.`;
    }

    return {
      status,
      statusReason,
      httpStatus,
      responseTimeMs,
      rawText: extractedText,
      extractedNumericText,
      screenshotUrl,
      selectorFound,
      isCaptcha: false,
      isOutage: false
    };
  } catch (error) {
    return {
      status: 'ERROR',
      statusReason: `Crawler Error: ${error.message}`,
      httpStatus: 0,
      responseTimeMs: Date.now() - startTime,
      rawText: '',
      screenshotUrl: null,
      selectorFound: false,
      isCaptcha: false,
      isOutage: true
    };
  } finally {
    if (page) {
      try {
        await page.close();
      } catch (e) {}
    }
  }
}

/**
 * Inspect page elements for the Visual Selector Picker
 */
export async function inspectPageElements(url) {
  let page = null;
  try {
    const browser = await getBrowser();
    page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 750 });
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36');
    await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle2'], timeout: 25000 }).catch(() => {});

    // Allow hydration and fonts
    await page.evaluate(() => (document.fonts ? document.fonts.ready : Promise.resolve())).catch(() => {});
    await new Promise(r => setTimeout(r, 800));

    const screenshotName = `inspect_${Date.now()}.png`;
    const screenshotPath = path.join(SCREENSHOTS_DIR, screenshotName);
    await page.screenshot({ path: screenshotPath, fullPage: false });

    // Extract salient elements for picker with resilient CSS selector generation
    const elements = await page.evaluate(() => {
      const candidates = [];
      const tagsToInspect = ['h1', 'h2', 'h3', 'h4', 'p', 'article', 'section', 'div', 'span', 'button', 'a', 'table', 'li'];

      function getCssSelector(el) {
        // 1. High-priority data attributes
        const testAttrs = ['data-testid', 'data-test-id', 'data-qa', 'data-cy', 'itemprop', 'name', 'aria-label'];
        for (const attr of testAttrs) {
          const val = el.getAttribute(attr);
          if (val && typeof val === 'string' && val.trim().length > 0 && val.length < 50) {
            return `[${attr}="${val.replace(/"/g, '\\"')}"]`;
          }
        }

        // 2. Stable ID (filter out dynamic framework IDs)
        if (el.id && typeof el.id === 'string') {
          const id = el.id.trim();
          const isDynamicId = /^[a-z0-9_-]*\d{4,}[a-z0-9_-]*$/i.test(id) ||
                              /^(:|radix|react|headlessui|ember|uid-|__)/i.test(id) ||
                              id.length > 40;
          if (!isDynamicId) {
            return `#${id}`;
          }
        }

        // 3. Hierarchical path avoiding utility and hashed classes
        let path = [];
        let curr = el;
        while (curr && curr.nodeType === Node.ELEMENT_NODE && curr !== document.body && curr !== document.documentElement && path.length < 4) {
          let nodeSelector = curr.nodeName.toLowerCase();

          if (curr.className && typeof curr.className === 'string') {
            const classes = curr.className.trim().split(/\s+/).filter(cls => {
              if (!cls) return false;
              if (cls.includes(':') || cls.includes('[') || cls.includes('/') || cls.includes('\\')) return false;
              // Ignore tailwind / utility patterns
              if (/^(p|m|px|py|pt|pb|pl|pr|mx|my|mt|mb|ml|mr|w|h|min-w|min-h|max-w|max-h|flex|grid|gap|space|text|bg|border|rounded|inline|block|hidden|relative|absolute|fixed|sticky|items|justify|self|opacity|overflow|transition|duration|ease|cursor|leading|tracking|font|shadow|z)-\S+/i.test(cls)) return false;
              // Ignore random hashes like css-123xyz or _3x8d9
              if (/^[a-z]{1,4}-[a-z0-9]{5,}$/i.test(cls) || /^_[a-z0-9]{5,}$/i.test(cls)) return false;
              return true;
            });

            if (classes.length > 0) {
              nodeSelector += `.${classes[0]}`;
            }
          }

          if (!nodeSelector.includes('.')) {
            const siblings = Array.from(curr.parentElement ? curr.parentElement.children : []).filter(c => c.nodeName === curr.nodeName);
            if (siblings.length > 1) {
              const index = siblings.indexOf(curr) + 1;
              nodeSelector += `:nth-of-type(${index})`;
            }
          }

          path.unshift(nodeSelector);
          curr = curr.parentElement;
        }

        return path.length > 0 ? path.join(' > ') : el.nodeName.toLowerCase();
      }

      for (const tag of tagsToInspect) {
        const nodes = document.querySelectorAll(tag);
        for (let i = 0; i < Math.min(nodes.length, 15); i++) {
          const el = nodes[i];
          const rect = el.getBoundingClientRect();
          const text = (el.innerText || el.textContent || '').trim();

          // Only keep visible elements with meaningful dimensions
          if (rect.width > 24 && rect.height > 14 && rect.top >= 0 && rect.top < 1500 && text.length > 2) {
            candidates.push({
              tag,
              selector: getCssSelector(el),
              text: text.slice(0, 100),
              rect: {
                x: Math.round(rect.x),
                y: Math.round(rect.y),
                width: Math.round(rect.width),
                height: Math.round(rect.height)
              }
            });
          }
        }
      }
      return candidates.slice(0, 30);
    });

    return {
      success: true,
      url,
      screenshotUrl: `/screenshots/${screenshotName}`,
      elements
    };
  } catch (err) {
    return {
      success: false,
      error: err.message
    };
  } finally {
    if (page) {
      try {
        await page.close();
      } catch (e) {}
    }
  }
}
