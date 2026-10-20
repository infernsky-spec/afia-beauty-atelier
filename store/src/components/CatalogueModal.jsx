import React, { useState } from 'react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  BookOpen, 
  Filter
} from 'lucide-react';

const CATALOGUE_PAGES = [
  { page: 1, title: 'Cover • North For Men Subzero Arctic Defense', category: 'Personal Care', src: '/catalog/page_1.jpg' },
  { page: 2, title: "Curator's Letter & Issue Index", category: 'All', src: '/catalog/page_2.jpg' },
  { page: 3, title: 'Niche Haute Parfumerie (Givaudan Paris Atelier)', category: 'Fragrance', src: '/catalog/page_3.jpg' },
  { page: 4, title: 'Activelle Invisible Fresh 48H Motion-Activated', category: 'Personal Care', src: '/catalog/page_4.jpg' },
  { page: 5, title: 'Love Nature Organic Tea Tree & Lime Clay Treatment', category: 'Skincare', src: '/catalog/page_5.jpg' },
  { page: 6, title: 'OnColour Luscious Gloss & High-Volume Mascaras', category: 'Makeup', src: '/catalog/page_6.jpg' },
  { page: 7, title: 'Giordani Gold Italian Heritage & Haitian Vetiver', category: 'Fragrance', src: '/catalog/page_7.jpg' },
  { page: 8, title: 'Novage+ 6-Nutrient Oil Capsules Clinical Protocol', category: 'Skincare', src: '/catalog/page_8.jpg' },
  { page: 9, title: 'Feminelle Prebiotic Lactic Acid Intimate Science', category: 'Personal Care', src: '/catalog/page_9.jpg' },
  { page: 10, title: 'Milk & Honey Gold Organic Sugar Scrub & Body Elixir', category: 'Personal Care', src: '/catalog/page_10.jpg' },
  { page: 11, title: 'Face of Nigeria 2026 Ambassador & THE ONE Mascaras', category: 'Makeup', src: '/catalog/page_11.jpg' },
  { page: 14, title: 'Sensory Seduction Fragrances & Accords', category: 'Fragrance', src: '/catalog/page_14.jpg' },
  { page: 15, title: 'Love Potion Spiced Ginger & Cocoa Blossom', category: 'Fragrance', src: '/catalog/page_15.jpg' },
  { page: 16, title: 'Greater Eau de Toilette for Her (Aura Technology)', category: 'Fragrance', src: '/catalog/page_16.jpg' },
  { page: 19, title: 'Glacier Rock Sub-Zero Mineral Citrus for Men', category: 'Fragrance', src: '/catalog/page_19.jpg' },
  { page: 21, title: 'Greater Eau de Toilette for Him (Aura Technology)', category: 'Fragrance', src: '/catalog/page_21.jpg' },
  { page: 24, title: 'Optimals Even Out Hyperpigmentation & UniTone', category: 'Skincare', src: '/catalog/page_24.jpg' },
  { page: 25, title: 'Novage+ 4-Step Bio-Cellular Restorative Regimen', category: 'Skincare', src: '/catalog/page_25.jpg' },
  { page: 27, title: 'Novage+ Cellular Defense & Lipid Preservation', category: 'Skincare', src: '/catalog/page_27.jpg' },
  { page: 29, title: 'Wellosophy Clinical Nutrition & Protein Shakes', category: 'Nutrition & Wellness', src: '/catalog/page_29.jpg' },
  { page: 30, title: 'Wellosophy Daily Wellness Pack for Women (Sachets)', category: 'Nutrition & Wellness', src: '/catalog/page_30.jpg' },
  { page: 31, title: 'Wellosophy 22-Micronutrient Female Balance Formula', category: 'Nutrition & Wellness', src: '/catalog/page_31.jpg' },
  { page: 32, title: 'Duologi Hair Care & Oat Peptide Keratin Repair', category: 'Personal Care', src: '/catalog/page_32.jpg' },
  { page: 35, title: 'Love Nature Organic Botanical Body Elixirs', category: 'Personal Care', src: '/catalog/page_35.jpg' },
];

export default function CatalogueModal({
  isOpen,
  onClose,
  onFilterByPage
}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!isOpen) return null;

  const currentPage = CATALOGUE_PAGES[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % CATALOGUE_PAGES.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + CATALOGUE_PAGES.length) % CATALOGUE_PAGES.length);
  };

  const handleFilterThisPage = () => {
    onFilterByPage(currentPage.page);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-5xl bg-[#141210] dark:bg-[#000000] text-[#FAF8F5] rounded-3xl border border-white/10 shadow-2xl overflow-hidden max-h-[96vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:px-6 border-b border-white/10 flex items-center justify-between bg-[#1E1B19] dark:bg-[#0A0A0C]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#DEB573] text-[#141210] flex items-center justify-center font-bold">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>Oriflame E-Catalogue (Oct – Dec 2026)</span>
                <span className="font-mono text-[10px] px-2.5 py-0.5 rounded-full bg-white/10 text-[#DEB573]">
                  Page {currentPage.page} / 40
                </span>
              </h3>
              <p className="text-[11px] text-[#A8988E]">
                {currentPage.title}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleFilterThisPage}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#DEB573] hover:bg-[#F5DFC2] text-[#141210] text-xs font-bold transition-colors cursor-pointer"
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Show Items on this Page</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-[#A8988E] hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close flipbook"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Viewport Image */}
        <div className="relative flex-1 bg-black flex items-center justify-center p-3 sm:p-6 overflow-hidden min-h-[420px]">
          <img
            src={currentPage.src}
            alt={currentPage.title}
            className="max-h-[70vh] w-auto max-w-full object-contain rounded-2xl shadow-2xl transition-all duration-300 border border-white/10"
          />

          <button
            onClick={handlePrev}
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center border border-white/20 transition-all cursor-pointer hover:scale-105"
            aria-label="Previous page"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center border border-white/20 transition-all cursor-pointer hover:scale-105"
            aria-label="Next page"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Footer Thumbnails */}
        <div className="p-3 sm:p-4 bg-[#1E1B19] dark:bg-[#0A0A0C] border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto max-w-full sm:max-w-2xl py-1 no-scrollbar">
            {CATALOGUE_PAGES.map((pg, idx) => (
              <button
                key={pg.page}
                onClick={() => setCurrentIndex(idx)}
                className={`relative shrink-0 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                  currentIndex === idx
                    ? 'border-[#DEB573] scale-105 shadow-md'
                    : 'border-transparent opacity-50 hover:opacity-100'
                }`}
              >
                <img src={pg.src} alt={pg.title} className="w-10 h-14 object-cover" />
                <span className="absolute bottom-0 inset-x-0 bg-black/90 text-[8px] text-center font-bold">
                  {pg.page}
                </span>
              </button>
            ))}
          </div>

          <button
            onClick={handleFilterThisPage}
            className="sm:hidden w-full py-2.5 rounded-full bg-[#DEB573] text-[#1A1615] text-xs font-bold text-center"
          >
            Filter Page Items
          </button>
        </div>
      </div>
    </div>
  );
}
