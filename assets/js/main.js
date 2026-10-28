/**
 * SRI LANKAN COOKING CLASS — MAIN JAVASCRIPT
 * Interactive UI components, currency switcher, booking modal, recipe filters, spice explorer
 */

document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  // 1. Mobile Menu Toggle & Navigation Drawer
  const mobileToggleBtn = document.getElementById('mobileMenuToggle');
  const mainNav = document.getElementById('mainNav');

  if (mobileToggleBtn && mainNav) {
    mobileToggleBtn.addEventListener('click', function () {
      if (!mainNav.querySelector('.mobile-menu-footer-cta')) {
        const ctaDiv = document.createElement('div');
        ctaDiv.className = 'mobile-menu-footer-cta';
        ctaDiv.innerHTML = `
          <button class="btn btn-primary btn-block" data-open-booking="Village Rice & Curry Masterclass" style="padding:12px 18px; font-size:0.9rem;">
            <span>Book Cooking Class</span>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
          <a class="btn btn-whatsapp btn-sm btn-block" href="https://wa.me/94779876543?text=Hi%20Ayubowan%20Cooking%20Class,%20I%20would%20like%20to%20inquire%20about%20classes" target="_blank" rel="noopener">
            <span>WhatsApp Quick Chat</span>
          </a>
        `;
        mainNav.appendChild(ctaDiv);

        // Bind new booking button in mobile drawer
        const drawerBookingBtn = ctaDiv.querySelector('[data-open-booking]');
        if (drawerBookingBtn) {
          drawerBookingBtn.addEventListener('click', function () {
            mainNav.classList.remove('active');
            openBookingModal(this.getAttribute('data-open-booking'));
          });
        }
      }

      mainNav.classList.toggle('active');
      const isExpanded = mainNav.classList.contains('active');
      mobileToggleBtn.setAttribute('aria-expanded', isExpanded);
    });

    // Close menu when clicking outside or clicking a nav link
    document.addEventListener('click', function (e) {
      if (!mainNav.contains(e.target) && !mobileToggleBtn.contains(e.target) && mainNav.classList.contains('active')) {
        mainNav.classList.remove('active');
      }
    });

    mainNav.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('active');
      });
    });
  }

  // 2. Currency Switcher & Dynamic Price Converter
  const currencySelect = document.getElementById('currencySelector');
  const currencyConfig = window.ANALYTICS_CONFIG ? window.ANALYTICS_CONFIG.currencies : {
    LKR: { symbol: 'LKR ', rate: 1 },
    USD: { symbol: '$', rate: 0.0033 },
    EUR: { symbol: '€', rate: 0.0030 },
    GBP: { symbol: '£', rate: 0.0026 },
    AUD: { symbol: 'A$', rate: 0.0051 }
  };

  if (currencySelect) {
    // Restore user currency if stored
    const savedCurrency = localStorage.getItem('cooking_pref_currency');
    if (savedCurrency && currencyConfig[savedCurrency]) {
      currencySelect.value = savedCurrency;
      updateDisplayedPrices(savedCurrency);
    }

    currencySelect.addEventListener('change', function () {
      const selectedCurrency = this.value;
      localStorage.setItem('cooking_pref_currency', selectedCurrency);
      updateDisplayedPrices(selectedCurrency);

      if (window.tourismAnalytics && window.tourismAnalytics.trackCurrencyChange) {
        window.tourismAnalytics.trackCurrencyChange(selectedCurrency);
      }
      showToast(`Prices converted to ${selectedCurrency}`);
    });
  }

  function updateDisplayedPrices(currencyKey) {
    const cur = currencyConfig[currencyKey] || currencyConfig.LKR;
    const priceElements = document.querySelectorAll('[data-base-price]');

    priceElements.forEach(el => {
      const basePriceLKR = parseFloat(el.getAttribute('data-base-price'));
      if (!isNaN(basePriceLKR)) {
        if (currencyKey === 'LKR') {
          el.textContent = `${cur.symbol} ${basePriceLKR.toLocaleString()}`;
        } else {
          const converted = Math.round(basePriceLKR * cur.rate);
          el.textContent = `${cur.symbol}${converted.toLocaleString()}`;
        }
      }
    });
  }

  // 3. Booking / Inquiry Modal Controller
  const bookingModal = document.getElementById('bookingModal');
  const modalCloseBtn = document.getElementById('closeBookingModal');
  const bookingForm = document.getElementById('quickBookingForm');
  const packageSelectInput = document.getElementById('modalPackageSelect');
  const guestCountInput = document.getElementById('modalGuests');
  const estTotalDisplay = document.getElementById('modalEstimatedTotal');

  const packageBasePrices = {
    'Village Rice & Curry Masterclass': 8500,
    'Golden Spice & Organic Farm Tour + Cooking': 14500,
    'Hoppers, Rotti & Street Food Evening Safari': 9500,
    'Ayurvedic Healing & Plant-Based Culinary Retreat': 12000,
    'Lagoon Seafood & Traditional Clay Pot Experience': 16500
  };

  function updateModalPriceEstimate() {
    if (!packageSelectInput || !guestCountInput || !estTotalDisplay) return;
    const pkgName = packageSelectInput.value;
    const guests = parseInt(guestCountInput.value, 10) || 1;
    const basePrice = packageBasePrices[pkgName] || 8500;
    const totalLKR = basePrice * guests;

    const currentCur = currencySelect ? currencySelect.value : 'LKR';
    const cur = currencyConfig[currentCur] || currencyConfig.LKR;

    if (currentCur === 'LKR') {
      estTotalDisplay.textContent = `${cur.symbol} ${totalLKR.toLocaleString()}`;
    } else {
      const converted = Math.round(totalLKR * cur.rate);
      estTotalDisplay.textContent = `${cur.symbol}${converted.toLocaleString()} (approx)`;
    }
  }

  if (packageSelectInput) {
    packageSelectInput.addEventListener('change', updateModalPriceEstimate);
  }
  if (guestCountInput) {
    guestCountInput.addEventListener('input', updateModalPriceEstimate);
  }

  function openBookingModal(preselectedPackage) {
    if (!bookingModal) return;
    if (preselectedPackage && packageSelectInput) {
      packageSelectInput.value = preselectedPackage;
    }
    updateModalPriceEstimate();
    bookingModal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Track modal open
    if (window.tourismAnalytics && window.tourismAnalytics.trackCtaClick) {
      window.tourismAnalytics.trackCtaClick('Open Booking Modal', preselectedPackage || 'Generic');
    }
  }

  window.openBookingModal = openBookingModal;

  document.querySelectorAll('[data-open-booking]').forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      const packageName = this.getAttribute('data-open-booking');
      openBookingModal(packageName);
    });
  });

  if (modalCloseBtn && bookingModal) {
    modalCloseBtn.addEventListener('click', function () {
      bookingModal.classList.remove('active');
      document.body.style.overflow = '';
    });

    bookingModal.addEventListener('click', function (e) {
      if (e.target === bookingModal) {
        bookingModal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // Handle Quick Booking Form Submission (Task 02 Conversion Event)
  if (bookingForm) {
    bookingForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const name = document.getElementById('modalName')?.value || 'Guest';
      const email = document.getElementById('modalEmail')?.value || '';
      const phone = document.getElementById('modalPhone')?.value || '';
      const pkg = document.getElementById('modalPackageSelect')?.value || 'Village Rice & Curry Masterclass';
      const date = document.getElementById('modalDate')?.value || '';
      const guests = parseInt(document.getElementById('modalGuests')?.value, 10) || 2;
      const dietary = document.getElementById('modalDietary')?.value || 'Standard';

      const basePrice = packageBasePrices[pkg] || 8500;
      const estValue = basePrice * guests;

      // Dispatch Conversion Event to GTM, GA4, Meta Pixel
      if (window.tourismAnalytics && window.tourismAnalytics.trackLead) {
        window.tourismAnalytics.trackLead({
          packageName: pkg,
          leadType: 'Modal Booking Submission',
          guests: guests,
          date: date,
          dietary: dietary,
          estimatedValue: estValue,
          source: window.location.pathname.split('/').pop() || 'index.html'
        });
      }

      showToast(`Ayubowan ${name}! Your booking inquiry for ${pkg} has been sent. We will confirm via WhatsApp & email within 2 hours!`);

      bookingForm.reset();
      bookingModal.classList.remove('active');
      document.body.style.overflow = '';
    });
  }

  // 4. Interactive Spice Cabinet Explorer (on index.html)
  const spiceData = {
    cinnamon: {
      name: 'Pure Ceylon Cinnamon (Cinnamomum verum)',
      sinhala: 'කුරුඳු (Kurundu)',
      aroma: 'Sweet, delicate, floral with warm wooden notes',
      cookingRole: 'Sri Lanka produces over 85% of true Ceylon cinnamon. We roll the delicate inner bark sticks into wood-fired chicken, pork, and jackfruit curries for a fragrance that defines Sri Lankan culinary identity.',
      ayurveda: 'Balances Kapha dosha, regulates blood sugar levels, rich in natural polyphenols.'
    },
    goraka: {
      name: 'Dried Goraka / Malabar Tamarind (Garcinia gummi-gutta)',
      sinhala: 'ගොරකා (Goraka)',
      aroma: 'Tart, earthy, deeply sour, smoky tang',
      cookingRole: 'The soul of authentic Sri Lankan Fish Ambul Thiyal. Goraka replaces lemon or vinegar, naturally curing meat and seafood while tenderizing proteins in clay pots.',
      ayurveda: 'Aids metabolic digestion, traditional fat-burner and natural preservation antimicrobial agent.'
    },
    curry_leaves: {
      name: 'Fresh Karapincha / Curry Leaves (Murraya koenigii)',
      sinhala: 'කරපිංචා (Karapincha)',
      aroma: 'Nutty, herbaceous, intensely citrus-peppery',
      cookingRole: 'Never cooked from dried leaves! We pick fresh sprigs directly from the village garden and sizzle them in hot coconut oil with mustard seeds as the vital tempering base (*theldhaamu*).',
      ayurveda: 'Lowers blood cholesterol, improves liver function, stimulates gastric enzymes.'
    },
    pepper: {
      name: 'High-Piperine Ceylon Black Pepper',
      sinhala: 'ගම්මිරිස් (Gammiris)',
      aroma: 'Pungent, citrusy, lingering biting warmth',
      cookingRole: 'Sri Lankan black pepper has the highest piperine concentration on earth (up to 15% higher than ordinary pepper). It forms the fiery backbone of dark roasted spice powders.',
      ayurveda: 'Clears respiratory channels, increases bioavailability of turmeric curcumin by up to 2000%.'
    },
    turmeric: {
      name: 'Wild Organic Turmeric Root',
      sinhala: 'කහ (Kaha)',
      aroma: 'Earthy, peppery, slightly bitter root aroma',
      cookingRole: 'Freshly harvested and sun-dried in the village courtyard, ground into brilliant golden powder. Used in every single dhal, coconut milk sodhi, and vegetable curry.',
      ayurveda: 'Ancient antibacterial and anti-inflammatory elixir celebrated in Ayurveda for millennia.'
    },
    cardamom: {
      name: 'Ceylon Green Cardamom (Queen of Spices)',
      sinhala: 'එනසාල් (Enasal)',
      aroma: 'Eucalyptus, herbal, intensely aromatic sweet spice',
      cookingRole: 'Gently bruised pods tossed into yellow rice, biryani, spicy crab curry, and traditional cardamom-infused tea served upon arrival.',
      ayurveda: 'Calms digestive cramping, freshens breath, soothes nervous tension.'
    }
  };

  const spiceCards = document.querySelectorAll('.spice-card-interactive');
  const spiceDetailBox = document.getElementById('spiceDetailContent');

  if (spiceCards.length > 0 && spiceDetailBox) {
    spiceCards.forEach(card => {
      card.addEventListener('click', function () {
        spiceCards.forEach(c => c.classList.remove('active'));
        this.classList.add('active');

        const key = this.getAttribute('data-spice');
        const info = spiceData[key];
        if (info) {
          spiceDetailBox.innerHTML = `
            <div class="spice-detail-inner animate-fade-in">
              <div class="spice-badge-row">
                <span class="badge-pill gold">${info.sinhala}</span>
                <span class="badge-pill herb">Organically Cultivated on Farm</span>
              </div>
              <h3 class="spice-title">${info.name}</h3>
              <p class="spice-aroma"><strong>Aroma & Flavor Profile:</strong> ${info.aroma}</p>
              <div class="spice-split-info">
                <div class="info-block">
                  <h4>🍳 Traditional Kitchen Role</h4>
                  <p>${info.cookingRole}</p>
                </div>
                <div class="info-block">
                  <h4>🌿 Ancient Ayurvedic Value</h4>
                  <p>${info.ayurveda}</p>
                </div>
              </div>
            </div>
          `;

          if (window.tourismAnalytics && window.tourismAnalytics.trackSpiceExplore) {
            window.tourismAnalytics.trackSpiceExplore(info.name, info.aroma);
          }
        }
      });
    });
  }

  // 5. Recipe Dietary Filter System (on recipes-menu.html)
  const recipeFilterBtns = document.querySelectorAll('.recipe-filter-btn');
  const recipeCards = document.querySelectorAll('.recipe-card');

  if (recipeFilterBtns.length > 0 && recipeCards.length > 0) {
    recipeFilterBtns.forEach(btn => {
      btn.addEventListener('click', function () {
        recipeFilterBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');

        const filter = this.getAttribute('data-diet-filter');

        recipeCards.forEach(card => {
          const diets = card.getAttribute('data-diet')?.split(' ') || [];
          if (filter === 'all' || diets.includes(filter)) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });

        if (window.tourismAnalytics && window.tourismAnalytics.trackRecipeView) {
          window.tourismAnalytics.trackRecipeView(`Filtered by ${filter}`, filter);
        }
      });
    });
  }

  // 6. FAQ Accordion Controllers
  document.querySelectorAll('.faq-question').forEach(questionBtn => {
    questionBtn.addEventListener('click', function () {
      const parent = this.parentElement;
      const isOpen = parent.classList.contains('active');

      // Close all in this accordion
      const container = parent.closest('.faq-list');
      if (container) {
        container.querySelectorAll('.faq-item').forEach(item => item.classList.remove('active'));
      }

      if (!isOpen) {
        parent.classList.add('active');
      }
    });
  });

  // 7. General CTA and WhatsApp Tracking
  document.querySelectorAll('a[href*="wa.me"]').forEach(link => {
    link.addEventListener('click', function () {
      if (window.tourismAnalytics && window.tourismAnalytics.trackWhatsAppClick) {
        window.tourismAnalytics.trackWhatsAppClick(this.getAttribute('data-context') || 'WhatsApp CTA Link');
      }
    });
  });

  document.querySelectorAll('a[href^="tel:"]').forEach(link => {
    link.addEventListener('click', function () {
      if (window.tourismAnalytics && window.tourismAnalytics.trackCallClick) {
        window.tourismAnalytics.trackCallClick();
      }
    });
  });

  document.querySelectorAll('[data-analytics-event]').forEach(btn => {
    btn.addEventListener('click', function () {
      const evt = this.getAttribute('data-analytics-event');
      if (window.trackTourismEvent) {
        window.trackTourismEvent(evt, {
          element_text: this.textContent.trim(),
          element_id: this.id || 'cta_button',
          page: window.location.pathname.split('/').pop() || 'index.html'
        });
      }
    });
  });

  // 8. Toast Feedback Message Helper
  function showToast(message) {
    let toast = document.getElementById('tourismToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'tourismToast';
      toast.className = 'tourism-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3800);
  }
  window.showToast = showToast;

});
