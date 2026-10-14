const BASE_URL = '';

export async function fetchMonitors() {
  const res = await fetch(`${BASE_URL}/api/monitors`);
  return res.json();
}

export async function fetchMonitor(id) {
  const res = await fetch(`${BASE_URL}/api/monitors/${id}`);
  return res.json();
}

export async function createMonitor(data) {
  const res = await fetch(`${BASE_URL}/api/monitors`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function updateMonitor(id, data) {
  const res = await fetch(`${BASE_URL}/api/monitors/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function deleteMonitor(id) {
  const res = await fetch(`${BASE_URL}/api/monitors/${id}`, {
    method: 'DELETE'
  });
  return res.json();
}

export async function triggerCheck(id) {
  const res = await fetch(`${BASE_URL}/api/monitors/${id}/check`, {
    method: 'POST'
  });
  return res.json();
}

export async function toggleMonitor(id) {
  const res = await fetch(`${BASE_URL}/api/monitors/${id}/toggle`, {
    method: 'POST'
  });
  return res.json();
}

export async function fetchSnapshots(id) {
  const res = await fetch(`${BASE_URL}/api/monitors/${id}/snapshots`);
  return res.json();
}

export async function fetchDiff(id, v1, v2) {
  let url = `${BASE_URL}/api/monitors/${id}/diff`;
  const params = [];
  if (v1) params.push(`v1=${encodeURIComponent(v1)}`);
  if (v2) params.push(`v2=${encodeURIComponent(v2)}`);
  if (params.length > 0) url += `?${params.join('&')}`;
  const res = await fetch(url);
  return res.json();
}

export async function inspectUrl(url) {
  const res = await fetch(`${BASE_URL}/api/picker/inspect`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url })
  });
  return res.json();
}

export async function fetchAlerts() {
  const res = await fetch(`${BASE_URL}/api/alerts`);
  return res.json();
}

export async function fetchQueueStatus() {
  const res = await fetch(`${BASE_URL}/api/queue`);
  return res.json();
}

export async function testWebhook(webhookUrl) {
  const res = await fetch(`${BASE_URL}/api/test-webhook`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ webhookUrl })
  });
  return res.json();
}

export async function runCaptchaTest(isCaptcha) {
  const res = await fetch(`${BASE_URL}/api/simulator/captcha-test`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ isCaptcha })
  });
  return res.json();
}

export async function runDedupTest(watchersCount) {
  const res = await fetch(`${BASE_URL}/api/simulator/dedup-test`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ watchersCount })
  });
  return res.json();
}

export async function runNoiseTest(rawText, customRegex) {
  const res = await fetch(`${BASE_URL}/api/simulator/noise-test`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ rawText, customRegex })
  });
  return res.json();
}

export async function runRateLimitTest(queuedRequests) {
  const res = await fetch(`${BASE_URL}/api/simulator/rate-limit-test`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ queuedRequests })
  });
  return res.json();
}
