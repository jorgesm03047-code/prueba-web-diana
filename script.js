/* ═══════════════════════════════════════════════════════════════════════════
   script.js — Dra. Diana Santos Márquez · Portal Profesional
   AOS init, mobile nav, FAQ accordion, form handling.
   ═══════════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ─────────────────────────────────────────────────
     1. AOS INIT
     ───────────────────────────────────────────────── */
  if (typeof AOS !== 'undefined') {
    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    AOS.init({
      duration: 600,
      easing: 'ease-out-cubic',
      once: true,
      offset: 60,
      disable: prefersReducedMotion.matches
    });
    // Re-check if preference changes
    prefersReducedMotion.addEventListener('change', function () {
      if (prefersReducedMotion.matches) {
        AOS.init({ disable: true });
      }
    });
  }

  /* ─────────────────────────────────────────────────
     2. HEADER SCROLL EFFECT
     ───────────────────────────────────────────────── */
  var header = document.getElementById('site-header');
  function handleHeaderScroll() {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 20);
  }
  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll();

  /* ─────────────────────────────────────────────────
     3. MOBILE NAV
     ───────────────────────────────────────────────── */
  var navToggle = document.getElementById('nav-toggle');
  var navLinks = document.getElementById('nav-links');
  var mobileOverlay = null;

  function createOverlay() {
    if (mobileOverlay) return mobileOverlay;
    mobileOverlay = document.createElement('div');
    mobileOverlay.className = 'mobile-overlay';
    mobileOverlay.setAttribute('aria-hidden', 'true');
    document.body.appendChild(mobileOverlay);
    mobileOverlay.addEventListener('click', closeMobileNav);
    return mobileOverlay;
  }

  function openMobileNav() {
    if (!navLinks || !navToggle) return;
    var overlay = createOverlay();
    navLinks.classList.add('is-open');
    overlay.classList.add('is-active');
    navToggle.setAttribute('aria-expanded', 'true');
    navToggle.setAttribute('aria-label', 'Cerrar menú');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileNav() {
    if (!navLinks || !navToggle) return;
    navLinks.classList.remove('is-open');
    if (mobileOverlay) mobileOverlay.classList.remove('is-active');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Abrir menú');
    document.body.style.overflow = '';
  }

  if (navToggle) {
    navToggle.addEventListener('click', function () {
      var isOpen = navToggle.getAttribute('aria-expanded') === 'true';
      isOpen ? closeMobileNav() : openMobileNav();
    });
  }

  if (navLinks) {
    navLinks.querySelectorAll('.nav__link').forEach(function (link) {
      link.addEventListener('click', closeMobileNav);
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMobileNav();
  });

  /* ─────────────────────────────────────────────────
     4. FAQ ACCORDION
     ───────────────────────────────────────────────── */
  document.querySelectorAll('.faq-item__question').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = this.closest('.faq-item');
      var isOpen = item.classList.contains('is-open');

      // Close all other items
      document.querySelectorAll('.faq-item.is-open').forEach(function (openItem) {
        if (openItem !== item) {
          openItem.classList.remove('is-open');
          openItem.querySelector('.faq-item__question').setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle current
      item.classList.toggle('is-open', !isOpen);
      this.setAttribute('aria-expanded', String(!isOpen));
    });
  });

  /* ─────────────────────────────────────────────────
     5. CONTACT FORM
     ───────────────────────────────────────────────── */
  var contactForm = document.getElementById('contact-form');
  var formSuccess = document.getElementById('form-success');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var isValid = true;
      var requiredFields = contactForm.querySelectorAll('[required]');

      requiredFields.forEach(function (field) {
        field.classList.remove('is-invalid');
        if (!field.value.trim()) {
          field.classList.add('is-invalid');
          isValid = false;
        }
        if (field.type === 'email' && field.value.trim()) {
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim())) {
            field.classList.add('is-invalid');
            isValid = false;
          }
        }
      });

      if (!isValid) {
        var firstInvalid = contactForm.querySelector('.is-invalid');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      contactForm.style.display = 'none';
      if (formSuccess) formSuccess.hidden = false;
      contactForm.reset();
    });

    contactForm.querySelectorAll('.form-input').forEach(function (input) {
      input.addEventListener('input', function () { this.classList.remove('is-invalid'); });
      input.addEventListener('change', function () { this.classList.remove('is-invalid'); });
    });
  }

  /* ─────────────────────────────────────────────────
     6. DYNAMIC YEAR
     ───────────────────────────────────────────────── */
  var yearEl = document.getElementById('current-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ─────────────────────────────────────────────────
     7. SMOOTH SCROLL (anchors only)
     ───────────────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;
      var targetEl = document.querySelector(targetId);
      if (!targetEl) return;
      e.preventDefault();
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

})();
