import React, { useState } from 'react';
import { X, ArrowRight, Shield, RotateCcw, Sparkles } from 'lucide-react';

const QUESTIONS = [
  {
    id: 'concern',
    title: 'What is your primary skin objective?',
    subtitle: 'Novage+ bio-activating formulas target specific cellular pathways.',
    options: [
      {
        id: 'anti-aging',
        label: 'Cellular Firming & Deep Wrinkle Renewal',
        desc: 'Bio-collagen stimulation, elasticity loss & contour lifting',
        tag: 'Novage+ Restore Routine'
      },
      {
        id: 'pigmentation',
        label: 'Hyperpigmentation & Melanin Evening',
        desc: 'Dark spots, sun-induced discoloration & dull complexions',
        tag: 'Optimals Even Out Serum'
      },
      {
        id: 'barrier-nourishment',
        label: 'Lipid Depletion & Extreme Dehydration',
        desc: 'Weakened barrier, dullness & environmental moisture loss',
        tag: 'Novage+ 6-Oil Capsules'
      },
      {
        id: 'pores-purifying',
        label: 'Excess Sebum, Congestion & Enlarged Pores',
        desc: 'Active breakouts, post-inflammatory marks & shine',
        tag: 'Love Nature Purifying Mask'
      }
    ]
  },
  {
    id: 'environment',
    title: 'What environmental climate are you exposed to daily?',
    subtitle: 'Tropical humidity and urban pollution require tailored lipid weights.',
    options: [
      {
        id: 'tropical-humid',
        label: 'High Heat & Equatorial Humidity',
        desc: 'West Africa coastal cities (Accra, Lagos, Port Harcourt) requiring lightweight bio-lipids'
      },
      {
        id: 'urban-pollution',
        label: 'Dense Urban Commutes & Particulate Exposure',
        desc: 'Requires antioxidant barrier shielding against free radicals'
      },
      {
        id: 'air-conditioned',
        label: 'Prolonged Indoor Air Conditioning',
        desc: 'Triggers transepidermal water loss and rapid surface dehydration'
      }
    ]
  },
  {
    id: 'texture',
    title: 'Select your preferred formulation finish:',
    subtitle: 'How you want the bio-actives to interact with your skin.',
    options: [
      {
        id: 'oil-elixir',
        label: 'Sumptuous Dry-Oil Elixir',
        desc: 'Rapid non-greasy absorption with radiant glass-skin glow'
      },
      {
        id: 'complete-system',
        label: 'Multi-Step Clinical Protocol',
        desc: 'Structured 4-step cleanse, eye treatment, serum & protective cream'
      },
      {
        id: 'lightweight-fluid',
        label: 'Weightless Water-Gel Essence',
        desc: 'Instant matte-velvet touch with zero residue under makeup'
      }
    ]
  }
];

export default function SkinDiagnosticModal({
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

  const currentQ = QUESTIONS[step];

  const handleSelectOption = (optionId) => {
    const nextAnswers = { ...answers, [currentQ.id]: optionId };
    setAnswers(nextAnswers);

    if (step < QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      calculateResult(nextAnswers);
    }
  };

  const calculateResult = (ans) => {
    let matchedId = 'novage-restore-routine';
    let rationale = '';

    if (ans.concern === 'barrier-nourishment' || ans.texture === 'oil-elixir') {
      matchedId = 'novage-intense-capsules';
      rationale = 'Your cellular lipid barrier requires intensive nourishment with 6 plant-based nutrient oils (Sesame, Avocado, Meadowfoam) to restore barrier elasticity without pore clogging.';
    } else if (ans.concern === 'pigmentation') {
      matchedId = 'optimals-even-out-serum';
      rationale = 'The high-potency UniTone complex with natural Vitamin C from Swedish cranberry works specifically at the cellular melanocyte level to diminish dark spots caused by sun exposure.';
    } else if (ans.concern === 'pores-purifying') {
      matchedId = 'love-nature-purifying-mask';
      rationale = 'Organic tea tree and Mexican lime regulate sebum production, clarify congestive debris, and preserve healthy dermal flora.';
    } else {
      matchedId = 'novage-restore-routine';
      rationale = 'The clinically validated Novage+ Restore 5-piece protocol provides complete 4-step bio-activating cellular renewal, proven to deliver 4x greater skin firmness in 14 days.';
    }

    const matchedProduct = products.find((p) => p.id === matchedId) || products[0];
    setResult({ product: matchedProduct, rationale });
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
              Clinical Diagnostic System • Novage+
            </span>
            <h2 className="font-serif text-2xl font-bold text-[#1A1615] dark:text-white">
              Personalized Bio-Skincare Prescription
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-[#8C7B72] dark:text-zinc-400 hover:text-[#1A1615] dark:hover:text-white rounded-full transition-colors cursor-pointer"
            aria-label="Close diagnostic"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1">
          {!result ? (
            <div>
              <div className="flex items-center justify-between text-xs text-[#8C7B72] dark:text-zinc-400 mb-3 font-semibold">
                <span>Phase {step + 1} of {QUESTIONS.length}</span>
                <span>{Math.round(((step + 1) / QUESTIONS.length) * 100)}% Evaluated</span>
              </div>
              <div className="w-full h-2 bg-[#EADBCE]/60 dark:bg-zinc-800 rounded-full mb-8 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#DEB573] to-[#C48B3B] rounded-full transition-all duration-300"
                  style={{ width: `${((step + 1) / QUESTIONS.length) * 100}%` }}
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
              <div className="p-4 bg-[#FAF6F0] dark:bg-zinc-900 rounded-2xl border border-[#DEB573]/40 flex items-start gap-3">
                <Shield className="w-5 h-5 text-[#C48B3B] dark:text-[#DEB573] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#C48B3B] dark:text-[#DEB573]">
                    Diagnostic Clinical Summary
                  </h4>
                  <p className="text-xs text-[#1A1615] dark:text-zinc-300 mt-1 leading-relaxed">
                    {result.rationale}
                  </p>
                </div>
              </div>

              <div className="rounded-3xl border border-[#DEB573] p-5 flex flex-col sm:flex-row gap-5 items-center bg-white dark:bg-zinc-900 shadow-md">
                <img
                  src={result.product.image}
                  alt={result.product.name}
                  className="w-28 h-28 object-cover rounded-2xl border border-[#EADBCE] dark:border-zinc-800 shrink-0"
                />

                <div className="flex-1 space-y-2 text-center sm:text-left">
                  <span className="text-[10px] uppercase tracking-widest text-[#C48B3B] dark:text-[#DEB573] font-bold block">
                    Prescribed Bio-Active Solution • Code #{result.product.code}
                  </span>
                  <h3 className="font-serif text-xl font-bold text-[#1A1615] dark:text-white">
                    {result.product.name}
                  </h3>
                  <p className="text-xs text-[#6E5D53] dark:text-zinc-400 line-clamp-2">
                    {result.product.description}
                  </p>
                  <div className="pt-1 flex items-baseline justify-center sm:justify-start gap-2">
                    <span className="text-lg font-bold text-[#1A1615] dark:text-white">
                      {formatPrice(result.product.priceGHS)}
                    </span>
                    <span className="text-xs text-[#8C7B72] dark:text-zinc-400">
                      ({result.product.volume})
                    </span>
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
                  Add Prescribed Regimen to Bag
                </button>

                <button
                  onClick={handleReset}
                  className="px-6 py-3.5 rounded-full border border-[#1A1615] dark:border-zinc-700 text-[#1A1615] dark:text-white hover:bg-[#FAF6F0] dark:hover:bg-zinc-800 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restart Diagnostic</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
