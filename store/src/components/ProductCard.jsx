import React, { useState } from 'react';
import { ShoppingBag, Eye, Star, Check, Sparkles } from 'lucide-react';

export default function ProductCard({
  product,
  currency,
  formatPrice,
  onAddToCart,
  onQuickView,
  isVipMember
}) {
  const [isAdded, setIsAdded] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(
    product.variants ? product.variants[0] : null
  );

  const effectivePrice = isVipMember 
    ? Math.round(product.priceGHS * 0.8) 
    : product.priceGHS;

  const handleAdd = (e) => {
    e.stopPropagation();
    onAddToCart({
      ...product,
      selectedVariant: selectedVariant ? selectedVariant.name : null
    });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const discountPercent = product.originalPriceGHS 
    ? Math.round(((product.originalPriceGHS - product.priceGHS) / product.originalPriceGHS) * 100) 
    : null;

  return (
    <div 
      onClick={() => onQuickView(product)}
      className="group bg-white dark:bg-[#0E0E10] border border-[#EADBCE] dark:border-white/10 hover:border-[#DEB573] dark:hover:border-[#DEB573]/60 rounded-2xl sm:rounded-3xl transition-all duration-300 shadow-sm hover:shadow-xl dark:shadow-none dark:hover:shadow-[0_10px_30px_rgba(222,181,115,0.1)] flex flex-col justify-between overflow-hidden cursor-pointer"
    >
      {/* Top Image & Badges Container */}
      <div className="relative aspect-4/3 w-full bg-[#FAF6F0] dark:bg-zinc-900 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-106 transition-transform duration-500"
          loading="lazy"
        />

        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Top Badges */}
        <div className="absolute top-2 left-2 right-2 sm:top-3 sm:left-3 sm:right-3 flex items-center justify-between gap-1 pointer-events-none">
          {isVipMember ? (
            <span className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold bg-[#DEB573] text-[#1A1615] shadow-xs">
              <Sparkles className="w-2.5 h-2.5" />
              <span>VIP -20%</span>
            </span>
          ) : product.badge ? (
            <span className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold bg-[#1A1615]/90 dark:bg-black/90 text-[#DEB573] backdrop-blur-xs shadow-xs border border-white/10 truncate max-w-[120px] sm:max-w-none">
              <Sparkles className="w-2.5 h-2.5 shrink-0" />
              <span className="truncate">{product.badge}</span>
            </span>
          ) : <span />}

          {discountPercent && (
            <span className="px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold bg-[#D96B6B] text-white shadow-xs">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Item Code & Page */}
        <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 flex items-center gap-1 pointer-events-none">
          <span className="px-1.5 sm:px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-mono font-bold bg-white/95 dark:bg-zinc-900/90 text-[#1A1615] dark:text-zinc-200 shadow-xs border border-white/10">
            #{selectedVariant ? selectedVariant.code : product.code}
          </span>
          <span className="px-1.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-medium bg-[#1A1615]/80 dark:bg-black/80 text-white backdrop-blur-xs">
            Pg {product.page}
          </span>
        </div>

        {/* Quick View Button overlay */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onQuickView(product);
          }}
          className="absolute right-2 bottom-2 sm:right-3 sm:bottom-3 w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-white/95 dark:bg-zinc-800 text-[#1A1615] dark:text-white hover:bg-[#1A1615] hover:text-[#DEB573] flex items-center justify-center opacity-90 sm:opacity-0 group-hover:opacity-100 transition-all shadow-md transform sm:translate-y-2 group-hover:translate-y-0 cursor-pointer"
          aria-label="Quick view product"
        >
          <Eye className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
        </button>
      </div>

      {/* Content Container */}
      <div className="p-3 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Subtitle / Line */}
          <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-[#8C7B72] dark:text-zinc-400 mb-0.5 sm:mb-1">
            <span className="truncate max-w-[120px] sm:max-w-[170px] uppercase font-bold tracking-wider text-[#C48B3B] dark:text-[#DEB573]">
              {product.category}
            </span>
            <span className="text-[10px]">{product.volume}</span>
          </div>

          {/* Product Name */}
          <h3 className="font-serif font-bold text-sm sm:text-lg text-[#1A1615] dark:text-white group-hover:text-[#C48B3B] dark:group-hover:text-[#DEB573] transition-colors line-clamp-1 sm:line-clamp-2 leading-snug">
            {product.name}
          </h3>

          <p className="text-[11px] sm:text-xs text-[#6E5D53] dark:text-zinc-400 line-clamp-1 sm:line-clamp-2 mt-0.5 sm:mt-1 leading-relaxed hidden sm:block">
            {product.subtitle}
          </p>

          {/* Rating */}
          <div className="flex items-center gap-1 mt-1 sm:mt-2">
            <div className="flex items-center text-[#DEB573]">
              <Star className="w-3 sm:w-3.5 h-3 sm:h-3.5 fill-current" />
            </div>
            <span className="text-[11px] sm:text-xs font-bold text-[#1A1615] dark:text-white">{product.rating}</span>
            <span className="text-[10px] sm:text-[11px] text-[#A8988E] dark:text-zinc-500">({product.reviewsCount})</span>
          </div>

          {/* Interactive Shade Swatches */}
          {product.variants && product.variants.length > 1 && (
            <div 
              className="pt-1.5 sm:pt-2.5 flex items-center gap-1 sm:gap-1.5"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="text-[9px] sm:text-[10px] uppercase font-bold text-[#8C7B72] dark:text-zinc-400 mr-0.5">Shades:</span>
              {product.variants.map((v) => (
                <button
                  key={v.code}
                  onClick={() => setSelectedVariant(v)}
                  className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border transition-transform cursor-pointer ${
                    selectedVariant?.code === v.code
                      ? 'scale-125 border-[#1A1615] dark:border-white ring-2 ring-[#DEB573]'
                      : 'border-white opacity-85 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: v.hex }}
                  title={v.name}
                />
              ))}
            </div>
          )}
        </div>

        {/* Price & Action */}
        <div className="mt-3 sm:mt-4 pt-2.5 sm:pt-3.5 border-t border-[#F5EFEB] dark:border-zinc-800 flex items-center justify-between gap-1 sm:gap-2">
          <div>
            <div className="text-sm sm:text-lg font-extrabold text-[#1A1615] dark:text-white">
              {formatPrice(effectivePrice)}
            </div>
            {isVipMember ? (
              <div className="text-[10px] sm:text-[11px] text-[#C48B3B] dark:text-[#DEB573] font-semibold line-through">
                {formatPrice(product.priceGHS)}
              </div>
            ) : product.originalPriceGHS ? (
              <div className="text-[10px] sm:text-xs text-[#A8988E] dark:text-zinc-500 line-through font-normal -mt-0.5">
                {formatPrice(product.originalPriceGHS)}
              </div>
            ) : null}
          </div>

          <button
            onClick={handleAdd}
            className={`px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-xs font-bold transition-all flex items-center gap-1 shadow-xs cursor-pointer ${
              isAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-[#FAF6F0] dark:bg-zinc-900 hover:bg-[#1A1615] dark:hover:bg-[#DEB573] text-[#1A1615] dark:text-zinc-200 hover:text-[#DEB573] dark:hover:text-[#1A1615] border border-[#EADBCE] dark:border-zinc-800'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
                <span className="hidden sm:inline">Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
