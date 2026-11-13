// Inner Calm service worker.
// Its only job: keep Gilbert Grimeau's audio guides on the phone once a person has started one,
// because the clinic's wifi is weak. Nothing else is intercepted (pages and answers always go to the server).
// The page downloads a guide into the cache the first time it is played (see cacheAudio in app.js);
// from then on every request for that file, including the "Range" requests audio players make, is answered from the phone.
const AUDIO_CACHE = 'ic-audio-v1';

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== self.location.origin || !url.pathname.startsWith('/audio/')) return;
  e.respondWith(serveAudio(e.request));
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
