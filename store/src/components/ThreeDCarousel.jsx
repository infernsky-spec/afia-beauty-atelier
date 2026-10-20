import React, { useState, useEffect, useRef } from 'react';
import storeConfig from '../config/store.config';
import { 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  ShoppingBag, 
  Eye, 
  ArrowRight
} from 'lucide-react';

export default function ThreeDCarousel({
  products,
  onQuickView,
  onAddToCart,
  formatPrice
}) {
  const configuredIds = storeConfig.carousel?.featuredProductIds || [];
  const selectedFromConfig = configuredIds
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean);

  const carouselItems = selectedFromConfig.length >= 3 
    ? selectedFromConfig 
    : products.slice(0, 6);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1024
  );
  const autoPlayRef = useRef(null);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % carouselItems.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + carouselItems.length) % carouselItems.length);
  };

  // Touch Swipe Handlers for mobile phones
  const handleTouchStart = (e) => {
    setIsPaused(true);
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    setIsPaused(false);
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 45;
    const isRightSwipe = distance < -45;

    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }
  };

  useEffect(() => {
    if (isPaused) return;
    autoPlayRef.current = setInterval(() => {
      handleNext();
    }, 4500);

    return () => clearInterval(autoPlayRef.current);
  }, [activeIndex, isPaused, carouselItems.length]);

  if (carouselItems.length === 0) return null;

  return (
    <section 
      className="relative py-10 sm:py-20 bg-gradient-to-b from-[#FAF6F0] via-[#F4ECE1] to-[#FAF6F0] dark:from-[#000000] dark:via-[#080808] dark:to-[#000000] overflow-hidden border-y border-[#EADBCE]/80 dark:border-white/10 transition-colors duration-300"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Warm Ambient Glowing Halos */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[700px] h-[250px] sm:h-[350px] bg-gradient-to-r from-[#FDE8DF] via-[#F5DFC2] to-[#FCEADE] dark:from-[#DEB573]/10 dark:via-[#8C714D]/15 dark:to-transparent rounded-full blur-3xl opacity-70 dark:opacity-50 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-14 space-y-2 sm:space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full bg-[#1A1615] dark:bg-zinc-900 border border-transparent dark:border-zinc-800 text-[#DEB573] text-[11px] sm:text-xs font-bold uppercase tracking-wider shadow-md">
            <Sparkles className="w-3.5 h-3.5 text-[#DEB573]" />
            <span>{storeConfig.carousel?.badge || 'Featured Collection'}</span>
          </div>

          <h2 className="font-serif text-2xl sm:text-5xl font-medium text-[#1A1615] dark:text-white leading-tight tracking-tight">
            {storeConfig.carousel?.title || 'Curated Highlights'}
          </h2>

          <p className="text-xs sm:text-base text-[#6E5D53] dark:text-zinc-400 font-light leading-relaxed">
            {storeConfig.carousel?.subtitle || 'Swipe or rotate through our star items.'}
          </p>
        </div>

        {/* 3D Stage Container */}
        <div className="relative h-[410px] sm:h-[500px] w-full flex items-center justify-center perspective-[1000px] sm:perspective-[1200px]">
          {carouselItems.map((item, index) => {
            const count = carouselItems.length;
            let offset = (index - activeIndex) % count;
            if (offset > count / 2) offset -= count;
            if (offset < -count / 2) offset += count;

            const isCenter = offset === 0;
            const absOffset = Math.abs(offset);

            if (absOffset > 2) return null;

            // Responsive offset calculations for mobile vs desktop
            const isMobile = windowWidth < 640;
            const stepX = isMobile ? 120 : 220;
            const stepZ = isMobile ? 90 : 140;

            const translateX = offset * stepX;
            const translateZ = -absOffset * stepZ;
            const rotateY = offset * -26;
            const scale = 1 - absOffset * (isMobile ? 0.12 : 0.15);
            const opacity = 1 - absOffset * 0.28;
            const zIndex = 30 - absOffset * 10;

            return (
              <div
                key={item.id}
                onClick={() => {
                  if (isCenter) {
                    onQuickView(item);
                  } else {
                    setActiveIndex(index);
                  }
                }}
                style={{
                  transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                  opacity,
                  zIndex,
                  transition: 'all 500ms cubic-bezier(0.25, 1, 0.5, 1)'
                }}
                className={`absolute w-[240px] sm:w-[320px] rounded-3xl bg-white dark:bg-[#0E0E10] border cursor-pointer select-none overflow-hidden group shadow-xl sm:shadow-2xl ${
                  isCenter 
                    ? 'border-[#DEB573] ring-2 sm:ring-4 ring-[#DEB573]/20 shadow-[0_20px_50px_-15px_rgba(212,163,89,0.35)] dark:shadow-[0_20px_50px_-15px_rgba(222,181,115,0.2)]' 
                    : 'border-[#EADBCE] dark:border-zinc-800 hover:border-[#DEB573]/60'
                }`}
              >
                {/* Product Image Frame */}
                <div className="relative aspect-4/3 w-full bg-[#FAF6F0] dark:bg-zinc-900 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-700"
                  />

                  {/* Gradient bottom shade */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-wider bg-[#1A1615]/90 dark:bg-black/90 text-[#DEB573] backdrop-blur-md shadow-sm border border-white/10 truncate max-w-[140px]">
                      {item.badge || item.category}
                    </span>

                    <span className="px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-mono font-bold bg-white/95 text-[#1A1615] shadow-xs">
                      Pg {item.page}
                    </span>
                  </div>

                  {/* Code on image */}
                  <div className="absolute bottom-2.5 left-2.5">
                    <span className="px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-mono font-bold bg-[#1A1615]/90 text-[#FAF6F0] border border-white/10">
                      #{item.code}
                    </span>
                  </div>
                </div>

                {/* Card Information */}
                <div className="p-4 sm:p-5 flex flex-col justify-between space-y-2 sm:space-y-3 bg-white dark:bg-[#0E0E10]">
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-[#8C7B72] dark:text-zinc-400 mb-0.5">
                      <span className="font-semibold uppercase tracking-wider text-[#C48B3B] dark:text-[#DEB573] text-[10px] sm:text-xs">
                        {item.category}
                      </span>
                      <span>{item.volume}</span>
                    </div>

                    <h3 className="font-serif text-base sm:text-xl font-bold text-[#1A1615] dark:text-white group-hover:text-[#C48B3B] dark:group-hover:text-[#DEB573] transition-colors line-clamp-1 leading-snug">
                      {item.name}
                    </h3>

                    <p className="text-[11px] sm:text-xs text-[#6E5D53] dark:text-zinc-400 line-clamp-1 sm:line-clamp-2 mt-0.5 leading-relaxed">
                      {item.subtitle}
                    </p>
                  </div>

                  {/* Price & Action */}
                  <div className="pt-2 sm:pt-3 border-t border-[#F5EFEB] dark:border-zinc-800 flex items-center justify-between gap-1.5 sm:gap-2">
                    <div>
                      <div className="text-sm sm:text-lg font-bold text-[#1A1615] dark:text-white">
                        {formatPrice(item.priceGHS)}
                      </div>
                      {item.originalPriceGHS && (
                        <div className="text-[10px] sm:text-[11px] text-[#A8988E] dark:text-zinc-500 line-through font-normal">
                          {formatPrice(item.originalPriceGHS)}
                        </div>
                      )}
                    </div>

                    {isCenter ? (
                      <div className="flex items-center gap-1 sm:gap-1.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onAddToCart(item);
                          }}
                          className="px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-full bg-[#1A1615] dark:bg-[#DEB573] hover:bg-[#DEB573] text-white dark:text-[#1A1615] text-[11px] sm:text-xs font-bold transition-all shadow-md flex items-center gap-1 cursor-pointer"
                        >
                          <ShoppingBag className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
                          <span>Add</span>
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onQuickView(item);
                          }}
                          className="p-1.5 sm:p-2 rounded-full bg-[#FAF6F0] dark:bg-zinc-800 hover:bg-[#EADBCE] text-[#1A1615] dark:text-white border border-[#EADBCE] dark:border-zinc-700 transition-colors cursor-pointer"
                          aria-label="Quick view"
                        >
                          <Eye className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-[10px] sm:text-[11px] font-semibold text-[#C48B3B] dark:text-[#DEB573] group-hover:underline flex items-center gap-0.5">
                        <span>View</span>
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Left / Right Controls */}
          <button
            onClick={handlePrev}
            className="absolute left-1 sm:left-10 z-40 w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-white/90 dark:bg-zinc-900/90 hover:bg-[#1A1615] dark:hover:bg-white text-[#1A1615] dark:text-white hover:text-[#DEB573] dark:hover:text-[#1A1615] border border-[#EADBCE] dark:border-zinc-700 shadow-xl flex items-center justify-center transition-all hover:scale-105 cursor-pointer"
            aria-label="Previous 3D slide"
          >
            <ChevronLeft className="w-5 sm:w-6 h-5 sm:h-6" />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-1 sm:right-10 z-40 w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-white/90 dark:bg-zinc-900/90 hover:bg-[#1A1615] dark:hover:bg-white text-[#1A1615] dark:text-white hover:text-[#DEB573] dark:hover:text-[#1A1615] border border-[#EADBCE] dark:border-zinc-700 shadow-xl flex items-center justify-center transition-all hover:scale-105 cursor-pointer"
            aria-label="Next 3D slide"
          >
            <ChevronRight className="w-5 sm:w-6 h-5 sm:h-6" />
          </button>
        </div>

        {/* Carousel Dots */}
        <div className="flex items-center justify-center gap-2 mt-4 sm:mt-6">
          {carouselItems.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                activeIndex === idx 
                  ? 'w-6 sm:w-8 bg-[#DEB573]' 
                  : 'w-2 bg-[#D9CBBE] dark:bg-zinc-700 hover:bg-[#BBA796]'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
