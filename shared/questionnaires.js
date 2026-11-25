// Inner Calm study — questionnaire definitions (shared by server and browser).
// Source: "Flywheel 1 brief on meditation", section 18.2 "The exact questionnaire set".
// Q1 = baseline + end of stay + follow-up one week after departure (broad anchors). Q2 = daily pulse.
// Sections marked only: 'baseline' / 'end' appear at that time point only; the follow-up gets the shared sections.
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
const SCALE_0_5_EXPECT = SCALE_0_5;
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


const choice = (labels) => ({ type: 'choice', options: labels.en.map((_, i) => ({ value: i, label: Object.fromEntries(Object.entries(labels).map(([l, arr]) => [l, arr[i]])) })) });

// Baseline only — meditation background (covariates for the analysis)
const MEDITATION_HABITS = {
  id: 'habits',
  only: 'baseline',
  title: { en: 'Your meditation experience', de: 'Ihre Meditationserfahrung', fr: 'Votre expérience de la méditation', es: 'Su experiencia con la meditación' },
  items: [
    { id: 'med_ever', response: choice({
        en: ['Never', 'I have tried it a few times', 'Occasionally', 'Regularly in the past, but not at present', 'Regularly at present'],
        de: ['Nie', 'Ich habe es ein paar Mal ausprobiert', 'Gelegentlich', 'Früher regelmäßig, derzeit nicht', 'Derzeit regelmäßig'],
        fr: ['Jamais', 'J’ai essayé quelques fois', 'Occasionnellement', 'Régulièrement par le passé, mais plus maintenant', 'Régulièrement en ce moment'],
        es: ['Nunca', 'Lo he probado algunas veces', 'Ocasionalmente', 'Regularmente en el pasado, pero no ahora', 'Regularmente en la actualidad'] }),
      text: { en: 'Have you ever practised meditation?', de: 'Haben Sie schon einmal meditiert?', fr: 'Avez-vous déjà pratiqué la méditation ?', es: '¿Ha practicado alguna vez la meditación?' } },
    { id: 'med_years', showIf: { item: 'med_ever', min: 1 },
      response: { type: 'number', min: 0, max: 80, unit: { en: 'years', de: 'Jahre', fr: 'ans', es: 'años' } },
      text: { en: 'For about how many years have you practised meditation, including breaks? (0 if less than a year)', de: 'Seit wie vielen Jahren meditieren Sie ungefähr, Pausen eingeschlossen? (0, wenn weniger als ein Jahr)', fr: 'Depuis combien d’années environ pratiquez-vous la méditation, pauses comprises ? (0 si moins d’un an)', es: '¿Desde hace cuántos años practica la meditación aproximadamente, incluidas las pausas? (0 si es menos de un año)' } },
    { id: 'med_freq_month', response: choice({
        en: ['Not at all', 'Less than once a week', 'Once or twice a week', 'Three to five times a week', 'Daily or almost daily'],
        de: ['Gar nicht', 'Seltener als einmal pro Woche', 'Ein- bis zweimal pro Woche', 'Drei- bis fünfmal pro Woche', 'Täglich oder fast täglich'],
        fr: ['Pas du tout', 'Moins d’une fois par semaine', 'Une ou deux fois par semaine', 'Trois à cinq fois par semaine', 'Tous les jours ou presque'],
        es: ['Nada', 'Menos de una vez por semana', 'Una o dos veces por semana', 'De tres a cinco veces por semana', 'A diario o casi a diario'] }),
      text: { en: 'In the past month, how often did you meditate?', de: 'Wie oft haben Sie im letzten Monat meditiert?', fr: 'Au cours du dernier mois, à quelle fréquence avez-vous médité ?', es: 'En el último mes, ¿con qué frecuencia meditó?' } },
    { id: 'med_minutes_typical', showIf: { item: 'med_freq_month', min: 1 },
      response: { type: 'number', min: 0, max: 600, unit: { en: 'minutes', de: 'Minuten', fr: 'minutes', es: 'minutos' } },
      text: { en: 'On days when you meditate, how many minutes do you usually meditate?', de: 'Wie viele Minuten meditieren Sie üblicherweise an Tagen, an denen Sie meditieren?', fr: 'Les jours où vous méditez, combien de minutes méditez-vous habituellement ?', es: 'Los días que medita, ¿cuántos minutos suele meditar?' } },
    { id: 'med_style', showIf: { item: 'med_ever', min: 1 }, response: choice({
        en: ['Breath or mindfulness meditation', 'Zen / zazen', 'Mantra meditation (e.g. Transcendental Meditation)', 'Loving-kindness or compassion meditation', 'Body scan or yoga nidra', 'Guided meditation (app or audio)', 'Prayer or contemplative practice', 'Other'],
        de: ['Atem- oder Achtsamkeitsmeditation', 'Zen / Zazen', 'Mantra-Meditation (z. B. Transzendentale Meditation)', 'Liebende-Güte- oder Mitgefühlsmeditation', 'Body-Scan oder Yoga Nidra', 'Geführte Meditation (App oder Audio)', 'Gebet oder kontemplative Praxis', 'Andere'],
        fr: ['Méditation sur la respiration ou de pleine conscience', 'Zen / zazen', 'Méditation avec mantra (p. ex. Méditation transcendantale)', 'Méditation de bienveillance ou de compassion', 'Body scan ou yoga nidra', 'Méditation guidée (application ou audio)', 'Prière ou pratique contemplative', 'Autre'],
        es: ['Meditación de la respiración o mindfulness', 'Zen / zazen', 'Meditación con mantra (p. ej., Meditación Trascendental)', 'Meditación de bondad amorosa o compasión', 'Escaneo corporal o yoga nidra', 'Meditación guiada (app o audio)', 'Oración o práctica contemplativa', 'Otra'] }),
      text: { en: 'Which kind of meditation have you practised most?', de: 'Welche Art von Meditation haben Sie am häufigsten praktiziert?', fr: 'Quel type de méditation avez-vous le plus pratiqué ?', es: '¿Qué tipo de meditación ha practicado más?' } },
    { id: 'med_expectation', response: SCALE_0_5_EXPECT,
      text: { en: 'How much do you expect daily meditation to help you during this stay?', de: 'Wie sehr wird Ihnen Ihrer Erwartung nach die tägliche Meditation während dieses Aufenthalts helfen?', fr: 'Dans quelle mesure pensez-vous que la méditation quotidienne vous aidera pendant ce séjour ?', es: '¿En qué medida espera que la meditación diaria le ayude durante esta estancia?' } },
  ],
};

// Added 25 Nov 2026 — daily: how was today's meditation (1–5 Likert, shown Strongly disagree → Strongly agree)
const AGREE_1_5 = {
  type: 'labelled', min: 1, max: 5, ascending: true,
  labels: {
    en: ['Strongly disagree', 'Disagree', 'Neither agree nor disagree', 'Agree', 'Strongly agree'],
    de: ['Stimme überhaupt nicht zu', 'Stimme nicht zu', 'Weder noch', 'Stimme zu', 'Stimme voll und ganz zu'],
    fr: ['Pas du tout d’accord', 'Pas d’accord', 'Ni d’accord ni pas d’accord', 'D’accord', 'Tout à fait d’accord'],
    es: ['Totalmente en desacuerdo', 'En desacuerdo', 'Ni de acuerdo ni en desacuerdo', 'De acuerdo', 'Totalmente de acuerdo'],
  },
};
// Meditation block (25 Nov 2026). Asked about TODAY in the evening journal and about YESTERDAY
// (the last day of the stay) in the closing questionnaire. Same item ids at both time points.
// A clinic session counts as meditation, so the clinic questions only follow "I meditated".
// "{yesterday}" is replaced in the app by the calendar date of the day before the questionnaire opened.
const W = {
  today: {
    title: { en: 'Your meditation today', de: 'Ihre Meditation heute', fr: 'Votre méditation aujourd’hui', es: 'Su meditación de hoy' },
    gate: { en: 'Did you meditate today (a moment of stillness, a guided meditation or a clinic session)?', de: 'Haben Sie heute meditiert (ein Moment der Stille, eine geführte Meditation oder eine Einheit in der Klinik)?', fr: 'Avez-vous médité aujourd’hui (un instant de quiétude, une méditation guidée ou une séance à la clinique) ?', es: '¿Ha meditado hoy (un momento de quietud, una meditación guiada o una sesión en la clínica)?' },
    yes: { en: 'I meditated today', de: 'Ich habe heute meditiert', fr: 'J’ai médité aujourd’hui', es: 'He meditado hoy' },
    no: { en: 'I didn’t meditate today', de: 'Ich habe heute nicht meditiert', fr: 'Je n’ai pas médité aujourd’hui', es: 'No he meditado hoy' },
    cls: { en: 'Did you take part in a session of the clinic’s meditation programme (seminar or guided meditation)?', de: 'Haben Sie an einer Einheit des Meditationsprogramms der Klinik teilgenommen (Seminar oder geführte Meditation)?', fr: 'Avez-vous participé à une séance du programme de méditation de la clinique (séminaire ou méditation guidée) ?', es: '¿Participó en una sesión del programa de meditación de la clínica (seminario o meditación guiada)?' },
    how: { en: 'How did you experience your meditation today?', de: 'Wie haben Sie Ihre Meditation heute erlebt?', fr: 'Comment avez-vous vécu votre méditation aujourd’hui ?', es: '¿Cómo vivió su meditación de hoy?' },
  },
  yesterday: {
    title: { en: 'Your meditation yesterday', de: 'Ihre Meditation gestern', fr: 'Votre méditation d’hier', es: 'Su meditación de ayer' },
    gate: { en: 'Yesterday ({yesterday}), did you meditate (a moment of stillness, a guided meditation or a clinic session)?', de: 'Haben Sie gestern ({yesterday}) meditiert (ein Moment der Stille, eine geführte Meditation oder eine Einheit in der Klinik)?', fr: 'Hier ({yesterday}), avez-vous médité (un instant de quiétude, une méditation guidée ou une séance à la clinique) ?', es: 'Ayer ({yesterday}), ¿meditó (un momento de quietud, una meditación guiada o una sesión en la clínica)?' },
    yes: { en: 'I meditated yesterday', de: 'Ich habe gestern meditiert', fr: 'J’ai médité hier', es: 'Medité ayer' },
    no: { en: 'I didn’t meditate yesterday', de: 'Ich habe gestern nicht meditiert', fr: 'Je n’ai pas médité hier', es: 'No medité ayer' },
    cls: { en: 'Yesterday, did you take part in a session of the clinic’s meditation programme (seminar or guided meditation)?', de: 'Haben Sie gestern an einer Einheit des Meditationsprogramms der Klinik teilgenommen (Seminar oder geführte Meditation)?', fr: 'Hier, avez-vous participé à une séance du programme de méditation de la clinique (séminaire ou méditation guidée) ?', es: 'Ayer, ¿participó en una sesión del programa de meditación de la clínica (seminario o meditación guiada)?' },
    how: { en: 'How did you experience your meditation yesterday?', de: 'Wie haben Sie Ihre Meditation gestern erlebt?', fr: 'Comment avez-vous vécu votre méditation hier ?', es: '¿Cómo vivió su meditación de ayer?' },
  },
};
const ifMeditated = { item: 'exp_meditated', equals: 1 };
function meditationSections(when, only) {
  const w = W[when];
  return [
    {
      id: `meditation_${when}`, ...(only ? { only } : {}),
      title: w.title,
      items: [
        { id: 'exp_meditated', text: w.gate,
          response: { type: 'choice', options: [{ value: 1, label: w.yes }, { value: 0, label: w.no }] } },
        { id: 'class_attended', showIf: ifMeditated, response: { type: 'yesno' }, text: w.cls },
        { id: 'class_minutes', showIf: { item: 'class_attended', equals: 1 },
          response: { type: 'number', min: 0, max: 600, unit: { en: 'minutes', de: 'Minuten', fr: 'minutes', es: 'minutos' } },
          text: { en: 'Approximately how many minutes in total did those sessions last?', de: 'Wie viele Minuten haben diese Einheiten insgesamt ungefähr gedauert?', fr: 'Combien de minutes environ ces séances ont-elles duré au total ?', es: '¿Aproximadamente cuántos minutos duraron esas sesiones en total?' } },
      ],
    },
    {
      // shown only after "I meditated"; the block disappears otherwise (autohide)
      id: `experience_${when}`, ...(only ? { only } : {}), autohide: true, joinPrev: true,
      prompt: w.how,
      response: AGREE_1_5,
      items: [
        { id: 'exp_immersed', showIf: ifMeditated, text: { en: 'I was fully immersed in my meditation.', de: 'Ich war ganz in meine Meditation vertieft.', fr: 'J’étais pleinement absorbé(e) dans ma méditation.', es: 'Estuve plenamente inmerso/a en mi meditación.' } },
        { id: 'exp_calm', showIf: ifMeditated, text: { en: 'I felt a greater sense of inner calm after the meditation.', de: 'Nach der Meditation spürte ich mehr innere Ruhe.', fr: 'J’ai ressenti un plus grand calme intérieur après la méditation.', es: 'Sentí una mayor calma interior después de la meditación.' } },
        { id: 'exp_body', showIf: ifMeditated, text: { en: 'I felt more connected to my body.', de: 'Ich fühlte mich stärker mit meinem Körper verbunden.', fr: 'Je me suis senti(e) plus connecté(e) à mon corps.', es: 'Me sentí más conectado/a con mi cuerpo.' } },
        { id: 'exp_enriched', showIf: ifMeditated, text: { en: 'The practice of meditation enriched my Buchinger experience.', de: 'Die Meditationspraxis hat meine Zeit bei Buchinger bereichert.', fr: 'La pratique de la méditation a enrichi mon expérience chez Buchinger.', es: 'La práctica de la meditación enriqueció mi experiencia en Buchinger.' } },
        { id: 'exp_again', showIf: ifMeditated, text: { en: 'I plan to meditate again tomorrow.', de: 'Ich habe vor, morgen wieder zu meditieren.', fr: 'Je prévois de méditer à nouveau demain.', es: 'Tengo previsto volver a meditar mañana.' } },
      ],
    },
  ];
}

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
      MEDITATION_HABITS,
      ...meditationSections('yesterday', 'end'),
      {
        id: 'looking_back',
        only: 'end',
        title: { en: 'Looking back', de: 'Rückblick', fr: 'Bilan', es: 'Balance' },
        items: [
          { id: 'med_helped', response: SCALE_0_5,
            text: { en: 'How much did daily meditation help you during this stay?', de: 'Wie sehr hat Ihnen die tägliche Meditation während dieses Aufenthalts geholfen?', fr: 'Dans quelle mesure la méditation quotidienne vous a-t-elle aidé(e) pendant ce séjour ?', es: '¿En qué medida le ayudó la meditación diaria durante esta estancia?' } },
        ],
      },
      {
        id: 'since_stay',
        only: 'followup',
        title: { en: 'Since your stay', de: 'Seit Ihrem Aufenthalt', fr: 'Depuis votre séjour', es: 'Desde su estancia' },
        items: [
          { id: 'med_continued', response: { type: 'yesno' },
            text: { en: 'Have you continued practising meditation?', de: 'Haben Sie weiter meditiert?', fr: 'Avez-vous continué à pratiquer la méditation ?', es: '¿Ha seguido practicando la meditación?' } },
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
          { id: 'clarity_4', text: { en: 'I felt better compared to my usual state of mind.', de: 'Ich fühlte mich besser als in meiner üblichen Verfassung.', fr: 'Je me suis senti(e) mieux que dans mon état d’esprit habituel.', es: 'Me sentí mejor que en mi estado de ánimo habitual.' } },
          { id: 'clarity_5', text: { en: 'I feel mentally clearer than I normally do.', de: 'Ich fühle mich geistig klarer als sonst.', fr: 'Je me sens l’esprit plus clair que d’habitude.', es: 'Me siento mentalmente más despejado/a de lo normal.' } },
          { id: 'creativity_1', text: { en: 'I felt creative.', de: 'Ich fühlte mich kreativ.', fr: "Je me suis senti(e) créatif/créative.", es: 'Me sentí creativo/a.' } },
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
      ...meditationSections('today'),
      {
        id: 'sleep',
        title: { en: 'Sleep', de: 'Schlaf', fr: 'Sommeil', es: 'Sueño' },
        response: SCALE_0_10_SLEEP,
        items: [
          { id: 'sleep_quality', text: { en: 'How well did you sleep last night?', de: 'Wie gut haben Sie letzte Nacht geschlafen?', fr: 'Comment avez-vous dormi la nuit dernière ?', es: '¿Qué tan bien durmió anoche?' } },
          { id: 'dreams_vivid', response: AGREE_1_5, text: { en: 'I experienced more vivid dreams than usual.', de: 'Ich hatte lebhaftere Träume als sonst.', fr: 'J’ai fait des rêves plus intenses que d’habitude.', es: 'Tuve sueños más vívidos de lo habitual.' } },
          { id: 'dreams_recall', response: AGREE_1_5, text: { en: 'I remembered my dreams more clearly than usual.', de: 'Ich konnte mich klarer als sonst an meine Träume erinnern.', fr: 'Je me suis souvenu(e) de mes rêves plus clairement que d’habitude.', es: 'Recordé mis sueños con más claridad de lo habitual.' } },
        ],
      },
    ],
  },
};

// Asked with the clinic on the first step of the welcome questionnaire (added 25 Nov 2026); stored in stays.programme
export const PROGRAMME_QUESTION = {
  en: 'Are you planning to follow the Buchinger fasting programme or one of our nutritional programmes (low-calorie diet, regenerative diet, etc.)?',
  de: 'Planen Sie, das Buchinger Fastenprogramm oder eines unserer Ernährungsprogramme (kalorienreduzierte Kost, regenerative Kost usw.) zu machen?',
  fr: 'Prévoyez-vous de suivre le programme de jeûne Buchinger ou l’un de nos programmes nutritionnels (alimentation hypocalorique, alimentation régénérative, etc.) ?',
  es: '¿Tiene previsto seguir el programa de ayuno Buchinger o uno de nuestros programas nutricionales (dieta baja en calorías, dieta regenerativa, etc.)?',
};
export const PROGRAMMES = [
  { id: 'fasting', label: { en: 'The Buchinger fasting programme', de: 'Das Buchinger Fastenprogramm', fr: 'Le programme de jeûne Buchinger', es: 'El programa de ayuno Buchinger' } },
  { id: 'nutrition', label: { en: 'One of the nutritional programmes (low-calorie diet, regenerative diet, etc.)', de: 'Eines der Ernährungsprogramme (kalorienreduzierte Kost, regenerative Kost usw.)', fr: 'L’un des programmes nutritionnels (alimentation hypocalorique, alimentation régénérative, etc.)', es: 'Uno de los programas nutricionales (dieta baja en calorías, dieta regenerativa, etc.)' } },
  { id: 'undecided', label: { en: 'I don’t know yet', de: 'Ich weiß es noch nicht', fr: 'Je ne sais pas encore', es: 'Todavía no lo sé' } },
];

export const CLINICS = [
  { id: 'ueberlingen', label: 'Buchinger Überlingen (Lake Constance)' },
  { id: 'marbella', label: 'Buchinger Marbella' },
];

export function sectionsOf(kind, slot) {
  return QUESTIONNAIRES[kind].sections.filter((s) => !slot || !s.only || s.only === slot);
}

/** Is a conditional item shown, given the answers so far? */
export function isShown(it, answers) {
  if (!it.showIf) return true;
  const v = answers[it.showIf.item];
  if (v === undefined || v === null || v === '') return false;
  if ('equals' in it.showIf) return Number(v) === it.showIf.equals;
  if ('min' in it.showIf) return Number(v) >= it.showIf.min;
  return true;
}

/** Flat list of items (optionally only those asked at a given slot, e.g. 'baseline' / 'end'). */
export function itemsOf(kind, slot) {
  const out = [];
  for (const s of sectionsOf(kind, slot)) {
    for (const it of s.items) out.push({ ...it, section: s.id, response: it.response || s.response });
  }
  return out;
}

/** Validate answers against the definition. Returns { ok, clean, errors }. */
export function validateAnswers(kind, answers, slot) {
  const clean = {};
  const errors = [];
  if (!answers || typeof answers !== 'object') return { ok: false, clean, errors: ['answers missing'] };
  for (const it of itemsOf(kind, slot)) {
    if (!isShown(it, { ...answers, ...clean })) { clean[it.id] = null; continue; }
    const raw = answers[it.id];
    if (raw === undefined || raw === null || raw === '') { errors.push(it.id); continue; }
    const v = Number(raw);
    const r = it.response;
    if (r.type === 'choice') {
      if (!r.options.some((o) => o.value === v)) { errors.push(it.id); continue; }
      clean[it.id] = v;
      continue;
    }
    const [min, max] = r.type === 'yesno' ? [0, 1] : [r.min, r.max];
    if (!Number.isFinite(v) || v < min || v > max || (r.type !== 'number' && !Number.isInteger(v))) { errors.push(it.id); continue; }
    clean[it.id] = v;
  }
  return { ok: errors.length === 0, clean, errors };
}
