/* ==========================================================
   BEST LANDSCAPE & GARDENING SURREY — main.js
   ========================================================== */

'use strict';

/* ─── CUSTOM CURSOR ─────────────────────────────────────── */
(function () {
  const isTouch = window.matchMedia('(hover: none)').matches;
  if (isTouch) return;

  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;
  let visible = false;
  let rafId;

  function lerp(a, b, t) { return a + (b - a) * t; }

  function onMove(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top  = mouseY + 'px';
    if (!visible) {
      visible = true;
      dot.classList.add('visible');
      ring.classList.add('visible');
    }
  }

  function onLeave() {
    dot.classList.remove('visible');
    ring.classList.remove('visible');
    visible = false;
  }

  function loop() {
    ringX = lerp(ringX, mouseX, 0.11);
    ringY = lerp(ringY, mouseY, 0.11);
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';
    rafId = requestAnimationFrame(loop);
  }

  document.addEventListener('mousemove', onMove);
  document.addEventListener('mouseleave', onLeave);

  /* Hover states for interactive elements */
  function addHover(selector, dotClass, ringClass) {
    document.querySelectorAll(selector).forEach(el => {
      el.addEventListener('mouseenter', () => {
        dot.classList.add(dotClass);
        ring.classList.add(ringClass);
      });
      el.addEventListener('mouseleave', () => {
        dot.classList.remove(dotClass);
        ring.classList.remove(ringClass);
      });
    });
  }

  addHover('a, .faq-item__trigger, .services__tab, .coverage__town', 'link-hover', 'link-hover');
  addHover('.btn, button:not(.faq-item__trigger):not(.services__tab):not(.nav__hamburger)', 'btn-hover', 'btn-hover');

  loop();
})();


/* ─── MAGNETIC BUTTONS ──────────────────────────────────── */
(function () {
  const isTouch = window.matchMedia('(hover: none)').matches;
  if (isTouch) return;

  document.querySelectorAll('.btn--primary, .btn--stone').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width  / 2) * 0.18;
      const y = (e.clientY - r.top  - r.height / 2) * 0.18;
      btn.style.transform = `translate(${x}px, ${y}px) translateY(-2px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
      btn.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      setTimeout(() => { btn.style.transition = ''; }, 400);
    });
  });
})();


/* ─── NAVIGATION ────────────────────────────────────────── */
(function () {
  const nav = document.getElementById('main-nav');
  if (!nav) return;

  let lastY = 0;

  function onScroll() {
    const y = window.scrollY;
    nav.classList.toggle('scrolled', y > 40);
    lastY = y;
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();


/* ─── MOBILE MENU ───────────────────────────────────────── */
(function () {
  const btn   = document.getElementById('nav-hamburger');
  const menu  = document.getElementById('mobile-menu');
  if (!btn || !menu) return;

  let open = false;

  function toggle() {
    open = !open;
    btn.classList.toggle('open', open);
    menu.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
    btn.setAttribute('aria-expanded', open);
  }

  btn.addEventListener('click', toggle);

  /* Close on overlay click / ESC */
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && open) toggle(); });
  menu.addEventListener('click', e => { if (e.target === menu) toggle(); });

  /* Mobile sub-menus */
  menu.querySelectorAll('[data-toggle-sub]').forEach(trigger => {
    trigger.addEventListener('click', e => {
      e.preventDefault();
      const target = document.getElementById(trigger.dataset.toggleSub);
      if (target) target.classList.toggle('open');
    });
  });

  /* Close on nav link click */
  menu.querySelectorAll('a:not([data-toggle-sub])').forEach(a => {
    a.addEventListener('click', () => { if (open) toggle(); });
  });
})();


/* ─── SERVICES TABS ─────────────────────────────────────── */
(function () {
  const tabs   = document.querySelectorAll('.services__tab');
  const panels = document.querySelectorAll('.services__panel');
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      const target = document.getElementById(tab.dataset.panel);
      if (target) target.classList.add('active');
    });
  });
})();


/* ─── FAQ ACCORDION ─────────────────────────────────────── */
(function () {
  document.querySelectorAll('.faq-item__trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const item   = trigger.closest('.faq-item');
      const body   = item.querySelector('.faq-item__body');
      const isOpen = item.classList.contains('open');

      /* Close all others */
      document.querySelectorAll('.faq-item.open').forEach(el => {
        if (el !== item) {
          el.classList.remove('open');
          el.querySelector('.faq-item__body').style.maxHeight = '0';
        }
      });

      if (isOpen) {
        item.classList.remove('open');
        body.style.maxHeight = '0';
      } else {
        item.classList.add('open');
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });
})();


/* ─── SCROLL REVEAL (Intersection Observer) ─────────────── */
(function () {
  const THRESHOLD = 0.12;

  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: THRESHOLD });

  const staggerObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        staggerObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05 });

  document.querySelectorAll('.reveal, .reveal--left, .reveal--right, .underline-vine').forEach(el => revealObs.observe(el));
  document.querySelectorAll('.stagger').forEach(el => staggerObs.observe(el));
})();


/* ─── POSTCODE CHECKER ──────────────────────────────────── */
(function () {
  const form   = document.getElementById('postcode-form');
  const input  = document.getElementById('postcode-input');
  const result = document.getElementById('postcode-result');
  if (!form || !input || !result) return;

  /* Surrey postcode prefixes */
  const SURREY = ['GU', 'KT', 'RH', 'CR', 'TW', 'SM'];

  function check() {
    const val    = input.value.trim().toUpperCase().replace(/\s/g, '');
    const prefix = val.substring(0, 2);

    if (val.length < 2) {
      result.textContent = 'Please enter your postcode.';
      result.style.color = 'rgba(255,255,255,0.6)';
      return;
    }

    if (SURREY.includes(prefix)) {
      result.textContent = '✓ Great news — we cover your area! Call us or get a free quote below.';
      result.style.color = '#C4A882';
    } else {
      result.textContent = 'We may still be able to help. Please call us on 07471 734798 to check.';
      result.style.color = 'rgba(255,255,255,0.6)';
    }
  }

  form.addEventListener('submit', e => { e.preventDefault(); check(); });
  input.addEventListener('keyup', e => { if (e.key === 'Enter') check(); });
})();


/* ─── SMOOTH SCROLL FOR ANCHOR LINKS ────────────────────── */
(function () {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id     = a.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 78;
      const top  = target.getBoundingClientRect().top + window.scrollY - navH - 16;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();


/* ─── COUNTER ANIMATION ─────────────────────────────────── */
(function () {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el    = entry.target;
      const end   = parseInt(el.dataset.count, 10);
      const dur   = 1600;
      const step  = 16;
      const inc   = end / (dur / step);
      let   cur   = 0;

      const tick = setInterval(() => {
        cur = Math.min(cur + inc, end);
        el.textContent = Math.floor(cur) + (el.dataset.suffix || '');
        if (cur >= end) clearInterval(tick);
      }, step);

      obs.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(el => obs.observe(el));
})();


/* ─── NAV DROPDOWN (desktop) ────────────────────────────── */
(function () {
  document.querySelectorAll('.nav__link--dropdown').forEach(trigger => {
    let closeTimer;

    trigger.addEventListener('mouseenter', () => {
      clearTimeout(closeTimer);
      trigger.classList.add('open');
    });
    trigger.addEventListener('mouseleave', () => {
      closeTimer = setTimeout(() => trigger.classList.remove('open'), 120);
    });

    const dropdown = trigger.querySelector('.nav__dropdown');
    if (dropdown) {
      dropdown.addEventListener('mouseenter', () => clearTimeout(closeTimer));
      dropdown.addEventListener('mouseleave', () => {
        closeTimer = setTimeout(() => trigger.classList.remove('open'), 120);
      });
    }
  });
})();
