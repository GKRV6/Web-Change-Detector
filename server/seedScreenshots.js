import fs from 'fs';
import path from 'path';
import { PNG } from 'pngjs';
import { SCREENSHOTS_DIR } from './db.js';

function createDummyPng(filePath, colorHex, accentHex, textLabel = '') {
  const width = 800;
  const height = 500;
  const png = new PNG({ width, height });

  // Parse color hex
  const r = parseInt(colorHex.slice(1, 3), 16);
  const g = parseInt(colorHex.slice(3, 5), 16);
  const b = parseInt(colorHex.slice(5, 7), 16);

  const ar = parseInt(accentHex.slice(1, 3), 16);
  const ag = parseInt(accentHex.slice(3, 5), 16);
  const ab = parseInt(accentHex.slice(5, 7), 16);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (width * y + x) << 2;

      // Header bar
      if (y < 60) {
        png.data[idx] = ar;
        png.data[idx + 1] = ag;
        png.data[idx + 2] = ab;
        png.data[idx + 3] = 255;
      }
      // Content boxes
      else if (y > 90 && y < 200 && x > 60 && x < width - 60) {
        // Main card
        png.data[idx] = Math.min(255, r + 25);
        png.data[idx + 1] = Math.min(255, g + 25);
        png.data[idx + 2] = Math.min(255, b + 35);
        png.data[idx + 3] = 255;
      }
      else if (y > 230 && y < 340 && x > 60 && x < width - 60) {
        // Second card
        png.data[idx] = Math.min(255, r + 20);
        png.data[idx + 1] = Math.min(255, g + 20);
        png.data[idx + 2] = Math.min(255, b + 30);
        png.data[idx + 3] = 255;
      }
      // Grid pattern
      else if ((x % 40 === 0 || y % 40 === 0) && y > 60) {
        png.data[idx] = Math.min(255, r + 15);
        png.data[idx + 1] = Math.min(255, g + 15);
        png.data[idx + 2] = Math.min(255, b + 20);
        png.data[idx + 3] = 255;
      }
      else {
        // Background
        png.data[idx] = r;
        png.data[idx + 1] = g;
        png.data[idx + 2] = b;
        png.data[idx + 3] = 255;
      }
    }
  }

  fs.writeFileSync(filePath, PNG.sync.write(png));
  console.log(`Created seed screenshot: ${filePath}`);
}

export function generateSeedScreenshots() {
  if (!fs.existsSync(SCREENSHOTS_DIR)) {
    fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
  }

  createDummyPng(path.join(SCREENSHOTS_DIR, 'mock-hn-v1.png'), '#0A0F1D', '#FF6600');
  createDummyPng(path.join(SCREENSHOTS_DIR, 'mock-hn-v2.png'), '#0A0F1D', '#FF7A29');
  createDummyPng(path.join(SCREENSHOTS_DIR, 'mock-gpu-v1.png'), '#090D1A', '#10B981');
  createDummyPng(path.join(SCREENSHOTS_DIR, 'mock-gpu-v2.png'), '#090D1A', '#F59E0B');
  createDummyPng(path.join(SCREENSHOTS_DIR, 'mock-gpu-v3.png'), '#090D1A', '#FF7A29');
}

generateSeedScreenshots();
