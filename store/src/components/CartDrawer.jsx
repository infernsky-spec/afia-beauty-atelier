import React, { useState } from 'react';
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
  CheckCircle2,
  Lock,
  Tag
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
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [confirmedOrderId, setConfirmedOrderId] = useState('');
  const [isProcessingMoMo, setIsProcessingMoMo] = useState(false);
  const [momoCountdown, setMomoCountdown] = useState(5);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const applyPromo = (e) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'STITCH' || promoCode.trim().toUpperCase() === 'AFIAVIP') {
      setPromoDiscount(0.1); // 10% extra
      alert('Promo code applied: 10% Swedish Atelier Privilege Discount!');
    } else {
      alert('Invalid promo code. Try "AFIAVIP" or "STITCH".');
    }
  };

  let effectiveTotalGHS = isVipMember ? Math.round(totalGHS * 0.8) : totalGHS;
  if (promoDiscount > 0) {
    effectiveTotalGHS = Math.round(effectiveTotalGHS * (1 - promoDiscount));
  }
  const formattedTotal = formatPrice(effectiveTotalGHS);

  const generateWhatsAppMessage = () => {
    let msg = `*AFIA BEAUTY ATELIER • DISPATCH ORDER*\n`;
    msg += `Ref: AFIA-Q4-${Math.floor(1000 + Math.random() * 9000)}\n`;
    msg += `─────────────────────────\n`;
    msg += `*Consultant Attendant:* ${consultantName}\n`;
    msg += `*Customer:* ${formData.name || 'Valued Customer'}\n`;
    msg += `*Phone:* ${formData.phone || 'Direct Customer Phone'}\n`;
    msg += `*Hub/Destination:* ${formData.city}\n`;
    if (formData.address) msg += `*Delivery Landmark:* ${formData.address}\n`;
    msg += `*Settlement Mode:* ${formData.paymentMethod === 'momo' ? `${formData.momoNetwork} (Instant)` : 'Card / Bank Transfer'}\n`;
    if (isVipMember) msg += `*Tier:* VIP Wholesale -20%\n`;
    if (promoDiscount > 0) msg += `*Promo Privilege:* -10%\n`;
    msg += `─────────────────────────\n`;
    msg += `*ORDERED ITEMS:*\n\n`;

    cartItems.forEach((item, index) => {
      const unitPrice = isVipMember ? Math.round(item.priceGHS * 0.8) : item.priceGHS;
      const lineTotal = formatPrice(unitPrice * item.qty);
      msg += `${index + 1}. [Code #${item.code}] *${item.name}*\n`;
      if (item.selectedVariant) msg += `   • Shade/Variant: ${item.selectedVariant}\n`;
      msg += `   • Volume: ${item.volume} (Pg ${item.page})\n`;
      msg += `   • Quantity: ${item.qty} × ${formatPrice(unitPrice)} = ${lineTotal}\n\n`;
    });

    msg += `*TOTAL SETTLEMENT:* ${formattedTotal}\n`;
    msg += `─────────────────────────\n`;
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
        variant: item.selectedVariant || null,
        image: item.image
      })),
      totalGHS: effectiveTotalGHS,
      isVip: isVipMember,
      consultantName,
      status: 'In Transit',
      courierEta: 'Expected Tomorrow',
      courierPartner: 'DHL Express Prestige'
    });
    const waUrl = `https://wa.me/${consultantPhone}?text=${generateWhatsAppMessage()}`;
    window.open(waUrl, '_blank');
  };

  const handleDigitalSettlement = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      alert('Please state your recipient name and phone number.');
      return;
    }

    const orderRef = formData.paymentMethod === 'momo'
      ? 'TXN-MOMO-' + Math.floor(100000 + Math.random() * 900000)
      : 'TXN-CARD-' + Math.floor(100000 + Math.random() * 900000);

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
        variant: item.selectedVariant || null,
        image: item.image
      })),
      totalGHS: effectiveTotalGHS,
      isVip: isVipMember,
      consultantName,
      status: 'In Transit',
      courierEta: 'Arriving Today',
      courierPartner: 'DHL Express Prestige'
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
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
      <div 
        className="absolute inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10 w-full sm:max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full bg-[#fbf9f5] dark:bg-[#121216] text-[#1b1c1a] dark:text-white shadow-2xl flex flex-col justify-between border-l border-[#EADBCE]/80 dark:border-white/10">
          
          {/* Header matching Stitch shopping_cart.html */}
          <div className="p-4 sm:p-5 border-b border-[#EADBCE]/80 dark:border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#1b1c1a] dark:bg-white text-white dark:text-[#1b1c1a] flex items-center justify-center font-bold">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-dm font-bold text-base sm:text-lg text-[#1b1c1a] dark:text-white">
                  Shopping Bag ({cartItems.length})
                </h2>
                <span className="text-[10px] font-dm text-[#7a776f] dark:text-zinc-400">
                  Stockholm Cold-Chain Dispatch
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {cartItems.length > 0 && (
                <button
                  onClick={onClearCart}
                  className="text-xs font-dm text-[#8d4e12] dark:text-[#ffdcc4] hover:underline cursor-pointer"
                >
                  Clear all
                </button>
              )}
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-black/5 dark:bg-white/10 text-[#1b1c1a] dark:text-white flex items-center justify-center hover:bg-black/10 cursor-pointer"
                aria-label="Close bag"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Cart Content */}
          {isProcessingMoMo ? (
            /* Live USSD MoMo Prompt Simulation */
            <div className="flex-1 p-8 flex flex-col items-center justify-center text-center space-y-6">
              <div className="relative w-20 h-20 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-4 border-[#8d4e12]/30 animate-ping" />
                <div className="w-16 h-16 rounded-full bg-[#8d4e12] text-white flex items-center justify-center shadow-lg">
                  <Smartphone className="w-8 h-8 text-[#ffdcc4]" />
                </div>
              </div>

              <div className="space-y-2">
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#ffdcc4]/50 text-[#8d4e12] dark:text-[#ffdcc4]">
                  {formData.momoNetwork} Gateway
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#1b1c1a] dark:text-white">
                  Authorize Prompt on Your Phone
                </h3>
                <p className="text-xs text-[#7a776f] dark:text-zinc-400 max-w-xs leading-relaxed font-dm">
                  A secure payment authorization request has been dispatched to <strong>{formData.phone}</strong>. Please enter your MoMo PIN.
                </p>
              </div>

              <div className="p-4 bg-white dark:bg-[#1a1a20] rounded-2xl border border-[#8d4e12]/30 w-full max-w-xs space-y-2 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-[#7a776f]">Amount:</span>
                  <span className="font-bold text-[#1b1c1a] dark:text-white">{formattedTotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7a776f]">Time Remaining:</span>
                  <span className="font-bold text-[#8d4e12] dark:text-[#ffdcc4]">{momoCountdown}s</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-[#7a776f]">
                <Lock className="w-3.5 h-3.5 text-emerald-600" />
                <span>256-bit Bank Grade Encrypted Settlement</span>
              </div>
            </div>
          ) : orderConfirmed ? (
            /* Settlement Confirmation View */
            <div className="flex-1 p-6 overflow-y-auto space-y-5">
              <div className="rounded-3xl border border-[#8d4e12]/40 p-5 bg-white dark:bg-[#1a1a20] space-y-4 shadow-sm">
                <div className="flex items-center justify-between border-b border-[#EADBCE]/70 dark:border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#8d4e12] dark:text-[#ffdcc4] font-bold">
                      Settlement Confirmed
                    </span>
                  </div>
                  <span className="font-mono text-xs font-bold text-[#1b1c1a] dark:text-white">
                    {confirmedOrderId}
                  </span>
                </div>

                <div className="space-y-2 text-xs font-dm">
                  <div className="flex justify-between">
                    <span className="text-[#7a776f]">Client:</span>
                    <span className="font-bold">{formData.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#7a776f]">Phone:</span>
                    <span className="font-bold">{formData.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#7a776f]">Destination:</span>
                    <span className="font-bold">{formData.city}</span>
                  </div>
                  <div className="flex justify-between border-t border-[#EADBCE]/50 pt-2 font-bold">
                    <span>Authorized Total:</span>
                    <span className="text-[#8d4e12] dark:text-[#ffdcc4]">{formattedTotal}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-4">
                <button
                  onClick={handleWhatsAppDispatch}
                  className="w-full py-3.5 rounded-full bg-[#25D366] hover:bg-[#20BD5A] text-white text-xs font-dm font-bold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md"
                >
                  <Phone className="w-4 h-4" />
                  <span>Send Order to Consultant on WhatsApp</span>
                </button>

                <button
                  onClick={handleFinish}
                  className="w-full py-3 rounded-full border border-[#1b1c1a] dark:border-white/20 text-xs font-dm font-bold transition-all cursor-pointer hover:bg-black/5"
                >
                  Continue Exploring Atelier
                </button>
              </div>
            </div>
          ) : cartItems.length === 0 ? (
            <div className="flex-1 p-8 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full border border-[#EADBCE] dark:border-white/10 bg-[#f5f3ef] dark:bg-zinc-900 flex items-center justify-center text-[#7a776f]">
                <ShoppingBag className="w-7 h-7" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#1b1c1a] dark:text-white">
                Your Bag is Empty
              </h3>
              <p className="text-xs text-[#7a776f] dark:text-zinc-400 max-w-xs font-dm leading-relaxed">
                Discover Swedish skincare, Giordani Gold essentials, and signature haute parfums in our catalog.
              </p>
              <button
                onClick={onClose}
                className="mt-2 px-6 py-3 rounded-full bg-[#1b1c1a] dark:bg-white text-white dark:text-[#1b1c1a] text-xs font-dm font-bold transition-all cursor-pointer shadow-md"
              >
                Explore Curated Formulations
              </button>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
              {/* Items List matching Stitch shopping_cart.html */}
              <div className="space-y-3">
                {cartItems.map((item) => {
                  const unitPrice = isVipMember ? Math.round(item.priceGHS * 0.8) : item.priceGHS;
                  return (
                    <div 
                      key={item.id + (item.selectedVariant || '')}
                      className="relative flex items-center gap-3 bg-white dark:bg-[#1a1a20] p-3 rounded-2xl shadow-[0_4px_16px_-2px_rgba(28,27,25,0.04)] border border-[#EADBCE]/80 dark:border-white/5 transition-all"
                    >
                      {/* Product Thumbnail Cutout */}
                      <div className="relative w-18 h-20 bg-[#f5f3ef] dark:bg-zinc-900 rounded-xl overflow-hidden shrink-0 flex items-center justify-center p-1 border border-[#EADBCE]/50">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>

                      <div className="flex flex-col flex-1 min-w-0 pr-1">
                        <div className="flex items-start justify-between gap-1">
                          <div className="min-w-0">
                            <span className="text-[9px] font-dm uppercase tracking-wider text-[#7a776f] dark:text-zinc-400 block truncate">
                              {item.category} • REF #{item.code}
                            </span>
                            <h4 className="font-dm font-bold text-xs sm:text-sm text-[#1b1c1a] dark:text-white leading-tight truncate mt-0.5">
                              {item.name}
                            </h4>
                            {item.selectedVariant && (
                              <span className="text-[10px] text-[#8d4e12] dark:text-[#ffdcc4] font-dm block mt-0.5">
                                Shade: {item.selectedVariant}
                              </span>
                            )}
                          </div>
                          <button
                            onClick={() => onRemoveItem(item.id)}
                            className="text-[#7a776f] hover:text-rose-600 p-1 cursor-pointer transition-colors"
                            aria-label="Remove formulation"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Line Price & Tactile Stepper Pill (Stitch Pattern) */}
                        <div className="flex items-center justify-between mt-2 pt-1 border-t border-[#EADBCE]/40 dark:border-white/5">
                          <span className="font-dm font-bold text-xs sm:text-sm text-[#1b1c1a] dark:text-white">
                            {formatPrice(unitPrice * item.qty)}
                          </span>

                          <div className="flex items-center bg-[#f5f3ef] dark:bg-zinc-800 rounded-full px-1.5 py-0.5 gap-1.5 border border-[#EADBCE]/50">
                            <button
                              onClick={() => onUpdateQty(item.id, item.qty - 1)}
                              className="w-5 h-5 rounded-full flex items-center justify-center text-[#1b1c1a] dark:text-white hover:bg-black/5 active:scale-90 transition-transform cursor-pointer"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-dm font-bold text-[#1b1c1a] dark:text-white w-4 text-center">
                              {item.qty}
                            </span>
                            <button
                              onClick={() => onUpdateQty(item.id, item.qty + 1)}
                              className="w-5 h-5 rounded-full flex items-center justify-center text-[#1b1c1a] dark:text-white hover:bg-black/5 active:scale-90 transition-transform cursor-pointer"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Promo Code Capsule Input (Stitch shopping_cart.html) */}
              <form onSubmit={applyPromo} className="relative w-full">
                <input
                  type="text"
                  placeholder="Privilege code (e.g. AFIAVIP)"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="w-full h-10 pl-3.5 pr-20 rounded-full bg-white dark:bg-[#1a1a20] text-xs font-dm border border-[#EADBCE] dark:border-white/10 focus:outline-none focus:ring-1 focus:ring-[#8d4e12]"
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1 bottom-1 px-3 rounded-full bg-[#1b1c1a] dark:bg-white text-white dark:text-[#1b1c1a] text-[10px] font-dm font-bold hover:bg-[#8d4e12] transition-colors cursor-pointer"
                >
                  Apply
                </button>
              </form>

              {/* Recipient Details & MoMo Settlement Form */}
              <div className="bg-white dark:bg-[#1a1a20] rounded-2xl p-4 border border-[#EADBCE]/80 dark:border-white/5 space-y-3">
                <span className="text-xs font-dm font-bold text-[#1b1c1a] dark:text-white block">
                  Delivery Destination & Client Details
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs font-dm">
                  <input
                    type="text"
                    name="name"
                    placeholder="Recipient Name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="p-2 rounded-xl bg-[#f5f3ef] dark:bg-zinc-800 border border-[#EADBCE]/60 text-xs focus:outline-none focus:ring-1 focus:ring-[#8d4e12]"
                    required
                  />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Recipient Phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="p-2 rounded-xl bg-[#f5f3ef] dark:bg-zinc-800 border border-[#EADBCE]/60 text-xs focus:outline-none focus:ring-1 focus:ring-[#8d4e12]"
                    required
                  />
                </div>
                <input
                  type="text"
                  name="address"
                  placeholder="Street / Landmark / House No."
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded-xl bg-[#f5f3ef] dark:bg-zinc-800 border border-[#EADBCE]/60 text-xs focus:outline-none focus:ring-1 focus:ring-[#8d4e12]"
                />
              </div>

              {/* Breakdown Card */}
              <div className="bg-[#f5f3ef] dark:bg-[#1a1a20] rounded-2xl p-4 border border-[#EADBCE]/70 dark:border-white/5 space-y-2 text-xs font-dm">
                <div className="flex justify-between text-[#7a776f]">
                  <span>Subtotal</span>
                  <span className="font-bold text-[#1b1c1a] dark:text-white">{formatPrice(totalGHS)}</span>
                </div>
                {isVipMember && (
                  <div className="flex justify-between text-[#8d4e12] dark:text-[#ffdcc4] font-bold">
                    <span>VIP Member Savings (-20%)</span>
                    <span>-{formatPrice(Math.round(totalGHS * 0.2))}</span>
                  </div>
                )}
                {promoDiscount > 0 && (
                  <div className="flex justify-between text-[#8d4e12] font-bold">
                    <span>Privilege Code (-10%)</span>
                    <span>Active</span>
                  </div>
                )}
                <div className="flex justify-between text-[#7a776f]">
                  <span>Cold-Chain Courier</span>
                  <span className="text-emerald-600 font-bold">Complimentary</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-[#EADBCE]/60 font-bold text-sm">
                  <span>Settlement Total</span>
                  <span className="text-[#8d4e12] dark:text-[#ffdcc4] font-extrabold text-base">
                    {formattedTotal}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Bottom Actions Bar */}
          {!orderConfirmed && !isProcessingMoMo && cartItems.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-[#EADBCE]/80 dark:border-white/10 space-y-2 bg-[#fbf9f5] dark:bg-[#121216]">
              <button
                onClick={handleDigitalSettlement}
                className="w-full py-3.5 rounded-full bg-[#1b1c1a] dark:bg-white text-white dark:text-[#1b1c1a] font-dm font-bold text-xs hover:bg-[#8d4e12] dark:hover:bg-[#ffdcc4] transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer active:scale-95"
              >
                <Smartphone className="w-4 h-4 text-[#ffdcc4] dark:text-[#8d4e12]" />
                <span>Authorize MoMo Prompt • {formattedTotal}</span>
              </button>

              <button
                onClick={handleWhatsAppDispatch}
                className="w-full py-2.5 rounded-full border border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white font-dm font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Instant WhatsApp Checkout</span>
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
