/**
 * BuildFlow — script.js
 * Módulos: Header sticky, Menu mobile, FAQ, Modal de vídeo, Newsletter
 */

'use strict';

/* ─── 1. HEADER SCROLL EFFECT ─────────────────── */
(function initHeaderScroll() {
  const header = document.getElementById('header');
  if (!header) return;

  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 10);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load
})();


/* ─── 2. HAMBURGER / MOBILE NAV ───────────────── */
(function initMobileNav() {
  const hamburger = document.getElementById('hamburger');
  const nav       = document.getElementById('nav');
  if (!hamburger || !nav) return;

  const toggle = (force) => {
    const isOpen = force !== undefined ? force : !hamburger.classList.contains('open');
    hamburger.classList.toggle('open', isOpen);
    nav.classList.toggle('nav--open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  };

  hamburger.addEventListener('click', () => toggle());

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && hamburger.classList.contains('open')) toggle(false);
  });

  // Close when a nav link is clicked
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      if (nav.classList.contains('nav--open')) toggle(false);
    });
  });
})();


/* ─── 3. FAQ ACCORDION ────────────────────────── */
(function initFaq() {
  const items = document.querySelectorAll('.faq__item');
  if (!items.length) return;

  items.forEach(item => {
    item.addEventListener('toggle', () => {
      // Optional: close others when one opens (accordion behaviour)
      if (item.open) {
        items.forEach(other => {
          if (other !== item && other.open) other.open = false;
        });
      }
    });
  });
})();


/* ─── 4. VIDEO MODAL ──────────────────────────── */
(function initVideoModal() {
  const playBtn    = document.getElementById('playBtn');
  const modal      = document.getElementById('videoModal');
  const backdrop   = document.getElementById('modalBackdrop');
  const closeBtn   = document.getElementById('modalClose');
  const iframe     = document.getElementById('modalIframe');
  if (!playBtn || !modal) return;

  const VIDEO_URL = 'https://www.youtube.com/embed/Y8XpQpW5OVY?autoplay=1&rel=0';

  const openModal = () => {
    iframe.src = VIDEO_URL;
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  };

  const closeModal = () => {
    modal.hidden = true;
    iframe.src = '';
    document.body.style.overflow = '';
    playBtn.focus();
  };

  playBtn.addEventListener('click', openModal);
  closeBtn.addEventListener('click', closeModal);
  backdrop.addEventListener('click', closeModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.hidden) closeModal();
  });
})();


/* ─── 5. NEWSLETTER FORM ──────────────────────── */
(function initNewsletter() {
  const form = document.getElementById('newsletterForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = form.querySelector('input[type="email"]');
    const btn   = form.querySelector('button');

    if (!input.value) return;

    // Simulate async submission
    btn.textContent = '…';
    btn.disabled = true;

    setTimeout(() => {
      btn.textContent = '✓ Assinado!';
      btn.style.background = '#22c55e';
      input.value = '';

      setTimeout(() => {
        btn.textContent = 'Assinar';
        btn.style.background = '';
        btn.disabled = false;
      }, 3000);
    }, 900);
  });
})();


/* ─── 6. SMOOTH ANCHOR SCROLL ─────────────────── */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href').slice(1);
      if (!targetId) return;
      const target = document.getElementById(targetId);
      if (!target) return;
      e.preventDefault();
      const headerH = document.getElementById('header')?.offsetHeight ?? 68;
      const top = target.getBoundingClientRect().top + window.scrollY - headerH - 16;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();


/* ─── 7. SCROLL REVEAL (CSS class toggle) ─────── */
(function initScrollReveal() {
  // Add .reveal class to elements we want to animate
  const targets = document.querySelectorAll(
    '.feat-card, .stats__item, .feature-alt__row, .faq__item'
  );

  if (!targets.length || !('IntersectionObserver' in window)) return;

  // Inject base styles
  const style = document.createElement('style');
  style.textContent = `
    .reveal { opacity: 0; transform: translateY(24px); transition: opacity 0.5s ease, transform 0.5s ease; }
    .reveal.visible { opacity: 1; transform: none; }
  `;
  document.head.appendChild(style);

  targets.forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${(i % 3) * 80}ms`;
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  targets.forEach(el => observer.observe(el));
})();


/* ─── 8. ACTIVE NAV LINK (scroll spy) ─────────── */
(function initScrollSpy() {
  const sections = document.querySelectorAll('main [id]');
  const navLinks = document.querySelectorAll('.nav__link[href^="#"]');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.toggle(
            'nav__link--active',
            link.getAttribute('href') === `#${entry.target.id}`
          );
        });
      }
    });
  }, { rootMargin: '-40% 0px -55%' });

  sections.forEach(s => observer.observe(s));
})();
