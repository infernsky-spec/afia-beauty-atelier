import React, { useState } from 'react';
import { 
  X, 
  ShoppingBag, 
  Phone, 
  Star, 
  CheckCircle2, 
  Sparkles, 
  Plus, 
  Minus 
} from 'lucide-react';

export default function ProductModal({
  product,
  onClose,
  onAddToCart,
  formatPrice,
  currency,
  isVipMember
}) {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(
    product.variants ? product.variants[0] : null
  );

  if (!product) return null;

  const effectivePrice = isVipMember
    ? Math.round(product.priceGHS * 0.8)
    : product.priceGHS;

  const formattedTotalPrice = formatPrice(effectivePrice * qty);

  const handleAddToCart = () => {
    onAddToCart({
      ...product,
      selectedVariant: selectedVariant ? selectedVariant.name : null
    }, qty);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 1200);
  };

  const waText = encodeURIComponent(
    `Hello Afia! I would like to order:\n\n*Product:* ${product.name}\n*Item Code:* #${selectedVariant ? selectedVariant.code : product.code}\n` +
    (selectedVariant ? `*Selected Shade:* ${selectedVariant.name}\n` : '') +
    `*Quantity:* ${qty}\n*Catalogue Page:* Pg ${product.page}\n*Total:* ${formattedTotalPrice}\n` +
    (isVipMember ? `*Tier:* VIP Wholesale -20%\n` : '') +
    `\nPlease confirm availability and delivery timeframe. Thank you!`
  );
  const waUrl = `https://wa.me/233240000000?text=${waText}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl bg-white dark:bg-[#0E0E10] text-[#1A1615] dark:text-white rounded-3xl shadow-2xl border border-[#EADBCE] dark:border-white/10 overflow-hidden max-h-[92vh] flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/95 dark:bg-zinc-800 hover:bg-[#1A1615] text-[#1A1615] dark:text-white hover:text-[#DEB573] flex items-center justify-center shadow-md transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Column: Image & Badges */}
        <div className="md:w-1/2 relative bg-[#FAF6F0] dark:bg-zinc-950 flex flex-col justify-between p-6">
          <div className="flex flex-col gap-1.5 self-start">
            {isVipMember ? (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-[#DEB573] text-[#1A1615] shadow-xs">
                <Sparkles className="w-3 h-3" />
                <span>VIP Wholesale -20%</span>
              </span>
            ) : product.badge ? (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-[#1A1615] dark:bg-zinc-800 text-[#DEB573] shadow-md border border-white/10">
                <Sparkles className="w-3 h-3" />
                {product.badge}
              </span>
            ) : null}
            <span className="px-3 py-0.8 rounded-full text-xs font-mono font-semibold bg-white dark:bg-zinc-900 text-[#1A1615] dark:text-zinc-200 shadow-xs w-max border border-white/10">
              Item Code: #{selectedVariant ? selectedVariant.code : product.code}
            </span>
          </div>

          <div className="my-auto py-4 flex items-center justify-center">
            <img
              src={product.image}
              alt={product.name}
              className="max-h-[340px] w-auto object-contain rounded-2xl shadow-lg border border-[#EADBCE] dark:border-zinc-800"
            />
          </div>

          <div className="bg-[#1A1615]/85 dark:bg-zinc-900/90 backdrop-blur-md text-white p-2.5 rounded-full text-xs flex items-center justify-between px-4 border border-white/10">
            <span className="text-[#DEB573] font-medium">Oriflame E-Catalogue</span>
            <span className="font-semibold">Featured on Page {product.page}</span>
          </div>
        </div>

        {/* Right Column: Details & Actions */}
        <div className="md:w-1/2 p-6 sm:p-8 overflow-y-auto flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-[#C48B3B] dark:text-[#DEB573]">
                {product.category} • {product.subCategory}
              </span>
              <h2 className="font-serif text-2xl font-bold text-[#1A1615] dark:text-white mt-1 leading-snug">
                {product.name}
              </h2>
              <p className="text-xs text-[#8C7B72] dark:text-zinc-400 mt-0.5">{product.subtitle}</p>
            </div>

            {/* Rating & Volume */}
            <div className="flex items-center justify-between text-xs py-2 border-y border-[#F5EFEB] dark:border-zinc-800">
              <div className="flex items-center gap-1.5">
                <div className="flex text-[#DEB573]">
                  <Star className="w-4 h-4 fill-current" />
                </div>
                <span className="font-bold text-[#1A1615] dark:text-white">{product.rating}</span>
                <span className="text-[#A8988E] dark:text-zinc-500">({product.reviewsCount} customer reviews)</span>
              </div>
              <span className="font-semibold text-[#1A1615] dark:text-zinc-200 bg-[#FAF6F0] dark:bg-zinc-900 px-3 py-1 rounded-full border border-[#EADBCE] dark:border-zinc-800">
                Size: {product.volume}
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-extrabold text-[#1A1615] dark:text-white">
                {formatPrice(effectivePrice)}
              </span>
              {isVipMember ? (
                <span className="text-xs text-[#C48B3B] dark:text-[#DEB573] font-bold">
                  (Retail: {formatPrice(product.priceGHS)})
                </span>
              ) : product.originalPriceGHS ? (
                <span className="text-sm text-[#A8988E] dark:text-zinc-500 line-through">
                  {formatPrice(product.originalPriceGHS)}
                </span>
              ) : null}
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-[#6E5D53] dark:text-zinc-300 leading-relaxed">
              {product.description}
            </p>

            {/* Shade Selection if available */}
            {product.variants && (
              <div className="p-3 bg-[#FAF6F0] dark:bg-zinc-900 border border-[#EADBCE] dark:border-zinc-800 rounded-2xl space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#C48B3B] dark:text-[#DEB573] block">
                  Select Shade:
                </span>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v) => (
                    <button
                      key={v.code}
                      onClick={() => setSelectedVariant(v)}
                      className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs border transition-all cursor-pointer ${
                        selectedVariant?.code === v.code
                          ? 'border-[#1A1615] dark:border-[#DEB573] bg-white dark:bg-zinc-800 font-bold shadow-xs ring-1 ring-[#DEB573]'
                          : 'border-[#EADBCE] dark:border-zinc-700 bg-white/60 dark:bg-zinc-800/60 text-[#6E5D53] dark:text-zinc-300'
                      }`}
                    >
                      <span 
                        className="w-3.5 h-3.5 rounded-full border border-black/20" 
                        style={{ backgroundColor: v.hex }} 
                      />
                      <span>{v.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Scent Notes or Key Benefits */}
            {product.olfactoryPyramid && (
              <div className="bg-[#FFFDF9] dark:bg-zinc-900 border border-[#DEB573]/40 rounded-2xl p-3.5 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#C48B3B] dark:text-[#DEB573] block">
                  The Olfactory Pyramid ({product.perfumer}):
                </span>
                <div className="text-xs space-y-1 dark:text-zinc-300">
                  <div>
                    <span className="font-semibold text-[#8C7B72] dark:text-[#DEB573]">Top: </span>
                    <span>{product.olfactoryPyramid.top.join(', ')}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-[#8C7B72] dark:text-[#DEB573]">Heart: </span>
                    <span>{product.olfactoryPyramid.heart.join(', ')}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-[#8C7B72] dark:text-[#DEB573]">Base: </span>
                    <span>{product.olfactoryPyramid.base.join(', ')}</span>
                  </div>
                </div>
              </div>
            )}

            {product.benefits && (
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#8C7B72] dark:text-zinc-400">
                  Key Highlights:
                </span>
                <ul className="space-y-1">
                  {product.benefits.map((benefit) => (
                    <li key={benefit} className="text-xs text-[#1A1615] dark:text-zinc-200 flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Quantity & Actions */}
          <div className="pt-4 border-t border-[#F5EFEB] dark:border-zinc-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#1A1615] dark:text-zinc-300">Quantity</span>
              <div className="flex items-center border border-[#EADBCE] dark:border-zinc-800 rounded-full bg-[#FAF6F0] dark:bg-zinc-900 overflow-hidden">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="px-3 py-1.5 hover:bg-white dark:hover:bg-zinc-800 text-[#6E5D53] dark:text-zinc-300 transition-colors cursor-pointer"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-4 text-xs font-bold text-[#1A1615] dark:text-white">{qty}</span>
                <button
                  onClick={() => setQty(qty + 1)}
                  className="px-3 py-1.5 hover:bg-white dark:hover:bg-zinc-800 text-[#6E5D53] dark:text-zinc-300 transition-colors cursor-pointer"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                onClick={handleAddToCart}
                disabled={added}
                className="w-full py-3.5 rounded-full bg-[#1A1615] dark:bg-[#DEB573] text-white dark:text-[#1A1615] hover:bg-[#26201E] dark:hover:bg-[#F5DFC2] text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                {added ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-800" />
                    <span>Added to Bag!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4 text-[#DEB573] dark:text-[#1A1615]" />
                    <span>Add to Bag ({formattedTotalPrice})</span>
                  </>
                )}
              </button>

              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 rounded-full bg-[#25D366] hover:bg-[#20BD5A] text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <Phone className="w-4 h-4" />
                <span>Order via WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
