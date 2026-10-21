import React from 'react';
import { ArrowRight, Sparkles, BookOpen } from 'lucide-react';

export default function EditorialHighlightBanner({ onExploreCatalogue, onScrollToProducts }) {
  return (
    <section className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-[#FAF6F0] dark:bg-[#15151a] shadow-[0_8px_24px_-4px_rgba(28,27,25,0.06)] border border-[#EADBCE]/80 dark:border-white/10 my-4 sm:my-6 group">
      <div className="relative w-full h-48 sm:h-64 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1200&auto=format&fit=crop&q=80"
          alt="Scandinavian Luxury Editorial"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>

        {/* Overlay Details matching Stitch discover_home.html */}
        <div className="absolute bottom-0 inset-x-0 p-4 sm:p-6 flex flex-col sm:flex-row sm:items-end justify-between gap-3 text-white">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[#ffdcc4] text-[10px] font-dm font-bold uppercase tracking-widest border border-white/15">
              <Sparkles className="w-2.5 h-2.5 fill-current" />
              <span>Autumn / Winter '26 Edit</span>
            </span>
            <h3 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-white leading-snug">
              The Tactile Nordic Glow
            </h3>
            <p className="text-xs text-zinc-300 font-dm max-w-md line-clamp-1 sm:line-clamp-none">
              Bio-active peptides, cold-pressed Arctic cloudberry, and Swedish haute parfumerie.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            <button
              onClick={onScrollToProducts}
              className="px-4 py-2 rounded-full bg-white text-[#1b1c1a] font-dm text-xs font-bold shadow-md hover:bg-[#DEB573] active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>Explore Formulations</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onExploreCatalogue}
              className="px-3.5 py-2 rounded-full bg-white/20 backdrop-blur-md text-white font-dm text-xs font-bold hover:bg-white/30 active:scale-95 transition-all flex items-center gap-1 cursor-pointer border border-white/20"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Flipbook</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
