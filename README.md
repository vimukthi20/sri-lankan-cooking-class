# Ayubowan Traditional Sri Lankan Cooking Class
**Tourism Analytics Group Project — Sri Lanka Cultural Food Experience**

> A responsive, multi-page cultural tourism website promoting traditional food experiences for international tourists interested in Sri Lankan culture, integrated with Google Tag Manager (GTM), Google Analytics 4 (GA4), and Meta Pixel tracking.

---

## 🌟 Project Overview

This website was engineered for the **Tourism Analytics Group Project: Developing and Implementing a Tourism Analytics System (100 Marks)**:
- **Task 01 — Tourism Website Architecture:** Multi-page website showcasing authentic village culinary traditions, open wood-fired clay hearths (*lipa*), granite grinding stones (*miris gala*), organic spice tours, and banana leaf feasts.
- **Task 02 — Digital Tracking Implementation:** Full integration of GTM dataLayer events, GA4 enhanced ecommerce and custom events, and Meta Pixel conversion events.
- **Task 03 — Visitor Data Analysis & Insights:** Built-in session simulator and CSV exporter for live demonstration and report charts.
- **Task 04 — Data-Driven Marketing Campaign:** Targeted multi-channel strategy (Meta Ads, Google Search Ads, TikTok ASMR reels) targeting culinary tourists and Slow Food travelers.

---

## 📁 Project Structure

```
Cooking class/
├── index.html                     # Homepage (Hero, Experience Pillars, Spice Explorer, Reviews)
├── cooking-classes.html           # Classes & Packages (4 Packages, Pricing, Comparison Matrix)
├── traditional-experience.html    # Village Heritage (Clay Hearth, Stone Grinding, Ayurveda, Chefs)
├── recipes-menu.html              # Authentic Recipes (Dietary Filters, Ingredients, Step-by-Step)
├── contact.html                   # Reservations, WhatsApp Chat, Hotel Pickup, Directions & FAQs
├── ANALYTICS_SETUP_GUIDE.md       # Complete 100-Mark Written Report & Presentation Guide
├── README.md                      # Project Overview and Documentation
└── assets/
    ├── css/
    │   └── styles.css             # Design system, culinary color palette, responsive styles
    ├── js/
    │   ├── analytics-config.js    # GTM, GA4, Meta Pixel IDs and currency exchange rates
    │   ├── analytics-tracker.js   # Event dispatcher, GTM dataLayer, Live Inspector & CSV Exporter
    │   └── main.js                # Interactive UI, dynamic currency converter, modals, filters
    └── images/
        ├── hero-cooking-class.jpg            # Outdoor garden kitchen with tourists & chef
        ├── clay-pot-cooking.jpg              # Simmering curry in terracotta pot on firewood hearth
        ├── spice-grinding-stone.jpg          # Traditional Miris Gala granite grinding slab
        ├── village-rice-curry-feast.jpg      # 7-curry spread served on green banana leaf
        ├── hoppers-street-food.jpg           # Egg hoppers bubbling in round pans over open flame
        ├── organic-farm-harvest.jpg          # Tourists harvesting fresh spices in village garden
        ├── coconut-scraping-masterclass.jpg  # Traditional Hiramanaya wooden scraping stool
        └── spices-market-display.jpg         # Ceylon cinnamon, goraka, turmeric & spices flatlay
```

---

## 🚀 How to Run the Website Locally

Since the application is built using pure **HTML5**, **CSS3**, and **Vanilla JavaScript**, no installation, build steps, or package managers are required!

### Option 1: Double Click
Simply double-click on `index.html` in Windows Explorer to open it in any web browser (Chrome, Edge, Firefox, Brave).

### Option 2: Local HTTP Server (Optional)
If using VS Code / Python / Node:
```powershell
# Using Python
python -m http.server 8080

# Or using Node npx
npx serve .
```
Then visit `http://localhost:8080` in your browser.

---

## 📊 Analytics Live Inspector (For Class Presentation)

Every page has a floating **Analytics Live** button in the bottom-right corner:
1. Click **Analytics Live** to open the real-time event inspector.
2. Click **⚡ Simulate 20 Tourist Sessions** to populate realistic tourist sessions, page views, package clicks, WhatsApp queries, and booking submissions on the spot.
3. Click **📥 Export CSV** to download visitor interaction data directly into an Excel/CSV spreadsheet for the written report.

---

## 📋 Assessment Alignment
- **Written Report (60 Marks):** See [ANALYTICS_SETUP_GUIDE.md](file:///c:/Users/User/Desktop/Cooking%20class/ANALYTICS_SETUP_GUIDE.md) for full sections corresponding to Task 01, 02, 03, and 04.
- **Group Presentation (40 Marks):** Use the website live in your browser and demonstrate the real-time Analytics Inspector and conversion funnels!
