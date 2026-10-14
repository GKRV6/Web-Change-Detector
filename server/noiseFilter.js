import crypto from 'crypto';

// Standard dynamic noise patterns to strip
const DEFAULT_NOISE_PATTERNS = [
  // ISO and UTC timestamps: 2026-10-15T00:21:20Z, 2026-10-15 12:30:45
  /\b\d{4}-\d{2}-\d{2}[T\s]\d{2}:\d{2}(:\d{2})?(\.\d+)?(Z|[+-]\d{2}:?\d{2})?\b/gi,
  // Common time formats: 12:45:00 PM, 04:30 AM, 18:22
  /\b\d{1,2}:\d{2}(:\d{2})?\s*(AM|PM|am|pm)?\s*(UTC|PST|EST|GMT|IST|CST)?\b/gi,
  // Relative time: "3 minutes ago", "just now", "yesterday at 4pm", "in 2 hours"
  /\b(just now|a moment ago|\d+\s*(secs?|seconds?|mins?|minutes?|hrs?|hours?|days?|weeks?|months?|years?)\s*ago)\b/gi,
  // Date formats like: "Oct 15, 2026", "15 October 2026", "October 15"
  /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{1,2}(st|nd|rd|th)?,?\s*(\d{4})?\b/gi,
  /\b\d{1,2}\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*,?\s*(\d{4})?\b/gi,
  // Live counters: "42 people viewing", "1,203 views", "5 online"
  /\b\d+[\d,.]*\s*(views?|watching|viewers?|readers?|users?|online|active)\b/gi,
  // Session tokens, nonces, CSRF: nonce="abc1234", csrf_token="xyz"
  /(csrf[-_]?token|nonce|session[-_]?id|auth[-_]?token|cache[-_]?bust|v)=["']?[a-zA-Z0-9_\-\.]{8,}["']?/gi,
  // Analytics / tracking parameters: _ga=123, utm_source=abc
  /(\?|&)(utm_[a-z]+|_ga|_gid|_gl|fbclid|gclid)=[a-zA-Z0-9_\-\.%]+/gi,
  // Generic hex hashes: 32+ char hex strings often used for bundle hashes or tracking
  /\b[0-9a-fA-F]{24,64}\b/g,
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

  // Normalize excessive whitespace, tabs, and newlines
  cleaned = cleaned
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
 * Calculate change percentage (0% = identical, 100% = completely different)
 */
export function calculateChangePercentage(textA, textB) {
  const similarity = calculateSimilarity(textA, textB);
  const diffPercent = Math.round((1 - similarity) * 1000) / 10;
  return Math.max(0, Math.min(100, diffPercent));
}

/**
 * Extract number (e.g. price, stock count, rank) from string
 */
export function extractNumber(text) {
  if (!text) return null;
  // Match currency or decimal or integer: $1,999.00 or 49.99 or 42
  const match = text.match(/[\$€£¥]?\s*([0-9]{1,3}(?:,[0-9]{3})*(?:\.[0-9]+)?|[0-9]+(?:\.[0-9]+)?)/);
  if (match && match[1]) {
    const cleanNum = match[1].replace(/,/g, '');
    const num = parseFloat(cleanNum);
    return isNaN(num) ? null : num;
  }
  return null;
}
