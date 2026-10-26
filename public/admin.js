const app = document.getElementById('app');
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

async function api(path, body, method) {
  const res = await fetch(`/api/admin${path}`, {
    method: method || (body ? 'POST' : 'GET'), credentials: 'same-origin',
    headers: body ? { 'Content-Type': 'application/json' } : {}, body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw Object.assign(new Error(data.error || 'error'), { status: res.status });
  return data;
}

function login(msg = '') {
  app.innerHTML = `
    <div class="intro"><h1>Admin</h1></div>
    <form class="card" id="f" style="max-width:420px">
      <label>Admin password<input type="password" name="p" autocomplete="current-password" autofocus></label>
      <p class="err">${esc(msg)}</p><button class="btn">Log in</button>
    </form>`;
  app.querySelector('#f').addEventListener('submit', async (e) => {
    e.preventDefault();
    try { await api('/login', { password: new FormData(e.target).get('p') }); load(); }
    catch (err) { login(err.status === 429 ? 'Too many attempts — wait a few minutes.' : 'Wrong password (or ADMIN_PASSWORD not set on the server).'); }
  });
}

async function load() {
  let d;
  try { d = await api('/overview'); } catch { return login(); }
  const active = d.users.filter((u) => u.arrival_date && u.arrival_date <= d.now.date && d.now.date <= u.departure_date).length;
  const done = d.users.reduce((a, u) => a + u.done, 0);
  const planned = d.users.reduce((a, u) => a + u.planned, 0);
  const missed = d.users.reduce((a, u) => a + u.missed, 0);
  app.innerHTML = `
    <div class="intro"><h1>Inner Calm — overview</h1>
      <p class="muted small">Study time: ${esc(d.now.date)} ${String(d.now.hour).padStart(2, '0')}h (${esc(d.timeZone)}) · emails go out from ${d.openHour}:00</p></div>
    ${d.smtpConfigured
      ? '<div class="banner good">Email sending is configured (SMTP on).</div>'
      : '<div class="banner warn"><b>Email sending is not configured.</b> Emails are not sent, only listed below (with their links) so you can test. Add the Brevo SMTP settings to the server <code>.env</code> to switch sending on.</div>'}
    <div class="stats">
      <div class="stat"><b>${d.users.length}</b><span>participants</span></div>
      <div class="stat"><b>${active}</b><span>currently in the clinic</span></div>
      <div class="stat"><b>${done}/${planned}</b><span>questionnaires completed</span></div>
      <div class="stat"><b>${missed}</b><span>missed</span></div>
    </div>
    <div class="card"><h3>Download data</h3>
      <p class="muted small">Excel: one sheet with participants (the only sheet with emails), Q1 and Q2 answers with scores, and the full schedule. SQLite: the complete raw database.</p>
      <div class="row" style="margin-top:12px">
        <a class="btn sm" href="/api/admin/export.xlsx">Excel export (.xlsx)</a>
        <a class="btn sm" href="/api/admin/database.sqlite" style="background:#5d5850">Database (.sqlite)</a>
        <button class="link small" id="tick">Run the email check now</button>
      </div>
    </div>
    <div class="card"><h3>Participants</h3>
      <p class="muted small">Correct a participant's dates here — the unanswered part of their journey is rebuilt; answered questionnaires are kept.</p>
      <div class="scroll"><table>
        <thead><tr><th>Code</th><th>Email</th><th>Clinic</th><th>Arrival</th><th>Departure</th><th>Done</th><th>Missed</th><th></th></tr></thead>
        <tbody>${d.users.map((u) => `
          <tr data-id="${u.id}">
            <td><b>${esc(u.participant_code)}</b></td><td>${esc(u.email)}</td><td>${esc(u.clinic || '—')}</td>
            ${u.arrival_date ? `<td><input type="date" name="a" value="${esc(u.arrival_date)}"></td><td><input type="date" name="d" value="${esc(u.departure_date)}"></td>`
              : '<td colspan="2" class="muted">Welcome questionnaire not done yet</td>'}
            <td>${u.done}/${u.planned}</td><td>${u.missed}</td>
            <td>${u.arrival_date ? '<button class="link small save">Save dates</button>' : ''}</td>
          </tr>`).join('') || '<tr><td colspan="8" class="muted">No participants yet.</td></tr>'}</tbody>
      </table></div>
    </div>
    <div class="card"><h3>Latest emails</h3>
      <div class="scroll"><table>
        <thead><tr><th>When (UTC)</th><th>To</th><th>Subject</th><th>Status</th><th>Link</th></tr></thead>
        <tbody>${d.emails.map((m) => `
          <tr><td>${esc(m.created_at)}</td><td>${esc(m.to_email)}</td><td>${esc(m.subject)}</td>
          <td><span class="tag ${esc(m.status)}" title="${esc(m.error || '')}">${esc(m.status)}</span></td>
          <td>${m.link ? `<a href="${esc(m.link)}" target="_blank" rel="noopener">open</a>` : ''}</td></tr>`).join('') || '<tr><td colspan="5" class="muted">No emails yet.</td></tr>'}</tbody>
      </table></div>
    </div>`;

  app.querySelector('#tick').addEventListener('click', async () => { await api('/run-scheduler', {}); load(); });
  app.querySelectorAll('button.save').forEach((b) => b.addEventListener('click', async () => {
    const tr = b.closest('tr');
    try {
      await api(`/users/${tr.dataset.id}/stay`, { arrival_date: tr.querySelector('[name=a]').value, departure_date: tr.querySelector('[name=d]').value }, 'PUT');
      b.textContent = 'Saved ✓';
      setTimeout(load, 900);
    } catch { b.textContent = 'Invalid dates'; }
  }));
}

load();
