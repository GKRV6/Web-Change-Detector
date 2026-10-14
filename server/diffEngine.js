import * as jsdiff from 'diff';
import fs from 'fs';
import path from 'path';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';
import { SCREENSHOTS_DIR } from './db.js';

/**
 * Generate comprehensive text diff between two text versions
 */
export function generateTextDiff(oldText = '', newText = '') {
  const lineDiff = jsdiff.diffLines(oldText, newText);
  const wordDiff = jsdiff.diffWordsWithSpace(oldText, newText);

  let additions = 0;
  let deletions = 0;
  let unchanged = 0;

  for (const part of lineDiff) {
    const lineCount = (part.value.match(/\n/g) || []).length || 1;
    if (part.added) {
      additions += lineCount;
    } else if (part.removed) {
      deletions += lineCount;
    } else {
      unchanged += lineCount;
    }
  }

  // Build unified diff format
  const patch = jsdiff.createTwoFilesPatch(
    'Previous Version',
    'Current Version',
    oldText,
    newText,
    'v-previous',
    'v-current'
  );

  return {
    lineDiff,
    wordDiff,
    patch,
    stats: {
      additions,
      deletions,
      unchanged,
      totalChanges: additions + deletions
    }
  };
}

/**
 * Generate Visual Pixel Diff between two screenshot files
 */
export async function generateVisualDiff(oldScreenshotUrl, newScreenshotUrl) {
  if (!oldScreenshotUrl || !newScreenshotUrl) {
    return {
      available: false,
      reason: 'One or both screenshots not available'
    };
  }

  try {
    const oldFileName = path.basename(oldScreenshotUrl);
    const newFileName = path.basename(newScreenshotUrl);

    const oldFilePath = path.join(SCREENSHOTS_DIR, oldFileName);
    const newFilePath = path.join(SCREENSHOTS_DIR, newFileName);

    if (!fs.existsSync(oldFilePath) || !fs.existsSync(newFilePath)) {
      return {
        available: false,
        reason: 'Screenshot files do not exist on disk'
      };
    }

    const img1 = PNG.sync.read(fs.readFileSync(oldFilePath));
    const img2 = PNG.sync.read(fs.readFileSync(newFilePath));

    const width = Math.min(img1.width, img2.width);
    const height = Math.min(img1.height, img2.height);

    const diff = new PNG({ width, height });

    // Compare with pixelmatch
    const numDiffPixels = pixelmatch(
      img1.data,
      img2.data,
      diff.data,
      width,
      height,
      { threshold: 0.1, diffColor: [255, 122, 41] } // Horizon orange highlight!
    );

    const totalPixels = width * height;
    const diffPercent = Math.round((numDiffPixels / totalPixels) * 10000) / 100;

    const diffFileName = `diff_${Date.now()}_${Math.floor(Math.random() * 1000)}.png`;
    const diffFilePath = path.join(SCREENSHOTS_DIR, diffFileName);

    fs.writeFileSync(diffFilePath, PNG.sync.write(diff));

    return {
      available: true,
      diffScreenshotUrl: `/screenshots/${diffFileName}`,
      numDiffPixels,
      totalPixels,
      diffPercent,
      width,
      height
    };
  } catch (err) {
    console.error('Visual diff generation error:', err);
    return {
      available: false,
      reason: err.message
    };
  }
}

/**
 * Generate an intelligent AI one-line summary of changes
 */
export function generateAiSummary({
  oldText = '',
  newText = '',
  oldNumber = null,
  newNumber = null,
  changePercent = 0,
  keywordMatches = []
}) {
  if (!oldText && newText) {
    return 'Initial baseline snapshot captured. Monitoring active.';
  }

  // Numeric shift
  if (oldNumber !== null && newNumber !== null && oldNumber !== newNumber) {
    const diff = newNumber - oldNumber;
    const pct = Math.round((diff / oldNumber) * 1000) / 10;
    const direction = diff > 0 ? 'increased' : 'dropped';
    return `Numeric value ${direction} from ${oldNumber} to ${newNumber} (${pct > 0 ? '+' : ''}${pct}%).`;
  }

  // Keyword trigger
  if (keywordMatches && keywordMatches.length > 0) {
    return `Alert trigger: keyword "${keywordMatches.join(', ')}" appeared in updated content.`;
  }

  // Diff inspection
  const lineDiff = jsdiff.diffLines(oldText, newText);
  const addedLines = lineDiff
    .filter(p => p.added)
    .map(p => p.value.trim().split('\n')[0])
    .filter(Boolean);
  const removedLines = lineDiff
    .filter(p => p.removed)
    .map(p => p.value.trim().split('\n')[0])
    .filter(Boolean);

  if (addedLines.length > 0 && removedLines.length > 0) {
    const snippetAdd = addedLines[0].slice(0, 50);
    const snippetRem = removedLines[0].slice(0, 50);
    return `Content updated (${changePercent}% diff): replaced "${snippetRem}..." with "${snippetAdd}...".`;
  } else if (addedLines.length > 0) {
    const snippet = addedLines[0].slice(0, 60);
    return `Added new content (${changePercent}% diff): "${snippet}...".`;
  } else if (removedLines.length > 0) {
    const snippet = removedLines[0].slice(0, 60);
    return `Removed content (${changePercent}% diff): "${snippet}...".`;
  }

  return `Page updated with ${changePercent}% textual difference.`;
}
