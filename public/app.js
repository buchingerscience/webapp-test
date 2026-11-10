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
const typoHtml = (h) => (state.lang === 'fr' || state.lang === 'es' ? h.replace(/&#39;/g, '’').replace(/([A-Za-zÀ-ÿ])'([A-Za-zÀ-ÿ])/g, '$1’$2') : h);
const typo = (v) => (typeof v === 'string' && (state.lang === 'fr' || state.lang === 'es') ? v.replace(/'/g, '’') : v);
const tx = (obj) => { const v = obj ? obj[state.lang] ?? obj.en : ''; return Array.isArray(v) ? v.map(typo) : typo(v); };
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
  state.flash = msg; // shown by shell() at the top of the next page
}
function toastOverlay(msg) {
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

function shell(inner, { narrow = false, hero = '', cover = false, compact = false } = {}) {
  const langOpts = LANGS.map((l) => `<option value="${l}" ${l === state.lang ? 'selected' : ''}>${LANG_LABELS[l]}</option>`).join('');
  const logo = `<a href="#/journey" class="brand" aria-label="Inner Calm"><img src="/logo-light.svg" alt="Buchinger"></a>`;
  const barLeft = cover
    ? `<span class="mast-label">${t().study}</span>`
    : `<a href="#/journey" class="brand-sm" aria-label="Inner Calm"><img src="/logo-light.svg" alt="Buchinger"></a>`;
  root.innerHTML = typoHtml(`
    <header class="masthead ${cover ? 'cover' : ''} ${compact ? 'compact' : ''}">
      <div class="mast-bar">
        ${barLeft}
        <label class="lang-select"><span class="sr">${t().languageLabel}</span>
          <select id="lang" aria-label="${t().languageLabel}">${langOpts}</select></label>
      </div>
      <div class="mast-inner">${hero}</div>
      ${cover ? logo : ''}
    </header>
    <main class="${narrow ? 'narrow' : ''}">${state.flash ? `<p class="flash" role="status">${esc(state.flash)}</p>` : ''}${inner}</main>`);
  if (state.flash) { state.flash = null; setTimeout(() => root.querySelector('.flash')?.classList.add('gone'), 3500); }
  root.querySelector('#lang').addEventListener('change', (e) => setLang(e.target.value));
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
      ${r.max - r.min >= 10
        ? `<div class="anchors one"><span>${r.min} = ${esc(tx(r.anchors)[0])}</span><span aria-hidden="true">·</span><span>${r.max} = ${esc(tx(r.anchors)[1])}</span></div>`
        : `<div class="anchors"><span>${r.min} = ${esc(tx(r.anchors)[0])}</span><span>${r.max} = ${esc(tx(r.anchors)[1])}</span></div>`}`;
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

function renderSections(kind, answers = {}, ro = false, slot, ctx = {}, paged = false) {
  return sectionsOf(kind, slot).map((s) => `
    <section class="qsec ${paged ? 'page' : ''}">
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
  if (!form || form.closest('[hidden]')) return;
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
      <div class="consent"><h3>${t().consentTitle}</h3>
        <ul class="bullets">${t().consentBullets.map((b) => `<li>${esc(b)}</li>`).join('')}</ul>
        <details class="fullinfo"><summary>${t().fullInfo}</summary><p>${t().consentText}</p></details>
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
    <form data-kind="Q1" data-slot="baseline" data-paged="1" id="f" novalidate>
      ${pagerTop()}
      <section class="card stay page">
        <h3>${t().yourStay}</h3>
        <label>${t().clinic}<select name="clinic" data-keep required><option value="">${t().chooseClinic}</option>
          ${CLINICS.map((c) => `<option value="${c.id}" ${ex.clinic === c.id ? 'selected' : ''}>${esc(c.label)}</option>`).join('')}</select></label>
        <div class="two">
          <label>${t().arrival}<input type="date" name="arrival_date" data-keep value="${esc(ex.arrival_date || '')}" required></label>
          <label>${t().departure}<input type="date" name="departure_date" data-keep value="${esc(ex.departure_date || '')}" required></label>
        </div>
      </section>
      ${renderSections('Q1', d.answers, false, 'baseline', {}, true)}
      ${pagerNav()}
    </form>`, { hero: `<p class="kicker">${t().kicker}</p><h1>${t().welcomeTitle}</h1><p class="lede">${t().welcomeText}</p>` });
  wireForm('Q1', async (answers, form) => {
    const f = new FormData(form);
    return api('/baseline', { clinic: f.get('clinic'), arrival_date: f.get('arrival_date'), departure_date: f.get('departure_date'), answers });
  });
}

const pagerTop = () => `<div class="pager" aria-live="polite"><p class="step-of"></p><div class="pbar"><span></span></div></div>`;
const pagerNav = () => `
  <div class="pager-nav">
    <p class="err" id="err" role="alert"></p>
    <p class="muted small center" id="savenote">${t().saveNoteShort}</p>
    <div class="pager-btns"><button type="button" class="btn ghost" id="prev">${t().prevQ}</button><button type="button" class="btn" id="next">${t().next}</button><button class="btn" id="save">${t().save}</button></div>
  </div>`;

// Presentation only: every question is still required and the server still validates everything.
function setupPager(form) {
  const pages = [...form.querySelectorAll('.page')];
  if (pages.length < 2) return null;
  const stepOf = form.querySelector('.step-of');
  const bar = form.querySelector('.pbar span');
  const prev = form.querySelector('#prev');
  const next = form.querySelector('#next');
  const save = form.querySelector('#save');
  const saveNote = form.querySelector('#savenote');
  const errEl = form.querySelector('#err');
  let i = 0;
  const show = (n, scroll = true) => {
    i = Math.max(0, Math.min(n, pages.length - 1));
    pages.forEach((pg, k) => { pg.hidden = k !== i; });
    stepOf.textContent = t().stepOf(i + 1, pages.length);
    bar.style.width = `${Math.round(((i + 1) / pages.length) * 100)}%`;
    prev.hidden = i === 0;
    next.hidden = i === pages.length - 1;
    save.hidden = i !== pages.length - 1;
    saveNote.hidden = i !== pages.length - 1;
    errEl.textContent = '';
    document.querySelector('.masthead')?.classList.toggle('stepped', i > 0);
    if (scroll) form.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  const isAnswered = (it) => it.querySelector('input:checked') || [...it.querySelectorAll('input[type=number]')].some((x) => x.value !== '');
  next.addEventListener('click', () => {
    const page = pages[i];
    const emptyFields = [...page.querySelectorAll('select[required], input[type=date][required]')].filter((x) => !x.value);
    const emptyItems = [...page.querySelectorAll('.item')].filter((it) => !it.hidden && !isAnswered(it));
    if (emptyFields.length) { emptyFields[0].focus(); errEl.textContent = t().stepMissing; return; }
    if (emptyItems.length) { markMissing(form, emptyItems.map((it) => it.dataset.item)); errEl.textContent = t().stepMissing; return; }
    show(i + 1);
  });
  prev.addEventListener('click', () => show(i - 1));
  show(0, false);
  return {
    goToItem(id) { const k = pages.findIndex((pg) => pg.querySelector(`[data-item="${id}"]`)); if (k >= 0) show(k); },
    goToPage: show,
  };
}
const saveBar = () => `
  <div class="savebar"><p class="err" id="err" role="alert"></p><p class="muted small">${t().saveNoteShort}</p>
  <button class="btn" id="save">${t().save}</button></div>`;
function wireForm(kind, submit, doneHash = '#/journey') {
  const form = root.querySelector('#f');
  applyShowIf(form);
  const pager = form.dataset.paged ? setupPager(form) : null;
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
    const label = btn.textContent;
    errEl.textContent = '';
    btn.disabled = true;
    btn.textContent = t().saving;
    try {
      const r = await submit(collect(form, kind), form);
      delete state.draft[location.hash];
      Object.assign(state.me, { stay: r.stay, timeline: r.timeline });
      toast(t().saved);
      go(doneHash);
    } catch (err) {
      btn.disabled = false;
      btn.textContent = label;
      if (err.message === 'incomplete') {
        const missing = err.data.missing || [];
        pager?.goToItem(missing[0]);
        markMissing(form, missing);
        errEl.textContent = t().missing;
      } else {
        pager?.goToPage(0);
        errEl.textContent = errText(err);
      }
    }
  });
}
function slotLabel(i) {
  if (i.slot === 'baseline') return [t().baselineLabel, t().baselineSub];
  if (i.slot === 'end') return [t().endLabel, `${t().endSub} · ${fmtDate(i.open_date)}`];
  const p = practiceFor(i.day_number, totalDays());
  return [t().dayTitle(i.day_number, p ? tx(p.title) : ''), `${fmtDate(i.open_date)}${p?.reinforcement ? ` · ${t().repeatOf(p.day)}` : ''}`];
}
const totalDays = () => (state.me?.timeline || []).filter((x) => x.kind === 'Q2').length;
const prevDay = (iso) => { const d = new Date(`${iso}T00:00:00Z`); d.setUTCDate(d.getUTCDate() - 1); return d.toISOString().slice(0, 10); };
const paras = (arr) => (arr || []).map((p) => `<p>${esc(p)}</p>`).join('');
const QUOTES = { en: ['“', '”'], de: ['„', '“'], fr: ['« ', ' »'], es: ['«', '»'] };
// Quote with language-correct marks; only the first paragraph is shown, the rest is one tap away.
function quoteBlock(parts) {
  const [o, c] = QUOTES[state.lang] || QUOTES.en;
  const ps = (parts || []).map((x, k, a) => `${k === 0 ? o : ''}${x}${k === a.length - 1 ? c : ''}`);
  const rest = ps.slice(1);
  return `<blockquote class="pull"><p>${esc(ps[0] || '')}${rest.length ? `<span class="q-preview-end">…${esc(c.trim())}</span>` : ''}</p>
    ${rest.length ? `<details class="more"><summary>${esc(t().readFull)}</summary>${paras(rest)}</details>` : ''}
    <footer><span class="who">${esc(t().quoteBy)}</span><span class="role">${esc(t().quoteRole)}</span></footer></blockquote>`;
}
function practiceBlock(dayNumber) {
  const p = practiceFor(dayNumber, totalDays());
  if (!p) return `<div class="card note">${esc(t().programmeEnded)}</div>`;
  const steps = (tx(p.snack.steps) || []).map((x) => fillMinutes(x, state.lang, p.minutes));
  return `
    <article class="practice">
      <section class="snack">
        <p class="eyebrow">${t().exercise} <span class="chip">${t().minutesChip(p.minutes)}</span></p>
        <h3>${esc(tx(p.snack.title))}</h3>
        ${timerBlock(p.minutes)}
        ${p.reinforcement ? `<p class="reinforce">${esc(t().reinforceIntro)}</p>` : ''}
        <ol class="steps">${steps.map((x) => `<li>${esc(x)}</li>`).join('')}</ol>
        <p class="repeat">${esc(t().repeatShort)}</p>
        ${p.snack.also ? `<p class="also">${esc(tx(p.snack.also))}</p>` : ''}
      </section>
      <section class="thought">
        <p class="eyebrow">${esc(t().thoughtLabel)}</p>
        ${quoteBlock(tx(p.quote))}
      </section>
      ${dayNumber === 1 ? deeperBlock() : `<p class="deeper-short">${esc(t().deeperShort)}</p>`}
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

function takeHomeBlock(withLabel = true) {
  return `
    <article class="practice">
      <section class="thought">
        ${withLabel ? `<p class="eyebrow">${esc(t().takeHome)}</p>` : ''}
        <h2 class="theme">${esc(tx(TAKE_HOME.title))}</h2>
        ${quoteBlock(tx(TAKE_HOME.quote))}
      </section>
      <section class="snack"><ol class="steps">${tx(TAKE_HOME.steps).map((x) => `<li>${esc(x)}</li>`).join('')}</ol></section>
    </article>`;
}
// ---------- snack timer (records nothing) ----------
const fmtClock = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

function timerBlock(minutes) {
  const opts = [1, 2, 5].map((m) => `<button type="button" class="tm-opt${m === minutes ? ' on' : ''}" data-min="${m}" aria-pressed="${m === minutes}">${t().minutesChip(m)}</button>`).join('');
  return `
      <div class="launcher" id="snack-timer" data-min="${minutes}">
        <button type="button" class="btn tm-start">${esc(t().startTimer(minutes))}</button>
        <div class="tm-len" role="group" aria-label="${esc(t().lengthLabel)}"><span>${esc(t().lengthLabel)}</span>${opts}</div>
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
  const startBtn = box.querySelector('.tm-start');
  let minutes = Number(box.dataset.min);
  box.querySelectorAll('.tm-opt').forEach((b) => b.addEventListener('click', () => {
    minutes = Number(b.dataset.min);
    box.querySelectorAll('.tm-opt').forEach((x) => { x.classList.toggle('on', x === b); x.setAttribute('aria-pressed', String(x === b)); });
    startBtn.textContent = t().startTimer(minutes);
  }));
  startBtn.addEventListener('click', () => openTimer(minutes));
}

async function openTimer(minutes) {
  const ov = document.createElement('div');
  ov.className = 'tm-overlay';
  ov.setAttribute('role', 'dialog');
  ov.setAttribute('aria-modal', 'true');
  ov.setAttribute('aria-label', t().timerLabel);
  const opener = document.activeElement;
  ov.innerHTML = `
    <div class="inward-box">${INWARD}
      <div class="tm-face"><p class="tm-clock" aria-hidden="true">${fmtClock(minutes * 60)}</p><p class="tm-msg">${esc(t().phoneAway)}</p></div>
    </div>
    <p class="sr" role="status" aria-live="polite" id="tm-status">${esc(t().startTimer(minutes))}</p>
    <button type="button" class="btn tm-stop">${esc(t().timerStop)}</button>
    <p class="tm-note">${esc(t().timerNote)}</p>`;
  document.body.appendChild(ov);
  document.body.classList.add('no-scroll');
  const clock = ov.querySelector('.tm-clock');
  const msg = ov.querySelector('.tm-msg');
  const stop = ov.querySelector('.tm-stop');
  let lock = null;
  let tick = null;
  const onKey = (e) => { if (e.key === 'Escape') close(); if (e.key === 'Tab') { e.preventDefault(); stop.focus(); } };
  const close = () => {
    clearInterval(tick);
    lock?.release?.().catch?.(() => {});
    ov.remove();
    document.body.classList.remove('no-scroll');
    window.removeEventListener('hashchange', close);
    document.removeEventListener('keydown', onKey);
    if (opener && document.contains(opener)) opener.focus();
  };
  stop.addEventListener('click', close);
  window.addEventListener('hashchange', close);
  document.addEventListener('keydown', onKey);
  stop.focus();
  gong();
  ov.classList.add('running');
  try { lock = await navigator.wakeLock?.request('screen'); } catch { lock = null; }
  const endAt = Date.now() + minutes * 60000;
  tick = setInterval(() => {
    const left = Math.max(0, Math.round((endAt - Date.now()) / 1000));
    clock.textContent = fmtClock(left);
    if (left === 0) {
      clearInterval(tick);
      ov.classList.remove('running');
      gong();
      try { navigator.vibrate?.(200); } catch { /* ignore */ }
      msg.textContent = t().timerDone;
      ov.querySelector('#tm-status').textContent = t().timerDone;
      stop.textContent = t().timerClose;
    }
  }, 250);
}
const STATUS_ICON = {
  done: '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 10.5l4 4 8-9" fill="none" stroke="currentColor" stroke-width="2"/></svg>',
  open: '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M8 5l5 5-5 5" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>',
  locked: '<svg viewBox="0 0 20 20" aria-hidden="true"><rect x="5" y="9" width="10" height="8" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M7.5 9V6.8a2.5 2.5 0 015 0V9" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>',
  missed: '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M8 5l5 5-5 5" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>',
};

function viewJourney() {
  const { timeline, stay, today, openHour } = state.me;
  if (!timeline.some((i) => i.slot === 'baseline')) return viewBaseline();
  const allDone = timeline.every((i) => i.status === 'done');
  const total = totalDays();
  const todayItem = timeline.find((i) => i.slot !== 'baseline' && i.open_date === today && i.status !== 'locked');
  const dayNo = todayItem?.day_number || timeline.filter((i) => i.kind === 'Q2' && i.open_date <= today).length;
  const row = (i) => {
    const [label, sub] = slotLabel(i);
    const inner = `<span class="row-text"><strong>${esc(label)}</strong><span class="row-sub">${i === todayItem ? `<b class="today-tag">${t().todayRow}</b> · ` : ''}${esc(sub)}</span></span>
      <span class="row-status ${i.status}" title="${esc(t()[`st_${i.status}`])}">${STATUS_ICON[i.status] || ''}<span class="sr">${esc(t()[`st_${i.status}`])}</span></span>`;
    return `<li class="row ${i.status} ${i === todayItem ? 'is-today' : ''}">${i.status === 'locked' ? `<span class="row-link">${inner}</span>` : `<a class="row-link" href="#/q/${i.id}">${inner}</a>`}</li>`;
  };
  const todayCard = todayItem ? (() => {
    const [label, sub] = slotLabel(todayItem);
    const done = todayItem.status === 'done';
    return `<a class="today-card ${done ? 'done' : ''}" href="#/q/${todayItem.id}">
      <span class="today-label">${t().today} · <span class="nowrap">${esc(sub)}</span></span>
      <strong>${esc(label)}</strong>
      <span class="btn ${done ? 'ghost' : ''}">${done ? t().view : t().openToday}</span></a>`;
  })() : '';
  shell(`
    ${allDone ? `<div class="card done-all">${t().allDone}</div>` : todayCard}
    <ol class="rows">${timeline.map(row).join('')}</ol>
    <p class="footnote">${esc(t().dailyFootnote(String(openHour).padStart(2, '0')))}</p>
    <details class="how-below"><summary>${t().howItWorks}</summary><p>${esc(t().heroLine)}</p><p>${esc(t().programmeIntro)}</p><p class="credit">${esc(t().credit)}</p></details>
    <p class="center"><button class="link small" id="logout">${t().logout}</button></p>`, {
    hero: `
      ${stay ? `<p class="kicker">${esc(t().stayRange(fmtDate(stay.arrival_date, { day: 'numeric', month: 'long' }), fmtDate(stay.departure_date, { day: 'numeric', month: 'long', year: 'numeric' })))}</p>` : ''}
      <h1>${t().journeyTitle}</h1>
      ${total && dayNo ? `<div class="progress" role="img" aria-label="${esc(t().dayOf(Math.min(dayNo, total), total))}"><span style="width:${Math.round((Math.min(dayNo, total) / total) * 100)}%"></span></div>
      <p class="kicker">${t().dayOf(Math.min(dayNo, total), total)}</p>` : ''}`,
  });
}
async function viewQuestionnaire(id) {
  let inst;
  try { inst = await api(`/instances/${id}`); } catch { go('#/journey'); return; }
  if (inst.status === 'locked') { go('#/journey'); return; }
  const [label, sub] = slotLabel(inst);
  const ro = inst.status !== 'open';
  const d = state.draft[location.hash] || { answers: {} };
  const daily = inst.kind === 'Q2';
  const isEnd = inst.slot === 'end';
  const ctx = { yesterday: fmtDate(prevDay(inst.open_date), { weekday: 'long', day: 'numeric', month: 'long' }) };
  const statusBadge = `<p class="badge ${inst.status}">${t()[`st_${inst.status}`]}</p>`;

  if (daily) {
    const p = practiceFor(inst.day_number, totalDays());
    const evening = new Date().getHours() >= 17;
    const collapsed = !state.draft[location.hash];
    shell(`
      <div id="practice-view" ${collapsed ? '' : 'hidden'}>
        ${practiceBlock(inst.day_number)}
        <div class="evening"><h2>${t().eveningTitle}</h2>${ro ? statusBadge : `<p>${esc(t().eveningShort)}</p>`}</div>
        <button class="btn ${ro || !evening ? 'ghost' : ''}" id="reveal">${ro ? t().showAnswers : t().openJournalShort}</button>
        <p class="back"><a href="#/journey" class="link small">${t().backToJourney}</a></p>
      </div>
      <div id="journal-view" ${collapsed ? 'hidden' : ''}>
        <p class="back"><button type="button" class="link small" id="to-practice">${t().backToPractice}</button></p>
        <form data-kind="Q2" data-slot="${inst.slot}" id="f" novalidate class="${ro ? 'ro' : ''}">
          ${renderSections('Q2', ro ? inst.answers || {} : d.answers, ro, inst.slot, ctx)}
          ${ro ? '' : `<p class="muted small center jb-note">${t().saveNoteShort}</p>
            <div class="journal-bar"><div class="jb-top"><span class="jb-count" aria-live="polite"></span><span class="jb-line"><span></span></span></div>
            <p class="err" id="err" role="alert"></p><button class="btn" id="save">${t().saveShort}</button></div>`}
        </form>
      </div>`, {
      compact: true,
      hero: `<p class="kicker">${esc(t().dayLabel(inst.day_number))} · ${esc(fmtDate(inst.open_date))}${p?.reinforcement ? ` · ${esc(t().repeatOf(p.day))}` : ''}</p>
        <h1>${esc(p ? tx(p.title) : t().dayLabel(inst.day_number))}</h1>${p ? `<p class="lede theme-line">${esc(tx(p.theme))}</p>` : ''}`,
    });
    wireTimer();
    const pv = root.querySelector('#practice-view');
    const jv = root.querySelector('#journal-view');
    const mast = root.querySelector('.masthead');
    const h1 = mast.querySelector('h1');
    const dayTitle = h1.textContent;
    const showJournal = (on) => {
      jv.hidden = !on; pv.hidden = on;
      mast.classList.toggle('stepped', on);
      h1.textContent = on ? t().journalTitle : dayTitle;
      window.scrollTo(0, 0);
    };
    root.querySelector('#to-practice').addEventListener('click', () => showJournal(false));
    root.querySelector('#reveal').addEventListener('click', () => showJournal(true));
    if (!jv.hidden) { mast.classList.add('stepped'); h1.textContent = t().journalTitle; }
    const form = root.querySelector('#f');
    if (ro) { applyShowIf(form); return; }
    const count = form.querySelector('.jb-count');
    const updateCount = () => {
      const items = [...form.querySelectorAll('.item')].filter((it) => !it.hidden);
      const done = items.filter((it) => it.querySelector('input:checked') || [...it.querySelectorAll('input[type=number]')].some((x) => x.value !== '')).length;
      count.textContent = t().answeredOf(done, items.length);
      form.querySelector('.jb-line span').style.width = `${Math.round((done / Math.max(1, items.length)) * 100)}%`;
      form.querySelector('#save')?.classList.toggle('ghost', done < items.length);
    };
    form.addEventListener('change', () => setTimeout(updateCount));
    form.addEventListener('input', updateCount);
    wireForm('Q2', (answers) => api(`/instances/${id}`, { answers }));
    updateCount();
    return;
  } else if (isEnd && ro) {
    // Departure day, after saving: thank you + take-home card; answers one tap away
    shell(`
      ${takeHomeBlock(false)}
      <button class="btn ghost" id="reveal">${t().showAnswers}</button>
      <form data-kind="Q1" data-slot="end" id="f" novalidate class="ro" hidden>${renderSections('Q1', inst.answers || {}, true, 'end', ctx)}</form>
      <p class="back"><a href="#/journey" class="link small">${t().backToJourney}</a></p>`, {
      compact: true, hero: `<p class="kicker">${esc(sub)}</p><h1>${esc(t().takeHome)}</h1>`,
    });
  } else {
    // Welcome (read-only) or closing questionnaire: one section per step
    const intro = isEnd ? t().endIntro : '';
    shell(`
      ${ro ? statusBadge : ''}
      <form data-kind="Q1" data-slot="${inst.slot}" ${ro ? '' : 'data-paged="1"'} id="f" novalidate class="${ro ? 'ro' : ''}">
        ${ro ? '' : pagerTop()}
        ${renderSections('Q1', ro ? inst.answers || {} : d.answers, ro, inst.slot, ctx, !ro)}
        ${ro ? '' : pagerNav()}
      </form>
      ${ro ? `<p class="back"><a href="#/journey" class="link small">${t().backToJourney}</a></p>` : ''}`, {
      compact: true, hero: `<p class="kicker">${esc(sub)}</p><h1>${esc(isEnd ? t().takeHome : label)}</h1>${intro ? `<p class="lede">${esc(intro)}</p>` : ''}`,
    });
  }
  root.querySelector('#reveal')?.addEventListener('click', (e) => {
    e.currentTarget.remove();
    const f = root.querySelector('#f');
    f.hidden = false;
    f.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
  const form = root.querySelector('#f');
  if (ro) { applyShowIf(form); return; }
  wireForm(inst.kind, (answers) => api(`/instances/${id}`, { answers }), isEnd ? `#/q/${id}` : '#/journey');
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
