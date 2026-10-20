import React, { useState } from 'react';
import { 
  X, 
  Share2, 
  Copy, 
  Check, 
  Users, 
  Phone, 
  Award,
  Link,
  QrCode
} from 'lucide-react';

export default function ConsultantAffiliateModal({
  isOpen,
  onClose,
  activeConsultant,
  onUpdateConsultant
}) {
  const [name, setName] = useState(activeConsultant.name || 'Afia Mensah');
  const [phone, setPhone] = useState(activeConsultant.phone || '233240000000');
  const [consultantId, setConsultantId] = useState(activeConsultant.id || 'GH-2026-981');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Clean phone number (strip spaces, +, dashes)
  const cleanPhone = phone.replace(/[^0-9]/g, '');

  const baseUrl = window.location.origin + window.location.pathname;
  const affiliateUrl = `${baseUrl}?consultant=${encodeURIComponent(name)}&phone=${cleanPhone}&id=${encodeURIComponent(consultantId)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(affiliateUrl);
    setCopied(true);
    onUpdateConsultant({ name, phone: cleanPhone, id: consultantId });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApply = (e) => {
    e.preventDefault();
    onUpdateConsultant({ name, phone: cleanPhone, id: consultantId });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-xl bg-white dark:bg-[#0A0A0C] text-[#1A1615] dark:text-white rounded-3xl border border-[#EADBCE] dark:border-white/10 shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-[#EADBCE] dark:border-zinc-800 bg-[#FAF6F0] dark:bg-zinc-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#1A1615] dark:bg-[#DEB573] text-[#DEB573] dark:text-[#1A1615] flex items-center justify-center font-bold">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#C48B3B] dark:text-[#DEB573] block">
                Brand Partner Multi-Tenant Portal
              </span>
              <h2 className="font-serif text-2xl font-bold text-[#1A1615] dark:text-white">
                Generate Your Affiliate Store Link
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-[#8C7B72] dark:text-zinc-400 hover:text-[#1A1615] dark:hover:text-white rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <form onSubmit={handleApply} className="p-6 sm:p-8 space-y-5 overflow-y-auto">
          <p className="text-xs text-[#6E5D53] dark:text-zinc-400 leading-relaxed">
            Every Oriflame consultant can generate a personalized link. When customers purchase through your link, 
            <strong> all WhatsApp orders, cart inquiries, and commissions are dispatched directly to your personal phone!</strong>
          </p>

          <div className="space-y-3.5 text-xs">
            <div>
              <label className="text-[11px] font-semibold text-[#6E5D53] dark:text-zinc-300 block mb-1">
                Your Consultant Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Afia Mensah / Blessing Adeleke"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF6F0] dark:bg-zinc-900 border border-[#EADBCE] dark:border-zinc-800 focus:outline-none focus:ring-1 focus:ring-[#DEB573]"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-[#6E5D53] dark:text-zinc-300 block mb-1">
                  WhatsApp Phone (International) *
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 233240000000"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF6F0] dark:bg-zinc-900 border border-[#EADBCE] dark:border-zinc-800 focus:outline-none focus:ring-1 focus:ring-[#DEB573]"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[#6E5D53] dark:text-zinc-300 block mb-1">
                  Oriflame Partner ID
                </label>
                <input
                  type="text"
                  value={consultantId}
                  onChange={(e) => setConsultantId(e.target.value)}
                  placeholder="e.g. GH-2026-981"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF6F0] dark:bg-zinc-900 border border-[#EADBCE] dark:border-zinc-800 focus:outline-none focus:ring-1 focus:ring-[#DEB573]"
                />
              </div>
            </div>
          </div>

          {/* Generated URL Box */}
          <div className="p-4 bg-[#FAF6F0] dark:bg-zinc-900 rounded-2xl border border-[#DEB573]/50 space-y-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#C48B3B] dark:text-[#DEB573] block">
              Your Unique Shareable Store Link:
            </span>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={affiliateUrl}
                className="flex-1 text-xs font-mono px-3 py-2 bg-white dark:bg-zinc-800 rounded-xl border border-[#EADBCE] dark:border-zinc-700 text-[#1A1615] dark:text-white select-all"
              />
              <button
                type="button"
                onClick={handleCopy}
                className="px-4 py-2 rounded-xl bg-[#1A1615] dark:bg-[#DEB573] text-white dark:text-[#1A1615] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400 dark:text-emerald-800" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex gap-3">
            <button
              type="submit"
              className="flex-1 py-3.5 rounded-full bg-[#1A1615] dark:bg-[#DEB573] text-white dark:text-[#1A1615] hover:bg-[#26201E] dark:hover:bg-[#F5DFC2] text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer"
            >
              Activate This Consultant Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
