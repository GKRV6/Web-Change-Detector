import crypto from 'crypto';
import * as jsdiff from 'diff';

// Standard dynamic noise patterns to strip
const DEFAULT_NOISE_PATTERNS = [
  // ISO and UTC timestamps: 2026-10-15T00:21:20Z, 2026-10-15 12:30:45
  /\b\d{4}-\d{2}-\d{2}[T\s]\d{2}:\d{2}(:\d{2})?(\.\d+)?(Z|[+-]\d{2}:?\d{2})?\b/gi,
  // Common time formats: 12:45:00 PM, 04:30 AM, 18:22:15
  /\b\d{1,2}:\d{2}(:\d{2})?\s*(AM|PM|am|pm)?\s*(UTC|PST|EST|GMT|IST|CST|EDT|PDT)?\b/gi,
  // Relative time variations: "3 minutes ago", "just now", "yesterday at 4pm", "5m ago", "2h ago", "in 2 hours"
  /\b(just now|a moment ago|\d+\s*(s|sec|secs|seconds?|m|min|mins|minutes?|h|hr|hrs|hours?|d|days?|w|wk|wks|weeks?|mo|mos|months?|y|yr|yrs|years?)\s*ago)\b/gi,
  // Countdown clocks: "ends in 03:14:22", "expires in 5 hours"
  /\b(ends|expires|sale ends|starts)\s*(in|within)?\s*\d+\s*(hours?|minutes?|days?|hrs?|mins?|secs?)\b/gi,
  // Date formats: "Oct 15, 2026", "15 October 2026", "October 15"
  /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{1,2}(st|nd|rd|th)?,?\s*(\d{4})?\b/gi,
  /\b\d{1,2}\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*,?\s*(\d{4})?\b/gi,
  // Live counters: "42 people viewing", "1,203 views", "5 online", "Live viewers: 14 watching"
  /\b(?:(?:live\s+)?(?:viewers?|views?|watching):\s*)?\d+[\d,.]*\s*(views?|watching|viewers?|readers?|users?|online|active|reading now|in cart)\b/gi,
  // Update/modified prefixes: "Last updated:", "Modified:", "Posted at:"
  /\b(?:last\s+)?(?:updated|modified|posted|checked|published):\s*/gi,
  // Cookie notices and banner boilerplate
  /\b(we use cookies|cookie policy|manage cookies|accept all cookies|privacy preferences|strictly necessary cookies|by clicking accept)\b/gi,
  // Sponsored & ad labels
  /\b(sponsored|advertisement|promoted by|ad info)\b/gi,
  // ASP.NET ViewState, EventValidation, CSRF tokens
  /(__VIEWSTATE|__EVENTVALIDATION|__VIEWSTATEGENERATOR|csrf[-_]?token|nonce|session[-_]?id|auth[-_]?token|cache[-_]?bust|v)=["']?[a-zA-Z0-9_\-\.+=/]{8,}["']?/gi,
  // Analytics / tracking parameters: _ga=123, utm_source=abc, fbclid=...
  /(\?|&)(utm_[a-z]+|_ga|_gid|_gl|fbclid|gclid|mc_cid|mc_eid)=[a-zA-Z0-9_\-\.%]+/gi,
  // Generic hex hashes: 24+ char hex strings often used for bundle hashes or tracking nonces
  /\b[0-9a-fA-F]{24,64}\b/g,
  // Browser deprecation and update warnings
  /(?:This browser version is no longer supported|Please upgrade to a supported browser|Your browser is not supported)[^\n.]*[.\n]?/gi,
  // Web app dynamic transient saving / sync notices (Google Docs, Office 365, Notion)
  /\b(Saved to Drive|Saving\.\.\.|Document status:[^\n]*|All changes saved in Drive)\b/gi,
  // Screen reader shortcut and accessibility tooltips
  /(?:Turn on screen reader support|To enable screen reader support[^\n.]*)/gi,
  // Transient loading indicators
  /\b(Loading\.\.\.|Please wait\.\.\.|Loading content|Fetching data)\b/gi,
  // Copyright footers: © 2026 Company Inc.
  /(©|\(c\)|copyright)\s*\d{4}/gi
];

/**
 * Clean text by stripping default and custom noise patterns
 */
export function cleanText(rawText, customRegexStrings = []) {
  if (!rawText) return '';
  let cleaned = rawText;

  // Apply default noise patterns
  for (const pattern of DEFAULT_NOISE_PATTERNS) {
    cleaned = cleaned.replace(pattern, ' ');
  }

  // Apply custom user-defined regexes
  if (Array.isArray(customRegexStrings)) {
    for (const regexStr of customRegexStrings) {
      if (!regexStr || typeof regexStr !== 'string') continue;
      try {
        const customRegex = new RegExp(regexStr, 'gi');
        cleaned = cleaned.replace(customRegex, ' ');
      } catch (err) {
        console.warn(`Invalid custom regex: "${regexStr}"`, err.message);
      }
    }
  }

  // Normalize excessive whitespace, tabs, and unicode spaces
  cleaned = cleaned
    .replace(/[\u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff]/g, ' ')
    .replace(/[\u200b-\u200d\u2060]/g, '')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n\s*\n+/g, '\n')
    .trim();

  return cleaned;
}

/**
 * Generate SHA-256 hash of cleaned text
 */
export function computeContentHash(text) {
  return crypto.createHash('sha256').update(text || '').digest('hex');
}

/**
 * Tokenize text into words/symbols for similarity comparison
 */
function tokenize(text) {
  return (text || '')
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(Boolean);
}

/**
 * Calculate Jaccard / Token similarity between two texts (0.0 to 1.0)
 */
export function calculateSimilarity(textA, textB) {
  if (textA === textB) return 1.0;
  if (!textA || !textB) return 0.0;

  const tokensA = new Set(tokenize(textA));
  const tokensB = new Set(tokenize(textB));

  if (tokensA.size === 0 && tokensB.size === 0) return 1.0;
  if (tokensA.size === 0 || tokensB.size === 0) return 0.0;

  let intersectionCount = 0;
  for (const token of tokensA) {
    if (tokensB.has(token)) {
      intersectionCount++;
    }
  }

  const unionCount = tokensA.size + tokensB.size - intersectionCount;
  return unionCount === 0 ? 1.0 : intersectionCount / unionCount;
}

/**
 * Sequence-aware change percentage calculation (0% = identical, 100% = completely different)
 * Combines word-level sequence diffing with total word count for maximum accuracy.
 */
export function calculateChangePercentage(textA = '', textB = '') {
  if (textA === textB) return 0;
  if (!textA || !textB) return 100;

  const wordsA = textA.trim().split(/\s+/).filter(Boolean);
  const wordsB = textB.trim().split(/\s+/).filter(Boolean);

  if (wordsA.length === 0 && wordsB.length === 0) return 0;
  if (wordsA.length === 0 || wordsB.length === 0) return 100;

  try {
    const diff = jsdiff.diffWords(textA, textB);
    let numAdded = 0;
    let numRemoved = 0;

    for (const part of diff) {
      if (part.added) {
        numAdded += part.value.trim().split(/\s+/).filter(Boolean).length;
      } else if (part.removed) {
        numRemoved += part.value.trim().split(/\s+/).filter(Boolean).length;
      }
    }

    const totalWordEdits = Math.max(numAdded, numRemoved);
    const maxWords = Math.max(wordsA.length, wordsB.length);
    const pct = Math.round((totalWordEdits / maxWords) * 1000) / 10;
    return Math.min(100, Math.max(0, pct));
  } catch (e) {
    // Graceful fallback to token similarity if diff fails
    const similarity = calculateSimilarity(textA, textB);
    return Math.round((1 - similarity) * 1000) / 10;
  }
}

/**
 * Extract number (e.g. price, stock count, rank, percentage) from string
 * Supports international currencies ($, €, £, ¥, ₹), percentages, negative numbers, and comma decimals.
 */
export function extractNumber(text) {
  if (!text) return null;

  // 1. High priority: explicit financial currency ($1,999.00, €49.99, £10, ¥500, ₹2,499)
  const currencyMatch = text.match(/[\$€£¥₹]\s*(-?[0-9]{1,3}(?:,[0-9]{3})*(?:\.[0-9]+)?|-?[0-9]+(?:\.[0-9]+)?)/);
  if (currencyMatch && currencyMatch[1]) {
    const cleanNum = currencyMatch[1].replace(/,/g, '');
    const num = parseFloat(cleanNum);
    if (!isNaN(num)) return num;
  }

  // 2. High priority: explicit percentage (e.g. 24.5%, -10%)
  const pctMatch = text.match(/(-?[0-9]+(?:\.[0-9]+)?)\s*%/);
  if (pctMatch && pctMatch[1]) {
    const num = parseFloat(pctMatch[1]);
    if (!isNaN(num)) return num;
  }

  // 3. Fallback: general numeric values (integers, floats, negative numbers)
  const generalMatch = text.match(/(-?[0-9]{1,3}(?:,[0-9]{3})*(?:\.[0-9]+)?|-?[0-9]+(?:\.[0-9]+)?)/);
  if (generalMatch && generalMatch[1]) {
    const cleanNum = generalMatch[1].replace(/,/g, '');
    const num = parseFloat(cleanNum);
    return isNaN(num) ? null : num;
  }

  return null;
}

