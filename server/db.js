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
  monitors: [],
  snapshots: [],
  alerts: [],
  systemMetrics: {
    totalChecksPerformed: 0,
    coalescedRequestsSaved: 0,
    noiseAlertsSuppressed: 0,
    activeMonitorsCount: 0,
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
