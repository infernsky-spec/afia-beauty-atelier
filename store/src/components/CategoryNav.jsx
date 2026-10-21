import React from 'react';
import { 
  Flame, 
  Droplets, 
  Sparkles, 
  Smile, 
  Apple, 
  LayoutGrid,
  Check
} from 'lucide-react';

const CATEGORIES = [
  { id: 'All', name: 'Curated Collection', icon: LayoutGrid },
  { id: 'Fragrance', name: 'Haute Parfumerie', icon: Flame },
  { id: 'Skincare', name: 'Novage+ Skincare', icon: Droplets },
  { id: 'Makeup', name: 'Giordani Gold & THE ONE', icon: Sparkles },
  { id: 'Personal Care', name: 'Swedish Body & Hair', icon: Smile },
  { id: 'Nutrition & Wellness', name: 'Wellosophy Wellness', icon: Apple },
];

export default function CategoryNav({
  activeCategory,
  onSelectCategory,
  productCounts,
  activeSubCategory,
  onSelectSubCategory,
  subCategories
}) {
  return (
    <div className="bg-[#fbf9f5]/90 dark:bg-[#0c0c0e]/95 backdrop-blur-xl border-b border-[#EADBCE]/80 dark:border-white/10 sticky top-[64px] sm:top-[74px] z-30 shadow-xs transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Categories Capsule Chip Row matching Stitch discover_home.html lines 72-89 */}
        <div className="flex items-center gap-2 overflow-x-auto py-3 no-scrollbar scroll-smooth">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            const count = productCounts[cat.id] || 0;

            return (
              <button
                key={cat.id}
                onClick={() => {
                  onSelectCategory(cat.id);
                  onSelectSubCategory('All');
                }}
                className={`category-chip flex items-center gap-2 px-4 py-2 rounded-full font-dm text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer shrink-0 active:scale-95 ${
                  isActive
                    ? 'bg-[#1b1c1a] dark:bg-white text-white dark:text-[#1b1c1a] shadow-sm'
                    : 'bg-[#f5f3ef] dark:bg-[#1a1a20] text-[#494740] dark:text-zinc-300 hover:text-[#1b1c1a] dark:hover:text-white hover:bg-[#eae8e4] dark:hover:bg-[#25252e] border border-transparent hover:border-[#EADBCE]/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#ffdcc4] dark:text-[#8d4e12]' : 'text-[#7a776f] dark:text-zinc-400'}`} />
                <span>{cat.name}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold font-mono ${
                  isActive 
                    ? 'bg-white/20 dark:bg-black/15 text-[#ffdcc4] dark:text-[#8d4e12]' 
                    : 'bg-[#eae8e4] dark:bg-[#25252e] text-[#7a776f] dark:text-zinc-400'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Subcategories Row */}
        {subCategories && subCategories.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-2.5 pt-0.5 border-t border-[#EADBCE]/40 dark:border-white/5 no-scrollbar">
            <span className="text-[10px] font-dm uppercase tracking-wider text-[#7a776f] dark:text-zinc-400 font-bold mr-1 shrink-0">
              Department:
            </span>
            {subCategories.map((sub) => {
              const isSubActive = activeSubCategory === sub;
              return (
                <button
                  key={sub}
                  onClick={() => onSelectSubCategory(sub)}
                  className={`text-xs px-3 py-1 rounded-full font-dm transition-all cursor-pointer whitespace-nowrap shrink-0 active:scale-95 ${
                    isSubActive
                      ? 'bg-[#ffdcc4] dark:bg-[#8d4e12]/40 text-[#8d4e12] dark:text-[#ffdcc4] font-bold border border-[#8d4e12]/30 shadow-2xs'
                      : 'text-[#494740] dark:text-zinc-400 hover:text-[#1b1c1a] dark:hover:text-white bg-[#f5f3ef] dark:bg-[#15151a] border border-[#EADBCE]/50 dark:border-white/5'
                  }`}
                >
                  {sub}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
