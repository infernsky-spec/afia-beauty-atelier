import React, { useState } from 'react';
import { ArrowLeftRight, ShieldCheck, Store, X, Sparkles } from 'lucide-react';

/**
 * DemoSwitcher: A floating luxury bottom-left pill that lets the user
 * toggle between Customer Storefront and Admin Command Center in real-time.
 */
export default function DemoSwitcher({ isAdmin, onToggle }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="fixed bottom-24 md:bottom-6 left-4 z-[60] flex flex-col items-start gap-2">
      {/* Expanded Panel */}
      {isExpanded && (
        <div className="bg-[#0E0E14]/95 backdrop-blur-2xl border border-[#DEB573]/30 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] p-3.5 space-y-2 animate-luxury-zoom min-w-[220px]">
          <div className="flex items-center justify-between pb-2 border-b border-white/8">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#DEB573] flex items-center gap-1.5">
              <Sparkles className="w-3 h-3" />
              <span>Workspace Switcher</span>
            </span>
            <button
              onClick={() => setIsExpanded(false)}
              className="p-1 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white cursor-pointer transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Customer Store Option */}
          <button
            onClick={() => {
              if (isAdmin) onToggle();
              setIsExpanded(false);
            }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-xs font-bold transition-all duration-300 cursor-pointer ${
              !isAdmin
                ? 'bg-gradient-to-r from-[#DEB573]/20 to-[#C48B3B]/10 text-[#DEB573] border border-[#DEB573]/40 shadow-sm'
                : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-transform ${
              !isAdmin ? 'bg-[#DEB573] text-[#141110] shadow-md shadow-[#DEB573]/25' : 'bg-white/10 text-zinc-400'
            }`}>
              <Store className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="leading-tight text-white">Customer Store</div>
              <div className="text-[9px] font-normal text-zinc-400">
                Browse Swedish catalog
              </div>
            </div>
            {!isAdmin && (
              <span className="ml-auto w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            )}
          </button>

          {/* Admin Command Suite Option */}
          <button
            onClick={() => {
              if (!isAdmin) onToggle();
              setIsExpanded(false);
            }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-xs font-bold transition-all duration-300 cursor-pointer ${
              isAdmin
                ? 'bg-gradient-to-r from-[#DEB573]/20 to-[#C48B3B]/10 text-[#DEB573] border border-[#DEB573]/40 shadow-sm'
                : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-transform ${
              isAdmin ? 'bg-[#DEB573] text-[#141110] shadow-md shadow-[#DEB573]/25' : 'bg-white/10 text-zinc-400'
            }`}>
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="leading-tight text-white">Executive Admin</div>
              <div className="text-[9px] font-normal text-zinc-400">
                Inventory & dispatch suite
              </div>
            </div>
            {isAdmin && (
              <span className="ml-auto w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            )}
          </button>
        </div>
      )}

      {/* Floating Toggle Pill with Gold Halo */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`group flex items-center gap-2.5 px-4 py-2.5 rounded-full shadow-2xl border cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95 ${
          isAdmin
            ? 'bg-gradient-to-r from-[#DEB573] to-[#C48B3B] text-[#141110] border-[#DEB573] shadow-[0_8px_30px_rgba(222,181,115,0.35)]'
            : 'bg-[#141110]/90 backdrop-blur-xl text-white border-white/15 hover:border-[#DEB573]/50 shadow-[0_8px_30px_rgba(0,0,0,0.6)]'
        }`}
        title="Toggle between Storefront and Admin Suite"
      >
        <ArrowLeftRight className="w-4 h-4" />
        <span className="text-[11px] font-black tracking-wider uppercase">
          {isAdmin ? 'Admin View' : 'Store View'}
        </span>
        <span className={`w-2 h-2 rounded-full ${isAdmin ? 'bg-[#141110]' : 'bg-[#DEB573]'} animate-ping`} />
      </button>
    </div>
  );
}
