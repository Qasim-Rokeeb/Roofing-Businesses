document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. Mobile Hamburger Menu Toggle
  // ==========================================
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenuPanel = document.getElementById('mobile-menu-panel');
  const mobileLinks = mobileMenuPanel.querySelectorAll('a');

  function toggleMobileMenu() {
    mobileMenuBtn.classList.toggle('active');
    mobileMenuPanel.classList.toggle('active');
    document.body.style.overflow = mobileMenuPanel.classList.contains('active') ? 'hidden' : '';
  }

  if (mobileMenuBtn && mobileMenuPanel) {
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (mobileMenuPanel.classList.contains('active')) {
          toggleMobileMenu();
        }
      });
    });
  }

  // ==========================================
  // 2. Sticky Header Transitions
  // ==========================================
  const header = document.querySelector('.auth-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // ==========================================
  // 3. Viewport Scroll Reveal Observer
  // ==========================================
  const revealElements = document.querySelectorAll('.reveal');
  const revealOnScroll = () => {
    revealElements.forEach(element => {
      const windowHeight = window.innerHeight;
      const elementTop = element.getBoundingClientRect().top;
      const elementVisible = 120; // Visibility offset trigger

      if (elementTop < windowHeight - elementVisible) {
        element.classList.add('active');
      }
    });
  };
  window.addEventListener('scroll', revealOnScroll);
  revealOnScroll(); // Trigger on initial load

  // ==========================================
  // 4. Portfolio Filter Tabs
  // ==========================================
  const tabButtons = document.querySelectorAll('.tab-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class from all buttons and add to clicked
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      portfolioItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        
        if (filterValue === 'all' || itemCategory === filterValue) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });

  // ==========================================
  // 5. FAQ Accordion Dropdowns
  // ==========================================
  const faqHeaders = document.querySelectorAll('.faq-header');

  faqHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const content = header.nextElementSibling;
      const isActive = item.classList.contains('active');

      // Collapse all FAQ items first
      document.querySelectorAll('.faq-item').forEach(faq => {
        faq.classList.remove('active');
        faq.querySelector('.faq-content').style.maxHeight = null;
      });

      if (!isActive) {
        item.classList.add('active');
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });

  // ==========================================
  // 6. Dynamic Quote Calculator (Wholesale & Labor)
  // ==========================================
  const materialSelect = document.getElementById('calc-material');
  const areaSlider = document.getElementById('calc-area');
  const areaValueDisplay = document.getElementById('area-val-text');
  
  // Custom Checkboxes
  const checkWoodwork = document.getElementById('calc-woodwork');
  const checkNails = document.getElementById('calc-nails');
  const checkGutters = document.getElementById('calc-gutters');
  const checkInstallation = document.getElementById('calc-installation');

  // Outputs
  const priceMinDisplay = document.getElementById('output-price-min');
  const priceMaxDisplay = document.getElementById('output-price-max');
  
  // Breakdown
  const breakdownMaterial = document.getElementById('breakdown-material');
  const breakdownAccessories = document.getElementById('breakdown-accessories');
  const breakdownInstallation = document.getElementById('breakdown-installation');
  const breakdownTotal = document.getElementById('breakdown-total');

  function calculateQuote() {
    if (!materialSelect || !areaSlider) return;

    const area = parseInt(areaSlider.value);
    const selectedOption = materialSelect.options[materialSelect.selectedIndex];
    const baseMaterialPrice = parseFloat(selectedOption.getAttribute('data-price'));

    // Update label text
    areaValueDisplay.innerText = `${area} m²`;

    // Calculations
    const materialCost = baseMaterialPrice * area;
    
    let accessoriesCost = 0;
    let laborCost = 0;

    if (checkNails.checked) {
      accessoriesCost += 1800 * area; // Coated drive nails
    }
    if (checkGutters.checked) {
      accessoriesCost += 3500 * area; // Gutters and collector accessories
    }
    
    if (checkWoodwork.checked) {
      accessoriesCost += 6000 * area; // Treated timber trusses woodwork
    }

    if (checkInstallation.checked) {
      laborCost = 8000 * area; // Installation service labor
    }

    const totalCalculatedCost = materialCost + accessoriesCost + laborCost;

    // Minimum budget range (93%) and maximum safety buffer range (118%)
    const minCalculated = Math.round(totalCalculatedCost * 0.93);
    const maxCalculated = Math.round(totalCalculatedCost * 1.18);

    // Currency Formatting (Naira format NGN)
    const nairaFormatter = new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 0
    });

    // Display updates
    priceMinDisplay.innerText = nairaFormatter.format(minCalculated);
    priceMaxDisplay.innerText = nairaFormatter.format(maxCalculated);
    
    breakdownMaterial.innerText = nairaFormatter.format(materialCost);
    breakdownAccessories.innerText = accessoriesCost > 0 ? nairaFormatter.format(accessoriesCost) : '₦0';
    breakdownInstallation.innerText = laborCost > 0 ? nairaFormatter.format(laborCost) : '₦0';
    breakdownTotal.innerText = nairaFormatter.format(totalCalculatedCost);
  }

  if (materialSelect && areaSlider) {
    materialSelect.addEventListener('change', calculateQuote);
    areaSlider.addEventListener('input', calculateQuote);
    checkWoodwork.addEventListener('change', calculateQuote);
    checkNails.addEventListener('change', calculateQuote);
    checkGutters.addEventListener('change', calculateQuote);
    checkInstallation.addEventListener('change', calculateQuote);

    // Initial Trigger
    calculateQuote();
  }

  // ==========================================
  // 7. WhatsApp Chat "Speak with Austin"
  // ==========================================
  const whatsappFloat = document.getElementById('whatsapp-float');
  if (whatsappFloat) {
    whatsappFloat.addEventListener('click', (e) => {
      e.preventDefault();
      const message = encodeURIComponent(
        "Hello Authentic Roofing Tiles Intercontinental Limited! I visited your website and would like to speak with Austin regarding a wholesale material quote or roofing installation request."
      );
      const whatsappURL = `https://wa.me/2348033040492?text=${message}`;
      window.open(whatsappURL, '_blank');
    });
  }

});
