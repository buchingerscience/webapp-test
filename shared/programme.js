// Inner Calm — 10-day meditation programme
// Inspired by Father Niklaus Brantschen SJ, lecture "Fasting and Silence: Twin Companions".
// English is the reference text supplied by Buchinger Wilhelmi. DE/FR/ES are working
// translations — Father Brantschen lectured in German, so the German excerpts should
// ideally be checked against the original lecture.
//
// Each day: a short theme, a short excerpt, and one seated meditation of 15–20 minutes
// (exercise.minutes). The page itself reads in ~1 minute. 'also' is an optional,
// non-sitting suggestion for the day; it is not part of the counted meditation time.

export const PROGRAMME_AUTHOR = 'Niklaus Brantschen SJ';

export const PROGRAMME = [
  {
    day: 1,
    title: { en: 'Stopping', de: 'Innehalten', fr: "S'arrêter", es: 'Detenerse' },
    theme: { en: 'Fasting as an invitation to silence.', de: 'Fasten als Einladung zur Stille.', fr: 'Le jeûne comme invitation au silence.', es: 'El ayuno como invitación al silencio.' },
    quote: {
      en: ['Fasting is generally understood as abstaining from food for a certain period. But fasting has another dimension, one that is less easily measured.', 'Fasting is also an invitation to silence.', 'Silence is not simply the absence of noise. And fasting is not simply the absence of food.'],
      de: ['Unter Fasten versteht man gewöhnlich den Verzicht auf Nahrung für eine bestimmte Zeit. Doch Fasten hat noch eine andere Dimension, eine, die sich weniger leicht messen lässt.', 'Fasten ist auch eine Einladung zur Stille.', 'Stille ist nicht einfach die Abwesenheit von Lärm. Und Fasten ist nicht einfach die Abwesenheit von Nahrung.'],
      fr: ["On entend généralement par jeûne le fait de s'abstenir de nourriture pendant un certain temps. Mais le jeûne a une autre dimension, moins facile à mesurer.", 'Le jeûne est aussi une invitation au silence.', "Le silence n'est pas simplement l'absence de bruit. Et le jeûne n'est pas simplement l'absence de nourriture."],
      es: ['Por ayuno se entiende generalmente abstenerse de comer durante un tiempo determinado. Pero el ayuno tiene otra dimensión, menos fácil de medir.', 'El ayuno es también una invitación al silencio.', 'El silencio no es simplemente la ausencia de ruido. Y el ayuno no es simplemente la ausencia de comida.'],
    },
    exercise: {
      minutes: 15,
      title: {"en": "Fifteen minutes of simply sitting", "de": "Fünfzehn Minuten einfach sitzen", "fr": "Quinze minutes à simplement s’asseoir", "es": "Quince minutos simplemente sentado/a"},
      steps: {
        en: ["Find a comfortable and quiet place. Sit down.", "For fifteen minutes, do not try to meditate correctly. Do not read. Do not listen to anything. Do not look at your phone.", "Simply sit. Notice what happens when there is nothing you need to do.", "Thoughts may appear. You may feel restless or calm. There is no particular state you need to reach.", "Remain there until the timer sounds. Then continue with your day."],
        de: ["Suchen Sie sich einen bequemen und ruhigen Ort. Setzen Sie sich.", "Versuchen Sie fünfzehn Minuten lang nicht, „richtig“ zu meditieren. Lesen Sie nicht. Hören Sie nichts. Schauen Sie nicht auf Ihr Telefon.", "Sitzen Sie einfach. Bemerken Sie, was geschieht, wenn es nichts zu tun gibt.", "Gedanken können auftauchen. Sie fühlen sich vielleicht unruhig oder ruhig. Es gibt keinen bestimmten Zustand, den Sie erreichen müssen.", "Bleiben Sie sitzen, bis der Wecker klingt. Dann setzen Sie Ihren Tag fort."],
        fr: ["Trouvez un endroit confortable et calme. Asseyez-vous.", "Pendant quinze minutes, n’essayez pas de méditer « correctement ». Ne lisez pas. N’écoutez rien. Ne regardez pas votre téléphone.", "Asseyez-vous, simplement. Observez ce qui se passe quand il n’y a rien à faire.", "Des pensées peuvent apparaître. Vous pouvez vous sentir agité(e) ou calme. Il n’y a aucun état particulier à atteindre.", "Restez ainsi jusqu’à la sonnerie. Puis reprenez votre journée."],
        es: ["Busque un lugar cómodo y tranquilo. Siéntese.", "Durante quince minutos, no intente meditar «correctamente». No lea. No escuche nada. No mire el teléfono.", "Simplemente permanezca sentado/a. Observe qué ocurre cuando no hay nada que tenga que hacer.", "Pueden aparecer pensamientos. Puede sentirse inquieto/a o en calma. No hay ningún estado concreto que deba alcanzar.", "Permanezca así hasta que suene el temporizador. Después, continúe con su día."],
      },
    },
  },
  {
    day: 2,
    title: { en: 'The golden cage', de: 'Der goldene Käfig', fr: 'La cage dorée', es: 'La jaula de oro' },
    theme: { en: 'Creating space from our habits.', de: 'Abstand zu unseren Gewohnheiten gewinnen.', fr: "Prendre de la distance avec nos habitudes.", es: 'Crear espacio frente a nuestros hábitos.' },
    quote: {
      en: ['The parrot was given the finest food, the best care and every possible comfort. Nothing was missing, or so the king believed.', 'Yet the parrot said: ‘I want to be free.’', 'His brothers in the forest eventually showed him what he needed to do. They showed him the way to freedom.', 'We do not always discover the path to freedom by thinking about it. Sometimes, we need others to show us how to live differently.'],
      de: ['Der Papagei bekam das feinste Futter, die beste Pflege und jeden erdenklichen Komfort. Es fehlte ihm an nichts – so glaubte zumindest der König.', 'Doch der Papagei sagte: „Ich will frei sein.“', 'Seine Brüder im Wald zeigten ihm schließlich, was er tun musste. Sie zeigten ihm den Weg in die Freiheit.', 'Den Weg zur Freiheit finden wir nicht immer durch Nachdenken. Manchmal brauchen wir andere, die uns zeigen, wie man anders leben kann.'],
      fr: ['Le perroquet recevait la meilleure nourriture, les meilleurs soins et tout le confort possible. Il ne lui manquait rien – du moins le roi le croyait-il.', 'Pourtant, le perroquet dit : « Je veux être libre. »', 'Ses frères de la forêt finirent par lui montrer ce qu’il devait faire. Ils lui montrèrent le chemin de la liberté.', 'Nous ne découvrons pas toujours le chemin de la liberté en y réfléchissant. Parfois, nous avons besoin que d’autres nous montrent comment vivre autrement.'],
      es: ['Al loro le daban la mejor comida, los mejores cuidados y todas las comodidades posibles. No le faltaba nada, o eso creía el rey.', 'Sin embargo, el loro dijo: «Quiero ser libre».', 'Sus hermanos del bosque acabaron mostrándole lo que debía hacer. Le mostraron el camino hacia la libertad.', 'No siempre descubrimos el camino hacia la libertad pensando en ello. A veces necesitamos que otros nos muestren cómo vivir de otra manera.'],
    },
    exercise: {
      minutes: 15,
      title: {"en": "Fifteen minutes with your impulses", "de": "Fünfzehn Minuten mit Ihren Impulsen", "fr": "Quinze minutes avec vos impulsions", "es": "Quince minutos con sus impulsos"},
      steps: {
        en: ["Sit comfortably and let your attention rest on the breath.", "Before long, an impulse will arise: to move, to check something, to get up, to reach for your phone.", "Notice the impulse. Feel where it lives in the body. You do not need to fight it, and you do not need to follow it.", "Let it pass, and return to the breath. Like the parrot in the golden cage, you are discovering that a habit is not a command.", "Continue for fifteen minutes."],
        de: ["Setzen Sie sich bequem hin und lassen Sie Ihre Aufmerksamkeit auf dem Atem ruhen.", "Schon bald wird ein Impuls auftauchen: sich zu bewegen, etwas nachzusehen, aufzustehen, zum Telefon zu greifen.", "Bemerken Sie den Impuls. Spüren Sie, wo er im Körper sitzt. Sie müssen nicht gegen ihn ankämpfen, und Sie müssen ihm nicht folgen.", "Lassen Sie ihn vorüberziehen und kehren Sie zum Atem zurück. Wie der Papagei im goldenen Käfig entdecken Sie, dass eine Gewohnheit kein Befehl ist.", "Fahren Sie fünfzehn Minuten lang fort."],
        fr: ["Asseyez-vous confortablement et laissez votre attention se poser sur la respiration.", "Bientôt, une impulsion apparaîtra : bouger, vérifier quelque chose, vous lever, prendre votre téléphone.", "Remarquez l’impulsion. Sentez où elle se loge dans le corps. Vous n’avez pas besoin de lutter contre elle, ni de la suivre.", "Laissez-la passer et revenez à la respiration. Comme le perroquet dans sa cage dorée, vous découvrez qu’une habitude n’est pas un ordre.", "Continuez pendant quinze minutes."],
        es: ["Siéntese cómodamente y deje que la atención descanse en la respiración.", "Pronto surgirá un impulso: moverse, comprobar algo, levantarse, coger el teléfono.", "Observe el impulso. Sienta dónde está en el cuerpo. No necesita luchar contra él ni tampoco seguirlo.", "Déjelo pasar y vuelva a la respiración. Como el loro de la jaula de oro, está descubriendo que un hábito no es una orden.", "Continúe durante quince minutos."],
      },
      also: {"en": "Also today: take one walk without your phone. Notice sounds, colours, movement and the sensations of walking.", "de": "Außerdem heute: Machen Sie einen Spaziergang ohne Telefon. Nehmen Sie Geräusche, Farben, Bewegung und das Gefühl des Gehens wahr.", "fr": "Aujourd’hui aussi : faites une promenade sans téléphone. Remarquez les sons, les couleurs, le mouvement et les sensations de la marche.", "es": "También hoy: dé un paseo sin el teléfono. Perciba los sonidos, los colores, el movimiento y las sensaciones al caminar."},
    },
  },
  {
    day: 3,
    title: { en: 'Turning inward', de: 'Sich nach innen wenden', fr: 'Se tourner vers l’intérieur', es: 'Volverse hacia dentro' },
    theme: { en: 'From external stimulation towards inner experience.', de: 'Von äußeren Reizen zum inneren Erleben.', fr: 'Des stimulations extérieures vers l’expérience intérieure.', es: 'De los estímulos externos a la experiencia interior.' },
    quote: {
      en: ['In ordinary life, we are constantly occupied with what comes from outside.', 'We eat, consume, communicate, work, respond to demands and seek stimulation.', 'Fasting interrupts one of the most fundamental of these activities. This creates an opportunity.', 'It may become easier to withdraw from constant activity, turn our attention inward and spend time with ourselves.'],
      de: ['Im gewöhnlichen Leben sind wir ständig mit dem beschäftigt, was von außen kommt.', 'Wir essen, konsumieren, kommunizieren, arbeiten, reagieren auf Anforderungen und suchen Anregung.', 'Das Fasten unterbricht eine der grundlegendsten dieser Tätigkeiten. Darin liegt eine Chance.', 'Es kann leichter werden, sich aus der ständigen Aktivität zurückzuziehen, die Aufmerksamkeit nach innen zu richten und Zeit mit sich selbst zu verbringen.'],
      fr: ['Dans la vie ordinaire, nous sommes constamment occupés par ce qui vient de l’extérieur.', 'Nous mangeons, consommons, communiquons, travaillons, répondons à des sollicitations et cherchons des stimulations.', 'Le jeûne interrompt l’une des plus fondamentales de ces activités. Cela ouvre une possibilité.', 'Il peut devenir plus facile de se retirer de l’activité permanente, de tourner son attention vers l’intérieur et de passer du temps avec soi-même.'],
      es: ['En la vida cotidiana estamos constantemente ocupados con lo que viene de fuera.', 'Comemos, consumimos, nos comunicamos, trabajamos, respondemos a exigencias y buscamos estímulos.', 'El ayuno interrumpe una de las más fundamentales de estas actividades. Esto crea una oportunidad.', 'Puede resultar más fácil retirarse de la actividad constante, dirigir la atención hacia dentro y pasar tiempo con uno mismo.'],
    },
    exercise: {
      minutes: 15,
      title: {"en": "Fifteen minutes with the breath", "de": "Fünfzehn Minuten mit dem Atem", "fr": "Quinze minutes avec la respiration", "es": "Quince minutos con la respiración"},
      steps: {
        en: ["Sit comfortably. Close your eyes if this feels natural.", "Bring your attention to your breathing. Do not change the breath.", "Notice where you feel it most clearly: perhaps in the nose, the chest or the abdomen. Stay with this sensation.", "Your attention will wander. When you notice that this has happened, gently return to the breath. There is no need to stop thinking.", "The practice is simply: Notice. Return. Begin again.", "Continue for fifteen minutes."],
        de: ["Setzen Sie sich bequem hin. Schließen Sie die Augen, wenn es sich natürlich anfühlt.", "Richten Sie Ihre Aufmerksamkeit auf Ihren Atem. Verändern Sie den Atem nicht.", "Bemerken Sie, wo Sie ihn am deutlichsten spüren: vielleicht an der Nase, in der Brust oder im Bauch. Bleiben Sie bei dieser Empfindung.", "Ihre Aufmerksamkeit wird abschweifen. Wenn Sie das bemerken, kehren Sie sanft zum Atem zurück. Sie müssen nicht aufhören zu denken.", "Die Übung ist einfach: Bemerken. Zurückkehren. Neu beginnen.", "Fahren Sie fünfzehn Minuten lang fort."],
        fr: ["Asseyez-vous confortablement. Fermez les yeux si cela vous semble naturel.", "Portez votre attention sur votre respiration. Ne la modifiez pas.", "Remarquez où vous la sentez le plus clairement : peut-être au niveau du nez, de la poitrine ou du ventre. Restez avec cette sensation.", "Votre attention va s’égarer. Quand vous vous en apercevez, revenez doucement à la respiration. Inutile d’arrêter de penser.", "La pratique est simplement : Remarquer. Revenir. Recommencer.", "Continuez pendant quinze minutes."],
        es: ["Siéntese cómodamente. Cierre los ojos si le resulta natural.", "Lleve la atención a su respiración. No la modifique.", "Observe dónde la siente con más claridad: quizá en la nariz, el pecho o el abdomen. Permanezca con esa sensación.", "Su atención se distraerá. Cuando se dé cuenta, vuelva suavemente a la respiración. No hace falta dejar de pensar.", "La práctica es simplemente: Darse cuenta. Volver. Empezar de nuevo.", "Continúe durante quince minutos."],
      },
    },
  },
  {
    day: 4,
    title: { en: 'You are allowed to be silent', de: 'Sie dürfen schweigen', fr: 'Vous avez le droit de vous taire', es: 'Puede permitirse el silencio' },
    theme: { en: 'Silence as permission rather than discipline.', de: 'Stille als Erlaubnis, nicht als Pflicht.', fr: 'Le silence comme permission plutôt que comme discipline.', es: 'El silencio como permiso, no como disciplina.' },
    quote: {
      en: ['Rules and prohibitions are often insufficient. A sign asking people to remain quiet may reduce noise, but it cannot create a meaningful experience of silence.', 'The essential difference lies in our attitude.', 'Not: ‘You must be silent.’ But rather: ‘You are allowed to be silent.’', 'You are allowed to stop speaking. You are allowed to withdraw for a moment from the demands of everyday life.'],
      de: ['Regeln und Verbote reichen oft nicht aus. Ein Schild, das um Ruhe bittet, mag den Lärm verringern, aber es kann keine bedeutsame Erfahrung von Stille schaffen.', 'Der entscheidende Unterschied liegt in unserer Haltung.', 'Nicht: „Du musst schweigen.“ Sondern: „Du darfst schweigen.“', 'Du darfst aufhören zu sprechen. Du darfst dich für einen Moment von den Anforderungen des Alltags zurückziehen.'],
      fr: ['Les règles et les interdits sont souvent insuffisants. Un panneau demandant le silence peut réduire le bruit, mais il ne peut pas créer une véritable expérience du silence.', 'La différence essentielle tient à notre attitude.', 'Non pas : « Tu dois te taire. » Mais plutôt : « Tu as le droit de te taire. »', 'Tu as le droit de cesser de parler. Tu as le droit de te retirer un moment des exigences du quotidien.'],
      es: ['Las normas y prohibiciones a menudo no bastan. Un cartel que pide silencio puede reducir el ruido, pero no puede crear una experiencia significativa del silencio.', 'La diferencia esencial está en nuestra actitud.', 'No: «Tienes que callar». Sino: «Puedes permitirte callar».', 'Puedes dejar de hablar. Puedes retirarte un momento de las exigencias de la vida cotidiana.'],
    },
    exercise: {
      minutes: 20,
      title: {"en": "Twenty minutes of voluntary silence", "de": "Zwanzig Minuten freiwillige Stille", "fr": "Vingt minutes de silence volontaire", "es": "Veinte minutos de silencio voluntario"},
      steps: {
        en: ["Sit down in a quiet place for twenty minutes.", "During this time, do not speak, read, listen to anything or use your phone.", "Remind yourself: I do not have to be silent. I am allowed to be silent.", "Let your attention rest on the breath and the body. When you notice you are planning, or answering someone in your head, gently let it go.", "There is nothing to accomplish. Simply experience what happens when you give yourself permission not to communicate."],
        de: ["Setzen Sie sich zwanzig Minuten an einen ruhigen Ort.", "Sprechen, lesen und hören Sie in dieser Zeit nichts, und benutzen Sie Ihr Telefon nicht.", "Sagen Sie sich: Ich muss nicht schweigen. Ich darf schweigen.", "Lassen Sie Ihre Aufmerksamkeit auf Atem und Körper ruhen. Wenn Sie bemerken, dass Sie planen oder in Gedanken jemandem antworten, lassen Sie es sanft los.", "Es gibt nichts zu erreichen. Erleben Sie einfach, was geschieht, wenn Sie sich erlauben, nicht zu kommunizieren."],
        fr: ["Asseyez-vous vingt minutes dans un endroit calme.", "Pendant ce temps, ne parlez pas, ne lisez pas, n’écoutez rien et n’utilisez pas votre téléphone.", "Rappelez-vous : je ne suis pas obligé(e) de me taire. J’ai le droit de me taire.", "Laissez votre attention reposer sur la respiration et le corps. Quand vous remarquez que vous planifiez, ou que vous répondez à quelqu’un dans votre tête, laissez cela aller doucement.", "Il n’y a rien à accomplir. Faites simplement l’expérience de ce qui se passe lorsque vous vous autorisez à ne pas communiquer."],
        es: ["Siéntese veinte minutos en un lugar tranquilo.", "Durante ese tiempo, no hable, no lea, no escuche nada y no use el teléfono.", "Recuérdese: no tengo que callar. Puedo permitirme callar.", "Deje que la atención descanse en la respiración y el cuerpo. Cuando note que está planificando o respondiendo a alguien mentalmente, suéltelo con suavidad.", "No hay nada que lograr. Simplemente experimente lo que ocurre cuando se da permiso para no comunicarse."],
      },
      also: {"en": "Also today: if you can, spend one meal or one walk without speaking.", "de": "Außerdem heute: Verbringen Sie, wenn möglich, eine Mahlzeit oder einen Spaziergang ohne zu sprechen.", "fr": "Aujourd’hui aussi : si vous le pouvez, passez un repas ou une promenade sans parler.", "es": "También hoy: si puede, pase una comida o un paseo sin hablar."},
    },
  },
  {
    day: 5,
    title: { en: 'Cultivating silence', de: 'Stille pflegen', fr: 'Cultiver le silence', es: 'Cultivar el silencio' },
    theme: { en: 'Silence is something we practise.', de: 'Stille ist etwas, das wir üben.', fr: 'Le silence est quelque chose qui se pratique.', es: 'El silencio es algo que se practica.' },
    quote: {
      en: ['We often imagine silence as something that can be created by removing noise. But a person can sit in a perfectly quiet room and still experience a great deal of inner agitation.', 'Consider a garden. Building a fence around it may protect it from outside disturbances. But the fence alone will not make vegetables grow.', 'Silence requires similar attention. It must be cultivated.'],
      de: ['Wir stellen uns Stille oft als etwas vor, das entsteht, wenn man den Lärm entfernt. Doch man kann in einem vollkommen ruhigen Raum sitzen und dennoch große innere Unruhe erleben.', 'Denken Sie an einen Garten. Ein Zaun mag ihn vor Störungen von außen schützen. Doch der Zaun allein lässt kein Gemüse wachsen.', 'Stille braucht eine ähnliche Aufmerksamkeit. Sie will gepflegt werden.'],
      fr: ['Nous imaginons souvent le silence comme quelque chose que l’on obtient en supprimant le bruit. Mais on peut être assis dans une pièce parfaitement calme et ressentir pourtant une grande agitation intérieure.', 'Pensez à un jardin. Une clôture peut le protéger des perturbations extérieures. Mais la clôture seule ne fera pas pousser les légumes.', 'Le silence demande une attention semblable. Il doit être cultivé.'],
      es: ['A menudo imaginamos el silencio como algo que se crea eliminando el ruido. Pero una persona puede estar sentada en una habitación perfectamente tranquila y, aun así, sentir una gran agitación interior.', 'Piense en un huerto. Una valla puede protegerlo de las molestias externas. Pero la valla por sí sola no hará crecer las verduras.', 'El silencio requiere una atención parecida. Hay que cultivarlo.'],
    },
    exercise: {
      minutes: 20,
      title: {"en": "Twenty minutes observing thoughts", "de": "Zwanzig Minuten Gedanken beobachten", "fr": "Vingt minutes à observer ses pensées", "es": "Veinte minutos observando los pensamientos"},
      steps: {
        en: ["Sit comfortably for twenty minutes. Begin by noticing your breathing.", "After a few minutes, broaden your attention. Notice thoughts as they appear. Do not try to stop them. Do not follow every thought.", "Simply recognise: Thinking. Remembering. Planning. Imagining.", "Then return your attention to breathing or to the sensations of your body. If another thought appears, notice it and return again.", "The objective is not an empty mind. The exercise is learning to observe mental activity without immediately following it."],
        de: ["Sitzen Sie zwanzig Minuten bequem. Beginnen Sie damit, Ihren Atem wahrzunehmen.", "Erweitern Sie nach einigen Minuten Ihre Aufmerksamkeit. Bemerken Sie Gedanken, sobald sie auftauchen. Versuchen Sie nicht, sie zu stoppen. Folgen Sie nicht jedem Gedanken.", "Erkennen Sie einfach: Denken. Erinnern. Planen. Vorstellen.", "Kehren Sie dann mit Ihrer Aufmerksamkeit zum Atem oder zu den Empfindungen Ihres Körpers zurück. Taucht ein weiterer Gedanke auf, bemerken Sie ihn und kehren Sie wieder zurück.", "Das Ziel ist kein leerer Geist. Die Übung besteht darin, geistige Aktivität zu beobachten, ohne ihr sofort zu folgen."],
        fr: ["Asseyez-vous confortablement pendant vingt minutes. Commencez par observer votre respiration.", "Après quelques minutes, élargissez votre attention. Remarquez les pensées à mesure qu’elles apparaissent. N’essayez pas de les arrêter. Ne suivez pas chaque pensée.", "Reconnaissez simplement : Penser. Se souvenir. Planifier. Imaginer.", "Puis ramenez votre attention à la respiration ou aux sensations de votre corps. Si une autre pensée apparaît, remarquez-la et revenez à nouveau.", "Le but n’est pas un esprit vide. L’exercice consiste à apprendre à observer l’activité mentale sans la suivre immédiatement."],
        es: ["Siéntese cómodamente durante veinte minutos. Empiece observando su respiración.", "Tras unos minutos, amplíe su atención. Observe los pensamientos a medida que aparecen. No intente detenerlos. No siga cada pensamiento.", "Simplemente reconozca: Pensar. Recordar. Planificar. Imaginar.", "Después, vuelva a llevar la atención a la respiración o a las sensaciones del cuerpo. Si aparece otro pensamiento, obsérvelo y vuelva de nuevo.", "El objetivo no es una mente vacía. El ejercicio consiste en aprender a observar la actividad mental sin seguirla de inmediato."],
      },
    },
  },
  {
    day: 6,
    title: { en: 'The silence behind silence', de: 'Die Stille hinter der Stille', fr: 'Le silence derrière le silence', es: 'El silencio detrás del silencio' },
    theme: { en: 'External silence and inner silence are not the same thing.', de: 'Äußere und innere Stille sind nicht dasselbe.', fr: 'Le silence extérieur et le silence intérieur ne sont pas la même chose.', es: 'El silencio exterior y el silencio interior no son lo mismo.' },
    quote: {
      en: ['The absence of external noise does not guarantee inner peace.', 'We know what it feels like when the noise of the world disappears. But is silence merely a feeling? Or does it open onto something deeper?', 'Perhaps there is such a thing as the silence behind silence.'],
      de: ['Die Abwesenheit von äußerem Lärm garantiert noch keinen inneren Frieden.', 'Wir kennen das Gefühl, wenn der Lärm der Welt verschwindet. Doch ist Stille nur ein Gefühl? Oder öffnet sie sich zu etwas Tieferem?', 'Vielleicht gibt es so etwas wie die Stille hinter der Stille.'],
      fr: ['L’absence de bruit extérieur ne garantit pas la paix intérieure.', 'Nous savons ce que l’on ressent quand le bruit du monde disparaît. Mais le silence n’est-il qu’un sentiment ? Ou ouvre-t-il sur quelque chose de plus profond ?', 'Peut-être existe-t-il quelque chose comme le silence derrière le silence.'],
      es: ['La ausencia de ruido exterior no garantiza la paz interior.', 'Sabemos lo que se siente cuando el ruido del mundo desaparece. Pero ¿es el silencio solo un sentimiento? ¿O se abre a algo más profundo?', 'Quizá exista algo así como el silencio detrás del silencio.'],
    },
    exercise: {
      minutes: 20,
      title: {"en": "Twenty minutes listening inward", "de": "Zwanzig Minuten nach innen lauschen", "fr": "Vingt minutes à écouter vers l’intérieur", "es": "Veinte minutos escuchando hacia dentro"},
      steps: {
        en: ["Find a quiet place. Sit for twenty minutes.", "For the first five minutes, listen to sounds around you. Notice sounds nearby. Then notice sounds further away. Do not label them as pleasant or unpleasant.", "Then move your attention inward. Notice your breathing. Notice sensations in your body. Finally, notice thoughts and emotions as they appear.", "Do not try to change anything. Simply move gradually from the sounds around you towards what is happening within you, and rest there."],
        de: ["Suchen Sie sich einen ruhigen Ort. Sitzen Sie zwanzig Minuten.", "Lauschen Sie in den ersten fünf Minuten den Geräuschen um Sie herum. Nehmen Sie nahe Geräusche wahr. Dann Geräusche in der Ferne. Bewerten Sie sie nicht als angenehm oder unangenehm.", "Lenken Sie dann Ihre Aufmerksamkeit nach innen. Nehmen Sie Ihren Atem wahr. Nehmen Sie Empfindungen in Ihrem Körper wahr. Schließlich bemerken Sie Gedanken und Gefühle, sobald sie auftauchen.", "Versuchen Sie nichts zu verändern. Wandern Sie einfach allmählich von den Geräuschen um Sie herum zu dem, was in Ihnen geschieht, und verweilen Sie dort."],
        fr: ["Trouvez un endroit calme. Asseyez-vous pendant vingt minutes.", "Pendant les cinq premières minutes, écoutez les sons autour de vous. Remarquez les sons proches. Puis les sons plus lointains. Ne les qualifiez pas d’agréables ou de désagréables.", "Puis tournez votre attention vers l’intérieur. Remarquez votre respiration. Remarquez les sensations dans votre corps. Enfin, remarquez les pensées et les émotions à mesure qu’elles apparaissent.", "N’essayez de rien changer. Passez simplement, peu à peu, des sons qui vous entourent à ce qui se passe en vous, et restez-y."],
        es: ["Busque un lugar tranquilo. Siéntese durante veinte minutos.", "Durante los primeros cinco minutos, escuche los sonidos a su alrededor. Perciba los sonidos cercanos. Después, los más lejanos. No los califique como agradables o desagradables.", "Luego dirija la atención hacia dentro. Perciba su respiración. Perciba las sensaciones del cuerpo. Por último, observe los pensamientos y emociones a medida que aparecen.", "No intente cambiar nada. Simplemente pase poco a poco de los sonidos que le rodean a lo que ocurre en su interior, y quédese ahí."],
      },
    },
  },
  {
    day: 7,
    title: { en: 'A minute of eternity', de: 'Eine Minute Ewigkeit', fr: 'Une minute d’éternité', es: 'Un minuto de eternidad' },
    theme: { en: 'Experiencing the present moment.', de: 'Den gegenwärtigen Moment erleben.', fr: 'Faire l’expérience du moment présent.', es: 'Vivir el momento presente.' },
    quote: {
      en: ['Otto Buchinger described fasting with a remarkable phrase: ‘Fasting is a minute of eternity in silence.’', 'In moments of deep silence, our relationship with time can change. We are no longer concerned with what has happened or what must happen next.', 'We are simply there.'],
      de: ['Otto Buchinger beschrieb das Fasten mit einem bemerkenswerten Satz: „Fasten ist eine Minute Ewigkeit in der Stille.“', 'In Momenten tiefer Stille kann sich unser Verhältnis zur Zeit verändern. Wir sind nicht mehr mit dem beschäftigt, was geschehen ist oder was als Nächstes geschehen muss.', 'Wir sind einfach da.'],
      fr: ['Otto Buchinger a décrit le jeûne par une formule remarquable : « Le jeûne est une minute d’éternité dans le silence. »', 'Dans les moments de silence profond, notre rapport au temps peut changer. Nous ne nous préoccupons plus de ce qui s’est passé ni de ce qui doit arriver ensuite.', 'Nous sommes simplement là.'],
      es: ['Otto Buchinger describió el ayuno con una frase extraordinaria: «El ayuno es un minuto de eternidad en silencio».', 'En los momentos de silencio profundo, nuestra relación con el tiempo puede cambiar. Ya no nos preocupa lo que ha pasado ni lo que tiene que pasar después.', 'Simplemente estamos ahí.'],
    },
    exercise: {
      minutes: 20,
      title: {"en": "Twenty minutes without going anywhere", "de": "Zwanzig Minuten, ohne irgendwohin zu gehen", "fr": "Vingt minutes sans aller nulle part", "es": "Veinte minutos sin ir a ninguna parte"},
      steps: {
        en: ["Sit somewhere comfortable. For twenty minutes, practise remaining with what is happening now.", "When thoughts about the past appear, notice them. When thoughts about the future appear, notice them.", "Then return to something happening in the present: your breathing, your body, the sounds around you, the feeling of sitting.", "You do not need to create a special experience. For these twenty minutes, there is nowhere else you need to be."],
        de: ["Setzen Sie sich an einen bequemen Ort. Üben Sie zwanzig Minuten lang, bei dem zu bleiben, was jetzt geschieht.", "Wenn Gedanken an die Vergangenheit auftauchen, bemerken Sie sie. Wenn Gedanken an die Zukunft auftauchen, bemerken Sie sie.", "Kehren Sie dann zu etwas zurück, das in der Gegenwart geschieht: Ihr Atem, Ihr Körper, die Geräusche um Sie herum, das Gefühl des Sitzens.", "Sie müssen keine besondere Erfahrung herbeiführen. In diesen zwanzig Minuten gibt es keinen anderen Ort, an dem Sie sein müssen."],
        fr: ["Asseyez-vous dans un endroit confortable. Pendant vingt minutes, exercez-vous à rester avec ce qui se passe maintenant.", "Quand des pensées sur le passé apparaissent, remarquez-les. Quand des pensées sur l’avenir apparaissent, remarquez-les.", "Puis revenez à quelque chose qui se passe dans le présent : votre respiration, votre corps, les sons autour de vous, la sensation d’être assis(e).", "Vous n’avez pas besoin de créer une expérience particulière. Pendant ces vingt minutes, il n’y a nulle part ailleurs où vous devez être."],
        es: ["Siéntese en un lugar cómodo. Durante veinte minutos, practique permanecer con lo que está ocurriendo ahora.", "Cuando aparezcan pensamientos sobre el pasado, obsérvelos. Cuando aparezcan pensamientos sobre el futuro, obsérvelos.", "Después, vuelva a algo que ocurre en el presente: su respiración, su cuerpo, los sonidos a su alrededor, la sensación de estar sentado/a.", "No necesita crear una experiencia especial. Durante estos veinte minutos, no hay ningún otro lugar en el que tenga que estar."],
      },
    },
  },
  {
    day: 8,
    title: { en: 'Protecting silence', de: 'Stille schützen', fr: 'Protéger le silence', es: 'Proteger el silencio' },
    theme: { en: 'Silence as something worth protecting.', de: 'Stille als etwas Schützenswertes.', fr: 'Le silence, quelque chose qui mérite d’être protégé.', es: 'El silencio como algo que merece ser protegido.' },
    quote: {
      en: ['Modern societies are filled with noise. There is a growing need for places where people can escape the constant demands of modern life.', 'Places where silence is not an accidental absence of activity but something deliberately protected.', 'The Danish philosopher Søren Kierkegaard suggested that, if he were a physician, his advice would be simple: ‘Create silence.’'],
      de: ['Moderne Gesellschaften sind voller Lärm. Es wächst das Bedürfnis nach Orten, an denen Menschen den ständigen Anforderungen des modernen Lebens entkommen können.', 'Orte, an denen Stille nicht zufällige Abwesenheit von Aktivität ist, sondern etwas bewusst Geschütztes.', 'Der dänische Philosoph Søren Kierkegaard meinte, wäre er Arzt, so wäre sein Rat ganz einfach: „Schaffe Schweigen.“'],
      fr: ['Les sociétés modernes sont remplies de bruit. Le besoin de lieux où l’on peut échapper aux exigences constantes de la vie moderne ne cesse de grandir.', 'Des lieux où le silence n’est pas une absence fortuite d’activité, mais quelque chose de délibérément protégé.', 'Le philosophe danois Søren Kierkegaard disait que, s’il était médecin, son conseil serait simple : « Créez le silence. »'],
      es: ['Las sociedades modernas están llenas de ruido. Crece la necesidad de lugares donde las personas puedan escapar de las exigencias constantes de la vida moderna.', 'Lugares donde el silencio no sea una ausencia accidental de actividad, sino algo protegido deliberadamente.', 'El filósofo danés Søren Kierkegaard afirmaba que, si fuera médico, su consejo sería sencillo: «Cread silencio».'],
    },
    exercise: {
      minutes: 20,
      title: {"en": "Twenty protected minutes", "de": "Zwanzig geschützte Minuten", "fr": "Vingt minutes protégées", "es": "Veinte minutos protegidos"},
      steps: {
        en: ["Choose twenty minutes and protect them: phone in another room or switched off, door closed, nothing scheduled.", "Sit down. Begin with a few breaths, then simply remain with whatever is present: breath, body, sounds, thoughts.", "Notice how often your mind expects stimulation. Each time, return.", "Do not try to make the time productive. Its only purpose is to be protected."],
        de: ["Wählen Sie zwanzig Minuten und schützen Sie sie: Telefon in einem anderen Raum oder ausgeschaltet, Tür geschlossen, nichts geplant.", "Setzen Sie sich. Beginnen Sie mit einigen Atemzügen und bleiben Sie dann einfach bei dem, was da ist: Atem, Körper, Geräusche, Gedanken.", "Bemerken Sie, wie oft Ihr Geist nach Anregung verlangt. Kehren Sie jedes Mal zurück.", "Versuchen Sie nicht, die Zeit produktiv zu machen. Ihr einziger Zweck ist, geschützt zu sein."],
        fr: ["Choisissez vingt minutes et protégez-les : téléphone dans une autre pièce ou éteint, porte fermée, rien de prévu.", "Asseyez-vous. Commencez par quelques respirations, puis restez simplement avec ce qui est présent : respiration, corps, sons, pensées.", "Remarquez combien de fois votre esprit attend une stimulation. Chaque fois, revenez.", "N’essayez pas de rendre ce temps productif. Son seul but est d’être protégé."],
        es: ["Elija veinte minutos y protéjalos: el teléfono en otra habitación o apagado, la puerta cerrada, nada programado.", "Siéntese. Empiece con unas respiraciones y después permanezca simplemente con lo que esté presente: respiración, cuerpo, sonidos, pensamientos.", "Observe cuántas veces su mente espera un estímulo. Cada vez, vuelva.", "No intente que este tiempo sea productivo. Su único propósito es estar protegido."],
      },
      also: {"en": "Also today: keep one hour of digital silence — no phone, computer, tablet, television or headphones.", "de": "Außerdem heute: Halten Sie eine Stunde digitale Stille – kein Telefon, Computer, Tablet, Fernseher und keine Kopfhörer.", "fr": "Aujourd’hui aussi : gardez une heure de silence numérique – ni téléphone, ni ordinateur, ni tablette, ni télévision, ni écouteurs.", "es": "También hoy: mantenga una hora de silencio digital, sin teléfono, ordenador, tableta, televisión ni auriculares."},
    },
  },
  {
    day: 9,
    title: { en: 'Do not force it', de: 'Nichts erzwingen', fr: 'Ne rien forcer', es: 'No forzar nada' },
    theme: { en: 'Allowing rather than striving.', de: 'Zulassen statt anstreben.', fr: 'Laisser venir plutôt que chercher à atteindre.', es: 'Permitir en lugar de esforzarse.' },
    quote: {
      en: ['Cultivating silence takes time. It cannot be imposed through pressure or force. We cannot simply order ourselves to become calm.', 'The poet Hilde Domin expressed this beautifully: ‘Do not grow tired, but gently hold out your hand to the miracle, as you would to a bird.’', 'To experience silence, we must first make room for it.'],
      // Translations paraphrase Hilde Domin's image instead of quoting her poem (still under copyright).
      de: ['Stille zu pflegen braucht Zeit. Sie lässt sich nicht durch Druck oder Zwang herbeiführen. Wir können uns nicht einfach befehlen, ruhig zu werden.', 'Die Dichterin Hilde Domin hat dafür ein schönes Bild gefunden: dem Wunder geduldig und sanft die Hand hinzuhalten, so wie man sie einem Vogel hinhält.', 'Um Stille zu erfahren, müssen wir ihr zuerst Raum geben.'],
      fr: ['Cultiver le silence prend du temps. On ne peut pas l’imposer par la pression ou la force. Nous ne pouvons pas simplement nous ordonner d’être calmes.', 'La poétesse Hilde Domin en a donné une belle image : tendre la main au miracle, patiemment et doucement, comme on la tend à un oiseau.', 'Pour faire l’expérience du silence, il faut d’abord lui faire de la place.'],
      es: ['Cultivar el silencio lleva tiempo. No se puede imponer mediante presión o fuerza. No podemos simplemente ordenarnos estar en calma.', 'La poeta Hilde Domin lo expresó con una bella imagen: tender la mano al milagro, con paciencia y suavidad, como se le tiende a un pájaro.', 'Para experimentar el silencio, primero debemos hacerle sitio.'],
    },
    exercise: {
      minutes: 20,
      title: {"en": "Twenty minutes without an objective", "de": "Zwanzig Minuten ohne Ziel", "fr": "Vingt minutes sans objectif", "es": "Veinte minutos sin objetivo"},
      steps: {
        en: ["Sit quietly for twenty minutes.", "Today, do not try to relax. Do not try to become calm. Do not try to improve your concentration. Do not try to have a profound experience.", "Simply sit. Notice breathing, bodily sensations, sounds and thoughts. Whatever happens is acceptable.", "If you feel peaceful, notice peace. If you feel restless, notice restlessness.", "Make space for the experience rather than trying to control it."],
        de: ["Sitzen Sie zwanzig Minuten still.", "Versuchen Sie heute nicht, sich zu entspannen. Versuchen Sie nicht, ruhig zu werden. Versuchen Sie nicht, Ihre Konzentration zu verbessern. Versuchen Sie nicht, eine tiefe Erfahrung zu machen.", "Sitzen Sie einfach. Nehmen Sie Atem, Körperempfindungen, Geräusche und Gedanken wahr. Was auch immer geschieht, ist in Ordnung.", "Wenn Sie Frieden spüren, bemerken Sie den Frieden. Wenn Sie Unruhe spüren, bemerken Sie die Unruhe.", "Geben Sie der Erfahrung Raum, statt sie kontrollieren zu wollen."],
        fr: ["Asseyez-vous en silence pendant vingt minutes.", "Aujourd’hui, n’essayez pas de vous détendre. N’essayez pas de devenir calme. N’essayez pas d’améliorer votre concentration. N’essayez pas de vivre une expérience profonde.", "Asseyez-vous, simplement. Remarquez la respiration, les sensations du corps, les sons et les pensées. Tout ce qui se passe est acceptable.", "Si vous vous sentez en paix, remarquez la paix. Si vous vous sentez agité(e), remarquez l’agitation.", "Faites de la place à l’expérience plutôt que d’essayer de la contrôler."],
        es: ["Siéntese en silencio durante veinte minutos.", "Hoy no intente relajarse. No intente calmarse. No intente mejorar su concentración. No intente tener una experiencia profunda.", "Simplemente siéntese. Observe la respiración, las sensaciones del cuerpo, los sonidos y los pensamientos. Todo lo que ocurra es aceptable.", "Si siente paz, observe la paz. Si siente inquietud, observe la inquietud.", "Haga sitio a la experiencia en lugar de intentar controlarla."],
      },
    },
  },
  {
    day: 10,
    title: { en: 'Taking silence with you', de: 'Die Stille mitnehmen', fr: 'Emporter le silence avec soi', es: 'Llevarse el silencio consigo' },
    theme: { en: 'Bringing the experience back into everyday life.', de: 'Die Erfahrung in den Alltag mitnehmen.', fr: 'Ramener l’expérience dans la vie quotidienne.', es: 'Llevar la experiencia a la vida cotidiana.' },
    quote: {
      en: ['Fasting and silence are twin companions because both begin with a form of letting go.', 'One interrupts our habitual relationship with food. The other interrupts our habitual relationship with noise, activity and distraction.', 'Both may offer something that has become increasingly rare: the freedom to stop, to turn inward, and simply to be.'],
      de: ['Fasten und Schweigen sind Zwillingsgefährten, weil beide mit einer Form des Loslassens beginnen.', 'Das eine unterbricht unsere gewohnte Beziehung zum Essen. Das andere unterbricht unsere gewohnte Beziehung zu Lärm, Aktivität und Ablenkung.', 'Beide können etwas schenken, das immer seltener geworden ist: die Freiheit, innezuhalten, sich nach innen zu wenden und einfach zu sein.'],
      fr: ['Le jeûne et le silence sont des compagnons jumeaux, car tous deux commencent par une forme de lâcher-prise.', 'L’un interrompt notre rapport habituel à la nourriture. L’autre interrompt notre rapport habituel au bruit, à l’activité et à la distraction.', 'Tous deux peuvent offrir quelque chose de plus en plus rare : la liberté de s’arrêter, de se tourner vers l’intérieur et, simplement, d’être.'],
      es: ['El ayuno y el silencio son compañeros gemelos porque ambos empiezan con una forma de soltar.', 'Uno interrumpe nuestra relación habitual con la comida. El otro interrumpe nuestra relación habitual con el ruido, la actividad y la distracción.', 'Ambos pueden ofrecer algo cada vez más escaso: la libertad de detenerse, de volverse hacia dentro y, sencillamente, de ser.'],
    },
    exercise: {
      minutes: 20,
      title: {"en": "Twenty minutes, and one practice to keep", "de": "Zwanzig Minuten – und eine Übung, die bleibt", "fr": "Vingt minutes, et une pratique à garder", "es": "Veinte minutos y una práctica para conservar"},
      steps: {
        en: ["Sit quietly for twenty minutes. For the first fifteen, simply sit: breath, body, sounds, thoughts.", "In the last five minutes, think about the previous days. Do not evaluate whether you were “good” at meditation.", "Ask yourself: Was there one moment of silence that I valued? Was there one practice that felt natural? What would I like to keep when I return home?", "Choose one very small practice — for example: fifteen minutes of sitting each morning · one walk per week without a phone · no phone during meals · one hour of digital silence in the evening.", "Choose only one. It should be simple enough that you could realistically continue it.", "There is nothing more to unlock. The programme ends here."],
        de: ["Sitzen Sie zwanzig Minuten still. Die ersten fünfzehn Minuten sitzen Sie einfach: Atem, Körper, Geräusche, Gedanken.", "Denken Sie in den letzten fünf Minuten an die vergangenen Tage. Bewerten Sie nicht, ob Sie „gut“ meditiert haben.", "Fragen Sie sich: Gab es einen Moment der Stille, der mir wertvoll war? Gab es eine Übung, die sich natürlich anfühlte? Was möchte ich bewahren, wenn ich nach Hause komme?", "Wählen Sie eine ganz kleine Übung – zum Beispiel: fünfzehn Minuten Sitzen jeden Morgen · ein Spaziergang pro Woche ohne Telefon · kein Telefon beim Essen · eine Stunde digitale Stille am Abend.", "Wählen Sie nur eine. Sie sollte so einfach sein, dass Sie sie realistisch beibehalten können.", "Es gibt nichts mehr freizuschalten. Das Programm endet hier."],
        fr: ["Asseyez-vous en silence pendant vingt minutes. Les quinze premières, restez simplement assis(e) : respiration, corps, sons, pensées.", "Pendant les cinq dernières minutes, repensez aux jours précédents. Ne jugez pas si vous avez « bien » médité.", "Demandez-vous : Y a-t-il eu un moment de silence qui a compté pour moi ? Une pratique qui m’a semblé naturelle ? Que voudrais-je garder en rentrant chez moi ?", "Choisissez une toute petite pratique – par exemple : quinze minutes assis(e) chaque matin · une promenade par semaine sans téléphone · pas de téléphone pendant les repas · une heure de silence numérique le soir.", "N’en choisissez qu’une. Elle doit être assez simple pour que vous puissiez réellement la poursuivre.", "Il n’y a plus rien à débloquer. Le programme s’arrête ici."],
        es: ["Siéntese en silencio durante veinte minutos. Los primeros quince, simplemente permanezca sentado/a: respiración, cuerpo, sonidos, pensamientos.", "En los últimos cinco minutos, piense en los días anteriores. No evalúe si ha meditado «bien».", "Pregúntese: ¿Hubo un momento de silencio que valoré? ¿Hubo una práctica que me resultó natural? ¿Qué me gustaría conservar al volver a casa?", "Elija una práctica muy pequeña, por ejemplo: quince minutos sentado/a cada mañana · un paseo a la semana sin teléfono · nada de teléfono durante las comidas · una hora de silencio digital por la noche.", "Elija solo una. Debe ser lo bastante sencilla como para poder mantenerla de verdad.", "No hay nada más que desbloquear. El programa termina aquí."],
      },
    },
  },
];

/**
 * Which programme day belongs to journey day `dayNumber` of a stay with `totalDays` daily days.
 * Day k → practice k. Stays shorter than 10 days end with practice 10 ("Taking silence with you")
 * on their last day. After day 10 there is no new practice (the programme has ended).
 */
export function practiceFor(dayNumber, totalDays) {
  if (!dayNumber) return null;
  if (totalDays < 10 && dayNumber === totalDays) return PROGRAMME[9];
  return PROGRAMME[dayNumber - 1] || null;
}
