import React, { useState } from 'react';
import { X, ArrowRight, RotateCcw } from 'lucide-react';

const SCENT_QUESTIONS = [
  {
    id: 'mood',
    title: 'What fragrance aura do you wish to project?',
    subtitle: 'Niche Haute Parfumerie in co-creation with Givaudan, Paris.',
    options: [
      {
        id: 'niche-artistry',
        label: 'Avant-Garde Artisanal Distinction',
        desc: 'Unconventional accords prioritizing rarity and emotional depth over mass appeal'
      },
      {
        id: 'aristocratic-wood',
        label: 'Timeless Mediterranean Aristocracy',
        desc: 'Haitian vetiver, noble woods, and warm Italian bergamot elegance'
      },
      {
        id: 'seductive-amber',
        label: 'Intimate Magnetic Sensuality',
        desc: 'Spiced cocoa blossom, warm ginger, and decadent dark chocolate sillage'
      },
      {
        id: 'invigorating-arctic',
        label: 'High-Altitude Mineral Freshness',
        desc: 'Sub-zero citrus, crushed rosemary, and crisp glacial ozonic clarity'
      }
    ]
  },
  {
    id: 'setting',
    title: 'Select the primary setting for this scent:',
    subtitle: 'How sillage and longevity will calibrate to your day.',
    options: [
      {
        id: 'gala-evening',
        label: 'High-Profile Evening Galas & Intimate Dinners',
        desc: 'Requires long-lasting 10–12 hour projection and deep drydown'
      },
      {
        id: 'executive-day',
        label: 'The Executive Boardroom & Everyday Signature',
        desc: 'Sophisticated presence that commands attention with understated poise'
      },
      {
        id: 'active-leisure',
        label: 'Equatorial Heat, Sports & Weekend Escapes',
        desc: 'Uplifting, sweat-resilient accords that react vibrantly with body warmth'
      }
    ]
  }
];

export default function ScentFinderModal({
  isOpen,
  onClose,
  onAddToCart,
  products,
  formatPrice
}) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  if (!isOpen) return null;

  const currentQ = SCENT_QUESTIONS[step];

  const handleSelectOption = (optId) => {
    const nextAnswers = { ...answers, [currentQ.id]: optId };
    setAnswers(nextAnswers);

    if (step < SCENT_QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      calculateScent(nextAnswers);
    }
  };

  const calculateScent = (ans) => {
    let matchedId = 'top-scents-rose-mode';
    let poeticDescription = '';

    if (ans.mood === 'niche-artistry') {
      matchedId = 'top-scents-rose-mode';
      poeticDescription = 'Your profile aligns with the artisanal revolution of Niche Haute Parfumerie. Rose Mode deconstructs classical Damask rose with electric pink peppercorn and white cashmere wood, composed exclusively with Givaudan master perfumers.';
    } else if (ans.mood === 'aristocratic-wood') {
      matchedId = 'giordani-gold-man';
      poeticDescription = 'An undisputed icon of European distinction. Giordani Gold Man marries sustainably sourced Haitian Vetiver with sparkling Calabrian Bergamot, evoking tailored bespoke suits and timeless heritage.';
    } else if (ans.mood === 'seductive-amber') {
      matchedId = 'love-potion-body-cream';
      poeticDescription = 'A decadent, intoxicating olfactory harmony of fiery ginger and rare cocoa blossom, creating an irresistible, intimate aura.';
    } else {
      matchedId = 'glacier-rock-edt';
      poeticDescription = 'Crisp, electrifying lemon and mineral amber accords designed to deliver relentless sub-zero exhilaration across hot climates.';
    }

    const matchedProduct = products.find((p) => p.id === matchedId) || products[0];
    setResult({ product: matchedProduct, poeticDescription });
  };

  const handleReset = () => {
    setStep(0);
    setAnswers({});
    setResult(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-white dark:bg-[#0A0A0C] text-[#1A1615] dark:text-white rounded-3xl border border-[#EADBCE] dark:border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-[#EADBCE] dark:border-zinc-800 bg-[#FAF6F0] dark:bg-zinc-950 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#C48B3B] dark:text-[#DEB573] font-bold block mb-1">
              The Olfactory Atelier • Givaudan Co-Lab
            </span>
            <h2 className="font-serif text-2xl font-bold text-[#1A1615] dark:text-white">
              Discover Your Signature Scent
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-[#8C7B72] dark:text-zinc-400 hover:text-[#1A1615] dark:hover:text-white rounded-full transition-colors cursor-pointer"
            aria-label="Close scent finder"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1">
          {!result ? (
            <div>
              <div className="flex items-center justify-between text-xs text-[#8C7B72] dark:text-zinc-400 mb-3 font-semibold">
                <span>Atelier Step {step + 1} of {SCENT_QUESTIONS.length}</span>
                <span>{Math.round(((step + 1) / SCENT_QUESTIONS.length) * 100)}% Profiled</span>
              </div>
              <div className="w-full h-2 bg-[#EADBCE]/60 dark:bg-zinc-800 rounded-full mb-8 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#DEB573] to-[#C48B3B] rounded-full transition-all duration-300"
                  style={{ width: `${((step + 1) / SCENT_QUESTIONS.length) * 100}%` }}
                />
              </div>

              <div className="mb-6">
                <h3 className="font-serif text-2xl font-bold text-[#1A1615] dark:text-white leading-snug">
                  {currentQ.title}
                </h3>
                <p className="text-xs text-[#6E5D53] dark:text-zinc-400 mt-1">
                  {currentQ.subtitle}
                </p>
              </div>

              <div className="space-y-3">
                {currentQ.options.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectOption(opt.id)}
                    className="w-full text-left p-4.5 rounded-2xl border border-[#EADBCE] dark:border-zinc-800 hover:border-[#DEB573] dark:hover:border-[#DEB573] bg-[#FAF6F0] dark:bg-zinc-900 hover:bg-white dark:hover:bg-zinc-800 transition-all duration-200 cursor-pointer group flex items-start justify-between gap-4 shadow-xs"
                  >
                    <div>
                      <h4 className="text-sm font-bold text-[#1A1615] dark:text-white group-hover:text-[#C48B3B] dark:group-hover:text-[#DEB573] transition-colors">
                        {opt.label}
                      </h4>
                      <p className="text-xs text-[#6E5D53] dark:text-zinc-400 mt-1 leading-relaxed">
                        {opt.desc}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#A8988E] group-hover:text-[#C48B3B] dark:group-hover:text-[#DEB573] group-hover:translate-x-1 transition-all shrink-0 mt-1" />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="p-4 bg-[#FAF6F0] dark:bg-zinc-900 rounded-2xl border-l-4 border-[#C48B3B] dark:border-[#DEB573]">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#C48B3B] dark:text-[#DEB573]">
                  Curator Formulation Analysis
                </h4>
                <p className="text-xs text-[#1A1615] dark:text-zinc-300 mt-1.5 leading-relaxed">
                  {result.poeticDescription}
                </p>
              </div>

              <div className="rounded-3xl border border-[#DEB573] p-5 flex flex-col sm:flex-row gap-5 items-center bg-white dark:bg-zinc-900 shadow-md">
                <img
                  src={result.product.image}
                  alt={result.product.name}
                  className="w-28 h-28 object-cover rounded-2xl border border-[#EADBCE] dark:border-zinc-800 shrink-0"
                />

                <div className="flex-1 space-y-2 text-center sm:text-left">
                  <span className="text-[10px] uppercase tracking-widest text-[#C48B3B] dark:text-[#DEB573] font-bold block">
                    Haute Parfumerie Match • Code #{result.product.code}
                  </span>
                  <h3 className="font-serif text-xl font-bold text-[#1A1615] dark:text-white">
                    {result.product.name}
                  </h3>
                  <p className="text-xs text-[#6E5D53] dark:text-zinc-400 line-clamp-2">
                    {result.product.description}
                  </p>
                  
                  {result.product.olfactoryPyramid && (
                    <div className="pt-1 flex flex-wrap gap-1">
                      {result.product.olfactoryPyramid.heart.map((n) => (
                        <span key={n} className="text-[10px] bg-[#FAF6F0] dark:bg-zinc-800 border border-[#EADBCE] dark:border-zinc-700 rounded-full px-2.5 py-0.5 text-[#1A1615] dark:text-zinc-200">
                          {n}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="pt-1 text-lg font-bold text-[#1A1615] dark:text-white">
                    {formatPrice(result.product.priceGHS)}
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={() => {
                    onAddToCart(result.product, 1);
                    onClose();
                  }}
                  className="flex-1 py-3.5 rounded-full bg-[#1A1615] dark:bg-[#DEB573] text-white dark:text-[#1A1615] hover:bg-[#26201E] dark:hover:bg-[#F5DFC2] text-xs font-bold uppercase tracking-wider transition-all cursor-pointer text-center shadow-md"
                >
                  Acquire This Fragrance
                </button>

                <button
                  onClick={handleReset}
                  className="px-6 py-3.5 rounded-full border border-[#1A1615] dark:border-zinc-700 text-[#1A1615] dark:text-white hover:bg-[#FAF6F0] dark:hover:bg-zinc-800 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Re-Consult Atelier</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
