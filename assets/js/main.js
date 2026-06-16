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

if (yearNode) {
  yearNode.textContent = new Date().getFullYear();
}

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
