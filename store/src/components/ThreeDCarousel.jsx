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
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef(0);
  const isMouseDownRef = useRef(false);

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

  // Touch Swipe Handlers for mobile phones with live tracking
  const handleTouchStart = (e) => {
    setIsPaused(true);
    setIsDragging(true);
    startXRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const currentX = e.targetTouches[0].clientX;
    const delta = currentX - startXRef.current;
    // Dampen drag past bounds
    setDragOffset(delta);
  };

  const handleTouchEnd = () => {
    setIsPaused(false);
    setIsDragging(false);
    if (Math.abs(dragOffset) > 40) {
      if (dragOffset < 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    setDragOffset(0);
  };

  // Mouse Drag Handlers for Desktop / Laptop
  const handleMouseDown = (e) => {
    isMouseDownRef.current = true;
    setIsDragging(true);
    setIsPaused(true);
    startXRef.current = e.clientX;
  };

  const handleMouseMove = (e) => {
    if (!isMouseDownRef.current) return;
    const delta = e.clientX - startXRef.current;
    setDragOffset(delta);
  };

  const handleMouseUp = () => {
    if (!isMouseDownRef.current) return;
    isMouseDownRef.current = false;
    setIsDragging(false);
    setIsPaused(false);
    if (Math.abs(dragOffset) > 40) {
      if (dragOffset < 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    setDragOffset(0);
  };

  useEffect(() => {
    if (isPaused || isDragging) return;
    autoPlayRef.current = setInterval(() => {
      handleNext();
    }, 5000);

    return () => clearInterval(autoPlayRef.current);
  }, [activeIndex, isPaused, isDragging, carouselItems.length]);

  if (carouselItems.length === 0) return null;

  return (
    <section 
      className="relative py-12 sm:py-24 bg-gradient-to-b from-[#FAF6F0] via-[#F4ECE1] to-[#FAF6F0] dark:from-[#000000] dark:via-[#070709] dark:to-[#000000] overflow-hidden border-y border-[#EADBCE]/80 dark:border-white/10 transition-colors duration-400 select-none cursor-grab active:cursor-grabbing"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => {
        setIsPaused(false);
        if (isMouseDownRef.current) handleMouseUp();
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {/* Warm Ambient Glowing Halos */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[750px] h-[250px] sm:h-[400px] bg-gradient-to-r from-[#FDE8DF] via-[#F5DFC2] to-[#FCEADE] dark:from-[#DEB573]/12 dark:via-[#8C714D]/15 dark:to-transparent rounded-full blur-3xl opacity-70 dark:opacity-60 pointer-events-none transition-all duration-700" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-16 space-y-2.5 sm:space-y-3.5">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1A1615] dark:bg-[#121218] border border-transparent dark:border-white/10 text-[#DEB573] text-[11px] sm:text-xs font-bold uppercase tracking-widest shadow-md">
            <Sparkles className="w-3.5 h-3.5 text-[#DEB573]" />
            <span>{storeConfig.carousel?.badge || 'Featured Collection'}</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl font-medium text-[#1A1615] dark:text-white leading-tight tracking-tight">
            {storeConfig.carousel?.title || 'Curated Swedish Masterpieces'}
          </h2>

          <p className="text-xs sm:text-base text-[#6E5D53] dark:text-zinc-400 font-light leading-relaxed">
            {storeConfig.carousel?.subtitle || 'Fluid 3D perspective gallery. Drag or click cards to explore formulation accords.'}
          </p>
        </div>

        {/* 3D Stage Container */}
        <div className="relative h-[420px] sm:h-[520px] w-full flex items-center justify-center perspective-[1100px] sm:perspective-[1400px]">
          {carouselItems.map((item, index) => {
            const count = carouselItems.length;
            let offset = (index - activeIndex) % count;
            if (offset > count / 2) offset -= count;
            if (offset < -count / 2) offset += count;

            const isMobile = windowWidth < 640;
            const dragInfluence = dragOffset / (isMobile ? 220 : 360);
            const dynamicOffset = offset + dragInfluence;

            const isCenter = Math.abs(dynamicOffset) < 0.45;
            const absOffset = Math.abs(dynamicOffset);

            if (absOffset > 2.6) return null;

            // Responsive offset calculations for mobile vs desktop
            const stepX = isMobile ? 120 : 230;
            const stepZ = isMobile ? 95 : 150;

            const translateX = dynamicOffset * stepX;
            const translateZ = -absOffset * stepZ;
            const rotateY = dynamicOffset * -22;
            const scale = Math.max(0.7, 1 - absOffset * (isMobile ? 0.12 : 0.14));
            const opacity = Math.max(0, 1 - absOffset * 0.28);
            const zIndex = Math.round(30 - absOffset * 10);

            return (
              <div
                key={item.id}
                onClick={() => {
                  if (Math.abs(dragOffset) > 5) return;
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
                  transition: isDragging
                    ? 'none'
                    : 'transform 650ms cubic-bezier(0.16, 1, 0.3, 1), opacity 650ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 500ms ease, border-color 300ms ease',
                  willChange: 'transform, opacity'
                }}
                className={`absolute w-[240px] sm:w-[330px] rounded-3xl bg-white dark:bg-[#0E0E14] border cursor-pointer select-none overflow-hidden group shadow-xl sm:shadow-2xl ${
                  isCenter 
                    ? 'border-[#DEB573] ring-2 sm:ring-4 ring-[#DEB573]/25 shadow-[0_25px_60px_-15px_rgba(212,163,89,0.4)] dark:shadow-[0_25px_60px_-15px_rgba(222,181,115,0.25)]' 
                    : 'border-[#EADBCE] dark:border-white/10 hover:border-[#DEB573]/60'
                }`}
              >
                {/* Product Image Frame */}
                <div className="relative aspect-4/3 w-full bg-[#FAF6F0] dark:bg-zinc-950 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-none"
                  />

                  {/* Gradient bottom shade */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                  {/* Top Badges */}
                  <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
                    <span className="px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-wider bg-[#1A1615]/90 dark:bg-black/90 text-[#DEB573] backdrop-blur-md shadow-sm border border-white/10 truncate max-w-[140px]">
                      {item.badge || item.category}
                    </span>

                    <span className="px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-mono font-bold bg-white/95 text-[#1A1615] shadow-xs">
                      Pg {item.page}
                    </span>
                  </div>

                  {/* Code on image */}
                  <div className="absolute bottom-2.5 left-2.5 pointer-events-none">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-mono font-bold bg-[#1A1615]/90 text-[#FAF6F0] border border-white/10">
                      #{item.code}
                    </span>
                  </div>
                </div>

                {/* Card Information */}
                <div className="p-4 sm:p-5 flex flex-col justify-between space-y-2.5 sm:space-y-3.5 bg-white dark:bg-[#0E0E14]">
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-[#8C7B72] dark:text-zinc-400 mb-0.5">
                      <span className="font-semibold uppercase tracking-wider text-[#C48B3B] dark:text-[#DEB573] text-[10px] sm:text-xs">
                        {item.category}
                      </span>
                      <span className="font-mono text-[10px]">{item.volume}</span>
                    </div>

                    <h3 className="font-serif text-base sm:text-xl font-bold text-[#1A1615] dark:text-white group-hover:text-[#C48B3B] dark:group-hover:text-[#DEB573] transition-colors line-clamp-1 leading-snug">
                      {item.name}
                    </h3>

                    <p className="text-[11px] sm:text-xs text-[#6E5D53] dark:text-zinc-400 line-clamp-1 sm:line-clamp-2 mt-0.5 leading-relaxed">
                      {item.subtitle}
                    </p>
                  </div>

                  {/* Price & Action */}
                  <div className="pt-2.5 sm:pt-3.5 border-t border-[#F5EFEB] dark:border-white/8 flex items-center justify-between gap-1.5 sm:gap-2">
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
                          className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-[#1A1615] dark:bg-[#DEB573] hover:bg-[#DEB573] text-white dark:text-[#1A1615] text-[11px] sm:text-xs font-bold transition-all shadow-md flex items-center gap-1 cursor-pointer active:scale-95"
                        >
                          <ShoppingBag className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
                          <span>Add</span>
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onQuickView(item);
                          }}
                          className="p-1.5 sm:p-2 rounded-full bg-[#FAF6F0] dark:bg-white/10 hover:bg-[#EADBCE] dark:hover:bg-white/20 text-[#1A1615] dark:text-white border border-[#EADBCE] dark:border-white/10 transition-colors cursor-pointer active:scale-95"
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
            className="absolute left-1 sm:left-10 z-40 w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-white/95 dark:bg-[#121218]/90 hover:bg-[#1A1615] dark:hover:bg-[#DEB573] text-[#1A1615] dark:text-white hover:text-[#DEB573] dark:hover:text-[#1A1615] border border-[#EADBCE] dark:border-white/10 shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer backdrop-blur-md"
            aria-label="Previous 3D slide"
          >
            <ChevronLeft className="w-5 sm:w-6 h-5 sm:h-6" />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-1 sm:right-10 z-40 w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-white/95 dark:bg-[#121218]/90 hover:bg-[#1A1615] dark:hover:bg-[#DEB573] text-[#1A1615] dark:text-white hover:text-[#DEB573] dark:hover:text-[#1A1615] border border-[#EADBCE] dark:border-white/10 shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer backdrop-blur-md"
            aria-label="Next 3D slide"
          >
            <ChevronRight className="w-5 sm:w-6 h-5 sm:h-6" />
          </button>
        </div>

        {/* Carousel Pagination Dots */}
        <div className="flex items-center justify-center gap-2 mt-4 sm:mt-8">
          {carouselItems.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`h-2 rounded-full transition-all duration-400 cursor-pointer ${
                activeIndex === idx 
                  ? 'w-8 sm:w-10 bg-[#DEB573] shadow-md shadow-[#DEB573]/30' 
                  : 'w-2 bg-[#D9CBBE] dark:bg-white/20 hover:bg-[#BBA796]'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
