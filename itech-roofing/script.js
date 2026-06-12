document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. Mobile Menu Drawer Navigation
  // ==========================================
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenuPanel = document.getElementById('mobile-menu-panel');
  const mobileLinks = mobileMenuPanel.querySelectorAll('a');

  function toggleMobileMenu() {
    mobileMenuBtn.classList.toggle('active');
    mobileMenuPanel.classList.toggle('active');
    document.body.style.overflow = mobileMenuPanel.classList.contains('active') ? 'hidden' : '';
  }

  mobileMenuBtn.addEventListener('click', toggleMobileMenu);

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (mobileMenuPanel.classList.contains('active')) {
        toggleMobileMenu();
      }
    });
  });

  // ==========================================
  // 2. Sticky Header Scroll Effect
  // ==========================================
  const header = document.querySelector('.itech-header');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // ==========================================
  // 3. Reveal Animations on Scroll
  // ==========================================
  const revealElements = document.querySelectorAll('.reveal');

  const revealOnScroll = () => {
    for (let i = 0; i < revealElements.length; i++) {
      let windowHeight = window.innerHeight;
      let elementTop = revealElements[i].getBoundingClientRect().top;
      let elementVisible = 150; // trigger point

      if (elementTop < windowHeight - elementVisible) {
        revealElements[i].classList.add('active');
      }
    }
  };

  window.addEventListener('scroll', revealOnScroll);
  // Trigger once on load to reveal elements currently in viewport
  revealOnScroll();

  // ==========================================
  // 4. Dynamic Project Cost Estimator (Naira)
  // ==========================================
  const materialSelect = document.getElementById('estimator-material');
  const areaSlider = document.getElementById('estimator-area');
  const areaValText = document.getElementById('area-val-text');
  const complexitySelect = document.getElementById('estimator-complexity');
  
  // Add-ons checkboxes
  const checkWaterproofing = document.getElementById('add-waterproofing');
  const checkRustproofing = document.getElementById('add-rustproofing');
  const checkWoodwork = document.getElementById('add-woodwork');

  // Outputs
  const outputPriceMin = document.getElementById('output-price-min');
  const outputPriceMax = document.getElementById('output-price-max');
  
  // Breakdown elements
  const breakdownBase = document.getElementById('breakdown-base');
  const breakdownWood = document.getElementById('breakdown-wood');
  const breakdownWater = document.getElementById('breakdown-water');
  const breakdownTotal = document.getElementById('breakdown-total');

  function calculateRoofCost() {
    const selectedOption = materialSelect.options[materialSelect.selectedIndex];
    const basePricePerSqm = parseFloat(selectedOption.getAttribute('data-price'));
    const area = parseInt(areaSlider.value);
    const complexityMultiplier = parseFloat(complexitySelect.value);
    
    // Update label text
    areaValText.innerText = `${area} m²`;

    // Base Calculation
    const baseCost = basePricePerSqm * area * complexityMultiplier;
    
    // Add-ons Calculations
    let addOnsCost = 0;
    let woodworkCost = 0;
    let waterproofingCost = 0;

    if (checkWoodwork.checked) {
      woodworkCost = 6500 * area; // Hardwood framing
      addOnsCost += woodworkCost;
    }
    
    if (checkWaterproofing.checked) {
      waterproofingCost = 4500 * area; // Waterproofing membranes
      addOnsCost += waterproofingCost;
    }
    
    if (checkRustproofing.checked) {
      addOnsCost += 2500 * area; // Anti-corrosion
    }

    const totalCalculated = baseCost + addOnsCost;

    // Range formulation (90% to 115% of total cost)
    const minRange = Math.round(totalCalculated * 0.90);
    const maxRange = Math.round(totalCalculated * 1.15);

    // Formatter utility
    const formatter = new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 0
    });

    // Update main text
    outputPriceMin.innerText = formatter.format(minRange);
    outputPriceMax.innerText = formatter.format(maxRange);

    // Update breakdown details
    breakdownBase.innerText = formatter.format(baseCost);
    breakdownWood.innerText = woodworkCost > 0 ? formatter.format(woodworkCost) : '₦0';
    breakdownWater.innerText = waterproofingCost > 0 ? formatter.format(waterproofingCost) : '₦0';
    breakdownTotal.innerText = formatter.format(totalCalculated);
  }

  // Bind Listeners
  if (materialSelect && areaSlider && complexitySelect) {
    materialSelect.addEventListener('change', calculateRoofCost);
    areaSlider.addEventListener('input', calculateRoofCost);
    complexitySelect.addEventListener('change', calculateRoofCost);
    
    checkWaterproofing.addEventListener('change', calculateRoofCost);
    checkRustproofing.addEventListener('change', calculateRoofCost);
    checkWoodwork.addEventListener('change', calculateRoofCost);
    
    // Initial run
    calculateRoofCost();
  }

  // ==========================================
  // 5. WhatsApp Floating API custom text
  // ==========================================
  const whatsappFloat = document.getElementById('whatsapp-float');
  
  if (whatsappFloat) {
    whatsappFloat.addEventListener('click', (e) => {
      e.preventDefault();
      
      const textMessage = encodeURIComponent(
        "Hello i-TECH Roofing Solution! I visited your website and would like to request a professional site assessment for my roofing project."
      );
      const whatsappUrl = `https://wa.me/2347050714003?text=${textMessage}`;
      window.open(whatsappUrl, '_blank');
    });
  }

});
