// script.js – Interactive functionality for Bright Star Aluminium Roofing

document.addEventListener('DOMContentLoaded', () => {
  // Mobile Navigation Drawer Toggle
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const mobileNavDrawer = document.getElementById('mobile-nav-drawer');

  if (hamburgerBtn && mobileNavDrawer) {
    hamburgerBtn.addEventListener('click', () => {
      hamburgerBtn.classList.toggle('open');
      mobileNavDrawer.classList.toggle('open');
    });
  }

  // Close Mobile Drawer on link click (handled inline too, but safe-check here)
  window.toggleMobileNav = function() {
    if (hamburgerBtn && mobileNavDrawer) {
      hamburgerBtn.classList.remove('open');
      mobileNavDrawer.classList.remove('open');
    }
  };

  // Header Scroll Effect
  const headerNav = document.getElementById('header-nav');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      headerNav.classList.add('scrolled');
    } else {
      headerNav.classList.remove('scrolled');
    }
  });

  // Back to Top Button
  const backToTopBtn = document.getElementById('back-to-top-btn');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 500) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // Scroll Reveal Animations
  const reveals = document.querySelectorAll('.reveal');
  const revealOnScroll = () => {
    for (let i = 0; i < reveals.length; i++) {
      const windowHeight = window.innerHeight;
      const elementTop = reveals[i].getBoundingClientRect().top;
      const elementVisible = 120; // threshold in px

      if (elementTop < windowHeight - elementVisible) {
        reveals[i].classList.add('active');
        
        // If it's a progress bar, animate the width
        const progressFill = reveals[i].querySelector('.progress-bar-fill');
        if (progressFill) {
          const percent = progressFill.getAttribute('data-percent');
          progressFill.style.width = percent;
        }
      }
    }
  };
  
  window.addEventListener('scroll', revealOnScroll);
  // Run once initially to show elements already in view
  revealOnScroll();

  // Scroll Active Nav Link Highlight
  const sections = document.querySelectorAll('section, main > div');
  const navLinks = document.querySelectorAll('.nav-menu .nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (pageYOffset >= (sectionTop - 120)) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').slice(1) === current) {
        link.classList.add('active');
      }
    });
  });

  // INTERACTIVE ROOFING ESTIMATOR LOGIC
  const materialSelect = document.getElementById('material-select');
  const thicknessSelect = document.getElementById('thickness-select');
  const areaSlider = document.getElementById('area-slider');
  const areaDisplay = document.getElementById('area-display');
  const woodworkToggle = document.getElementById('woodwork-toggle');
  const gutterToggle = document.getElementById('gutter-toggle');
  const priceOutput = document.getElementById('estimate-price-output');

  // Multi-tier cost structure for materials (Cost in NGN per sqm)
  const tariff = {
    'longspan': {
      '0.55': 7800,
      '0.70': 10500,
      '1.00': 14500
    },
    'steptiles': {
      '0.55': 8200,
      '0.70': 11000,
      '1.00': 15000
    },
    'metrocopo': {
      '0.55': 8400,
      '0.70': 11200,
      '1.00': 15200
    },
    'stone-bond': {
      'standard': 11000
    },
    'stone-shingle': {
      'standard': 13500
    }
  };

  function updateEstimatorUI() {
    const materialValue = materialSelect.value;
    
    // Check if selected material is stone-coated (where steel thickness inputs don't apply directly)
    const isStoneCoated = materialValue.startsWith('stone-');
    
    if (isStoneCoated) {
      thicknessSelect.disabled = true;
      // Clear thickness value or show custom message in selection
      const customOption = document.createElement('option');
      customOption.value = 'N/A';
      customOption.text = 'Not Applicable (Standard Stone)';
      customOption.id = 'na-option';
      
      if (!document.getElementById('na-option')) {
        thicknessSelect.add(customOption);
      }
      thicknessSelect.value = 'N/A';
    } else {
      thicknessSelect.disabled = false;
      const naOption = document.getElementById('na-option');
      if (naOption) {
        naOption.remove();
      }
      // Revert to 0.55 if was disabled
      if (thicknessSelect.value === 'N/A' || !thicknessSelect.value) {
        thicknessSelect.value = '0.55';
      }
    }
  }

  function runCalculations() {
    const materialValue = materialSelect.value;
    const thicknessValue = thicknessSelect.value;
    const areaSqM = parseInt(areaSlider.value);
    const hasWoodwork = woodworkToggle.checked;
    const hasGutters = gutterToggle.checked;

    // Display area value live
    areaDisplay.innerText = `${areaSqM} m²`;

    let baseRate = 0;

    if (materialValue.startsWith('stone-')) {
      baseRate = tariff[materialValue]['standard'];
    } else {
      // For aluminium sheets, fallback to standard if thickness is not found
      const thicknessKey = tariff[materialValue][thicknessValue] ? thicknessValue : '0.55';
      baseRate = tariff[materialValue][thicknessKey];
    }

    // Calculations
    const materialCost = baseRate * areaSqM;
    
    // Woodwork structure truss addition (costing about N4,800 per square meter)
    const woodworkCost = hasWoodwork ? (4800 * areaSqM) : 0;

    // Gutter runs cost calculated using a rectangular perimeter approximation (4 * Math.sqrt(areaSqM))
    // at a cost rate of N3,800 per linear meter
    const estimatedPerimeter = 4 * Math.sqrt(areaSqM);
    const gutterCost = hasGutters ? Math.round(estimatedPerimeter * 3800) : 0;

    const totalEstimate = materialCost + woodworkCost + gutterCost;

    // Define lower and upper budget constraints (95% to 115%)
    const lowerEstimate = Math.round(totalEstimate * 0.95);
    const upperEstimate = Math.round(totalEstimate * 1.15);

    // Format currency to NGN (Naira) format
    const formatNGN = (num) => {
      return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        maximumFractionDigits: 0
      }).format(num);
    };

    priceOutput.innerText = `${formatNGN(lowerEstimate)} - ${formatNGN(upperEstimate)}`;
  }

  // Attach event listeners for calculator
  if (materialSelect && areaSlider) {
    materialSelect.addEventListener('change', () => {
      updateEstimatorUI();
      runCalculations();
    });
    thicknessSelect.addEventListener('change', runCalculations);
    areaSlider.addEventListener('input', runCalculations);
    woodworkToggle.addEventListener('change', runCalculations);
    gutterToggle.addEventListener('change', runCalculations);
    
    // Initial run on page load
    updateEstimatorUI();
    runCalculations();
  }
});

// Interactive Contact Form Handling
function handleFormSubmit(event) {
  event.preventDefault();
  
  const clientName = document.getElementById('client-name').value;
  const clientPhone = document.getElementById('client-phone').value;
  const clientProject = document.getElementById('client-project');
  const selectedProjectText = clientProject.options[clientProject.selectedIndex].text;
  
  // Custom dialog response styling
  const formCard = document.querySelector('.contact-form-card');
  const originalHTML = formCard.innerHTML;
  
  formCard.style.opacity = '0';
  
  setTimeout(() => {
    formCard.innerHTML = `
      <div style="text-align: center; padding: 40px 20px; color: #fff;">
        <div style="width: 60px; height: 60px; background: rgba(0, 242, 254, 0.1); border-radius: 50%; color: var(--color-accent-teal); margin: 0 auto 24px auto; display: flex; align-items: center; justify-content: center; border: 1px solid var(--color-border);">
          <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <h3 style="font-family: var(--font-heading); font-size: 1.5rem; margin-bottom: 12px; background: var(--gradient-stellar); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Booking Successful!</h3>
        <p style="color: var(--color-text-muted); font-size: 0.95rem; margin-bottom: 24px; line-height: 1.6;">
          Thank you, <strong>${clientName}</strong>. Your request for <strong>${selectedProjectText}</strong> has been logged.
        </p>
        <p style="font-size: 0.9rem; color: var(--color-accent-gold); margin-bottom: 30px;">
          Our Agege service representative will call you on <strong>${clientPhone}</strong> within 15 minutes to schedule your free roof physical inspection.
        </p>
        <button class="btn btn-outline" onclick="resetBookingForm()" style="font-size: 0.85rem; padding: 10px 20px;">Book Another Inspection</button>
      </div>
    `;
    formCard.style.opacity = '1';
  }, 400);

  window.resetBookingForm = function() {
    formCard.style.opacity = '0';
    setTimeout(() => {
      formCard.innerHTML = originalHTML;
      formCard.style.opacity = '1';
      // Re-attach submit handler
      document.getElementById('booking-form').addEventListener('submit', handleFormSubmit);
    }, 400);
  };
}
