import React, { useState } from 'react';
import { 
  X, 
  ShoppingBag, 
  Phone, 
  Star, 
  CheckCircle2, 
  Sparkles, 
  Plus, 
  Minus,
  Heart,
  ShieldCheck,
  Check,
  Share2
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
  const [isWishlisted, setIsWishlisted] = useState(false);
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
    }, 1100);
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
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-3xl bg-[#fbf9f5] dark:bg-[#121216] text-[#1b1c1a] dark:text-white rounded-3xl shadow-2xl border border-[#EADBCE] dark:border-white/10 overflow-hidden max-h-[92vh] flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button matching Stitch */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/90 dark:bg-zinc-800 text-[#1b1c1a] dark:text-white hover:bg-[#8d4e12] hover:text-white flex items-center justify-center shadow-md transition-colors cursor-pointer"
          aria-label="Close formulation details"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left: Image Canvas matching Stitch product_details.html Hero */}
        <div className="md:w-1/2 relative bg-[#f5f3ef] dark:bg-zinc-950 flex flex-col justify-between p-6">
          <div className="flex items-center justify-between z-10">
            {isVipMember ? (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-dm font-bold bg-[#8d4e12] text-white shadow-xs">
                <Sparkles className="w-3 h-3 text-[#ffdcc4]" />
                <span>VIP Wholesale -20%</span>
              </span>
            ) : product.badge ? (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-dm font-bold bg-[#1b1c1a] text-[#ffdcc4] shadow-md border border-white/10">
                <Sparkles className="w-3 h-3" />
                {product.badge}
              </span>
            ) : <span />}

            <button
              onClick={() => setIsWishlisted(!isWishlisted)}
              className={`w-9 h-9 rounded-full backdrop-blur-md flex items-center justify-center shadow-xs transition-colors cursor-pointer ${
                isWishlisted 
                  ? 'bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-400' 
                  : 'bg-white/80 dark:bg-zinc-900 text-[#1b1c1a] dark:text-white hover:text-rose-600'
              }`}
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Product Cutout */}
          <div className="my-auto py-4 flex items-center justify-center">
            <img
              src={product.image}
              alt={product.name}
              className="max-h-[300px] sm:max-h-[340px] w-auto object-contain rounded-2xl shadow-xl transition-transform duration-500 hover:scale-105"
            />
          </div>

          {/* Pagination & Catalogue Page Pill */}
          <div className="bg-[#1b1c1a]/90 dark:bg-zinc-900/90 backdrop-blur-md text-white p-2.5 rounded-full text-xs flex items-center justify-between px-4 border border-white/10">
            <span className="text-[#ffdcc4] font-dm font-medium">Oriflame Stockholm Q4</span>
            <span className="font-dm font-semibold">Featured on Page {product.page}</span>
          </div>
        </div>

        {/* Right: Details & Architectural Specs Sheet (Stitch Pattern) */}
        <div className="md:w-1/2 p-6 sm:p-7 overflow-y-auto flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            {/* Header Titles */}
            <div>
              <p className="text-[10px] uppercase font-dm font-bold tracking-widest text-[#7a776f] dark:text-zinc-400">
                Atelier Series REF #{selectedVariant ? selectedVariant.code : product.code}
              </p>
              <h2 className="font-serif text-2xl font-bold text-[#1b1c1a] dark:text-white mt-1 leading-snug">
                {product.name}
              </h2>
              <p className="text-xs text-[#8d4e12] dark:text-[#ffdcc4] font-dm font-semibold mt-0.5">
                {product.subtitle}
              </p>
            </div>

            {/* Price & Tactile Quantity Stepper (Stitch product_details.html section) */}
            <div className="bg-white dark:bg-[#1a1a20] rounded-2xl p-4 border border-[#EADBCE]/80 dark:border-white/10 shadow-xs flex items-center justify-between">
              <div>
                <div className="flex items-baseline gap-1.5">
                  <span className="font-dm font-extrabold text-2xl text-[#1b1c1a] dark:text-white">
                    {formatPrice(effectivePrice)}
                  </span>
                  <span className="text-xs text-[#7a776f] dark:text-zinc-400 font-dm">/ unit</span>
                </div>
                <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-[#ffdcc4]/60 dark:bg-[#8d4e12]/30 text-[#8d4e12] dark:text-[#ffdcc4] text-[10px] font-dm font-bold">
                  In Stock • Cold-Chain Guaranteed
                </span>
              </div>

              {/* Tactile Stepper Pill */}
              <div className="flex items-center bg-[#f5f3ef] dark:bg-zinc-800 rounded-full p-1 border border-[#EADBCE]/60 dark:border-white/5">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="w-8 h-8 rounded-full bg-white dark:bg-zinc-900 flex items-center justify-center text-[#1b1c1a] dark:text-white shadow-xs active:scale-90 transition-transform cursor-pointer"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-8 text-center font-dm font-bold text-xs select-none">
                  {qty}
                </span>
                <button
                  onClick={() => setQty(qty + 1)}
                  className="w-8 h-8 rounded-full bg-white dark:bg-zinc-900 flex items-center justify-center text-[#1b1c1a] dark:text-white shadow-xs active:scale-90 transition-transform cursor-pointer"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Shade / Finish Selector */}
            {product.variants && (
              <div className="p-3.5 bg-white dark:bg-[#1a1a20] border border-[#EADBCE]/80 dark:border-white/10 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-dm font-bold uppercase tracking-wider text-[#7a776f] dark:text-zinc-400">
                    Finish & Texture:
                  </span>
                  <span className="text-xs font-dm font-bold text-[#8d4e12] dark:text-[#ffdcc4]">
                    {selectedVariant ? selectedVariant.name : 'Standard'}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v) => (
                    <button
                      key={v.code}
                      onClick={() => setSelectedVariant(v)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-dm transition-all cursor-pointer ${
                        selectedVariant?.code === v.code
                          ? 'bg-[#1b1c1a] dark:bg-white text-white dark:text-[#1b1c1a] shadow-xs'
                          : 'bg-[#f5f3ef] dark:bg-zinc-800 text-[#494740] dark:text-zinc-300 hover:bg-[#eae8e4]'
                      }`}
                    >
                      <span className="w-3 h-3 rounded-full border border-white/20" style={{ backgroundColor: v.hex }} />
                      <span>{v.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Architectural Specs Sheet (Stitch product_details.html) */}
            <div className="bg-[#f5f3ef] dark:bg-[#1a1a20] rounded-2xl p-4 border border-[#EADBCE]/70 dark:border-white/5 space-y-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-dm font-bold text-[#1b1c1a] dark:text-white">
                  Architectural Formulation Specs
                </span>
                <span className="text-[10px] font-mono text-[#7a776f] dark:text-zinc-400">
                  ISO-22716
                </span>
              </div>
              <div className="space-y-1.5 text-xs font-dm">
                <div className="flex justify-between py-1 bg-white/70 dark:bg-zinc-900/60 px-3 rounded-xl">
                  <span className="text-[#7a776f] dark:text-zinc-400">Active Complex</span>
                  <span className="font-semibold text-[#1b1c1a] dark:text-white">Bio-Peptides & Arctic Botanical</span>
                </div>
                <div className="flex justify-between py-1 bg-white/70 dark:bg-zinc-900/60 px-3 rounded-xl">
                  <span className="text-[#7a776f] dark:text-zinc-400">Net Volume</span>
                  <span className="font-semibold text-[#1b1c1a] dark:text-white">{product.volume}</span>
                </div>
                <div className="flex justify-between py-1 bg-white/70 dark:bg-zinc-900/60 px-3 rounded-xl">
                  <span className="text-[#7a776f] dark:text-zinc-400">Origin Atelier</span>
                  <span className="font-semibold text-[#1b1c1a] dark:text-white">Stockholm, Sweden</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sticky Bottom Actions */}
          <div className="pt-4 border-t border-[#EADBCE]/80 dark:border-white/10 space-y-2.5">
            <button
              onClick={handleAddToCart}
              className={`w-full py-3.5 rounded-full font-dm font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer active:scale-95 ${
                added
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#1b1c1a] dark:bg-white text-white dark:text-[#1b1c1a] hover:bg-[#8d4e12] dark:hover:bg-[#ffdcc4]'
              }`}
            >
              {added ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Added to Vanity Bag!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4 text-[#ffdcc4] dark:text-[#8d4e12]" />
                  <span>Add to Bag • {formattedTotalPrice}</span>
                </>
              )}
            </button>

            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 rounded-full border border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white text-xs font-dm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Instant WhatsApp Concierge Order</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
