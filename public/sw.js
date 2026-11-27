// Inner Calm service worker.
// 1. Keeps Gilbert Grimeau's audio guides on the phone once a person has started one (the clinic's wifi is weak).
//    The page downloads a guide into the cache the first time it is played (see cacheAudio in app.js); from then on
//    every request for that file, including the "Range" requests audio players make, is answered from the phone.
// 2. Keeps the app itself (page, scripts, styles, fonts) and the participant's last journey on the phone, so it also
//    opens without internet ("network first": always the server when reachable, the phone's copy only as a fallback;
//    copies served from the phone are marked with the header X-IC-Offline).
// Answers are never sent through here: without internet the page keeps them and sends them later (see "outbox" in app.js).
// The admin and staff pages are never kept.
const AUDIO_CACHE = 'ic-audio-v1';
const SHELL_CACHE = 'ic-shell-v1';
const API_CACHE = 'ic-api-v1';
const NEVER = ['/admin', '/admin.html', '/admin.js', '/staff', '/staff.html', '/staff.js', '/sw.js', '/health'];

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));

self.addEventListener('fetch', (e) => {
  const req = e.request;
  const url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== self.location.origin) return;
  if (url.pathname.startsWith('/audio/')) { e.respondWith(serveAudio(req)); return; }
  if (NEVER.includes(url.pathname)) return;
  if (url.pathname === '/api/me' || url.pathname === '/api/config' || /^\/api\/instances\/\d+$/.test(url.pathname)) {
    e.respondWith(networkFirst(req, API_CACHE, req.url, true));
    return;
  }
  if (url.pathname.startsWith('/api/')) return;
  if (req.mode === 'navigate') {
    if (url.pathname !== '/' && url.pathname !== '/index.html') return;
    e.respondWith(networkFirst(req, SHELL_CACHE, new URL('/', self.location).href, false));
    return;
  }
  e.respondWith(networkFirst(req, SHELL_CACHE, req.url, false));
});

const withTimeout = (p, ms) => new Promise((resolve, reject) => {
  const t = setTimeout(() => reject(new Error('timeout')), ms);
  p.then((v) => { clearTimeout(t); resolve(v); }, (err) => { clearTimeout(t); reject(err); });
});

async function networkFirst(req, cacheName, key, mark) {
  try {
    const res = await withTimeout(fetch(req), 10000);
    if (res.ok && res.type === 'basic') {
      const copy = res.clone();
      caches.open(cacheName).then((c) => c.put(key, copy)).catch(() => {});
    }
    return res;
  } catch (err) {
    let hit = null;
    try { hit = await (await caches.open(cacheName)).match(key); } catch { /* storage unavailable */ }
    if (!hit) throw err;
    if (!mark) return hit;
    const headers = new Headers(hit.headers);
    headers.set('X-IC-Offline', '1');
    return new Response(await hit.blob(), { status: hit.status, headers });
  }
}

// The page sends the list of files of the current version; keep those, drop files of older versions.
self.addEventListener('message', (e) => {
  if (e.data?.type !== 'cache-shell' || !Array.isArray(e.data.urls)) return;
  e.waitUntil((async () => {
    const cache = await caches.open(SHELL_CACHE);
    const want = e.data.urls.filter((u) => typeof u === 'string' && u.startsWith(self.location.origin));
    for (const u of want) {
      if (await cache.match(u)) continue;
      try { const r = await fetch(u, { credentials: 'same-origin' }); if (r.ok) await cache.put(u, r); } catch { /* offline: next time */ }
    }
    const current = want.map((u) => new URL(u).searchParams.get('v')).find(Boolean);
    if (!current) return;
    for (const k of await cache.keys()) {
      const v = new URL(k.url).searchParams.get('v');
      if (v && v !== current) await cache.delete(k);
    }
  })());
});

async function serveAudio(req) {
  let hit = null;
  try { hit = await (await caches.open(AUDIO_CACHE)).match(req.url); } catch { /* storage unavailable */ }
  if (!hit) return fetch(req);
  const range = req.headers.get('range');
  if (!range) return hit;
  // Answer the byte range from the stored file (Safari and Chrome both need proper 206 answers to play and seek).
  const blob = await hit.blob();
  const size = blob.size;
  const m = /bytes=(\d*)-(\d*)/.exec(range);
  let start = 0;
  let end = size - 1;
  if (m && m[1] !== '') { start = Number(m[1]); if (m[2] !== '') end = Math.min(Number(m[2]), size - 1); }
  else if (m && m[2] !== '') { start = Math.max(0, size - Number(m[2])); }
  if (start >= size || start > end) return new Response(null, { status: 416, headers: { 'Content-Range': `bytes */${size}` } });
  const part = blob.slice(start, end + 1);
  return new Response(part, {
    status: 206,
    headers: {
      'Content-Type': hit.headers.get('Content-Type') || 'audio/mp4',
      'Content-Range': `bytes ${start}-${end}/${size}`,
      'Content-Length': String(part.size),
      'Accept-Ranges': 'bytes',
    },
  });
}
