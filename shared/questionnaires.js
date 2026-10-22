// Inner Calm study — questionnaire definitions (shared by server and browser).
// Source: "Flywheel 1 brief on meditation", section 18.2 "The exact questionnaire set".
// Q1 = baseline + end of stay (broad anchors). Q2 = daily pulse.
//
// NOTE ON TRANSLATIONS: English is the reference wording from the brief.
// DE/FR/ES are working translations. WHO-5 and PROMIS have official translated
// versions — replace these texts with the official ones before real data collection.

export const LANGS = ['en', 'de', 'fr', 'es'];

const notAtAll_veryMuch = {
  en: ['Not at all', 'Very much'],
  de: ['Überhaupt nicht', 'Sehr'],
  fr: ['Pas du tout', 'Énormément'],
  es: ['Nada', 'Muchísimo'],
};

// WHO-5 labelled response options, value 5 → 0
const who5Labels = {
  en: ['All of the time', 'Most of the time', 'More than half of the time', 'Less than half of the time', 'Some of the time', 'At no time'],
  de: ['Die ganze Zeit', 'Meistens', 'Etwas mehr als die Hälfte der Zeit', 'Etwas weniger als die Hälfte der Zeit', 'Ab und zu', 'Zu keinem Zeitpunkt'],
  fr: ['Tout le temps', 'La plupart du temps', 'Plus de la moitié du temps', 'Moins de la moitié du temps', 'De temps en temps', 'Jamais'],
  es: ['Todo el tiempo', 'La mayor parte del tiempo', 'Más de la mitad del tiempo', 'Menos de la mitad del tiempo', 'De vez en cuando', 'Nunca'],
};

const SCALE_0_5 = { type: 'scale', min: 0, max: 5, anchors: notAtAll_veryMuch };
const WHO5 = { type: 'labelled', min: 0, max: 5, labels: who5Labels, descending: true };
// mPERMA: brief says "validated response scale should be retained exactly".
// PERMA-Profiler uses 0–10; confirm the exact anchors before real data collection.
const SCALE_0_10_PERMA = {
  type: 'scale', min: 0, max: 10,
  anchors: { en: ['Not at all', 'Completely'], de: ['Überhaupt nicht', 'Vollkommen'], fr: ['Pas du tout', 'Complètement'], es: ['Nada', 'Completamente'] },
};
const SCALE_0_10_SLEEP = {
  type: 'scale', min: 0, max: 10,
  anchors: { en: ['Very poorly', 'Extremely well'], de: ['Sehr schlecht', 'Ausgezeichnet'], fr: ['Très mal', 'Extrêmement bien'], es: ['Muy mal', 'Extremadamente bien'] },
};

export const QUESTIONNAIRES = {
  Q1: {
    sections: [
      {
        id: 'who5',
        title: { en: 'Well-being', de: 'Wohlbefinden', fr: 'Bien-être', es: 'Bienestar' },
        prompt: { en: 'Over the last two weeks…', de: 'In den letzten zwei Wochen…', fr: 'Au cours des deux dernières semaines…', es: 'Durante las últimas dos semanas…' },
        response: WHO5,
        items: [
          { id: 'who5_1', text: { en: 'I have felt cheerful and in good spirits.', de: 'war ich froh und guter Laune.', fr: 'je me suis senti(e) bien et de bonne humeur.', es: 'me he sentido alegre y de buen humor.' } },
          { id: 'who5_2', text: { en: 'I have felt calm and relaxed.', de: 'habe ich mich ruhig und entspannt gefühlt.', fr: 'je me suis senti(e) calme et tranquille.', es: 'me he sentido tranquilo/a y relajado/a.' } },
          { id: 'who5_3', text: { en: 'I have felt active and vigorous.', de: 'habe ich mich energisch und aktiv gefühlt.', fr: "je me suis senti(e) plein(e) d'énergie et vigoureux(se).", es: 'me he sentido activo/a y enérgico/a.' } },
          { id: 'who5_4', text: { en: 'I woke up feeling fresh and rested.', de: 'habe ich mich beim Aufwachen frisch und ausgeruht gefühlt.', fr: 'je me suis réveillé(e) frais(che) et dispos(e).', es: 'me he despertado fresco/a y descansado/a.' } },
          { id: 'who5_5', text: { en: 'My daily life has been filled with things that interest me.', de: 'war mein Alltag voller Dinge, die mich interessieren.', fr: 'ma vie quotidienne a été remplie de choses intéressantes.', es: 'mi vida diaria ha estado llena de cosas que me interesan.' } },
        ],
      },
      {
        id: 'promis_mp',
        title: { en: 'Meaning & purpose', de: 'Sinn & Lebenszweck', fr: 'Sens & but', es: 'Sentido y propósito' },
        prompt: { en: 'Thinking about my life…', de: 'Wenn ich über mein Leben nachdenke…', fr: 'En pensant à ma vie…', es: 'Pensando en mi vida…' },
        response: SCALE_0_5,
        items: [
          { id: 'mp_1', text: { en: 'My life has meaning.', de: 'Mein Leben hat einen Sinn.', fr: 'Ma vie a un sens.', es: 'Mi vida tiene sentido.' } },
          { id: 'mp_2', text: { en: 'I have a clear sense of direction in life.', de: 'Ich habe eine klare Richtung in meinem Leben.', fr: "J'ai une idée claire de la direction de ma vie.", es: 'Tengo un claro sentido de dirección en la vida.' } },
          { id: 'mp_3', text: { en: 'I experience deep fulfillment in my life.', de: 'Ich erlebe tiefe Erfüllung in meinem Leben.', fr: 'Je ressens un profond épanouissement dans ma vie.', es: 'Experimento una profunda realización en mi vida.' } },
          { id: 'mp_4', text: { en: 'My life has purpose.', de: 'Mein Leben hat einen Zweck.', fr: 'Ma vie a un but.', es: 'Mi vida tiene un propósito.' } },
        ],
      },
      {
        id: 'growth',
        title: { en: 'Personal growth', de: 'Persönliche Entwicklung', fr: 'Développement personnel', es: 'Crecimiento personal' },
        prompt: { en: 'Over the past 7 days, to what extent…', de: 'Inwieweit trifft in den letzten 7 Tagen Folgendes zu…', fr: 'Au cours des 7 derniers jours, dans quelle mesure…', es: 'En los últimos 7 días, ¿en qué medida…?' },
        response: SCALE_0_5,
        items: [
          { id: 'growth_1', text: { en: 'I learned something important about myself.', de: 'Ich habe etwas Wichtiges über mich selbst gelernt.', fr: "J'ai appris quelque chose d'important sur moi-même.", es: 'Aprendí algo importante sobre mí mismo/a.' } },
          { id: 'growth_2', text: { en: 'I became clearer about what matters most to me.', de: 'Mir ist klarer geworden, was mir am wichtigsten ist.', fr: "J'ai mieux compris ce qui compte le plus pour moi.", es: 'Tengo más claro lo que más me importa.' } },
          { id: 'growth_3', text: { en: 'I felt that I was growing or developing as a person.', de: 'Ich hatte das Gefühl, als Mensch zu wachsen oder mich weiterzuentwickeln.', fr: "J'ai eu le sentiment de grandir ou de me développer en tant que personne.", es: 'Sentí que crecía o me desarrollaba como persona.' } },
        ],
      },
    ],
  },

  Q2: {
    sections: [
      {
        id: 'clarity',
        title: { en: 'Mental clarity', de: 'Geistige Klarheit', fr: 'Clarté mentale', es: 'Claridad mental' },
        prompt: { en: 'Thinking about today, to what extent…', de: 'Wenn Sie an heute denken, inwieweit trifft Folgendes zu…', fr: "En pensant à aujourd'hui, dans quelle mesure…", es: 'Pensando en el día de hoy, ¿en qué medida…?' },
        response: SCALE_0_5,
        items: [
          { id: 'clarity_1', text: { en: 'I felt clear-headed.', de: 'Ich fühlte mich klar im Kopf.', fr: "J'avais les idées claires.", es: 'Tuve la mente despejada.' } },
          { id: 'clarity_2', text: { en: 'I was able to concentrate easily.', de: 'Ich konnte mich leicht konzentrieren.', fr: "J'ai pu me concentrer facilement.", es: 'Pude concentrarme con facilidad.' } },
          { id: 'clarity_3', text: { en: 'My thinking felt sharp.', de: 'Mein Denken war scharf.', fr: 'Ma pensée était vive.', es: 'Mi pensamiento fue ágil.' } },
        ],
      },
      {
        id: 'positive',
        title: { en: 'Positive emotions', de: 'Positive Gefühle', fr: 'Émotions positives', es: 'Emociones positivas' },
        prompt: { en: 'Please answer each item as it relates to your well-being right now.', de: 'Bitte beantworten Sie jede Aussage in Bezug auf Ihr momentanes Wohlbefinden.', fr: 'Veuillez répondre à chaque énoncé en fonction de votre bien-être en ce moment.', es: 'Responda cada afirmación según su bienestar en este momento.' },
        response: SCALE_0_10_PERMA,
        items: [
          { id: 'perma_1', text: { en: 'I am feeling joyful.', de: 'Ich fühle mich freudig.', fr: 'Je me sens joyeux/joyeuse.', es: 'Me siento alegre.' } },
          { id: 'perma_2', text: { en: 'I am feeling positive.', de: 'Ich fühle mich positiv.', fr: 'Je me sens positif/positive.', es: 'Me siento positivo/a.' } },
          { id: 'perma_3', text: { en: 'I am feeling contented.', de: 'Ich fühle mich zufrieden.', fr: 'Je me sens satisfait(e).', es: 'Me siento satisfecho/a.' } },
        ],
      },
      {
        id: 'creativity',
        title: { en: 'Creativity', de: 'Kreativität', fr: 'Créativité', es: 'Creatividad' },
        prompt: { en: 'Thinking about today, to what extent…', de: 'Wenn Sie an heute denken, inwieweit trifft Folgendes zu…', fr: "En pensant à aujourd'hui, dans quelle mesure…", es: 'Pensando en el día de hoy, ¿en qué medida…?' },
        response: SCALE_0_5,
        items: [
          { id: 'creativity_1', text: { en: 'I felt creative.', de: 'Ich fühlte mich kreativ.', fr: "Je me suis senti(e) créatif/créative.", es: 'Me sentí creativo/a.' } },
        ],
      },
      {
        id: 'meditation',
        title: { en: 'Meditation', de: 'Meditation', fr: 'Méditation', es: 'Meditación' },
        items: [
          { id: 'meditated', response: { type: 'yesno' }, text: { en: 'Did you meditate today?', de: 'Haben Sie heute meditiert?', fr: "Avez-vous médité aujourd'hui ?", es: '¿Ha meditado hoy?' } },
          { id: 'meditation_minutes', response: { type: 'number', min: 0, max: 600, unit: { en: 'minutes', de: 'Minuten', fr: 'minutes', es: 'minutos' } }, showIf: { item: 'meditated', equals: 1 },
            text: { en: 'Approximately how many minutes did you meditate today?', de: 'Wie viele Minuten haben Sie heute ungefähr meditiert?', fr: "Combien de minutes environ avez-vous médité aujourd'hui ?", es: '¿Aproximadamente cuántos minutos ha meditado hoy?' } },
        ],
      },
      {
        id: 'sleep',
        title: { en: 'Sleep', de: 'Schlaf', fr: 'Sommeil', es: 'Sueño' },
        response: SCALE_0_10_SLEEP,
        items: [
          { id: 'sleep_quality', text: { en: 'How well did you sleep last night?', de: 'Wie gut haben Sie letzte Nacht geschlafen?', fr: 'Comment avez-vous dormi la nuit dernière ?', es: '¿Qué tan bien durmió anoche?' } },
        ],
      },
    ],
  },
};

export const CLINICS = [
  { id: 'ueberlingen', label: 'Buchinger Wilhelmi Überlingen (Lake Constance)' },
  { id: 'marbella', label: 'Buchinger Wilhelmi Marbella' },
];

/** Flat list of items with their resolved response definition. */
export function itemsOf(kind) {
  const out = [];
  for (const s of QUESTIONNAIRES[kind].sections) {
    for (const it of s.items) out.push({ ...it, section: s.id, response: it.response || s.response });
  }
  return out;
}

/** Validate answers against the definition. Returns { ok, clean, errors }. */
export function validateAnswers(kind, answers) {
  const clean = {};
  const errors = [];
  if (!answers || typeof answers !== 'object') return { ok: false, clean, errors: ['answers missing'] };
  for (const it of itemsOf(kind)) {
    if (it.showIf && Number(answers[it.showIf.item]) !== it.showIf.equals) { clean[it.id] = null; continue; }
    const raw = answers[it.id];
    if (raw === undefined || raw === null || raw === '') { errors.push(it.id); continue; }
    const v = Number(raw);
    const r = it.response;
    const [min, max] = r.type === 'yesno' ? [0, 1] : [r.min, r.max];
    if (!Number.isFinite(v) || v < min || v > max || (r.type !== 'number' && !Number.isInteger(v))) { errors.push(it.id); continue; }
    clean[it.id] = v;
  }
  return { ok: errors.length === 0, clean, errors };
}
