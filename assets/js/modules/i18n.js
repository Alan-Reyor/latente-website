/* ============================================================
   LATENTE — i18n.js
   Bilingual support (ES / EN).
   All translatable strings live here.
   DOM elements use data-i18n, data-i18n-html,
   data-i18n-placeholder, or data-i18n-aria attributes.
   ============================================================ */

const translations = {
  es: {
    // Nav
    'nav.experiences':  'Experiencias',
    'nav.about':        'Nosotros',
    'nav.join':         'Únete',
    'nav.menu':         'Menú',
    'nav.toggle.aria':  'Abrir menú de navegación',
    'nav.lang.aria':    'Switch to English',

    // Hero
    'hero.headline': '<span class="hero__line">Aquí</span><span class="hero__line">empieza</span><span class="hero__line">el regreso.</span>',
    'hero.sub':      'Lo que eres sigue ahí. Latente.',

    // Moments
    'moments.headline': 'Hay lugares y momentos que te devuelven algo...',
    'moments.1': 'Un horizonte sin prisa.',
    'moments.2': 'Un silencio al amanecer.',
    'moments.3': 'Una caminata larga.',
    'moments.4': 'Un momento donde el tiempo se detiene.',
    'moments.5': 'Un regreso a lo simple.',
    'moments.6': 'Una conversación que no pasaba hace años.',

    // Promise
    'promise.headline': 'Construimos los espacios que crean las condiciones para que algo internamente se acomode.',
    'promise.sub1':     'Te vas a ir sabiendo algo de ti que no sabías al llegar.',
    'promise.sub2':     'Es lo único que prometemos.',
    'promise.brand':    'Eso es Latente.',
    'promise.body':     'Retiros, talleres y experiencias inmersivas diseñadas con la naturaleza, con la comunidad y con el silencio que hace falta para volver a oírte.',

    // Duality — experience column
    'duality.exp.eyebrow':  'La experiencia',
    'duality.exp.headline': 'El contenido es un plus. La experiencia es lo que se queda.',
    'duality.exp.body':     'Vas a tener la información, las prácticas, las herramientas, las ideas para llevarte. Pero lo más importante para nosotros es que te lleves una experiencia viva, de las que se vuelven a sentir cada vez que las recuerdas.',
    'duality.exp.accent':   'Lo que hacemos es ponerte en un lugar, con un grupo, con una estructura diseñada, y dejar que ahí pase lo que tenga que pasar.',

    // Duality — nature column
    'duality.nat.eyebrow':  'La naturaleza',
    'duality.nat.headline': 'Es co-facilitadora.',
    'duality.nat.body':     'Hace el trabajo que nosotros no podemos hacer: bajarte la velocidad, sacarte de la pantalla, regresarte al cuerpo.',
    'duality.nat.list':     'A soltar. A fluir. A quedarse quieto cuando todo pide moverse. A rendirse sin perder. A escuchar lo que no se dice.',

    // Experiences
    'experiences.eyebrow': 'Los espacios que creamos',
    'experiences.heading': 'Experiencias',

    'card.workshop.label':    'Taller',
    'card.workshop.title':    'Talleres',
    'card.workshop.group':    'Grupos de 10 a 25 personas',
    'card.workshop.text':     'Un día para bajar el ritmo y entrar en algo más hondo. Trabajamos un tema, una práctica, una conversación.',
    'card.workshop.duration': 'Medio día o día completo',

    'card.retiro.label':    'Retiro',
    'card.retiro.title':    'Retiros Inmersivos',
    'card.retiro.group':    'Grupos de 8 a 16 personas',
    'card.retiro.text':     'Dos o tres días fuera del ruido. Diseñamos la experiencia completa: el lugar, el ritmo, lo que pasa adentro y lo que pasa entre quienes están ahí.',
    'card.retiro.duration': 'De 2 a 4 noches',

    'card.evento.label':    'Evento',
    'card.evento.title':    'Experiencias y Eventos',
    'card.evento.group':    'Escala flexible',
    'card.evento.text':     'Para marcas, comunidades o proyectos que quieren crear algo que se recuerde. Producimos experiencias donde el ambiente, el contenido y la gente trabajan juntos.',
    'card.evento.duration': 'Un día o fin de semana',

    'card.colab.label':    'Colaboración',
    'card.colab.title':    'Colaboraciones',
    'card.colab.group':    'Por proyecto',
    'card.colab.text':     'Trabajamos con espacios, marcas y creadores que comparten nuestra visión. Si tienes un lugar, una audiencia o una idea, hablemos.',
    'card.colab.duration': 'Formato abierto',

    // Para ti
    'parati.title':   'Para ti si…',
    'parati.bullet1': 'Sabes que tu rendimiento no depende de cuánto te exiges, sino de qué tan bien te conoces.',
    'parati.bullet2': 'Que el desgaste no es prueba de compromiso. Que llegar lejos y llegar pleno es la única meta que vale la pena.',
    'parati.bullet3': 'No estás buscando tu mejor versión porque ya tienes una muy buena, lo que buscas es sostenerla.',
    'parati.bullet4': 'Estás en un momento donde lo siguiente no se construye haciendo más, sino volviendo a ti.',

    // Waitlist
    'waitlist.eyebrow':              'Lista de espera',
    'waitlist.headline':             'Estamos abriendo<br>los primeros espacios.',
    'waitlist.sub':                  'Chicos por diseño. Cuidados por pasión. Déjanos tu correo para avisarte antes que a nadie cuando se abran lugares, porque no van a ser muchos.',
    'waitlist.label.name':           'Nombre',
    'waitlist.placeholder.name':     'Tu nombre',
    'waitlist.label.lastname':       'Apellido (opcional)',
    'waitlist.placeholder.lastname': 'Tu apellido',
    'waitlist.label.email':          'Tu correo electrónico',
    'waitlist.placeholder.email':    'tu@correo.com',
    'waitlist.cta':                  'Estoy dentro',
    'waitlist.note':                 'Sin spam. Sin urgencia artificial. Solo lo que importa, cuando importa. Te escribimos cuando sea tu momento de entrar.',

    // Form feedback
    'form.error.name':   'Por favor ingresa tu nombre.',
    'form.error.email':  'Por favor ingresa un correo válido.',
    'form.success':      'Ya estás dentro. Te escribiremos pronto.',
    'form.error.server': 'Algo salió mal. Intenta de nuevo.',

    // Closing
    'closing.line1': 'No te perdiste.',
    'closing.line2': 'Solo dejaste de escucharte.',
    'closing.line3': 'Quédate lo suficientemente quieto',
    'closing.line4': 'para volver a oírte.',
  },

  en: {
    // Nav
    'nav.experiences':  'Experiences',
    'nav.about':        'About',
    'nav.join':         'Join',
    'nav.menu':         'Menu',
    'nav.toggle.aria':  'Open navigation menu',
    'nav.lang.aria':    'Cambiar a español',

    // Hero
    'hero.headline': '<span class="hero__line">This is where</span><span class="hero__line">you return</span><span class="hero__line">to yourself.</span>',
    'hero.sub':      'What you are is still there. Latent.',

    // Moments
    'moments.headline': 'There are places and moments that give something back to you...',
    'moments.1': 'A horizon with no rush.',
    'moments.2': 'A silence at dawn.',
    'moments.3': 'A long walk.',
    'moments.4': 'A moment where time stands still.',
    'moments.5': 'A return to simplicity.',
    'moments.6': 'A conversation that hadn\'t happened in years.',

    // Promise
    'promise.headline': 'We build the spaces that create the conditions for something to settle inside.',
    'promise.sub1':     'You\'ll leave knowing something about yourself that you didn\'t know when you arrived.',
    'promise.sub2':     'That\'s the only thing we promise.',
    'promise.brand':    'That\'s Latente.',
    'promise.body':     'Retreats, workshops, and immersive experiences designed with nature, community, and the silence needed to hear yourself again.',

    // Duality — experience column
    'duality.exp.eyebrow':  'The experience',
    'duality.exp.headline': 'Content is a bonus. The experience is what stays.',
    'duality.exp.body':     'You\'ll have the information, the practices, the tools, the ideas to take with you. But what matters most is that you take with you a living experience — the kind that comes back to you every time you remember it.',
    'duality.exp.accent':   'What we do is place you in a setting, with a group, with a designed structure, and let whatever needs to happen, happen.',

    // Duality — nature column
    'duality.nat.eyebrow':  'Nature',
    'duality.nat.headline': 'It\'s a co-facilitator.',
    'duality.nat.body':     'It does the work we can\'t: slowing you down, pulling you from the screen, returning you to your body.',
    'duality.nat.list':     'To let go. To flow. To stay still when everything asks you to move. To surrender without losing. To listen to what goes unsaid.',

    // Experiences
    'experiences.eyebrow': 'The spaces we create',
    'experiences.heading': 'Experiences',

    'card.workshop.label':    'Workshop',
    'card.workshop.title':    'Workshops',
    'card.workshop.group':    'Groups of 10 to 25 people',
    'card.workshop.text':     'One day to slow down and go deeper. We work a theme, a practice, a conversation.',
    'card.workshop.duration': 'Half day or full day',

    'card.retiro.label':    'Retreat',
    'card.retiro.title':    'Immersive Retreats',
    'card.retiro.group':    'Groups of 8 to 16 people',
    'card.retiro.text':     'Two or three days away from the noise. We design the full experience: the place, the pace, what happens inside and what happens between the people there.',
    'card.retiro.duration': '2 to 4 nights',

    'card.evento.label':    'Event',
    'card.evento.title':    'Experiences & Events',
    'card.evento.group':    'Flexible scale',
    'card.evento.text':     'For brands, communities, or projects that want to create something memorable. We produce experiences where space, content, and people work together.',
    'card.evento.duration': 'One day or weekend',

    'card.colab.label':    'Collaboration',
    'card.colab.title':    'Collaborations',
    'card.colab.group':    'Project-based',
    'card.colab.text':     'We work with spaces, brands, and creators who share our vision. If you have a place, an audience, or an idea, let\'s talk.',
    'card.colab.duration': 'Open format',

    // Para ti
    'parati.title':   'This is for you if…',
    'parati.bullet1': 'You know your performance doesn\'t depend on how hard you push yourself, but on how well you know yourself.',
    'parati.bullet2': 'That burnout isn\'t proof of commitment. That going far and arriving whole is the only goal worth pursuing.',
    'parati.bullet3': 'You\'re not looking for your best version because you already have a very good one — what you\'re looking for is to sustain it.',
    'parati.bullet4': 'You\'re at a point where what\'s next isn\'t built by doing more, but by returning to yourself.',

    // Waitlist
    'waitlist.eyebrow':              'Waitlist',
    'waitlist.headline':             'We\'re opening<br>the first spaces.',
    'waitlist.sub':                  'Small by design. Cared for with passion. Leave us your email and we\'ll let you know before anyone else when spots open — because there won\'t be many.',
    'waitlist.label.name':           'First name',
    'waitlist.placeholder.name':     'Your first name',
    'waitlist.label.lastname':       'Last name (optional)',
    'waitlist.placeholder.lastname': 'Your last name',
    'waitlist.label.email':          'Your email address',
    'waitlist.placeholder.email':    'your@email.com',
    'waitlist.cta':                  'I want in',
    'waitlist.note':                 'No spam. No artificial urgency. Just what matters, when it matters. We\'ll write when it\'s your moment to enter.',

    // Form feedback
    'form.error.name':   'Please enter your first name.',
    'form.error.email':  'Please enter a valid email address.',
    'form.success':      'You\'re in. We\'ll be in touch.',
    'form.error.server': 'Something went wrong. Please try again.',

    // Closing
    'closing.line1': 'You didn\'t get lost.',
    'closing.line2': 'You just stopped listening.',
    'closing.line3': 'Stay still long enough',
    'closing.line4': 'to hear yourself again.',
  },
};

let currentLang = 'es';

function initI18n() {
  const saved = localStorage.getItem('latente-lang');
  const lang = (saved === 'es' || saved === 'en') ? saved : 'es';
  setLanguage(lang, false);

  const toggle = document.querySelector('[data-lang-toggle]');
  if (toggle) {
    toggle.addEventListener('click', () => {
      setLanguage(currentLang === 'es' ? 'en' : 'es');
    });
  }
}

function setLanguage(lang, save = true) {
  currentLang = lang;
  if (save) localStorage.setItem('latente-lang', lang);
  document.documentElement.lang = lang;
  applyTranslations();
  updateSwitcherUI();
}

function applyTranslations() {
  const t = translations[currentLang];

  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (t[key] !== undefined) el.textContent = t[key];
  });

  document.querySelectorAll('[data-i18n-html]').forEach((el) => {
    const key = el.getAttribute('data-i18n-html');
    if (t[key] !== undefined) el.innerHTML = t[key];
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (t[key] !== undefined) el.setAttribute('placeholder', t[key]);
  });

  document.querySelectorAll('[data-i18n-aria]').forEach((el) => {
    const key = el.getAttribute('data-i18n-aria');
    if (t[key] !== undefined) el.setAttribute('aria-label', t[key]);
  });
}

function updateSwitcherUI() {
  document.querySelectorAll('[data-lang-opt]').forEach((opt) => {
    const isActive = opt.getAttribute('data-lang-opt') === currentLang;
    opt.classList.toggle('nav__lang-opt--active', isActive);
  });

  const toggle = document.querySelector('[data-lang-toggle]');
  if (toggle) {
    toggle.setAttribute('aria-label', translations[currentLang]['nav.lang.aria']);
  }
}

function getTranslation(key) {
  return translations[currentLang]?.[key] ?? key;
}
