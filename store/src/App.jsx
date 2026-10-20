import React, { useState, useEffect, useMemo } from 'react';
import productsData from './data/products.json';
import storeConfig from './config/store.config';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ThreeDCarousel from './components/ThreeDCarousel';
import CategoryNav from './components/CategoryNav';
import ProductCard from './components/ProductCard';
import ProductModal from './components/ProductModal';
import CartDrawer from './components/CartDrawer';
import CatalogueModal from './components/CatalogueModal';
import SkinDiagnosticModal from './components/SkinDiagnosticModal';
import ScentFinderModal from './components/ScentFinderModal';
import VirtualTryOnModal from './components/VirtualTryOnModal';
import RoutineBuilderModal from './components/RoutineBuilderModal';
import ConsultantAffiliateModal from './components/ConsultantAffiliateModal';
import VoiceConciergeWidget from './components/VoiceConciergeWidget';
import ConsultantBanner from './components/ConsultantBanner';
import MobileBottomNav from './components/MobileBottomNav';
import Footer from './components/Footer';
import AdminDashboard from './components/admin/AdminDashboard';
import DemoSwitcher from './components/DemoSwitcher';
import storeService from './services/storeService';
import { 
  Search, 
  X, 
  BookOpen, 
  ArrowUpDown,
  UserCheck,
  MessageCircle,
  Share2,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

const CURRENCIES = storeConfig.currencies.supported;

export default function App() {
  const [products, setProducts] = useState(() => storeService.getProducts());
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeSubCategory, setActiveSubCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [pageFilter, setPageFilter] = useState(null);
  const [currency, setCurrency] = useState(storeConfig.currencies.default || 'GHS');
  const [isVipMember, setIsVipMember] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      return params.get('admin') === 'true' || params.get('mode') === 'admin';
    } catch {
      return false;
    }
  });

  // Active Consultant State (Supports Multi-Tenant Affiliate links)
  const [consultant, setConsultant] = useState(() => {
    try {
      // Check URL search parameters first: ?consultant=...&phone=...&id=...
      const params = new URLSearchParams(window.location.search);
      const urlConsultant = params.get('consultant');
      const urlPhone = params.get('phone');
      const urlId = params.get('id');

      if (urlConsultant || urlPhone) {
        return {
          name: urlConsultant || storeConfig.contact.ownerName,
          phone: urlPhone ? urlPhone.replace(/[^0-9]/g, '') : storeConfig.contact.phone,
          id: urlId || storeConfig.contact.partnerId
        };
      }

      const saved = localStorage.getItem('afia_consultant');
      return saved ? JSON.parse(saved) : {
        name: storeConfig.contact.ownerName,
        phone: storeConfig.contact.phone,
        id: storeConfig.contact.partnerId
      };
    } catch {
      return {
        name: storeConfig.contact.ownerName,
        phone: storeConfig.contact.phone,
        id: storeConfig.contact.partnerId
      };
    }
  });

  const handleUpdateConsultant = (newConsultant) => {
    setConsultant(newConsultant);
    try {
      localStorage.setItem('afia_consultant', JSON.stringify(newConsultant));
    } catch (e) {
      console.error('Error saving consultant:', e);
    }
  };

  // Pure Black Dark Mode State (Persisted)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      const saved = localStorage.getItem('afia_theme');
      if (saved) return saved === 'dark';
      return storeConfig.branding.defaultTheme === 'dark';
    } catch {
      return true;
    }
  });

  useEffect(() => {
    try {
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('afia_theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('afia_theme', 'light');
      }
    } catch (e) {
      console.error('Error setting theme class:', e);
    }
  }, [isDarkMode]);

  // Modals state
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCatalogueOpen, setIsCatalogueOpen] = useState(false);
  const [isSkinDiagnosticOpen, setIsSkinDiagnosticOpen] = useState(false);
  const [isScentFinderOpen, setIsScentFinderOpen] = useState(false);
  const [isVirtualTryOnOpen, setIsVirtualTryOnOpen] = useState(false);
  const [isRoutineBuilderOpen, setIsRoutineBuilderOpen] = useState(false);
  const [isAffiliateModalOpen, setIsAffiliateModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Cart state persisted in localStorage
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('afia_beauty_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('afia_beauty_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Error saving cart state:', e);
    }
  }, [cart]);

  // Currency Converter Formatter
  const formatPrice = (ghsAmount) => {
    if (typeof ghsAmount !== 'number') return '';
    const { symbol, rate } = CURRENCIES[currency] || CURRENCIES.GHS;
    const converted = ghsAmount * rate;
    
    if (currency === 'NGN') {
      return `${symbol}${Math.round(converted).toLocaleString()}`;
    }
    if (currency === 'USD') {
      return `${symbol}${converted.toFixed(2)}`;
    }
    return `${symbol} ${Math.round(converted).toLocaleString()}`;
  };

  // Cart Handlers
  const handleAddToCart = (product, qty = 1) => {
    setCart((prevCart) => {
      const variantKey = product.selectedVariant || '';
      const existingIndex = prevCart.findIndex(
        (item) => item.id === product.id && (item.selectedVariant || '') === variantKey
      );

      if (existingIndex > -1) {
        const next = [...prevCart];
        next[existingIndex] = {
          ...next[existingIndex],
          qty: next[existingIndex].qty + qty
        };
        return next;
      }
      return [...prevCart, { ...product, qty }];
    });
    showToast(`Added ${product.name} to your vanity bag!`);
  };

  const handleUpdateQty = (productId, newQty) => {
    if (newQty <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === productId ? { ...item, qty: newQty } : item))
    );
  };

  const handleRemoveItem = (productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((acc, item) => acc + item.qty, 0);
  const totalGHS = cart.reduce((acc, item) => acc + item.priceGHS * item.qty, 0);

  // Subcategories
  const subCategories = useMemo(() => {
    const list = products
      .filter((p) => activeCategory === 'All' || p.category === activeCategory)
      .map((p) => p.subCategory);
    return ['All', ...new Set(list)];
  }, [products, activeCategory]);

  // Product Counts
  const productCounts = useMemo(() => {
    const counts = { All: products.length };
    products.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, [products]);

  // Filtered and Sorted Products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (activeCategory !== 'All' && p.category !== activeCategory) {
          return false;
        }
        if (activeSubCategory !== 'All' && p.subCategory !== activeSubCategory) {
          return false;
        }
        if (pageFilter !== null && p.page !== pageFilter) {
          return false;
        }
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchesCode = p.code.includes(q);
          const matchesName = p.name.toLowerCase().includes(q);
          const matchesCategory = p.category.toLowerCase().includes(q);
          const matchesDesc = p.description.toLowerCase().includes(q);
          const matchesNotes = p.notes && p.notes.some((n) => n.toLowerCase().includes(q));
          return matchesCode || matchesName || matchesCategory || matchesDesc || matchesNotes;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.priceGHS - b.priceGHS;
        if (sortBy === 'price-desc') return b.priceGHS - a.priceGHS;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        return 0;
      });
  }, [products, activeCategory, activeSubCategory, pageFilter, searchQuery, sortBy]);

  const scrollToProducts = () => {
    const el = document.getElementById('products-grid');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // ── Admin Command Center Gate ──
  if (isAdminOpen) {
    return (
      <div className="relative">
        <AdminDashboard
          onExitAdmin={() => {
            setIsAdminOpen(false);
            setProducts(storeService.getProducts());
          }}
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
          onProductsChange={(updatedList) => setProducts(updatedList)}
        />
        <DemoSwitcher
          isAdmin={true}
          onToggle={() => {
            setIsAdminOpen(false);
            setProducts(storeService.getProducts());
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF6F0] dark:bg-[#000000] text-[#1E1917] dark:text-zinc-100 font-sans transition-colors duration-300 pb-20 md:pb-0 relative">
      {/* Top Navbar */}
      <Navbar
        cartCount={cartCount}
        onOpenCart={() => setIsCartOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={(q) => {
          setSearchQuery(q);
          if (q) setPageFilter(null);
        }}
        currency={currency}
        setCurrency={setCurrency}
        onOpenCatalogue={() => setIsCatalogueOpen(true)}
        currencies={CURRENCIES}
        onOpenSkinDiagnostic={() => setIsSkinDiagnosticOpen(true)}
        onOpenScentFinder={() => setIsScentFinderOpen(true)}
        onOpenVirtualTryOn={() => setIsVirtualTryOnOpen(true)}
        onOpenRoutineBuilder={() => setIsRoutineBuilderOpen(true)}
        onOpenAffiliateModal={() => setIsAffiliateModalOpen(true)}
        isVipMember={isVipMember}
        setIsVipMember={setIsVipMember}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        consultantName={consultant.name}
      />

      {/* Active Consultant Announcement Ribbon if customized */}
      {consultant.name !== storeConfig.contact.ownerName && (
        <div className="bg-[#1A1615] dark:bg-zinc-900 text-[#FAF6F0] px-4 py-1.5 text-center text-xs font-mono flex items-center justify-center gap-2 border-b border-[#DEB573]/30">
          <Share2 className="w-3.5 h-3.5 text-[#DEB573]" />
          <span>Shopping through Brand Partner: <strong>{consultant.name}</strong> (Orders route to +{consultant.phone})</span>
          <button 
            onClick={() => handleUpdateConsultant({ 
              name: storeConfig.contact.ownerName, 
              phone: storeConfig.contact.phone, 
              id: storeConfig.contact.partnerId 
            })}
            className="underline text-[#DEB573] hover:text-white ml-2 text-[11px] cursor-pointer"
          >
            Reset
          </button>
        </div>
      )}

      {/* VIP Wholesale Active Banner */}
      {isVipMember && storeConfig.features.enableVipWholesale && (
        <div className="bg-gradient-to-r from-[#DEB573] via-[#C48B3B] to-[#DEB573] text-[#1A1615] px-4 py-2 text-center text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm">
          <UserCheck className="w-4 h-4 text-[#1A1615]" />
          <span>{storeConfig.wholesale.bannerText}</span>
        </div>
      )}

      {/* Hero Showcase */}
      <Hero
        onExploreCategory={(cat) => {
          setActiveCategory(cat);
          setActiveSubCategory('All');
          setPageFilter(null);
          scrollToProducts();
        }}
        onOpenCatalogue={() => setIsCatalogueOpen(true)}
        onOpenSkinDiagnostic={() => setIsSkinDiagnosticOpen(true)}
        onOpenScentFinder={() => setIsScentFinderOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* ✨ 3D Interactive Masterpiece Carousel */}
      {storeConfig.features.enable3DCarousel && (
        <ThreeDCarousel
          products={products}
          onQuickView={setSelectedProduct}
          onAddToCart={handleAddToCart}
          formatPrice={formatPrice}
        />
      )}

      {/* Category Navigation Bar */}
      <div id="products-grid">
        <CategoryNav
          activeCategory={activeCategory}
          onSelectCategory={(cat) => {
            setActiveCategory(cat);
            setPageFilter(null);
          }}
          productCounts={productCounts}
          activeSubCategory={activeSubCategory}
          onSelectSubCategory={setActiveSubCategory}
          subCategories={subCategories}
        />
      </div>

      {/* Main Products Grid */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 w-full">
        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#EADBCE] dark:border-white/10">
          <div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1A1615] dark:text-white">
              {pageFilter 
                ? `Catalogue Page ${pageFilter} Items`
                : activeCategory === 'All' 
                ? 'Complete Q4 2026 Collection' 
                : `${activeCategory}`}
            </h2>
            <p className="text-xs text-[#8C7B72] dark:text-zinc-400 mt-1">
              Showing <strong>{filteredProducts.length}</strong> authenticated Swedish beauty formulations
              {searchQuery && ` matching "${searchQuery}"`}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            {/* Page Filter Active Tag */}
            {pageFilter !== null && (
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#1A1615] dark:bg-zinc-800 text-[#DEB573] text-xs font-bold shadow-xs border border-white/10">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Page {pageFilter} Only</span>
                <button
                  onClick={() => setPageFilter(null)}
                  className="hover:text-white p-0.5 ml-1 cursor-pointer"
                  aria-label="Clear page filter"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-[#8C7B72] dark:text-zinc-400 font-semibold hidden sm:inline">Sort:</span>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-white dark:bg-zinc-900 border border-[#EADBCE] dark:border-zinc-800 rounded-full px-4 py-2 pr-9 text-xs font-bold text-[#1A1615] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#DEB573] cursor-pointer appearance-none shadow-xs"
                >
                  <option value="featured">Featured / Best Sellers</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Customer Rating</option>
                  <option value="name">Alphabetical (A-Z)</option>
                </select>
                <ArrowUpDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#8C7B72] dark:text-zinc-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="py-24 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-white dark:bg-zinc-900 border border-[#EADBCE] dark:border-zinc-800 flex items-center justify-center mx-auto text-[#A8988E]">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#1A1615] dark:text-white">
              No Products Found
            </h3>
            <p className="text-xs text-[#8C7B72] dark:text-zinc-400 max-w-sm mx-auto leading-relaxed">
              We couldn't find products matching your criteria. Try resetting your search or category filter.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('All');
                setActiveSubCategory('All');
                setPageFilter(null);
              }}
              className="px-6 py-2.5 rounded-full bg-[#1A1615] dark:bg-white text-white dark:text-[#1A1615] text-xs font-bold hover:bg-[#26201E] dark:hover:bg-zinc-200 transition-all cursor-pointer shadow-md"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 pt-6 sm:pt-8">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                currency={currency}
                formatPrice={formatPrice}
                onAddToCart={handleAddToCart}
                onQuickView={setSelectedProduct}
                isVipMember={isVipMember}
              />
            ))}
          </div>
        )}
      </main>

      {/* VIP Partnership Opportunity Banner */}
      <ConsultantBanner />

      {/* Footer */}
      <Footer
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          setActiveSubCategory('All');
          setPageFilter(null);
          scrollToProducts();
        }}
        onOpenCatalogue={() => setIsCatalogueOpen(true)}
        onOpenSkinDiagnostic={() => setIsSkinDiagnosticOpen(true)}
        onOpenScentFinder={() => setIsScentFinderOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Modals */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
          formatPrice={formatPrice}
          currency={currency}
          isVipMember={isVipMember}
        />
      )}

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        formatPrice={formatPrice}
        currency={currency}
        totalGHS={totalGHS}
        isVipMember={isVipMember}
        consultantPhone={consultant.phone}
        consultantName={consultant.name}
      />

      {storeConfig.features.enableCatalogueModal && (
        <CatalogueModal
          isOpen={isCatalogueOpen}
          onClose={() => setIsCatalogueOpen(false)}
          onFilterByPage={(pageNum) => {
            setPageFilter(pageNum);
            setActiveCategory('All');
            setActiveSubCategory('All');
            scrollToProducts();
          }}
        />
      )}

      {storeConfig.features.enableSkinDiagnostic && (
        <SkinDiagnosticModal
          isOpen={isSkinDiagnosticOpen}
          onClose={() => setIsSkinDiagnosticOpen(false)}
          onAddToCart={handleAddToCart}
          products={products}
          formatPrice={formatPrice}
        />
      )}

      {storeConfig.features.enableScentFinder && (
        <ScentFinderModal
          isOpen={isScentFinderOpen}
          onClose={() => setIsScentFinderOpen(false)}
          onAddToCart={handleAddToCart}
          products={products}
          formatPrice={formatPrice}
        />
      )}

      {storeConfig.features.enableVirtualTryOn && (
        <VirtualTryOnModal
          isOpen={isVirtualTryOnOpen}
          onClose={() => setIsVirtualTryOnOpen(false)}
          onAddToCart={handleAddToCart}
          formatPrice={formatPrice}
        />
      )}

      {storeConfig.features.enableRoutineBuilder && (
        <RoutineBuilderModal
          isOpen={isRoutineBuilderOpen}
          onClose={() => setIsRoutineBuilderOpen(false)}
          onAddToCart={handleAddToCart}
          formatPrice={formatPrice}
        />
      )}

      {storeConfig.features.enableAffiliateReferrals && (
        <ConsultantAffiliateModal
          isOpen={isAffiliateModalOpen}
          onClose={() => setIsAffiliateModalOpen(false)}
          activeConsultant={consultant}
          onUpdateConsultant={handleUpdateConsultant}
        />
      )}

      {/* Floating Audio Voice Note Hotline Widget */}
      {storeConfig.features.enableVoiceConcierge && (
        <VoiceConciergeWidget
          consultantPhone={consultant.phone}
          consultantName={consultant.name}
        />
      )}

      {/* Floating WhatsApp Quick Action Button */}
      {storeConfig.features.enableWhatsAppCheckout && (
        <a
          href={`https://wa.me/${consultant.phone}?text=Hello%20${encodeURIComponent(consultant.name)}!%20${encodeURIComponent(storeConfig.contact.whatsappGreeting)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-40 bg-[#25D366] hover:bg-[#20BD5A] text-white p-3.5 sm:px-5 sm:py-3.5 rounded-full shadow-2xl flex items-center gap-2 hover:scale-105 transition-all duration-200 cursor-pointer group"
          aria-label="Chat on WhatsApp with Consultant"
        >
          <MessageCircle className="w-5 h-5 fill-current" />
          <span className="hidden sm:inline text-xs font-bold tracking-wide">
            Chat with {consultant.name.split(' ')[0]}
          </span>
        </a>
      )}

      {/* Toast Notification Pill */}
      {toastMessage && (
        <aside
          role="status"
          aria-live="polite"
          className="fixed bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 z-50 bg-[#1A1615] dark:bg-white text-white dark:text-[#1A1615] px-4 sm:px-5 py-2.5 rounded-full shadow-2xl flex items-center gap-2.5 text-xs font-bold border border-[#DEB573]/50 animate-in fade-in slide-in-from-bottom-4 duration-300 pointer-events-none"
        >
          <div className="w-5 h-5 rounded-full bg-[#DEB573] text-[#1A1615] flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-3.5 h-3.5" />
          </div>
          <span className="truncate max-w-[240px] sm:max-w-none">{toastMessage}</span>
        </aside>
      )}

      {/* Mobile Sticky Bottom App Navigation */}
      <MobileBottomNav
        cartCount={cartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenVirtualTryOn={() => setIsVirtualTryOnOpen(true)}
        onOpenRoutineBuilder={() => setIsRoutineBuilderOpen(true)}
        onScrollToTop={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        onScrollToCatalog={scrollToProducts}
      />

      {/* Demo Switcher (Bottom Left Floating Pill) */}
      <DemoSwitcher
        isAdmin={false}
        onToggle={() => setIsAdminOpen(true)}
      />
    </div>
  );
}
