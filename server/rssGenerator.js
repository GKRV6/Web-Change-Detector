function escapeXml(unsafe) {
  if (!unsafe) return '';
  return String(unsafe).replace(/[<>&'"]/g, c => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
    }
  });
}

/**
 * Generate standard RSS 2.0 XML for a given monitor and its snapshots
 */
export function generateRssFeed(monitor, snapshots = []) {
  const channelTitle = escapeXml(`HorizonX Feed — ${monitor.name}`);
  const channelLink = escapeXml(monitor.url);
  const channelDesc = escapeXml(`Automated web change intelligence feed for ${monitor.name} (${monitor.url}) powered by HorizonX.`);
  const pubDate = new Date().toUTCString();

  const itemsXml = snapshots.map(snap => {
    const itemTitle = escapeXml(`Version ${snap.version} Change (${snap.changePercent}% diff)`);
    const itemLink = escapeXml(monitor.url);
    const itemGuid = escapeXml(snap.id);
    const itemDate = new Date(snap.timestamp).toUTCString();
    const itemDesc = escapeXml(
      `Summary: ${snap.aiSummary || 'Content modified'}\n\n` +
      `Change Magnitude: ${snap.changePercent}%\n` +
      `SHA-256: ${snap.contentHash}\n` +
      (snap.extractedNumber ? `Numeric Value: ${snap.extractedNumber}\n` : '') +
      `Timestamp: ${snap.timestamp}`
    );

    return `
    <item>
      <title>${itemTitle}</title>
      <link>${itemLink}</link>
      <guid isPermaLink="false">${itemGuid}</guid>
      <pubDate>${itemDate}</pubDate>
      <description>${itemDesc}</description>
    </item>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${channelTitle}</title>
    <link>${channelLink}</link>
    <description>${channelDesc}</description>
    <language>en-us</language>
    <pubDate>${pubDate}</pubDate>
    <generator>HorizonX Change Intelligence v2.0</generator>
    ${itemsXml}
  </channel>
</rss>`;
}
