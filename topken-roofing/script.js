// script.js – Interactive features for Top Ken Roofing landing page
// 1. Mobile navigation toggle (if later needed)
// 2. WhatsApp button click – open chat in new tab
// 3. Quote calculator – simple cost estimate
// 4. Contact form – simulated async submission with status feedback

document.addEventListener('DOMContentLoaded', () => {
  // ---------- 1. WhatsApp CTA ----------
  const whatsappBtn = document.getElementById('whatsappBtn');
  if (whatsappBtn) {
    whatsappBtn.addEventListener('click', () => {
      const url = 'https://wa.me/2348069254277?text=' + encodeURIComponent('Hello Top Ken Roofing, I would like a free quote.');
      window.open(url, '_blank');
    });
  }

  // ---------- 2. Quote Calculator ----------
  const quoteForm = document.getElementById('quoteForm');
  const quoteResult = document.getElementById('quoteResult');
  if (quoteForm && quoteResult) {
    const rates = {
      aluminium: 1200, // NGN per m² (example rate)
      stone: 1500,
      metcopo: 1300,
    };
    const sheetCoverage = 0.9; // Approx. m² covered by one sheet (adjust as needed)

    quoteForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const area = parseFloat(quoteForm.area.value);
      const type = quoteForm.type.value;
      if (isNaN(area) || area <= 0) {
        quoteResult.textContent = 'Please enter a valid roof area.';
        quoteResult.style.color = 'red';
        return;
      }
      const rate = rates[type] || rates['aluminium'];
      const sheetsNeeded = Math.ceil(area / sheetCoverage);
      const cost = sheetsNeeded * rate;
      quoteResult.style.color = 'inherit';
      quoteResult.textContent = `Estimated sheets: ${sheetsNeeded} – Approx. cost: ₦${cost.toLocaleString()}.`;    
    });
  }

  // ---------- 3. Contact Form ----------
  const contactForm = document.getElementById('contactForm');
  const contactStatus = document.getElementById('contactStatus');
  if (contactForm && contactStatus) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      contactStatus.textContent = 'Sending...';
      // Simulate async submission – replace with real endpoint if available
      await new Promise((resolve) => setTimeout(resolve, 1200));
      // Basic validation – all fields are required (HTML already enforces)
      contactStatus.textContent = 'Thank you! We will get back to you shortly.';
      contactForm.reset();
    });
  }

  // ---------- 4. Simple Scroll Reveal (optional) ----------
  const observerOptions = {
    threshold: 0.1,
  };
  const revealCallback = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal');
        observer.unobserve(entry.target);
      }
    });
  };
  const observer = new IntersectionObserver(revealCallback, observerOptions);
  document.querySelectorAll('section').forEach((sec) => observer.observe(sec));
});
