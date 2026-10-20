import React from 'react';
import storeConfig from '../config/store.config';
import { MapPin, Mail, Phone, ShieldCheck, Heart } from 'lucide-react';

export default function Footer({ 
  onSelectCategory, 
  onOpenCatalogue,
  onOpenSkinDiagnostic,
  onOpenScentFinder
}) {
  const { branding, contact } = storeConfig;

  return (
    <footer className="bg-[#1A1615] dark:bg-[#000000] text-[#EADBCE] dark:text-zinc-400 pt-16 pb-10 border-t border-[#3D3431] dark:border-white/10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex flex-col">
              <span className="font-serif text-3xl font-extrabold tracking-wide text-white">
                {branding.namePrefix}<span className="text-[#DEB573]">{branding.nameSuffix}</span>
              </span>
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#DEB573] font-semibold">
                {branding.tagline}
              </span>
            </div>
            <p className="text-xs text-[#A8988E] dark:text-zinc-400 leading-relaxed font-light">
              {branding.originStory}
            </p>
            <div className="flex items-center gap-2 text-xs text-[#DEB573]">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Genuine Certified Formulations</span>
            </div>
          </div>

          {/* Quick Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white">
              Catalogue Categories
            </h4>
            <ul className="space-y-2 text-xs text-[#A8988E] dark:text-zinc-400">
              <li>
                <button 
                  onClick={() => onSelectCategory('Fragrance')}
                  className="hover:text-[#DEB573] transition-colors cursor-pointer text-left"
                >
                  Niche Fragrances & Perfumes (Givaudan)
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onSelectCategory('Skincare')}
                  className="hover:text-[#DEB573] transition-colors cursor-pointer text-left"
                >
                  Novage+ Bio-Activating Skincare
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onSelectCategory('Makeup')}
                  className="hover:text-[#DEB573] transition-colors cursor-pointer text-left"
                >
                  THE ONE Cosmetics & Mascaras
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onSelectCategory('Personal Care')}
                  className="hover:text-[#DEB573] transition-colors cursor-pointer text-left"
                >
                  Milk & Honey Gold & North For Men
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onSelectCategory('Nutrition & Wellness')}
                  className="hover:text-[#DEB573] transition-colors cursor-pointer text-left"
                >
                  Wellosophy Daily Nutrition Packs
                </button>
              </li>
            </ul>
          </div>

          {/* Regional Hubs */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white">
              Location & Operations
            </h4>
            <ul className="space-y-3 text-xs text-[#A8988E] dark:text-zinc-400">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#DEB573] shrink-0 mt-0.5" />
                <span>
                  {contact.location}
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#DEB573] shrink-0" />
                <a href={`mailto:${contact.email}`} className="hover:text-white transition-colors">
                  {contact.email}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#DEB573] shrink-0" />
                <a href={`tel:${contact.phone}`} className="hover:text-white transition-colors">
                  {contact.formattedPhone}
                </a>
              </li>
            </ul>
          </div>

          {/* Instant Ordering & Support */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white">
              Direct Inquiries
            </h4>
            <p className="text-xs text-[#A8988E] dark:text-zinc-400">
              Have questions about sizing, specifications, or need personalized recommendations?
            </p>
            <a
              href={`https://wa.me/${contact.phone}?text=${encodeURIComponent(contact.whatsappGreeting)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#25D366] text-white text-xs font-bold hover:bg-[#20BD5A] transition-colors shadow-md"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Direct WhatsApp Chat</span>
            </a>
            {storeConfig.features.enableCatalogueModal && (
              <div>
                <button
                  onClick={onOpenCatalogue}
                  className="text-xs text-[#DEB573] hover:underline flex items-center gap-1 mt-2 cursor-pointer"
                >
                  <span>Preview {branding.catalogPagesCount}-Page Flipbook PDF</span>
                </button>
              </div>
            )}
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8C7B72] dark:text-zinc-500">
          <div>
            © 2026 Afia Beauty Atelier • Authorized Independent Oriflame Brand Showcase.
          </div>
          <div className="flex items-center gap-1">
            <span>Crafted for Swedish Beauty Lovers in West Africa</span>
            <Heart className="w-3.5 h-3.5 text-[#DEB573] fill-current" />
          </div>
        </div>
      </div>
    </footer>
  );
}
