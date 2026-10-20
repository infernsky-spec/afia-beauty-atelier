import React, { useState, useEffect } from 'react';
import storeService from '../services/storeService';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Phone, 
  Check, 
  Truck,
  CreditCard,
  Smartphone,
  ShieldCheck,
  RotateCw,
  CheckCircle2,
  Lock
} from 'lucide-react';

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQty,
  onRemoveItem,
  onClearCart,
  formatPrice,
  currency,
  totalGHS,
  isVipMember,
  consultantPhone = '233240000000',
  consultantName = 'Afia Mensah'
}) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: 'Accra Metro',
    address: '',
    paymentMethod: 'momo',
    momoNetwork: 'MTN Mobile Money'
  });
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [confirmedOrderId, setConfirmedOrderId] = useState('');
  const [isProcessingMoMo, setIsProcessingMoMo] = useState(false);
  const [momoCountdown, setMomoCountdown] = useState(5);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const effectiveTotalGHS = isVipMember ? Math.round(totalGHS * 0.8) : totalGHS;
  const formattedTotal = formatPrice(effectiveTotalGHS);

  const generateWhatsAppMessage = () => {
    let msg = `*ORIFLAME BEAUTY • DISPATCH ORDER*\n`;
    msg += `Ref: AFIA-Q4-${Math.floor(1000 + Math.random() * 9000)}\n`;
    msg += `─────────────────────────\n`;
    msg += `*Consultant Attendant:* ${consultantName}\n`;
    msg += `*Customer:* ${formData.name || 'Valued Customer'}\n`;
    msg += `*Phone:* ${formData.phone || 'Direct Customer Phone'}\n`;
    msg += `*Hub/Destination:* ${formData.city}\n`;
    if (formData.address) msg += `*Delivery Landmark:* ${formData.address}\n`;
    msg += `*Settlement Mode:* ${formData.paymentMethod === 'momo' ? `${formData.momoNetwork} (Instant)` : 'Card / Bank Transfer'}\n`;
    if (isVipMember) msg += `*Tier:* VIP Wholesale -20%\n`;
    msg += `─────────────────────────\n`;
    msg += `*ORDERED ITEMS:*\n\n`;

    cartItems.forEach((item, index) => {
      const unitPrice = isVipMember ? Math.round(item.priceGHS * 0.8) : item.priceGHS;
      const lineTotal = formatPrice(unitPrice * item.qty);
      msg += `${index + 1}. [Code #${item.code}] *${item.name}*\n`;
      if (item.selectedVariant) msg += `   • Shade: ${item.selectedVariant}\n`;
      msg += `   • Volume: ${item.volume} (Pg ${item.page})\n`;
      msg += `   • ${item.qty} unit(s) × ${formatPrice(unitPrice)} = ${lineTotal}\n\n`;
    });

    msg += `─────────────────────────\n`;
    msg += `*TOTAL AMOUNT:* ${formattedTotal} (${currency})\n\n`;
    msg += `_Please acknowledge dispatch schedule and provide delivery timeline._`;

    return encodeURIComponent(msg);
  };

  const handleWhatsAppDispatch = () => {
    const orderRef = 'TXN-WA-' + Math.floor(100000 + Math.random() * 900000);
    storeService.addOrder({
      id: orderRef,
      date: new Date().toISOString(),
      customer: formData.name || 'WhatsApp Customer',
      phone: formData.phone || consultantPhone,
      city: formData.city,
      address: formData.address || '',
      paymentMethod: 'WhatsApp Dispatch',
      items: cartItems.map((item) => ({
        name: item.name,
        code: item.code,
        qty: item.qty,
        price: isVipMember ? Math.round(item.priceGHS * 0.8) : item.priceGHS,
        variant: item.selectedVariant || null
      })),
      totalGHS: effectiveTotalGHS,
      isVip: isVipMember,
      consultantName,
      status: 'Pending Dispatch'
    });
    const waUrl = `https://wa.me/${consultantPhone}?text=${generateWhatsAppMessage()}`;
    window.open(waUrl, '_blank');
  };

  // Automated MoMo Prompt Simulation
  const handleDigitalSettlement = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      alert('Please state your recipient name and telephone contact.');
      return;
    }

    const orderRef = formData.paymentMethod === 'momo'
      ? 'TXN-MOMO-' + Math.floor(100000 + Math.random() * 900000)
      : 'TXN-PAYSTACK-' + Math.floor(100000 + Math.random() * 900000);

    storeService.addOrder({
      id: orderRef,
      date: new Date().toISOString(),
      customer: formData.name,
      phone: formData.phone,
      city: formData.city,
      address: formData.address || '',
      paymentMethod: formData.paymentMethod === 'momo' ? formData.momoNetwork : 'Paystack Card',
      items: cartItems.map((item) => ({
        name: item.name,
        code: item.code,
        qty: item.qty,
        price: isVipMember ? Math.round(item.priceGHS * 0.8) : item.priceGHS,
        variant: item.selectedVariant || null
      })),
      totalGHS: effectiveTotalGHS,
      isVip: isVipMember,
      consultantName,
      status: 'Pending Dispatch'
    });

    if (formData.paymentMethod === 'momo') {
      setIsProcessingMoMo(true);
      setMomoCountdown(5);

      const timer = setInterval(() => {
        setMomoCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setIsProcessingMoMo(false);
            setConfirmedOrderId(orderRef);
            setOrderConfirmed(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setConfirmedOrderId(orderRef);
      setOrderConfirmed(true);
    }
  };

  const handleFinish = () => {
    setOrderConfirmed(false);
    onClearCart();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-white dark:bg-[#0A0A0C] text-[#1A1615] dark:text-white h-full shadow-2xl flex flex-col justify-between overflow-hidden border-l border-[#EADBCE] dark:border-white/10 sm:rounded-l-3xl animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-[#EADBCE] dark:border-zinc-800 flex items-center justify-between bg-[#FAF6F0] dark:bg-zinc-950">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#1A1615] dark:bg-[#DEB573] text-[#DEB573] dark:text-[#1A1615] flex items-center justify-center font-bold">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif text-xl font-bold text-[#1A1615] dark:text-white">Your Shopping Bag</h2>
              <span className="text-[11px] font-semibold text-[#8C7B72] dark:text-zinc-400">
                {cartItems.length} Products {isVipMember && '• VIP Wholesale Tier'}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-[#8C7B72] dark:text-zinc-400 hover:text-[#1A1615] dark:hover:text-white rounded-full hover:bg-white dark:hover:bg-zinc-900 transition-colors cursor-pointer"
            aria-label="Close bag"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        {isProcessingMoMo ? (
          /* Live USSD MoMo Prompt Simulation */
          <div className="flex-1 p-8 flex flex-col items-center justify-center text-center space-y-6">
            <div className="relative w-20 h-20 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-[#DEB573]/30 animate-ping" />
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#DEB573] to-[#C48B3B] text-[#1A1615] flex items-center justify-center shadow-lg">
                <Smartphone className="w-8 h-8" />
              </div>
            </div>

            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#DEB573]/20 text-[#C48B3B] dark:text-[#DEB573]">
                {formData.momoNetwork} Gateway
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#1A1615] dark:text-white">
                Authorize Prompt on Your Phone
              </h3>
              <p className="text-xs text-[#6E5D53] dark:text-zinc-400 max-w-xs leading-relaxed">
                A secure payment authorization request has been dispatched to <strong>{formData.phone}</strong>. Please enter your MoMo PIN.
              </p>
            </div>

            <div className="p-4 bg-[#FAF6F0] dark:bg-zinc-900 rounded-2xl border border-[#DEB573]/40 w-full max-w-xs space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-[#8C7B72] dark:text-zinc-400">Amount:</span>
                <span className="font-bold text-[#1A1615] dark:text-white">{formattedTotal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8C7B72] dark:text-zinc-400">Time Remaining:</span>
                <span className="font-bold text-[#C48B3B] dark:text-[#DEB573]">{momoCountdown}s</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-[#8C7B72] dark:text-zinc-400">
              <Lock className="w-3.5 h-3.5 text-emerald-500" />
              <span>256-bit Bank Grade Encrypted Settlement</span>
            </div>
          </div>
        ) : orderConfirmed ? (
          /* Settlement Confirmation View */
          <div className="flex-1 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-6">
              <div className="rounded-3xl border border-[#DEB573] p-6 bg-[#FAF6F0] dark:bg-zinc-900 space-y-4 shadow-sm">
                <div className="flex items-center justify-between border-b border-[#EADBCE] dark:border-zinc-800 pb-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#C48B3B] dark:text-[#DEB573] font-bold">
                      Settlement Successful
                    </span>
                  </div>
                  <span className="font-mono text-xs font-bold text-[#1A1615] dark:text-white">
                    {confirmedOrderId}
                  </span>
                </div>

                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-[#8C7B72] dark:text-zinc-400">Client Name:</span>
                    <span className="font-bold text-[#1A1615] dark:text-white">{formData.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8C7B72] dark:text-zinc-400">Telephone:</span>
                    <span className="font-bold text-[#1A1615] dark:text-white">{formData.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8C7B72] dark:text-zinc-400">Attendant Consultant:</span>
                    <span className="font-bold text-[#C48B3B] dark:text-[#DEB573]">{consultantName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8C7B72] dark:text-zinc-400">Destination:</span>
                    <span className="font-bold text-[#1A1615] dark:text-white">{formData.city}</span>
                  </div>
                  <div className="flex justify-between border-t border-[#EADBCE] dark:border-zinc-800 pt-2 text-sm font-bold">
                    <span>Authorized Total:</span>
                    <span className="text-[#C48B3B] dark:text-[#DEB573]">{formattedTotal}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-white dark:bg-zinc-900 rounded-2xl border border-[#EADBCE] dark:border-zinc-800 space-y-2 text-xs text-[#6E5D53] dark:text-zinc-400">
                <h4 className="font-bold text-[#1A1615] dark:text-white">
                  Dispatch Protocols & Tracking
                </h4>
                <p className="leading-relaxed">
                  Your payment authorization has been settled. Our logistics center in Accra/Lagos is preparing dispatch. A tracking notification will arrive on your phone.
                </p>
              </div>
            </div>

            <div className="pt-6 space-y-2.5">
              <button
                onClick={handleWhatsAppDispatch}
                className="w-full py-3.5 rounded-full bg-[#25D366] hover:bg-[#20BD5A] text-white text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md"
              >
                <Phone className="w-4 h-4" />
                <span>Send Copy to Consultant on WhatsApp</span>
              </button>

              <button
                onClick={handleFinish}
                className="w-full py-3 rounded-full border border-[#1A1615] dark:border-zinc-700 hover:bg-[#FAF6F0] dark:hover:bg-zinc-800 text-[#1A1615] dark:text-white text-xs font-bold transition-all cursor-pointer"
              >
                Continue Browsing
              </button>
            </div>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="flex-1 p-8 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 rounded-full border border-[#EADBCE] dark:border-zinc-800 bg-[#FAF6F0] dark:bg-zinc-900 flex items-center justify-center text-[#A8988E]">
              <ShoppingBag className="w-7 h-7" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#1A1615] dark:text-white">
              Your Bag is Empty
            </h3>
            <p className="text-xs text-[#8C7B72] dark:text-zinc-400 max-w-xs leading-relaxed font-sans">
              Browse our brand-new Oct – Dec 2026 catalogue collection to add fine perfumes, Novage+ routines, and daily essentials.
            </p>
            <button
              onClick={onClose}
              className="mt-2 px-6 py-3 rounded-full bg-[#1A1615] dark:bg-white text-white dark:text-[#1A1615] text-xs font-bold transition-all cursor-pointer shadow-md"
            >
              Browse Q4 Catalogue
            </button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {/* Items List */}
            <div className="space-y-3">
              {cartItems.map((item) => {
                const unitPrice = isVipMember ? Math.round(item.priceGHS * 0.8) : item.priceGHS;
                return (
                  <div 
                    key={item.id + (item.selectedVariant || '')}
                    className="flex gap-3.5 p-3.5 bg-[#FAF6F0] dark:bg-zinc-900 rounded-2xl border border-[#EADBCE] dark:border-zinc-800 transition-colors"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-xl border border-[#EADBCE] dark:border-zinc-800 bg-white shrink-0"
                    />

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-1">
                          <h4 className="font-serif text-sm font-bold text-[#1A1615] dark:text-white line-clamp-1">
                            {item.name}
                          </h4>
                          <button
                            onClick={() => onRemoveItem(item.id)}
                            className="text-[#A8988E] hover:text-[#D96B6B] transition-colors p-1 cursor-pointer"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="flex items-center gap-2 text-[10px] text-[#8C7B72] dark:text-zinc-400 mt-0.5">
                          <span className="font-mono font-semibold bg-white dark:bg-zinc-800 px-2 py-0.5 rounded-full border border-[#EADBCE] dark:border-zinc-700">
                            Code: #{item.code}
                          </span>
                          {item.selectedVariant && <span>• {item.selectedVariant}</span>}
                          <span>• {item.volume}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-[#EADBCE] dark:border-zinc-800">
                        <span className="font-mono text-xs font-bold text-[#1A1615] dark:text-white">
                          {formatPrice(unitPrice * item.qty)}
                        </span>

                        <div className="flex items-center border border-[#EADBCE] dark:border-zinc-700 rounded-full bg-white dark:bg-zinc-800 overflow-hidden">
                          <button
                            onClick={() => onUpdateQty(item.id, item.qty - 1)}
                            className="px-2.5 py-1 text-xs hover:bg-[#FAF6F0] dark:hover:bg-zinc-700 cursor-pointer"
                          >
                            <Minus className="w-2.5 h-2.5" />
                          </button>
                          <span className="px-2.5 text-xs font-bold">{item.qty}</span>
                          <button
                            onClick={() => onUpdateQty(item.id, item.qty + 1)}
                            className="px-2.5 py-1 text-xs hover:bg-[#FAF6F0] dark:hover:bg-zinc-700 cursor-pointer"
                          >
                            <Plus className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Recipient Form */}
            <div className="border border-[#EADBCE] dark:border-zinc-800 p-4.5 bg-white dark:bg-zinc-900 rounded-3xl space-y-3.5">
              <span className="text-[11px] uppercase tracking-wider text-[#C48B3B] dark:text-[#DEB573] block font-bold">
                Delivery Coordinates & Destination:
              </span>

              <div className="space-y-2.5 text-xs">
                <div>
                  <label className="text-[11px] font-semibold text-[#6E5D53] dark:text-zinc-300 block mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Afia Mensah / Chioma Okafor"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#FAF6F0] dark:bg-zinc-800 border border-[#EADBCE] dark:border-zinc-700 focus:outline-none focus:ring-1 focus:ring-[#DEB573]"
                    required
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-[#6E5D53] dark:text-zinc-300 block mb-1">
                    Mobile Money / WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="e.g. 024 123 4567 or +233 24 123 4567"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#FAF6F0] dark:bg-zinc-800 border border-[#EADBCE] dark:border-zinc-700 focus:outline-none focus:ring-1 focus:ring-[#DEB573]"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-semibold text-[#6E5D53] dark:text-zinc-300 block mb-1">
                      City / Hub
                    </label>
                    <select
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 rounded-xl bg-[#FAF6F0] dark:bg-zinc-800 border border-[#EADBCE] dark:border-zinc-700 focus:outline-none focus:ring-1 focus:ring-[#DEB573] text-xs"
                    >
                      <option value="Accra Metro">Accra Metro (Ghana)</option>
                      <option value="Tema / Greater Accra">Tema (Ghana)</option>
                      <option value="Kumasi Metro">Kumasi (Ghana)</option>
                      <option value="Takoradi">Takoradi (Ghana)</option>
                      <option value="Ikeja / Lagos Mainland">Lagos Mainland (Nigeria)</option>
                      <option value="Victoria Island / Lekki">Lagos Island (Nigeria)</option>
                      <option value="Abuja FCT">Abuja FCT (Nigeria)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-[#6E5D53] dark:text-zinc-300 block mb-1">
                      Landmark / Area
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="e.g. East Legon"
                      className="w-full px-3.5 py-2 rounded-xl bg-[#FAF6F0] dark:bg-zinc-800 border border-[#EADBCE] dark:border-zinc-700 focus:outline-none focus:ring-1 focus:ring-[#DEB573]"
                    />
                  </div>
                </div>

                {/* Settlement Method */}
                <div>
                  <label className="text-[11px] font-semibold text-[#6E5D53] dark:text-zinc-300 block mb-1">
                    Select Payment Gateway
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, paymentMethod: 'momo' })}
                      className={`p-2.5 rounded-xl border text-left cursor-pointer transition-colors ${
                        formData.paymentMethod === 'momo'
                          ? 'border-[#1A1615] dark:border-[#DEB573] bg-[#FAF6F0] dark:bg-zinc-800 font-bold'
                          : 'border-[#EADBCE] dark:border-zinc-700 text-[#8C7B72]'
                      }`}
                    >
                      <span className="block text-xs text-[#1A1615] dark:text-white">Mobile Money</span>
                      <span className="text-[10px] text-[#C48B3B] dark:text-[#DEB573]">Instant USSD Prompt</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, paymentMethod: 'card' })}
                      className={`p-2.5 rounded-xl border text-left cursor-pointer transition-colors ${
                        formData.paymentMethod === 'card'
                          ? 'border-[#1A1615] dark:border-[#DEB573] bg-[#FAF6F0] dark:bg-zinc-800 font-bold'
                          : 'border-[#EADBCE] dark:border-zinc-700 text-[#8C7B72]'
                      }`}
                    >
                      <span className="block text-xs text-[#1A1615] dark:text-white">Card / Bank</span>
                      <span className="text-[10px] text-[#C48B3B] dark:text-[#DEB573]">Paystack Verified</span>
                    </button>
                  </div>
                </div>

                {formData.paymentMethod === 'momo' && (
                  <div>
                    <label className="text-[11px] font-semibold text-[#6E5D53] dark:text-zinc-300 block mb-1">
                      Mobile Network Operator
                    </label>
                    <select
                      name="momoNetwork"
                      value={formData.momoNetwork}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 rounded-xl bg-[#FAF6F0] dark:bg-zinc-800 border border-[#EADBCE] dark:border-zinc-700 text-xs focus:outline-none focus:ring-1 focus:ring-[#DEB573]"
                    >
                      <option value="MTN Mobile Money">MTN Mobile Money (MoMo)</option>
                      <option value="Telecel Cash (Vodafone)">Telecel Cash (Vodafone)</option>
                      <option value="AT Money (AirtelTigo)">AT Money (AirtelTigo)</option>
                    </select>
                  </div>
                )}
              </div>
            </div>

            {/* Courier Note */}
            <div className="p-3.5 bg-[#FAF6F0] dark:bg-zinc-900 rounded-2xl border border-[#EADBCE] dark:border-zinc-800 flex items-start gap-2.5 text-xs text-[#6E5D53] dark:text-zinc-400">
              <Truck className="w-4 h-4 text-[#C48B3B] dark:text-[#DEB573] shrink-0 mt-0.5" />
              <span>Direct regional fulfillment from Ikeja, Lagos & Accra distribution hubs.</span>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        {!isProcessingMoMo && !orderConfirmed && cartItems.length > 0 && (
          <div className="p-5 border-t border-[#EADBCE] dark:border-zinc-800 bg-[#FAF6F0] dark:bg-zinc-950 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#8C7B72] dark:text-zinc-400 font-semibold uppercase">Total Amount:</span>
              <span className="text-xl font-bold text-[#1A1615] dark:text-white">{formattedTotal}</span>
            </div>

            <div className="space-y-2">
              <button
                onClick={handleDigitalSettlement}
                className="w-full py-3.5 rounded-full bg-[#1A1615] dark:bg-[#DEB573] text-white dark:text-[#1A1615] hover:bg-[#26201E] dark:hover:bg-[#F5DFC2] text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
              >
                <Smartphone className="w-4 h-4" />
                <span>Authorize {formData.paymentMethod === 'momo' ? `${formData.momoNetwork}` : 'Paystack Card'} ({formattedTotal})</span>
              </button>

              <button
                onClick={handleWhatsAppDispatch}
                className="w-full py-3 rounded-full bg-[#25D366] hover:bg-[#20BD5A] text-white text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs"
              >
                <Phone className="w-4 h-4" />
                <span>Dispatch Order via WhatsApp</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
