/**
 * SRI LANKAN COOKING CLASS — INTEGRATED TOURISM ANALYTICS TRACKER
 * Full implementation for:
 * 1. Google Tag Manager (GTM dataLayer events)
 * 2. Google Analytics 4 (GA4 standard, enhanced ecommerce & custom events)
 * 3. Meta Pixel (Facebook Pixel standard & custom conversion events)
 * 4. Real-time Live Event Inspector, Session Simulator & CSV/JSON Exporter
 */

(function () {
  'use strict';

  // 1. Initialize dataLayer for Google Tag Manager
  window.dataLayer = window.dataLayer || [];

  function pushDataLayer(payload) {
    window.dataLayer.push(payload);
  }

  // 2. Initialize Google Analytics 4 (gtag.js wrapper)
  window.gtag = window.gtag || function () {
    window.dataLayer.push(arguments);
  };
  gtag('js', new Date());
  if (window.ANALYTICS_CONFIG && window.ANALYTICS_CONFIG.ga4Id) {
    gtag('config', window.ANALYTICS_CONFIG.ga4Id, {
      send_page_view: false // Managed customly for granular event inspection
    });
  }

  // 3. Initialize Meta Pixel wrapper
  window.fbq = window.fbq || function () {
    (window.fbq.q = window.fbq.q || []).push(arguments);
  };
  window.fbq.loaded = true;
  window.fbq.version = '2.0';

  // In-memory event stream for student presentations and written report data export
  window.tourismAnalyticsLog = JSON.parse(sessionStorage.getItem('cooking_analytics_logs') || '[]');

  /**
   * Central Tracking Dispatcher
   * Broadcasts to GTM dataLayer, GA4 gtag, and Meta Pixel fbq
   */
  function trackTourismEvent(eventName, params = {}, metaPixelEvent = null) {
    const now = new Date();
    const timestamp = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const eventRecord = {
      id: Date.now() + Math.random().toString(36).substring(2, 6),
      time: timestamp,
      isoTime: now.toISOString(),
      event: eventName,
      params: params,
      platforms: ['GTM dataLayer', 'GA4 gtag', 'Meta Pixel']
    };

    // 1. Push to Google Tag Manager dataLayer
    pushDataLayer({
      event: eventName,
      timestamp: now.toISOString(),
      ...params
    });

    // 2. Dispatch to Google Analytics 4
    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, params);
    }

    // 3. Dispatch to Meta Pixel
    if (typeof window.fbq === 'function') {
      if (metaPixelEvent) {
        window.fbq('track', metaPixelEvent, params);
      } else {
        window.fbq('trackCustom', eventName, params);
      }
    }

    // 4. Save to session storage & memory
    window.tourismAnalyticsLog.unshift(eventRecord);
    if (window.tourismAnalyticsLog.length > 150) {
      window.tourismAnalyticsLog.pop();
    }
    sessionStorage.setItem('cooking_analytics_logs', JSON.stringify(window.tourismAnalyticsLog));

    // 5. Update Live UI Inspector if active
    updateInspectorUI();

    // 6. Console log for development & inspection
    if (window.ANALYTICS_CONFIG && window.ANALYTICS_CONFIG.debugMode) {
      console.log(
        `%c[Tourism Analytics Fired] %c${eventName}`,
        'color: #d9531e; font-weight: bold; background: #fff2ed; padding: 2px 6px; border-radius: 4px;',
        'color: #2d6a4f; font-weight: bold;',
        params
      );
    }
  }

  window.trackTourismEvent = trackTourismEvent;

  // Specific event dispatchers
  window.tourismAnalytics = {
    // Page View
    trackPageView: function (pageCategory) {
      trackTourismEvent('page_view', {
        page_title: document.title,
        page_location: window.location.href,
        page_path: window.location.pathname.split('/').pop() || 'index.html',
        tourism_category: pageCategory || 'Culinary Experience'
      }, 'PageView');
    },

    // View Class Package
    trackViewItem: function (item) {
      trackTourismEvent('view_item', {
        item_id: item.id || 'class_item',
        item_name: item.name,
        item_category: item.category || 'Cooking Class Package',
        price: item.price,
        currency: item.currency || 'LKR',
        duration: item.duration || '3 Hours'
      }, 'ViewContent');
    },

    // Select/Click Class Booking
    trackSelectItem: function (item) {
      trackTourismEvent('select_item', {
        item_id: item.id || 'class_item',
        item_name: item.name,
        price: item.price,
        currency: item.currency || 'LKR'
      }, 'ViewContent');
    },

    // Generate Lead (Form submission)
    trackLead: function (leadData) {
      trackTourismEvent('generate_lead', {
        package_name: leadData.packageName || 'General Class Inquiry',
        lead_type: leadData.leadType || 'Class Booking Form',
        guest_count: leadData.guests || 2,
        preferred_date: leadData.date || 'Flexible',
        dietary_preference: leadData.dietary || 'Standard',
        estimated_value: leadData.estimatedValue || 17000,
        currency: 'LKR',
        inquiry_source: leadData.source || 'Website Modal'
      }, 'Lead');
    },

    // Direct WhatsApp Click
    trackWhatsAppClick: function (context) {
      trackTourismEvent('whatsapp_click', {
        contact_type: 'Direct WhatsApp Chat',
        intent: context || 'Culinary Tour Inquiry',
        page: window.location.pathname.split('/').pop() || 'index.html'
      }, 'Contact');
    },

    // Call Click
    trackCallClick: function () {
      trackTourismEvent('phone_call_click', {
        contact_type: 'Direct Telephone Call',
        page: window.location.pathname.split('/').pop() || 'index.html'
      }, 'Contact');
    },

    // CTA Button Click
    trackCtaClick: function (ctaText, location) {
      trackTourismEvent('click_cta', {
        cta_text: ctaText,
        cta_location: location || 'Page Body',
        page: window.location.pathname.split('/').pop() || 'index.html'
      });
    },

    // Spice Explorer Interaction
    trackSpiceExplore: function (spiceName, flavorProfile) {
      trackTourismEvent('explore_spice', {
        spice_name: spiceName,
        flavor_profile: flavorProfile,
        engagement_type: 'Cultural Interactive Element'
      });
    },

    // Recipe View / Filter Interaction
    trackRecipeView: function (recipeName, recipeCategory) {
      trackTourismEvent('view_recipe', {
        recipe_name: recipeName,
        dietary_tag: recipeCategory,
        content_type: 'Traditional Culinary Content'
      });
    },

    // Currency Switcher Engagement
    trackCurrencyChange: function (currencyKey) {
      trackTourismEvent('currency_change', {
        selected_currency: currencyKey,
        base_currency: 'LKR'
      });
    }
  };

  /**
   * Automatic Scroll Depth Tracking (25%, 50%, 75%, 90%)
   */
  const trackedDepths = { 25: false, 50: false, 75: false, 90: false };
  window.addEventListener('scroll', throttle(function () {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollHeight <= 0) return;
    const scrollPercent = Math.round((window.scrollY / scrollHeight) * 100);

    [25, 50, 75, 90].forEach(depth => {
      if (scrollPercent >= depth && !trackedDepths[depth]) {
        trackedDepths[depth] = true;
        trackTourismEvent(`scroll_depth_${depth}`, {
          scroll_percentage: depth,
          page: window.location.pathname.split('/').pop() || 'index.html'
        });
      }
    });
  }, 300));

  function throttle(func, limit) {
    let inThrottle;
    return function () {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  /**
   * On-Page Live Analytics Inspector Component
   * Designed for Group Presentations (Task 02/03) & Lecturer Demonstration
   */
  function createInspectorDOM() {
    if (document.getElementById('tourismAnalyticsInspector')) return;

    const inspector = document.createElement('div');
    inspector.id = 'tourismAnalyticsInspector';
    inspector.className = 'analytics-inspector';
    inspector.innerHTML = `
      <div class="inspector-toggle-btn" id="inspectorToggleBtn" title="Open Tourism Analytics Live Inspector">
        <span class="pulse-dot"></span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 20V10M12 20V4M6 20v-6"/>
        </svg>
        <span class="inspector-badge-count" id="inspectorEventCount">0</span>
        <span class="inspector-btn-label">Analytics Live</span>
      </div>

      <div class="inspector-panel" id="inspectorPanel">
        <div class="inspector-header">
          <div class="inspector-title">
            <span class="pulse-dot"></span>
            <div>
              <strong>Tourism Analytics Live Inspector</strong>
              <small>GTM • GA4 • Meta Pixel Real-time Stream</small>
            </div>
          </div>
          <button class="inspector-close-btn" id="inspectorCloseBtn" aria-label="Close Inspector">&times;</button>
        </div>

        <div class="inspector-config-bar">
          <div class="config-pill"><span class="lbl">GTM:</span> <code id="dispGtmId">${window.ANALYTICS_CONFIG.gtmId}</code></div>
          <div class="config-pill"><span class="lbl">GA4:</span> <code id="dispGa4Id">${window.ANALYTICS_CONFIG.ga4Id}</code></div>
          <div class="config-pill"><span class="lbl">Pixel:</span> <code id="dispPixelId">${window.ANALYTICS_CONFIG.metaPixelId}</code></div>
        </div>

        <div class="inspector-actions">
          <button class="btn-action" id="btnSimulateSessions" title="Populate with realistic tourist sessions for project report">
            ⚡ Simulate 20 Tourist Sessions
          </button>
          <button class="btn-action btn-export" id="btnExportCSV" title="Download CSV for assignment report analysis">
            📥 Export CSV
          </button>
          <button class="btn-action btn-clear" id="btnClearLogs" title="Clear event stream">
            🗑️ Clear
          </button>
        </div>

        <div class="inspector-tabs">
          <button class="tab-btn active" data-filter="all">All Events (<span id="tabCountAll">0</span>)</button>
          <button class="tab-btn" data-filter="leads">Leads & Bookings (<span id="tabCountLeads">0</span>)</button>
          <button class="tab-btn" data-filter="views">Views & Items (<span id="tabCountViews">0</span>)</button>
          <button class="tab-btn" data-filter="interactions">Interactions (<span id="tabCountInteractions">0</span>)</button>
        </div>

        <div class="inspector-stream" id="inspectorStream">
          <div class="inspector-empty">No analytics events captured yet. Navigate or interact with the site to see real-time triggers!</div>
        </div>

        <div class="inspector-footer">
          <span>Task 02 & 03: Data Collection & Presentation Tool</span>
          <a href="ANALYTICS_SETUP_GUIDE.md" target="_blank" class="inspector-guide-link">View Setup Guide ↗</a>
        </div>
      </div>
    `;

    document.body.appendChild(inspector);
    attachInspectorEvents();
    updateInspectorUI();
  }

  let activeFilter = 'all';

  function attachInspectorEvents() {
    const toggleBtn = document.getElementById('inspectorToggleBtn');
    const panel = document.getElementById('inspectorPanel');
    const closeBtn = document.getElementById('inspectorCloseBtn');
    const clearBtn = document.getElementById('btnClearLogs');
    const exportBtn = document.getElementById('btnExportCSV');
    const simBtn = document.getElementById('btnSimulateSessions');

    if (toggleBtn && panel) {
      toggleBtn.addEventListener('click', () => {
        panel.classList.toggle('open');
      });
    }

    if (closeBtn && panel) {
      closeBtn.addEventListener('click', () => {
        panel.classList.remove('open');
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        window.tourismAnalyticsLog = [];
        sessionStorage.removeItem('cooking_analytics_logs');
        updateInspectorUI();
      });
    }

    if (exportBtn) {
      exportBtn.addEventListener('click', exportAnalyticsCSV);
    }

    if (simBtn) {
      simBtn.addEventListener('click', simulateTouristTraffic);
    }

    // Filter tabs
    const tabBtns = document.querySelectorAll('.inspector-tabs .tab-btn');
    tabBtns.forEach(btn => {
      btn.addEventListener('click', function () {
        tabBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        activeFilter = this.getAttribute('data-filter');
        renderEventList();
      });
    });
  }

  function updateInspectorUI() {
    const countBadge = document.getElementById('inspectorEventCount');
    const stream = document.getElementById('inspectorStream');
    if (!countBadge || !stream) return;

    const logs = window.tourismAnalyticsLog || [];
    countBadge.textContent = logs.length;

    // Update tab counts
    const leadsCount = logs.filter(l => l.event === 'generate_lead' || l.event === 'whatsapp_click').length;
    const viewsCount = logs.filter(l => l.event === 'page_view' || l.event === 'view_item' || l.event === 'select_item').length;
    const interCount = logs.filter(l => l.event.startsWith('scroll_') || l.event === 'click_cta' || l.event === 'explore_spice').length;

    const allEl = document.getElementById('tabCountAll');
    const leadsEl = document.getElementById('tabCountLeads');
    const viewsEl = document.getElementById('tabCountViews');
    const intersEl = document.getElementById('tabCountInteractions');

    if (allEl) allEl.textContent = logs.length;
    if (leadsEl) leadsEl.textContent = leadsCount;
    if (viewsEl) viewsEl.textContent = viewsCount;
    if (intersEl) intersEl.textContent = interCount;

    renderEventList();
  }

  function renderEventList() {
    const stream = document.getElementById('inspectorStream');
    if (!stream) return;

    const logs = window.tourismAnalyticsLog || [];
    let filtered = logs;

    if (activeFilter === 'leads') {
      filtered = logs.filter(l => l.event === 'generate_lead' || l.event === 'whatsapp_click');
    } else if (activeFilter === 'views') {
      filtered = logs.filter(l => l.event === 'page_view' || l.event === 'view_item' || l.event === 'select_item');
    } else if (activeFilter === 'interactions') {
      filtered = logs.filter(l => l.event.startsWith('scroll_') || l.event === 'click_cta' || l.event === 'explore_spice' || l.event === 'currency_change');
    }

    if (filtered.length === 0) {
      stream.innerHTML = `<div class="inspector-empty">No events match filter "${activeFilter}".</div>`;
      return;
    }

    let html = '';
    filtered.forEach(record => {
      let badgeClass = 'tag-event';
      if (record.event === 'generate_lead' || record.event === 'whatsapp_click') badgeClass += ' tag-lead';
      else if (record.event === 'view_item' || record.event === 'select_item') badgeClass += ' tag-ecommerce';
      else if (record.event === 'page_view') badgeClass += ' tag-pageview';
      else if (record.event.startsWith('scroll_')) badgeClass += ' tag-scroll';

      const paramsJson = JSON.stringify(record.params, null, 2);

      html += `
        <div class="stream-item">
          <div class="stream-item-header">
            <span class="${badgeClass}">${escapeHtml(record.event)}</span>
            <span class="stream-time">${record.time}</span>
          </div>
          <div class="stream-destinations">
            <span>GTM dataLayer</span> • <span>GA4 gtag</span> • <span>Meta Pixel</span>
          </div>
          <pre class="stream-params">${escapeHtml(paramsJson)}</pre>
        </div>
      `;
    });

    stream.innerHTML = html;
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /**
   * CSV Exporter for Report Generation (Task 03)
   */
  function exportAnalyticsCSV() {
    const logs = window.tourismAnalyticsLog || [];
    if (logs.length === 0) {
      alert('No analytics events captured yet to export. Simulate sessions or browse the website first!');
      return;
    }

    let csv = 'Record_ID,Timestamp,ISO_Time,Event_Name,Package_or_Target,Price_LKR,Estimated_Value,Dietary_or_Details,Platforms\n';

    logs.forEach(rec => {
      const p = rec.params || {};
      const target = p.package_name || p.item_name || p.page_title || p.spice_name || p.recipe_name || p.cta_text || '';
      const price = p.price || '';
      const estVal = p.estimated_value || '';
      const details = p.dietary_preference || p.lead_type || p.intent || p.selected_currency || '';
      const platforms = rec.platforms ? rec.platforms.join(' | ') : 'GTM/GA4/Meta';

      csv += `"${rec.id}","${rec.time}","${rec.isoTime}","${rec.event}","${target.replace(/"/g, '""')}","${price}","${estVal}","${details.replace(/"/g, '""')}","${platforms}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sri-lankan-cooking-class-analytics-${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  /**
   * Simulated Tourist Traffic Generator (Task 03 & Presentation Demo)
   */
  function simulateTouristTraffic() {
    const packages = [
      { id: 'pkg-village-masterclass', name: 'Village Rice & Curry Masterclass', price: 8500 },
      { id: 'pkg-spice-trail-farm', name: 'Golden Spice & Organic Farm Tour + Cooking', price: 14500 },
      { id: 'pkg-street-food-hoppers', name: 'Hoppers, Rotti & Street Food Evening Safari', price: 9500 },
      { id: 'pkg-ayurvedic-kitchen', name: 'Ayurvedic Healing & Plant-Based Culinary Retreat', price: 12000 }
    ];

    const touristOrigins = ['United Kingdom', 'Germany', 'Australia', 'France', 'United States', 'Netherlands'];
    const dietaryPrefs = ['Vegan', 'Vegetarian', 'Gluten-Free', 'Halal-friendly', 'Mild Spice for Children', 'Standard Country'];

    let count = 0;
    const interval = setInterval(() => {
      count++;
      const randPkg = packages[Math.floor(Math.random() * packages.length)];
      const randOrigin = touristOrigins[Math.floor(Math.random() * touristOrigins.length)];
      const randDiet = dietaryPrefs[Math.floor(Math.random() * dietaryPrefs.length)];
      const actionType = Math.random();

      if (actionType < 0.35) {
        // Page view & item view
        trackTourismEvent('page_view', {
          page_title: 'Cooking Classes & Packages | Sri Lankan Culinary Village',
          visitor_origin: randOrigin,
          simulated_session: true
        }, 'PageView');
        trackTourismEvent('view_item', {
          item_id: randPkg.id,
          item_name: randPkg.name,
          price: randPkg.price,
          currency: 'LKR',
          visitor_origin: randOrigin
        }, 'ViewContent');
      } else if (actionType < 0.65) {
        // CTA & Select item
        trackTourismEvent('select_item', {
          item_id: randPkg.id,
          item_name: randPkg.name,
          price: randPkg.price,
          currency: 'LKR',
          visitor_origin: randOrigin
        }, 'ViewContent');
        trackTourismEvent('scroll_depth_75', {
          scroll_percentage: 75,
          page: 'cooking-classes.html'
        });
      } else if (actionType < 0.85) {
        // WhatsApp Click
        trackTourismEvent('whatsapp_click', {
          contact_type: 'Direct WhatsApp Chat',
          intent: `Inquiry for ${randPkg.name}`,
          visitor_country: randOrigin
        }, 'Contact');
      } else {
        // Complete Lead conversion
        const guests = Math.floor(Math.random() * 4) + 1;
        trackTourismEvent('generate_lead', {
          package_name: randPkg.name,
          lead_type: 'Website Booking Reservation',
          guest_count: guests,
          dietary_preference: randDiet,
          estimated_value: randPkg.price * guests,
          currency: 'LKR',
          visitor_country: randOrigin
        }, 'Lead');
      }

      if (count >= 18) {
        clearInterval(interval);
      }
    }, 180);
  }

  // Initialize Inspector once DOM is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createInspectorDOM);
  } else {
    createInspectorDOM();
  }

})();
