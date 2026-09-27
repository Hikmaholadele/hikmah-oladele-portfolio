/**
 * Hikmah Oladele — Portfolio Interactions
 * Scope: Mobile navigation, subtle scroll reveal, and active navigation state.
 * Philosophy: Lightweight, robust, zero dependencies.
 */

document.addEventListener('DOMContentLoaded', () => {
  /* --------------------------------------------------------------------------
     1. Mobile Navigation Drawer
     -------------------------------------------------------------------------- */
  const navToggle = document.getElementById('navToggle');
  const primaryNav = document.getElementById('primaryNav');
  const navLinks = document.querySelectorAll('.nav-link, .btn-nav');

  function openMenu() {
    if (!navToggle || !primaryNav) return;
    navToggle.classList.add('is-active');
    navToggle.setAttribute('aria-expanded', 'true');
    primaryNav.classList.add('is-open');
  }

  function closeMenu() {
    if (!navToggle || !primaryNav) return;
    navToggle.classList.remove('is-active');
    navToggle.setAttribute('aria-expanded', 'false');
    primaryNav.classList.remove('is-open');
  }

  if (navToggle && primaryNav) {
    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      if (isExpanded) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // Close menu when a link inside the nav is clicked
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        closeMenu();
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (
        primaryNav.classList.contains('is-open') &&
        !primaryNav.contains(e.target) &&
        !navToggle.contains(e.target)
      ) {
        closeMenu();
      }
    });

    // Close menu when pressing Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && primaryNav.classList.contains('is-open')) {
        closeMenu();
        navToggle.focus();
      }
    });
  }

  /* --------------------------------------------------------------------------
     2. Subtle Scroll Reveal
     -------------------------------------------------------------------------- */
  const revealElements = document.querySelectorAll('.reveal');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    // If reduced motion or IntersectionObserver unsupported, reveal immediately
    revealElements.forEach((el) => el.classList.add('is-revealed'));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  }

  /* --------------------------------------------------------------------------
     3. Active Navigation State on Scroll
     -------------------------------------------------------------------------- */
  const trackedSections = document.querySelectorAll('section[id]');
  const navLinkMap = new Map();

  document.querySelectorAll('.primary-nav .nav-link').forEach((link) => {
    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      const targetId = href.substring(1);
      navLinkMap.set(targetId, link);
    }
  });

  if ('IntersectionObserver' in window && trackedSections.length > 0) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const currentId = entry.target.getAttribute('id');
            // Remove active class from all links
            navLinkMap.forEach((link) => link.classList.remove('active'));
            // Highlight current link
            const activeLink = navLinkMap.get(currentId);
            if (activeLink) {
              activeLink.classList.add('active');
            }
          }
        });
      },
      {
        root: null,
        rootMargin: '-20% 0px -65% 0px',
        threshold: 0,
      }
    );

    trackedSections.forEach((section) => sectionObserver.observe(section));
  }
});
