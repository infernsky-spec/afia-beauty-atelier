# AFIA — Haute Parfumerie & Novage+ Dermal Science (Q4 2026 Atelier)

A modern, high-conversion luxury beauty commerce platform created from the **2026.Oct-Dec E-Catalogue .pdf**. Tailored for independent Oriflame beauty consultants across West Africa (Ghana & Nigeria).

---

## 🎨 Dual Luxury Themes: Pure Black & Warm Champagne

- **Pure Black OLED Dark Mode (`#000000`)**: Deep black background, frosted glass surfaces, metallic golden accents (`#DEB573`), and crisp contrast.
- **Warm Luxury Light Mode**: Cream champagne background (`#FAF6F0`), soft rose dust glows, and warm honey-gold highlights.
- **Toggle**: Switch effortlessly between Pure Black and Light modes using the header toggle (persisted in `localStorage`).
- **Tailwind v4 Setup**: Uses selector-based `@custom-variant dark (&:where(.dark, .dark *));` to guarantee instant theme switching.

---

## 🚀 Key Features Implemented

1. **✨ 3D Interactive Masterpiece Carousel** ([`ThreeDCarousel.jsx`](file:///C:/Users/Frank/OneDrive/Desktop/Afia/store/src/components/ThreeDCarousel.jsx)):
   - Uses CSS 3D transforms (`perspective: 1200px`, `rotateY`, `translateZ`, `translateX`) to rotate star products in three-dimensional space with perspective scaling and auto-rotation.

2. **📸 AR Virtual Shade Try-On** ([`VirtualTryOnModal.jsx`](file:///C:/Users/Frank/OneDrive/Desktop/Afia/store/src/components/VirtualTryOnModal.jsx)):
   - Live camera face-cam with fallback to a high-fashion studio model.
   - Test shades (*Dulce de Leche*, *Mango Glow*, *Raspberry Cream*, *Midnight Berry*, *Onyx Black Mascara*) with saturation slider and 1-click acquisition.

3. **🎙️ Interactive Voice Concierge & Audio Note Hotline** ([`VoiceConciergeWidget.jsx`](file:///C:/Users/Frank/OneDrive/Desktop/Afia/store/src/components/VoiceConciergeWidget.jsx)):
   - Floating audio widget with interactive soundwave visualizer playing an audio greeting from the consultant.
   - 1-click button to start an instant voice consultation via WhatsApp.

4. **🧴 4-Step Vanity Routine Builder (-15% Discount)** ([`RoutineBuilderModal.jsx`](file:///C:/Users/Frank/OneDrive/Desktop/Afia/store/src/components/RoutineBuilderModal.jsx)):
   - Interactive regimen builder: Step 1 (Cleanse) $\rightarrow$ Step 2 (Target) $\rightarrow$ Step 3 (Activate) $\rightarrow$ Step 4 (Lock).
   - Automatically calculates a 15% bundle savings and adds all 4 items to the bag with one click.

5. **🔗 Multi-Consultant Referral & Affiliate Engine** ([`ConsultantAffiliateModal.jsx`](file:///C:/Users/Frank/OneDrive/Desktop/Afia/store/src/components/ConsultantAffiliateModal.jsx)):
   - Any distributor can enter their name and WhatsApp number to generate a customized shareable URL (e.g. `?consultant=Blessing&phone=2348012345678`).
   - Automatically routes all order dispatches and cart inquiries directly to that specific consultant's phone!

6. **📱 Automated Mobile Money (MoMo) USSD Prompt Flow** ([`CartDrawer.jsx`](file:///C:/Users/Frank/OneDrive/Desktop/Afia/store/src/components/CartDrawer.jsx)):
   - Supports **MTN Mobile Money**, **Telecel Cash (Vodafone)**, **AT Money (AirtelTigo)**, and **Paystack Card/Bank Transfer**.
   - Features a live simulated USSD prompt countdown ("Authorize on your phone"), verified transaction references (`TXN-MOMO-XXXXXX`), and official settlement receipts.

7. **📱 PWA (Progressive Web App) Installable Store**:
   - `manifest.json` and `sw.js` configured with offline asset caching for instant mobile app installation on Android and iOS.

---

## 🏃‍♂️ Running the Project

```powershell
# Navigate to store
cd store

# Development server
npm run dev

# Production build
npm run build
```

Open in browser: [http://localhost:5173/](http://localhost:5173/)
