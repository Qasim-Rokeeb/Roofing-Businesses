/* ============================================================
   GHAPH Roofing And Properties Services – script.js
   ============================================================ */

/* ── Header scroll effect ── */
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

/* ── Mobile burger menu ── */
const burger  = document.getElementById('burger');
const navMenu = document.getElementById('nav-menu');

burger.addEventListener('click', () => {
  navMenu.classList.toggle('open');
  const spans = burger.querySelectorAll('span');
  if (navMenu.classList.contains('open')) {
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity   = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }
});

// Close nav on link click
navMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('open');
    burger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  });
});

/* ── Scroll reveal ── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ── Animated counters ── */
function animateCounter(el) {
  const target  = parseInt(el.getAttribute('data-target'), 10);
  const suffix  = el.querySelector('span') ? el.querySelector('span').outerHTML : '';
  const duration = 1800;
  const step     = target / (duration / 16);
  let current    = 0;

  const tick = () => {
    current += step;
    if (current >= target) {
      current = target;
      el.innerHTML = target + suffix;
    } else {
      el.innerHTML = Math.floor(current) + suffix;
      requestAnimationFrame(tick);
    }
  };
  requestAnimationFrame(tick);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.dataset.counted) {
      entry.target.dataset.counted = true;
      animateCounter(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-target]').forEach(el => counterObserver.observe(el));

/* ── Testimonials / Reviews Carousel ── */
const track       = document.getElementById('carouselTrack');
const dotsWrapper = document.getElementById('carouselDots');
const prevBtn     = document.getElementById('prevBtn');
const nextBtn     = document.getElementById('nextBtn');

if (track) {
  const slides      = track.querySelectorAll('.carousel-slide');
  let currentIndex  = 0;
  let slidesVisible = getSlidesVisible();
  let totalPositions = Math.ceil(slides.length / slidesVisible);

  function getSlidesVisible() {
    if (window.innerWidth >= 1024) return 3;
    if (window.innerWidth >= 768)  return 2;
    return 1;
  }

  function buildDots() {
    dotsWrapper.innerHTML = '';
    totalPositions = Math.ceil(slides.length / slidesVisible);
    for (let i = 0; i < totalPositions; i++) {
      const dot = document.createElement('div');
      dot.classList.add('carousel-dot');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goTo(i));
      dotsWrapper.appendChild(dot);
    }
  }

  function updateDots() {
    dotsWrapper.querySelectorAll('.carousel-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex);
    });
  }

  function goTo(index) {
    currentIndex = Math.max(0, Math.min(index, totalPositions - 1));
    const slideWidth  = slides[0].offsetWidth;
    track.style.transform = `translateX(-${currentIndex * slidesVisible * slideWidth}px)`;
    updateDots();
  }

  prevBtn.addEventListener('click', () => goTo(currentIndex - 1));
  nextBtn.addEventListener('click', () => {
    if (currentIndex >= totalPositions - 1) goTo(0);
    else goTo(currentIndex + 1);
  });

  // Auto-play
  let autoInterval = setInterval(() => {
    if (currentIndex >= totalPositions - 1) goTo(0);
    else goTo(currentIndex + 1);
  }, 4500);

  track.parentElement.addEventListener('mouseenter', () => clearInterval(autoInterval));
  track.parentElement.addEventListener('mouseleave', () => {
    autoInterval = setInterval(() => {
      if (currentIndex >= totalPositions - 1) goTo(0);
      else goTo(currentIndex + 1);
    }, 4500);
  });

  // Rebuild on resize
  window.addEventListener('resize', () => {
    slidesVisible = getSlidesVisible();
    currentIndex  = 0;
    buildDots();
    goTo(0);
  });

  // Touch / swipe
  let touchStartX = 0;
  track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goTo(currentIndex + 1);
      else goTo(currentIndex - 1);
    }
  });

  buildDots();
}

/* ── Contact Form submission ── */
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    const btn = contactForm.querySelector('.btn-submit');
    btn.textContent = 'Sending…';
    btn.style.opacity = '0.7';
    btn.disabled = true;

    setTimeout(() => {
      contactForm.style.display = 'none';
      formSuccess.style.display = 'block';
    }, 1400);
  });
}

/* ── Scroll-to-top ── */
const scrollTopBtn = document.getElementById('scrollTop');
window.addEventListener('scroll', () => {
  if (window.scrollY > 400) scrollTopBtn.classList.add('visible');
  else scrollTopBtn.classList.remove('visible');
});
scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ── Active nav link highlight on scroll ── */
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.style.color = '';
        if (link.getAttribute('href') === '#' + entry.target.id) {
          link.style.color = 'var(--primary)';
        }
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(section => sectionObserver.observe(section));
