import React, { useState, useMemo } from 'react';
import storeService from '../../services/storeService';
import storeConfig from '../../config/store.config';
import { 
  BarChart3, 
  ShoppingBag, 
  Package, 
  Users, 
  Settings, 
  ArrowLeft, 
  TrendingUp, 
  DollarSign, 
  Phone, 
  CheckCircle2, 
  Clock, 
  Truck, 
  Search, 
  X, 
  Filter, 
  ExternalLink, 
  MessageCircle, 
  Eye, 
  Edit3, 
  Save, 
  Sparkles, 
  Moon, 
  Sun,
  ShieldCheck,
  RefreshCw,
  Share2,
  Download
} from 'lucide-react';

export default function AdminDashboard({ onExitAdmin, isDarkMode, setIsDarkMode }) {
  const [activeTab, setActiveTab] = useState('orders'); // 'overview' | 'orders' | 'inventory' | 'affiliates' | 'settings'
  const [orders, setOrders] = useState(() => storeService.getOrders());
  const [products, setProducts] = useState(() => storeService.getProducts());
  const [config, setConfig] = useState(() => storeService.getConfigOverrides());
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newPriceInput, setNewPriceInput] = useState('');
  const [configSavedToast, setConfigSavedToast] = useState(false);

  // Analytics Metrics
  const totalRevenue = useMemo(() => {
    return orders.reduce((sum, o) => sum + (o.totalGHS || 0), 0);
  }, [orders]);

  const totalOrdersCount = orders.length;
  const aov = totalOrdersCount > 0 ? Math.round(totalRevenue / totalOrdersCount) : 0;
  const pendingOrdersCount = orders.filter((o) => o.status === 'Pending Dispatch').length;
  const deliveredOrdersCount = orders.filter((o) => o.status === 'Delivered').length;

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      if (orderStatusFilter !== 'All' && o.status !== orderStatusFilter) return false;
      if (orderSearch.trim()) {
        const q = orderSearch.toLowerCase();
        return (
          o.id.toLowerCase().includes(q) ||
          o.customer.toLowerCase().includes(q) ||
          o.phone.includes(q) ||
          o.city.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [orders, orderStatusFilter, orderSearch]);

  const handleUpdateStatus = (orderId, newStatus) => {
    const updated = storeService.updateOrderStatus(orderId, newStatus);
    setOrders(updated);
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
  };

  const handleSavePrice = (productId) => {
    if (!newPriceInput || isNaN(newPriceInput)) return;
    const updated = storeService.updateProductPrice(productId, Number(newPriceInput));
    setProducts(updated);
    setEditingProduct(null);
    setNewPriceInput('');
  };

  const handleToggleStock = (productId) => {
    const updated = storeService.toggleProductStock(productId);
    setProducts(updated);
  };

  const handleSaveConfig = (e) => {
    e.preventDefault();
    storeService.saveConfigOverrides(config);
    setConfigSavedToast(true);
    setTimeout(() => setConfigSavedToast(false), 2500);
  };

  const generateCustomerWhatsAppFollowUp = (order) => {
    const text = encodeURIComponent(
      `Hello ${order.customer}! This is ${order.consultantName || config.contact.ownerName} from ${config.branding.name}.\n\n` +
      `Your order *${order.id}* (Total: GH₵ ${order.totalGHS}) status is now: *${order.status}*.\n` +
      `Delivery Hub: ${order.city}\n\n` +
      `Thank you for shopping with us!`
    );
    return `https://wa.me/${order.phone.replace(/[^0-9]/g, '')}?text=${text}`;
  };

  return (
    <div className="min-h-screen bg-[#F4ECE1] dark:bg-[#000000] text-[#1A1615] dark:text-zinc-100 font-sans transition-colors duration-300 flex flex-col">
      {/* Top Admin Executive Header */}
      <header className="sticky top-0 z-50 bg-white/95 dark:bg-[#0A0A0C]/95 backdrop-blur-xl border-b border-[#EADBCE] dark:border-white/10 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onExitAdmin}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-[#1A1615] dark:bg-white text-white dark:text-[#1A1615] hover:bg-[#26201E] text-xs font-bold transition-all shadow-sm cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Return to Storefront</span>
            <span className="sm:hidden">Store</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="font-serif text-lg sm:text-xl font-extrabold tracking-wide text-[#1A1615] dark:text-white">
              {config.branding.namePrefix}<span className="text-[#C48B3B]">.</span>ADMIN
            </span>
            <span className="hidden md:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>LIVE CLOUD SYNC</span>
            </span>
          </div>
        </div>

        {/* Tab Switcher (Desktop) */}
        <nav className="hidden lg:flex items-center gap-1 bg-[#FAF6F0] dark:bg-zinc-900 p-1 rounded-full border border-[#EADBCE] dark:border-zinc-800">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-[#1A1615] dark:bg-[#DEB573] text-white dark:text-[#1A1615] shadow-xs'
                : 'text-[#6E5D53] dark:text-zinc-400 hover:text-[#1A1615] dark:hover:text-white'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer relative ${
              activeTab === 'orders'
                ? 'bg-[#1A1615] dark:bg-[#DEB573] text-white dark:text-[#1A1615] shadow-xs'
                : 'text-[#6E5D53] dark:text-zinc-400 hover:text-[#1A1615] dark:hover:text-white'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Orders & Dispatch</span>
            {pendingOrdersCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-amber-500 text-black text-[9px] font-extrabold flex items-center justify-center">
                {pendingOrdersCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('inventory')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'inventory'
                ? 'bg-[#1A1615] dark:bg-[#DEB573] text-white dark:text-[#1A1615] shadow-xs'
                : 'text-[#6E5D53] dark:text-zinc-400 hover:text-[#1A1615] dark:hover:text-white'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Inventory</span>
          </button>

          <button
            onClick={() => setActiveTab('affiliates')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'affiliates'
                ? 'bg-[#1A1615] dark:bg-[#DEB573] text-white dark:text-[#1A1615] shadow-xs'
                : 'text-[#6E5D53] dark:text-zinc-400 hover:text-[#1A1615] dark:hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Partners</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-[#1A1615] dark:bg-[#DEB573] text-white dark:text-[#1A1615] shadow-xs'
                : 'text-[#6E5D53] dark:text-zinc-400 hover:text-[#1A1615] dark:hover:text-white'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Store Config</span>
          </button>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-full bg-[#FAF6F0] dark:bg-zinc-800 text-[#1A1615] dark:text-white border border-[#EADBCE] dark:border-zinc-700 cursor-pointer"
            aria-label="Toggle theme"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-[#DEB573]" /> : <Moon className="w-4 h-4" />}
          </button>

          <div className="flex items-center gap-2 pl-2 border-l border-[#EADBCE] dark:border-zinc-800">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#DEB573] to-[#C48B3B] text-[#1A1615] flex items-center justify-center font-bold text-xs shadow-xs">
              {config.contact.ownerName.charAt(0)}
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-xs font-bold leading-tight">{config.contact.ownerName}</div>
              <div className="text-[10px] text-[#8C7B72] dark:text-zinc-400">Store Administrator</div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Tab Navigation Pill Bar */}
      <div className="lg:hidden flex items-center gap-1.5 px-4 py-2.5 overflow-x-auto no-scrollbar bg-white dark:bg-[#0A0A0C] border-b border-[#EADBCE] dark:border-zinc-800">
        {[
          { id: 'overview', label: 'Overview', icon: BarChart3 },
          { id: 'orders', label: `Orders (${pendingOrdersCount})`, icon: ShoppingBag },
          { id: 'inventory', label: 'Inventory', icon: Package },
          { id: 'affiliates', label: 'Partners', icon: Users },
          { id: 'settings', label: 'Settings', icon: Settings }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap shrink-0 transition-all ${
                isActive
                  ? 'bg-[#1A1615] dark:bg-[#DEB573] text-white dark:text-[#1A1615]'
                  : 'bg-[#FAF6F0] dark:bg-zinc-900 text-[#6E5D53] dark:text-zinc-400'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Admin Content Body */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        
        {/* KPI Cards Row (Visible on all tabs) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          <div className="bg-white dark:bg-[#0E0E10] border border-[#EADBCE] dark:border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-sm">
            <div className="flex items-center justify-between text-[#8C7B72] dark:text-zinc-400 text-xs font-semibold mb-2">
              <span>Gross Revenue</span>
              <div className="w-7 h-7 rounded-full bg-[#DEB573]/20 text-[#C48B3B] dark:text-[#DEB573] flex items-center justify-center">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-serif font-bold text-[#1A1615] dark:text-white">
              GH₵ {totalRevenue.toLocaleString()}
            </div>
            <div className="text-[10px] text-emerald-500 font-bold flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" />
              <span>+18.4% from catalogue launch</span>
            </div>
          </div>

          <div className="bg-white dark:bg-[#0E0E10] border border-[#EADBCE] dark:border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-sm">
            <div className="flex items-center justify-between text-[#8C7B72] dark:text-zinc-400 text-xs font-semibold mb-2">
              <span>Total Orders</span>
              <div className="w-7 h-7 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center">
                <ShoppingBag className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-serif font-bold text-[#1A1615] dark:text-white">
              {totalOrdersCount} Orders
            </div>
            <div className="text-[10px] text-[#8C7B72] dark:text-zinc-400 mt-1">
              <strong>{pendingOrdersCount}</strong> awaiting courier pickup
            </div>
          </div>

          <div className="bg-white dark:bg-[#0E0E10] border border-[#EADBCE] dark:border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-sm">
            <div className="flex items-center justify-between text-[#8C7B72] dark:text-zinc-400 text-xs font-semibold mb-2">
              <span>Avg Order Value (AOV)</span>
              <div className="w-7 h-7 rounded-full bg-purple-500/10 text-purple-500 flex items-center justify-center">
                <BarChart3 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-serif font-bold text-[#1A1615] dark:text-white">
              GH₵ {aov.toLocaleString()}
            </div>
            <div className="text-[10px] text-[#8C7B72] dark:text-zinc-400 mt-1">
              Driven by Novage+ routines
            </div>
          </div>

          <div className="bg-white dark:bg-[#0E0E10] border border-[#EADBCE] dark:border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-sm">
            <div className="flex items-center justify-between text-[#8C7B72] dark:text-zinc-400 text-xs font-semibold mb-2">
              <span>Catalog Formulations</span>
              <div className="w-7 h-7 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-serif font-bold text-[#1A1615] dark:text-white">
              {products.length} Active Items
            </div>
            <div className="text-[10px] text-emerald-500 font-bold mt-1">
              100% In Stock & Verified
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* TAB 1: OVERVIEW & ANALYTICS                                   */}
        {/* ============================================================== */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Sales by Channel Card */}
              <div className="bg-white dark:bg-[#0E0E10] border border-[#EADBCE] dark:border-white/10 rounded-3xl p-6 shadow-sm space-y-4">
                <h3 className="font-serif text-lg font-bold text-[#1A1615] dark:text-white">
                  Settlement & Channel Breakdown
                </h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span>MTN Mobile Money</span>
                      <span>54% (GH₵ 3,010)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[#FAF6F0] dark:bg-zinc-800 overflow-hidden">
                      <div className="h-full bg-amber-400 rounded-full w-[54%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span>Direct WhatsApp Dispatch</span>
                      <span>28% (GH₵ 1,560)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[#FAF6F0] dark:bg-zinc-800 overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full w-[28%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span>Telecel & AT Money</span>
                      <span>18% (GH₵ 1,000)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[#FAF6F0] dark:bg-zinc-800 overflow-hidden">
                      <div className="h-full bg-rose-500 rounded-full w-[18%]" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Regional Delivery Hubs */}
              <div className="bg-white dark:bg-[#0E0E10] border border-[#EADBCE] dark:border-white/10 rounded-3xl p-6 shadow-sm space-y-4">
                <h3 className="font-serif text-lg font-bold text-[#1A1615] dark:text-white">
                  Top Delivery Hubs
                </h3>
                <ul className="space-y-3 text-xs">
                  <li className="flex items-center justify-between pb-2 border-b border-[#FAF6F0] dark:border-zinc-800">
                    <span className="font-semibold">Accra Metro (East Legon / Cantonments)</span>
                    <span className="font-bold text-[#C48B3B] dark:text-[#DEB573]">62% of Orders</span>
                  </li>
                  <li className="flex items-center justify-between pb-2 border-b border-[#FAF6F0] dark:border-zinc-800">
                    <span className="font-semibold">Kumasi Central (Ahodwo / KNUST)</span>
                    <span className="font-bold text-[#C48B3B] dark:text-[#DEB573]">21% of Orders</span>
                  </li>
                  <li className="flex items-center justify-between pb-2 border-b border-[#FAF6F0] dark:border-zinc-800">
                    <span className="font-semibold">Lagos Hub (Ikeja / Victoria Island)</span>
                    <span className="font-bold text-[#C48B3B] dark:text-[#DEB573]">12% of Orders</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="font-semibold">Takoradi & Cape Coast Hub</span>
                    <span className="font-bold text-[#C48B3B] dark:text-[#DEB573]">5% of Orders</span>
                  </li>
                </ul>
              </div>

              {/* VIP Customer Penetration */}
              <div className="bg-white dark:bg-[#0E0E10] border border-[#EADBCE] dark:border-white/10 rounded-3xl p-6 shadow-sm space-y-4">
                <h3 className="font-serif text-lg font-bold text-[#1A1615] dark:text-white">
                  VIP Wholesale Penetration
                </h3>
                <div className="p-4 rounded-2xl bg-gradient-to-tr from-[#DEB573]/20 via-transparent to-transparent border border-[#DEB573]/30 space-y-2">
                  <div className="text-3xl font-serif font-bold text-[#C48B3B] dark:text-[#DEB573]">
                    25.0%
                  </div>
                  <p className="text-xs text-[#6E5D53] dark:text-zinc-300 leading-relaxed">
                    1 in every 4 clients activated the 20% VIP wholesale rate, generating 42% larger basket sizes!
                  </p>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: ORDERS & DISPATCH                                      */}
        {/* ============================================================== */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            
            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-[#0E0E10] p-4 rounded-2xl sm:rounded-3xl border border-[#EADBCE] dark:border-white/10">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C7B72]" />
                <input
                  type="text"
                  placeholder="Search customer, phone, transaction ID or hub..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-xs rounded-full bg-[#FAF6F0] dark:bg-zinc-900 border border-[#EADBCE] dark:border-zinc-800 text-[#1A1615] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#DEB573]"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-[#8C7B72] dark:text-zinc-400 font-semibold hidden sm:inline">Status:</span>
                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="bg-[#FAF6F0] dark:bg-zinc-900 border border-[#EADBCE] dark:border-zinc-800 rounded-full px-3 py-2 text-xs font-bold cursor-pointer"
                >
                  <option value="All">All Statuses ({orders.length})</option>
                  <option value="Pending Dispatch">Pending Dispatch</option>
                  <option value="Dispatched">Dispatched</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white dark:bg-[#0E0E10] rounded-3xl border border-[#EADBCE] dark:border-white/10 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF6F0] dark:bg-zinc-950 border-b border-[#EADBCE] dark:border-zinc-800 text-[#8C7B72] dark:text-zinc-400 uppercase font-semibold">
                    <tr>
                      <th className="py-3.5 px-4 sm:px-6">Transaction ID</th>
                      <th className="py-3.5 px-4">Customer</th>
                      <th className="py-3.5 px-4">Items</th>
                      <th className="py-3.5 px-4">Hub / Destination</th>
                      <th className="py-3.5 px-4">Total</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F5EFEB] dark:divide-zinc-800/80">
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="py-12 text-center text-[#8C7B72] dark:text-zinc-400">
                          No matching orders found.
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((order) => (
                        <tr 
                          key={order.id} 
                          className="hover:bg-[#FAF6F0]/60 dark:hover:bg-zinc-900/40 transition-colors cursor-pointer"
                          onClick={() => setSelectedOrder(order)}
                        >
                          <td className="py-4 px-4 sm:px-6 font-mono font-bold text-[#1A1615] dark:text-white">
                            {order.id}
                            <div className="text-[10px] text-[#8C7B72] font-normal">
                              {new Date(order.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="font-bold text-[#1A1615] dark:text-white">{order.customer}</div>
                            <div className="text-[10px] font-mono text-[#8C7B72]">{order.phone}</div>
                          </td>
                          <td className="py-4 px-4">
                            <span className="font-semibold">{order.items?.length || 1} formulation(s)</span>
                          </td>
                          <td className="py-4 px-4">
                            <div>{order.city}</div>
                            {order.address && (
                              <div className="text-[10px] text-[#8C7B72] truncate max-w-[150px]">{order.address}</div>
                            )}
                          </td>
                          <td className="py-4 px-4 font-bold text-[#1A1615] dark:text-white">
                            GH₵ {order.totalGHS?.toLocaleString()}
                            {order.isVip && (
                              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[9px] bg-[#DEB573] text-black">
                                VIP
                              </span>
                            )}
                          </td>
                          <td className="py-4 px-4">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                order.status === 'Delivered'
                                  ? 'bg-emerald-500/15 text-emerald-500'
                                  : order.status === 'Dispatched'
                                  ? 'bg-blue-500/15 text-blue-500'
                                  : 'bg-amber-500/15 text-amber-500'
                              }`}
                            >
                              {order.status}
                            </span>
                          </td>
                          <td className="py-4 px-4 sm:px-6 text-right space-x-2" onClick={(e) => e.stopPropagation()}>
                            <a
                              href={generateCustomerWhatsAppFollowUp(order)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 inline-flex rounded-full bg-[#25D366] text-white hover:bg-[#20BD5A] transition-colors"
                              title="Send WhatsApp update to client"
                            >
                              <MessageCircle className="w-4 h-4" />
                            </a>
                            <button
                              onClick={() => setSelectedOrder(order)}
                              className="p-1.5 inline-flex rounded-full bg-[#FAF6F0] dark:bg-zinc-800 text-[#1A1615] dark:text-white hover:bg-[#EADBCE] transition-colors"
                              title="Inspect Order Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: INVENTORY & PRICING                                    */}
        {/* ============================================================== */}
        {activeTab === 'inventory' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-2xl font-bold text-[#1A1615] dark:text-white">
                  Formulations & Live Inventory
                </h3>
                <p className="text-xs text-[#8C7B72] dark:text-zinc-400">
                  Instantly edit retail prices, stock availability, and featured catalogue codes.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="bg-white dark:bg-[#0E0E10] border border-[#EADBCE] dark:border-white/10 rounded-2xl p-4 flex gap-4 items-center justify-between shadow-xs"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-16 h-16 rounded-xl object-cover bg-[#FAF6F0] shrink-0 border border-[#EADBCE] dark:border-zinc-800"
                  />

                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-mono font-bold text-[#DEB573]">
                      #{product.code} • Pg {product.page}
                    </span>
                    <h4 className="text-xs font-bold text-[#1A1615] dark:text-white truncate">
                      {product.name}
                    </h4>

                    {editingProduct === product.id ? (
                      <div className="flex items-center gap-1 mt-1.5">
                        <input
                          type="number"
                          value={newPriceInput}
                          onChange={(e) => setNewPriceInput(e.target.value)}
                          placeholder={product.priceGHS}
                          className="w-20 px-2 py-0.5 text-xs bg-[#FAF6F0] dark:bg-zinc-800 border rounded-md"
                          autoFocus
                        />
                        <button
                          onClick={() => handleSavePrice(product.id)}
                          className="p-1 rounded-md bg-emerald-500 text-white"
                        >
                          <Save className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setEditingProduct(null)}
                          className="p-1 rounded-md bg-zinc-500 text-white"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-bold text-[#1A1615] dark:text-white">
                          GH₵ {product.priceGHS}
                        </span>
                        <button
                          onClick={() => {
                            setEditingProduct(product.id);
                            setNewPriceInput(product.priceGHS);
                          }}
                          className="text-[10px] text-[#C48B3B] dark:text-[#DEB573] hover:underline flex items-center gap-0.5 cursor-pointer"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>Edit</span>
                        </button>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => handleToggleStock(product.id)}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer shrink-0 ${
                      product.inStock !== false
                        ? 'bg-emerald-500/15 text-emerald-500 hover:bg-emerald-500/25'
                        : 'bg-rose-500/15 text-rose-500 hover:bg-rose-500/25'
                    }`}
                  >
                    {product.inStock !== false ? 'In Stock' : 'Out of Stock'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 4: CONSULTANT & AFFILIATE NETWORK                          */}
        {/* ============================================================== */}
        {activeTab === 'affiliates' && (
          <div className="space-y-6">
            <div>
              <h3 className="font-serif text-2xl font-bold text-[#1A1615] dark:text-white">
                Multi-Tenant Brand Partners & Consultants
              </h3>
              <p className="text-xs text-[#8C7B72] dark:text-zinc-400">
                Track sales volume and generate direct WhatsApp referral URLs for each consultant.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  name: config.contact.ownerName,
                  phone: config.contact.phone,
                  id: config.contact.partnerId,
                  role: 'Master Atelier Lead',
                  salesGHS: 4620,
                  ordersCount: 3
                },
                {
                  name: 'Ama Konadu',
                  phone: '233241239988',
                  id: 'GH-2026-412',
                  role: 'Certified Fragrance Specialist',
                  salesGHS: 950,
                  ordersCount: 1
                }
              ].map((consultant) => {
                const partnerUrl = `${window.location.origin}?consultant=${encodeURIComponent(consultant.name)}&phone=${consultant.phone}&id=${consultant.id}`;
                return (
                  <div
                    key={consultant.id}
                    className="bg-white dark:bg-[#0E0E10] border border-[#EADBCE] dark:border-white/10 rounded-3xl p-6 shadow-sm space-y-4"
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-[#FAF6F0] dark:border-zinc-800">
                      <div>
                        <h4 className="text-sm font-bold text-[#1A1615] dark:text-white">{consultant.name}</h4>
                        <span className="text-[10px] text-[#8C7B72] dark:text-zinc-400 font-mono">
                          ID: #{consultant.id} • {consultant.role}
                        </span>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-500">
                        Active Partner
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="p-3 bg-[#FAF6F0] dark:bg-zinc-900 rounded-2xl">
                        <span className="text-[#8C7B72] dark:text-zinc-400 block text-[10px]">Sales Volume</span>
                        <strong className="text-sm">GH₵ {consultant.salesGHS.toLocaleString()}</strong>
                      </div>
                      <div className="p-3 bg-[#FAF6F0] dark:bg-zinc-900 rounded-2xl">
                        <span className="text-[#8C7B72] dark:text-zinc-400 block text-[10px]">Orders Generated</span>
                        <strong className="text-sm">{consultant.ordersCount} Orders</strong>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[11px] font-semibold text-[#8C7B72] dark:text-zinc-400">
                        Dedicated WhatsApp Referral Link:
                      </span>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          readOnly
                          value={partnerUrl}
                          className="flex-1 px-3 py-1.5 rounded-full bg-[#FAF6F0] dark:bg-zinc-900 border border-[#EADBCE] dark:border-zinc-800 text-[10px] font-mono text-[#6E5D53] dark:text-zinc-300"
                        />
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(partnerUrl);
                            alert(`Copied link for ${consultant.name}!`);
                          }}
                          className="px-3 py-1.5 rounded-full bg-[#1A1615] dark:bg-white text-white dark:text-[#1A1615] text-[10px] font-bold cursor-pointer"
                        >
                          Copy
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 5: STORE CONFIG & FEATURE TOGGLES                         */}
        {/* ============================================================== */}
        {activeTab === 'settings' && (
          <form onSubmit={handleSaveConfig} className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-2xl font-bold text-[#1A1615] dark:text-white">
                  White-Label Store Configuration
                </h3>
                <p className="text-xs text-[#8C7B72] dark:text-zinc-400">
                  Update store branding, WhatsApp contact number, and toggle customer features live without editing code.
                </p>
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-full bg-[#1A1615] dark:bg-[#DEB573] text-white dark:text-[#1A1615] hover:bg-[#26201E] text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Live Settings</span>
              </button>
            </div>

            {configSavedToast && (
              <div className="p-3 bg-emerald-500 text-white text-xs font-bold rounded-2xl flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4" />
                <span>Settings saved successfully! Changes are now live on the storefront.</span>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Branding Card */}
              <div className="bg-white dark:bg-[#0E0E10] border border-[#EADBCE] dark:border-white/10 rounded-3xl p-6 shadow-sm space-y-4">
                <h4 className="font-bold text-sm text-[#1A1615] dark:text-white border-b pb-2 border-[#FAF6F0] dark:border-zinc-800">
                  Store Identity & Branding
                </h4>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-[#8C7B72] block mb-1">Brand Name Prefix</label>
                    <input
                      type="text"
                      value={config.branding.namePrefix}
                      onChange={(e) => setConfig({
                        ...config,
                        branding: { ...config.branding, namePrefix: e.target.value }
                      })}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-[#FAF6F0] dark:bg-zinc-900 border border-[#EADBCE] dark:border-zinc-800"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-[#8C7B72] block mb-1">Brand Name Suffix</label>
                    <input
                      type="text"
                      value={config.branding.nameSuffix}
                      onChange={(e) => setConfig({
                        ...config,
                        branding: { ...config.branding, nameSuffix: e.target.value }
                      })}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-[#FAF6F0] dark:bg-zinc-900 border border-[#EADBCE] dark:border-zinc-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-[#8C7B72] block mb-1">Store Tagline</label>
                  <input
                    type="text"
                    value={config.branding.tagline}
                    onChange={(e) => setConfig({
                      ...config,
                      branding: { ...config.branding, tagline: e.target.value }
                    })}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-[#FAF6F0] dark:bg-zinc-900 border border-[#EADBCE] dark:border-zinc-800"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-[#8C7B72] block mb-1">Top Announcement Badge</label>
                  <input
                    type="text"
                    value={config.branding.badge}
                    onChange={(e) => setConfig({
                      ...config,
                      branding: { ...config.branding, badge: e.target.value }
                    })}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-[#FAF6F0] dark:bg-zinc-900 border border-[#EADBCE] dark:border-zinc-800"
                  />
                </div>
              </div>

              {/* Owner / Contact Card */}
              <div className="bg-white dark:bg-[#0E0E10] border border-[#EADBCE] dark:border-white/10 rounded-3xl p-6 shadow-sm space-y-4">
                <h4 className="font-bold text-sm text-[#1A1615] dark:text-white border-b pb-2 border-[#FAF6F0] dark:border-zinc-800">
                  Owner & WhatsApp Order Dispatch
                </h4>

                <div>
                  <label className="text-[11px] font-semibold text-[#8C7B72] block mb-1">Store Owner Name</label>
                  <input
                    type="text"
                    value={config.contact.ownerName}
                    onChange={(e) => setConfig({
                      ...config,
                      contact: { ...config.contact, ownerName: e.target.value }
                    })}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-[#FAF6F0] dark:bg-zinc-900 border border-[#EADBCE] dark:border-zinc-800"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-[#8C7B72] block mb-1">
                    WhatsApp Phone (Country code, no + e.g. 233240000000)
                  </label>
                  <input
                    type="text"
                    value={config.contact.phone}
                    onChange={(e) => setConfig({
                      ...config,
                      contact: { ...config.contact, phone: e.target.value }
                    })}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-[#FAF6F0] dark:bg-zinc-900 border border-[#EADBCE] dark:border-zinc-800"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-[#8C7B72] block mb-1">Contact Email</label>
                  <input
                    type="email"
                    value={config.contact.email}
                    onChange={(e) => setConfig({
                      ...config,
                      contact: { ...config.contact, email: e.target.value }
                    })}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-[#FAF6F0] dark:bg-zinc-900 border border-[#EADBCE] dark:border-zinc-800"
                  />
                </div>
              </div>

              {/* Modular Features Toggle Grid */}
              <div className="lg:col-span-2 bg-white dark:bg-[#0E0E10] border border-[#EADBCE] dark:border-white/10 rounded-3xl p-6 shadow-sm space-y-4">
                <h4 className="font-bold text-sm text-[#1A1615] dark:text-white border-b pb-2 border-[#FAF6F0] dark:border-zinc-800">
                  Customer App Feature Switches
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    { key: 'enable3DCarousel', label: '3D Product Carousel', desc: 'CSS perspective interactive gallery' },
                    { key: 'enableVirtualTryOn', label: 'AR Virtual Camera Try-On', desc: 'Live shade & makeup simulation' },
                    { key: 'enableRoutineBuilder', label: 'Vanity Routine Builder', desc: '4-step regimen with -15% bundle' },
                    { key: 'enableVoiceConcierge', label: 'Voice Note Concierge', desc: 'Floating soundwave voice message' },
                    { key: 'enableSkinDiagnostic', label: 'Skin Diagnostic Wizard', desc: 'Personalized cellular quiz' },
                    { key: 'enableScentFinder', label: 'Scent Atelier & Notes', desc: 'Fragrance notes matching' },
                    { key: 'enableVipWholesale', label: 'VIP Wholesale Rates', desc: '20% customer wholesale toggle' },
                    { key: 'enableMomoUSSD', label: 'Mobile Money USSD Simulation', desc: 'MTN & Telecel instant prompt' },
                    { key: 'enableAffiliateReferrals', label: 'Multi-Tenant Affiliate Links', desc: 'Dynamic ?consultant= URL generator' }
                  ].map((feat) => (
                    <label
                      key={feat.key}
                      className="flex items-start gap-3 p-3 rounded-2xl bg-[#FAF6F0] dark:bg-zinc-900 border border-[#EADBCE] dark:border-zinc-800 cursor-pointer hover:border-[#DEB573] transition-all"
                    >
                      <input
                        type="checkbox"
                        checked={config.features[feat.key] !== false}
                        onChange={(e) => setConfig({
                          ...config,
                          features: { ...config.features, [feat.key]: e.target.checked }
                        })}
                        className="mt-1 rounded accent-[#DEB573] cursor-pointer"
                      />
                      <div>
                        <div className="text-xs font-bold text-[#1A1615] dark:text-white">{feat.label}</div>
                        <div className="text-[10px] text-[#8C7B72] dark:text-zinc-400">{feat.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

            </div>
          </form>
        )}

      </main>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div 
            className="w-full max-w-xl bg-white dark:bg-[#0E0E10] text-[#1A1615] dark:text-white rounded-3xl p-6 shadow-2xl border border-[#EADBCE] dark:border-white/10 space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#FAF6F0] dark:border-zinc-800">
              <div>
                <span className="text-[10px] font-mono text-[#8C7B72]">{selectedOrder.id}</span>
                <h3 className="font-serif text-xl font-bold">Order Details & Dispatch</h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 rounded-full hover:bg-[#FAF6F0] dark:hover:bg-zinc-800 text-[#8C7B72] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3.5 bg-[#FAF6F0] dark:bg-zinc-900 rounded-2xl">
                <div>
                  <span className="text-[#8C7B72] text-[10px] block">Customer</span>
                  <strong>{selectedOrder.customer}</strong>
                  <div className="font-mono text-[#8C7B72]">{selectedOrder.phone}</div>
                </div>
                <div>
                  <span className="text-[#8C7B72] text-[10px] block">Settlement Method</span>
                  <strong>{selectedOrder.paymentMethod}</strong>
                  <div className="text-[#C48B3B] dark:text-[#DEB573] font-bold">
                    GH₵ {selectedOrder.totalGHS?.toLocaleString()}
                  </div>
                </div>
              </div>

              <div>
                <span className="text-[#8C7B72] text-[10px] block">Delivery Location & Hub</span>
                <p className="font-semibold">{selectedOrder.city}</p>
                {selectedOrder.address && (
                  <p className="text-[#8C7B72]">{selectedOrder.address}</p>
                )}
              </div>

              <div>
                <span className="text-[#8C7B72] text-[10px] block mb-1">Ordered Formulations:</span>
                <div className="space-y-1.5 max-h-36 overflow-y-auto">
                  {selectedOrder.items?.map((item, idx) => (
                    <div key={idx} className="flex justify-between p-2 rounded-xl bg-[#FAF6F0] dark:bg-zinc-900">
                      <div>
                        <span className="font-bold">{item.name}</span>
                        {item.variant && <span className="text-[#8C7B72] text-[10px]"> ({item.variant})</span>}
                      </div>
                      <span className="font-mono font-bold">
                        {item.qty} × GH₵ {item.price}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Update Trigger Buttons */}
              <div className="pt-2 border-t border-[#FAF6F0] dark:border-zinc-800 space-y-2">
                <span className="text-[#8C7B72] text-[10px] block font-semibold">Change Dispatch Status:</span>
                <div className="grid grid-cols-3 gap-2">
                  {['Pending Dispatch', 'Dispatched', 'Delivered'].map((st) => (
                    <button
                      key={st}
                      onClick={() => handleUpdateStatus(selectedOrder.id, st)}
                      className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        selectedOrder.status === st
                          ? 'bg-[#1A1615] dark:bg-[#DEB573] text-white dark:text-[#1A1615]'
                          : 'bg-[#FAF6F0] dark:bg-zinc-800 text-[#6E5D53] dark:text-zinc-300'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <a
                href={generateCustomerWhatsAppFollowUp(selectedOrder)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 rounded-full bg-[#25D366] hover:bg-[#20BD5A] text-white text-xs font-bold flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Notify Customer via WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
