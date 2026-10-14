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
        '--disable-accelerated-2d-canvas',
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

    // Set standard desktop viewport and polite User-Agent
    await page.setViewport({ width: 1280, height: 800 });
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 HorizonX-Watcher/2.0');

    // Politeness header
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'en-US,en;q=0.9',
      'X-Politeness-Notice': 'Automated change monitoring via HorizonX. For rate inquiries contact operator.'
    });

    let httpStatus = 200;
    let responseHeaders = {};

    try {
      const response = await page.goto(url, {
        waitUntil: 'domcontentloaded',
        timeout: 30000
      });

      if (response) {
        httpStatus = response.status();
        responseHeaders = response.headers();
      }
    } catch (navError) {
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

    // Wait a brief moment for dynamic hydration
    await new Promise(r => setTimeout(r, 600));

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

    // Extract watched text
    let extractedText = '';
    if (watchSelector && watchSelector.trim()) {
      extractedText = await page.evaluate((selector) => {
        try {
          const els = document.querySelectorAll(selector);
          if (els.length === 0) return '';
          return Array.from(els).map(el => el.innerText || el.textContent || '').join('\n');
        } catch (e) {
          return '';
        }
      }, watchSelector.trim());
    }

    // Fallback to body text if selector yielded nothing or was empty
    if (!extractedText || !extractedText.trim()) {
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

    // Take screenshot
    const screenshotFilePath = path.join(SCREENSHOTS_DIR, screenshotName);
    let screenshotUrl = `/screenshots/${screenshotName}`;

    try {
      if (watchSelector && watchSelector.trim()) {
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

    return {
      status: 'OK',
      statusReason: `Successfully checked (${httpStatus} OK, ${extractedText.length} chars)`,
      httpStatus,
      responseTimeMs,
      rawText: extractedText,
      extractedNumericText,
      screenshotUrl,
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
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 25000 });

    const screenshotName = `inspect_${Date.now()}.png`;
    const screenshotPath = path.join(SCREENSHOTS_DIR, screenshotName);
    await page.screenshot({ path: screenshotPath, fullPage: false });

    // Extract salient elements for picker
    const elements = await page.evaluate(() => {
      const candidates = [];
      const tagsToInspect = ['h1', 'h2', 'h3', 'p', 'article', 'section', 'div', 'span', 'button', 'a', 'table', 'li'];

      function getCssSelector(el) {
        if (el.id) return `#${el.id}`;
        let path = [];
        let curr = el;
        while (curr && curr.nodeType === Node.ELEMENT_NODE && path.length < 3) {
          let selector = curr.nodeName.toLowerCase();
          if (curr.className && typeof curr.className === 'string') {
            const firstClass = curr.className.trim().split(/\s+/)[0];
            if (firstClass && !firstClass.includes(':') && !firstClass.includes('[')) {
              selector += `.${firstClass}`;
            }
          }
          path.unshift(selector);
          curr = curr.parentElement;
        }
        return path.join(' > ');
      }

      for (const tag of tagsToInspect) {
        const nodes = document.querySelectorAll(tag);
        for (let i = 0; i < Math.min(nodes.length, 12); i++) {
          const el = nodes[i];
          const rect = el.getBoundingClientRect();
          const text = (el.innerText || el.textContent || '').trim();

          // Only keep visible elements with meaningful size
          if (rect.width > 20 && rect.height > 12 && rect.top < 1200 && text.length > 2) {
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
