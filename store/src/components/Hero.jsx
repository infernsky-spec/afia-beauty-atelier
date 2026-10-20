import React from 'react';
import storeConfig from '../config/store.config';
import { ArrowRight, BookOpen, ShieldCheck, Award, Truck, Sparkles } from 'lucide-react';

export default function Hero({ 
  onExploreCategory, 
  onOpenCatalogue,
  onOpenSkinDiagnostic,
  onOpenScentFinder 
}) {
  const { hero, branding, features } = storeConfig;

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#F5EFEB] via-[#FAF6F0] to-[#FAF6F0] dark:from-[#050505] dark:via-[#000000] dark:to-[#000000] pt-8 pb-14 sm:pt-12 sm:pb-20 border-b border-[#EADBCE] dark:border-white/10 transition-colors duration-300">
      {/* Decorative ambient glowing lights */}
      <div className="absolute top-0 right-1/4 w-[450px] h-[450px] bg-[#DEB573]/20 dark:bg-[#DEB573]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-4 left-10 w-96 h-96 bg-[#FAD4C9]/30 dark:bg-[#8C714D]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1A1615] dark:bg-zinc-900 border border-transparent dark:border-zinc-800 text-[#DEB573] text-xs font-bold uppercase tracking-wider shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#DEB573]" />
              <span>{hero.eyebrow}</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-[#1A1615] dark:text-white leading-[1.12]">
              {hero.headlineMain} <br />
              <span className="italic font-normal text-[#C48B3B] dark:text-[#DEB573]">{hero.headlineAccent}</span>
            </h1>

            <p className="text-base sm:text-lg text-[#6E5D53] dark:text-zinc-300 max-w-xl font-light leading-relaxed">
              {hero.description}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onExploreCategory(hero.primaryButton.targetCategory || 'All')}
                className="px-7 py-3.5 rounded-full bg-[#1A1615] dark:bg-[#DEB573] text-white dark:text-[#1A1615] hover:bg-[#26201E] dark:hover:bg-[#F5DFC2] text-xs sm:text-sm font-bold tracking-wide transition-all shadow-md hover:shadow-xl flex items-center gap-2.5 cursor-pointer"
              >
                <span>{hero.primaryButton.label}</span>
                <ArrowRight className="w-4 h-4 text-[#DEB573] dark:text-[#1A1615]" />
              </button>

              {features.enableCatalogueModal && (
                <button
                  onClick={onOpenCatalogue}
                  className="px-6 py-3.5 rounded-full bg-white dark:bg-zinc-900 text-[#1A1615] dark:text-white border border-[#DEB573] dark:border-zinc-700 hover:bg-[#FFFDF9] dark:hover:bg-zinc-800 text-xs sm:text-sm font-bold tracking-wide transition-all shadow-xs flex items-center gap-2 cursor-pointer"
                >
                  <BookOpen className="w-4 h-4 text-[#C48B3B] dark:text-[#DEB573]" />
                  <span>{hero.secondaryButton.label}</span>
                </button>
              )}
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-6 border-t border-[#EADBCE]/80 dark:border-white/10">
              {hero.trustBadges.map((badge, idx) => {
                const Icons = [ShieldCheck, Award, Truck];
                const IconComponent = Icons[idx % Icons.length];
                return (
                  <div key={badge.title} className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#FAF6F0] dark:bg-zinc-900 border border-[#EADBCE] dark:border-zinc-800 flex items-center justify-center shrink-0 shadow-xs">
                      <IconComponent className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-[#C48B3B] dark:text-[#DEB573]" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-[10px] sm:text-xs font-bold text-[#1A1615] dark:text-white truncate">{badge.title}</h4>
                      <p className="text-[9px] sm:text-[11px] text-[#8C7B72] dark:text-zinc-400 truncate">{badge.subtitle}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Visual Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="absolute -inset-2 bg-gradient-to-tr from-[#DEB573] to-[#FAD4C9] dark:from-[#DEB573]/30 dark:to-transparent rounded-3xl opacity-50 blur-lg" />
              
              <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-white dark:bg-zinc-900 border border-[#EADBCE] dark:border-zinc-800">
                <img
                  src={hero.heroImage}
                  alt={branding.name}
                  className="w-full h-auto object-cover object-top hover:scale-103 transition-transform duration-700"
                />
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#1A1615] via-[#1A1615]/80 to-transparent p-6 text-white">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#DEB573]">
                    {branding.badge}
                  </span>
                  <h3 className="font-serif text-xl font-bold mt-1">
                    {branding.catalogEdition}
                  </h3>
                  <p className="text-xs text-[#EADBCE] mt-1 font-light">
                    {branding.shortDescription}
                  </p>
                  {features.enableCatalogueModal && (
                    <button
                      onClick={onOpenCatalogue}
                      className="mt-3.5 inline-flex items-center gap-2 text-xs font-bold text-[#DEB573] hover:text-white transition-colors cursor-pointer"
                    >
                      <span>Explore Collection Edition</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
