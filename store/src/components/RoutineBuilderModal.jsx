import React, { useState } from 'react';
import { 
  X, 
  Check, 
  Sparkles, 
  ShoppingBag, 
  ArrowRight,
  Layers,
  ShieldCheck
} from 'lucide-react';

const STEPS = [
  {
    stepNumber: 1,
    name: 'Cleanse & Purify',
    desc: 'Prepare the dermal lipid barrier for bio-active penetration',
    options: [
      { id: 'novage-refresh-cleanser', name: 'Novage+ Refresh Gel Cleanser', code: '41029', priceGHS: 345, image: '/catalog/page_25.jpg' },
      { id: 'love-nature-purifying-mask', name: 'Love Nature Organic Tea Tree Mask', code: '47277', priceGHS: 135, image: '/catalog/page_5.jpg' }
    ]
  },
  {
    stepNumber: 2,
    name: 'Target & Correct',
    desc: 'Address hyperpigmentation, elasticity and contour loss',
    options: [
      { id: 'optimals-even-out-serum', name: 'Optimals Even Out Serum', code: '45248', priceGHS: 380, image: '/catalog/page_24.jpg' },
      { id: 'the-one-pump-plump-mascara', name: 'THE ONE Pump & Plump Mascara', code: '46594', priceGHS: 216, image: '/catalog/page_11.jpg' }
    ]
  },
  {
    stepNumber: 3,
    name: 'Cellular Activation',
    desc: 'Intensive cellular nourishment and antioxidant protection',
    options: [
      { id: 'novage-intense-capsules', name: 'Novage+ 6-Oil Nourishment Capsules', code: '42256', priceGHS: 734, image: '/catalog/page_8.jpg' },
      { id: 'wellosophy-wellness-pack', name: 'Wellosophy Daily Wellness Pack', code: '38838', priceGHS: 792, image: '/catalog/page_30.jpg' }
    ]
  },
  {
    stepNumber: 4,
    name: 'Lock & Scent',
    desc: 'Seal in hydration and complete your signature sensory finish',
    options: [
      { id: 'milk-honey-sugar-scrub', name: 'Milk & Honey Gold Sugar Scrub', code: '47224', priceGHS: 195, image: '/catalog/page_10.jpg' },
      { id: 'love-potion-body-cream', name: 'Love Potion Perfumed Body Cream', code: '47013', priceGHS: 222, image: '/catalog/page_15.jpg' }
    ]
  }
];

export default function RoutineBuilderModal({
  isOpen,
  onClose,
  onAddToCart,
  formatPrice
}) {
  const [selectedItems, setSelectedItems] = useState({
    1: STEPS[0].options[0],
    2: STEPS[1].options[0],
    3: STEPS[2].options[0],
    4: STEPS[3].options[0]
  });
  const [added, setAdded] = useState(false);

  if (!isOpen) return null;

  const rawTotal = Object.values(selectedItems).reduce((sum, item) => sum + item.priceGHS, 0);
  const bundleDiscount = Math.round(rawTotal * 0.15); // 15% Bundle Discount
  const finalTotal = rawTotal - bundleDiscount;

  const handleSelectOption = (stepNum, option) => {
    setSelectedItems((prev) => ({ ...prev, [stepNum]: option }));
  };

  const handleAddBundle = () => {
    // Add all 4 items with discounted rate
    Object.values(selectedItems).forEach((item) => {
      onAddToCart({
        ...item,
        subtitle: 'Part of 4-Step Vanity Bundle (15% Off)',
        priceGHS: Math.round(item.priceGHS * 0.85)
      }, 1);
    });
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl bg-white dark:bg-[#0A0A0C] text-[#1A1615] dark:text-white rounded-3xl border border-[#EADBCE] dark:border-white/10 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-[#EADBCE] dark:border-zinc-800 bg-[#FAF6F0] dark:bg-zinc-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#1A1615] dark:bg-[#DEB573] text-[#DEB573] dark:text-[#1A1615] flex items-center justify-center font-bold">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#C48B3B] dark:text-[#DEB573]">
                  Swedish Regimen Protocol
                </span>
                <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-[#DEB573] text-[#1A1615]">
                  SAVE 15%
                </span>
              </div>
              <h2 className="font-serif text-2xl font-bold text-[#1A1615] dark:text-white">
                Build Your Complete 4-Step Vanity
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-[#8C7B72] dark:text-zinc-400 hover:text-[#1A1615] dark:hover:text-white rounded-full transition-colors cursor-pointer"
            aria-label="Close builder"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content: 4 Steps Grid */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {STEPS.map((step) => {
              const currentChoice = selectedItems[step.stepNumber];
              return (
                <div 
                  key={step.stepNumber}
                  className="bg-[#FAF6F0] dark:bg-zinc-900 rounded-3xl p-5 border border-[#EADBCE] dark:border-zinc-800 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#1A1615] dark:bg-zinc-800 text-[#DEB573]">
                      Step {step.stepNumber}
                    </span>
                    <span className="text-xs font-bold text-[#1A1615] dark:text-white">
                      {step.name}
                    </span>
                  </div>

                  <p className="text-[11px] text-[#6E5D53] dark:text-zinc-400">
                    {step.desc}
                  </p>

                  <div className="space-y-2 pt-1">
                    {step.options.map((opt) => {
                      const isSelected = currentChoice.id === opt.id;
                      return (
                        <button
                          key={opt.id}
                          onClick={() => handleSelectOption(step.stepNumber, opt)}
                          className={`w-full p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between gap-3 ${
                            isSelected
                              ? 'bg-white dark:bg-zinc-800 border-[#DEB573] ring-2 ring-[#DEB573]/30 shadow-xs'
                              : 'bg-white/60 dark:bg-zinc-800/40 border-[#EADBCE] dark:border-zinc-700/60 hover:border-[#DEB573]'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={opt.image}
                              alt={opt.name}
                              className="w-10 h-10 rounded-xl object-cover border border-[#EADBCE] dark:border-zinc-700 shrink-0"
                            />
                            <div>
                              <h5 className="text-xs font-bold text-[#1A1615] dark:text-white line-clamp-1">
                                {opt.name}
                              </h5>
                              <span className="text-[10px] font-mono text-[#8C7B72] dark:text-zinc-400">
                                Code: #{opt.code}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-xs font-bold text-[#1A1615] dark:text-white">
                              {formatPrice(opt.priceGHS)}
                            </span>
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                              isSelected ? 'bg-[#DEB573] text-[#1A1615]' : 'border border-[#A8988E]'
                            }`}>
                              {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Summary & Checkout */}
        <div className="p-6 border-t border-[#EADBCE] dark:border-zinc-800 bg-[#FAF6F0] dark:bg-zinc-950 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-xs text-[#8C7B72] dark:text-zinc-400 uppercase font-bold">Bundle Price:</span>
              <span className="text-2xl font-extrabold text-[#1A1615] dark:text-white">
                {formatPrice(finalTotal)}
              </span>
              <span className="text-xs text-[#A8988E] line-through">
                {formatPrice(rawTotal)}
              </span>
            </div>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
              Instant 15% Bundle Savings: {formatPrice(bundleDiscount)} saved
            </p>
          </div>

          <button
            onClick={handleAddBundle}
            disabled={added}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#1A1615] dark:bg-[#DEB573] text-white dark:text-[#1A1615] hover:bg-[#26201E] dark:hover:bg-[#F5DFC2] text-xs sm:text-sm font-bold uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            {added ? (
              <>
                <Check className="w-4 h-4 text-emerald-400 dark:text-emerald-800" />
                <span>4-Step Bundle Added!</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4 text-[#DEB573] dark:text-[#1A1615]" />
                <span>Add Complete 4-Step Vanity to Bag</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
