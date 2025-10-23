/* ===== Main Script: Portfolio Enhancements ===== */

/* ========== THEME TOGGLE ========== */
const themeToggle = document.getElementById('theme-toggle');
const root = document.documentElement;

// Load saved theme or default to light
const savedTheme = localStorage.getItem('theme') || 'light';
root.setAttribute('data-theme', savedTheme);

// Toggle theme
themeToggle?.addEventListener('click', () => {
  const newTheme = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
  root.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
});

/* ========== NAVIGATION ========== */
const nav = document.getElementById('nav');
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.section, .hero');

// Sticky nav
window.addEventListener('scroll', () => {
  nav?.classList.toggle('scrolled', window.scrollY > 50);
});

// Mobile menu toggle
navToggle?.addEventListener('click', () => {
  navMenu?.classList.toggle('active');
  const spans = navToggle.querySelectorAll('span');
  const active = navMenu.classList.contains('active');
  spans[0].style.transform = active ? 'rotate(45deg) translate(5px,5px)' : 'none';
  spans[1].style.opacity = active ? '0' : '1';
  spans[2].style.transform = active ? 'rotate(-45deg) translate(7px,-6px)' : 'none';
});

// Close menu on link click
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    navMenu?.classList.remove('active');
    navToggle.querySelectorAll('span').forEach((s, i) => {
      s.style.transform = 'none';
      if (i === 1) s.style.opacity = '1';
    });
  });
});

// Highlight active section & smooth scrolling
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 200) current = section.id;
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
});

navLinks.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
  });
});

/* ========== SCROLL ANIMATIONS ========== */
const animatedElements = document.querySelectorAll('.glass-card, .project-card, .article-card, .dataset-card');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -100px 0px' });

animatedElements.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});

/* ========== SKILL BARS ========== */
const skillBars = document.querySelectorAll('.skill-progress');
const skillObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const width = entry.target.style.width;
      entry.target.style.width = '0';
      setTimeout(() => (entry.target.style.width = width), 100);
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

skillBars.forEach(bar => skillObserver.observe(bar));

/* ========== BACK TO TOP ========== */
const backToTop = document.getElementById('back-to-top');
window.addEventListener('scroll', () => {
  backToTop?.classList.toggle('visible', window.scrollY > 500);
});

backToTop?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ========== CONTACT FORM ========== */
const contactForm = document.querySelector('.contact-form');
contactForm?.addEventListener('submit', async e => {
  e.preventDefault();
  const formData = new FormData(contactForm);

  try {
    const response = await fetch(contactForm.action, {
      method: contactForm.method,
      body: formData,
      headers: { 'Accept': 'application/json' }
    });

    if (response.ok) {
      alert('✅ Thank you! Your message has been sent.');
      contactForm.reset();
    } else {
      alert('⚠️ Oops! Something went wrong. Try again later.');
    }
  } catch {
    alert('❌ Error sending message. Please check your internet connection.');
  }
});

/* ========== HERO PARALLAX ========== */
const heroBackground = document.querySelector('.hero-background');
window.addEventListener('scroll', () => {
  if (heroBackground && window.scrollY < window.innerHeight) {
    heroBackground.style.transform = `translateY(${window.scrollY * 0.5}px)`;
  }
});

/* ========== FOOTER YEAR ========== */
const footerText = document.querySelector('.footer-bottom p');
if (footerText) footerText.textContent = `© ${new Date().getFullYear()} Dancan Mbaabu. All rights reserved.`;

/* ========== CURSOR ORB EFFECT ========== */
document.addEventListener('mousemove', e => {
  document.querySelectorAll('.gradient-orb').forEach((orb, i) => {
    const speed = (i + 1) * 0.02;
    orb.style.transform = `translate(${e.clientX * speed}px, ${e.clientY * speed}px)`;
  });
});

/* ========== DATASETS DOWNLOAD COUNTERS ========== */
const downloadButtons = document.querySelectorAll('.download-btn');

downloadButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const file = btn.getAttribute('data-file');
    const countId = 'count-' + file.split('.')[0];
    let count = Number(localStorage.getItem(countId)) || 0;
    count++;
    localStorage.setItem(countId, count);
    document.getElementById(countId).textContent = `${count} Downloads`;

    const link = document.createElement('a');
    link.href = `/datasets/${file}`;
    link.download = file;
    link.click();
  });
});

// Restore counts on load
window.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.download-count').forEach(el => {
    const saved = localStorage.getItem(el.id) || 0;
    el.textContent = `${saved} Downloads`;
  });
});

/* ========== CV DOWNLOAD MODAL ========== */
document.addEventListener('DOMContentLoaded', () => {
  const downloadButton = document.getElementById('download-button');
  const contactModal = document.getElementById('contact-modal');
  const successModal = document.getElementById('success-modal');
  const closeButtons = document.querySelectorAll('.close-btn');
  const downloadForm = document.getElementById('download-form');
  const actualDownloadLink = document.getElementById('actual-download-link');
  const clickCounter = document.getElementById('click-counter');

  const STORAGE_KEY = 'cvDownloadCount';
  let count = parseInt(localStorage.getItem(STORAGE_KEY)) || 0;
  clickCounter.textContent = count;

  downloadButton?.addEventListener('click', () => contactModal.style.display = 'block');

  closeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      contactModal.style.display = 'none';
      successModal.style.display = 'none';
    });
  });

  window.addEventListener('click', event => {
    if (event.target == contactModal || event.target == successModal) {
      contactModal.style.display = 'none';
      successModal.style.display = 'none';
    }
  });

  downloadForm?.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('email-input').value;
    const mobile = document.getElementById('mobile-input').value;

    console.log(`Lead Captured: Email: ${email}, Mobile: ${mobile}`);

    count++;
    clickCounter.textContent = count;
    localStorage.setItem(STORAGE_KEY, count);

    actualDownloadLink?.click();
    contactModal.style.display = 'none';
    successModal.style.display = 'block';
    downloadForm.reset();
  });
});

/* ========== INIT ========== */
console.log('%cPortfolio Loaded Successfully! 🚀', 'color:#00aaff;font-weight:bold;');
/* ===== End of Script ===== */