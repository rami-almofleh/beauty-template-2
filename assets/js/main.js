const doc = document;
const body = doc.body;

const topbar = doc.querySelector('[data-topbar]');
const navToggle = doc.querySelector('[data-nav-toggle]');
const navMenu = doc.querySelector('[data-nav]');
const revealItems = doc.querySelectorAll('.reveal');
const filterButtons = doc.querySelectorAll('[data-filter]');
const filterCards = doc.querySelectorAll('[data-service-category]');
const forms = doc.querySelectorAll('[data-form]');
const yearNode = doc.querySelector('[data-year]');
const lightbox = doc.querySelector('[data-lightbox]');
const LOCALE_STORAGE_KEY = 'maison-aveline.locale';

const readStoredLocale = () => {
  try {
    const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);
    return stored === 'de' || stored === 'en' ? stored : null;
  } catch {
    return null;
  }
};

const storeLocale = (nextLocale) => {
  try {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, nextLocale);
  } catch {
    // Ignore storage failures in privacy-restricted contexts.
  }
};

const detectLocale = () => {
  const override = new URLSearchParams(window.location.search).get('lang');
  if (override === 'de' || override === 'en') {
    return override;
  }

  const stored = readStoredLocale();
  if (stored) {
    return stored;
  }

  const languages = Array.isArray(navigator.languages) && navigator.languages.length > 0
    ? navigator.languages
    : [navigator.language || 'en'];

  return languages.some((language) => String(language).toLowerCase().startsWith('de')) ? 'de' : 'en';
};

const locale = detectLocale();
storeLocale(locale);
const pageId = (() => {
  const fileName = window.location.pathname.split('/').filter(Boolean).pop() || 'index.html';
  return fileName === '/' ? 'index.html' : fileName;
})();

const buildLocaleUrl = (nextLocale) => {
  const url = new URL(window.location.href);
  url.searchParams.set('lang', nextLocale);
  return `${url.pathname}${url.search}${url.hash}`;
};

const syncLocaleAwareLinks = () => {
  doc.querySelectorAll('a[href]').forEach((link) => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) {
      return;
    }

    try {
      const url = new URL(href, window.location.href);
      if (url.origin !== window.location.origin) {
        return;
      }

      url.searchParams.set('lang', locale);
      link.setAttribute('href', `${url.pathname}${url.search}${url.hash}`);
    } catch {
      // Ignore malformed or unsupported URLs.
    }
  });
};

const injectLanguageSwitcher = () => {
  if (!navMenu || navMenu.querySelector('[data-lang-switcher]')) return;

  const labels = locale === 'de'
    ? {
        switcher: 'Sprache wechseln',
        de: 'Deutsch',
        en: 'Englisch',
      }
    : {
        switcher: 'Language switcher',
        de: 'German',
        en: 'English',
      };

  const switcher = doc.createElement('div');
  switcher.className = 'lang-switcher';
  switcher.dataset.langSwitcher = 'true';
  switcher.setAttribute('role', 'group');
  switcher.setAttribute('aria-label', labels.switcher);

  const options = [
    { code: 'de', label: 'DE', ariaLabel: labels.de },
    { code: 'en', label: 'EN', ariaLabel: labels.en },
  ];

  options.forEach((option) => {
    const button = doc.createElement('button');
    button.type = 'button';
    button.className = 'lang-switcher__button';
    button.textContent = option.label;
    button.setAttribute('aria-label', option.ariaLabel);
    button.setAttribute('aria-pressed', String(option.code === locale));

    if (option.code === locale) {
      button.classList.add('is-active');
    }

    button.addEventListener('click', () => {
      if (option.code === locale) return;
      storeLocale(option.code);
      window.location.href = buildLocaleUrl(option.code);
    });

    switcher.appendChild(button);
  });

  const cta = navMenu.querySelector('.button--primary');
  if (cta) {
    navMenu.insertBefore(switcher, cta);
  } else {
    navMenu.appendChild(switcher);
  }
};

const normalizeTranslationKey = (value) => String(value).replace(/\s+/g, ' ').trim();

const TEXT_TRANSLATIONS = {
  en: {
    'Zum Inhalt springen': 'Skip to content',
    'Navigation öffnen': 'Open navigation',
    'Start': 'Home',
    'Leistungen': 'Services',
    'Galerie': 'Gallery',
    'Preise': 'Pricing',
    'Kontakt': 'Contact',
    'Hauptnavigation': 'Main navigation',
    'Galerieansicht schließen': 'Close gallery view',
    '5 von 5 Sternen': '5 out of 5 stars',
    'Kennzahlen und Vertrauen': 'Metrics and trust',
    'Termin anfragen': 'Request appointment',
    'Alle Rechte vorbehalten.': 'All rights reserved.',
    'Navigation': 'Navigation',
    'Service': 'Service',
    'Mehr über Maison Aveline': 'More about Maison Aveline',
    'Alle Preise ansehen': 'View all prices',
    'Beratung & Termin': 'Consultation & Appointment',
    'Leistungen ansehen': 'View services',
    'Beratung anfragen': 'Request consultation',
    'Preisübersicht': 'Price overview',
    'Antworten lesen': 'Read answers',
    'Mehr zur Terminpolitik': 'More on appointment policy',
    'FAQ öffnen': 'Open FAQ',
    'Jetzt anfragen': 'Request now',
    'Anrufen': 'Call',
    'Kontakt & Buchung': 'Contact & booking',
    'Preise & Pakete': 'Prices & packages',
    'Leistungsübersicht': 'Service overview',
    'Über das Studio': 'About the studio',
    'Galerie': 'Gallery',
    'Stimmen': 'Testimonials',
    'Warum Maison Aveline': 'Why Maison Aveline',
    'FAQ': 'FAQ',
    'Schnelle Orientierung': 'Quick orientation',
    'Nächster Schritt': 'Next step',
    'Buchung': 'Booking',
    'Kontakt': 'Contact',
    'Gut zu wissen': 'Good to know',
    'Pakete': 'Packages',
    'Einzelleistungen': 'Single services',
    'Brows & Lashes': 'Brows & lashes',
    'Nails & Styling': 'Nails & styling',
    'Beliebte Kombinationen': 'Popular combinations',
    'Vorbereitung': 'Preparation',
    'Häufige Fragen': 'Frequently asked questions',
    'Alles Wichtige auf einen Blick': 'Everything important at a glance',
    'Noch offen?': 'Still unsure?',
    'Direkt weiter': 'Continue',
    'Hinweis': 'Note',
    'Übersicht': 'Overview',
    'Vorbereitung': 'Preparation',
    'Anfrageformular': 'Inquiry form',
    'Studio': 'Studio',
    'Kontaktwege': 'Contact options',
    'Öffnungszeiten': 'Opening hours',
    'Social': 'Social',
    'Anfahrt': 'Getting there',
    'Schneller Einstieg': 'Quick start',
    'Datenschutz': 'Privacy',
    'Impressum': 'Imprint',
    'Luxury Beauty Atelier': 'Luxury Beauty Atelier',
    'Ruhige Rituale.': 'Calm Rituals.',
    'Präzise Pflege.': 'Precise Care.',
    'Maison Aveline steht für private Termine, ruhige Hautpflege und klare Beratung in Berlin-Mitte.': 'Maison Aveline stands for private appointments, calm skincare, and clear guidance in Berlin-Mitte.',
    'Individuelle Hautanalyse': 'Personal skin analysis',
    'Boutique-Atmosphäre': 'Boutique atmosphere',
    'Clean Beauty Fokus': 'Clean beauty focus',
    'unserer Neukundinnen buchen innerhalb von acht Wochen erneut.': 'of our new clients rebook within eight weeks.',
    'Beratung mit Behandlungsplan, Produktempfehlung und Zeit für Fragen.': 'Consultation with a treatment plan, product recommendations, and time for questions.',
    'kuratierte Wirkstoffe und Pflegekonzepte für sensible, gestresste und anspruchsvolle Haut.': 'curated actives and care concepts for sensitive, stressed, and demanding skin.',
    'zentral gelegen, ruhig gestaltet und konsequent auf Premium-Service ausgerichtet.': 'centrally located, quietly designed, and consistently focused on premium service.',
    'Vertrauen entsteht durch Haltung, Detailtiefe und ein sauberes System.': 'Trust comes from attitude, depth of detail, and a clean system.',
    'Unsere Behandlungen sind nicht auf schnelle Effekte gebaut, sondern auf spürbare Hautqualität, ästhetische Präzision und eine angenehm entschleunigte Kundenerfahrung.': 'Our treatments are not built for quick effects, but for tangible skin quality, aesthetic precision, and a pleasantly decelerated client experience.',
    'Präzisionsdiagnostik': 'Precision diagnostics',
    'Jede Behandlung startet mit Hautbild, Zieldefinition und einem klaren Ritualablauf statt Standardprogramm.': 'Every treatment starts with skin analysis, goal definition, and a clear ritual flow instead of a standard program.',
    'Ideal bei sensibler, müder oder unruhiger Haut.': 'Ideal for sensitive, tired, or unsettled skin.',
    'Ruhige Luxus-Atmosphäre': 'Calm luxury atmosphere',
    'Private Termine, reduzierte Geräuschkulisse und ein Interior, das bewusst auf Ruhe, Licht und Struktur setzt.': 'Private appointments, reduced noise, and an interior consciously designed around calm, light, and structure.',
    'Mehr Boutique-Studio als klassischer Salon.': 'More boutique studio than classic salon.',
    'Ästhetik mit Feingefühl': 'Aesthetics with sensitivity',
    'Brows, Lashes und Hände werden auf Ihre Proportionen abgestimmt, nicht auf schnelllebige Trends.': 'Brows, lashes, and hands are shaped to your proportions, not to short-lived trends.',
    'Natürlich, gepflegt und sichtbar hochwertig.': 'Natural, polished, and visibly premium.',
    'Pflege, die weiterwirkt': 'Care that lasts',
    'Sie erhalten nach Bedarf Produktempfehlungen, Pflegeabfolgen und saisonale Routinen für zuhause.': 'When needed, you receive product recommendations, care sequences, and seasonal routines for home.',
    'Damit Ergebnisse nicht nur im Studio bestehen.': 'So results last beyond the studio.',
    'Kuratiert für Hautbild, Präsenz und gepflegte Details.': 'Curated for skin condition, presence, and polished details.',
    'Vom Signature Facial bis zur Brow Architecture sind alle Leistungen so aufgebaut, dass sie sich klar erklären lassen, sauber verkaufen und angenehm buchen lassen.': 'From the Signature Facial to Brow Architecture, every service is structured so it can be explained clearly, sold cleanly, and booked easily.',
    'Alle Leistungen entdecken': 'Discover all services',
    'Ergebnisorientierte Gesichtsbehandlungen mit Analyse, aktiver Wirkstoffpflege und entspannender Massage.': 'Results-oriented facial treatments with analysis, active skincare, and a relaxing massage.',
    '60-90 Min': '60-90 min',
    'ab 119 EUR': 'from EUR 119',
    'Form, Farbe und Lift für einen wachen, harmonischen Ausdruck mit natürlicher Eleganz.': 'Shape, color, and lift for an alert, harmonious expression with natural elegance.',
    '30-75 Min': '30-75 min',
    'ab 39 EUR': 'from EUR 39',
    'Luxuriöse Hand- und Fußpflege mit cleanen Farben, perfekter Form und gepflegtem Finish.': 'Luxurious hand and foot care with clean colors, perfect shape, and a polished finish.',
    '45-75 Min': '45-75 min',
    'ab 55 EUR': 'from EUR 55',
    'Make-up und Styling-Beratungen für Shootings, Events, Business-Auftritte oder Hochzeitstage.': 'Make-up and styling consultations for shoots, events, business appearances, or wedding days.',
    '45-90 Min': '45-90 min',
    'ab 89 EUR': 'from EUR 89',
    'Maison Aveline wurde für Kundinnen entwickelt, die Exzellenz ohne Lautstärke erwarten.': 'Maison Aveline was created for clients who expect excellence without noise.',
    'Unsere Marke steht für Ruhe, Präzision und zeitgemäße Schönheit. Statt hektischer Behandlungsketten setzen wir auf individuelle Terminfenster, sauber abgestimmte Routinen und nachvollziehbare Ergebnisse.': 'Our brand stands for calm, precision, and contemporary beauty. Instead of rushed treatment chains, we rely on individual appointment windows, carefully coordinated routines, and transparent results.',
    'Editoriale Klarheit': 'Editorial clarity',
    'Jede Fläche, jede Behandlung und jedes Detail ist reduziert, bewusst und hochwertig kuratiert.': 'Every surface, treatment, and detail is reduced, intentional, and curated to a high standard.',
    'Persönliche Begleitung': 'Personal guidance',
    'Wir beraten ehrlich, dokumentieren Hautziele und passen die Pflege an Lebensphase, Anlass und Saison an.': 'We advise honestly, document skin goals, and adapt care to life stage, occasion, and season.',
    'Ein Blick auf Texturen, Formen und das Gefühl eines modernen Luxury Studios.': 'A look at textures, forms, and the feel of a modern luxury studio.',
    'Die Galerie zeigt kuratierte Einblicke in unsere Bildsprache: clean, feminin-modern und bewusst frei von lauter Salonästhetik.': 'The gallery shows curated glimpses of our visual language: clean, feminine-modern, and intentionally free of loud salon aesthetics.',
    'Signature Facial': 'Signature Facial',
    'Ritual, Textur, Ruhe': 'Ritual, texture, calm',
    'Brow Detail': 'Brow detail',
    'Form mit Feingefühl': 'Shape with sensitivity',
    'Studio Mood': 'Studio mood',
    'Calm luxury': 'Calm luxury',
    'Warum unsere Kundinnen wiederkommen': 'Why our clients return',
    'Die größte Stärke eines Premium-Salons ist nicht nur das Design, sondern die Konstanz im Erlebnis.': 'The biggest strength of a premium salon is not only the design, but the consistency of the experience.',
    '„Ich hatte selten das Gefühl, dass eine Behandlung so ruhig, strukturiert und gleichzeitig so wirksam war.“': '“I have rarely felt a treatment be so calm, structured, and effective at the same time.”',
    'Signature Glow Ritual': 'Signature Glow Ritual',
    '„Brows und Lash Lift sehen immer gepflegt aus, nie überzeichnet. Genau diese Präzision habe ich gesucht.“': '“Brows and lash lift always look polished, never overdone. That is exactly the precision I was looking for.”',
    'Brow Architecture & Lash Lift': 'Brow Architecture & Lash Lift',
    '„Die Atmosphäre ist außergewöhnlich. Man merkt sofort, dass hier jedes Detail bewusst gestaltet wurde.“': '“The atmosphere is exceptional. You immediately notice that every detail was intentionally designed.”',
    'Studio Experience': 'Studio experience',
    'Preise & Pakete': 'Prices & packages',
    'Transparent kalkuliert, hochwertig inszeniert.': 'Clearly priced, elegantly presented.',
    'Klare Preislogik schafft Vertrauen. Deshalb kombinieren wir Einzelleistungen, saisonale Specials und sinnvolle Signature-Pakete.': 'Clear pricing builds trust. That is why we combine single services, seasonal specials, and meaningful signature packages.',
    'Glow Reset': 'Glow Reset',
    'Express-Facial mit Reinigung, Wirkstoffbooster und Glow-Finish.': 'Express facial with cleansing, active booster, and glow finish.',
    '119 EUR': 'EUR 119',
    'Maison Ritual': 'Maison Ritual',
    '90 Minuten mit Analyse, Enzympeeling, Massage, Maske und individueller Pflegeempfehlung.': '90 minutes with analysis, enzyme peel, massage, mask, and an individual care recommendation.',
    '189 EUR': 'EUR 189',
    'Schnelle Orientierung': 'Quick orientation',
    'Was Sie bei uns erwarten dürfen': 'What you can expect from us',
    'Keine versteckten Aufpreise': 'No hidden surcharges',
    'Preise sind nachvollziehbar aufgebaut. Add-ons werden vorab abgestimmt und transparent kommuniziert.': 'Prices are structured transparently. Add-ons are agreed in advance and communicated clearly.',
    'Pakete mit echtem Mehrwert': 'Packages with real value',
    'Bundle-Angebote sind auf Wirkung und Wiederbuchung optimiert, nicht künstlich aufgebläht.': 'Bundle offers are optimized for impact and repeat booking, not artificially inflated.',
    'Beratung inklusive': 'Consultation included',
    'Zu relevanten Behandlungen erhalten Sie Hinweise zu Nachpflege, Timing und Produktauswahl.': 'For relevant treatments, you receive guidance on aftercare, timing, and product selection.',
    'Wichtige Fragen vor Ihrem Termin': 'Important questions before your appointment',
    'Von Storno bis Nachpflege beantworten wir alle zentralen Fragen klar und ohne unnötige Hürden.': 'From cancellations to aftercare, we answer all key questions clearly and without unnecessary friction.',
    'Wie läuft der erste Termin ab?': 'How does the first appointment work?',
    'Wir starten mit einer kurzen Analyse, besprechen Ihr Zielbild und empfehlen ein passendes Ritual.': 'We start with a short analysis, discuss your goal, and recommend a suitable ritual.',
    'Wie kurzfristig kann ich absagen?': 'How late can I cancel?',
    'Bis 24 Stunden vorher kostenfrei. Spätere Änderungen werden gemäß Stornohinweis berechnet.': 'Free up to 24 hours in advance. Later changes are charged according to the cancellation policy.',
    'Welche Pflege passt nach der Behandlung?': 'Which care is right after the treatment?',
    'Je nach Behandlung erhalten Sie klare Hinweise zu Wirkstoffen, SPF und Timing Ihrer Routine.': 'Depending on the treatment, you receive clear guidance on actives, SPF, and the timing of your routine.',
    'Planen Sie Ihren nächsten Beauty-Termin mit klarer Beratung und spürbarer Ruhe.': 'Plan your next beauty appointment with clear advice and a noticeably calm experience.',
    'Ob erste Hautanalyse, saisonales Update oder Event-Styling: Wir beraten Sie persönlich und stellen ein passendes Treatment zusammen.': 'Whether it is your first skin analysis, a seasonal update, or event styling: we advise you personally and put together a suitable treatment.',
    'Luxuriöse Gesichtsbehandlungen, präzise Brows & Lashes und kuratierte Beauty-Rituale in Berlin-Mitte.': 'Luxurious facials, precise brows & lashes, and curated beauty rituals in Berlin-Mitte.',
    'About Maison Aveline': 'About Maison Aveline',
    'Ein Beauty-Studio, das sich anfühlt wie ein ruhiger, luxuriöser Rückzugsort.': 'A beauty studio that feels like a calm, luxurious retreat.',
    'Maison Aveline entstand aus dem Wunsch, Beauty exakter, leiser und anspruchsvoller zu denken: weniger Routine, mehr Persönlichkeit, bessere Ergebnisse.': 'Maison Aveline was created from the desire to think about beauty in a more exact, quieter, and more demanding way: less routine, more personality, better results.',
    'Seit 2021 in Berlin-Mitte': 'In Berlin-Mitte since 2021',
    'Private Beauty Suite': 'Private beauty suite',
    'Die Räume sind auf Ruhe, Licht und private Betreuung ausgelegt.': 'The rooms are designed around calm, light, and private care.',
    'Markenstory': 'Brand story',
    'Wir wollten einen Ort schaffen, an dem Qualität unmittelbar spürbar wird.': 'We wanted to create a place where quality is immediately tangible.',
    'Statt standardisierter Beauty-Abläufe setzen wir auf kuratierte Treatments, klare Kommunikation und eine Ästhetik, die Vertrauen ausstrahlt. Maison Aveline verbindet die Disziplin moderner Hautpflege mit der emotionalen Wirkung einer Premium-Marke.': 'Instead of standardized beauty routines, we focus on curated treatments, clear communication, and an aesthetic that radiates trust. Maison Aveline combines the discipline of modern skincare with the emotional impact of a premium brand.',
    'Aus Erfahrung entwickelt': 'Developed from experience',
    'Die Behandlungskonzepte basieren auf Studio-Praxis, Produktwissen und dem Anspruch, sichtbare Ergebnisse mit einem angenehmen Erlebnis zu verbinden.': 'The treatment concepts are based on studio practice, product knowledge, and the ambition to combine visible results with a pleasant experience.',
    'Für anspruchsvolle Kundinnen': 'For discerning clients',
    'Ob Business-Auftritt, Hochzeit, regelmäßige Self-Care oder konkrete Hautziele: Die Marke ist für Kundinnen gedacht, die Haltung und Qualität erkennen.': 'Whether it is a business appearance, wedding, regular self-care, or specific skin goals: the brand is designed for clients who recognize attitude and quality.',
    'Philosophie': 'Philosophy',
    'Schönheit ist für uns das Ergebnis aus Präzision, Pflege und Zurückhaltung.': 'For us, beauty is the result of precision, care, and restraint.',
    'Wir glauben nicht an laute Überinszenierung. Ein hochwertiges Ergebnis zeigt sich in klarer Haut, gepflegten Details, harmonischen Formen und dem Gefühl, sehr gut aufgehoben gewesen zu sein.': 'We do not believe in loud over-staging. A high-quality result reveals itself in clear skin, polished details, harmonious forms, and the feeling of having been very well cared for.',
    'Ruhe': 'Calm',
    'Weniger Reiz, mehr Fokus. Jede Behandlung beginnt bewusst und ohne Zeitdruck.': 'Less stimulation, more focus. Every treatment begins intentionally and without time pressure.',
    'Präzision': 'Precision',
    'Form, Produktwahl und Ablauf sind auf Proportionen, Hautzustand und Zielbild abgestimmt.': 'Shape, product choice, and sequence are aligned with proportions, skin condition, and the desired result.',
    'Transparenz': 'Transparency',
    'Keine unklaren Empfehlungen. Wir sagen, was sinnvoll ist, und auch, was nicht nötig ist.': 'No vague recommendations. We tell you what is useful, and also what is not necessary.',
    'Unsere Werte': 'Our values',
    'Was jede Behandlung bei Maison Aveline prägt': 'What defines every treatment at Maison Aveline',
    'Ehrliche Empfehlung': 'Honest recommendation',
    'Wir priorisieren Maßnahmen mit sichtbarem Nutzen statt möglichst vieler Add-ons.': 'We prioritize measures with visible value instead of as many add-ons as possible.',
    'Saubere Prozesse': 'Clean processes',
    'Von Hygiene bis Terminfluss sind alle Studio-Abläufe klar, reproduzierbar und hochwertig organisiert.': 'From hygiene to appointment flow, all studio processes are clear, repeatable, and organized to a high standard.',
    'Langfristige Hautgesundheit': 'Long-term skin health',
    'Behandlungen werden so geplant, dass sie in echte Routinen und saisonale Pflegeplanung übergehen können.': 'Treatments are planned so they can evolve into real routines and seasonal care planning.',
    'Studio-Charakter': 'Studio character',
    'Ein kleines Team, klare Handschrift, viel persönliche Aufmerksamkeit.': 'A small team, a clear signature, and plenty of personal attention.',
    'Statt großer Kettenlogik arbeitet Maison Aveline mit einem bewusst kleinen Setup. So bleiben Beratung, Dokumentation und Qualitätsniveau konstant.': 'Instead of big-chain logic, Maison Aveline works with a deliberately small setup. This keeps consultation, documentation, and quality levels consistent.',
    'Founder & Skin Specialist': 'Founder & skin specialist',
    'Verbindet Hautdiagnostik, Wirkstoffwissen und eine sehr ruhige, präzise Behandlungssprache.': 'Combines skin diagnostics, active ingredient knowledge, and a very calm, precise treatment language.',
    'Brows, Lashes & Finish': 'Brows, lashes & finish',
    'Fokussiert auf natürliche Formkorrekturen, Lifts und Details, die das Gesicht harmonisch rahmen.': 'Focused on natural shape corrections, lifts, and details that frame the face harmoniously.',
    'Nail Care & Guest Experience': 'Nail care & guest experience',
    'Sorgt für gepflegte Hand- und Fußrituale sowie einen präzise organisierten Ablauf im Studio.': 'Ensures polished hand and foot rituals as well as a precisely organized flow in the studio.',
    'Sie möchten Maison Aveline persönlich erleben?': 'Would you like to experience Maison Aveline in person?',
    'Starten Sie mit einer Signature-Behandlung oder lassen Sie sich zu Hautbild, Brows oder Event-Styling beraten.': 'Start with a signature treatment or let us advise you on skin condition, brows, or event styling.',
    'Termin anfragen': 'Request appointment',
    'Leistungen ansehen': 'View services',
    'Boutique-Beauty-Erlebnisse mit modernem Luxus, klaren Ritualen und ehrlicher Beratung.': 'Boutique beauty experiences with modern luxury, clear rituals, and honest guidance.',
    'Alle Services sind auf Wirkung, Klarheit und eine hochwertige Kundenerfahrung aufgebaut.': 'All services are built around impact, clarity, and a high-quality client experience.',
    'Jede Leistung ist transparent beschrieben, mit realistischen Zeitfenstern, klarem Nutzen und einem Preisrahmen, der sofort Orientierung schafft.': 'Every service is described transparently, with realistic time frames, clear value, and a price range that gives immediate orientation.',
    'Persönliche Beratung': 'Personal consultation',
    'Flexible Add-ons': 'Flexible add-ons',
    'Saubere Preislogik': 'Clean pricing logic',
    'Filtern Sie nach Behandlungsschwerpunkt': 'Filter by treatment focus',
    'Ideal für schnelle Orientierung: wechseln Sie zwischen Hautpflege, Brows & Lashes, Nail Care und Styling.': 'Ideal for quick orientation: switch between skincare, brows & lashes, nail care, and styling.',
    'Alle': 'All',
    'Skin Rituals': 'Skin rituals',
    'Brows & Lashes': 'Brows & lashes',
    'Nail Care': 'Nail care',
    'Styling': 'Styling',
    'Glow Reset Facial': 'Glow Reset Facial',
    'Sanfte Tiefenreinigung, Enzympeeling, Feuchtigkeitsbooster und Finish für sichtbar ruhigere, frischere Haut.': 'Gentle deep cleansing, enzyme peel, moisture booster, and finish for visibly calmer, fresher skin.',
    'Für müde Haut': 'For tired skin',
    'Perfekt als Einstieg, vor Events oder als regelmäßiger Frische-Reset.': 'Perfect as an introduction, before events, or as a regular freshness reset.',
    'Maison Signature Ritual': 'Maison Signature Ritual',
    'Unser umfassendes Treatment mit Hautanalyse, Peeling, Massage, Maske, Wirkstoffpflege und individueller Beratung.': 'Our comprehensive treatment with skin analysis, exfoliation, massage, mask, active care, and individual advice.',
    'Ganzheitliches Ritual': 'Holistic ritual',
    'Ideal für langfristige Hautqualität, Regeneration und sichtbare Balance.': 'Ideal for long-term skin quality, regeneration, and visible balance.',
    'Skin Recovery Treatment': 'Skin Recovery Treatment',
    'Auf sensible, gestresste oder barriereschwache Haut abgestimmtes Pflegekonzept mit beruhigenden Texturen.': 'A care concept tailored to sensitive, stressed, or barrier-weakened skin with soothing textures.',
    'Beruhigend': 'Soothing',
    'Besonders geeignet nach intensiven Phasen, Saisonwechseln oder Hautstress.': 'Especially suitable after intense periods, seasonal changes, or skin stress.',
    'Brow Architecture': 'Brow Architecture',
    'Analyse von Form und Proportion, präzises Mapping, Styling, Korrektur und auf Wunsch sanfte Farbveredelung.': 'Analysis of shape and proportion, precise mapping, styling, correction, and optional soft color refinement.',
    'Natürliche Definition': 'Natural definition',
    'Mehr Struktur für das Gesicht, ohne hart oder künstlich zu wirken.': 'More structure for the face without looking harsh or artificial.',
    'Lash Lift & Tint': 'Lash lift & tint',
    'Lifting, Pflege und Färbung für einen offenen Blick und gepflegte Tiefe, ganz ohne Extensions.': 'Lift, care, and tinting for an open gaze and polished depth, completely without extensions.',
    'Low Maintenance': 'Low maintenance',
    'Besonders beliebt für Reisen, Alltag und einen wachen Business-Look.': 'Especially popular for travel, everyday wear, and an alert business look.',
    'Brow & Lash Duo': 'Brow & lash duo',
    'Kombinationsleistung für ein besonders harmonisches, schnelles Upgrade des gesamten Augenbereichs.': 'A combined service for a particularly harmonious, fast upgrade of the entire eye area.',
    'Kombi-Paket': 'Combo package',
    'Für Kundinnen, die einen gepflegten Look mit minimalem Tagesaufwand möchten.': 'For clients who want a polished look with minimal daily effort.',
    'Luxury Manicure': 'Luxury manicure',
    'Formgebung, Nagelhautpflege, Handserum, Massage und cleanes Farbfinish oder natürlicher Glanz.': 'Shaping, cuticle care, hand serum, massage, and a clean color finish or natural shine.',
    'Clean Finish': 'Clean finish',
    'Zurückhaltend luxuriös, gepflegt und passend für jeden Anlass.': 'Understated luxury, polished, and suitable for any occasion.',
    'Soft Pedicure Ritual': 'Soft pedicure ritual',
    'Fußpflege mit Callus-Care, Formkorrektur, intensiver Pflege und entspannendem Finish.': 'Foot care with callus care, shape correction, intensive care, and a relaxing finish.',
    'Saison-Favorit': 'Seasonal favorite',
    'Angenehm für ganzjährige Pflege und besonders wertvoll in der Sandalen-Saison.': 'Pleasant for year-round care and especially valuable in sandal season.',
    'Event Make-up': 'Event make-up',
    'Modernes, hautnahes Make-up mit Fokus auf Präsenz, Haltbarkeit und fotografischer Balance.': 'Modern, skin-close make-up focused on presence, longevity, and photographic balance.',
    'Anlassbezogen': 'Occasion-based',
    'Für Dinner, Business Events, Standesamt, Shooting oder besonderen Abend.': 'For dinners, business events, civil weddings, shoots, or a special evening.',
    'Beauty Wardrobe Consultation': 'Beauty wardrobe consultation',
    'Beratung zu Pflege, Farbwelt, Routinen und Make-up-Logik passend zu Alltag, Reisen und Saison.': 'Advice on care, color palette, routines, and make-up logic suited to everyday life, travel, and season.',
    'Beratung': 'Consultation',
    'Ideal, wenn Sie Ihre gesamte Beauty-Routine neu, klar und hochwertig aufstellen möchten.': 'Ideal if you want to set up your entire beauty routine in a new, clear, and premium way.',
    'So holen Sie das Beste aus Ihrem Termin heraus': 'How to get the best out of your appointment',
    'Bitte teilen Sie uns bei Buchung aktuelle Empfindlichkeiten, Medikamente oder Wirkstoffroutinen mit.': 'Please share any current sensitivities, medication, or active-ingredient routines when booking.',
    'Beschreiben Sie, ob Sie Ruhe, Frische, Lifting, Pflege oder Event-Präsenz priorisieren.': 'Describe whether you prioritize calm, freshness, lift, care, or event presence.',
    'Für erste Besuche empfehlen wir eher Signature-Leistungen statt Express-Termine.': 'For first visits, we recommend signature services rather than express appointments.',
    'Unser Studio empfiehlt besonders häufig': 'Our studio most often recommends',
    'Maison Ritual + Brow Architecture': 'Maison Ritual + Brow Architecture',
    'Für ein komplett gepflegtes, ruhiges und fotografisch sehr stimmiges Erscheinungsbild.': 'For a fully polished, calm, and photographically very cohesive appearance.',
    'Glow Reset + Lash Lift': 'Glow Reset + Lash Lift',
    'Ideal vor Events oder Business-Terminen, wenn Sie frisch und wach wirken möchten.': 'Ideal before events or business appointments when you want to look fresh and awake.',
    'Luxury Manicure + Beratung': 'Luxury manicure + consultation',
    'Für Kundinnen, die Ästhetik, Produktauswahl und Alltagspflege sauber neu definieren möchten.': 'For clients who want to redefine aesthetics, product selection, and everyday care in a clean way.',
    'Sie sind unsicher, welche Leistung am besten passt?': 'Not sure which service suits you best?',
    'Schreiben Sie uns kurz Ihr Ziel oder Ihren Anlass. Wir empfehlen Ihnen das passende Treatment oder Paket.': 'Send us a short note about your goal or occasion. We will recommend the right treatment or package.',
    'Preisübersicht': 'Price overview',
    'Beauty-Rituale für Haut, Brows, Lashes, Hände und Anlässe mit hochwertiger Nutzerführung.': 'Beauty rituals for skin, brows, lashes, hands, and occasions with a high-quality user experience.',
    'Eine visuelle Sprache zwischen Hautpflege, Ruhe und editorialem Luxus.': 'A visual language between skincare, calm, and editorial luxury.',
    'Unsere Galerie zeigt keine laute Vorher-Nachher-Logik, sondern bewusst kuratierte Eindrücke: Texturen, Details, Studio-Stimmung und Signature-Kompositionen.': 'Our gallery does not show loud before-and-after logic, but deliberately curated impressions: textures, details, studio mood, and signature compositions.',
    'Masonry-inspiriertes Grid': 'Masonry-inspired grid',
    'Lightbox inklusive': 'Lightbox included',
    'Die Bildwelt bleibt reduziert, luxuriös und bewusst eigenständig.': 'The visual world stays reduced, luxurious, and deliberately distinct.',
    'Signature Facial': 'Signature facial',
    'Textur, Ruhe und Struktur als visuelle Übersetzung unseres Signature Rituals.': 'Texture, calm, and structure as the visual translation of our signature ritual.',
    'Make-up Detail': 'Make-up detail',
    'Präzision & Farbe': 'Precision & color',
    'Soft Glow': 'Soft glow',
    'Warme Nude-Töne und eine klare Beauty-Silhouette für ein ruhiges Studio-Gefühl.': 'Warm nude tones and a clear beauty silhouette for a calm studio feeling.',
    'Hair Care': 'Hair care',
    'Pflege & Form': 'Care & shape',
    'Studio Contrast': 'Studio contrast',
    'Dunkle Kontraste setzen Tiefe und wirken bewusst luxuriös, ohne schwer zu werden.': 'Dark contrasts add depth and feel intentionally luxurious without becoming heavy.',
    'Lash Detail': 'Lash detail',
    'Feine Präzision': 'Fine precision',
    'Brow Detail': 'Brow detail',
    'Präzision, Balance und feine Formkorrektur im Blickbereich.': 'Precision, balance, and subtle shape correction in the eye area.',
    'Manicure Finish': 'Manicure finish',
    'Detailarbeit': 'Detail work',
    'Ritual Notes': 'Ritual notes',
    'Pflege, Produktlogik und luxuriöse Klarheit in einer zurückhaltenden Visualisierung.': 'Care, product logic, and luxurious clarity in a restrained visual treatment.',
    'Brush Mood': 'Brush mood',
    'Tools & Texture': 'Tools & texture',
    'Lash Lift Mood': 'Lash lift mood',
    'Ein reduziertes Motiv, das Lift, Ruhe und horizontale Linienführung verbindet.': 'A reduced motif that combines lift, calm, and horizontal line work.',
    'Skin Ritual': 'Skin ritual',
    'Ruhe & Pflege': 'Calm & care',
    'Nail Ritual': 'Nail ritual',
    'Grafische Komposition für gepflegte Hände, Form und ein bewusst sauberes Finish.': 'Graphic composition for polished hands, shape, and a deliberately clean finish.',
    'Hair Styling': 'Hair styling',
    'Form & Bewegung': 'Shape & movement',
    'Maison Moodboard': 'Maison moodboard',
    'Großflächige Texturen, Luft und elegante Typo-Rhythmen als Markensprache.': 'Large-scale textures, space, and elegant type rhythms as brand language.',
    'Studio Interior': 'Studio interior',
    'Calm luxury': 'Calm luxury',
    'Bildsprache': 'Visual language',
    'Warum wir auf eine reduzierte Premium-Ästhetik setzen': 'Why we rely on a reduced premium aesthetic',
    'Ein luxuriöser Beauty-Auftritt lebt nicht von Überladung, sondern von Luft, Rhythmus, Materialgefühl und einer sehr klaren visuellen Priorisierung.': 'A luxurious beauty presence does not live from overload, but from space, rhythm, material feel, and a very clear visual prioritization.',
    'Wenn Ihnen diese Ästhetik zusagt, passt wahrscheinlich auch unser Studio-Erlebnis.': 'If you like this aesthetic, our studio experience will likely suit you too.',
    'Nutzen Sie die Galerie als Gefühlstest und wechseln Sie dann direkt zu Leistungen, Preisen oder Ihrer Anfrage.': 'Use the gallery as a feeling test, then go straight to services, pricing, or your inquiry.',
    'Premium muss nachvollziehbar sein. Deshalb ist unsere Preisstruktur klar, ruhig und transparent.': 'Premium has to be understandable. That is why our pricing structure is clear, calm, and transparent.',
    'Alle Preise sind als Orientierung gedacht und können je nach Aufwand, Add-ons oder individueller Beratung leicht variieren. Relevante Änderungen besprechen wir immer vorab.': 'All prices are intended as guidance and may vary slightly depending on effort, add-ons, or individual consultation. We always discuss relevant changes in advance.',
    'Keine versteckten Gebühren': 'No hidden fees',
    'Pakete mit echter Ersparnis': 'Packages with real savings',
    'Unsere beliebtesten Beauty-Pakete': 'Our most popular beauty packages',
    'Diese Pakete kombinieren Leistungen so, wie sie im Alltag unserer Kundinnen am häufigsten gemeinsam gebucht werden.': 'These packages combine services in the way our clients most commonly book them together in everyday life.',
    'Fresh Start': 'Fresh Start',
    'Glow Reset Facial plus persönliche Pflegeempfehlung für zuhause.': 'Glow Reset Facial plus a personal care recommendation for home.',
    'Ideal zum Einstieg': 'Ideal as an introduction',
    'Einführungspaket': 'Intro package',
    'Most booked': 'Most booked',
    'Maison Ritual Set': 'Maison Ritual Set',
    'Signature Ritual kombiniert mit Brow Architecture für einen besonders gepflegten, ausbalancierten Look.': 'Signature Ritual combined with Brow Architecture for a particularly polished, balanced look.',
    'Ganzheitlich': 'Holistic',
    'Paketpreis': 'Package price',
    'Event Presence': 'Event presence',
    'Lash Lift oder Brow Styling plus Event Make-up inklusive kurzer Finish-Beratung.': 'Lash lift or brow styling plus event make-up including a short finish consultation.',
    'Für besondere Anlässe': 'For special occasions',
    'Einzelleistungen': 'Individual services',
    'Nails & Styling': 'Nails & styling',
    'Pflege, Finish und Event-Präsenz': 'Care, finish, and event presence',
    'Behandlungen, Pakete und Beratung': 'Treatments, packages, and consultation',
    'Beliebt als Ergänzung': 'Popular as an add-on',
    'LED Glow Finish': 'LED glow finish',
    '15 Minuten beruhigende Lichtanwendung nach ausgewählten Skin Rituals.': '15 minutes of soothing light application after selected skin rituals.',
    'Lippen- & Augenmaske': 'Lip & eye mask',
    'Intensives Feuchtigkeitsupgrade für ein besonders frisches Finish.': 'An intensive moisture upgrade for a particularly fresh finish.',
    'Gift Card Packaging': 'Gift card packaging',
    'Luxuriöse Geschenkverpackung für Behandlungen, Pakete oder freie Beträge.': 'Luxurious gift packaging for treatments, packages, or free-value cards.',
    'Gut zu wissen': 'Good to know',
    'Hinweise zu Buchung, Gutscheinen und Storno': 'Notes on booking, gift cards, and cancellation',
    'Beratung vorab': 'Advance consultation',
    'Wenn Sie unsicher sind, wählen Sie gern zunächst eine Beratung oder senden uns Ihr Zielbild per Kontaktformular.': 'If you are unsure, feel free to start with a consultation or send us your goal image via the contact form.',
    'Gutscheine': 'Gift cards',
    'Geschenkgutscheine sind als feste Behandlung oder als Wertgutschein erhältlich und drei Jahre gültig.': 'Gift cards are available as a specific treatment or as a value voucher and are valid for three years.',
    'Storno': 'Cancellation',
    'Absagen sind bis 24 Stunden vorher kostenfrei. Danach behalten wir uns eine Ausfallpauschale vor.': 'Cancellations are free up to 24 hours in advance. After that, we reserve the right to charge a no-show fee.',
    'Bereit für ein Treatment oder wünschen Sie eine Empfehlung?': 'Ready for a treatment or looking for a recommendation?',
    'Teilen Sie uns Anlass, Hautziel oder Wunschbehandlung mit. Wir antworten mit einer klaren Empfehlung.': 'Tell us your occasion, skin goal, or preferred treatment. We will reply with a clear recommendation.',
    'Anfrage senden': 'Send inquiry',
    'FAQ lesen': 'Read FAQ',
    'Klare Preislogik für luxuriöse Beauty-Behandlungen, Pakete und Beratung in Berlin-Mitte.': 'Clear pricing logic for luxurious beauty treatments, packages, and consultation in Berlin-Mitte.',
    'Lassen Sie uns über Ihren nächsten Termin, Ihr Hautziel oder einen besonderen Anlass sprechen.': 'Let us talk about your next appointment, your skin goal, or a special occasion.',
    'Schildern Sie uns kurz, was Sie suchen. Wir melden uns mit einer klaren Empfehlung, passenden Zeitfenstern und einem realistischen Behandlungsplan.': 'Briefly tell us what you are looking for. We will get back to you with a clear recommendation, suitable time slots, and a realistic treatment plan.',
    'Antwort in der Regel innerhalb eines Werktags': 'Usually answered within one business day',
    'Beratung per Mail oder Telefon': 'Consultation by email or phone',
    'Termin oder Beratung anfragen': 'Request an appointment or consultation',
    'Wunschleistung': 'Desired service',
    'Bitte wählen': 'Please choose',
    'Ihre Nachricht': 'Your message',
    'Beschreiben Sie kurz Ihr Hautziel, Ihren Anlass oder Ihren Wunschtermin.': 'Briefly describe your skin goal, your occasion, or your preferred appointment time.',
    'Mit dem Absenden wird keine automatische Buchung ausgelöst. Die Form ist für die Integration in CRM, E-Mail oder Booking-Workflows vorbereitet.': 'Submitting does not trigger an automatic booking. The form is prepared for integration into CRM, email, or booking workflows.',
    'Anfrage vorbereiten': 'Prepare inquiry',
    'Telefon': 'Phone',
    'Zentral gelegen in Berlin-Mitte, gut erreichbar und dennoch ruhig.': 'Centrally located in Berlin-Mitte, easy to reach, and still calm.',
    'Dienstag bis Freitag: 10:00 - 19:00': 'Tuesday to Friday: 10:00 - 19:00',
    'Samstag: 10:00 - 17:00': 'Saturday: 10:00 - 17:00',
    'Nahe Hackescher Markt, gute Anbindung mit S-Bahn, U-Bahn und Taxi.': 'Near Hackescher Markt, well connected by S-Bahn, U-Bahn, and taxi.',
    'Kontaktwege': 'Contact methods',
    'WhatsApp Concierge': 'WhatsApp concierge',
    'Sonntag & Montag: geschlossen': 'Sunday & Monday: closed',
    'Behandlungen und Termine': 'Treatments and appointments',
    'ÖPNV': 'Public transport',
    'Hackescher Markt und Weinmeisterstraße sind wenige Gehminuten entfernt.': 'Hackescher Markt and Weinmeisterstraße are just a few minutes away on foot.',
    'Parken': 'Parking',
    'Öffentliche Parkhäuser befinden sich in direkter Umgebung. Bei Abendterminen sind meist zusätzliche Stellplätze verfügbar.': 'Public parking garages are nearby. For evening appointments, additional spaces are usually available.',
    'Sie möchten sich erst orientieren?': 'Would you like to orient yourself first?',
    'Dann wechseln Sie direkt zu Leistungen, Preisen oder den häufigsten Fragen.': 'Then go directly to services, pricing, or the most common questions.',
    'Persönliche Beratung, klare Terminführung und luxuriöse Beauty-Rituale in Berlin-Mitte.': 'Personal consultation, clear appointment management, and luxurious beauty rituals in Berlin-Mitte.',
    'Klare Antworten vor Ihrem Besuch': 'Clear answers before your visit',
    'Hier finden Sie die häufigsten Fragen zu Terminen, Vorbereitung, Pflege danach, Gutscheinen und der Organisation rund um Ihren Besuch bei Maison Aveline.': 'Here you will find the most common questions about appointments, preparation, aftercare, gift cards, and the organization of your visit to Maison Aveline.',
    'SEO-freundlich strukturiert': 'SEO-friendly structure',
    'Schnelle Orientierung': 'Quick orientation',
    'Alle Antworten sind bewusst knapp, klar und direkt nutzbar formuliert.': 'All answers are intentionally concise, clear, and directly usable.',
    'Alles Wichtige auf einen Blick': 'Everything important at a glance',
    'Wie läuft ein erster Termin bei Maison Aveline ab?': 'How does a first appointment at Maison Aveline work?',
    'Ihr erster Termin beginnt mit einer kurzen Analyse Ihres Hautbildes, Ihres Anlasses oder Ihrer Wünsche. Anschließend empfehlen wir das passende Treatment, erläutern den Ablauf und stimmen Add-ons nur dann ab, wenn sie wirklich sinnvoll sind.': 'Your first appointment begins with a short analysis of your skin condition, occasion, or wishes. We then recommend the appropriate treatment, explain the process, and only discuss add-ons if they are genuinely useful.',
    'Wie früh sollte ich vor dem Termin da sein?': 'How early should I arrive before the appointment?',
    'Wir empfehlen, etwa zehn Minuten vor Beginn anzukommen. So startet Ihr Termin entspannt, ohne dass wertvolle Behandlungszeit verloren geht.': 'We recommend arriving about ten minutes early. That way your appointment starts calmly without losing valuable treatment time.',
    'Wie sind die Stornobedingungen?': 'What are the cancellation terms?',
    'Absagen oder Umbuchungen sind bis 24 Stunden vor Ihrem Termin kostenfrei möglich. Bei späteren Änderungen behalten wir uns eine Ausfallpauschale vor, da reservierte Zeitfenster kurzfristig nur schwer neu vergeben werden können.': 'Cancellations or rescheduling are free up to 24 hours before your appointment. For later changes, we reserve the right to charge a no-show fee, as reserved time slots are difficult to rebook at short notice.',
    'Welche Behandlung eignet sich für den ersten Besuch?': 'Which treatment is best for a first visit?',
    'Wenn Sie uns noch nicht kennen, empfehlen wir meist das Maison Signature Ritual oder den Glow Reset. Beide Leistungen geben uns genug Raum für Analyse, Behandlung und eine sinnvolle Empfehlung für weitere Schritte.': 'If you do not know us yet, we usually recommend the Maison Signature Ritual or the Glow Reset. Both services give us enough room for analysis, treatment, and a meaningful recommendation for next steps.',
    'Was sollte ich vor Brows- oder Lash-Terminen beachten?': 'What should I keep in mind before brows or lash appointments?',
    'Bitte erscheinen Sie möglichst ohne starkes Augen-Make-up und informieren Sie uns über aktuelle Sensibilitäten oder frische kosmetische Eingriffe im Augenbereich.': 'Please arrive as much as possible without heavy eye make-up and let us know about any sensitivities or recent cosmetic procedures around the eye area.',
    'Welche Pflege ist nach einem Skin Ritual wichtig?': 'What care is important after a skin ritual?',
    'Je nach Treatment empfehlen wir eine ruhige Nachpflege mit Feuchtigkeit, SPF und gegebenenfalls dem vorübergehenden Verzicht auf starke Wirkstoffe. Die passende Empfehlung erhalten Sie direkt nach Ihrem Termin.': 'Depending on the treatment, we recommend calm aftercare with moisture, SPF, and, if necessary, temporarily avoiding strong actives. You will receive the appropriate recommendation directly after your appointment.',
    'Bieten Sie Gutscheine an?': 'Do you offer gift cards?',
    'Ja. Sie können sowohl feste Treatments als auch freie Beträge verschenken. Gutscheine werden hochwertig verpackt und eignen sich besonders für Geburtstage, Bridal Moments oder Business-Geschenke.': 'Yes. You can gift both specific treatments and flexible amounts. Gift cards are packaged beautifully and are especially suitable for birthdays, bridal moments, or business gifts.',
    'Sind Behandlungen auch für sensible Haut geeignet?': 'Are treatments also suitable for sensitive skin?',
    'Ja, sofern wir vorab ausreichend Informationen zum Hautzustand erhalten. Unsere Treatments lassen sich an empfindliche, gestresste oder barriereschwache Haut anpassen.': 'Yes, provided we receive enough information about the skin condition in advance. Our treatments can be adapted to sensitive, stressed, or barrier-weakened skin.',
    'Noch offen?': 'Still open?',
    'Wenn Ihre Frage hier nicht beantwortet wurde, beraten wir Sie gern persönlich.': 'If your question has not been answered here, we are happy to advise you personally.',
    'Besonders bei Hautthemen oder Event-Timings lohnt sich eine kurze individuelle Rückfrage.': 'Especially for skin concerns or event timing, a short individual follow-up is worthwhile.',
    'Direkt weiter': 'Continue now',
    'Kontaktieren Sie uns oder sehen Sie sich Leistungen und Preise an.': 'Contact us or look through services and pricing.',
    'Antworten auf die häufigsten Fragen zu Terminen, Pflege und Studio-Abläufen.': 'Answers to the most common questions about appointments, care, and studio workflows.',
    'Datenschutzhinweise': 'Privacy information',
    'Die folgenden Inhalte sind professionell strukturiert und als rechtlich saubere Platzhalter konzipiert. Bitte lassen Sie die Angaben vor Live-Schaltung durch eine juristisch qualifizierte Stelle prüfen und an Ihr tatsächliches Setup anpassen.': 'The following content is professionally structured and intended as legally clean placeholder text. Please have the information reviewed by a qualified legal professional before going live and adapt it to your actual setup.',
    'Ersetzen Sie insbesondere Verantwortliche, Hosting-Anbieter, Kontaktkanäle, Tracking-Dienste, Newsletter-Tools, Buchungssysteme und konkrete Speicherfristen durch Ihre realen Angaben.': 'In particular, replace the responsible party, hosting provider, contact channels, tracking services, newsletter tools, booking systems, and specific retention periods with your real details.',
    'Inhalt': 'Contents',
    'Verantwortliche Stelle': 'Responsible party',
    'Allgemeine Hinweise': 'General information',
    'Hosting': 'Hosting',
    'Kontaktformular': 'Contact form',
    'Cookies & Analyse': 'Cookies & analytics',
    'Betroffenenrechte': 'Data subject rights',
    '1. Verantwortliche Stelle': '1. Responsible party',
    'Verantwortlich im Sinne der Datenschutz-Grundverordnung ist:': 'The controller within the meaning of the General Data Protection Regulation is:',
    'Platzhalter: Bitte ergänzen Sie Rechtsform, vertretungsberechtigte Person und ggf. Datenschutzbeauftragte oder DSB-Kontakt.': 'Placeholder: Please add the legal form, authorized representative, and, if applicable, the data protection officer or contact.',
    '2. Allgemeine Hinweise zur Datenverarbeitung': '2. General information on data processing',
    'Wir verarbeiten personenbezogene Daten nur, soweit dies zur Bereitstellung unserer Website, zur Bearbeitung von Anfragen, zur Terminorganisation oder zur Erfüllung gesetzlicher Pflichten erforderlich ist. Die Verarbeitung erfolgt auf Grundlage der DSGVO, insbesondere Art. 6 Abs. 1 lit. a, b, c und f DSGVO, soweit jeweils einschlägig.': 'We process personal data only to the extent necessary to provide our website, handle inquiries, organize appointments, or fulfill legal obligations. Processing is based on the GDPR, in particular Article 6(1)(a), (b), (c), and (f) GDPR, where applicable.',
    'Personenbezogene Daten werden grundsätzlich nur so lange gespeichert, wie dies für den jeweiligen Zweck erforderlich ist oder gesetzliche Aufbewahrungspflichten bestehen.': 'Personal data is generally stored only as long as necessary for the respective purpose or as required by statutory retention obligations.',
    '3. Hosting und Server-Logfiles': '3. Hosting and server log files',
    'Beim Aufruf dieser Website werden technisch notwendige Daten wie IP-Adresse, Datum und Uhrzeit, abgerufene Datei, Referrer-URL, Browsertyp und Betriebssystem vorübergehend in Server-Logfiles verarbeitet. Diese Verarbeitung erfolgt zur Sicherstellung des technischen Betriebs, zur Fehleranalyse und zur Systemsicherheit.': 'When this website is accessed, technically necessary data such as IP address, date and time, accessed file, referrer URL, browser type, and operating system are temporarily processed in server log files. This processing is carried out to ensure technical operation, analyze errors, and maintain system security.',
    'Platzhalter: Bitte benennen Sie hier Ihren tatsächlichen Hosting-Anbieter samt Rechtsgrundlage, Auftragsverarbeitungsvertrag und Speicherfrist.': 'Placeholder: Please specify your actual hosting provider here, including legal basis, data processing agreement, and retention period.',
    '4. Kontaktformular und Kommunikation': '4. Contact form and communication',
    'Wenn Sie uns über ein Kontaktformular, per E-Mail oder telefonisch kontaktieren, verarbeiten wir Ihre Angaben zur Bearbeitung Ihrer Anfrage, zur Vorbereitung eines Termins und zur weiteren Kommunikation. Dies betrifft insbesondere Namen, Kontaktdaten, gewünschte Leistungen und die von Ihnen übermittelten Freitextangaben.': 'When you contact us via a contact form, by email, or by phone, we process your details to handle your inquiry, prepare an appointment, and communicate further. This includes in particular names, contact details, desired services, and any free-text information you submit.',
    'Die Rechtsgrundlage ist regelmäßig Art. 6 Abs. 1 lit. b DSGVO bei vertragsbezogenen Anfragen oder Art. 6 Abs. 1 lit. f DSGVO bei allgemeinen Kontaktaufnahmen. Sofern Sie besondere Informationen freiwillig übermitteln, geschieht dies auf Basis Ihrer Einwilligung bzw. Ihrer aktiven Übermittlung.': 'The legal basis is usually Article 6(1)(b) GDPR for contract-related inquiries or Article 6(1)(f) GDPR for general contact. If you voluntarily provide special information, this is done on the basis of your consent or your active submission.',
    '5. Cookies, Analyse-Tools und eingebundene Dienste': '5. Cookies, analytics tools, and embedded services',
    'Diese Beispiel-Website verwendet im aktuellen Frontend-Stand keine externen Tracking- oder Marketing-Tools. Sollten künftig Analyse-, Karten-, Video-, Newsletter-, CRM- oder Terminbuchungsdienste eingebunden werden, ist diese Datenschutzerklärung vor Veröffentlichung entsprechend zu ergänzen.': 'This example website currently uses no external tracking or marketing tools in the frontend. If analytics, maps, video, newsletter, CRM, or appointment-booking services are added in the future, this privacy policy must be updated accordingly before publication.',
    'Platzhalter: Ergänzen Sie hier konkrete Dienste wie Analytics, Meta Pixel, Calendly, Mailchimp, Google Maps, eingebettete Inhalte oder Consent-Management-Lösungen.': 'Placeholder: Add specific services here such as analytics, Meta Pixel, Calendly, Mailchimp, Google Maps, embedded content, or consent-management solutions.',
    '6. Ihre Rechte': '6. Your rights',
    'Sie haben nach Maßgabe der gesetzlichen Bestimmungen das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit sowie Widerspruch gegen bestimmte Verarbeitungen. Bereits erteilte Einwilligungen können Sie jederzeit mit Wirkung für die Zukunft widerrufen.': 'Under the statutory provisions, you have the right to access, rectify, erase, restrict processing, data portability, and object to certain processing activities. You may revoke any consent already given at any time with effect for the future.',
    'Außerdem besteht ein Beschwerderecht bei einer zuständigen Datenschutz-Aufsichtsbehörde.': 'You also have the right to lodge a complaint with a competent data protection supervisory authority.',
    'Rechtlich strukturierte Platzhalterseiten für einen professionellen Projektstart.': 'Legally structured placeholder pages for a professional project start.',
    'Anbieterkennzeichnung': 'Provider identification',
    'Die folgenden Inhalte sind als professionelle Platzhalter für die rechtssichere Finalisierung vorgesehen. Vor Veröffentlichung sollten alle Angaben mit den tatsächlichen Unternehmensdaten abgeglichen werden.': 'The following content is intended as professional placeholder text for final legal review. Before publication, all details should be compared with the actual company data.',
    'Ergänzen oder prüfen Sie insbesondere Rechtsform, vertretungsberechtigte Person, Handelsregister, Umsatzsteuer-ID, Aufsichtsbehörde und berufsrechtliche Angaben, sofern einschlägig.': 'In particular, add or verify the legal form, authorized representative, commercial register, VAT ID, supervisory authority, and professional law information, if applicable.',
    'Übersicht': 'Overview',
    'Pflichtangaben': 'Required details',
    'Vertretung': 'Representation',
    'Umsatzsteuer': 'VAT',
    'Haftung': 'Liability',
    '1. Angaben gemäß § 5 TMG': '1. Details pursuant to Section 5 TMG',
    'Platzhalter: Bitte ergänzen Sie hier die korrekte Unternehmensbezeichnung inkl. Rechtsform.': 'Placeholder: Please add the correct company name including the legal form here.',
    '2. Vertretungsberechtigte Person': '2. Authorized representative',
    'Vertreten durch: [Vorname Nachname]': 'Represented by: [First name Last name]',
    'Platzhalter: Bei einer Gesellschaft bitte vollständige organschaftliche Vertretung angeben.': 'Placeholder: For a company, please state the full legal representation.',
    '3. Kontakt': '3. Contact',
    'Optional: Ergänzen Sie Fax, weitere E-Mail-Adressen, Buchungslinks oder Kontakt für Presse/Kooperationen.': 'Optional: Add fax, additional email addresses, booking links, or contact information for press/partnerships.',
    '4. Register- und Umsatzsteuerangaben': '4. Register and VAT details',
    'Handelsregister: [falls vorhanden ergänzen]\nRegistergericht: [falls vorhanden ergänzen]\nUmsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz: [falls vorhanden ergänzen]': 'Commercial register: [add if applicable]\nRegister court: [add if applicable]\nVAT identification number pursuant to Section 27a of the German VAT Act: [add if applicable]',
    '5. Haftung für Inhalte und Links': '5. Liability for content and links',
    'Die Inhalte dieser Website wurden mit größtmöglicher Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte kann jedoch keine Gewähr übernommen werden. Für externe Links zu fremden Websites übernehmen wir keine Haftung; für die Inhalte der verlinkten Seiten sind ausschließlich deren Betreiber verantwortlich.': 'The contents of this website were created with the greatest possible care. However, no guarantee can be given for the accuracy, completeness, or timeliness of the content. We assume no liability for external links to third-party websites; the operators of the linked pages are solely responsible for their contents.',
    'Urheberrechte an Texten, Design, Bildmaterial und sonstigen Inhalten dieser Website liegen, soweit nicht anders gekennzeichnet, beim Betreiber der Website oder den jeweiligen Rechteinhabern.': 'Copyrights to text, design, image material, and other content on this website belong, unless otherwise stated, to the website operator or the respective rights holders.',
    'Professionell strukturierte Impressumsseite für den sauberen Projektabschluss.': 'Professionally structured imprint page for a clean project finish.',
  },
  de: {
    'About': 'Über',
    'Luxury Beauty Atelier': 'Luxuriöses Beauty-Atelier',
    'Luxury Beauty Salon in Berlin-Mitte': 'Luxus-Beauty-Salon in Berlin-Mitte',
    'Beauty Lounge Berlin': 'Beauty-Lounge Berlin',
    'Beauty Lounge': 'Beauty-Lounge',
    'Luxury Beauty Salon': 'Luxus-Beauty-Salon',
    'Luxury Beauty Atelier': 'Luxuriöses Beauty-Atelier',
    'Luxury Beauty Salon in Berlin-Mitte': 'Luxus-Beauty-Salon in Berlin-Mitte',
  },
};

const PAGE_META = {
  index: {
    en: {
      title: 'Maison Aveline | Luxury Beauty Salon in Berlin-Mitte',
      description: 'Maison Aveline is an exclusive beauty salon in Berlin-Mitte for facials, brows, lashes, manicure, and luxurious care rituals in a boutique atmosphere.',
      ogTitle: 'Maison Aveline | Luxury Beauty Salon in Berlin-Mitte',
      ogDescription: 'Editorial design, a calm luxury atmosphere, and precise beauty rituals for skin, brows, lashes, and polished hands.',
      twitterTitle: 'Maison Aveline | Luxus-Beauty-Salon in Berlin-Mitte',
      twitterDescription: 'Exclusive beauty treatments in Berlin-Mitte with a focus on skin health, precision, and relaxed luxury.',
    },
    de: {
      title: 'Maison Aveline | Luxus-Beauty-Salon in Berlin-Mitte',
      description: 'Maison Aveline ist Ihr exklusiver Beauty Salon in Berlin-Mitte für Gesichtsbehandlungen, Brows, Lashes, Maniküre und luxuriöse Pflege-Rituale in boutiqueartiger Atmosphäre.',
      ogTitle: 'Maison Aveline | Luxus-Beauty-Salon in Berlin-Mitte',
      ogDescription: 'Editoriales Design, ruhige Luxus-Atmosphäre und präzise Beauty-Rituale für Haut, Brows, Lashes und gepflegte Hände.',
      twitterTitle: 'Maison Aveline | Luxury Beauty Salon in Berlin-Mitte',
      twitterDescription: 'Exklusive Beauty-Behandlungen in Berlin-Mitte mit Fokus auf Hautgesundheit, Präzision und entspanntem Luxus.',
    },
  },
  about: {
    en: {
      title: 'About | Maison Aveline Berlin',
      description: 'Learn more about Maison Aveline: the brand story, philosophy, values, and boutique studio experience behind our beauty salon in Berlin-Mitte.',
      ogTitle: 'About | Maison Aveline Berlin',
      ogDescription: 'The story, mindset, and studio philosophy of Maison Aveline - modern beauty rituals with calm luxury.',
      twitterTitle: 'About | Maison Aveline Berlin',
      twitterDescription: 'Brand story, values, and studio character of Maison Aveline.',
    },
    de: {
      title: 'Über | Maison Aveline Berlin',
      description: 'Erfahren Sie mehr über Maison Aveline: Markenstory, Philosophie, Werte und die boutiqueartige Studio-Erfahrung hinter unserem Beauty Salon in Berlin-Mitte.',
      ogTitle: 'Über | Maison Aveline Berlin',
      ogDescription: 'Die Geschichte, Haltung und Studio-Philosophie von Maison Aveline - moderne Beauty-Rituale mit ruhigem Luxus.',
      twitterTitle: 'Über | Maison Aveline Berlin',
      twitterDescription: 'Markenstory, Werte und Studio-Charakter von Maison Aveline.',
    },
  },
  services: {
    en: {
      title: 'Services | Maison Aveline Beauty Salon Berlin',
      description: 'Discover all beauty services by Maison Aveline in Berlin: facials, brows, lashes, manicure, pedicure, make-up, and personal guidance.',
      ogTitle: 'Services | Maison Aveline Beauty Salon Berlin',
      ogDescription: 'Beauty rituals with a precise structure: skin treatments, brows, lashes, nail care, and occasion styling.',
      twitterTitle: 'Services | Maison Aveline Beauty Salon Berlin',
      twitterDescription: 'Overview of all services by Maison Aveline in Berlin-Mitte.',
    },
    de: {
      title: 'Leistungen | Maison Aveline Beauty Salon Berlin',
      description: 'Entdecken Sie alle Beauty-Leistungen von Maison Aveline in Berlin: Gesichtsbehandlungen, Brows, Lashes, Maniküre, Pediküre, Make-up und persönliche Beratung.',
      ogTitle: 'Leistungen | Maison Aveline Beauty Salon Berlin',
      ogDescription: 'Beauty-Rituale mit präziser Struktur: Skin Treatments, Brows, Lashes, Nail Care und Occasion Styling.',
      twitterTitle: 'Leistungen | Maison Aveline Beauty Salon Berlin',
      twitterDescription: 'Übersicht aller Services von Maison Aveline in Berlin-Mitte.',
    },
  },
  gallery: {
    en: {
      title: 'Gallery | Maison Aveline Berlin',
      description: 'The Maison Aveline gallery shows our visual world: luxurious beauty atmosphere, signature treatments, and editorial studio details.',
      ogTitle: 'Gallery | Maison Aveline Berlin',
      ogDescription: 'Curated premium visual storytelling from the Maison Aveline beauty studio in Berlin-Mitte.',
      twitterTitle: 'Gallery | Maison Aveline Berlin',
      twitterDescription: 'Editorial gallery with beauty motifs, studio atmosphere, and signature details.',
    },
    de: {
      title: 'Galerie | Maison Aveline Berlin',
      description: 'Die Galerie von Maison Aveline zeigt unsere visuelle Welt: luxuriöse Beauty-Atmosphäre, Signature Treatments und editorial inspirierte Studio-Details.',
      ogTitle: 'Galerie | Maison Aveline Berlin',
      ogDescription: 'Kuratiertes Premium-Visual-Storytelling aus dem Beauty Studio Maison Aveline in Berlin-Mitte.',
      twitterTitle: 'Galerie | Maison Aveline Berlin',
      twitterDescription: 'Editorial inspirierte Galerie mit Beauty-Motiven, Studio-Atmosphäre und Signature-Details.',
    },
  },
  pricing: {
    en: {
      title: 'Pricing | Maison Aveline Berlin',
      description: 'Transparent prices for facials, brows, lashes, nail care, and exclusive beauty packages at Maison Aveline in Berlin-Mitte.',
      ogTitle: 'Pricing | Maison Aveline Berlin',
      ogDescription: 'Clear pricing structure for signature treatments, brow and lash services, nail care, and premium packages.',
      twitterTitle: 'Pricing | Maison Aveline Berlin',
      twitterDescription: 'Transparent price overview for Maison Aveline.',
    },
    de: {
      title: 'Preise | Maison Aveline Berlin',
      description: 'Transparente Preise für Gesichtsbehandlungen, Brows, Lashes, Nail Care und exklusive Beauty-Pakete bei Maison Aveline in Berlin-Mitte.',
      ogTitle: 'Preise | Maison Aveline Berlin',
      ogDescription: 'Klare Preisstruktur für Signature Treatments, Brow- und Lash-Services, Nail Care und Premium-Pakete.',
      twitterTitle: 'Preise | Maison Aveline Berlin',
      twitterDescription: 'Transparente Preisübersicht für Maison Aveline.',
    },
  },
  contact: {
    en: {
      title: 'Contact | Maison Aveline Berlin',
      description: 'Contact Maison Aveline in Berlin-Mitte for appointments, beauty advice, opening hours, address, and personal recommendations.',
      ogTitle: 'Contact | Maison Aveline Berlin',
      ogDescription: 'Request an appointment, check opening hours, and contact Maison Aveline directly in Berlin-Mitte.',
      twitterTitle: 'Contact | Maison Aveline Berlin',
      twitterDescription: 'Contact page with form, opening hours, address, and appointment CTA.',
    },
    de: {
      title: 'Kontakt | Maison Aveline Berlin',
      description: 'Kontaktieren Sie Maison Aveline in Berlin-Mitte für Terminwünsche, Beauty-Beratung, Öffnungszeiten, Adresse und persönliche Empfehlungen.',
      ogTitle: 'Kontakt | Maison Aveline Berlin',
      ogDescription: 'Termin anfragen, Öffnungszeiten prüfen und Maison Aveline direkt in Berlin-Mitte kontaktieren.',
      twitterTitle: 'Kontakt | Maison Aveline Berlin',
      twitterDescription: 'Kontaktseite mit Formular, Öffnungszeiten, Adresse und Termin-CTA.',
    },
  },
  faq: {
    en: {
      title: 'FAQ | Maison Aveline Berlin',
      description: 'Frequently asked questions about appointments, cancellations, aftercare, skin analysis, gift cards, and beauty treatments at Maison Aveline in Berlin-Mitte.',
      ogTitle: 'FAQ | Maison Aveline Berlin',
      ogDescription: 'Answers to the most common questions about booking, aftercare, cancellations, and treatments at Maison Aveline.',
      twitterTitle: 'FAQ | Maison Aveline Berlin',
      twitterDescription: 'All important answers before your appointment at Maison Aveline.',
    },
    de: {
      title: 'FAQ | Maison Aveline Berlin',
      description: 'Häufige Fragen zu Terminen, Storno, Nachpflege, Hautanalyse, Gutscheinen und Beauty-Behandlungen bei Maison Aveline in Berlin-Mitte.',
      ogTitle: 'FAQ | Maison Aveline Berlin',
      ogDescription: 'Antworten auf die häufigsten Fragen rund um Terminbuchung, Pflege, Storno und Behandlungen bei Maison Aveline.',
      twitterTitle: 'FAQ | Maison Aveline Berlin',
      twitterDescription: 'Alle wichtigen Antworten vor Ihrem Termin bei Maison Aveline.',
    },
  },
  privacy: {
    en: {
      title: 'Privacy | Maison Aveline Berlin',
      description: 'Privacy information from Maison Aveline with professionally structured placeholder text for easy legal adaptation.',
      ogTitle: 'Privacy | Maison Aveline Berlin',
      ogDescription: 'Professionally structured privacy information for Maison Aveline.',
      twitterTitle: 'Privacy | Maison Aveline Berlin',
      twitterDescription: 'Privacy information with clear structure and editable placeholders.',
    },
    de: {
      title: 'Datenschutz | Maison Aveline Berlin',
      description: 'Datenschutzhinweise von Maison Aveline mit professionell strukturierten Platzhaltertexten zur einfachen rechtlichen Anpassung.',
      ogTitle: 'Datenschutz | Maison Aveline Berlin',
      ogDescription: 'Professionell strukturierte Datenschutzhinweise für Maison Aveline.',
      twitterTitle: 'Datenschutz | Maison Aveline Berlin',
      twitterDescription: 'Datenschutzhinweise mit sauberer Struktur und austauschbaren Platzhaltern.',
    },
  },
  imprint: {
    en: {
      title: 'Imprint | Maison Aveline Berlin',
      description: 'Imprint of Maison Aveline with professionally formatted and easily replaceable placeholder information for the legal project start.',
      ogTitle: 'Imprint | Maison Aveline Berlin',
      ogDescription: 'Professionally structured imprint page with editable placeholders for Maison Aveline.',
      twitterTitle: 'Imprint | Maison Aveline Berlin',
      twitterDescription: 'Imprint page with professional structure and legal placeholders.',
    },
    de: {
      title: 'Impressum | Maison Aveline Berlin',
      description: 'Impressum von Maison Aveline mit professionell formatierten und leicht austauschbaren Platzhalterangaben fuer den rechtlichen Projektstart.',
      ogTitle: 'Impressum | Maison Aveline Berlin',
      ogDescription: 'Professionell strukturierte Impressumsseite mit austauschbaren Platzhaltern fuer Maison Aveline.',
      twitterTitle: 'Impressum | Maison Aveline Berlin',
      twitterDescription: 'Impressumsseite mit professioneller Struktur und rechtlichen Platzhaltern.',
    },
  },
};

const applyTextTranslations = (root, dictionary) => {
  if (!dictionary) return;
  const orderedKeys = Object.keys(dictionary).sort((left, right) => right.length - left.length);

  const replaceValue = (value) => {
    const normalized = normalizeTranslationKey(value);
    if (dictionary[normalized]) {
      return value.replace(normalized, dictionary[normalized]);
    }

    let translated = value;
    orderedKeys.forEach((key) => {
      if (key && translated.includes(key)) {
        translated = translated.split(key).join(dictionary[key]);
      }
    });
    return translated;
  };

  const walker = doc.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement;
      if (!parent) return NodeFilter.FILTER_REJECT;
      if (['SCRIPT', 'STYLE', 'NOSCRIPT', 'CODE', 'PRE'].includes(parent.tagName)) {
        return NodeFilter.FILTER_REJECT;
      }
      return normalizeTranslationKey(node.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
    },
  });

  const textNodes = [];
  while (walker.nextNode()) {
    textNodes.push(walker.currentNode);
  }

  textNodes.forEach((node) => {
    const original = node.nodeValue;
    const normalized = normalizeTranslationKey(original);
    const translated = dictionary[normalized];
    if (!translated) return;
    node.nodeValue = original.replace(normalized, translated);
  });

  root.querySelectorAll('[alt], [aria-label], [placeholder], [title], [data-title], [data-text]').forEach((element) => {
    ['alt', 'aria-label', 'placeholder', 'title', 'data-title', 'data-text'].forEach((attribute) => {
      const currentValue = element.getAttribute(attribute);
      if (!currentValue) return;
      const translatedValue = replaceValue(currentValue);
      if (translatedValue !== currentValue) {
        element.setAttribute(attribute, translatedValue);
      }
    });
  });
};

const applySeoTranslations = () => {
  const metaSet = PAGE_META[pageId] || PAGE_META.index;
  const pageMeta = metaSet[locale] || metaSet.en;

  if (pageMeta?.title) {
    doc.title = pageMeta.title;
  }

  const setMetaContent = (selector, value, attr = 'content') => {
    const meta = doc.querySelector(selector);
    if (meta && value) {
      meta.setAttribute(attr, value);
    }
  };

  setMetaContent('meta[name="description"]', pageMeta.description);
  setMetaContent('meta[property="og:title"]', pageMeta.ogTitle);
  setMetaContent('meta[property="og:description"]', pageMeta.ogDescription);
  setMetaContent('meta[property="og:locale"]', locale === 'de' ? 'de_DE' : 'en_US');
  setMetaContent('meta[name="twitter:title"]', pageMeta.twitterTitle);
  setMetaContent('meta[name="twitter:description"]', pageMeta.twitterDescription);
  doc.documentElement.lang = locale;
};

const applyLanguage = () => {
  const dictionary = TEXT_TRANSLATIONS[locale] || {};
  applyTextTranslations(doc.body, dictionary);
  applySeoTranslations();
};

if (yearNode) {
  yearNode.textContent = new Date().getFullYear();
}

applyLanguage();
syncLocaleAwareLinks();
injectLanguageSwitcher();

const toggleScrolledState = () => {
  if (!topbar) return;
  topbar.classList.toggle('is-scrolled', window.scrollY > 16);
};

toggleScrolledState();
window.addEventListener('scroll', toggleScrolledState, { passive: true });

if (navToggle && navMenu) {
  const setNavState = (open) => {
    navMenu.classList.toggle('is-open', open);
    navToggle.setAttribute('aria-expanded', String(open));
    body.dataset.navOpen = String(open);
  };

  navToggle.addEventListener('click', () => {
    const open = navToggle.getAttribute('aria-expanded') !== 'true';
    setNavState(open);
  });

  navMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setNavState(false));
  });

  doc.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      setNavState(false);
    }
  });

  doc.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    if (!navMenu.classList.contains('is-open')) return;
    if (target.closest('[data-nav]') || target.closest('[data-nav-toggle]')) return;
    setNavState(false);
  });
}

if ('IntersectionObserver' in window && revealItems.length > 0) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      rootMargin: '0px 0px -10% 0px',
      threshold: 0.18,
    }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

if (filterButtons.length > 0 && filterCards.length > 0) {
  const applyFilter = (filter) => {
    filterCards.forEach((card) => {
      const match = filter === 'all' || card.dataset.serviceCategory === filter;
      card.hidden = !match;
    });

    filterButtons.forEach((button) => {
      const active = button.dataset.filter === filter;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
  };

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => applyFilter(button.dataset.filter || 'all'));
  });
}

const validators = {
  text: (value) => value.trim().length >= 2,
  email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()),
  tel: (value) => value.trim().length >= 6,
  select: (value) => value.trim() !== '',
  textarea: (value) => value.trim().length >= 12,
};

forms.forEach((form) => {
  const message = form.querySelector('[data-form-message]');
  const fields = form.querySelectorAll('[data-validate]');

  const setFieldState = (field, valid) => {
    field.setAttribute('aria-invalid', String(!valid));
    field.style.borderColor = valid ? '' : 'rgba(143, 68, 53, 0.55)';
  };

  const validateField = (field) => {
    const rule = field.dataset.validate;
    const value = field.value;
    const valid = validators[rule] ? validators[rule](value) : true;
    setFieldState(field, valid);
    return valid;
  };

  fields.forEach((field) => {
    field.addEventListener('blur', () => validateField(field));
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    let allValid = true;

    fields.forEach((field) => {
      const valid = validateField(field);
      if (!valid && allValid) {
        field.focus();
      }
      allValid = allValid && valid;
    });

    if (!message) return;

    message.className = 'form-message';

    if (!allValid) {
      message.textContent = 'Bitte prüfen Sie die markierten Felder und ergänzen Sie vollständige Angaben.';
      message.classList.add('is-error');
      return;
    }

    form.reset();
    fields.forEach((field) => setFieldState(field, true));
    message.textContent = 'Vielen Dank. Ihre Anfrage ist vorbereitet und kann jetzt in Ihr CRM oder E-Mail-Setup integriert werden.';
    message.classList.add('is-success');
  });
});

if (lightbox) {
  const lightboxImage = lightbox.querySelector('[data-lightbox-image]');
  const lightboxTitle = lightbox.querySelector('[data-lightbox-title]');
  const lightboxText = lightbox.querySelector('[data-lightbox-text]');
  const closeButton = lightbox.querySelector('[data-lightbox-close]');
  let lastFocused = null;

  const closeLightbox = () => {
    lightbox.classList.remove('is-active');
    lightbox.setAttribute('aria-hidden', 'true');
    body.style.overflow = '';
    if (lastFocused instanceof HTMLElement) {
      lastFocused.focus();
    }
  };

  const openLightbox = (trigger) => {
    const image = trigger.querySelector('img');
    if (!image || !lightboxImage || !lightboxTitle || !lightboxText) return;

    lastFocused = trigger;
    lightboxImage.src = image.currentSrc || image.src;
    lightboxImage.alt = image.alt;
    lightboxTitle.textContent = trigger.dataset.title || 'Galerieansicht';
    lightboxText.textContent = trigger.dataset.text || 'Kuratiertes Detail aus dem Studio von Maison Aveline.';
    lightbox.classList.add('is-active');
    lightbox.setAttribute('aria-hidden', 'false');
    body.style.overflow = 'hidden';
    closeButton?.focus();
  };

  doc.querySelectorAll('[data-lightbox-trigger]').forEach((trigger) => {
    trigger.addEventListener('click', () => openLightbox(trigger));
  });

  closeButton?.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  doc.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && lightbox.classList.contains('is-active')) {
      closeLightbox();
    }
  });
}
