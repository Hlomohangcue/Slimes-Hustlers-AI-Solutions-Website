document.addEventListener('DOMContentLoaded', function () {
  const loader = document.getElementById('loader');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const backToTop = document.getElementById('backToTop');
  const testimonialSlider = document.getElementById('testimonialSlider');
  const testimonialButtons = document.querySelectorAll('.slider-button');
  const testimonials = document.querySelectorAll('.testimonial-card');
  const form = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  setTimeout(() => loader.classList.add('hidden'), 650);

  navToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
    navToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
  });

  document.querySelectorAll('.nav-list a').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
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

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function validatePhone(phone) {
    return /\+?[0-9()\s-]{7,20}/.test(phone);
  }

  function showError(element, message) {
    element.textContent = message;
  }

  function clearErrors() {
    document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
    formStatus.textContent = '';
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    clearErrors();

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
      return;
    }

    formStatus.textContent = 'Sending message...';

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
          throw new Error(result.error || 'Unable to send message.');
        }
        formStatus.textContent = 'Message sent successfully. We will contact you soon.';
        form.reset();
      })
      .catch(error => {
        formStatus.textContent = error.message;
      });
  });
});
