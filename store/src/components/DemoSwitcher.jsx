import React, { useState } from 'react';
import { ArrowLeftRight, ShieldCheck, Store, X } from 'lucide-react';

/**
 * DemoSwitcher: A floating bottom-left pill that lets the user
 * toggle between the Customer Storefront and the Admin Command Center.
 * Sits above the mobile bottom nav on phones.
 */
export default function DemoSwitcher({ isAdmin, onToggle }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="fixed bottom-24 md:bottom-6 left-4 z-[60] flex flex-col items-start gap-2">
      {/* Expanded Panel */}
      {isExpanded && (
        <div className="bg-white dark:bg-[#0E0E10] border border-[#EADBCE] dark:border-white/10 rounded-2xl shadow-2xl p-3 space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-200 min-w-[200px]">
          <div className="flex items-center justify-between pb-2 border-b border-[#FAF6F0] dark:border-zinc-800">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#8C7B72] dark:text-zinc-400">
              Switch View
            </span>
            <button
              onClick={() => setIsExpanded(false)}
              className="p-1 rounded-full hover:bg-[#FAF6F0] dark:hover:bg-zinc-800 text-[#8C7B72] cursor-pointer"
            >
              <X className="w-3 h-3" />
            </button>
          </div>

          {/* Customer Store Option */}
          <button
            onClick={() => {
              if (isAdmin) onToggle();
              setIsExpanded(false);
            }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              !isAdmin
                ? 'bg-[#DEB573]/15 text-[#C48B3B] dark:text-[#DEB573] border border-[#DEB573]/30'
                : 'bg-[#FAF6F0] dark:bg-zinc-900 text-[#6E5D53] dark:text-zinc-400 hover:bg-[#EADBCE] dark:hover:bg-zinc-800'
            }`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
              !isAdmin
                ? 'bg-[#DEB573] text-[#1A1615]'
                : 'bg-[#FAF6F0] dark:bg-zinc-800 text-[#8C7B72]'
            }`}>
              <Store className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="leading-tight">Customer Store</div>
              <div className="text-[9px] font-normal text-[#8C7B72] dark:text-zinc-500">
                Browse & shop products
              </div>
            </div>
            {!isAdmin && (
              <span className="ml-auto w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            )}
          </button>

          {/* Admin Panel Option */}
          <button
            onClick={() => {
              if (!isAdmin) onToggle();
              setIsExpanded(false);
            }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              isAdmin
                ? 'bg-[#DEB573]/15 text-[#C48B3B] dark:text-[#DEB573] border border-[#DEB573]/30'
                : 'bg-[#FAF6F0] dark:bg-zinc-900 text-[#6E5D53] dark:text-zinc-400 hover:bg-[#EADBCE] dark:hover:bg-zinc-800'
            }`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
              isAdmin
                ? 'bg-[#DEB573] text-[#1A1615]'
                : 'bg-[#FAF6F0] dark:bg-zinc-800 text-[#8C7B72]'
            }`}>
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="leading-tight">Admin Panel</div>
              <div className="text-[9px] font-normal text-[#8C7B72] dark:text-zinc-500">
                Manage orders & products
              </div>
            </div>
            {isAdmin && (
              <span className="ml-auto w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            )}
          </button>
        </div>
      )}

      {/* Floating Toggle Pill */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`group flex items-center gap-2 px-3.5 py-2.5 rounded-full shadow-2xl border cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95 ${
          isAdmin
            ? 'bg-gradient-to-r from-[#C48B3B] to-[#DEB573] text-[#1A1615] border-[#DEB573]/40 shadow-[#DEB573]/20'
            : 'bg-[#1A1615] dark:bg-[#0E0E10] text-white border-[#DEB573]/30 shadow-black/20'
        }`}
        title="Switch between Customer Store and Admin Panel"
      >
        <ArrowLeftRight className="w-4 h-4" />
        <span className="text-[11px] font-bold tracking-wide">
          {isAdmin ? 'Admin' : 'Store'}
        </span>
        <span className={`w-1.5 h-1.5 rounded-full ${isAdmin ? 'bg-[#1A1615]' : 'bg-[#DEB573]'} animate-pulse`} />
      </button>
    </div>
  );
}
