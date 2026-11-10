// Inner Calm — meditation snacks
// Developed with Gilbert Grimeau, meditation teacher at Buchinger Wilhelmi (meeting of 9 Nov 2026),
// with daily thoughts from Father Niklaus Brantschen SJ, lecture "Fasting and Silence: Twin Companions".
//
// Meditation snacks work like exercise snacks: very short practices, repeated as often as possible
// through the day (every wait is an opportunity). No special place, cushion or posture is needed.
//   Days 1–3 → 1-minute snacks · days 4–6 → 2 minutes · day 7 onwards → 5 minutes.
// Days 1–8 are the core programme. From day 9 the stay is open-ended: days 2–8 repeat in a cycle,
// labelled "Reinforcement", for as long as the guest is in the clinic. Nothing refers to breaking
// the fast, because stays and fast lengths differ.
// Longer, expert-level practice is not in the app: it is the clinic's meditation programme
// (seminars and daily guided meditations).
//
// English is the reference text. DE/FR/ES are working translations; the German excerpts should
// ideally be checked against Father Brantschen's original lecture.

export const PROGRAMME_AUTHOR = 'Niklaus Brantschen SJ';
export const CORE_DAYS = 8;
export const snackMinutes = (dayNumber) => (dayNumber <= 3 ? 1 : dayNumber <= 6 ? 2 : 5);

// "{n}" / "{N}" in snack steps → "2 minutes" / "2 minutes" (capitalised where the language needs it).
const UNIT = { en: ['minute', 'minutes'], de: ['Minute', 'Minuten'], fr: ['minute', 'minutes'], es: ['minuto', 'minutos'] };
const WORD = { en: ['one', 'two', 'five'], de: ['eine', 'zwei', 'fünf'], fr: ['une', 'deux', 'cinq'], es: ['un', 'dos', 'cinco'] };
export function minutesText(lang, n) {
  const u = UNIT[lang] || UNIT.en;
  const w = (WORD[lang] || WORD.en)[[1, 2, 5].indexOf(n)];
  return `${w ?? n} ${n === 1 ? u[0] : u[1]}`;
}
export const fillMinutes = (text, lang, n) => text
  .replaceAll('{n}', minutesText(lang, n))
  .replaceAll('{N}', minutesText(lang, n).replace(/^./, (c) => c.toUpperCase()));

export const PROGRAMME = [
  {
    day: 1,
    title: {"en":"Stopping","de":"Innehalten","fr":"S'arrêter","es":"Detenerse"},
    theme: {"en":"Fasting as an invitation to silence.","de":"Fasten als Einladung zur Stille.","fr":"Le jeûne comme invitation au silence.","es":"El ayuno como invitación al silencio."},
    quote: {
      en: ["Fasting is generally understood as abstaining from food for a certain period. But fasting has another dimension, one that is less easily measured.","Fasting is also an invitation to silence.","Silence is not simply the absence of noise. And fasting is not simply the absence of food."],
      de: ["Unter Fasten versteht man gewöhnlich den Verzicht auf Nahrung für eine bestimmte Zeit. Doch Fasten hat noch eine andere Dimension, eine, die sich weniger leicht messen lässt.","Fasten ist auch eine Einladung zur Stille.","Stille ist nicht einfach die Abwesenheit von Lärm. Und Fasten ist nicht einfach die Abwesenheit von Nahrung."],
      fr: ["On entend généralement par jeûne le fait de s'abstenir de nourriture pendant un certain temps. Mais le jeûne a une autre dimension, moins facile à mesurer.","Le jeûne est aussi une invitation au silence.","Le silence n'est pas simplement l'absence de bruit. Et le jeûne n'est pas simplement l'absence de nourriture."],
      es: ["Por ayuno se entiende generalmente abstenerse de comer durante un tiempo determinado. Pero el ayuno tiene otra dimensión, menos fácil de medir.","El ayuno es también una invitación al silencio.","El silencio no es simplemente la ausencia de ruido. Y el ayuno no es simplemente la ausencia de comida."],
    },
    snack: {
      title: {"en":"While you wait","de":"Beim Warten","fr":"En attendant","es":"Mientras espera"},
      steps: {
        en: ["Whenever you wait today (for the nurse, the doctor, the bus), sit down. You do not need to close your eyes.","Breathe in, breathe out. Tell yourself silently: “I breathe in, I breathe out.”","Your mind will wander. That is normal: gently come back to the breath.","After {n}, carry on with your day, phone included.","Prefer not to focus on the breath? Simply notice what is around you instead: sounds, people, light."],
        de: ["Wann immer Sie heute warten (auf die Pflegekraft, den Arzt, den Bus), setzen Sie sich. Sie müssen die Augen nicht schließen.","Atmen Sie ein, atmen Sie aus. Sagen Sie innerlich: „Ich atme ein, ich atme aus.“","Ihre Gedanken werden abschweifen. Das ist normal: Kehren Sie sanft zum Atem zurück.","Nach {n} machen Sie mit Ihrem Tag weiter, auch mit Ihrem Telefon.","Lieber nicht auf den Atem achten? Nehmen Sie stattdessen einfach wahr, was um Sie herum ist: Geräusche, Menschen, Licht."],
        fr: ["Chaque fois que vous attendez aujourd’hui (l’infirmière, le médecin, le bus), asseyez-vous. Inutile de fermer les yeux.","Inspirez, expirez. Dites-vous intérieurement : « J’inspire, j’expire. »","Votre esprit va vagabonder. C’est normal : revenez doucement à la respiration.","Après {n}, reprenez le cours de votre journée, téléphone compris.","Vous préférez ne pas vous concentrer sur la respiration ? Remarquez simplement ce qui vous entoure : sons, personnes, lumière."],
        es: ["Siempre que hoy tenga que esperar (a la enfermera, al médico, el autobús), siéntese. No hace falta cerrar los ojos.","Inspire, espire. Dígase en silencio: «Inspiro, espiro».","Su mente se distraerá. Es normal: vuelva suavemente a la respiración.","Después de {n}, siga con su día, teléfono incluido.","¿Prefiere no centrarse en la respiración? Simplemente observe lo que le rodea: sonidos, personas, luz."],
      },
    },
  },
  {
    day: 2,
    title: {"en":"The golden cage","de":"Der goldene Käfig","fr":"La cage dorée","es":"La jaula de oro"},
    theme: {"en":"Creating space from our habits.","de":"Abstand zu unseren Gewohnheiten gewinnen.","fr":"Prendre de la distance avec nos habitudes.","es":"Crear espacio frente a nuestros hábitos."},
    quote: {
      en: ["The parrot was given the finest food, the best care and every possible comfort. Nothing was missing, or so the king believed.","Yet the parrot said: ‘I want to be free.’","His brothers in the forest eventually showed him what he needed to do. They showed him the way to freedom.","We do not always discover the path to freedom by thinking about it. Sometimes, we need others to show us how to live differently."],
      de: ["Der Papagei bekam das feinste Futter, die beste Pflege und jeden erdenklichen Komfort. Es fehlte ihm an nichts – so glaubte zumindest der König.","Doch der Papagei sagte: „Ich will frei sein.“","Seine Brüder im Wald zeigten ihm schließlich, was er tun musste. Sie zeigten ihm den Weg in die Freiheit.","Den Weg zur Freiheit finden wir nicht immer durch Nachdenken. Manchmal brauchen wir andere, die uns zeigen, wie man anders leben kann."],
      fr: ["Le perroquet recevait la meilleure nourriture, les meilleurs soins et tout le confort possible. Il ne lui manquait rien – du moins le roi le croyait-il.","Pourtant, le perroquet dit : « Je veux être libre. »","Ses frères de la forêt finirent par lui montrer ce qu’il devait faire. Ils lui montrèrent le chemin de la liberté.","Nous ne découvrons pas toujours le chemin de la liberté en y réfléchissant. Parfois, nous avons besoin que d’autres nous montrent comment vivre autrement."],
      es: ["Al loro le daban la mejor comida, los mejores cuidados y todas las comodidades posibles. No le faltaba nada, o eso creía el rey.","Sin embargo, el loro dijo: «Quiero ser libre».","Sus hermanos del bosque acabaron mostrándole lo que debía hacer. Le mostraron el camino hacia la libertad.","No siempre descubrimos el camino hacia la libertad pensando en ello. A veces necesitamos que otros nos muestren cómo vivir de otra manera."],
    },
    snack: {
      title: {"en":"Before the phone","de":"Vor dem Telefon","fr":"Avant le téléphone","es":"Antes del teléfono"},
      steps: {
        en: ["Today, notice the moment your hand reaches for your phone while you wait.","Before you pick it up, take {n}: breathe in, breathe out.","Notice the impulse. Where do you feel it in the body?","Afterwards, decide freely. Taking the phone is allowed. You simply chose it."],
        de: ["Bemerken Sie heute den Moment, in dem Ihre Hand beim Warten zum Telefon greift.","Bevor Sie es nehmen, gönnen Sie sich {n}: einatmen, ausatmen.","Nehmen Sie den Impuls wahr. Wo spüren Sie ihn im Körper?","Danach entscheiden Sie frei. Das Telefon zu nehmen ist erlaubt. Sie haben es einfach gewählt."],
        fr: ["Aujourd’hui, remarquez le moment où votre main cherche votre téléphone pendant que vous attendez.","Avant de le prendre, accordez-vous {n} : inspirez, expirez.","Observez l’impulsion. Où la ressentez-vous dans le corps ?","Ensuite, décidez librement. Prendre le téléphone est permis. Vous l’avez simplement choisi."],
        es: ["Hoy, observe el momento en que su mano busca el teléfono mientras espera.","Antes de cogerlo, regálese {n}: inspire, espire.","Observe el impulso. ¿Dónde lo siente en el cuerpo?","Después, decida libremente. Coger el teléfono está permitido. Simplemente lo ha elegido."],
      },
    },
  },
  {
    day: 3,
    title: {"en":"Turning inward","de":"Sich nach innen wenden","fr":"Se tourner vers l’intérieur","es":"Volverse hacia dentro"},
    theme: {"en":"From external stimulation towards inner experience.","de":"Von äußeren Reizen zum inneren Erleben.","fr":"Des stimulations extérieures vers l’expérience intérieure.","es":"De los estímulos externos a la experiencia interior."},
    quote: {
      en: ["In ordinary life, we are constantly occupied with what comes from outside.","We eat, consume, communicate, work, respond to demands and seek stimulation.","Fasting interrupts one of the most fundamental of these activities. This creates an opportunity.","It may become easier to withdraw from constant activity, turn our attention inward and spend time with ourselves."],
      de: ["Im gewöhnlichen Leben sind wir ständig mit dem beschäftigt, was von außen kommt.","Wir essen, konsumieren, kommunizieren, arbeiten, reagieren auf Anforderungen und suchen Anregung.","Das Fasten unterbricht eine der grundlegendsten dieser Tätigkeiten. Darin liegt eine Chance.","Es kann leichter werden, sich aus der ständigen Aktivität zurückzuziehen, die Aufmerksamkeit nach innen zu richten und Zeit mit sich selbst zu verbringen."],
      fr: ["Dans la vie ordinaire, nous sommes constamment occupés par ce qui vient de l’extérieur.","Nous mangeons, consommons, communiquons, travaillons, répondons à des sollicitations et cherchons des stimulations.","Le jeûne interrompt l’une des plus fondamentales de ces activités. Cela ouvre une possibilité.","Il peut devenir plus facile de se retirer de l’activité permanente, de tourner son attention vers l’intérieur et de passer du temps avec soi-même."],
      es: ["En la vida cotidiana estamos constantemente ocupados con lo que viene de fuera.","Comemos, consumimos, nos comunicamos, trabajamos, respondemos a exigencias y buscamos estímulos.","El ayuno interrumpe una de las más fundamentales de estas actividades. Esto crea una oportunidad.","Puede resultar más fácil retirarse de la actividad constante, dirigir la atención hacia dentro y pasar tiempo con uno mismo."],
    },
    snack: {
      title: {"en":"Just noticing","de":"Einfach wahrnehmen","fr":"Simplement remarquer","es":"Solo observar"},
      steps: {
        en: ["Today, try the other way in: instead of the breath, let whatever you perceive be the focus.","People passing by, a smell, sounds, the light. Notice them without judging or analysing.","If you catch yourself thinking about something, notice that too, and come back to what is here.","That is enough. Repeat it as often as you like."],
        de: ["Probieren Sie heute den anderen Weg: Statt des Atems ist alles, was Sie wahrnehmen, der Fokus.","Vorbeigehende Menschen, ein Geruch, Geräusche, das Licht. Nehmen Sie sie wahr, ohne zu bewerten oder zu analysieren.","Wenn Sie merken, dass Sie über etwas nachdenken, nehmen Sie auch das wahr und kehren Sie zu dem zurück, was da ist.","Das genügt. Wiederholen Sie das, so oft Sie mögen."],
        fr: ["Aujourd’hui, essayez l’autre voie : au lieu de la respiration, laissez tout ce que vous percevez devenir le centre de votre attention.","Des personnes qui passent, une odeur, des sons, la lumière. Remarquez-les sans juger ni analyser.","Si vous vous surprenez à penser à quelque chose, remarquez-le aussi, et revenez à ce qui est là.","C’est suffisant. Répétez aussi souvent que vous le souhaitez."],
        es: ["Hoy pruebe el otro camino: en lugar de la respiración, deje que todo lo que percibe sea el foco.","Personas que pasan, un olor, sonidos, la luz. Obsérvelos sin juzgar ni analizar.","Si se sorprende pensando en algo, obsérvelo también y vuelva a lo que está aquí.","Es suficiente. Repítalo tantas veces como quiera."],
      },
    },
  },
  {
    day: 4,
    title: {"en":"You are allowed to be silent","de":"Sie dürfen schweigen","fr":"Vous avez le droit de vous taire","es":"Puede permitirse el silencio"},
    theme: {"en":"Silence as permission rather than discipline.","de":"Stille als Erlaubnis, nicht als Pflicht.","fr":"Le silence comme permission plutôt que comme discipline.","es":"El silencio como permiso, no como disciplina."},
    quote: {
      en: ["Rules and prohibitions are often insufficient. A sign asking people to remain quiet may reduce noise, but it cannot create a meaningful experience of silence.","The essential difference lies in our attitude.","Not: ‘You must be silent.’ But rather: ‘You are allowed to be silent.’","You are allowed to stop speaking. You are allowed to withdraw for a moment from the demands of everyday life."],
      de: ["Regeln und Verbote reichen oft nicht aus. Ein Schild, das um Ruhe bittet, mag den Lärm verringern, aber es kann keine bedeutsame Erfahrung von Stille schaffen.","Der entscheidende Unterschied liegt in unserer Haltung.","Nicht: „Du musst schweigen.“ Sondern: „Du darfst schweigen.“","Du darfst aufhören zu sprechen. Du darfst dich für einen Moment von den Anforderungen des Alltags zurückziehen."],
      fr: ["Les règles et les interdits sont souvent insuffisants. Un panneau demandant le silence peut réduire le bruit, mais il ne peut pas créer une véritable expérience du silence.","La différence essentielle tient à notre attitude.","Non pas : « Tu dois te taire. » Mais plutôt : « Tu as le droit de te taire. »","Tu as le droit de cesser de parler. Tu as le droit de te retirer un moment des exigences du quotidien."],
      es: ["Las normas y prohibiciones a menudo no bastan. Un cartel que pide silencio puede reducir el ruido, pero no puede crear una experiencia significativa del silencio.","La diferencia esencial está en nuestra actitud.","No: «Tienes que callar». Sino: «Puedes permitirte callar».","Puedes dejar de hablar. Puedes retirarte un momento de las exigencias de la vida cotidiana."],
    },
    snack: {
      title: {"en":"Chosen silence","de":"Gewählte Stille","fr":"Le silence choisi","es":"Silencio elegido"},
      steps: {
        en: ["Today your moment of stillness lasts {n}. Wherever you are is the right place: no special room, cushion or posture.","Remind yourself: I do not have to be silent. I am allowed to be silent.","Rest with the breath, or simply notice what is around you.","Still feels long? One minute, many times a day, is just as good."],
        de: ["Heute dauert Ihr Moment der Stille {n}. Wo Sie gerade sind, ist der richtige Ort: kein besonderer Raum, kein Kissen, keine bestimmte Haltung.","Erinnern Sie sich: Ich muss nicht schweigen. Ich darf schweigen.","Verweilen Sie beim Atem oder nehmen Sie einfach wahr, was um Sie herum ist.","Fühlt es sich noch lang an? Eine Minute, oft am Tag, ist genauso gut."],
        fr: ["Aujourd’hui, votre instant de quiétude dure {n}. Là où vous êtes est le bon endroit : pas de pièce, de coussin ni de posture particulière.","Rappelez-vous : je ne suis pas obligé(e) de me taire. J’ai le droit de me taire.","Restez avec la respiration, ou remarquez simplement ce qui vous entoure.","Cela vous semble encore long ? Une minute, plusieurs fois par jour, c’est tout aussi bien."],
        es: ["Hoy su momento de quietud dura {n}. Donde esté es el lugar adecuado: sin sala, cojín ni postura especial.","Recuérdese: no tengo que estar en silencio. Se me permite estar en silencio.","Quédese con la respiración o simplemente observe lo que le rodea.","¿Todavía le parece largo? Un minuto, muchas veces al día, es igual de bueno."],
      },
      also: {"en":"Also today: on one of your walks, do not talk. Notice your feet, the forest, the sounds.","de":"Außerdem heute: Sprechen Sie bei einem Ihrer Spaziergänge nicht. Spüren Sie Ihre Füße, den Wald, die Geräusche.","fr":"Aussi aujourd’hui : lors d’une de vos promenades, ne parlez pas. Remarquez vos pieds, la forêt, les sons.","es":"También hoy: en uno de sus paseos, no hable. Observe sus pies, el bosque, los sonidos."},
    },
  },
  {
    day: 5,
    title: {"en":"Cultivating silence","de":"Stille pflegen","fr":"Cultiver le silence","es":"Cultivar el silencio"},
    theme: {"en":"Silence is something we practise.","de":"Stille ist etwas, das wir üben.","fr":"Le silence est quelque chose qui se pratique.","es":"El silencio es algo que se practica."},
    quote: {
      en: ["We often imagine silence as something that can be created by removing noise. But a person can sit in a perfectly quiet room and still experience a great deal of inner agitation.","Consider a garden. Building a fence around it may protect it from outside disturbances. But the fence alone will not make vegetables grow.","Silence requires similar attention. It must be cultivated."],
      de: ["Wir stellen uns Stille oft als etwas vor, das entsteht, wenn man den Lärm entfernt. Doch man kann in einem vollkommen ruhigen Raum sitzen und dennoch große innere Unruhe erleben.","Denken Sie an einen Garten. Ein Zaun mag ihn vor Störungen von außen schützen. Doch der Zaun allein lässt kein Gemüse wachsen.","Stille braucht eine ähnliche Aufmerksamkeit. Sie will gepflegt werden."],
      fr: ["Nous imaginons souvent le silence comme quelque chose que l’on obtient en supprimant le bruit. Mais on peut être assis dans une pièce parfaitement calme et ressentir pourtant une grande agitation intérieure.","Pensez à un jardin. Une clôture peut le protéger des perturbations extérieures. Mais la clôture seule ne fera pas pousser les légumes.","Le silence demande une attention semblable. Il doit être cultivé."],
      es: ["A menudo imaginamos el silencio como algo que se crea eliminando el ruido. Pero una persona puede estar sentada en una habitación perfectamente tranquila y, aun así, sentir una gran agitación interior.","Piense en un huerto. Una valla puede protegerlo de las molestias externas. Pero la valla por sí sola no hará crecer las verduras.","El silencio requiere una atención parecida. Hay que cultivarlo."],
    },
    snack: {
      title: {"en":"Watching thoughts pass","de":"Gedanken vorüberziehen lassen","fr":"Regarder passer les pensées","es":"Ver pasar los pensamientos"},
      steps: {
        en: ["Just as the body takes a rest, the mind can take one too.","Sit for {n}. Begin with a few breaths.","Notice thoughts as they appear. Do not stop them, do not follow them. Let them pass like clouds.","Each time you notice you have drifted off, that moment of noticing is the practice."],
        de: ["So wie der Körper eine Pause macht, kann auch der Geist eine machen.","Sitzen Sie {n}. Beginnen Sie mit ein paar Atemzügen.","Nehmen Sie Gedanken wahr, wenn sie auftauchen. Halten Sie sie nicht auf, folgen Sie ihnen nicht. Lassen Sie sie wie Wolken vorüberziehen.","Jedes Mal, wenn Sie merken, dass Sie abgeschweift sind, ist genau dieser Moment des Bemerkens die Übung."],
        fr: ["Comme le corps prend une pause, l’esprit peut en prendre une aussi.","Asseyez-vous {n}. Commencez par quelques respirations.","Remarquez les pensées quand elles apparaissent. Ne les arrêtez pas, ne les suivez pas. Laissez-les passer comme des nuages.","Chaque fois que vous remarquez que vous vous êtes égaré(e), ce moment où vous le remarquez est la pratique."],
        es: ["Así como el cuerpo se toma un descanso, la mente también puede tomárselo.","Siéntese {n}. Empiece con unas cuantas respiraciones.","Observe los pensamientos cuando aparezcan. No los detenga, no los siga. Déjelos pasar como nubes.","Cada vez que note que se ha distraído, ese momento de darse cuenta es la práctica."],
      },
    },
  },
  {
    day: 6,
    title: {"en":"The silence behind silence","de":"Die Stille hinter der Stille","fr":"Le silence derrière le silence","es":"El silencio detrás del silencio"},
    theme: {"en":"External silence and inner silence are not the same thing.","de":"Äußere und innere Stille sind nicht dasselbe.","fr":"Le silence extérieur et le silence intérieur ne sont pas la même chose.","es":"El silencio exterior y el silencio interior no son lo mismo."},
    quote: {
      en: ["The absence of external noise does not guarantee inner peace.","We know what it feels like when the noise of the world disappears. But is silence merely a feeling? Or does it open onto something deeper?","Perhaps there is such a thing as the silence behind silence."],
      de: ["Die Abwesenheit von äußerem Lärm garantiert noch keinen inneren Frieden.","Wir kennen das Gefühl, wenn der Lärm der Welt verschwindet. Doch ist Stille nur ein Gefühl? Oder öffnet sie sich zu etwas Tieferem?","Vielleicht gibt es so etwas wie die Stille hinter der Stille."],
      fr: ["L’absence de bruit extérieur ne garantit pas la paix intérieure.","Nous savons ce que l’on ressent quand le bruit du monde disparaît. Mais le silence n’est-il qu’un sentiment ? Ou ouvre-t-il sur quelque chose de plus profond ?","Peut-être existe-t-il quelque chose comme le silence derrière le silence."],
      es: ["La ausencia de ruido exterior no garantiza la paz interior.","Sabemos lo que se siente cuando el ruido del mundo desaparece. Pero ¿es el silencio solo un sentimiento? ¿O se abre a algo más profundo?","Quizá exista algo así como el silencio detrás del silencio."],
    },
    snack: {
      title: {"en":"Listening","de":"Lauschen","fr":"Écouter","es":"Escuchar"},
      steps: {
        en: ["Sit for {n}, eyes open or closed.","First, notice sounds close to you. Then sounds further away.","Do not label them as pleasant or unpleasant. Just hear them.","At the end, notice the quiet between the sounds."],
        de: ["Sitzen Sie {n}, mit offenen oder geschlossenen Augen.","Nehmen Sie zuerst Geräusche in Ihrer Nähe wahr. Dann Geräusche weiter weg.","Bewerten Sie sie nicht als angenehm oder unangenehm. Hören Sie sie einfach.","Nehmen Sie am Ende die Stille zwischen den Geräuschen wahr."],
        fr: ["Asseyez-vous {n}, les yeux ouverts ou fermés.","Remarquez d’abord les sons proches de vous. Puis les sons plus lointains.","Ne les qualifiez pas d’agréables ou de désagréables. Entendez-les, simplement.","À la fin, remarquez le calme entre les sons."],
        es: ["Siéntese {n}, con los ojos abiertos o cerrados.","Primero, observe los sonidos cercanos. Luego, los más lejanos.","No los califique de agradables o desagradables. Simplemente escúchelos.","Al final, observe la quietud entre los sonidos."],
      },
    },
  },
  {
    day: 7,
    title: {"en":"A minute of eternity","de":"Eine Minute Ewigkeit","fr":"Une minute d’éternité","es":"Un minuto de eternidad"},
    theme: {"en":"Experiencing the present moment.","de":"Den gegenwärtigen Moment erleben.","fr":"Faire l’expérience du moment présent.","es":"Vivir el momento presente."},
    quote: {
      en: ["Otto Buchinger described fasting with a remarkable phrase: ‘Fasting is a minute of eternity in silence.’","In moments of deep silence, our relationship with time can change. We are no longer concerned with what has happened or what must happen next.","We are simply there."],
      de: ["Otto Buchinger beschrieb das Fasten mit einem bemerkenswerten Satz: „Fasten ist eine Minute Ewigkeit in der Stille.“","In Momenten tiefer Stille kann sich unser Verhältnis zur Zeit verändern. Wir sind nicht mehr mit dem beschäftigt, was geschehen ist oder was als Nächstes geschehen muss.","Wir sind einfach da."],
      fr: ["Otto Buchinger a décrit le jeûne par une formule remarquable : « Le jeûne est une minute d’éternité dans le silence. »","Dans les moments de silence profond, notre rapport au temps peut changer. Nous ne nous préoccupons plus de ce qui s’est passé ni de ce qui doit arriver ensuite.","Nous sommes simplement là."],
      es: ["Otto Buchinger describió el ayuno con una frase extraordinaria: «El ayuno es un minuto de eternidad en silencio».","En los momentos de silencio profundo, nuestra relación con el tiempo puede cambiar. Ya no nos preocupa lo que ha pasado ni lo que tiene que pasar después.","Simplemente estamos ahí."],
    },
    snack: {
      title: {"en":"In the present","de":"In der Gegenwart","fr":"Dans le présent","es":"En el presente"},
      steps: {
        en: ["Today your moment of stillness lasts {n}. Sit wherever you are.","Rest with the breath, or with whatever you perceive.","When thoughts about the past or the future appear, notice them, and return to what is happening now.","Keep the one-minute moments going too: every wait is still an opportunity."],
        de: ["Heute dauert Ihr Moment der Stille {n}. Setzen Sie sich, wo Sie gerade sind.","Verweilen Sie beim Atem oder bei dem, was Sie wahrnehmen.","Wenn Gedanken an Vergangenheit oder Zukunft auftauchen, nehmen Sie sie wahr und kehren Sie zu dem zurück, was jetzt geschieht.","Behalten Sie auch die einminütigen Momente der Stille bei: Jedes Warten bleibt eine Gelegenheit."],
        fr: ["Aujourd’hui, votre instant de quiétude dure {n}. Asseyez-vous là où vous êtes.","Restez avec la respiration, ou avec ce que vous percevez.","Quand des pensées sur le passé ou l’avenir apparaissent, remarquez-les, puis revenez à ce qui se passe maintenant.","Continuez aussi les instants d’une minute : chaque attente reste une occasion."],
        es: ["Hoy su momento de quietud dura {n}. Siéntese donde esté.","Quédese con la respiración o con lo que percibe.","Cuando aparezcan pensamientos sobre el pasado o el futuro, obsérvelos y vuelva a lo que está ocurriendo ahora.","Siga también con los momentos de un minuto: cada espera sigue siendo una oportunidad."],
      },
    },
  },
  {
    day: 8,
    title: {"en":"Protecting silence","de":"Stille schützen","fr":"Protéger le silence","es":"Proteger el silencio"},
    theme: {"en":"Silence as something worth protecting.","de":"Stille als etwas Schützenswertes.","fr":"Le silence, quelque chose qui mérite d’être protégé.","es":"El silencio como algo que merece ser protegido."},
    quote: {
      en: ["Modern societies are filled with noise. There is a growing need for places where people can escape the constant demands of modern life.","Places where silence is not an accidental absence of activity but something deliberately protected.","The Danish philosopher Søren Kierkegaard suggested that, if he were a physician, his advice would be simple: ‘Create silence.’"],
      de: ["Moderne Gesellschaften sind voller Lärm. Es wächst das Bedürfnis nach Orten, an denen Menschen den ständigen Anforderungen des modernen Lebens entkommen können.","Orte, an denen Stille nicht zufällige Abwesenheit von Aktivität ist, sondern etwas bewusst Geschütztes.","Der dänische Philosoph Søren Kierkegaard meinte, wäre er Arzt, so wäre sein Rat ganz einfach: „Schaffe Schweigen.“"],
      fr: ["Les sociétés modernes sont remplies de bruit. Le besoin de lieux où l’on peut échapper aux exigences constantes de la vie moderne ne cesse de grandir.","Des lieux où le silence n’est pas une absence fortuite d’activité, mais quelque chose de délibérément protégé.","Le philosophe danois Søren Kierkegaard disait que, s’il était médecin, son conseil serait simple : « Créez le silence. »"],
      es: ["Las sociedades modernas están llenas de ruido. Crece la necesidad de lugares donde las personas puedan escapar de las exigencias constantes de la vida moderna.","Lugares donde el silencio no sea una ausencia accidental de actividad, sino algo protegido deliberadamente.","El filósofo danés Søren Kierkegaard afirmaba que, si fuera médico, su consejo sería sencillo: «Cread silencio»."],
    },
    snack: {
      title: {"en":"A protected moment","de":"Ein geschützter Moment","fr":"Un moment protégé","es":"Un momento protegido"},
      steps: {
        en: ["Choose a moment today and protect it for {n}: nothing scheduled, no one waiting for you.","Sit, breathe, and stay with whatever is present: breath, body, sounds, thoughts.","Then notice which moments of your day suit a moment of stillness best: waking up, waiting, walking, meals. These are the moments you can keep at home."],
        de: ["Wählen Sie heute einen Moment und schützen Sie ihn {n} lang: nichts geplant, niemand wartet auf Sie.","Sitzen Sie, atmen Sie und bleiben Sie bei dem, was da ist: Atem, Körper, Geräusche, Gedanken.","Bemerken Sie dann, welche Momente Ihres Tages am besten zu einem Moment der Stille passen: das Aufwachen, das Warten, das Gehen, die Mahlzeiten. Diese Momente können Sie mit nach Hause nehmen."],
        fr: ["Choisissez un moment aujourd’hui et protégez-le pendant {n} : rien de prévu, personne ne vous attend.","Asseyez-vous, respirez et restez avec ce qui est présent : respiration, corps, sons, pensées.","Remarquez ensuite quels moments de votre journée conviennent le mieux à un instant de quiétude : le réveil, l’attente, la marche, les repas. Ce sont ces moments que vous pourrez garder chez vous."],
        es: ["Elija hoy un momento y protéjalo durante {n}: nada programado, nadie esperándole.","Siéntese, respire y quédese con lo que esté presente: respiración, cuerpo, sonidos, pensamientos.","Después, observe qué momentos de su día encajan mejor con un momento de quietud: al despertar, al esperar, al caminar, en las comidas. Esos son los momentos que puede conservar en casa."],
      },
      also: {"en":"Also today, if you like: one hour of digital silence, with no phone, computer, tablet, television or headphones.","de":"Außerdem heute, wenn Sie mögen: eine Stunde digitale Stille, ohne Telefon, Computer, Tablet, Fernseher oder Kopfhörer.","fr":"Aussi aujourd’hui, si vous le souhaitez : une heure de silence numérique, sans téléphone, ordinateur, tablette, télévision ni écouteurs.","es":"También hoy, si lo desea: una hora de silencio digital, sin teléfono, ordenador, tableta, televisión ni auriculares."},
    },
  },
];

// Not shown in the app at present; kept as an optional line for reinforcement days (day 9 onwards).
export const REINFORCEMENT_NOTE = {"en":["Cultivating silence takes time. It cannot be imposed through pressure or force. We cannot simply order ourselves to become calm."],"de":["Stille zu pflegen braucht Zeit. Sie lässt sich nicht durch Druck oder Zwang herbeiführen. Wir können uns nicht einfach befehlen, ruhig zu werden."],"fr":["Cultiver le silence prend du temps. On ne peut pas l’imposer par la pression ou la force. Nous ne pouvons pas simplement nous ordonner d’être calmes."],"es":["Cultivar el silencio lleva tiempo. No se puede imponer mediante presión o fuerza. No podemos simplemente ordenarnos estar en calma."]};

// Shown on the closing questionnaire (departure day): bringing the snacks home.
export const TAKE_HOME = {
  title: {"en":"Taking it home","de":"Mit nach Hause nehmen","fr":"Emporter chez soi","es":"Llevárselo a casa"},
  // Full closing passage of the lecture, so the quote does not start mid-thought ("Both may offer…")
  quote: {"en":["Fasting and silence are twin companions because both begin with a form of letting go.","One interrupts our habitual relationship with food. The other interrupts our habitual relationship with noise, activity and distraction.","Both may offer something that has become increasingly rare: the freedom to stop, to turn inward, and simply to be."],"de":["Fasten und Schweigen sind Zwillingsgefährten, weil beide mit einer Form des Loslassens beginnen.","Das eine unterbricht unsere gewohnte Beziehung zum Essen. Das andere unterbricht unsere gewohnte Beziehung zu Lärm, Aktivität und Ablenkung.","Beide können etwas schenken, das immer seltener geworden ist: die Freiheit, innezuhalten, sich nach innen zu wenden und einfach zu sein."],"fr":["Le jeûne et le silence sont des compagnons jumeaux, car tous deux commencent par une forme de lâcher-prise.","L’un interrompt notre rapport habituel à la nourriture. L’autre interrompt notre rapport habituel au bruit, à l’activité et à la distraction.","Tous deux peuvent offrir quelque chose de plus en plus rare : la liberté de s’arrêter, de se tourner vers l’intérieur et, simplement, d’être."],"es":["El ayuno y el silencio son compañeros gemelos porque ambos empiezan con una forma de soltar.","Uno interrumpe nuestra relación habitual con la comida. El otro interrumpe nuestra relación habitual con el ruido, la actividad y la distracción.","Ambos pueden ofrecer algo cada vez más escaso: la libertad de detenerse, de volverse hacia dentro y, sencillamente, de ser."]},
  steps: {
    en: ["Keep the portions small. A few minutes, linked to things you already do every day, will last longer than a long session you have to make time for.","Pick one routine: the first minutes in bed in the morning, brushing your teeth (feel the brush, each tooth, the taste), or a meal without your phone.","Do it with full attention, without analysing and without planning your next email.","Every wait (the bus, a queue, the kettle) is still an invitation to a one-minute moment of stillness."],
    de: ["Bleiben Sie bei kleinen Portionen. Ein paar Minuten, verbunden mit Dingen, die Sie ohnehin jeden Tag tun, halten länger als eine lange Sitzung, für die Sie sich Zeit freischaufeln müssen.","Wählen Sie eine Routine: die ersten Minuten morgens im Bett, das Zähneputzen (spüren Sie die Bürste, jeden Zahn, den Geschmack) oder eine Mahlzeit ohne Telefon.","Tun Sie es mit voller Aufmerksamkeit, ohne zu analysieren und ohne die nächste E-Mail zu planen.","Jedes Warten (auf den Bus, in der Schlange, auf den Wasserkocher) bleibt eine Einladung zu einem einminütigen Moment der Stille."],
    fr: ["Gardez de petites portions. Quelques minutes liées à ce que vous faites déjà chaque jour dureront plus longtemps qu’une longue séance pour laquelle il faut trouver du temps.","Choisissez une routine : les premières minutes au lit le matin, le brossage des dents (sentez la brosse, chaque dent, le goût) ou un repas sans téléphone.","Faites-le avec toute votre attention, sans analyser et sans préparer votre prochain e-mail.","Chaque attente (le bus, une file, la bouilloire) reste une invitation à un instant de quiétude d’une minute."],
    es: ["Mantenga las porciones pequeñas. Unos minutos ligados a cosas que ya hace cada día durarán más que una sesión larga para la que tenga que buscar tiempo.","Elija una rutina: los primeros minutos en la cama por la mañana, cepillarse los dientes (sienta el cepillo, cada diente, el sabor) o una comida sin teléfono.","Hágalo con plena atención, sin analizar y sin planear su próximo correo.","Cada espera (el autobús, una cola, el hervidor) sigue siendo una invitación a un momento de quietud de un minuto."],
  },
};

/**
 * The practice for journey day `dayNumber` (1 = arrival day). Days 1–8 are the core programme;
 * from day 9 days 2–8 repeat in a cycle (2, 3, … 8, 2, 3, …) as "reinforcement", for as long as the stay lasts.
 * Returns the programme day plus `reinforcement` (boolean) and `minutes` (snack length for this journey day).
 * `totalDays` is accepted for compatibility and not used: the programme is open-ended.
 */
export function practiceFor(dayNumber, totalDays) { // eslint-disable-line no-unused-vars
  if (!dayNumber || dayNumber < 1) return null;
  const reinforcement = dayNumber > CORE_DAYS;
  const base = reinforcement ? 2 + ((dayNumber - CORE_DAYS - 1) % (CORE_DAYS - 1)) : dayNumber;
  return { ...PROGRAMME[base - 1], reinforcement, minutes: snackMinutes(dayNumber) };
}
