document.addEventListener('DOMContentLoaded', function () {
  const loader = document.getElementById('loader');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const backToTop = document.getElementById('backToTop');
  const testimonialSlider = document.getElementById('testimonialSlider');
  const testimonialButtons = document.querySelectorAll('.slider-button');
  const testimonials = document.querySelectorAll('.testimonial-card');
  const themeToggle = document.getElementById('themeToggle');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const form = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  setTimeout(() => loader.classList.add('hidden'), 650);

  // Drawer open/close with focus trap for accessibility
  let _lastFocused = null;
  function getFocusable(container) {
    const selectors = 'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';
    return Array.from(container.querySelectorAll(selectors)).filter(el => el.offsetParent !== null);
  }

  function trapKeyHandler(e) {
    if (e.key === 'Escape') {
      closeNav();
      return;
    }
    if (e.key !== 'Tab') return;
    const focusable = getFocusable(navMenu);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  function openNav() {
    _lastFocused = document.activeElement;
    navMenu.classList.add('open');
    navMenu.setAttribute('aria-hidden', 'false');
    navToggle.classList.add('open');
    navToggle.setAttribute('aria-expanded', 'true');
    navToggle.setAttribute('aria-label', 'Close navigation');
    // hide main content from assistive tech while drawer open
    const main = document.getElementById('main');
    if (main) main.setAttribute('aria-hidden', 'true');
    const focusable = getFocusable(navMenu);
    if (focusable.length) focusable[0].focus();
    document.addEventListener('keydown', trapKeyHandler);
  }

  function closeNav() {
    navMenu.classList.remove('open');
    navMenu.setAttribute('aria-hidden', 'true');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Open navigation');
    const main = document.getElementById('main');
    if (main) main.removeAttribute('aria-hidden');
    document.removeEventListener('keydown', trapKeyHandler);
    if (_lastFocused) _lastFocused.focus();
  }

  navToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.contains('open');
    if (isOpen) closeNav(); else openNav();
  });

  document.querySelectorAll('.nav-list a').forEach(link => {
    link.addEventListener('click', () => {
      // close the drawer on navigation and restore focus
      closeNav();
    });
  });

  window.addEventListener('scroll', () => {
    const showButton = window.scrollY > 500;
    backToTop.classList.toggle('show', showButton);
  });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  function setActiveTestimonial(index) {
    testimonials.forEach((card, idx) => card.classList.toggle('active', idx === index));
    testimonialButtons.forEach((button, idx) => button.classList.toggle('active', idx === index));
  }

  testimonialButtons.forEach(button => {
    button.addEventListener('click', () => {
      setActiveTestimonial(parseInt(button.dataset.index, 10));
    });
  });

  let testimonialIndex = 0;
  setInterval(() => {
    testimonialIndex = (testimonialIndex + 1) % testimonials.length;
    setActiveTestimonial(testimonialIndex);
  }, 5500);

  // Theme toggle: remembers preference in localStorage
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    themeToggle.textContent = theme === 'light' ? '🌞' : '🌗';
  }

  const savedTheme = localStorage.getItem('theme') || (prefersDark ? 'dark' : 'light');
  applyTheme(savedTheme);

  themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    applyTheme(current === 'dark' ? 'light' : 'dark');
  });

  // Scroll reveal for elements with .reveal
  const reveals = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.18 });
  reveals.forEach(r => revealObserver.observe(r));

  // Animated counters for stats
  const counters = document.querySelectorAll('.stat-value');
  const counterObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = Number(el.getAttribute('data-target')) || 0;
      const duration = 1300;
      let start = null;
      function step(ts) {
        if (!start) start = ts;
        const progress = Math.min((ts - start) / duration, 1);
        el.textContent = Math.floor(progress * target * (target > 10 ? 1 : 1));
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = target + (el.getAttribute('data-suffix') || (target >= 100 ? '+' : ''));
        }
      }
      requestAnimationFrame(step);
      obs.unobserve(el);
    });
  }, { threshold: 0.3 });
  counters.forEach(c => counterObserver.observe(c));

  // Prefill contact form when "Learn More" clicked and scroll to contact
  document.querySelectorAll('.learn-more').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const svc = btn.getAttribute('data-service') || '';
      const message = document.getElementById('message');
      if (message) {
        message.value = `Hello, I am interested in your ${svc} service. Please contact me with more details.`;
      }
      // allow anchor default to scroll; additionally focus the message after a small delay
      setTimeout(() => { if (message) message.focus(); }, 700);
    });
  });

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function validatePhone(phone) {
    return /\+?[0-9()\s-]{7,20}/.test(phone);
  }

  function showError(element, message) {
    element.textContent = message;
    // mark the related input as aria-invalid
    const id = element.id;
    if (!id) return;
    // mapping of error spans to inputs follows pattern nameError -> fullName, emailError -> email
    const inputMap = {
      nameError: 'fullName',
      emailError: 'email',
      phoneError: 'phone',
      companyError: 'company',
      messageError: 'message'
    };
    const inputId = inputMap[id];
    if (inputId) {
      const inputEl = document.getElementById(inputId);
      if (inputEl) inputEl.setAttribute('aria-invalid', 'true');
    }
  }

  function clearErrors() {
    document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
    // clear aria-invalid
    ['fullName','email','phone','company','message'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.setAttribute('aria-invalid','false');
    });
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    clearErrors();
    const submitButton = document.getElementById('submitButton');
    if (submitButton) { submitButton.disabled = true; submitButton.setAttribute('aria-busy','true'); }
    const name = document.getElementById('fullName');
    const email = document.getElementById('email');
    const phone = document.getElementById('phone');
    const company = document.getElementById('company');
    const message = document.getElementById('message');

    let valid = true;

    if (!name.value.trim()) {
      showError(document.getElementById('nameError'), 'Please enter your full name.');
      valid = false;
    }

    if (!validateEmail(email.value.trim())) {
      showError(document.getElementById('emailError'), 'Please enter a valid email address.');
      valid = false;
    }

    if (!validatePhone(phone.value.trim())) {
      showError(document.getElementById('phoneError'), 'Please enter a valid phone number.');
      valid = false;
    }

    if (!company.value.trim()) {
      showError(document.getElementById('companyError'), 'Please enter your company name.');
      valid = false;
    }

    if (!message.value.trim()) {
      showError(document.getElementById('messageError'), 'Please write a short message.');
      valid = false;
    }

    if (!valid) {
      formStatus.textContent = 'Please fix the highlighted fields and try again.';
      if (submitButton) { submitButton.disabled = false; submitButton.removeAttribute('aria-busy'); }
      return;
    }

    formStatus.textContent = 'Sending message...';
    formStatus.setAttribute('aria-live','polite');

    fetch('/api/contacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        fullName: name.value.trim(),
        email: email.value.trim(),
        phone: phone.value.trim(),
        company: company.value.trim(),
        message: message.value.trim()
      })
    })
      .then(async response => {
        const result = await response.json();
        if (!response.ok) {
          // server-provided error message or generic
          throw new Error(result.error || result.message || 'Unable to send message.');
        }
        formStatus.textContent = 'Message sent successfully. We will contact you soon.';
        form.reset();
        // reset aria-invalid attributes
        clearErrors();
        if (submitButton) { submitButton.disabled = false; submitButton.removeAttribute('aria-busy'); }
      })
      .catch(error => {
        // show network/server error and set role=alert for assistive tech
        formStatus.textContent = error.message;
        formStatus.setAttribute('role','alert');
        if (submitButton) { submitButton.disabled = false; submitButton.removeAttribute('aria-busy'); }
      });
  });
});
