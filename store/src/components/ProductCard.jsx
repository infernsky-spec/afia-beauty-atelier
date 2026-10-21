import React, { useState } from 'react';
import { ShoppingBag, Eye, Star, Heart, Check, Sparkles } from 'lucide-react';

export default function ProductCard({
  product,
  currency,
  formatPrice,
  onAddToCart,
  onQuickView,
  isVipMember
}) {
  const [isAdded, setIsAdded] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
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
    setTimeout(() => setIsAdded(false), 1400);
  };

  const handleToggleWishlist = (e) => {
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  const discountPercent = product.originalPriceGHS 
    ? Math.round(((product.originalPriceGHS - product.priceGHS) / product.originalPriceGHS) * 100) 
    : null;

  return (
    <div 
      onClick={() => onQuickView(product)}
      className="group flex flex-col justify-between bg-white dark:bg-[#15151a] rounded-2xl p-2.5 sm:p-3.5 shadow-[0_4px_16px_-2px_rgba(28,27,25,0.04)] hover:shadow-[0_12px_28px_-4px_rgba(141,78,18,0.12)] border border-[#EADBCE]/80 dark:border-white/10 hover:border-[#8d4e12]/40 dark:hover:border-[#ffdcc4]/30 transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 cursor-pointer overflow-hidden"
    >
      {/* Stitch 4:5 Aspect Ratio Image Canvas */}
      <div className="relative w-full aspect-[4/5] rounded-xl bg-[#FAF6F0] dark:bg-zinc-950 overflow-hidden flex items-center justify-center">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-600 ease-[cubic-bezier(0.16,1,0.3,1)]"
          loading="lazy"
        />

        {/* Soft Vignette Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        {/* Floating Wishlist Button (Stitch Pattern) */}
        <button
          onClick={handleToggleWishlist}
          aria-label={isWishlisted ? "Remove from wishlist" : "Save to wishlist"}
          className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full backdrop-blur-md flex items-center justify-center active:scale-90 transition-all duration-200 shadow-xs z-10 ${
            isWishlisted 
              ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/80 dark:text-rose-400' 
              : 'bg-white/85 dark:bg-black/75 text-[#1b1c1a] dark:text-white hover:text-rose-600'
          }`}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Top-Left Category / Discount Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start pointer-events-none z-10">
          {isVipMember ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-dm font-bold bg-[#8d4e12] text-white shadow-xs">
              <Sparkles className="w-2.5 h-2.5 fill-current" />
              <span>VIP -20%</span>
            </span>
          ) : product.badge ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-dm font-bold bg-[#1b1c1a]/90 dark:bg-black/90 text-[#ffdcc4] backdrop-blur-md shadow-xs border border-white/10 truncate max-w-[110px] sm:max-w-none">
              <Sparkles className="w-2.5 h-2.5 shrink-0" />
              <span className="truncate">{product.badge}</span>
            </span>
          ) : null}

          {discountPercent && (
            <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-rose-600 text-white shadow-xs">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Bottom Image Micro Tags */}
        <div className="absolute bottom-2 left-2 flex items-center gap-1 pointer-events-none z-10">
          <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-white/90 dark:bg-black/80 text-[#1b1c1a] dark:text-zinc-200 backdrop-blur-xs border border-white/10 shadow-xs">
            #{selectedVariant ? selectedVariant.code : product.code}
          </span>
          <span className="px-1.5 py-0.5 rounded-full text-[9px] font-dm font-medium bg-[#1b1c1a]/80 text-[#ffdcc4] backdrop-blur-xs">
            Pg {product.page}
          </span>
        </div>

        {/* Quick View Floating Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onQuickView(product);
          }}
          className="absolute right-2 bottom-2 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/90 dark:bg-[#1a1a20]/90 text-[#1b1c1a] dark:text-white hover:bg-[#8d4e12] hover:text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-md transform translate-y-1 group-hover:translate-y-0 cursor-pointer active:scale-90 z-10"
          aria-label="Quick inspect formulation"
        >
          <Eye className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Stitch Content Container */}
      <div className="pt-2.5 pb-1 px-1 flex flex-col flex-1 justify-between">
        <div>
          {/* Eyebrow: Brand & Category */}
          <div className="flex items-center justify-between text-[10px] text-[#7a776f] dark:text-zinc-400">
            <span className="font-dm uppercase tracking-wider font-semibold text-[#8d4e12] dark:text-[#ffdcc4] truncate">
              {product.category}
            </span>
            <span className="text-[10px] font-mono">{product.volume}</span>
          </div>

          {/* Product Name */}
          <h4 className="font-dm font-bold text-xs sm:text-sm text-[#1b1c1a] dark:text-white mt-0.5 line-clamp-1 group-hover:text-[#8d4e12] dark:group-hover:text-[#ffdcc4] transition-colors leading-tight">
            {product.name}
          </h4>

          {/* Subtitle / Key Actives */}
          <p className="text-[11px] text-[#494740] dark:text-zinc-400 line-clamp-1 mt-0.5 font-dm hidden sm:block">
            {product.subtitle}
          </p>

          {/* Rating */}
          <div className="flex items-center gap-1 mt-1">
            <Star className="w-3 h-3 text-[#DEB573] fill-current" />
            <span className="text-[11px] font-dm font-bold text-[#1b1c1a] dark:text-white">{product.rating}</span>
            <span className="text-[10px] text-[#7a776f] dark:text-zinc-500 font-mono">({product.reviewsCount})</span>
          </div>
        </div>

        {/* Price & Action / Shade Dots Row (Stitch Pattern) */}
        <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-[#EADBCE]/50 dark:border-white/5">
          <div className="min-w-0 pr-1">
            <div className="font-dm font-bold text-xs sm:text-sm text-[#1b1c1a] dark:text-white">
              {formatPrice(effectivePrice)}
            </div>
            {isVipMember ? (
              <div className="text-[10px] text-[#8d4e12] dark:text-[#ffdcc4] font-semibold line-through">
                {formatPrice(product.priceGHS)}
              </div>
            ) : product.originalPriceGHS ? (
              <div className="text-[10px] text-[#7a776f] dark:text-zinc-500 line-through">
                {formatPrice(product.originalPriceGHS)}
              </div>
            ) : null}
          </div>

          {/* Right Action: Shade Swatches or Tactile Quick Add */}
          <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
            {product.variants && product.variants.length > 1 ? (
              <div className="flex items-center gap-1">
                {product.variants.slice(0, 3).map((v) => (
                  <button
                    key={v.code}
                    onClick={() => setSelectedVariant(v)}
                    className={`w-3 h-3 rounded-full border transition-transform cursor-pointer ${
                      selectedVariant?.code === v.code
                        ? 'scale-125 border-[#1b1c1a] dark:border-white ring-1 ring-[#8d4e12]'
                        : 'border-white dark:border-zinc-800 opacity-80 hover:opacity-100 hover:scale-110'
                    }`}
                    style={{ backgroundColor: v.hex }}
                    title={v.name}
                  />
                ))}
                {product.variants.length > 3 && (
                  <span className="text-[9px] text-[#7a776f] font-mono">+{product.variants.length - 3}</span>
                )}
              </div>
            ) : null}

            {/* Quick Add Pill Button */}
            <button
              onClick={handleAdd}
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs transition-all duration-300 shadow-xs cursor-pointer active:scale-85 ${
                isAdded
                  ? 'bg-emerald-600 text-white shadow-emerald-500/20'
                  : 'bg-[#1b1c1a] dark:bg-white text-white dark:text-[#1b1c1a] hover:bg-[#8d4e12] dark:hover:bg-[#DEB573]'
              }`}
              title="Add to vanity bag"
              aria-label="Add to cart"
            >
              {isAdded ? <Check className="w-3.5 h-3.5" /> : <ShoppingBag className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
