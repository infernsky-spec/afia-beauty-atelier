# 🌟 Ultimate E-Commerce Template & Client Customization Guide

This project is a **production-ready, white-label e-commerce template** crafted with React 19, Tailwind CSS v4, and Vite. It is pre-configured with luxury aesthetics, pure black OLED dark mode, 3D interactive product carousels, mobile navigation, AR virtual try-on, multi-currency conversion, and automated WhatsApp order dispatch.

---

## ⚡ How to Set Up This Store for Any Client in 3 Minutes

All store settings, vendor contacts, branding, and feature toggles live in **one single file**:
📁 [`store/src/config/store.config.js`](store/src/config/store.config.js)

### Step 1: Update Store Branding
Edit `branding` in [`store/src/config/store.config.js`](store/src/config/store.config.js):
```javascript
branding: {
  name: 'CLIENT_BRAND',
  namePrefix: 'CLIENT',
  nameSuffix: '.STORE',
  tagline: 'Your Custom Tagline Here',
  shortDescription: 'Short summary displayed in the header',
  badge: 'NEW ARRIVALS 2026',
  defaultTheme: 'dark', // 'dark' (pure black OLED) or 'light'
}
```

### Step 2: Set Client Contact & WhatsApp Dispatch
Edit `contact` in [`store/src/config/store.config.js`](store/src/config/store.config.js):
```javascript
contact: {
  ownerName: 'Client Name',
  ownerTitle: 'Store Owner / Brand Ambassador',
  phone: '233240000000', // Client WhatsApp number in international format without '+'
  formattedPhone: '+233 24 000 0000',
  email: 'orders@clientbrand.com',
  location: 'Accra, Ghana',
  whatsappGreeting: "Hello! I am browsing your store and would like to place an order.",
  voiceNoteGreeting: "Hi there! Welcome to our store. Need assistance? Send me a quick voice note!"
}
```

### Step 3: Toggle Features On or Off
Depending on what the client sells (e.g. fashion vs. cosmetics vs. tech), enable or disable features with simple booleans:
```javascript
features: {
  enablePureBlackDarkMode: true,      // Pure Black OLED dark mode
  enable3DCarousel: true,             // Interactive 3D CSS perspective carousel
  enableVirtualTryOn: false,          // Turn false if not selling makeup/sunglasses
  enableRoutineBuilder: false,        // Turn true if client sells multi-step product bundles
  enableSkinDiagnostic: false,        // Skincare quiz (disable for fashion/electronics)
  enableScentFinder: false,           // Fragrance finder (disable if not perfumes)
  enableVoiceConcierge: true,         // Floating audio note player & hotline
  enableWhatsAppCheckout: true,       // 1-click formatted order dispatch to WhatsApp
  enableMomoUSSD: true,               // Mobile Money settlement simulation (MTN/Telecel/AT)
  enableVipWholesale: true,           // Wholesale -20% VIP customer toggle
  enableAffiliateReferrals: true,     // Multi-tenant consultant link generator (?consultant=...)
  enableCatalogueModal: true,         // PDF catalog / lookbook viewer
}
```

### Step 4: Add Client Products
Replace or edit items in [`store/src/data/products.json`](store/src/data/products.json).
Each product takes:
- `id`: unique slug (e.g. `"silk-dress"`)
- `name`: product title
- `category`: main category
- `priceGHS`: price in base currency
- `image`: URL or path to image (in `store/public/` or external HTTPS link)
- `description`: item description

---

## 🚀 Deployment

### Push to GitHub
```bash
git add .
git commit -m "chore: customize store for client"
git push origin main
```

### Deploy to Vercel
1. Go to [vercel.com/new](https://vercel.com/new).
2. Select your repository.
3. Click **Deploy** (the included `vercel.json` configures everything automatically).
