import React, { useState } from 'react';
import storeConfig from '../config/store.config';
import { 
  ShoppingBag, 
  Search, 
  X, 
  Phone, 
  BookOpen, 
  Compass,
  Activity,
  UserCheck,
  Sparkles,
  Moon,
  Sun,
  Camera,
  Layers,
  Share2
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
  consultantName = 'Afia Mensah'
}) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#FAF6F0]/92 dark:bg-[#000000]/92 backdrop-blur-xl border-b border-[#EADBCE] dark:border-white/10 transition-colors duration-300">
      {/* Top Gold & Pure Black Ribbon */}
      <div className="bg-[#1A1615] dark:bg-[#080808] text-[#FAF6F0] px-3 sm:px-4 py-1.5 sm:py-2 text-xs border-b border-black/20 dark:border-white/5 overflow-x-auto no-scrollbar">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 min-w-max sm:min-w-0">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] font-bold bg-[#DEB573] text-[#1A1615] shadow-xs">
              <Sparkles className="w-3 h-3 text-[#1A1615]" />
              <span>{storeConfig.branding.badge}</span>
            </span>
            <span className="hidden sm:inline text-xs text-[#EADBCE] dark:text-zinc-400">
              {storeConfig.branding.shortDescription}
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            {/* Consultant Affiliate Link Button */}
            {storeConfig.features.enableAffiliateReferrals && (
              <button
                onClick={onOpenAffiliateModal}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-[#FAF6F0] transition-all cursor-pointer shadow-xs"
                title="Change Consultant or Generate Personal Affiliate Link"
              >
                <Share2 className="w-3 h-3 text-[#DEB573]" />
                <span className="text-[11px] font-semibold truncate max-w-[120px] sm:max-w-none">
                  Partner: {consultantName}
                </span>
              </button>
            )}

            {/* Dark / Light Mode Switcher */}
            {storeConfig.features.enablePureBlackDarkMode && (
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-[#FAF6F0] transition-all cursor-pointer shadow-xs"
                aria-label="Toggle dark mode"
                title="Toggle Pure Black theme"
              >
                {isDarkMode ? (
                  <>
                    <Sun className="w-3.5 h-3.5 text-[#DEB573]" />
                    <span className="text-[11px] font-semibold">Light</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-3.5 h-3.5 text-[#DEB573]" />
                    <span className="text-[11px] font-semibold">Pure Black</span>
                  </>
                )}
              </button>
            )}

            {/* VIP Wholesale Rate Switcher */}
            {storeConfig.features.enableVipWholesale && (
              <button
                onClick={() => setIsVipMember(!isVipMember)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer shadow-xs ${
                  isVipMember
                    ? 'bg-gradient-to-r from-[#DEB573] to-[#C48B3B] text-[#1A1615]'
                    : 'bg-white/10 hover:bg-white/20 text-[#FAF6F0] border border-white/20'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>{isVipMember ? `${storeConfig.wholesale.badgeText} ACTIVE` : 'VIP WHOLESALE'}</span>
              </button>
            )}

            {/* Currency Selector */}
            <div className="flex items-center gap-1">
              <span className="text-[#A8988E] dark:text-zinc-400 text-[11px]">Currency:</span>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="bg-[#26201E] dark:bg-zinc-900 text-white rounded-full px-2.5 py-0.5 text-xs border border-[#3D3431] dark:border-zinc-700 focus:outline-none focus:ring-1 focus:ring-[#DEB573] cursor-pointer"
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

      {/* Main Luxury Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-3 sm:gap-4">
        {/* Brand Logotype */}
        <div className="flex items-center gap-3">
          <a href="#" className="flex flex-col group">
            <span className="font-serif text-2xl sm:text-3xl font-extrabold tracking-wide text-[#1A1615] dark:text-white transition-colors">
              {storeConfig.branding.namePrefix}
              <span className="text-[#C48B3B]">{storeConfig.branding.nameSuffix}</span>
            </span>
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#8C7B72] dark:text-[#DEB573] font-semibold -mt-1">
              {storeConfig.branding.tagline}
            </span>
          </a>
        </div>

        {/* Feature Triggers (Desktop) */}
        <div className="hidden xl:flex items-center gap-2">
          {storeConfig.features.enableVirtualTryOn && (
            <button
              onClick={onOpenVirtualTryOn}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FAF6F0] dark:bg-zinc-900 hover:bg-[#FCEAE4] dark:hover:bg-zinc-800 text-[#6E5D53] dark:text-zinc-200 text-xs font-bold border border-[#EADBCE] dark:border-zinc-800 transition-all cursor-pointer shadow-xs"
            >
              <Camera className="w-3.5 h-3.5 text-[#C48B3B]" />
              <span>Virtual Try-On</span>
            </button>
          )}

          {storeConfig.features.enableRoutineBuilder && (
            <button
              onClick={onOpenRoutineBuilder}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FAF6F0] dark:bg-zinc-900 hover:bg-[#FCEAE4] dark:hover:bg-zinc-800 text-[#6E5D53] dark:text-zinc-200 text-xs font-bold border border-[#EADBCE] dark:border-zinc-800 transition-all cursor-pointer shadow-xs"
            >
              <Layers className="w-3.5 h-3.5 text-[#C48B3B]" />
              <span>Routine (-{storeConfig.routineBuilder.discountPercent}%)</span>
            </button>
          )}

          {storeConfig.features.enableSkinDiagnostic && (
            <button
              onClick={onOpenSkinDiagnostic}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FAF6F0] dark:bg-zinc-900 hover:bg-[#FCEAE4] dark:hover:bg-zinc-800 text-[#6E5D53] dark:text-zinc-200 text-xs font-bold border border-[#EADBCE] dark:border-zinc-800 transition-all cursor-pointer shadow-xs"
            >
              <Activity className="w-3.5 h-3.5 text-[#C48B3B]" />
              <span>Skin Diagnostic</span>
            </button>
          )}

          {storeConfig.features.enableScentFinder && (
            <button
              onClick={onOpenScentFinder}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FAF6F0] dark:bg-zinc-900 hover:bg-[#FCEAE4] dark:hover:bg-zinc-800 text-[#6E5D53] dark:text-zinc-200 text-xs font-bold border border-[#EADBCE] dark:border-zinc-800 transition-all cursor-pointer shadow-xs"
            >
              <Compass className="w-3.5 h-3.5 text-[#C48B3B]" />
              <span>Scent Atelier</span>
            </button>
          )}

          {storeConfig.features.enableCatalogueModal && (
            <button
              onClick={onOpenCatalogue}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[#DEB573] text-[#9B681C] dark:text-[#DEB573] bg-[#FFFDF9] dark:bg-zinc-900 hover:bg-[#F5DFC2]/50 text-xs font-bold transition-all cursor-pointer shadow-xs"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#C48B3B]" />
              <span>Flipbook</span>
            </button>
          )}
        </div>

        {/* Search Bar - Desktop */}
        <div className="hidden md:flex flex-1 max-w-xs mx-3">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A8988E] dark:text-zinc-500" />
            <input
              type="text"
              placeholder="Search code (e.g. 42256)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-9 py-2 rounded-full bg-white dark:bg-zinc-900 border border-[#EADBCE] dark:border-zinc-800 text-xs text-[#1A1615] dark:text-white placeholder-[#A8988E] dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#DEB573] transition-all shadow-xs"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A8988E] hover:text-[#1A1615] dark:hover:text-white p-0.5 cursor-pointer"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Quick AR Trigger (Mobile / Tablet) */}
          <button
            onClick={onOpenVirtualTryOn}
            className="xl:hidden p-2 text-[#6E5D53] dark:text-zinc-300 hover:text-[#1A1615] rounded-full hover:bg-white dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            aria-label="Open Virtual Try-On"
            title="AR Virtual Try-On"
          >
            <Camera className="w-5 h-5 text-[#C48B3B]" />
          </button>

          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="md:hidden p-2 text-[#6E5D53] dark:text-zinc-300 hover:text-[#1A1615] rounded-full hover:bg-white dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            aria-label="Toggle search"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Bag Trigger */}
          <button
            onClick={onOpenCart}
            className="relative flex items-center gap-2 px-4 py-2 rounded-full bg-[#1A1615] dark:bg-white text-white dark:text-[#1A1615] hover:bg-[#26201E] dark:hover:bg-zinc-200 text-xs font-bold transition-all shadow-md hover:shadow-xl cursor-pointer"
            aria-label="Shopping bag"
          >
            <ShoppingBag className="w-4 h-4 text-[#DEB573] dark:text-[#C48B3B]" />
            <span className="hidden sm:inline">Bag</span>
            <span className="bg-gradient-to-r from-[#DEB573] to-[#C48B3B] text-[#1A1615] text-[11px] font-extrabold px-2 py-0.2 rounded-full min-w-[22px] text-center shadow-xs">
              {cartCount}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Feature Quick Pill Bar */}
      <div className="xl:hidden flex items-center gap-2 px-4 py-2 overflow-x-auto no-scrollbar border-t border-[#EADBCE]/60 dark:border-zinc-800/60 bg-[#FAF6F0] dark:bg-[#000000] text-xs">
        {storeConfig.features.enableVirtualTryOn && (
          <button
            onClick={onOpenVirtualTryOn}
            className="flex items-center gap-1 px-3 py-1 rounded-full bg-white dark:bg-zinc-900 border border-[#EADBCE] dark:border-zinc-800 text-[#1A1615] dark:text-zinc-200 shrink-0 font-bold"
          >
            <Camera className="w-3 h-3 text-[#C48B3B]" />
            <span>Virtual Try-On</span>
          </button>
        )}
        {storeConfig.features.enableRoutineBuilder && (
          <button
            onClick={onOpenRoutineBuilder}
            className="flex items-center gap-1 px-3 py-1 rounded-full bg-white dark:bg-zinc-900 border border-[#EADBCE] dark:border-zinc-800 text-[#1A1615] dark:text-zinc-200 shrink-0 font-bold"
          >
            <Layers className="w-3 h-3 text-[#C48B3B]" />
            <span>Routine (-{storeConfig.routineBuilder.discountPercent}%)</span>
          </button>
        )}
        {storeConfig.features.enableSkinDiagnostic && (
          <button
            onClick={onOpenSkinDiagnostic}
            className="flex items-center gap-1 px-3 py-1 rounded-full bg-white dark:bg-zinc-900 border border-[#EADBCE] dark:border-zinc-800 text-[#1A1615] dark:text-zinc-200 shrink-0 font-bold"
          >
            <Activity className="w-3 h-3 text-[#C48B3B]" />
            <span>Skin Test</span>
          </button>
        )}
        {storeConfig.features.enableScentFinder && (
          <button
            onClick={onOpenScentFinder}
            className="flex items-center gap-1 px-3 py-1 rounded-full bg-white dark:bg-zinc-900 border border-[#EADBCE] dark:border-zinc-800 text-[#1A1615] dark:text-zinc-200 shrink-0 font-bold"
          >
            <Compass className="w-3 h-3 text-[#C48B3B]" />
            <span>Scent Atelier</span>
          </button>
        )}
        {storeConfig.features.enableCatalogueModal && (
          <button
            onClick={onOpenCatalogue}
            className="flex items-center gap-1 px-3 py-1 rounded-full bg-white dark:bg-zinc-900 border border-[#EADBCE] dark:border-zinc-800 text-[#1A1615] dark:text-zinc-200 shrink-0 font-bold"
          >
            <BookOpen className="w-3 h-3 text-[#C48B3B]" />
            <span>Flipbook</span>
          </button>
        )}
      </div>

      {/* Mobile Search Expand */}
      {isSearchOpen && (
        <div className="md:hidden px-4 pb-3 pt-1 border-t border-[#EADBCE] dark:border-zinc-800 bg-[#FAF6F0] dark:bg-[#000000]">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A8988E]" />
            <input
              type="text"
              placeholder="Search code (e.g. 42256) or product..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-9 py-2 rounded-full bg-white dark:bg-zinc-900 border border-[#EADBCE] dark:border-zinc-800 text-xs text-[#1A1615] dark:text-white placeholder-[#A8988E] focus:outline-none focus:ring-2 focus:ring-[#DEB573]"
              autoFocus
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A8988E] hover:text-[#1A1615] dark:hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
