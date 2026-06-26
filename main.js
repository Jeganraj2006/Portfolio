/* ============================================================
   main.js — Jeganraj Portfolio
   Vanilla JS only. No frameworks. No bloat.
============================================================ */

(() => {
  'use strict';

  /* ----------------------------------------------------------
     1. NAVBAR — scrolled state + active link
  ---------------------------------------------------------- */
  const navbar  = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-menu a');
  const sections = document.querySelectorAll('section[id]');

  function onScroll() {
    // Solid navbar after 60px
    navbar.classList.toggle('scrolled', window.scrollY > 60);

    // Highlight active nav link
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) {
        current = sec.id;
      }
    });
    navLinks.forEach(a => {
      a.classList.remove('active');
      if (a.getAttribute('href') === '#' + current) {
        a.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load


  /* ----------------------------------------------------------
     2. HAMBURGER MENU
  ---------------------------------------------------------- */
  const burger = document.getElementById('burger');

  // Create mobile drawer dynamically
  const drawer = document.createElement('div');
  drawer.className = 'mobile-drawer';
  drawer.id = 'mobile-drawer';

  const drawerLinks = ['About', 'Experience', 'Projects', 'Achievements', 'Contact'];
  drawerLinks.forEach(text => {
    const a = document.createElement('a');
    a.href = '#' + text.toLowerCase();
    a.textContent = text;
    a.addEventListener('click', closeDrawer);
    drawer.appendChild(a);
  });

  // Resume link in drawer
  const resumeLink = document.createElement('a');
  resumeLink.href = 'jeganraj_resume_universal.pdf';
  resumeLink.download = '';
  resumeLink.textContent = 'Download Resume ↓';
  resumeLink.style.cssText = 'color: #C8602A; font-weight: 600;';
  resumeLink.addEventListener('click', closeDrawer);
  drawer.appendChild(resumeLink);

  navbar.insertAdjacentElement('afterend', drawer);

  function closeDrawer() {
    burger.classList.remove('open');
    drawer.classList.remove('open');
    document.body.style.overflow = '';
  }

  burger.addEventListener('click', () => {
    const isOpen = drawer.classList.toggle('open');
    burger.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close on outside click
  document.addEventListener('click', e => {
    if (!navbar.contains(e.target) && !drawer.contains(e.target)) {
      closeDrawer();
    }
  });


  /* ----------------------------------------------------------
     3. SCROLL REVEAL
     Uses IntersectionObserver — no jank, no forced layout.
  ---------------------------------------------------------- */
  const revealEls = document.querySelectorAll(
    '.timeline-item, .project-card, .project-featured, .ach-item, .reveal'
  );

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Slight stagger for grouped items
          const delay = entry.target.dataset.delay || 0;
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, delay);
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  // Add stagger delays to grouped items
  document.querySelectorAll('.project-card').forEach((el, i) => {
    el.dataset.delay = i * 80;
  });
  document.querySelectorAll('.ach-item').forEach((el, i) => {
    el.dataset.delay = i * 60;
  });

  revealEls.forEach(el => revealObserver.observe(el));


  /* ----------------------------------------------------------
     4. CONTACT FORM — basic validation + success state
  ---------------------------------------------------------- */
  const form    = document.getElementById('contact-form');
  const success = document.getElementById('form-success');

  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();

      // Simple field check
      const fields = form.querySelectorAll('input[required], textarea[required]');
      let valid = true;
      fields.forEach(f => {
        f.style.borderColor = '';
        if (!f.value.trim()) {
          f.style.borderColor = '#C8602A';
          valid = false;
        }
      });
      if (!valid) return;

      // Email format check
      const emailField = form.querySelector('input[type="email"]');
      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailField && !emailRe.test(emailField.value)) {
        emailField.style.borderColor = '#C8602A';
        return;
      }

      // Submit (replace with your backend / Formspree endpoint)
      // fetch('https://formspree.io/f/YOUR_ID', { method: 'POST', body: new FormData(form) })

      // For now: show success
      form.reset();
      success.style.display = 'block';
      setTimeout(() => { success.style.display = 'none'; }, 5000);
    });

    // Remove red border on input
    form.querySelectorAll('input, textarea').forEach(f => {
      f.addEventListener('input', () => { f.style.borderColor = ''; });
    });
  }


  /* ----------------------------------------------------------
     5. SMOOTH SCROLL for anchor links (all browsers)
  ---------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = navbar.offsetHeight + 8;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });


  /* ----------------------------------------------------------
     6. TYPING EFFECT — role line in hero (subtle, one-time)
  ---------------------------------------------------------- */
  const roleEl = document.querySelector('.home-role');
  if (roleEl) {
    const original = roleEl.innerHTML;
    roleEl.innerHTML = '';
    let i = 0;
    const rawText = roleEl.textContent || 'Full Stack Developer / IT Undergrad';

    // Re-set the inner HTML version after typing
    const fullHTML = original;
    roleEl.style.visibility = 'hidden';

    // Only do this if user hasn't requested reduced motion
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReduced) {
      const stripped = 'Full Stack Developer / IT Undergrad';
      let j = 0;
      function type() {
        if (j <= stripped.length) {
          roleEl.style.visibility = 'visible';
          roleEl.textContent = stripped.slice(0, j);
          j++;
          setTimeout(type, 38);
        } else {
          // Restore proper HTML with the sep span
          roleEl.innerHTML = 'Full Stack Developer <span class="role-sep">/</span> IT Undergrad';
        }
      }
      setTimeout(type, 600);
    } else {
      roleEl.innerHTML = fullHTML;
      roleEl.style.visibility = 'visible';
    }
  }


  /* ----------------------------------------------------------
     7. IMAGE LAZY LOADING fallback (for older browsers)
  ---------------------------------------------------------- */
  if ('loading' in HTMLImageElement.prototype) {
    document.querySelectorAll('img').forEach(img => {
      img.loading = 'lazy';
    });
  }

})();
