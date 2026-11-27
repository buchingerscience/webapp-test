// Inner Calm — clinic staff page (/staff). Read-only list of participants; the only action is
// "new temporary password" for a guest who forgot theirs. No downloads, no editing of answers or dates.
const app = document.getElementById('app');
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
let countryName = (c) => c;
try { const dn = new Intl.DisplayNames(['en'], { type: 'region' }); countryName = (c) => (c ? dn.of(c) || c : ''); } catch { /* codes */ }
const SEX = { 1: 'Female', 2: 'Male', 3: 'Diverse', 0: 'Not said' };
const PROG = { fasting: 'Fasting', nutrition: 'Nutrition', undecided: 'Not decided' };
const WHERE = { in_clinic: 'In the clinic', upcoming: 'Arriving', left: 'Left', registered: 'Registered only' };
const LANG = { en: 'EN', de: 'DE', fr: 'FR', es: 'ES' };
const TODAY = { done: '✓ done', open: 'open', missed: 'missed', locked: '—' };
const fmt = (iso) => (iso ? new Date(`${iso.slice(0, 10)}T00:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' }) : '');
const fmtTime = (iso) => (iso ? new Date(iso).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Berlin' }) : '');

async function api(path, body) {
  const res = await fetch(`/api/staff${path}`, {
    method: body ? 'POST' : 'GET', credentials: 'same-origin',
    headers: body ? { 'Content-Type': 'application/json' } : {}, body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw Object.assign(new Error(data.error || 'error'), { status: res.status });
  return data;
}

function login(msg = '') {
  app.innerHTML = `
    <div class="intro"><h1>Clinic staff</h1><p class="muted">Inner Calm study: participant list and password help.</p></div>
    <form class="card" id="f" style="max-width:420px">
      <label>Staff password<input type="password" name="p" autocomplete="current-password" autofocus></label>
      <p class="err">${esc(msg)}</p><button class="btn">Log in</button>
    </form>`;
  app.querySelector('#f').addEventListener('submit', async (e) => {
    e.preventDefault();
    try { await api('/login', { password: new FormData(e.target).get('p') }); load(); }
    catch (err) { login(err.status === 429 ? 'Too many attempts. Wait a few minutes.' : 'Wrong password (or STAFF_PASSWORD not set on the server).'); }
  });
}

let data = null;
let filter = 'in_clinic';
let query = '';

async function load() {
  try { data = await api('/participants'); } catch { return login(); }
  render();
}

function rows() {
  const q = query.trim().toLowerCase();
  const order = { in_clinic: 0, upcoming: 1, registered: 2, left: 3 };
  return data.participants
    .filter((p) => filter === 'all' || p.where === filter)
    .filter((p) => !q || [p.email, p.room, p.code].some((x) => String(x || '').toLowerCase().includes(q)))
    .sort((a, b) => (order[a.where] - order[b.where]) || String(a.room || '~').localeCompare(String(b.room || '~'), 'en', { numeric: true }));
}

function render() {
  const count = (w) => data.participants.filter((p) => p.where === w).length;
  const list = rows();
  app.innerHTML = `
    <div class="intro"><h1>Inner Calm: participants</h1>
      <p class="muted small">Today: ${esc(fmt(data.now.date))} · ${data.participants.length} registered · <button class="link small" id="refresh">Refresh</button> · <button class="link small" id="logout">Log out</button></p></div>
    <div class="note">
      <p><b>Forgotten password?</b> Passwords are stored encrypted and cannot be shown to anyone. Click <b>New password</b> in the guest's row and give them the temporary password: they log in with their email and this password. Their old password stops working.</p>
      <p>Answers are not visible here. Please do not share this list, print it or take screenshots: it contains personal data.</p>
    </div>
    <div class="tools">
      <input type="search" id="q" placeholder="Search email, room or code" value="${esc(query)}" aria-label="Search">
      <div class="seg" role="group" aria-label="Show">
        ${[['in_clinic', `In the clinic (${count('in_clinic')})`], ['upcoming', `Arriving (${count('upcoming')})`], ['left', `Left (${count('left')})`], ['all', 'All']]
          .map(([k, l]) => `<button type="button" data-f="${k}" class="${filter === k ? 'on' : ''}">${esc(l)}</button>`).join('')}
      </div>
    </div>
    <div class="card"><div class="scroll"><table>
      <thead><tr><th>Status</th><th>Email</th><th>Room</th><th>Clinic</th><th>Programme</th><th>Arrival</th><th>Departure</th><th>Age</th><th>Sex</th><th>Country</th><th>Lang.</th><th>Answered</th><th>Journal today</th><th>Last answer</th><th>Password</th></tr></thead>
      <tbody>${list.map((p) => `
        <tr data-id="${p.id}">
          <td><span class="tag ${esc(p.where)}">${esc(WHERE[p.where])}</span></td>
          <td>${esc(p.email)}</td><td><b>${esc(p.room || '')}</b></td><td>${esc(p.clinic || '')}</td><td>${esc(PROG[p.programme] || '')}</td>
          <td>${esc(fmt(p.arrival))}</td><td>${esc(fmt(p.departure))}</td>
          <td>${esc(p.age ?? '')}</td><td>${esc(p.sex === null ? '' : SEX[p.sex] || '')}</td><td>${esc(countryName(p.country))}</td><td>${esc(LANG[p.language] || p.language)}</td>
          <td>${p.planned ? `${p.done}/${p.planned}` : '—'}</td>
          <td class="${p.today === 'done' ? 'ok' : ''}">${esc(p.today ? TODAY[p.today] : '')}</td>
          <td>${esc(fmtTime(p.last))}</td>
          <td class="pw"><button type="button" class="link small newpw">New password</button></td>
        </tr>`).join('') || '<tr><td colspan="15" class="muted">Nobody here.</td></tr>'}</tbody>
    </table></div></div>`;

  app.querySelector('#refresh').addEventListener('click', load);
  app.querySelector('#logout').addEventListener('click', async () => { await api('/logout', {}).catch(() => {}); login(); });
  const q = app.querySelector('#q');
  q.addEventListener('input', () => { query = q.value; const pos = q.selectionStart; render(); const n = app.querySelector('#q'); n.focus(); n.setSelectionRange(pos, pos); });
  app.querySelectorAll('[data-f]').forEach((b) => b.addEventListener('click', () => { filter = b.dataset.f; render(); }));
  app.querySelectorAll('.newpw').forEach((b) => b.addEventListener('click', () => confirmNew(b.closest('tr'))));
}

function confirmNew(tr) {
  const p = data.participants.find((x) => String(x.id) === tr.dataset.id);
  const cell = tr.querySelector('.pw');
  cell.innerHTML = `Replace the password of <b>${esc(p.email)}</b>? <button type="button" class="link small yes">Yes</button> · <button type="button" class="link small no">Cancel</button>`;
  cell.querySelector('.no').addEventListener('click', render);
  cell.querySelector('.yes').addEventListener('click', async () => {
    cell.textContent = 'Creating…';
    try {
      const r = await api(`/participants/${p.id}/temp-password`, {});
      cell.innerHTML = `<code>${esc(r.password)}</code> <span class="muted small">Give this to the guest now (it is shown only once).</span>`;
    } catch (err) {
      if (err.status === 401) return login('Session expired: please log in again.');
      cell.textContent = 'Could not create a password. Try again.';
    }
  });
}

load();
