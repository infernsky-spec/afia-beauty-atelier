import React from 'react';
import storeConfig from '../config/store.config';
import { 
  Home, 
  ShoppingBag, 
  Sparkles, 
  Camera, 
  Layers, 
  BookOpen 
} from 'lucide-react';

export default function MobileBottomNav({
  cartCount,
  onOpenCart,
  onOpenVirtualTryOn,
  onOpenRoutineBuilder,
  onScrollToTop,
  onScrollToCatalog
}) {
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/92 dark:bg-[#000000]/92 backdrop-blur-xl border-t border-[#EADBCE] dark:border-white/10 py-2 px-3 shadow-2xl safe-area-bottom transition-colors duration-300">
      <div className="flex items-center justify-around">
        {/* Home */}
        <button
          onClick={onScrollToTop}
          className="flex flex-col items-center gap-1 text-[#6E5D53] dark:text-zinc-400 hover:text-[#1A1615] dark:hover:text-white transition-colors cursor-pointer p-1"
        >
          <Home className="w-5 h-5 text-[#8C7B72] dark:text-zinc-400" />
          <span className="text-[10px] font-semibold">Home</span>
        </button>

        {/* Shop / Catalog */}
        <button
          onClick={onScrollToCatalog}
          className="flex flex-col items-center gap-1 text-[#6E5D53] dark:text-zinc-400 hover:text-[#1A1615] dark:hover:text-white transition-colors cursor-pointer p-1"
        >
          <Sparkles className="w-5 h-5 text-[#C48B3B] dark:text-[#DEB573]" />
          <span className="text-[10px] font-semibold">Shop</span>
        </button>

        {/* AR Virtual Try-On */}
        {storeConfig.features.enableVirtualTryOn && (
          <button
            onClick={onOpenVirtualTryOn}
            className="flex flex-col items-center gap-1 text-[#6E5D53] dark:text-zinc-400 hover:text-[#1A1615] dark:hover:text-white transition-colors cursor-pointer p-1"
          >
            <div className="w-6 h-6 rounded-full bg-[#1A1615] dark:bg-[#DEB573] text-white dark:text-[#1A1615] flex items-center justify-center shadow-xs">
              <Camera className="w-3.5 h-3.5" />
            </div>
            <span className="text-[10px] font-bold text-[#C48B3B] dark:text-[#DEB573]">AR Try-On</span>
          </button>
        )}

        {/* Routines (-15%) */}
        {storeConfig.features.enableRoutineBuilder && (
          <button
            onClick={onOpenRoutineBuilder}
            className="flex flex-col items-center gap-1 text-[#6E5D53] dark:text-zinc-400 hover:text-[#1A1615] dark:hover:text-white transition-colors cursor-pointer p-1"
          >
            <Layers className="w-5 h-5 text-[#8C7B72] dark:text-zinc-400" />
            <span className="text-[10px] font-semibold">Vanity</span>
          </button>
        )}

        {/* Shopping Bag */}
        <button
          onClick={onOpenCart}
          className="relative flex flex-col items-center gap-1 text-[#1A1615] dark:text-white transition-colors cursor-pointer p-1"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 text-[#1A1615] dark:text-white" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-gradient-to-r from-[#DEB573] to-[#C48B3B] text-[#1A1615] text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold">Bag</span>
        </button>
      </div>
    </nav>
  );
}
