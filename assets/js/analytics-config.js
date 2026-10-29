/**
 * SRI LANKAN COOKING CLASS — TOURISM ANALYTICS CONFIGURATION
 * Tourism Analytics Group Project
 * 
 * Instructions for Students:
 * You can either customize default IDs below, or update them interactively
 * in your browser via the floating "Analytics Live Inspector"!
 */

const ANALYTICS_CONFIG = {
  // Website Brand & Product Identity
  productName: 'Ayubowan Traditional Sri Lankan Cooking Class',
  productCategory: 'Culinary Tourism & Cultural Food Experience',
  productLocation: 'Cultural Triangle & Spice Belt, Sri Lanka',

  // Google Tag Manager (GTM) Container ID (Format: GTM-XXXXXXX)
  gtmId: localStorage.getItem('cooking_gtm_id') || 'GTM-MTSWL2MT',

  // Google Analytics 4 (GA4) Measurement ID (Format: G-XXXXXXXXXX)
  ga4Id: localStorage.getItem('cooking_ga4_id') || 'G-36381XK1G9',

  // Meta Pixel (Facebook Pixel) ID (15-16 digit numeric ID)
  metaPixelId: localStorage.getItem('cooking_meta_pixel_id') || '4918273645019283',

  // Debug & Live Inspector mode (captures and displays all events on-page)
  debugMode: true,

  // Currency exchange rates (base LKR)
  currencies: {
    LKR: { symbol: 'LKR ', rate: 1, name: 'Sri Lankan Rupee' },
    USD: { symbol: '$', rate: 0.0033, name: 'US Dollar' },
    EUR: { symbol: '€', rate: 0.0030, name: 'Euro' },
    GBP: { symbol: '£', rate: 0.0026, name: 'British Pound' },
    AUD: { symbol: 'A$', rate: 0.0051, name: 'Australian Dollar' }
  }
};

window.ANALYTICS_CONFIG = ANALYTICS_CONFIG;
