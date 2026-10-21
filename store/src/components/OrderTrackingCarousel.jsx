import React, { useState, useEffect } from 'react';
import storeService from '../services/storeService';
import { 
  Truck, 
  Package, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  ChevronRight, 
  X,
  ExternalLink,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

export default function OrderTrackingCarousel({ onQuickViewProduct }) {
  const [orders, setOrders] = useState(() => storeService.getOrders());
  const [activeTrackingOrder, setActiveTrackingOrder] = useState(null);

  useEffect(() => {
    const unsubscribe = storeService.subscribe(() => {
      setOrders(storeService.getOrders());
    });
    return unsubscribe;
  }, []);

  // Built-in active tracking dispatches matching Stitch discover_home.html & profile_orders.html
  const displayOrders = orders.length > 0 ? orders : [
    {
      id: 'AFIA-DISPATCH-9842',
      date: new Date().toISOString(),
      customer: 'Amina Mensah',
      city: 'Airport Residential, Accra',
      status: 'In Transit',
      courierEta: 'Arriving Today, 15:45',
      hub: 'Atelier Cold-Chain Hub Accra',
      courierPartner: 'DHL Express Prestige',
      totalGHS: 980,
      items: [
        {
          name: 'Novage+ Lift + Firm Serum',
          code: '41037',
          qty: 1,
          price: 520,
          image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&auto=format&fit=crop&q=80'
        },
        {
          name: 'Giordani Gold Essenza Supreme',
          code: '42256',
          qty: 1,
          price: 460,
          image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=500&auto=format&fit=crop&q=80'
        }
      ]
    },
    {
      id: 'AFIA-DISPATCH-7731',
      date: new Date(Date.now() - 3600000 * 4).toISOString(),
      customer: 'Kofi Boateng',
      city: 'East Legon Hills, Accra',
      status: 'Out for Delivery',
      courierEta: 'Today, 17:15',
      hub: 'Central Express Fulfillment Hub',
      courierPartner: 'FedEx Luxury Fleet',
      totalGHS: 620,
      items: [
        {
          name: 'All or Nothing Amplified Parfum',
          code: '46060',
          qty: 1,
          price: 620,
          image: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=500&auto=format&fit=crop&q=80'
        }
      ]
    },
    {
      id: 'AFIA-DISPATCH-6219',
      date: new Date(Date.now() - 3600000 * 24).toISOString(),
      customer: 'Dr. Evelyn Quaye',
      city: 'Cantonments Embassy Zone, Accra',
      status: 'Delivered',
      courierEta: 'Delivered Successfully',
      hub: 'Accra Prestige Depot',
      courierPartner: 'Concierge Direct Courier',
      totalGHS: 1450,
      items: [
        {
          name: 'Royal Velvet Restoring Night Cream',
          code: '22814',
          qty: 2,
          price: 360,
          image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=500&auto=format&fit=crop&q=80'
        }
      ]
    }
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'In Transit':
        return {
          bg: 'bg-[#ffdcc4]/60 dark:bg-[#8d4e12]/30 text-[#8d4e12] dark:text-[#ffdcc4] border border-[#8d4e12]/20',
          dot: 'bg-[#8d4e12] animate-ping',
          text: 'In Transit'
        };
      case 'Out for Delivery':
        return {
          bg: 'bg-amber-100 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-800',
          dot: 'bg-amber-500 animate-pulse',
          text: 'Arriving Today'
        };
      case 'Delivered':
        return {
          bg: 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800',
          dot: 'bg-emerald-500',
          text: 'Delivered'
        };
      default:
        return {
          bg: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-300 dark:border-zinc-700',
          dot: 'bg-zinc-400',
          text: status || 'Processing'
        };
    }
  };

  return (
    <div className="w-full py-2">
      {/* Header bar matching Stitch discover_home.html lines 20-25 */}
      <div className="flex items-center justify-between mb-2.5 px-0.5">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#8d4e12] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#8d4e12]"></span>
          </span>
          <span className="text-[11px] font-dm uppercase tracking-wider font-semibold text-[#7a776f] dark:text-zinc-400">
            Active Dispatch Tracking
          </span>
        </div>
        <span className="text-[11px] font-dm text-[#8d4e12] dark:text-[#ffdcc4] font-medium flex items-center gap-0.5">
          Live GPS Route
          <ChevronRight className="w-3 h-3" />
        </span>
      </div>

      {/* Horizontal Carousel */}
      <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 py-1 scroll-smooth">
        {displayOrders.map((order, idx) => {
          const badge = getStatusBadge(order.status);
          const firstItem = order.items && order.items[0];
          const itemImg = firstItem?.image || 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=500&auto=format&fit=crop&q=80';

          return (
            <div
              key={order.id || idx}
              onClick={() => setActiveTrackingOrder(order)}
              className="min-w-[260px] max-w-[280px] bg-white dark:bg-[#15151a] rounded-2xl p-3.5 flex items-center justify-between shadow-[0_4px_16px_-2px_rgba(28,27,25,0.04)] hover:shadow-[0_8px_24px_-4px_rgba(141,78,18,0.12)] border border-[#EADBCE]/80 dark:border-white/10 transition-all duration-300 hover:-translate-y-0.5 cursor-pointer shrink-0 group"
            >
              <div className="flex flex-col justify-between h-full space-y-2 min-w-0 pr-2">
                <div>
                  <span className="text-[10px] font-dm uppercase tracking-widest text-[#7a776f] dark:text-zinc-400 block truncate">
                    {order.customer ? `${order.customer.split(' ')[0]} • Ref #${order.id.slice(-5)}` : 'Afia Atelier'}
                  </span>
                  <p className="font-dm font-bold text-xs sm:text-sm text-[#1b1c1a] dark:text-white line-clamp-1 mt-0.5 group-hover:text-[#8d4e12] dark:group-hover:text-[#ffdcc4] transition-colors">
                    {firstItem?.name || 'Prestige Formulation'}
                  </p>
                  <p className="text-[11px] font-mono text-[#494740] dark:text-zinc-400 mt-0.5">
                    GH₵ {order.totalGHS?.toLocaleString() || '450.00'}
                  </p>
                </div>

                <div>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-dm font-semibold ${badge.bg}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`}></span>
                    <span>{order.courierEta || badge.text}</span>
                  </span>
                </div>
              </div>

              {/* Thumbnail Container */}
              <div className="w-16 h-16 rounded-xl bg-[#FAF6F0] dark:bg-zinc-900 overflow-hidden shrink-0 border border-[#EADBCE]/60 dark:border-white/5 relative">
                <img
                  src={itemImg}
                  alt={firstItem?.name || 'Product'}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
                  loading="lazy"
                />
                {order.items?.length > 1 && (
                  <span className="absolute bottom-1 right-1 bg-black/75 backdrop-blur-xs text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full">
                    +{order.items.length - 1}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Live Tracking Modal (from Stitch profile_orders.html) */}
      {activeTrackingOrder && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setActiveTrackingOrder(null)}
        >
          <div 
            className="w-full max-w-lg bg-[#fbf9f5] dark:bg-[#121216] text-[#1b1c1a] dark:text-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-[#EADBCE] dark:border-white/10 space-y-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Top Header */}
            <div className="flex items-center justify-between border-b border-[#EADBCE]/60 dark:border-white/10 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#8d4e12] animate-pulse"></span>
                  <span className="text-[11px] font-mono uppercase tracking-widest text-[#8d4e12] dark:text-[#ffdcc4] font-bold">
                    Active Courier Dispatch
                  </span>
                </div>
                <h3 className="font-serif text-xl sm:text-2xl font-bold mt-1 text-[#1b1c1a] dark:text-white">
                  Order #{activeTrackingOrder.id}
                </h3>
              </div>
              <button
                onClick={() => setActiveTrackingOrder(null)}
                className="w-9 h-9 rounded-full bg-white dark:bg-zinc-800 hover:bg-[#1b1c1a] text-[#1b1c1a] dark:text-white hover:text-white flex items-center justify-center shadow-xs transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Courier Status Pill Banner */}
            <div className="flex items-center justify-between p-3.5 px-4 rounded-2xl bg-[#ffdcc4]/50 dark:bg-[#8d4e12]/20 border border-[#8d4e12]/30">
              <div className="flex items-center gap-2 text-[#8d4e12] dark:text-[#ffdcc4]">
                <Truck className="w-5 h-5 text-[#8d4e12] dark:text-[#ffdcc4]" />
                <span className="font-dm font-bold text-sm">
                  {activeTrackingOrder.status || 'In Transit'}
                </span>
              </div>
              <span className="text-xs font-dm font-semibold text-[#8d4e12] dark:text-[#ffdcc4]">
                {activeTrackingOrder.courierEta || 'Expected Today'}
              </span>
            </div>

            {/* Courier & Destination Route Info */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-white dark:bg-[#1a1a20] rounded-xl border border-[#EADBCE]/60 dark:border-white/5 space-y-1">
                <span className="text-[10px] uppercase font-bold text-[#7a776f] dark:text-zinc-400 block">
                  Logistics Carrier
                </span>
                <span className="font-bold text-[#1b1c1a] dark:text-white block">
                  {activeTrackingOrder.courierPartner || 'DHL Express Prestige'}
                </span>
                <span className="text-[11px] text-[#494740] dark:text-zinc-400 block font-mono">
                  Cold-Chain Verified ✓
                </span>
              </div>

              <div className="p-3 bg-white dark:bg-[#1a1a20] rounded-xl border border-[#EADBCE]/60 dark:border-white/5 space-y-1">
                <span className="text-[10px] uppercase font-bold text-[#7a776f] dark:text-zinc-400 block">
                  Destination Hub
                </span>
                <span className="font-bold text-[#1b1c1a] dark:text-white block truncate">
                  {activeTrackingOrder.city || 'Accra Metro'}
                </span>
                <span className="text-[11px] text-[#494740] dark:text-zinc-400 block">
                  Direct Delivery Address
                </span>
              </div>
            </div>

            {/* Step-by-Step Dispatch Timeline (from Stitch profile_orders.html) */}
            <div className="space-y-3">
              <h4 className="text-xs font-dm uppercase font-bold tracking-wider text-[#7a776f] dark:text-zinc-400">
                Logistics Timeline
              </h4>

              <div className="relative pl-6 space-y-5 border-l-2 border-[#8d4e12]/30 dark:border-[#8d4e12]/40 ml-2">
                <div className="relative">
                  <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-[#8d4e12] ring-4 ring-[#ffdcc4] dark:ring-[#8d4e12]/40"></div>
                  <span className="text-xs font-bold text-[#1b1c1a] dark:text-white block">
                    Out on Last-Mile Delivery
                  </span>
                  <span className="text-[11px] text-[#494740] dark:text-zinc-400 block">
                    Courier vehicle assigned to dispatch zone • {activeTrackingOrder.courierEta || 'In progress'}
                  </span>
                </div>

                <div className="relative">
                  <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-emerald-600"></div>
                  <span className="text-xs font-bold text-[#1b1c1a] dark:text-white block">
                    Cold-Chain Quality Clearance
                  </span>
                  <span className="text-[11px] text-[#494740] dark:text-zinc-400 block">
                    Formulations checked & sealed at Stockholm Swedish Atelier standards
                  </span>
                </div>

                <div className="relative">
                  <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-emerald-600"></div>
                  <span className="text-xs font-bold text-[#1b1c1a] dark:text-white block">
                    Order Verification & Packing
                  </span>
                  <span className="text-[11px] text-[#494740] dark:text-zinc-400 block">
                    Assigned reference code #{activeTrackingOrder.id}
                  </span>
                </div>
              </div>
            </div>

            {/* Items in this order */}
            {activeTrackingOrder.items && activeTrackingOrder.items.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-[#EADBCE]/60 dark:border-white/10">
                <span className="text-xs font-dm uppercase font-bold tracking-wider text-[#7a776f] dark:text-zinc-400 block">
                  Items in Dispatch ({activeTrackingOrder.items.length})
                </span>
                <div className="space-y-2">
                  {activeTrackingOrder.items.map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-2.5 bg-white dark:bg-[#1a1a20] rounded-xl border border-[#EADBCE]/60 dark:border-white/5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-lg bg-[#FAF6F0] dark:bg-zinc-900 overflow-hidden shrink-0 border border-[#EADBCE]/40">
                          {item.image && (
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          )}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[#1b1c1a] dark:text-white line-clamp-1">
                            {item.name}
                          </p>
                          <span className="text-[10px] text-[#7a776f] dark:text-zinc-400 font-mono">
                            Qty: {item.qty} {item.variant ? `• ${item.variant}` : ''}
                          </span>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-[#1b1c1a] dark:text-white font-mono">
                        GH₵ {(item.price * item.qty).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={() => setActiveTrackingOrder(null)}
              className="w-full py-3 rounded-full bg-[#1b1c1a] dark:bg-white text-white dark:text-[#1b1c1a] font-dm font-bold text-xs hover:bg-[#8d4e12] transition-colors cursor-pointer"
            >
              Close Live Dispatch View
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
