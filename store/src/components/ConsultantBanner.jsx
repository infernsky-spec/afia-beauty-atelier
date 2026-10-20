import React from 'react';
import { Phone, Mail, Sparkles, CheckCircle2 } from 'lucide-react';

export default function ConsultantBanner() {
  return (
    <section className="bg-gradient-to-r from-[#1A1615] via-[#26201E] to-[#1A1615] dark:from-[#000000] dark:via-[#080808] dark:to-[#000000] text-white py-14 px-4 sm:px-6 lg:px-8 border-y border-[#DEB573]/20 dark:border-white/10 relative overflow-hidden transition-colors duration-300">
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-80 h-80 bg-[#DEB573]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative">
        <div className="lg:col-span-8 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#DEB573]/20 text-[#DEB573] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>VIP Beauty Membership & Business Opportunity</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Unlock 20% – 30% Off Every Order as an Oriflame VIP
          </h2>

          <p className="text-xs sm:text-sm text-[#EADBCE] dark:text-zinc-300 max-w-2xl leading-relaxed font-light">
            Love Swedish cosmetics and wellness? Join our community across Ghana and Nigeria. 
            Enjoy wholesale consultant rates, free skin analysis, business starter packages, 
            and earn extra income sharing products you adore.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="flex items-center gap-2 text-xs text-[#FAF6F0] dark:text-zinc-200">
              <CheckCircle2 className="w-4 h-4 text-[#DEB573] shrink-0" />
              <span>Instant VIP discounts</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#FAF6F0] dark:text-zinc-200">
              <CheckCircle2 className="w-4 h-4 text-[#DEB573] shrink-0" />
              <span>Free personalized regimen</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#FAF6F0] dark:text-zinc-200">
              <CheckCircle2 className="w-4 h-4 text-[#DEB573] shrink-0" />
              <span>Flexible work from home</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-center">
          <a
            href="https://wa.me/233240000000?text=Hello%20Afia!%20I%20would%20like%20to%20register%20as%20an%20Oriflame%20VIP%20Customer%20/%20Consultant."
            target="_blank"
            rel="noopener noreferrer"
            className="px-7 py-4 rounded-full bg-[#DEB573] hover:bg-[#F5DFC2] text-[#1A1615] font-bold text-xs sm:text-sm transition-all shadow-lg flex items-center justify-center gap-2.5 cursor-pointer"
          >
            <Phone className="w-4 h-4" />
            <span>Chat on WhatsApp to Join</span>
          </a>

          <a
            href="mailto:CustomerserviceNg@oriflame.com?subject=Consultant%20Inquiry%20from%20Afia%20Store"
            className="px-7 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-all border border-white/20 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Mail className="w-4 h-4" />
            <span>Email Customer Care</span>
          </a>
        </div>
      </div>
    </section>
  );
}
