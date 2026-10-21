import React, { useState } from 'react';
import storeConfig from '../config/store.config';
import { 
  ShoppingBag, 
  Search, 
  X, 
  Phone, 
  BookOpen, 
  SlidersHorizontal,
  Compass,
  Activity,
  UserCheck,
  Sparkles,
  Moon,
  Sun,
  Camera,
  Layers,
  Share2,
  Check
} from 'lucide-react';

export default function Navbar({
  cartCount,
  onOpenCart,
  searchQuery,
  setSearchQuery,
  currency,
  setCurrency,
  onOpenCatalogue,
  currencies,
  onOpenSkinDiagnostic,
  onOpenScentFinder,
  onOpenVirtualTryOn,
  onOpenRoutineBuilder,
  onOpenAffiliateModal,
  isVipMember,
  setIsVipMember,
  isDarkMode,
  setIsDarkMode,
  consultantName = 'Afia Mensah',
  onOpenFilterSheet
}) {
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#fbf9f5]/90 dark:bg-[#0c0c0e]/95 backdrop-blur-xl border-b border-[#EADBCE]/80 dark:border-white/10 transition-colors duration-300">
      {/* Top Gold & Pure Black Utility Ribbon (Desktop) */}
      <div className="bg-[#1b1c1a] dark:bg-[#080808] text-[#fbf9f5] px-3 sm:px-4 py-1 sm:py-1.5 text-xs border-b border-black/20 dark:border-white/5 overflow-x-auto no-scrollbar">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 min-w-max sm:min-w-0">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-dm font-bold bg-[#8d4e12] text-white shadow-xs">
              <Sparkles className="w-2.5 h-2.5 text-[#ffdcc4]" />
              <span>{storeConfig.branding.badge}</span>
            </span>
            <span className="hidden sm:inline text-xs text-[#ffdcc4] dark:text-zinc-400 font-dm">
              {storeConfig.branding.shortDescription}
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 text-xs">
            {/* Consultant Affiliate Link Button */}
            {storeConfig.features.enableAffiliateReferrals && (
              <button
                onClick={onOpenAffiliateModal}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-[#fbf9f5] transition-all cursor-pointer shadow-xs"
                title="Change Consultant or Generate Personal Affiliate Link"
              >
                <Share2 className="w-3 h-3 text-[#ffdcc4]" />
                <span className="text-[11px] font-dm font-semibold truncate max-w-[120px] sm:max-w-none">
                  Partner: {consultantName}
                </span>
              </button>
            )}

            {/* Dark / Light Mode Switcher */}
            {storeConfig.features.enablePureBlackDarkMode && (
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-[#fbf9f5] transition-all cursor-pointer shadow-xs"
                aria-label="Toggle dark mode"
              >
                {isDarkMode ? (
                  <>
                    <Sun className="w-3.5 h-3.5 text-[#ffdcc4]" />
                    <span className="text-[10px] font-dm font-semibold">Light</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-3.5 h-3.5 text-[#ffdcc4]" />
                    <span className="text-[10px] font-dm font-semibold">OLED Dark</span>
                  </>
                )}
              </button>
            )}

            {/* VIP Wholesale Rate Switcher */}
            {storeConfig.features.enableVipWholesale && (
              <button
                onClick={() => setIsVipMember(!isVipMember)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-dm font-bold transition-all cursor-pointer shadow-xs ${
                  isVipMember
                    ? 'bg-[#8d4e12] text-white'
                    : 'bg-white/10 hover:bg-white/20 text-[#fbf9f5] border border-white/20'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>{isVipMember ? `${storeConfig.wholesale.badgeText} (-20%)` : 'VIP WHOLESALE'}</span>
              </button>
            )}

            {/* Currency Selector */}
            <div className="flex items-center gap-1">
              <span className="text-zinc-400 text-[10px] hidden sm:inline">Currency:</span>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="bg-[#26201E] dark:bg-zinc-900 text-white rounded-full px-2 py-0.5 text-[11px] border border-zinc-700 focus:outline-none focus:ring-1 focus:ring-[#8d4e12] cursor-pointer"
                aria-label="Select currency"
              >
                {Object.keys(currencies).map((curr) => (
                  <option key={curr} value={curr}>
                    {curr} ({currencies[curr].symbol})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Bar matching Stitch discover_home.html Top App Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex items-center justify-between gap-3 sm:gap-4">
        {/* Brand Logotype & Scandinavian Crest */}
        <div className="flex items-center gap-2.5">
          <a href="#" className="flex flex-col group">
            <div className="flex items-center gap-1.5">
              <span className="font-serif text-2xl sm:text-3xl font-extrabold tracking-tight text-[#1b1c1a] dark:text-white transition-colors">
                {storeConfig.branding.namePrefix}
                <span className="text-[#8d4e12] dark:text-[#ffdcc4]">{storeConfig.branding.nameSuffix}</span>
              </span>
              <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-[#8d4e12] mt-1"></span>
            </div>
            <span className="text-[9px] uppercase tracking-[0.25em] text-[#7a776f] dark:text-zinc-400 font-semibold -mt-1 font-dm">
              {storeConfig.branding.tagline}
            </span>
          </a>
        </div>

        {/* Feature Triggers (Desktop) */}
        <div className="hidden xl:flex items-center gap-2">
          {storeConfig.features.enableVirtualTryOn && (
            <button
              onClick={onOpenVirtualTryOn}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#f5f3ef] dark:bg-[#1a1a20] hover:bg-[#eae8e4] dark:hover:bg-[#25252e] text-[#1b1c1a] dark:text-zinc-200 text-xs font-dm font-semibold border border-[#EADBCE]/70 dark:border-white/5 transition-all cursor-pointer shadow-xs active:scale-95"
            >
              <Camera className="w-3.5 h-3.5 text-[#8d4e12]" />
              <span>AR Try-On</span>
            </button>
          )}

          {storeConfig.features.enableRoutineBuilder && (
            <button
              onClick={onOpenRoutineBuilder}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#f5f3ef] dark:bg-[#1a1a20] hover:bg-[#eae8e4] dark:hover:bg-[#25252e] text-[#1b1c1a] dark:text-zinc-200 text-xs font-dm font-semibold border border-[#EADBCE]/70 dark:border-white/5 transition-all cursor-pointer shadow-xs active:scale-95"
            >
              <Layers className="w-3.5 h-3.5 text-[#8d4e12]" />
              <span>Routine (-15%)</span>
            </button>
          )}

          {storeConfig.features.enableSkinDiagnostic && (
            <button
              onClick={onOpenSkinDiagnostic}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#f5f3ef] dark:bg-[#1a1a20] hover:bg-[#eae8e4] dark:hover:bg-[#25252e] text-[#1b1c1a] dark:text-zinc-200 text-xs font-dm font-semibold border border-[#EADBCE]/70 dark:border-white/5 transition-all cursor-pointer shadow-xs active:scale-95"
            >
              <Activity className="w-3.5 h-3.5 text-[#8d4e12]" />
              <span>Skin Diagnostic</span>
            </button>
          )}

          {storeConfig.features.enableScentFinder && (
            <button
              onClick={onOpenScentFinder}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#f5f3ef] dark:bg-[#1a1a20] hover:bg-[#eae8e4] dark:hover:bg-[#25252e] text-[#1b1c1a] dark:text-zinc-200 text-xs font-dm font-semibold border border-[#EADBCE]/70 dark:border-white/5 transition-all cursor-pointer shadow-xs active:scale-95"
            >
              <Compass className="w-3.5 h-3.5 text-[#8d4e12]" />
              <span>Scent Atelier</span>
            </button>
          )}

          {storeConfig.features.enableCatalogueModal && (
            <button
              onClick={onOpenCatalogue}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[#8d4e12]/40 text-[#8d4e12] dark:text-[#ffdcc4] bg-[#ffdcc4]/20 hover:bg-[#ffdcc4]/40 text-xs font-dm font-bold transition-all cursor-pointer shadow-xs active:scale-95"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#8d4e12]" />
              <span>Q4 Flipbook</span>
            </button>
          )}
        </div>

        {/* Search Bar - Desktop */}
        <div className="hidden md:flex flex-1 max-w-xs mx-3">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7a776f] dark:text-zinc-400" />
            <input
              type="text"
              placeholder="Search code, shades, notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-9 py-2 rounded-full bg-[#f5f3ef] dark:bg-[#1a1a20] border border-[#EADBCE]/80 dark:border-white/5 text-xs font-dm text-[#1b1c1a] dark:text-white placeholder-[#7a776f] dark:placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-[#8d4e12] focus:bg-white dark:focus:bg-[#15151a] transition-all shadow-xs"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7a776f] hover:text-[#1b1c1a] dark:hover:text-white p-0.5 cursor-pointer"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Quick AR Trigger (Mobile) */}
          <button
            onClick={onOpenVirtualTryOn}
            className="xl:hidden p-2 text-[#7a776f] dark:text-zinc-300 hover:text-[#1b1c1a] rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Open Virtual Try-On"
          >
            <Camera className="w-5 h-5 text-[#8d4e12]" />
          </button>

          {/* Bag Trigger */}
          <button
            onClick={onOpenCart}
            className="relative flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full bg-[#1b1c1a] dark:bg-white text-white dark:text-[#1b1c1a] hover:bg-[#8d4e12] dark:hover:bg-[#ffdcc4] text-xs font-dm font-bold transition-all shadow-md active:scale-95 cursor-pointer"
            aria-label="Shopping bag"
          >
            <ShoppingBag className="w-4 h-4 text-[#ffdcc4] dark:text-[#8d4e12]" />
            <span className="hidden sm:inline">Bag</span>
            <span className="bg-[#8d4e12] text-white text-[11px] font-bold px-2 py-0.2 rounded-full min-w-[20px] text-center shadow-xs">
              {cartCount}
            </span>
          </button>
        </div>
      </div>

      {/* Stitch Capsule Search Bar with Tune Icon (Mobile View) matching discover_home.html */}
      <div className="md:hidden px-4 pb-2.5 pt-0.5">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7a776f] dark:text-zinc-400 pointer-events-none" />
          <input
            type="search"
            placeholder="Search curated catalog, codes, notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-10 rounded-full bg-[#f5f3ef] dark:bg-[#15151a] text-[#1b1c1a] dark:text-white placeholder-[#7a776f] dark:placeholder-zinc-500 font-dm text-xs border border-[#EADBCE]/70 dark:border-white/5 focus:outline-none focus:ring-1 focus:ring-[#8d4e12] focus:bg-white dark:focus:bg-[#1a1a20] transition-all shadow-2xs"
          />
          {searchQuery ? (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7a776f] hover:text-[#1b1c1a] dark:hover:text-white p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={() => setIsFilterSheetOpen(!isFilterSheetOpen)}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center text-[#7a776f] hover:text-[#1b1c1a] dark:hover:text-white transition-colors"
              aria-label="Filter catalogue"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Mobile Quick Filter Drawer Sheet */}
        {isFilterSheetOpen && (
          <div className="mt-2.5 p-3.5 bg-white dark:bg-[#15151a] rounded-2xl border border-[#EADBCE] dark:border-white/10 shadow-lg space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center justify-between border-b border-[#EADBCE]/60 dark:border-white/5 pb-2">
              <span className="font-dm font-bold text-xs text-[#1b1c1a] dark:text-white flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#8d4e12]" />
                Catalogue Quick Filters
              </span>
              <button
                onClick={() => setIsFilterSheetOpen(false)}
                className="text-[#7a776f] text-xs font-semibold"
              >
                Done
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              {/* VIP Wholesale Quick Toggle */}
              <button
                onClick={() => setIsVipMember(!isVipMember)}
                className={`p-2.5 rounded-xl border flex items-center justify-between text-left font-dm transition-all ${
                  isVipMember
                    ? 'bg-[#ffdcc4]/50 dark:bg-[#8d4e12]/30 border-[#8d4e12] text-[#8d4e12] dark:text-[#ffdcc4] font-bold'
                    : 'bg-[#f5f3ef] dark:bg-zinc-900 border-[#EADBCE]/60 text-[#1b1c1a] dark:text-zinc-300'
                }`}
              >
                <span>VIP Wholesale (-20%)</span>
                {isVipMember && <Check className="w-3.5 h-3.5" />}
              </button>

              {/* Flipbook Trigger */}
              <button
                onClick={() => {
                  setIsFilterSheetOpen(false);
                  onOpenCatalogue();
                }}
                className="p-2.5 rounded-xl bg-[#f5f3ef] dark:bg-zinc-900 border border-[#EADBCE]/60 text-[#1b1c1a] dark:text-zinc-300 flex items-center justify-between font-dm text-left"
              >
                <span>Digital Flipbook</span>
                <BookOpen className="w-3.5 h-3.5 text-[#8d4e12]" />
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
