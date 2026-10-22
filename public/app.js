import { UI, LANG_LABELS, LOCALES } from './i18n.js';
import { QUESTIONNAIRES, CLINICS, LANGS, itemsOf } from '/shared/questionnaires.js';

// ---------- state ----------
const store = {
  get(k) { try { return localStorage.getItem(k); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch { /* private mode */ } },
};
const state = {
  lang: LANGS.includes(store.get('ic_lang')) ? store.get('ic_lang') : (LANGS.find((l) => navigator.language?.startsWith(l)) || 'en'),
  me: null,
  draft: {},
};
const t = () => UI[state.lang];
// Navigate, re-rendering even if we are already on that address
const go = (h) => { if (location.hash === h) route(); else location.hash = h; };
const root = document.getElementById('app');

// ---------- utils ----------
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const tx = (obj) => (obj ? obj[state.lang] ?? obj.en : '');
const fmtDate = (iso, opts = { weekday: 'short', day: 'numeric', month: 'short' }) =>
  new Intl.DateTimeFormat(LOCALES[state.lang], { ...opts, timeZone: 'UTC' }).format(new Date(`${iso}T00:00:00Z`));

async function api(path, body, method) {
  const res = await fetch(`/api${path}`, {
    method: method || (body ? 'POST' : 'GET'),
    headers: body ? { 'Content-Type': 'application/json' } : {},
    body: body ? JSON.stringify(body) : undefined,
    credentials: 'same-origin',
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw Object.assign(new Error(data.error || 'generic'), { status: res.status, data });
  return data;
}
const errText = (e) => t()[`err_${e.message}`] || t().err_generic;

function toast(msg) {
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = msg;
  document.body.appendChild(el);
  requestAnimationFrame(() => el.classList.add('show'));
  setTimeout(() => { el.classList.remove('show'); setTimeout(() => el.remove(), 300); }, 2600);
}

// ---------- layout ----------
function shell(inner, { narrow = false } = {}) {
  const langBtns = LANGS.map((l) => `<button class="lang ${l === state.lang ? 'on' : ''}" data-lang="${l}" aria-pressed="${l === state.lang}">${LANG_LABELS[l]}</button>`).join('');
  root.innerHTML = `
    <header class="top">
      <a href="#/journey" class="brand" aria-label="Inner Calm"><img src="/logo_bw.svg" alt="Buchinger Wilhelmi"></a>
      <div class="top-right">
        <nav class="langs" aria-label="Language">${langBtns}</nav>
        ${state.me ? `<button class="link small" id="logout">${t().logout}</button>` : ''}
      </div>
    </header>
    <main class="${narrow ? 'narrow' : ''}">${inner}</main>`;
  root.querySelectorAll('[data-lang]').forEach((b) => b.addEventListener('click', () => setLang(b.dataset.lang)));
  root.querySelector('#logout')?.addEventListener('click', async () => {
    await api('/logout', {}).catch(() => {});
    state.me = null;
    go('#/login');
  });
  window.scrollTo?.(0, 0);
}

function setLang(l) {
  saveDraft();
  state.lang = l;
  store.set('ic_lang', l);
  document.documentElement.lang = l;
  if (state.me) api('/language', { language: l }).catch(() => {});
  route(true);
}

// ---------- questionnaire rendering ----------
function renderItem(it, value, ro) {
  const r = it.response;
  const name = esc(it.id);
  let control = '';
  if (r.type === 'scale') {
    const opts = [];
    for (let v = r.min; v <= r.max; v++) {
      opts.push(`<label class="pt"><input type="radio" name="${name}" value="${v}" ${value === v ? 'checked' : ''} ${ro ? 'disabled' : ''}><span>${v}</span></label>`);
    }
    control = `<div class="scale n${r.max - r.min + 1}" role="radiogroup">${opts.join('')}</div>
      <div class="anchors"><span>${r.min} · ${esc(tx(r.anchors)[0])}</span><span>${r.max} · ${esc(tx(r.anchors)[1])}</span></div>`;
  } else if (r.type === 'labelled') {
    const labels = tx(r.labels);
    const values = [];
    for (let v = r.max; v >= r.min; v--) values.push(v);
    control = `<div class="labelled" role="radiogroup">${values.map((v, i) => `
      <label class="opt"><input type="radio" name="${name}" value="${v}" ${value === v ? 'checked' : ''} ${ro ? 'disabled' : ''}><span>${esc(labels[i])}</span></label>`).join('')}</div>`;
  } else if (r.type === 'yesno') {
    control = `<div class="yesno" role="radiogroup">
      <label class="pill"><input type="radio" name="${name}" value="1" ${value === 1 ? 'checked' : ''} ${ro ? 'disabled' : ''}><span>${t().yes}</span></label>
      <label class="pill"><input type="radio" name="${name}" value="0" ${value === 0 ? 'checked' : ''} ${ro ? 'disabled' : ''}><span>${t().no}</span></label></div>`;
  } else if (r.type === 'number') {
    control = `<div class="num"><input type="number" inputmode="numeric" name="${name}" min="${r.min}" max="${r.max}" step="1" value="${value ?? ''}" ${ro ? 'disabled' : ''}><span>${esc(tx(r.unit))}</span></div>`;
  }
  const show = it.showIf ? `data-showif="${esc(it.showIf.item)}" data-equals="${it.showIf.equals}"` : '';
  return `<fieldset class="item" data-item="${name}" ${show}><legend>${esc(tx(it.text))}</legend>${control}</fieldset>`;
}

function renderSections(kind, answers = {}, ro = false) {
  return QUESTIONNAIRES[kind].sections.map((s) => `
    <section class="card qsec">
      <h3>${esc(tx(s.title))}</h3>
      ${s.prompt ? `<p class="prompt">${esc(tx(s.prompt))}</p>` : ''}
      ${s.items.map((it) => renderItem({ ...it, response: it.response || s.response }, answers[it.id], ro)).join('')}
    </section>`).join('');
}

function applyShowIf(form) {
  form.querySelectorAll('[data-showif]').forEach((fs) => {
    const src = form.querySelector(`input[name="${fs.dataset.showif}"]:checked`);
    fs.hidden = !(src && Number(src.value) === Number(fs.dataset.equals));
  });
}

function collect(form, kind) {
  const answers = {};
  for (const it of itemsOf(kind)) {
    const checked = form.querySelector(`input[name="${it.id}"]:checked`);
    const num = form.querySelector(`input[type="number"][name="${it.id}"]`);
    if (checked) answers[it.id] = Number(checked.value);
    else if (num && num.value !== '') answers[it.id] = Number(num.value);
  }
  return answers;
}

function markMissing(form, missing) {
  form.querySelectorAll('.item.missing').forEach((el) => el.classList.remove('missing'));
  missing.forEach((id) => form.querySelector(`[data-item="${id}"]`)?.classList.add('missing'));
  form.querySelector('.item.missing')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Keep unsaved answers when the language is switched
function saveDraft() {
  const form = root.querySelector('form[data-kind]');
  if (!form) return;
  const extra = {};
  form.querySelectorAll('[data-keep]').forEach((el) => { extra[el.name] = el.value; });
  state.draft[location.hash] = { answers: collect(form, form.dataset.kind), extra };
}

// ---------- views ----------
function authCard(title, body, footer = '') {
  shell(`
    <div class="intro"><p class="eyebrow">${t().study}</p><h1>${title}</h1><p class="muted">${t().tagline}</p></div>
    <div class="card auth">${body}</div>
    ${footer ? `<p class="center muted">${footer}</p>` : ''}`, { narrow: true });
}

function viewLogin() {
  authCard(t().login, `
    <form id="f" novalidate>
      <label>${t().email}<input name="email" type="email" autocomplete="email" required></label>
      <label>${t().password}<input name="password" type="password" autocomplete="current-password" required></label>
      <p class="err" id="err" role="alert"></p>
      <button class="btn">${t().login}</button>
      <p class="center"><a href="#/forgot">${t().forgot}</a></p>
    </form>`, `${t().noAccount} <a href="#/register">${t().register}</a>`);
  root.querySelector('#f').addEventListener('submit', async (e) => {
    e.preventDefault();
    const f = new FormData(e.target);
    try {
      const r = await api('/login', { email: f.get('email'), password: f.get('password') });
      if (r.language && r.language !== state.lang) { state.lang = r.language; store.set('ic_lang', r.language); }
      go('#/journey');
    } catch (err) { root.querySelector('#err').textContent = errText(err); }
  });
}

function viewRegister() {
  authCard(t().register, `
    <form id="f" novalidate>
      <label>${t().email}<input name="email" type="email" autocomplete="email" required></label>
      <label>${t().password}<input name="password" type="password" autocomplete="new-password" minlength="8" required><small>${t().passwordHint}</small></label>
      <div class="consent"><h3>${t().consentTitle}</h3><p>${t().consentText}</p>
        <label class="check"><input type="checkbox" name="consent"> <span>${t().consentCheck}</span></label></div>
      <p class="err" id="err" role="alert"></p>
      <button class="btn">${t().register}</button>
    </form>`, `${t().haveAccount} <a href="#/login">${t().login}</a>`);
  root.querySelector('#f').addEventListener('submit', async (e) => {
    e.preventDefault();
    const f = new FormData(e.target);
    try {
      await api('/register', { email: f.get('email'), password: f.get('password'), consent: f.get('consent') === 'on', language: state.lang });
      go('#/journey');
    } catch (err) { root.querySelector('#err').textContent = errText(err); }
  });
}

function viewForgot() {
  authCard(t().forgotTitle, `
    <form id="f" novalidate>
      <p class="muted">${t().forgotText}</p>
      <label>${t().email}<input name="email" type="email" autocomplete="email" required></label>
      <p class="ok" id="ok" role="status"></p>
      <button class="btn">${t().sendLink}</button>
    </form>`, `<a href="#/login">${t().back}</a>`);
  root.querySelector('#f').addEventListener('submit', async (e) => {
    e.preventDefault();
    await api('/forgot', { email: new FormData(e.target).get('email') }).catch(() => {});
    root.querySelector('#ok').textContent = t().linkSent;
  });
}

function viewReset(token) {
  authCard(t().resetTitle, `
    <form id="f" novalidate>
      <label>${t().newPassword}<input name="password" type="password" autocomplete="new-password" minlength="8" required><small>${t().passwordHint}</small></label>
      <p class="err" id="err" role="alert"></p>
      <button class="btn">${t().savePassword}</button>
    </form>`);
  root.querySelector('#f').addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
      await api('/reset', { token, password: new FormData(e.target).get('password') });
      go('#/journey');
    } catch (err) { root.querySelector('#err').textContent = errText(err); }
  });
}

function viewBaseline() {
  const d = state.draft[location.hash] || { answers: {}, extra: {} };
  const ex = d.extra;
  shell(`
    <div class="intro"><p class="eyebrow">${t().study}</p><h1>${t().welcomeTitle}</h1><p class="muted">${t().welcomeText}</p></div>
    <form data-kind="Q1" id="f" novalidate>
      <section class="card qsec">
        <h3>${t().yourStay}</h3>
        <label>${t().clinic}<select name="clinic" data-keep required><option value="">${t().chooseClinic}</option>
          ${CLINICS.map((c) => `<option value="${c.id}" ${ex.clinic === c.id ? 'selected' : ''}>${esc(c.label)}</option>`).join('')}</select></label>
        <div class="two">
          <label>${t().arrival}<input type="date" name="arrival_date" data-keep value="${esc(ex.arrival_date || '')}" required></label>
          <label>${t().departure}<input type="date" name="departure_date" data-keep value="${esc(ex.departure_date || '')}" required></label>
        </div>
      </section>
      ${renderSections('Q1', d.answers)}
      ${saveBar()}
    </form>`);
  wireForm('Q1', async (answers, form) => {
    const f = new FormData(form);
    return api('/baseline', { clinic: f.get('clinic'), arrival_date: f.get('arrival_date'), departure_date: f.get('departure_date'), answers });
  });
}

const saveBar = () => `
  <div class="savebar"><p class="err" id="err" role="alert"></p><p class="muted small">${t().saveNote}</p>
  <button class="btn" id="save">${t().save}</button></div>`;

function wireForm(kind, submit) {
  const form = root.querySelector('#f');
  applyShowIf(form);
  form.addEventListener('change', (e) => {
    applyShowIf(form);
    e.target.closest('.item')?.classList.remove('missing');
  });
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('#save');
    const errEl = form.querySelector('#err');
    errEl.textContent = '';
    btn.disabled = true;
    btn.textContent = t().saving;
    try {
      const r = await submit(collect(form, kind), form);
      delete state.draft[location.hash];
      Object.assign(state.me, { stay: r.stay, timeline: r.timeline });
      toast(t().saved);
      go('#/journey');
    } catch (err) {
      btn.disabled = false;
      btn.textContent = t().save;
      if (err.message === 'incomplete') { errEl.textContent = t().missing; markMissing(form, err.data.missing || []); }
      else errEl.textContent = errText(err);
    }
  });
}

function slotLabel(i) {
  if (i.slot === 'baseline') return [t().baselineLabel, t().baselineSub];
  if (i.slot === 'end') return [t().endLabel, `${t().endSub} · ${fmtDate(i.open_date)}`];
  return [t().dayLabel(i.day_number), `${fmtDate(i.open_date)} · ${t().dailySub}`];
}

function viewJourney() {
  const { timeline, stay, today, openHour } = state.me;
  if (!timeline.some((i) => i.slot === 'baseline')) return viewBaseline();
  const done = timeline.filter((i) => i.status === 'done').length;
  const pct = Math.round((done / timeline.length) * 100);
  const items = timeline.map((i) => {
    const [label, sub] = slotLabel(i);
    let meta = '';
    let action = '';
    if (i.status === 'open') { meta = t().openUntil(fmtDate(i.close_date)); action = `<a class="btn sm" href="#/q/${i.id}">${t().start}</a>`; }
    if (i.status === 'locked') meta = t().opensOn(fmtDate(i.open_date), String(openHour).padStart(2, '0'));
    if (i.status === 'done') action = `<a class="link small" href="#/q/${i.id}">${t().view}</a>`;
    return `
      <li class="step ${i.status} ${i.open_date === today && i.slot !== 'baseline' ? 'today' : ''}">
        <span class="node" aria-hidden="true"></span>
        <div class="step-body">
          <div class="step-head"><strong>${esc(label)}</strong><span class="badge ${i.status}">${t()[`st_${i.status}`]}</span></div>
          <p class="muted small">${esc(sub)}</p>
          ${meta ? `<p class="small meta">${esc(meta)}</p>` : ''}
        </div>
        ${action ? `<div class="step-action">${action}</div>` : ''}
      </li>`;
  }).join('');
  shell(`
    <div class="intro">
      <p class="eyebrow">${t().study}</p><h1>${t().journeyTitle}</h1>
      ${stay ? `<p class="muted">${esc(t().stayRange(fmtDate(stay.arrival_date, { day: 'numeric', month: 'long' }), fmtDate(stay.departure_date, { day: 'numeric', month: 'long', year: 'numeric' })))}</p>` : ''}
      <div class="progress" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100"><span style="width:${pct}%"></span></div>
      <p class="small muted">${t().progress(done, timeline.length)}</p>
    </div>
    ${done === timeline.length ? `<div class="card done-all">${t().allDone}</div>` : ''}
    <ol class="timeline">${items}</ol>`);
}

async function viewQuestionnaire(id) {
  let inst;
  try { inst = await api(`/instances/${id}`); } catch { go('#/journey'); return; }
  const [label, sub] = slotLabel(inst);
  const ro = inst.status !== 'open';
  const intro = inst.kind === 'Q2' ? t().dailyIntro : inst.slot === 'end' ? t().endIntro : '';
  const d = state.draft[location.hash] || { answers: {} };
  shell(`
    <p><a href="#/journey" class="link small">${t().backToJourney}</a></p>
    <div class="intro"><p class="eyebrow">${esc(sub)}</p><h1>${esc(label)}</h1>
      ${ro ? `<p class="badge ${inst.status}">${t()[`st_${inst.status}`]}</p>` : `<p class="muted">${esc(intro)}</p>`}</div>
    <form data-kind="${inst.kind}" id="f" novalidate class="${ro ? 'ro' : ''}">
      ${ro && inst.answers ? `<p class="muted small">${t().readOnly}</p>` : ''}
      ${renderSections(inst.kind, ro ? inst.answers || {} : d.answers, ro)}
      ${ro ? '' : saveBar()}
    </form>`);
  if (ro) { applyShowIf(root.querySelector('#f')); return; }
  wireForm(inst.kind, (answers) => api(`/instances/${id}`, { answers }));
}

// ---------- router ----------
async function route(keepDraft = false) {
  if (!keepDraft) state.draft = {};
  document.documentElement.lang = state.lang;
  const [, page, arg] = (location.hash || '#/').split('/');
  if (page === 'reset' && arg) return viewReset(arg);
  if (['login', 'register', 'forgot'].includes(page)) {
    return ({ login: viewLogin, register: viewRegister, forgot: viewForgot })[page]();
  }
  try {
    state.me = await api('/me');
    if (!keepDraft && state.me.user.language && state.me.user.language !== state.lang && !store.get('ic_lang')) state.lang = state.me.user.language;
  } catch {
    state.me = null;
    go('#/login');
    return;
  }
  if (page === 'q' && arg) return viewQuestionnaire(arg);
  return viewJourney();
}

window.addEventListener('hashchange', () => route());
route();
