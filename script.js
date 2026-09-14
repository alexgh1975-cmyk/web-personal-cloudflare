/* ═══════════════════════════════════════════════════════════
   SCRIPT.JS — Alejandro García Hernández · Personal Web
═══════════════════════════════════════════════════════════ */

'use strict';

/* ── Navbar scroll behaviour ────────────────────────────── */
(function initNavbar() {
  const navbar   = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');
  const links     = navLinks ? navLinks.querySelectorAll('.nav-link') : [];

  // Scrolled class
  function onScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 20);

    // Active nav link
    const scrollY = window.scrollY + 100;
    document.querySelectorAll('section[id]').forEach(section => {
      const top    = section.offsetTop;
      const bottom = top + section.offsetHeight;
      const id     = section.getAttribute('id');
      const link   = document.querySelector(`.nav-link[href="#${id}"]`);
      if (link) {
        link.classList.toggle('active', scrollY >= top && scrollY < bottom);
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Hamburger
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
    });

    // Close on link click
    links.forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target)) {
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  }
})();


/* ── Typed text effect ──────────────────────────────────── */
(function initTyped() {
  const el = document.getElementById('typed-text');
  if (!el) return;

  const phrases = [
    'Master Full Stack Developer',
    'Operations Manager',
    'Supply Chain Expert',
    'Logística & Procesos',
    'Orientado a KPIs & Datos',
  ];

  let phraseIdx = 0;
  let charIdx   = 0;
  let deleting  = false;
  let delay     = 110;

  function type() {
    const currentPhrase = phrases[phraseIdx];

    if (!deleting) {
      el.textContent = currentPhrase.slice(0, charIdx + 1);
      charIdx++;
      if (charIdx === currentPhrase.length) {
        deleting = true;
        delay = 2200; // pause before deleting
      } else {
        delay = 80 + Math.random() * 50;
      }
    } else {
      el.textContent = currentPhrase.slice(0, charIdx - 1);
      charIdx--;
      delay = 45;
      if (charIdx === 0) {
        deleting  = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        delay     = 350;
      }
    }

    setTimeout(type, delay);
  }

  // Small initial delay before starting
  setTimeout(type, 800);
})();


/* ── Floating hero particles ────────────────────────────── */
(function initParticles() {
  const container = document.getElementById('hero-particles');
  if (!container) return;

  // Respect prefers-reduced-motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const PARTICLE_COUNT = 28;

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const p = document.createElement('div');
    p.className = 'particle';

    const size     = Math.random() * 3 + 1;
    const x        = Math.random() * 100;
    const duration = Math.random() * 20 + 12;
    const delay    = Math.random() * 15;

    p.style.cssText = `
      left: ${x}%;
      bottom: -10px;
      width: ${size}px;
      height: ${size}px;
      animation-duration: ${duration}s;
      animation-delay: ${delay}s;
      opacity: 0;
    `;

    container.appendChild(p);
  }
})();


/* ── Counter animation (Intersection Observer) ──────────── */
(function initCounters() {
  const counters = document.querySelectorAll('.stat-number[data-target]');
  if (!counters.length) return;

  const easeOut = t => 1 - Math.pow(1 - t, 3);
  const DURATION = 1800; // ms

  function animateCounter(el) {
    const target  = parseInt(el.dataset.target, 10);
    const start   = performance.now();

    function step(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / DURATION, 1);
      const value    = Math.round(easeOut(progress) * target);
      el.textContent = value;
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
})();


/* ── Service cards reveal (staggered fade-up) ───────────── */
(function initServiceCards() {
  const cards = document.querySelectorAll('.service-card[data-aos]');
  if (!cards.length) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    cards.forEach(c => c.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Find index among all cards for stagger offset
        const allCards = [...cards];
        const idx = allCards.indexOf(entry.target);
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, idx * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  cards.forEach(card => observer.observe(card));
})();


/* ── Smooth scroll for anchor links ─────────────────────── */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
})();


/* ── Timeline item fade-in on scroll ────────────────────── */
(function initTimelineFade() {
  const items = document.querySelectorAll('.timeline-item');
  if (!items.length) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Initial state
  items.forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateX(-16px)';
    item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity  = '1';
        entry.target.style.transform = 'translateX(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  items.forEach(item => observer.observe(item));
})();


/* ── Education cards fade-in ────────────────────────────── */
(function initEduCards() {
  const cards = document.querySelectorAll('.edu-card');
  if (!cards.length) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  cards.forEach((card, i) => {
    card.style.opacity   = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = `opacity 0.45s ease ${i * 0.07}s, transform 0.45s ease ${i * 0.07}s`;
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity   = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  cards.forEach(card => observer.observe(card));
})();


/* ── Contact items entrance ─────────────────────────────── */
(function initContactItems() {
  const items = document.querySelectorAll('.contact-item, .cta-box-inner');
  if (!items.length) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  items.forEach((item, i) => {
    item.style.opacity   = '0';
    item.style.transform = 'translateY(20px)';
    item.style.transition = `opacity 0.5s ease ${i * 0.1}s, transform 0.5s ease ${i * 0.1}s`;
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity   = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  items.forEach(item => observer.observe(item));
})();


/* ── Highlight items stagger ────────────────────────────── */
(function initHighlights() {
  const items = document.querySelectorAll('.highlight-item');
  if (!items.length) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  items.forEach((item, i) => {
    item.style.opacity   = '0';
    item.style.transform = 'translateX(-12px)';
    item.style.transition = `opacity 0.5s ease ${i * 0.12}s, transform 0.5s ease ${i * 0.12}s`;
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity   = '1';
        entry.target.style.transform = 'translateX(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  items.forEach(item => observer.observe(item));
})();


/* ── Skills grid reveal ─────────────────────────────────── */
(function initSkillTags() {
  const about = document.querySelector('.about-skills');
  if (!about) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  about.style.opacity   = '0';
  about.style.transform = 'translateY(24px)';
  about.style.transition = 'opacity 0.6s ease 0.2s, transform 0.6s ease 0.2s';

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity   = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  observer.observe(about);
})();


/* ── Current year in footer (future-proof) ──────────────── */
(function setYear() {
  const yearEls = document.querySelectorAll('[data-year]');
  const y = new Date().getFullYear();
  yearEls.forEach(el => { el.textContent = y; });
})();


console.log('%c AGH Portfolio ', 'background:#4f9ff8;color:#080c14;font-weight:900;font-size:14px;padding:4px 8px;border-radius:4px;');
console.log('%c Alejandro García Hernández — Full Stack Dev & Ops Manager', 'color:#8b5cf6;font-size:12px;');
