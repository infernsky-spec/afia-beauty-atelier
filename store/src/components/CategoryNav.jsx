import React from 'react';
import { 
  Flame, 
  Droplets, 
  Sparkles, 
  Smile, 
  Apple, 
  LayoutGrid 
} from 'lucide-react';

const CATEGORIES = [
  { id: 'All', name: 'All Collection', icon: LayoutGrid },
  { id: 'Fragrance', name: 'Fragrance & Niche', icon: Flame },
  { id: 'Skincare', name: 'Novage+ Skincare', icon: Droplets },
  { id: 'Makeup', name: 'THE ONE Makeup', icon: Sparkles },
  { id: 'Personal Care', name: 'Personal Care & Body', icon: Smile },
  { id: 'Nutrition & Wellness', name: 'Wellosophy Nutrition', icon: Apple },
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
    <div className="bg-white dark:bg-[#000000] border-b border-[#EADBCE] dark:border-white/10 sticky top-[105px] sm:top-[113px] z-30 shadow-xs transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Categories Row */}
        <div className="flex items-center gap-2 overflow-x-auto py-3.5 no-scrollbar scroll-smooth">
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
                className={`flex items-center gap-2 px-4.5 py-2 rounded-full text-xs sm:text-sm font-bold tracking-wide whitespace-nowrap transition-all cursor-pointer shrink-0 shadow-xs ${
                  isActive
                    ? 'bg-[#1A1615] dark:bg-[#DEB573] text-white dark:text-[#1A1615] shadow-md'
                    : 'bg-[#FAF6F0] dark:bg-zinc-900 text-[#6E5D53] dark:text-zinc-300 hover:bg-[#F5EFEB] dark:hover:bg-zinc-800 hover:text-[#1A1615] dark:hover:text-white border border-transparent hover:border-[#EADBCE] dark:hover:border-zinc-700'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isActive ? 'text-[#DEB573] dark:text-[#1A1615]' : 'text-[#8C7B72] dark:text-[#DEB573]'}`} />
                <span>{cat.name}</span>
                <span className={`text-[11px] px-2 py-0.2 rounded-full font-bold ${
                  isActive 
                    ? 'bg-[#26201E] dark:bg-[#1A1615] text-[#DEB573]' 
                    : 'bg-[#EADBCE]/70 dark:bg-zinc-800 text-[#8C7B72] dark:text-zinc-400'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Subcategories Row */}
        {subCategories && subCategories.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-3 pt-1 border-t border-[#F5EFEB] dark:border-zinc-900">
            <span className="text-[11px] uppercase tracking-wider text-[#8C7B72] dark:text-zinc-400 font-bold mr-1 shrink-0">
              Filter by:
            </span>
            {subCategories.map((sub) => {
              const isSubActive = activeSubCategory === sub;
              return (
                <button
                  key={sub}
                  onClick={() => onSelectSubCategory(sub)}
                  className={`text-xs px-3.5 py-1 rounded-full transition-all cursor-pointer whitespace-nowrap ${
                    isSubActive
                      ? 'bg-[#DEB573]/25 dark:bg-[#DEB573] text-[#9B681C] dark:text-[#1A1615] font-bold border border-[#DEB573]'
                      : 'text-[#6E5D53] dark:text-zinc-400 hover:text-[#1A1615] dark:hover:text-white bg-[#FAF6F0] dark:bg-zinc-900 border border-[#EADBCE]/60 dark:border-zinc-800'
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
