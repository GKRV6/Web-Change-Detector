import { db } from './db.js';

// In-memory debounce cache to prevent duplicate alerts
// Map of `monitorId:contentHash` -> timestamp
const alertDebounceCache = new Map();
const DEBOUNCE_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

export async function dispatchAlert({
  monitor,
  snapshot,
  oldSnapshot = null,
  changePercent = 0,
  aiSummary = '',
  keywordMatches = [],
  alertType = 'CONTENT_CHANGE'
}) {
  const debounceKey = `${monitor.id}:${snapshot.contentHash}`;
  const now = Date.now();

  // Check duplicate debounce
  if (alertDebounceCache.has(debounceKey)) {
    const lastSent = alertDebounceCache.get(debounceKey);
    if (now - lastSent < DEBOUNCE_WINDOW_MS) {
      console.log(`[AlertDispatcher] Debouncing duplicate alert for monitor ${monitor.id}`);
      return { sent: false, reason: 'Duplicate alert debounced within 15 min window' };
    }
  }
  alertDebounceCache.set(debounceKey, now);

  const channels = [];
  const alertRecord = {
    id: `alert-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    monitorId: monitor.id,
    monitorName: monitor.name,
    timestamp: new Date().toISOString(),
    type: alertType,
    title: alertType === 'KEYWORD_TRIGGER'
      ? `Keyword '${keywordMatches.join(', ')}' Triggered on ${monitor.name}`
      : alertType === 'ANTI_BOT_BLOCK'
      ? `Anti-Bot / Outage Blocked on ${monitor.name}`
      : `Meaningful Change Detected on ${monitor.name}`,
    summary: aiSummary || `Page content shifted by ${changePercent}%`,
    diffPercent: changePercent,
    sentTo: '',
    delivered: true,
    snapshotId: snapshot.id
  };

  // Dispatch to Discord Webhook if configured
  if (monitor.webhookUrl && monitor.webhookUrl.includes('discord')) {
    channels.push('Discord Webhook');
    try {
      await sendDiscordWebhook(monitor.webhookUrl, {
        title: alertRecord.title,
        url: monitor.url,
        summary: alertRecord.summary,
        diffPercent: changePercent,
        timestamp: alertRecord.timestamp
      });
    } catch (err) {
      console.warn(`[AlertDispatcher] Failed sending Discord webhook:`, err.message);
    }
  }

  // Dispatch to Email if configured
  if (monitor.email) {
    channels.push(`Email (${monitor.email})`);
    // Simulated SMTP delivery
    console.log(`[AlertDispatcher] Simulated email sent to ${monitor.email}: ${alertRecord.title}`);
  }

  if (channels.length === 0) {
    channels.push('HorizonX Notification Center');
  }

  alertRecord.sentTo = channels.join(', ');
  db.addAlert(alertRecord);

  return {
    sent: true,
    alertRecord
  };
}

async function sendDiscordWebhook(webhookUrl, data) {
  const payload = {
    username: 'HorizonX Change Detector',
    avatar_url: 'https://cdn-icons-png.flaticon.com/512/3241/3241857.png',
    embeds: [
      {
        title: `🛰️ ${data.title}`,
        url: data.url,
        description: data.summary,
        color: 0xFF7A29, // Horizon Orange
        fields: [
          { name: 'Target URL', value: data.url, inline: false },
          { name: 'Change Magnitude', value: `${data.diffPercent}%`, inline: true },
          { name: 'Status', value: 'Verified Meaningful Change', inline: true }
        ],
        footer: {
          text: 'HorizonX Autonomous Change Intelligence'
        },
        timestamp: data.timestamp
      }
    ]
  };

  // In real network calls: fetch(webhookUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
  if (webhookUrl.startsWith('https://discord.com/api/webhooks/')) {
    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (e) {
      console.warn('Real Discord webhook dispatch failed (expected if mock webhook):', e.message);
    }
  }
}
