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
    'hero.stamp':    'Monterrey · México',
    'hero.headline': '<span class="hero__line">Aquí</span><span class="hero__line">empieza</span><span class="hero__line">el regreso.</span>',
    'hero.sub':      'Algunas cosas no se optimizan.<br>Se sienten.',
    'hero.cta':      'Únete a la lista',

    // Manifesto
    'manifesto.eyebrow':  'Manifiesto',
    'manifesto.headline': 'Llevas años construyendo.<br>¿Cuándo fue la última vez<br>que supiste quién eres?',
    'manifesto.body1':    'Latente existe para ese momento. No somos un spa. No somos terapia. No somos otra marca de bienestar que te vende paz en una botella.',
    'manifesto.body2':    'Somos espacios deliberados — en la sierra, en el bosque, en el agua — donde lo que siempre has sabido de ti vuelve a la superficie.',
    'manifesto.body3':    'Saldrás sabiendo algo de ti que no traías al entrar.',

    // Experiences
    'experiences.eyebrow': 'Lo que creamos',
    'experiences.heading': 'Experiencias',

    'card.workshop.label':    'Workshop',
    'card.workshop.title':    'Talleres',
    'card.workshop.group':    'Grupos de 10–25 personas',
    'card.workshop.text':     'Un día de práctica real. El contenido no es el destino — es el punto de partida. Para equipos, comunidades, o cualquiera que quiera ir más hondo.',
    'card.workshop.duration': 'Medio día · Un día completo',

    'card.retiro.label':    'Retiro',
    'card.retiro.title':    'Retiros Inmersivos',
    'card.retiro.group':    'Grupos de 8–16 personas',
    'card.retiro.text':     'Dos o tres días fuera del ruido. En la sierra, el bosque, o cerca del agua. Diseñamos la experiencia completa — el lugar, el ritmo, lo que pasa adentro.',
    'card.retiro.duration': '2–4 noches',

    'card.evento.label':    'Evento',
    'card.evento.title':    'Experiencias y Eventos',
    'card.evento.group':    'Escala flexible',
    'card.evento.text':     'Para marcas, comunidades o proyectos que quieren crear algo que se recuerde. Producimos experiencias donde el ambiente y el contenido trabajan juntos.',
    'card.evento.duration': 'Un día · Fin de semana',

    'card.colab.label':    'Colaboración',
    'card.colab.title':    'Colaboraciones',
    'card.colab.group':    'Por proyecto',
    'card.colab.text':     'Trabajamos con espacios, marcas y creadores que comparten nuestra visión. Si tienes un lugar, una audiencia, o una idea — hablemos.',
    'card.colab.duration': 'Formato abierto',

    // Waitlist
    'waitlist.eyebrow':     'Lista de espera',
    'waitlist.headline':    'Algo se está<br>formando.',
    'waitlist.sub':         'Sé el primero en saber cuándo abrimos. Sin spam. Sin urgencia artificial. Solo lo que importa, cuando importa.',
    'waitlist.label.name':        'Nombre',
    'waitlist.placeholder.name':  'Tu nombre',
    'waitlist.label.lastname':    'Apellido (opcional)',
    'waitlist.placeholder.lastname': 'Tu apellido',
    'waitlist.label.email':       'Tu correo electrónico',
    'waitlist.placeholder.email': 'tu@correo.com',
    'waitlist.cta':               'Estoy dentro',
    'waitlist.note':        'Escribimos cuando importa. Sin ruido.',

    // Form feedback
    'form.error.name':   'Por favor ingresa tu nombre.',
    'form.error.email':  'Por favor ingresa un correo válido.',
    'form.success':      'Ya estás dentro. Te escribiremos pronto.',
    'form.error.server': 'Algo salió mal. Intenta de nuevo.',
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
    'hero.stamp':    'Monterrey · México',
    'hero.headline': '<span class="hero__line">This is where</span><span class="hero__line">you return</span><span class="hero__line">to yourself.</span>',
    'hero.sub':      'Some things can\'t be optimized.<br>They have to be felt.',
    'hero.cta':      'Join the waitlist',

    // Manifesto
    'manifesto.eyebrow':  'Manifesto',
    'manifesto.headline': 'You\'ve spent years building.<br>When did you last know<br>who you really are?',
    'manifesto.body1':    'Latente exists for that moment. We\'re not a spa. We\'re not therapy. We\'re not another wellness brand selling you peace in a bottle.',
    'manifesto.body2':    'We are deliberate spaces — in the mountains, the forest, by the water — where what you\'ve always known about yourself comes back to the surface.',
    'manifesto.body3':    'You will leave knowing something about yourself that you didn\'t walk in with.',

    // Experiences
    'experiences.eyebrow': 'What we create',
    'experiences.heading': 'Experiences',

    'card.workshop.label':    'Workshop',
    'card.workshop.title':    'Workshops',
    'card.workshop.group':    'Groups of 10–25 people',
    'card.workshop.text':     'A day of real practice. The content isn\'t the destination — it\'s the starting point. For teams, communities, or anyone ready to go deeper.',
    'card.workshop.duration': 'Half day · Full day',

    'card.retiro.label':    'Retreat',
    'card.retiro.title':    'Immersive Retreats',
    'card.retiro.group':    'Groups of 8–16 people',
    'card.retiro.text':     'Two or three days away from the noise. In the mountains, the forest, near the water. We design the full experience — the place, the pace, what happens inside.',
    'card.retiro.duration': '2–4 nights',

    'card.evento.label':    'Event',
    'card.evento.title':    'Experiences & Events',
    'card.evento.group':    'Flexible scale',
    'card.evento.text':     'For brands, communities, or projects that want to create something memorable. We produce experiences where space and content work together.',
    'card.evento.duration': 'One day · Weekend',

    'card.colab.label':    'Collaboration',
    'card.colab.title':    'Collaborations',
    'card.colab.group':    'Project-based',
    'card.colab.text':     'We work with spaces, brands, and creators who share our vision. If you have a place, an audience, or an idea — let\'s talk.',
    'card.colab.duration': 'Open format',

    // Waitlist
    'waitlist.eyebrow':     'Waitlist',
    'waitlist.headline':    'Something is<br>taking shape.',
    'waitlist.sub':         'Be the first to know when we open. No spam. No artificial urgency. Just what matters, when it matters.',
    'waitlist.label.name':        'First name',
    'waitlist.placeholder.name':  'Your first name',
    'waitlist.label.lastname':    'Last name (optional)',
    'waitlist.placeholder.lastname': 'Your last name',
    'waitlist.label.email':       'Your email address',
    'waitlist.placeholder.email': 'your@email.com',
    'waitlist.cta':               'I want in',
    'waitlist.note':        'We\'ll write when it matters. No noise.',

    // Form feedback
    'form.error.name':   'Please enter your first name.',
    'form.error.email':  'Please enter a valid email address.',
    'form.success':      'You\'re in. We\'ll be in touch.',
    'form.error.server': 'Something went wrong. Please try again.',
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
