import { UI, LANG_LABELS, LOCALES } from './i18n.js?v=__V__';
import { CLINICS, LANGS, itemsOf, sectionsOf } from '/shared/questionnaires.js?v=__V__';
import { practiceFor, fillMinutes, TAKE_HOME } from '/shared/programme.js?v=__V__';

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
// Line art from the Buchinger Times: three overlapping circles, and a circle with four arrows pointing inward
const CIRCLES = `<svg class="circles" viewBox="0 0 452 246" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.5">
  <circle cx="123" cy="123" r="121"/><circle cx="242" cy="123" r="96"/><circle cx="378" cy="123" r="71"/></g></svg>`;
const INWARD = `<svg class="inward-art" viewBox="0 0 400 400" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.5">
  <circle cx="200" cy="200" r="150"/>
  <path d="M8 8 L58 58 M58 40 V58 H40"/><path d="M392 8 L342 58 M342 40 V58 H360"/>
  <path d="M8 392 L58 342 M58 360 V342 H40"/><path d="M392 392 L342 342 M342 360 V342 H360"/></g></svg>`;

function shell(inner, { narrow = false, hero = '', cover = false } = {}) {
  const langBtns = LANGS.map((l) => `<button class="lang ${l === state.lang ? 'on' : ''}" data-lang="${l}" aria-pressed="${l === state.lang}">${LANG_LABELS[l]}</button>`).join('');
  const logo = `<a href="#/journey" class="brand" aria-label="Inner Calm"><img src="/logo-light.svg" alt="Buchinger"></a>`;
  root.innerHTML = `
    <header class="masthead ${cover ? 'cover' : ''}">
      <div class="mast-bar">
        <span class="mast-label">${t().study}</span>
        <div class="mast-right">
          <nav class="langs" aria-label="Language">${langBtns}</nav>
          ${state.me ? `<button class="link" id="logout">${t().logout}</button>` : ''}
        </div>
      </div>
      ${cover ? '' : logo}
      <div class="mast-inner">${hero}</div>
      ${cover ? logo : ''}
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
function renderItem(it, value, ro, ctx = {}) {
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
  } else if (r.type === 'choice') {
    control = `<div class="labelled" role="radiogroup">${r.options.map((o) => `
      <label class="opt"><input type="radio" name="${name}" value="${o.value}" ${value === o.value ? 'checked' : ''} ${ro ? 'disabled' : ''}><span>${esc(tx(o.label))}</span></label>`).join('')}</div>`;
  } else if (r.type === 'yesno') {
    control = `<div class="yesno" role="radiogroup">
      <label class="pill"><input type="radio" name="${name}" value="1" ${value === 1 ? 'checked' : ''} ${ro ? 'disabled' : ''}><span>${t().yes}</span></label>
      <label class="pill"><input type="radio" name="${name}" value="0" ${value === 0 ? 'checked' : ''} ${ro ? 'disabled' : ''}><span>${t().no}</span></label></div>`;
  } else if (r.type === 'number') {
    control = `<div class="num"><input type="number" inputmode="numeric" name="${name}" min="${r.min}" max="${r.max}" step="1" value="${value ?? ''}" ${ro ? 'disabled' : ''}><span>${esc(tx(r.unit))}</span></div>`;
  }
  const show = it.showIf
    ? `data-showif="${esc(it.showIf.item)}" ${'equals' in it.showIf ? `data-equals="${it.showIf.equals}"` : `data-min="${it.showIf.min}"`}`
    : '';
  const text = tx(it.text).replace('{yesterday}', ctx.yesterday || '');
  const answered = value !== undefined && value !== null && value !== '';
  return `<fieldset class="item ${answered ? 'answered' : ''}" data-item="${name}" ${show}><legend><span class="qn" aria-hidden="true"></span>${esc(text)}</legend>${control}</fieldset>`;
}

function renderSections(kind, answers = {}, ro = false, slot, ctx = {}) {
  return sectionsOf(kind, slot).map((s) => `
    <section class="qsec">
      <div class="qhead"><h3>${esc(tx(s.title))}</h3>
      ${s.prompt ? `<p class="prompt">${esc(tx(s.prompt))}</p>` : ''}</div>
      ${s.items.map((it) => renderItem({ ...it, response: it.response || s.response }, answers[it.id], ro, ctx)).join('')}
    </section>`).join('');
}

function applyShowIf(form) {
  form.querySelectorAll('[data-showif]').forEach((fs) => {
    const src = form.querySelector(`input[name="${fs.dataset.showif}"]:checked`);
    const v = src ? Number(src.value) : null;
    fs.hidden = v === null || ('equals' in fs.dataset ? v !== Number(fs.dataset.equals) : v < Number(fs.dataset.min));
  });
}

function collect(form, kind, slot = form.dataset.slot) {
  const answers = {};
  for (const it of itemsOf(kind, slot)) {
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
  if (!form || form.hidden) return;
  const extra = {};
  form.querySelectorAll('[data-keep]').forEach((el) => { extra[el.name] = el.value; });
  state.draft[location.hash] = { answers: collect(form, form.dataset.kind), extra };
}

// ---------- views ----------
function authCard(title, body, footer = '') {
  shell(`
    <div class="card auth"><h2 class="card-title">${title}</h2>${body}</div>
    ${footer ? `<p class="center muted">${footer}</p>` : ''}`, {
    narrow: true,
    cover: true,
    hero: `<figure class="cover-photo"><img src="/cover.jpg" alt="" width="640" height="758"></figure>
      <h1 class="cover-title">${t().study}</h1><p class="kicker">${t().tagline}</p>`,
  });
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
    <form data-kind="Q1" data-slot="baseline" id="f" novalidate>
      <section class="card stay">
        <h3>${t().yourStay}</h3>
        <label>${t().clinic}<select name="clinic" data-keep required><option value="">${t().chooseClinic}</option>
          ${CLINICS.map((c) => `<option value="${c.id}" ${ex.clinic === c.id ? 'selected' : ''}>${esc(c.label)}</option>`).join('')}</select></label>
        <div class="two">
          <label>${t().arrival}<input type="date" name="arrival_date" data-keep value="${esc(ex.arrival_date || '')}" required></label>
          <label>${t().departure}<input type="date" name="departure_date" data-keep value="${esc(ex.departure_date || '')}" required></label>
        </div>
      </section>
      ${renderSections('Q1', d.answers, false, 'baseline')}
      ${saveBar()}
    </form>`, { hero: `<p class="kicker">${t().kicker}</p><h1>${t().welcomeTitle}</h1><p class="lede">${t().welcomeText}</p>` });
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
  const markAnswered = (e) => {
    const item = e.target.closest('.item');
    if (!item) return;
    item.classList.remove('missing');
    item.classList.toggle('answered', e.target.type === 'number' ? e.target.value !== '' : true);
  };
  form.addEventListener('change', (e) => { applyShowIf(form); markAnswered(e); });
  form.addEventListener('input', (e) => { if (e.target.type === 'number') markAnswered(e); });
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
  const p = practiceFor(i.day_number, totalDays());
  const title = p ? (p.reinforcement ? `${t().reinforcement} · ${tx(p.title)}` : tx(p.title)) : '';
  return [t().dayTitle(i.day_number, title), `${fmtDate(i.open_date)} · ${t().dailySub}`];
}

const totalDays = () => (state.me?.timeline || []).filter((x) => x.kind === 'Q2').length;
const prevDay = (iso) => { const d = new Date(`${iso}T00:00:00Z`); d.setUTCDate(d.getUTCDate() - 1); return d.toISOString().slice(0, 10); };
const paras = (arr) => (arr || []).map((p) => `<p>${esc(p)}</p>`).join('');

function practiceBlock(dayNumber) {
  const p = practiceFor(dayNumber, totalDays());
  if (!p) return `<div class="card note">${esc(t().programmeEnded)}</div>`;
  const steps = (tx(p.snack.steps) || []).map((x) => fillMinutes(x, state.lang, p.minutes));
  return `
    <article class="practice">
      <p class="eyebrow center">${p.reinforcement ? `${esc(t().reinforcement)} · ` : ''}${esc(t().todaysPractice)}</p>
      ${p.reinforcement ? `<p class="reinforce">${esc(t().reinforceIntro)}</p>` : ''}
      <h2 class="theme">${esc(tx(p.theme))}</h2>
      <blockquote class="pull">${paras(tx(p.quote))}
        <footer><span class="who">${esc(t().quoteBy)}</span><span class="role">${esc(t().quoteRole)}</span></footer></blockquote>
      <section class="exercise">
        <p class="eyebrow">${t().exercise} <span class="chip">${t().minutesChip(p.minutes)}</span></p>
        <h3>${esc(tx(p.snack.title))}</h3>
        ${paras(steps)}
        <p class="snack-repeat">${esc(t().snackRepeat)}</p>
      </section>
      ${p.snack.also ? `<p class="also">${esc(tx(p.snack.also))}</p>` : ''}
      ${timerBlock(p.minutes)}
      ${deeperBlock()}
    </article>`;
}

function deeperBlock() {
  return `
      <aside class="deeper">
        <h3>${esc(t().deeperTitle)}</h3>
        <p>${esc(t().deeperText)}</p>
        <p class="credit">${esc(t().credit)}</p>
      </aside>`;
}

function takeHomeBlock() {
  return `
    <article class="practice">
      <p class="eyebrow center">${esc(t().takeHome)}</p>
      <h2 class="theme">${esc(tx(TAKE_HOME.title))}</h2>
      <blockquote class="pull">${paras(tx(TAKE_HOME.quote))}
        <footer><span class="who">${esc(t().quoteBy)}</span><span class="role">${esc(t().quoteRole)}</span></footer></blockquote>
      <section class="exercise">${paras(tx(TAKE_HOME.steps))}</section>
      ${deeperBlock()}
    </article>`;
}

// ---------- snack timer (records nothing) ----------
const fmtClock = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

function timerBlock(minutes) {
  const opts = [1, 2, 5].map((m) => `<button type="button" class="tm-opt${m === minutes ? ' on' : ''}" data-min="${m}" aria-pressed="${m === minutes}">${t().minutesChip(m)}</button>`).join('');
  return `
      <div class="inward" id="snack-timer" data-min="${minutes}">
        <div class="inward-box">${INWARD}
          <div class="tm-face"><p class="tm-clock" aria-live="polite">${fmtClock(minutes * 60)}</p><p class="tm-msg">${esc(t().phoneAway)}</p></div>
        </div>
        <div class="tm-controls">
          <div class="tm-opts" role="group" aria-label="${esc(t().timerLabel)}">${opts}</div>
          <button type="button" class="btn tm-go">${esc(t().timerStart)}</button>
          <p class="tm-note">${esc(t().timerNote)}</p>
        </div>
      </div>`;
}

let audioCtx = null;
function gong() {
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const now = audioCtx.currentTime;
    const master = audioCtx.createGain();
    master.gain.value = 0.35;
    master.connect(audioCtx.destination);
    // A soft singing-bowl tone: a few inharmonic partials with slow decay.
    [[196, 1, 6], [196 * 2.76, 0.45, 4], [196 * 5.4, 0.18, 2.5], [196 * 1.003, 0.6, 6]].forEach(([f, a, d]) => {
      const o = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      o.type = 'sine';
      o.frequency.value = f;
      g.gain.setValueAtTime(0.0001, now);
      g.gain.exponentialRampToValueAtTime(a, now + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, now + d);
      o.connect(g).connect(master);
      o.start(now);
      o.stop(now + d + 0.1);
    });
  } catch { /* no audio available */ }
}

function wireTimer() {
  const box = root.querySelector('#snack-timer');
  if (!box) return;
  const clock = box.querySelector('.tm-clock');
  const msg = box.querySelector('.tm-msg');
  const goBtn = box.querySelector('.tm-go');
  let minutes = Number(box.dataset.min);
  let endAt = 0;
  let tick = null;
  let lock = null;
  const reset = () => { clearInterval(tick); tick = null; endAt = 0; goBtn.textContent = t().timerStart; box.classList.remove('running'); lock?.release?.().catch?.(() => {}); lock = null; };
  box.querySelectorAll('.tm-opt').forEach((b) => b.addEventListener('click', () => {
    if (tick) return;
    minutes = Number(b.dataset.min);
    box.querySelectorAll('.tm-opt').forEach((x) => { x.classList.toggle('on', x === b); x.setAttribute('aria-pressed', String(x === b)); });
    clock.textContent = fmtClock(minutes * 60);
    msg.textContent = t().phoneAway;
  }));
  goBtn.addEventListener('click', async () => {
    if (tick) { reset(); clock.textContent = fmtClock(minutes * 60); return; }
    gong();
    endAt = Date.now() + minutes * 60000;
    goBtn.textContent = t().timerStop;
    box.classList.add('running');
    msg.textContent = '';
    try { lock = await navigator.wakeLock?.request('screen'); } catch { lock = null; }
    tick = setInterval(() => {
      const left = Math.max(0, Math.round((endAt - Date.now()) / 1000));
      clock.textContent = fmtClock(left);
      if (left === 0) {
        reset();
        gong();
        try { navigator.vibrate?.(200); } catch { /* ignore */ }
        msg.textContent = t().timerDone;
        clock.textContent = fmtClock(minutes * 60);
      }
    }, 250);
  });
  window.addEventListener('hashchange', reset, { once: true });
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
    if (i.status === 'open') { meta = t().openUntil(fmtDate(i.close_date)); action = `<a class="btn sm" href="#/q/${i.id}">${i.kind === 'Q2' ? t().open : t().start}</a>`; }
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
    ${done === timeline.length ? `<div class="card done-all">${t().allDone}</div>` : ''}
    <ol class="timeline">${items}</ol>`, {
    hero: `
      ${stay ? `<p class="kicker">${esc(t().stayRange(fmtDate(stay.arrival_date, { day: 'numeric', month: 'long' }), fmtDate(stay.departure_date, { day: 'numeric', month: 'long', year: 'numeric' })))}</p>` : ''}
      <h1>${t().journeyTitle}</h1>
      ${CIRCLES}
      <p class="lede">${esc(t().programmeIntro)}</p>
      <div class="progress" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100"><span style="width:${pct}%"></span></div>
      <p class="kicker">${t().progress(done, timeline.length)}</p>`,
  });
}

async function viewQuestionnaire(id) {
  let inst;
  try { inst = await api(`/instances/${id}`); } catch { go('#/journey'); return; }
  if (inst.status === 'locked') { go('#/journey'); return; }
  const [label, sub] = slotLabel(inst);
  const ro = inst.status !== 'open';
  const intro = inst.kind === 'Q2' ? t().dailyIntro : inst.slot === 'end' ? t().endIntro : '';
  const d = state.draft[location.hash] || { answers: {} };
  const daily = inst.kind === 'Q2';
  const med = daily;
  const p = med ? practiceFor(inst.day_number, totalDays()) : null;
  const hero = daily
    ? `<p class="kicker">${esc(t().dayLabel(inst.day_number))}${p?.reinforcement ? ` · ${esc(t().reinforcement)}` : ''} · ${esc(fmtDate(inst.open_date))}</p><h1>${esc(p ? tx(p.title) : t().dayLabel(inst.day_number))}</h1>`
    : `<p class="kicker">${esc(sub)}</p><h1>${esc(label)}</h1>`;
  const head = daily
    ? `${med ? practiceBlock(inst.day_number) : ''}
       <div class="evening"><h2>${t().eveningJournal}</h2>
         ${ro ? `<p class="badge ${inst.status}">${t()[`st_${inst.status}`]}</p>` : `<p class="muted">${med ? `${esc(t().eveningHint)} ` : ''}${esc(intro)}</p>`}</div>`
    : `${inst.slot === 'end' ? takeHomeBlock() : ''}<div class="intro">${ro ? `<p class="badge ${inst.status}">${t()[`st_${inst.status}`]}</p>` : `<p class="muted">${esc(intro)}</p>`}</div>`;
  shell(`
    <p class="back"><a href="#/journey" class="link small">${t().backToJourney}</a></p>
    ${head}
    ${med && !state.draft[location.hash] ? `<button class="btn ghost" id="reveal">${ro ? t().showAnswers : t().openJournal}</button>` : ''}
    <form data-kind="${inst.kind}" data-slot="${inst.slot}" id="f" novalidate class="${ro ? 'ro' : ''}" ${med && !state.draft[location.hash] ? 'hidden' : ''}>
      ${ro && inst.answers ? `<p class="muted small">${t().readOnly}</p>` : ''}
      ${renderSections(inst.kind, ro ? inst.answers || {} : d.answers, ro, inst.slot, { yesterday: fmtDate(prevDay(inst.open_date), { weekday: 'long', day: 'numeric', month: 'long' }) })}
      ${ro ? '' : saveBar()}
    </form>`, { hero });
  wireTimer();
  root.querySelector('#reveal')?.addEventListener('click', (e) => {
    e.currentTarget.remove();
    const f = root.querySelector('#f');
    f.hidden = false;
    f.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
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
