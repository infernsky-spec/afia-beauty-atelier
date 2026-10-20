/**
 * =====================================================================
 * STORE CONFIGURATION TEMPLATE (WHITE-LABEL E-COMMERCE ENGINE)
 * =====================================================================
 * To customize this store for ANY client or product niche:
 * 1. Update the branding details (name, tagline, description).
 * 2. Update the contact details (WhatsApp phone, owner/vendor name).
 * 3. Toggle features on/off depending on what the client sells.
 * 4. Replace or update products in `src/data/products.json`.
 * =====================================================================
 */

export const storeConfig = {
  // Store Identity & Branding
  branding: {
    name: 'AFIA.BEAUTY',
    namePrefix: 'AFIA',
    nameSuffix: '.BEAUTY',
    tagline: 'Oriflame Independent Atelier',
    shortDescription: 'Swedish Science & Haute Parfumerie (Givaudan Co-Lab)',
    seoTitle: 'Afia Beauty | Swedish Formulations & Niche Fragrance Atelier',
    seoDescription: 'Official Q4 E-Catalogue Collection: Luxury Scandinavian perfumes, cellular skincare routines, and makeup formulations.',
    badge: 'Q4 2026 E-CATALOGUE',
    catalogEdition: 'October – December Collection',
    catalogPagesCount: 40,
    originStory: 'Authentic Scandinavian beauty formulas co-created with world-renowned master perfumers and dermatologists.',
    defaultTheme: 'dark', // 'dark' (pure black OLED) or 'light' (warm champagne)
  },

  // Owner / Consultant / Business Contact
  contact: {
    ownerName: 'Afia Mensah',
    ownerTitle: 'Certified Beauty Consultant',
    phone: '233240000000', // International format without '+' (e.g. 233... for Ghana, 234... for Nigeria, 1... for US)
    formattedPhone: '+233 24 000 0000',
    email: 'concierge@afiabeauty.com',
    location: 'Accra Metro, Ghana',
    partnerId: 'GH-2026-981',
    whatsappGreeting: "Hello! I'm browsing your storefront and would like to order or request a personalized consultation.",
    voiceNoteGreeting: "Hi there! Welcome to our Swedish Atelier. Need shade matching or Novage+ advice? Send me a quick voice note!",
  },

  // Localization & Multi-Currency Settlement
  currencies: {
    default: 'GHS',
    supported: {
      GHS: { symbol: 'GH₵', rate: 1.0, label: 'Ghana Cedi' },
      NGN: { symbol: '₦', rate: 105.0, label: 'Nigerian Naira' },
      USD: { symbol: '$', rate: 0.065, label: 'US Dollar' }
    }
  },

  // Modular Feature Toggles (Turn on/off based on what the client sells)
  features: {
    enablePureBlackDarkMode: true,      // OLED Pure Black toggle
    enable3DCarousel: true,             // Interactive 3D CSS Perspective Carousel
    enableVirtualTryOn: true,           // AR Camera live mirror / makeup shade tester
    enableRoutineBuilder: true,         // 4-step vanity routine builder with bundle discount
    enableSkinDiagnostic: true,         // 3-phase interactive skincare recommendation wizard
    enableScentFinder: true,            // Olfactory pyramid fragrance finder
    enableVoiceConcierge: true,         // Floating simulated audio voice note concierge
    enableWhatsAppCheckout: true,       // 1-click formatted order dispatch to WhatsApp
    enableMomoUSSD: true,               // Automated USSD Mobile Money payment simulation
    enableVipWholesale: true,           // VIP wholesale discount toggle (-20%)
    enableAffiliateReferrals: true,     // Multi-tenant consultant link generator (?consultant=...&phone=...)
    enableCatalogueModal: true,         // Flipbook / PDF catalog page browser
  },

  // Hero Section Customization
  hero: {
    eyebrow: 'An Oriflame First • In Co-Lab with Givaudan',
    headlineMain: 'The Art of Sensation,',
    headlineAccent: 'Pure Swedish Elegance.',
    description: 'Explore the official October – December 2026 E-Catalogue. Featuring rare artisanal niche fragrances co-created with Givaudan Paris, Novage+ bio-cellular skincare, and daily Wellosophy nutrition.',
    primaryButton: {
      label: 'Shop Niche Fragrance',
      targetCategory: 'Fragrance'
    },
    secondaryButton: {
      label: 'Browse E-Catalogue PDF',
      action: 'openCatalogue'
    },
    heroImage: '/catalog/page_1.jpg',
    trustBadges: [
      {
        title: '100% Authentic',
        subtitle: 'Certified Formulations'
      },
      {
        title: 'Official Partner',
        subtitle: 'Ghana & Nigeria'
      },
      {
        title: 'Swift Delivery',
        subtitle: 'Accra & Lagos'
      }
    ]
  },

  // 3D Carousel Section
  carousel: {
    badge: 'Interactive 3D Gallery',
    title: 'Curated Icons & Haute Formulations',
    subtitle: 'Swipe or rotate through the star highlights of our exclusive collection.',
    featuredProductIds: [
      'top-scents-rose-mode',
      'novage-restore-routine',
      'giordani-gold-man',
      'the-one-pump-plump-mascara',
      'love-potion-body-cream',
      'novage-intense-capsules',
      'milk-honey-sugar-scrub'
    ]
  },

  // VIP Wholesale Tier Settings
  wholesale: {
    discountPercent: 20,
    badgeText: 'VIP Wholesale -20%',
    bannerText: 'VIP Wholesale Rates Active: 20% Discount Automatically Applied to Every Product'
  },

  // Vanity Routine Builder Settings
  routineBuilder: {
    discountPercent: 15,
    title: '4-Step Haute Vanity Routine Builder',
    subtitle: 'Select one formulation per ritual step to unlock automated 15% bundle savings'
  },

  // Delivery & Fulfillment Info
  shipping: {
    deliveryHubs: ['Accra Metro', 'Kumasi Central', 'Takoradi / Cape Coast', 'Lagos Hub (Ikeja/VI)', 'Abuja FCT', 'Nationwide Courier'],
    standardDeliveryTimeline: '24 – 48 Hours',
    freeShippingThresholdGHS: 1200
  }
};

export default storeConfig;
