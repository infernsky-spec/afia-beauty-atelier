import React, { useState } from 'react';
import storeConfig from '../config/store.config';
import { 
  Compass, 
  LayoutGrid, 
  Camera, 
  Layers, 
  ShoppingBag,
  Sparkles
} from 'lucide-react';

export default function MobileBottomNav({
  cartCount,
  onOpenCart,
  onOpenVirtualTryOn,
  onOpenRoutineBuilder,
  onScrollToTop,
  onScrollToCatalog
}) {
  const [activeTab, setActiveTab] = useState('discover');

  const handleTabClick = (tabId, action) => {
    setActiveTab(tabId);
    if (action) action();
  };

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-[#fbf9f5]/90 dark:bg-[#0c0c0e]/92 backdrop-blur-2xl border-t border-[#EADBCE]/80 dark:border-white/10 shadow-[0_-8px_24px_-4px_rgba(28,27,25,0.06)] transition-all duration-300 pb-safe">
      <div className="flex items-center justify-around h-16 px-2">
        {/* Tab 1: Discover (Home) */}
        <button
          onClick={() => handleTabClick('discover', onScrollToTop)}
          className={`flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-full min-h-[42px] transition-all duration-300 cursor-pointer active:scale-95 ${
            activeTab === 'discover'
              ? 'bg-[#1b1c1a] dark:bg-white text-white dark:text-[#1b1c1a] shadow-md font-dm font-semibold text-xs'
              : 'text-[#494740] dark:text-zinc-400 hover:text-[#1b1c1a] dark:hover:text-white font-dm text-xs'
          }`}
        >
          <Compass className={`w-4 h-4 shrink-0 ${activeTab === 'discover' ? 'text-[#ffdcc4] dark:text-[#8d4e12]' : 'text-[#7a776f] dark:text-zinc-400'}`} />
          {activeTab === 'discover' && <span>Discover</span>}
        </button>

        {/* Tab 2: Catalog (Explore) */}
        <button
          onClick={() => handleTabClick('catalog', onScrollToCatalog)}
          className={`flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-full min-h-[42px] transition-all duration-300 cursor-pointer active:scale-95 ${
            activeTab === 'catalog'
              ? 'bg-[#1b1c1a] dark:bg-white text-white dark:text-[#1b1c1a] shadow-md font-dm font-semibold text-xs'
              : 'text-[#494740] dark:text-zinc-400 hover:text-[#1b1c1a] dark:hover:text-white font-dm text-xs'
          }`}
        >
          <LayoutGrid className={`w-4 h-4 shrink-0 ${activeTab === 'catalog' ? 'text-[#ffdcc4] dark:text-[#8d4e12]' : 'text-[#7a776f] dark:text-zinc-400'}`} />
          {activeTab === 'catalog' && <span>Catalog</span>}
        </button>

        {/* Tab 3: AR Try-On Studio */}
        {storeConfig.features.enableVirtualTryOn && (
          <button
            onClick={() => handleTabClick('ar', onOpenVirtualTryOn)}
            className={`flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-full min-h-[42px] transition-all duration-300 cursor-pointer active:scale-95 ${
              activeTab === 'ar'
                ? 'bg-[#1b1c1a] dark:bg-white text-white dark:text-[#1b1c1a] shadow-md font-dm font-semibold text-xs'
                : 'text-[#494740] dark:text-zinc-400 hover:text-[#1b1c1a] dark:hover:text-white font-dm text-xs'
            }`}
          >
            <Camera className={`w-4 h-4 shrink-0 ${activeTab === 'ar' ? 'text-[#ffdcc4] dark:text-[#8d4e12]' : 'text-[#8d4e12] dark:text-[#ffdcc4]'}`} />
            {activeTab === 'ar' && <span>AR Try-On</span>}
          </button>
        )}

        {/* Tab 4: Routine Builder */}
        {storeConfig.features.enableRoutineBuilder && (
          <button
            onClick={() => handleTabClick('vanity', onOpenRoutineBuilder)}
            className={`flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-full min-h-[42px] transition-all duration-300 cursor-pointer active:scale-95 ${
              activeTab === 'vanity'
                ? 'bg-[#1b1c1a] dark:bg-white text-white dark:text-[#1b1c1a] shadow-md font-dm font-semibold text-xs'
                : 'text-[#494740] dark:text-zinc-400 hover:text-[#1b1c1a] dark:hover:text-white font-dm text-xs'
            }`}
          >
            <Layers className={`w-4 h-4 shrink-0 ${activeTab === 'vanity' ? 'text-[#ffdcc4] dark:text-[#8d4e12]' : 'text-[#7a776f] dark:text-zinc-400'}`} />
            {activeTab === 'vanity' && <span>Vanity</span>}
          </button>
        )}

        {/* Tab 5: Shopping Bag */}
        <button
          onClick={onOpenCart}
          className="relative flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-full min-h-[42px] text-[#1b1c1a] dark:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-all duration-200 cursor-pointer active:scale-95 font-dm text-xs font-semibold"
        >
          <div className="relative">
            <ShoppingBag className="w-4 h-4 text-[#1b1c1a] dark:text-white" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full bg-[#8d4e12] text-white text-[10px] font-bold flex items-center justify-center leading-none shadow-xs">
                {cartCount}
              </span>
            )}
          </div>
          <span className="hidden xs:inline">Bag</span>
        </button>
      </div>
    </nav>
  );
}
