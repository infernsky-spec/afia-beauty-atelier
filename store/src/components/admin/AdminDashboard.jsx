import React, { useState, useMemo, useEffect } from 'react';
import storeService from '../../services/storeService';
import storeConfig from '../../config/store.config';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import {
  BarChart3,
  ShoppingBag,
  Package,
  Users,
  Settings,
  ArrowLeft,
  TrendingUp,
  TrendingDown,
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
  Download,
  Plus,
  Trash2,
  LayoutGrid,
  List,
  Menu,
  ChevronLeft,
  ChevronRight,
  Bell,
  Home,
  Activity,
  Tag,
  Copy,
  AlertTriangle,
  Check,
  ArrowUpRight,
  SlidersHorizontal,
  Zap,
  Globe,
  Radio,
  Layers,
  Printer,
  ChevronDown,
  CreditCard,
  MapPin,
  Calendar,
  UserCheck
} from 'lucide-react';

const CATEGORIES = ['All', 'Skincare', 'Fragrance', 'Makeup', 'Personal Care', 'Wellness'];

export default function AdminDashboard({ onExitAdmin, isDarkMode, setIsDarkMode, onProductsChange }) {
  // Navigation State
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'orders' | 'products' | 'analytics' | 'affiliates' | 'settings'
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Live Data State
  const [orders, setOrders] = useState(() => storeService.getOrders());
  const [products, setProducts] = useState(() => storeService.getProducts());
  const [config, setConfig] = useState(() => storeService.getConfigOverrides());
  const [activities, setActivities] = useState(() => storeService.getActivities());

  // Real-Time Shared Backend Listener
  useEffect(() => {
    const unsubscribe = storeService.subscribe((event) => {
      setOrders(storeService.getOrders());
      const updatedProducts = storeService.getProducts();
      setProducts(updatedProducts);
      setConfig(storeService.getConfigOverrides());
      setActivities(storeService.getActivities());
      if (onProductsChange) onProductsChange(updatedProducts);
    });
    return unsubscribe;
  }, [onProductsChange]);

  // Filters & Search
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('All');
  const [productViewMode, setProductViewMode] = useState('grid'); // 'grid' | 'table'
  const [chartTimeframe, setChartTimeframe] = useState('7D'); // '7D' | '14D' | '30D'

  // Modals
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [inlinePriceId, setInlinePriceId] = useState(null);
  const [inlinePriceVal, setInlinePriceVal] = useState('');
  const [isPackingSlipOpen, setIsPackingSlipOpen] = useState(false);

  // Notifications & Feedback
  const [toastMessage, setToastMessage] = useState(null);
  const [isSyncPulsing, setIsSyncPulsing] = useState(false);

  const showToast = (msg) => {
    setToastMessage(msg);
    setIsSyncPulsing(true);
    setTimeout(() => setIsSyncPulsing(false), 800);
    setTimeout(() => setToastMessage(null), 3200);
  };

  // Form State for Add / Edit Product Studio
  const initialProductForm = {
    id: '',
    code: '',
    name: '',
    subtitle: '',
    category: 'Skincare',
    subCategory: 'Routines & Serums',
    priceGHS: '',
    originalPriceGHS: '',
    volume: '50 ml',
    page: 1,
    image: '/catalog/page_1.jpg',
    badge: 'Popular',
    rating: 4.8,
    reviewsCount: 24,
    description: '',
    notes: '',
    benefits: '',
    inStock: true
  };
  const [productForm, setProductForm] = useState(initialProductForm);

  // Financial Metrics
  const totalRevenue = useMemo(() => {
    return orders.reduce((sum, o) => sum + (o.totalGHS || 0), 0);
  }, [orders]);

  const totalOrdersCount = orders.length;
  const aov = totalOrdersCount > 0 ? Math.round(totalRevenue / totalOrdersCount) : 0;
  const pendingOrdersCount = orders.filter((o) => o.status === 'Pending Dispatch').length;
  const dispatchedOrdersCount = orders.filter((o) => o.status === 'Dispatched').length;
  const deliveredOrdersCount = orders.filter((o) => o.status === 'Delivered').length;
  const inStockCount = products.filter((p) => p.inStock !== false).length;

  // Chart: Dynamic Revenue Velocity based on timeframe
  const revenueChartData = useMemo(() => {
    const points = chartTimeframe === '30D' ? 12 : chartTimeframe === '14D' ? 7 : 7;
    const labels = chartTimeframe === '30D'
      ? ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8', 'W9', 'W10', 'W11', 'W12']
      : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    const base = totalRevenue > 0 ? Math.round(totalRevenue / points) : 450;
    return labels.map((name, i) => {
      const multiplier = 0.7 + (Math.sin(i * 1.5) * 0.4 + 0.3);
      return {
        name,
        revenue: Math.round(base * multiplier),
        orders: Math.max(1, Math.round(multiplier * 3))
      };
    });
  }, [totalRevenue, chartTimeframe]);

  // Chart: Order Fulfillment Status
  const orderStatusData = [
    { name: 'Pending', value: pendingOrdersCount || 1, color: '#F59E0B' },
    { name: 'Dispatched', value: dispatchedOrdersCount || 1, color: '#3B82F6' },
    { name: 'Delivered', value: deliveredOrdersCount || 2, color: '#10B981' }
  ];

  // Chart: Payment Channels
  const channelData = useMemo(() => {
    const map = {};
    orders.forEach((o) => {
      const method = o.paymentMethod || 'Direct WhatsApp';
      map[method] = (map[method] || 0) + (o.totalGHS || 0);
    });
    return Object.entries(map).map(([name, amount]) => ({ name, amount }));
  }, [orders]);

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

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (productCategoryFilter !== 'All' && p.category !== productCategoryFilter) return false;
      if (productSearch.trim()) {
        const q = productSearch.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          (p.code && p.code.includes(q)) ||
          (p.description && p.description.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [products, productCategoryFilter, productSearch]);

  // Order Handlers
  const handleUpdateStatus = (orderId, newStatus) => {
    storeService.updateOrderStatus(orderId, newStatus);
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
    showToast(`Order ${orderId} status set to ${newStatus}`);
  };

  const handleDeleteOrder = (orderId) => {
    storeService.deleteOrder(orderId);
    setOrderToDelete(null);
    if (selectedOrder && selectedOrder.id === orderId) setSelectedOrder(null);
    showToast(`Order ${orderId} removed`);
  };

  // Product CRUD Handlers
  const handleOpenAddProduct = () => {
    setProductForm(initialProductForm);
    setEditingProduct(null);
    setIsAddProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod) => {
    setEditingProduct(prod);
    setProductForm({
      ...prod,
      notes: Array.isArray(prod.notes) ? prod.notes.join(', ') : prod.notes || '',
      benefits: Array.isArray(prod.benefits) ? prod.benefits.join(', ') : prod.benefits || ''
    });
    setIsAddProductModalOpen(true);
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();
    if (!productForm.name || !productForm.priceGHS) {
      alert('Please provide a formulation name and retail price');
      return;
    }

    const cleanedData = {
      ...productForm,
      priceGHS: Number(productForm.priceGHS),
      originalPriceGHS: productForm.originalPriceGHS ? Number(productForm.originalPriceGHS) : Math.round(Number(productForm.priceGHS) * 1.2),
      page: Number(productForm.page) || 1,
      rating: Number(productForm.rating) || 4.8,
      notes: typeof productForm.notes === 'string' ? productForm.notes.split(',').map((s) => s.trim()).filter(Boolean) : productForm.notes,
      benefits: typeof productForm.benefits === 'string' ? productForm.benefits.split(',').map((s) => s.trim()).filter(Boolean) : productForm.benefits
    };

    if (editingProduct) {
      storeService.updateProduct(editingProduct.id, cleanedData);
      showToast(`Updated "${cleanedData.name}" across all storefronts`);
    } else {
      storeService.addProduct(cleanedData);
      showToast(`Added "${cleanedData.name}" to inventory`);
    }

    setIsAddProductModalOpen(false);
    setEditingProduct(null);
  };

  const handleDeleteProduct = (productId) => {
    storeService.deleteProduct(productId);
    setProductToDelete(null);
    showToast('Formulation deleted from live catalog');
  };

  const handleToggleStock = (productId) => {
    storeService.toggleProductStock(productId);
    showToast('Stock availability updated in real-time');
  };

  const handleSaveInlinePrice = (productId) => {
    if (!inlinePriceVal || isNaN(inlinePriceVal)) return;
    storeService.updateProductPrice(productId, Number(inlinePriceVal));
    setInlinePriceId(null);
    setInlinePriceVal('');
    showToast(`Price updated to GH₵ ${inlinePriceVal}`);
  };

  // Store Configuration
  const handleSaveConfig = (e) => {
    e.preventDefault();
    storeService.saveConfigOverrides(config);
    showToast('Store settings saved and propagated to customer app!');
  };

  // Real-Time Simulator for testing live connection
  const handleSimulateOrder = () => {
    storeService.simulateSampleOrder();
    showToast('⚡ Simulated live customer order received & synchronized!');
  };

  // CSV Export
  const handleExportCSV = () => {
    const headers = ['Order ID,Customer,Phone,City,Address,Total GHS,Status,Payment Method,Date\n'];
    const rows = orders.map(
      (o) =>
        `"${o.id}","${o.customer}","${o.phone}","${o.city}","${o.address || ''}",${o.totalGHS},"${o.status}","${o.paymentMethod || ''}","${o.date || ''}"`
    );
    const blob = new Blob([headers.concat(rows.join('\n'))], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `afia-store-orders-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    showToast('Orders ledger exported to CSV');
  };

  const generateWhatsAppLink = (order) => {
    const msg = encodeURIComponent(
      `Hello ${order.customer}! This is ${config.contact.ownerName} from ${config.branding.name}.\n\n` +
      `Your order *${order.id}* (Total: GH₵ ${order.totalGHS}) status is: *${order.status}*.\n` +
      `Delivery Hub: ${order.city}\n\n` +
      `Thank you for trusting our Swedish beauty atelier!`
    );
    return `https://wa.me/${order.phone.replace(/[^0-9]/g, '')}?text=${msg}`;
  };

  const navItems = [
    { id: 'dashboard', label: 'Executive Pulse', icon: Home, badge: null },
    { id: 'orders', label: 'Orders & Dispatch', icon: ShoppingBag, badge: pendingOrdersCount > 0 ? pendingOrdersCount : null },
    { id: 'products', label: 'Formulations & Stock', icon: Package, badge: products.length },
    { id: 'analytics', label: 'Financial Analytics', icon: BarChart3, badge: null },
    { id: 'affiliates', label: 'Partner Network', icon: Users, badge: '2 Active' },
    { id: 'settings', label: 'Storefront Config', icon: Settings, badge: null }
  ];

  return (
    <div className="min-h-screen bg-[#070709] text-zinc-100 font-sans transition-colors duration-400 flex antialiased selection:bg-[#DEB573] selection:text-[#1A1615]">
      {/* Background ambient lighting blooms */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-[20%] -left-[10%] w-[600px] h-[600px] bg-gradient-to-br from-[#DEB573]/12 to-transparent rounded-full blur-[140px]" />
        <div className="absolute top-[40%] -right-[15%] w-[500px] h-[500px] bg-gradient-to-bl from-[#C48B3B]/10 to-transparent rounded-full blur-[160px]" />
      </div>

      {/* ============================================================== */}
      {/* 1. SLICK EXECUTIVE SIDEBAR                                     */}
      {/* ============================================================== */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-md lg:hidden animate-in fade-in duration-300"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 h-screen z-50 flex flex-col justify-between bg-[#0B0B0F]/90 backdrop-blur-2xl border-r border-white/8 transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-[10px_0_40px_rgba(0,0,0,0.6)] ${
          isSidebarCollapsed ? 'w-[76px]' : 'w-[270px]'
        } ${
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="p-4 sm:p-5 flex items-center justify-between border-b border-white/8">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#C48B3B] via-[#DEB573] to-[#F3D7A4] text-[#141110] flex items-center justify-center font-serif font-black text-xl shrink-0 shadow-[0_4px_20px_rgba(222,181,115,0.35)]">
              A
              <div className="absolute inset-0 rounded-2xl ring-1 ring-white/40" />
            </div>
            {!isSidebarCollapsed && (
              <div className="leading-tight truncate">
                <span className="font-serif text-base font-extrabold tracking-wider block text-white">
                  {config.branding.namePrefix}<span className="text-[#DEB573]">.</span>ADMIN
                </span>
                <span className="text-[9px] font-mono tracking-widest uppercase text-[#DEB573] flex items-center gap-1.5 mt-0.5">
                  <span className={`w-1.5 h-1.5 rounded-full bg-emerald-400 ${isSyncPulsing ? 'animate-ping' : 'animate-pulse'}`} />
                  REAL-TIME CLOUD
                </span>
              </div>
            )}
          </div>

          {/* Desktop Toggle Button */}
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="hidden lg:flex p-1.5 rounded-xl hover:bg-white/8 text-zinc-400 hover:text-white transition-all cursor-pointer"
            title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>

          {/* Mobile Close Button */}
          <button
            onClick={() => setIsMobileSidebarOpen(false)}
            className="lg:hidden p-1.5 rounded-xl hover:bg-white/8 text-zinc-400 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-2xl text-xs font-bold transition-all duration-300 cursor-pointer group relative ${
                  isActive
                    ? 'bg-gradient-to-r from-[#DEB573] to-[#C48B3B] text-[#141110] shadow-[0_8px_25px_rgba(222,181,115,0.3)] font-extrabold scale-[1.02]'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5 active:scale-98'
                }`}
                title={isSidebarCollapsed ? item.label : undefined}
              >
                <Icon
                  className={`w-5 h-5 shrink-0 transition-transform duration-300 group-hover:scale-110 ${
                    isActive ? 'text-[#141110]' : 'text-[#DEB573]'
                  }`}
                />
                {!isSidebarCollapsed && (
                  <span className="truncate flex-1 text-left tracking-wide">{item.label}</span>
                )}
                {!isSidebarCollapsed && item.badge !== null && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold shrink-0 shadow-sm ${
                      isActive
                        ? 'bg-[#141110] text-[#DEB573]'
                        : 'bg-[#DEB573]/20 text-[#DEB573] border border-[#DEB573]/30'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer: Quick Switch to Storefront & Admin Profile */}
        <div className="p-3 border-t border-white/8 space-y-2 bg-[#08080B]">
          <button
            onClick={onExitAdmin}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-gradient-to-r from-white/5 to-white/10 hover:from-[#DEB573]/20 hover:to-[#DEB573]/10 border border-white/8 hover:border-[#DEB573]/40 text-zinc-300 hover:text-[#FAF6F0] text-xs font-bold transition-all duration-300 cursor-pointer shadow-sm ${
              isSidebarCollapsed ? 'justify-center' : ''
            }`}
            title="Launch Customer Storefront"
          >
            <ArrowLeft className="w-4 h-4 text-[#DEB573]" />
            {!isSidebarCollapsed && <span>Customer Store</span>}
          </button>

          {!isSidebarCollapsed && (
            <div className="flex items-center justify-between p-2 rounded-xl bg-white/[0.03] border border-white/5">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#DEB573] to-[#C48B3B] text-[#141110] flex items-center justify-center font-black text-xs shrink-0 shadow-md">
                  {config.contact.ownerName.charAt(0)}
                </div>
                <div className="truncate text-left">
                  <div className="text-xs font-bold text-white truncate">{config.contact.ownerName}</div>
                  <div className="text-[9px] text-[#DEB573] font-mono">Master Administrator</div>
                </div>
              </div>
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-[#DEB573] cursor-pointer transition-colors"
                title="Toggle Theme"
              >
                {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* ============================================================== */}
      {/* 2. MAIN EXECUTIVE WORKSPACE                                    */}
      {/* ============================================================== */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto relative z-10">
        
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 bg-[#0B0B0F]/85 backdrop-blur-2xl border-b border-white/8 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-white cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="font-serif text-lg sm:text-2xl font-bold tracking-tight text-white capitalize">
                  {activeTab === 'dashboard' && 'Executive Pulse & Operations'}
                  {activeTab === 'orders' && 'Orders & Courier Dispatch Suite'}
                  {activeTab === 'products' && 'Formulation Catalogue & Inventory Studio'}
                  {activeTab === 'analytics' && 'Financial & Regional Intelligence'}
                  {activeTab === 'affiliates' && 'Consultant & Brand Partner Network'}
                  {activeTab === 'settings' && 'White-Label Engine & Branding Engine'}
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
                  <span className={`w-1.5 h-1.5 rounded-full bg-emerald-400 ${isSyncPulsing ? 'animate-ping' : 'animate-pulse'}`} />
                  <span>SHARED REAL-TIME BACKEND</span>
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 hidden sm:block">
                Multi-tenant Oriflame Sweden high-frequency beauty commerce platform
              </p>
            </div>
          </div>

          {/* Quick Actions in Header */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Test Simulator Button */}
            <button
              onClick={handleSimulateOrder}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#DEB573]/15 hover:bg-[#DEB573]/25 text-[#DEB573] border border-[#DEB573]/40 text-xs font-bold transition-all duration-300 cursor-pointer shadow-sm active:scale-95"
              title="Dispatches a simulated customer purchase to test real-time synchronization"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>Simulate Customer Order</span>
            </button>

            {/* Launch Customer Storefront */}
            <button
              onClick={onExitAdmin}
              className="flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full bg-gradient-to-r from-[#DEB573] to-[#C48B3B] text-[#141110] text-xs font-extrabold shadow-[0_4px_20px_rgba(222,181,115,0.25)] hover:opacity-95 transition-all duration-300 cursor-pointer active:scale-95"
            >
              <span>View Storefront</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </header>

        {/* Content Body Container */}
        <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">

          {/* ============================================================== */}
          {/* TAB 1: EXECUTIVE PULSE (DASHBOARD)                            */}
          {/* ============================================================== */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 animate-luxury-fade-up">
              
              {/* Top 4 KPI Metrics Bento Row */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
                {/* Gross Merchandise Value */}
                <div className="relative bg-[#0E0E14]/80 backdrop-blur-xl border border-white/8 rounded-3xl p-5 shadow-[0_10px_30px_rgba(0,0,0,0.5)] overflow-hidden group hover:border-[#DEB573]/40 transition-all duration-300">
                  <div className="absolute -top-12 -right-12 w-28 h-28 bg-[#DEB573]/10 rounded-full blur-2xl group-hover:bg-[#DEB573]/20 transition-all" />
                  <div className="flex items-center justify-between text-zinc-400 text-xs font-medium mb-2">
                    <span>Gross Sales Volume</span>
                    <div className="w-8 h-8 rounded-full bg-[#DEB573]/20 text-[#DEB573] flex items-center justify-center shadow-inner">
                      <DollarSign className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl sm:text-3xl font-serif font-extrabold text-white tracking-tight">
                    GH₵ {totalRevenue.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-emerald-400 font-bold flex items-center gap-1 mt-2">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>+24.8% from launch</span>
                  </div>
                </div>

                {/* Active Orders */}
                <div className="relative bg-[#0E0E14]/80 backdrop-blur-xl border border-white/8 rounded-3xl p-5 shadow-[0_10px_30px_rgba(0,0,0,0.5)] overflow-hidden group hover:border-blue-500/40 transition-all duration-300">
                  <div className="absolute -top-12 -right-12 w-28 h-28 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all" />
                  <div className="flex items-center justify-between text-zinc-400 text-xs font-medium mb-2">
                    <span>Active Orders</span>
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center shadow-inner">
                      <ShoppingBag className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl sm:text-3xl font-serif font-extrabold text-white tracking-tight">
                    {totalOrdersCount} Orders
                  </div>
                  <div className="text-[11px] text-amber-400 font-bold flex items-center gap-1 mt-2">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{pendingOrdersCount} awaiting courier</span>
                  </div>
                </div>

                {/* Average Order Value */}
                <div className="relative bg-[#0E0E14]/80 backdrop-blur-xl border border-white/8 rounded-3xl p-5 shadow-[0_10px_30px_rgba(0,0,0,0.5)] overflow-hidden group hover:border-purple-500/40 transition-all duration-300">
                  <div className="absolute -top-12 -right-12 w-28 h-28 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-all" />
                  <div className="flex items-center justify-between text-zinc-400 text-xs font-medium mb-2">
                    <span>Avg Order Value (AOV)</span>
                    <div className="w-8 h-8 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center shadow-inner">
                      <Activity className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl sm:text-3xl font-serif font-extrabold text-white tracking-tight">
                    GH₵ {aov.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-zinc-400 mt-2 font-mono">
                    Driven by Novage+ routines
                  </div>
                </div>

                {/* Inventory Health */}
                <div className="relative bg-[#0E0E14]/80 backdrop-blur-xl border border-white/8 rounded-3xl p-5 shadow-[0_10px_30px_rgba(0,0,0,0.5)] overflow-hidden group hover:border-emerald-500/40 transition-all duration-300">
                  <div className="absolute -top-12 -right-12 w-28 h-28 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all" />
                  <div className="flex items-center justify-between text-zinc-400 text-xs font-medium mb-2">
                    <span>Catalogue Formulations</span>
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shadow-inner">
                      <Package className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl sm:text-3xl font-serif font-extrabold text-white tracking-tight">
                    {products.length} Items
                  </div>
                  <div className="text-[11px] text-emerald-400 font-bold flex items-center gap-1 mt-2">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{inStockCount} In Stock ({Math.round((inStockCount / (products.length || 1)) * 100)}%)</span>
                  </div>
                </div>
              </div>

              {/* Main Graphs Bento: Revenue Velocity + Fulfillment Ring */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Revenue Velocity Chart (2 cols) */}
                <div className="lg:col-span-2 bg-[#0E0E14]/80 backdrop-blur-xl border border-white/8 rounded-3xl p-6 shadow-xl space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                        <span>Revenue Velocity & Cash Settlement</span>
                        <span className="w-2 h-2 rounded-full bg-[#DEB573] animate-ping" />
                      </h3>
                      <p className="text-xs text-zinc-400">
                        Daily ledger metrics across Mobile Money and Card gateways
                      </p>
                    </div>

                    {/* Timeframe Selector */}
                    <div className="flex items-center bg-white/5 p-1 rounded-full border border-white/10 self-start sm:self-auto">
                      {['7D', '14D', '30D'].map((tf) => (
                        <button
                          key={tf}
                          onClick={() => setChartTimeframe(tf)}
                          className={`px-3 py-1 rounded-full text-[10px] font-bold font-mono transition-all cursor-pointer ${
                            chartTimeframe === tf
                              ? 'bg-[#DEB573] text-[#141110] shadow-md'
                              : 'text-zinc-400 hover:text-white'
                          }`}
                        >
                          {tf}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="h-64 sm:h-72 w-full pt-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={revenueChartData}>
                        <defs>
                          <linearGradient id="goldLuxuryGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#DEB573" stopOpacity={0.65} />
                            <stop offset="95%" stopColor="#DEB573" stopOpacity={0.0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#FFFFFF" opacity={0.06} />
                        <XAxis dataKey="name" stroke="#71717A" fontSize={11} tickLine={false} axisLine={false} />
                        <YAxis stroke="#71717A" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(val) => `GH₵${val}`} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#121218',
                            borderColor: 'rgba(222,181,115,0.4)',
                            borderRadius: '1rem',
                            color: '#FAF6F0',
                            fontSize: '12px',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.8)'
                          }}
                          formatter={(value) => [`GH₵ ${value.toLocaleString()}`, 'Settled Revenue']}
                        />
                        <Area
                          type="monotone"
                          dataKey="revenue"
                          stroke="#DEB573"
                          strokeWidth={3}
                          fillOpacity={1}
                          fill="url(#goldLuxuryGrad)"
                          animationDuration={800}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Fulfillment Status Donut (1 col) */}
                <div className="bg-[#0E0E14]/80 backdrop-blur-xl border border-white/8 rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-white">
                      Fulfillment Pipeline
                    </h3>
                    <p className="text-xs text-zinc-400">
                      Courier dispatch status ratio
                    </p>
                  </div>

                  <div className="h-44 w-full flex items-center justify-center relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={orderStatusData}
                          cx="50%"
                          cy="50%"
                          innerRadius={54}
                          outerRadius={78}
                          paddingAngle={6}
                          dataKey="value"
                        >
                          {orderStatusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#121218',
                            borderColor: '#DEB573',
                            borderRadius: '0.75rem',
                            color: '#FAF6F0',
                            fontSize: '11px'
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-2xl font-serif font-black text-white">{orders.length}</span>
                      <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest">Total</span>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs pt-2 border-t border-white/8">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                        <span className="text-zinc-300">Pending Dispatch</span>
                      </span>
                      <strong className="font-mono text-amber-400">{pendingOrdersCount}</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-400" />
                        <span className="text-zinc-300">Dispatched (Transit)</span>
                      </span>
                      <strong className="font-mono text-blue-400">{dispatchedOrdersCount}</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                        <span className="text-zinc-300">Completed Delivery</span>
                      </span>
                      <strong className="font-mono text-emerald-400">{deliveredOrdersCount}</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Row: Recent Orders Ledger + Real-Time Live Activity Stream */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Recent Orders (2 cols) */}
                <div className="lg:col-span-2 bg-[#0E0E14]/80 backdrop-blur-xl border border-white/8 rounded-3xl p-6 shadow-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-serif text-lg font-bold text-white">Recent Transactions</h3>
                      <p className="text-xs text-zinc-400">Latest customer purchases across Ghana and Nigeria hubs</p>
                    </div>
                    <button
                      onClick={() => setActiveTab('orders')}
                      className="text-xs font-bold text-[#DEB573] hover:underline cursor-pointer"
                    >
                      View All Orders →
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-white/5 text-zinc-400 uppercase font-semibold text-[10px] tracking-wider">
                        <tr>
                          <th className="py-3 px-4 rounded-l-xl">Order Ref</th>
                          <th className="py-3 px-4">Client</th>
                          <th className="py-3 px-4">Delivery Hub</th>
                          <th className="py-3 px-4">Settlement</th>
                          <th className="py-3 px-4">Status</th>
                          <th className="py-3 px-4 text-right rounded-r-xl">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {orders.slice(0, 5).map((order) => (
                          <tr key={order.id} className="hover:bg-white/[0.03] transition-colors cursor-pointer" onClick={() => setSelectedOrder(order)}>
                            <td className="py-3.5 px-4 font-mono font-bold text-[#DEB573]">{order.id}</td>
                            <td className="py-3.5 px-4 font-bold text-white">{order.customer}</td>
                            <td className="py-3.5 px-4 text-zinc-400">{order.city}</td>
                            <td className="py-3.5 px-4 font-mono font-bold text-white">GH₵ {order.totalGHS?.toLocaleString()}</td>
                            <td className="py-3.5 px-4">
                              <span
                                className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                  order.status === 'Delivered'
                                    ? 'bg-emerald-500/15 text-emerald-400'
                                    : order.status === 'Dispatched'
                                    ? 'bg-blue-500/15 text-blue-400'
                                    : 'bg-amber-500/15 text-amber-400'
                                }`}
                              >
                                {order.status}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                              <a
                                href={generateWhatsAppLink(order)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 inline-flex rounded-full bg-[#25D366] text-white hover:bg-[#20BD5A] transition-colors"
                                title="WhatsApp Client"
                              >
                                <MessageCircle className="w-3.5 h-3.5" />
                              </a>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Real-Time Live Activity Feed (1 col) */}
                <div className="bg-[#0E0E14]/80 backdrop-blur-xl border border-white/8 rounded-3xl p-6 shadow-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                      <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
                      <span>Live Activity Feed</span>
                    </h3>
                    <span className="text-[10px] font-mono text-zinc-500 uppercase">Real-Time</span>
                  </div>

                  <div className="space-y-3 max-h-80 overflow-y-auto no-scrollbar pr-1">
                    {activities.map((act, i) => (
                      <div key={act.id || i} className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1 hover:border-white/10 transition-colors">
                        <div className="text-xs text-zinc-300 font-medium leading-snug">{act.text}</div>
                        <div className="text-[10px] font-mono text-[#DEB573]">{act.time}</div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 2: ORDERS & COURIER DISPATCH SUITE                        */}
          {/* ============================================================== */}
          {activeTab === 'orders' && (
            <div className="space-y-6 animate-luxury-fade-up">
              
              {/* Controls Bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#0E0E14]/80 backdrop-blur-xl p-4 rounded-3xl border border-white/8 shadow-xl">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    type="text"
                    placeholder="Search by Order ID, customer name, phone number, or delivery hub..."
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-xs rounded-full bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#DEB573] transition-all"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={orderStatusFilter}
                    onChange={(e) => setOrderStatusFilter(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-full px-3 py-2 text-xs font-bold text-white cursor-pointer focus:outline-none"
                  >
                    <option value="All" className="bg-[#121218]">All Statuses ({orders.length})</option>
                    <option value="Pending Dispatch" className="bg-[#121218]">Pending Dispatch ({pendingOrdersCount})</option>
                    <option value="Dispatched" className="bg-[#121218]">Dispatched ({dispatchedOrdersCount})</option>
                    <option value="Delivered" className="bg-[#121218]">Delivered ({deliveredOrdersCount})</option>
                  </select>

                  <button
                    onClick={handleExportCSV}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition-all cursor-pointer border border-white/10 active:scale-95"
                  >
                    <Download className="w-3.5 h-3.5 text-[#DEB573]" />
                    <span className="hidden sm:inline">Export CSV</span>
                  </button>
                </div>
              </div>

              {/* Orders Table */}
              <div className="bg-[#0E0E14]/80 backdrop-blur-xl rounded-3xl border border-white/8 overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-white/5 border-b border-white/8 text-zinc-400 uppercase font-semibold text-[10px] tracking-wider">
                      <tr>
                        <th className="py-4 px-4 sm:px-6">Transaction ID</th>
                        <th className="py-4 px-4">Client</th>
                        <th className="py-4 px-4">Ordered Formulations</th>
                        <th className="py-4 px-4">Delivery Hub</th>
                        <th className="py-4 px-4">Total Amount</th>
                        <th className="py-4 px-4">Dispatch Status</th>
                        <th className="py-4 px-4 sm:px-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filteredOrders.length === 0 ? (
                        <tr>
                          <td colSpan="7" className="py-14 text-center text-zinc-500">
                            No orders found matching criteria.
                          </td>
                        </tr>
                      ) : (
                        filteredOrders.map((order) => (
                          <tr
                            key={order.id}
                            className="hover:bg-white/[0.04] transition-colors cursor-pointer"
                            onClick={() => setSelectedOrder(order)}
                          >
                            <td className="py-4 px-4 sm:px-6 font-mono font-bold text-[#DEB573]">
                              {order.id}
                              <div className="text-[10px] text-zinc-500 font-normal mt-0.5">
                                {order.date ? new Date(order.date).toLocaleDateString() : 'Today'}
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="font-bold text-white">{order.customer}</div>
                              <div className="text-[10px] font-mono text-zinc-400">{order.phone}</div>
                            </td>
                            <td className="py-4 px-4">
                              <span className="font-semibold text-zinc-300">{order.items?.length || 1} item(s)</span>
                            </td>
                            <td className="py-4 px-4">
                              <div className="text-zinc-200">{order.city}</div>
                              {order.address && (
                                <div className="text-[10px] text-zinc-500 truncate max-w-[150px]">{order.address}</div>
                              )}
                            </td>
                            <td className="py-4 px-4 font-bold text-white">
                              GH₵ {order.totalGHS?.toLocaleString()}
                              {order.isVip && (
                                <span className="ml-1.5 px-1.5 py-0.2 rounded-full text-[9px] bg-[#DEB573] text-[#141110] font-black">
                                  VIP
                                </span>
                              )}
                            </td>
                            <td className="py-4 px-4">
                              <span
                                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold ${
                                  order.status === 'Delivered'
                                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                                    : order.status === 'Dispatched'
                                    ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                                    : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                                }`}
                              >
                                {order.status}
                              </span>
                            </td>
                            <td className="py-4 px-4 sm:px-6 text-right space-x-2" onClick={(e) => e.stopPropagation()}>
                              <a
                                href={generateWhatsAppLink(order)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 inline-flex rounded-full bg-[#25D366] text-white hover:bg-[#20BD5A] transition-colors shadow-sm"
                                title="WhatsApp Dispatch Notify"
                              >
                                <MessageCircle className="w-4 h-4" />
                              </a>
                              <button
                                onClick={() => setSelectedOrder(order)}
                                className="p-2 inline-flex rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors"
                                title="Inspect Order Details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setOrderToDelete(order)}
                                className="p-2 inline-flex rounded-full bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white transition-colors"
                                title="Delete Order"
                              >
                                <Trash2 className="w-4 h-4" />
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
          {/* TAB 3: FORMULATION CATALOGUE & INVENTORY STUDIO               */}
          {/* ============================================================== */}
          {activeTab === 'products' && (
            <div className="space-y-6 animate-luxury-fade-up">
              
              {/* Toolbar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-[#0E0E14]/80 backdrop-blur-xl p-5 rounded-3xl border border-white/8 shadow-xl">
                <div>
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-white">
                    Catalogue Formulations ({filteredProducts.length})
                  </h2>
                  <p className="text-xs text-zinc-400">
                    Live inventory studio. Pricing adjustments and stock toggles reflect instantly in the storefront.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {/* View Mode Toggle */}
                  <div className="flex items-center bg-white/5 rounded-full p-1 border border-white/10">
                    <button
                      onClick={() => setProductViewMode('grid')}
                      className={`p-1.5 rounded-full cursor-pointer transition-all ${
                        productViewMode === 'grid' ? 'bg-[#DEB573] text-[#141110]' : 'text-zinc-400 hover:text-white'
                      }`}
                      title="Grid Bento View"
                    >
                      <LayoutGrid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setProductViewMode('table')}
                      className={`p-1.5 rounded-full cursor-pointer transition-all ${
                        productViewMode === 'table' ? 'bg-[#DEB573] text-[#141110]' : 'text-zinc-400 hover:text-white'
                      }`}
                      title="Financial Table View"
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Add Product Button */}
                  <button
                    onClick={handleOpenAddProduct}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#DEB573] to-[#C48B3B] text-[#141110] text-xs font-black shadow-[0_4px_20px_rgba(222,181,115,0.25)] hover:opacity-95 transition-all cursor-pointer active:scale-95"
                  >
                    <Plus className="w-4 h-4 stroke-[3]" />
                    <span>Add New Formulation</span>
                  </button>
                </div>
              </div>

              {/* Search & Category Filter Pills */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    type="text"
                    placeholder="Search formulation by name, Oriflame code #, notes, or description..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-xs rounded-full bg-[#0E0E14]/80 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#DEB573]"
                  />
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setProductCategoryFilter(cat)}
                      className={`px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                        productCategoryFilter === cat
                          ? 'bg-[#DEB573] text-[#141110] shadow-md'
                          : 'bg-white/5 border border-white/8 text-zinc-400 hover:text-white'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bento Cards Grid View */}
              {productViewMode === 'grid' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      className="group bg-[#0E0E14]/80 backdrop-blur-xl border border-white/8 hover:border-[#DEB573]/50 rounded-3xl p-4 flex flex-col justify-between shadow-xl transition-all duration-300 hover:-translate-y-1"
                    >
                      <div>
                        {/* Image Preview with Floating Badges */}
                        <div className="relative h-48 rounded-2xl overflow-hidden bg-black/40 border border-white/8 mb-3">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover object-center group-hover:scale-106 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                            onError={(e) => {
                              e.target.src = '/catalog/page_1.jpg';
                            }}
                          />
                          <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1">
                            <span className="px-2.5 py-0.5 rounded-full bg-black/85 backdrop-blur-md text-[#DEB573] font-mono text-[10px] font-bold border border-white/10">
                              #{product.code}
                            </span>
                            {product.badge && (
                              <span className="px-2.5 py-0.5 rounded-full bg-[#DEB573] text-[#141110] text-[10px] font-black">
                                {product.badge}
                              </span>
                            )}
                          </div>

                          <div className="absolute top-2.5 right-2.5">
                            <button
                              onClick={() => handleToggleStock(product.id)}
                              className={`px-3 py-1 rounded-full text-[10px] font-bold shadow-md cursor-pointer transition-all ${
                                product.inStock !== false
                                  ? 'bg-emerald-500 text-white'
                                  : 'bg-rose-500 text-white'
                              }`}
                            >
                              {product.inStock !== false ? 'In Stock' : 'Out of Stock'}
                            </button>
                          </div>
                        </div>

                        {/* Formulation Details */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-[10px] font-bold text-[#DEB573] uppercase tracking-wider">
                            <span>{product.category}</span>
                            <span className="text-zinc-500 font-mono">Pg {product.page} • {product.volume}</span>
                          </div>
                          <h3 className="font-serif font-bold text-sm text-white group-hover:text-[#DEB573] transition-colors line-clamp-1">
                            {product.name}
                          </h3>
                          <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                            {product.description || product.subtitle}
                          </p>
                        </div>
                      </div>

                      {/* Pricing & Inline Editor */}
                      <div className="pt-3 mt-3 border-t border-white/8 flex items-center justify-between">
                        <div>
                          {inlinePriceId === product.id ? (
                            <div className="flex items-center gap-1.5">
                              <input
                                type="number"
                                autoFocus
                                value={inlinePriceVal}
                                onChange={(e) => setInlinePriceVal(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSaveInlinePrice(product.id)}
                                className="w-20 px-2 py-1 text-xs rounded-lg bg-black border border-[#DEB573] text-white font-mono"
                              />
                              <button
                                onClick={() => handleSaveInlinePrice(product.id)}
                                className="p-1 rounded-lg bg-emerald-500 text-white cursor-pointer"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setInlinePriceId(null)}
                                className="p-1 rounded-lg bg-zinc-700 text-white cursor-pointer"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <div
                              onClick={() => {
                                setInlinePriceId(product.id);
                                setInlinePriceVal(product.priceGHS);
                              }}
                              className="cursor-pointer group/price flex items-center gap-1"
                              title="Click to inline-edit price"
                            >
                              <span className="font-serif font-extrabold text-base text-white group-hover/price:text-[#DEB573]">
                                GH₵ {product.priceGHS}
                              </span>
                              <Edit3 className="w-3 h-3 text-zinc-500 opacity-0 group-hover/price:opacity-100 transition-opacity" />
                            </div>
                          )}
                          {product.originalPriceGHS && (
                            <span className="text-[10px] text-zinc-500 line-through">
                              GH₵ {product.originalPriceGHS}
                            </span>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleOpenEditProduct(product)}
                            className="p-2 rounded-xl bg-white/5 hover:bg-[#DEB573] hover:text-[#141110] transition-colors cursor-pointer text-zinc-300"
                            title="Edit Formulation Studio"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setProductToDelete(product)}
                            className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white transition-colors cursor-pointer"
                            title="Remove Formulation"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* High-Density Spreadsheet View */}
              {productViewMode === 'table' && (
                <div className="bg-[#0E0E14]/80 backdrop-blur-xl rounded-3xl border border-white/8 overflow-hidden shadow-2xl">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-white/5 border-b border-white/8 text-zinc-400 uppercase font-semibold text-[10px]">
                        <tr>
                          <th className="py-4 px-6">Formulation</th>
                          <th className="py-4 px-4">Catalog Code</th>
                          <th className="py-4 px-4">Category</th>
                          <th className="py-4 px-4">Retail Price</th>
                          <th className="py-4 px-4">Stock Status</th>
                          <th className="py-4 px-6 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {filteredProducts.map((p) => (
                          <tr key={p.id} className="hover:bg-white/[0.03] transition-colors">
                            <td className="py-3.5 px-6 flex items-center gap-3">
                              <img src={p.image} alt={p.name} className="w-10 h-10 rounded-xl object-cover bg-black" />
                              <div>
                                <div className="font-bold text-white">{p.name}</div>
                                <div className="text-[10px] text-zinc-500">Pg {p.page} • {p.volume}</div>
                              </div>
                            </td>
                            <td className="py-3.5 px-4 font-mono font-bold text-[#DEB573]">#{p.code}</td>
                            <td className="py-3.5 px-4 text-zinc-400">{p.category}</td>
                            <td className="py-3.5 px-4 font-mono font-bold text-white">GH₵ {p.priceGHS}</td>
                            <td className="py-3.5 px-4">
                              <button
                                onClick={() => handleToggleStock(p.id)}
                                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold cursor-pointer ${
                                  p.inStock !== false ? 'bg-emerald-500/15 text-emerald-400' : 'bg-rose-500/15 text-rose-400'
                                }`}
                              >
                                {p.inStock !== false ? 'In Stock' : 'Out of Stock'}
                              </button>
                            </td>
                            <td className="py-3.5 px-6 text-right space-x-2">
                              <button
                                onClick={() => handleOpenEditProduct(p)}
                                className="p-1.5 rounded-lg bg-white/5 text-zinc-300 hover:text-white"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setProductToDelete(p)}
                                className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 4: FINANCIAL & REGIONAL ANALYTICS                         */}
          {/* ============================================================== */}
          {activeTab === 'analytics' && (
            <div className="space-y-6 animate-luxury-fade-up">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Revenue by Settlement Gateway BarChart */}
                <div className="bg-[#0E0E14]/80 backdrop-blur-xl border border-white/8 rounded-3xl p-6 shadow-xl space-y-4">
                  <h3 className="font-serif text-lg font-bold text-white">
                    Revenue Velocity by Settlement Method
                  </h3>
                  <div className="h-64 w-full pt-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={channelData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#FFFFFF" opacity={0.06} />
                        <XAxis dataKey="name" stroke="#71717A" fontSize={11} tickLine={false} axisLine={false} />
                        <YAxis stroke="#71717A" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `GH₵${v}`} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#121218',
                            borderColor: '#DEB573',
                            borderRadius: '0.75rem',
                            color: '#FAF6F0',
                            fontSize: '11px'
                          }}
                        />
                        <Bar dataKey="amount" fill="#DEB573" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Regional Dispatch Hubs */}
                <div className="bg-[#0E0E14]/80 backdrop-blur-xl border border-white/8 rounded-3xl p-6 shadow-xl space-y-4">
                  <h3 className="font-serif text-lg font-bold text-white">
                    Courier Dispatch Hubs Performance
                  </h3>
                  <div className="space-y-4 text-xs pt-3">
                    {[
                      { hub: 'Accra Metro (East Legon, Airport, Cantonments)', pct: 64, orders: 18, ghs: '6,420' },
                      { hub: 'Kumasi Central (Ahodwo, KNUST, Ridge)', pct: 22, orders: 7, ghs: '2,150' },
                      { hub: 'Lagos Hub (Ikeja, Victoria Island)', pct: 10, orders: 4, ghs: '1,790' },
                      { hub: 'Takoradi & Cape Coast Coastline Hub', pct: 4, orders: 2, ghs: '580' }
                    ].map((item, idx) => (
                      <div key={idx} className="space-y-1.5">
                        <div className="flex justify-between font-semibold">
                          <span className="text-zinc-300">{item.hub}</span>
                          <span className="font-bold text-[#DEB573]">
                            {item.pct}% (GH₵ {item.ghs})
                          </span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#DEB573] to-[#C48B3B] rounded-full transition-all duration-700"
                            style={{ width: `${item.pct}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Conversion Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="bg-[#0E0E14]/80 backdrop-blur-xl border border-white/8 rounded-3xl p-6 space-y-2">
                  <span className="text-xs text-zinc-400 font-semibold">VIP Wholesale Conversion</span>
                  <div className="text-3xl font-serif font-black text-[#DEB573]">28.6%</div>
                  <p className="text-xs text-zinc-400">Clients shopping with the 20% consultant discount tier</p>
                </div>

                <div className="bg-[#0E0E14]/80 backdrop-blur-xl border border-white/8 rounded-3xl p-6 space-y-2">
                  <span className="text-xs text-zinc-400 font-semibold">Regimen Refill Rate</span>
                  <div className="text-3xl font-serif font-black text-emerald-400">41.2%</div>
                  <p className="text-xs text-zinc-400">Novage+ cellular skin systems reordered within 60 days</p>
                </div>

                <div className="bg-[#0E0E14]/80 backdrop-blur-xl border border-white/8 rounded-3xl p-6 space-y-2">
                  <span className="text-xs text-zinc-400 font-semibold">Voice Concierge Checkout Conversion</span>
                  <div className="text-3xl font-serif font-black text-blue-400">73.0%</div>
                  <p className="text-xs text-zinc-400">Clients inquiring through voice note converted to order</p>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 5: PARTNER NETWORK (AFFILIATES)                           */}
          {/* ============================================================== */}
          {activeTab === 'affiliates' && (
            <div className="space-y-6 animate-luxury-fade-up">
              <div>
                <h2 className="font-serif text-2xl font-bold text-white">
                  Multi-Tenant Brand Partners & Consultants
                </h2>
                <p className="text-xs text-zinc-400">
                  Track individual consultant performance, compute 20% margin commissions, and generate 1-click WhatsApp storefronts.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    name: config.contact.ownerName,
                    phone: config.contact.phone,
                    id: config.contact.partnerId || 'GH-2026-001',
                    role: 'Master Atelier Lead',
                    salesGHS: 5240,
                    ordersCount: 4,
                    commissionGHS: 1048
                  },
                  {
                    name: 'Ama Konadu',
                    phone: '233241239988',
                    id: 'GH-2026-412',
                    role: 'Certified Fragrance Specialist',
                    salesGHS: 1420,
                    ordersCount: 2,
                    commissionGHS: 284
                  }
                ].map((consultant) => {
                  const partnerUrl = `${window.location.origin}?consultant=${encodeURIComponent(consultant.name)}&phone=${consultant.phone}&id=${consultant.id}`;
                  return (
                    <div
                      key={consultant.id}
                      className="bg-[#0E0E14]/80 backdrop-blur-xl border border-white/8 rounded-3xl p-6 shadow-xl space-y-4"
                    >
                      <div className="flex items-center justify-between pb-3 border-b border-white/8">
                        <div>
                          <h4 className="text-sm font-bold text-white">{consultant.name}</h4>
                          <span className="text-[10px] text-zinc-400 font-mono">
                            ID: #{consultant.id} • {consultant.role}
                          </span>
                        </div>
                        <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          Active Partner
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-3 text-xs">
                        <div className="p-3 bg-white/5 rounded-2xl">
                          <span className="text-zinc-400 block text-[10px]">Sales Volume</span>
                          <strong className="text-sm text-white">GH₵ {consultant.salesGHS.toLocaleString()}</strong>
                        </div>
                        <div className="p-3 bg-white/5 rounded-2xl">
                          <span className="text-zinc-400 block text-[10px]">Orders</span>
                          <strong className="text-sm text-white">{consultant.ordersCount}</strong>
                        </div>
                        <div className="p-3 bg-white/5 rounded-2xl">
                          <span className="text-[#DEB573] block text-[10px]">20% Payout</span>
                          <strong className="text-sm text-[#DEB573]">GH₵ {consultant.commissionGHS}</strong>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <span className="text-[11px] font-semibold text-zinc-400">
                          Dedicated WhatsApp Referral Link:
                        </span>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            readOnly
                            value={partnerUrl}
                            className="flex-1 px-3 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono text-zinc-300"
                          />
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(partnerUrl);
                              showToast(`Copied referral link for ${consultant.name}`);
                            }}
                            className="px-4 py-2 rounded-full bg-gradient-to-r from-[#DEB573] to-[#C48B3B] text-[#141110] text-[10px] font-bold cursor-pointer shrink-0"
                          >
                            Copy Link
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
          {/* TAB 6: WHITE-LABEL STORE CONFIG & LIVE SWITCHES              */}
          {/* ============================================================== */}
          {activeTab === 'settings' && (
            <form onSubmit={handleSaveConfig} className="space-y-6 animate-luxury-fade-up">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-white">
                    Storefront Engine & Branding Studio
                  </h2>
                  <p className="text-xs text-zinc-400">
                    Live white-label configuration. Updates broadcast immediately to all active customers.
                  </p>
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#DEB573] to-[#C48B3B] text-[#141110] text-xs font-black shadow-[0_4px_20px_rgba(222,181,115,0.25)] hover:opacity-95 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <Save className="w-4 h-4" />
                  <span>Broadcast Changes</span>
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Branding Card */}
                <div className="bg-[#0E0E14]/80 backdrop-blur-xl border border-white/8 rounded-3xl p-6 shadow-xl space-y-4">
                  <h4 className="font-bold text-sm text-white border-b pb-2 border-white/8">
                    Brand Identity
                  </h4>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-zinc-400 block mb-1">Prefix</label>
                      <input
                        type="text"
                        value={config.branding.namePrefix}
                        onChange={(e) =>
                          setConfig({
                            ...config,
                            branding: { ...config.branding, namePrefix: e.target.value }
                          })
                        }
                        className="w-full px-3 py-2 text-xs rounded-xl bg-white/5 border border-white/10 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-zinc-400 block mb-1">Suffix</label>
                      <input
                        type="text"
                        value={config.branding.nameSuffix}
                        onChange={(e) =>
                          setConfig({
                            ...config,
                            branding: { ...config.branding, nameSuffix: e.target.value }
                          })
                        }
                        className="w-full px-3 py-2 text-xs rounded-xl bg-white/5 border border-white/10 text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-zinc-400 block mb-1">Store Tagline</label>
                    <input
                      type="text"
                      value={config.branding.tagline}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          branding: { ...config.branding, tagline: e.target.value }
                        })
                      }
                      className="w-full px-3 py-2 text-xs rounded-xl bg-white/5 border border-white/10 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-zinc-400 block mb-1">Top Announcement Ribbon</label>
                    <input
                      type="text"
                      value={config.branding.badge}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          branding: { ...config.branding, badge: e.target.value }
                        })
                      }
                      className="w-full px-3 py-2 text-xs rounded-xl bg-white/5 border border-white/10 text-white"
                    />
                  </div>
                </div>

                {/* Contact Card */}
                <div className="bg-[#0E0E14]/80 backdrop-blur-xl border border-white/8 rounded-3xl p-6 shadow-xl space-y-4">
                  <h4 className="font-bold text-sm text-white border-b pb-2 border-white/8">
                    Contact & WhatsApp Logistics
                  </h4>

                  <div>
                    <label className="text-[11px] font-semibold text-zinc-400 block mb-1">Owner Name</label>
                    <input
                      type="text"
                      value={config.contact.ownerName}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          contact: { ...config.contact, ownerName: e.target.value }
                        })
                      }
                      className="w-full px-3 py-2 text-xs rounded-xl bg-white/5 border border-white/10 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-zinc-400 block mb-1">
                      WhatsApp Dispatch Phone (no +, e.g. 233240000000)
                    </label>
                    <input
                      type="text"
                      value={config.contact.phone}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          contact: { ...config.contact, phone: e.target.value }
                        })
                      }
                      className="w-full px-3 py-2 text-xs rounded-xl bg-white/5 border border-white/10 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-zinc-400 block mb-1">Contact Email</label>
                    <input
                      type="email"
                      value={config.contact.email}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          contact: { ...config.contact, email: e.target.value }
                        })
                      }
                      className="w-full px-3 py-2 text-xs rounded-xl bg-white/5 border border-white/10 text-white"
                    />
                  </div>
                </div>

                {/* Modular Feature Switches */}
                <div className="lg:col-span-2 bg-[#0E0E14]/80 backdrop-blur-xl border border-white/8 rounded-3xl p-6 shadow-xl space-y-4">
                  <h4 className="font-bold text-sm text-white border-b pb-2 border-white/8">
                    Modular Storefront Feature Flags
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                    {[
                      { key: 'enable3DCarousel', label: '3D Product Perspective Carousel', desc: 'Interactive Swedish luxury gallery' },
                      { key: 'enableVirtualTryOn', label: 'AR Camera Try-On Room', desc: 'Live shade & makeup simulator' },
                      { key: 'enableRoutineBuilder', label: 'Vanity Regimen Routine Builder', desc: '4-step system with 15% discount' },
                      { key: 'enableVoiceConcierge', label: 'Voice Note Audio Hotline', desc: 'Audio consultation player' },
                      { key: 'enableSkinDiagnostic', label: 'Cellular Skin Diagnostic Wizard', desc: 'Personalized matchmaking quiz' },
                      { key: 'enableScentFinder', label: 'Artisanal Scent Atelier', desc: 'Fragrance notes explorer' },
                      { key: 'enableVipWholesale', label: 'VIP Wholesale Rates', desc: '20% customer discount tier' },
                      { key: 'enableMomoUSSD', label: 'Mobile Money USSD Simulation', desc: 'MTN & Telecel checkout prompt' },
                      { key: 'enableAffiliateReferrals', label: 'Multi-Tenant Consultant Links', desc: '?consultant= referral generator' }
                    ].map((feat) => (
                      <label
                        key={feat.key}
                        className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/8 cursor-pointer hover:border-[#DEB573] transition-all"
                      >
                        <input
                          type="checkbox"
                          checked={config.features[feat.key] !== false}
                          onChange={(e) =>
                            setConfig({
                              ...config,
                              features: { ...config.features, [feat.key]: e.target.checked }
                            })
                          }
                          className="mt-1 rounded accent-[#DEB573] cursor-pointer"
                        />
                        <div>
                          <div className="text-xs font-bold text-white">{feat.label}</div>
                          <div className="text-[10px] text-zinc-400 mt-0.5">{feat.desc}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

              </div>
            </form>
          )}

        </main>
      </div>

      {/* ============================================================== */}
      {/* 3. LUXURY MODALS (Add/Edit Studio, Order Inspector, Delete)   */}
      {/* ============================================================== */}

      {/* Add / Edit Formulation Studio with LIVE PREVIEW */}
      {isAddProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-luxury-zoom">
          <div
            className="w-full max-w-4xl bg-[#0F0F16] text-white rounded-3xl p-6 shadow-2xl border border-white/10 max-h-[92vh] overflow-y-auto space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/8">
              <div>
                <span className="text-[10px] font-mono text-[#DEB573] uppercase tracking-widest font-bold">
                  {editingProduct ? 'Formulation Studio' : 'New Catalog Formulation'}
                </span>
                <h3 className="font-serif text-2xl font-bold">
                  {editingProduct ? `Edit ${editingProduct.name}` : 'Create Swedish Beauty Formulation'}
                </h3>
              </div>
              <button
                onClick={() => setIsAddProductModalOpen(false)}
                className="p-2 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Form Input Columns (2 cols) */}
              <form onSubmit={handleSaveProduct} className="lg:col-span-2 space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-semibold text-zinc-400 block mb-1">
                      Formulation Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Giordani Gold Essenza Supreme"
                      value={productForm.name}
                      onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-zinc-400 block mb-1">
                      Oriflame Catalog Code #
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 47722"
                      value={productForm.code}
                      onChange={(e) => setProductForm({ ...productForm, code: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-zinc-400 block mb-1">
                    Subtitle / Formulation Highlight
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Niche Perfume Collection in co-lab with Givaudan Paris"
                    value={productForm.subtitle}
                    onChange={(e) => setProductForm({ ...productForm, subtitle: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-zinc-400 block mb-1">Category</label>
                    <select
                      value={productForm.category}
                      onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                      className="w-full px-2 py-2 rounded-xl bg-white/5 border border-white/10 font-bold text-white cursor-pointer"
                    >
                      <option value="Skincare" className="bg-[#121218]">Skincare</option>
                      <option value="Fragrance" className="bg-[#121218]">Fragrance</option>
                      <option value="Makeup" className="bg-[#121218]">Makeup</option>
                      <option value="Personal Care" className="bg-[#121218]">Personal Care</option>
                      <option value="Wellness" className="bg-[#121218]">Wellness</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-zinc-400 block mb-1">Sub-Category</label>
                    <input
                      type="text"
                      placeholder="Women / Men"
                      value={productForm.subCategory}
                      onChange={(e) => setProductForm({ ...productForm, subCategory: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-zinc-400 block mb-1">Price (GH₵) *</label>
                    <input
                      type="number"
                      required
                      placeholder="650"
                      value={productForm.priceGHS}
                      onChange={(e) => setProductForm({ ...productForm, priceGHS: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 font-bold text-[#DEB573]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-zinc-400 block mb-1">Catalog Page #</label>
                    <input
                      type="number"
                      placeholder="3"
                      value={productForm.page}
                      onChange={(e) => setProductForm({ ...productForm, page: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-zinc-400 block mb-1">Volume / Size</label>
                    <input
                      type="text"
                      placeholder="50 ml"
                      value={productForm.volume}
                      onChange={(e) => setProductForm({ ...productForm, volume: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-zinc-400 block mb-1">Luxury Badge</label>
                    <input
                      type="text"
                      placeholder="Niche Luxury / Best Seller"
                      value={productForm.badge}
                      onChange={(e) => setProductForm({ ...productForm, badge: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-zinc-400 block mb-1">Image URL / Preset</label>
                    <input
                      type="text"
                      placeholder="/catalog/page_3.jpg"
                      value={productForm.image}
                      onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-[10px]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-zinc-400 block mb-1">
                    Botanical Description & Benefits
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe formulation sensorials and ingredients..."
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
                  />
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/8">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={productForm.inStock}
                      onChange={(e) => setProductForm({ ...productForm, inStock: e.target.checked })}
                      className="rounded accent-[#DEB573]"
                    />
                    <span className="font-bold text-zinc-200">Available In Stock Immediately</span>
                  </label>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsAddProductModalOpen(false)}
                      className="px-4 py-2 rounded-full bg-white/5 text-zinc-400 hover:text-white cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 rounded-full bg-gradient-to-r from-[#DEB573] to-[#C48B3B] text-[#141110] font-black cursor-pointer shadow-lg active:scale-95"
                    >
                      {editingProduct ? 'Save Changes' : 'Publish Formulation'}
                    </button>
                  </div>
                </div>
              </form>

              {/* Live Card Preview Column (1 col) */}
              <div className="space-y-3">
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-bold block">
                  Storefront Live Preview
                </span>
                <div className="bg-[#141118] border border-[#DEB573]/40 rounded-3xl p-4 shadow-2xl space-y-3">
                  <div className="relative h-44 rounded-2xl overflow-hidden bg-black/50">
                    <img
                      src={productForm.image || '/catalog/page_1.jpg'}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = '/catalog/page_1.jpg';
                      }}
                    />
                    <div className="absolute top-2 left-2 flex gap-1">
                      <span className="px-2 py-0.5 rounded-full bg-black/80 text-[#DEB573] font-mono text-[9px] font-bold">
                        #{productForm.code || 'CODE'}
                      </span>
                      {productForm.badge && (
                        <span className="px-2 py-0.5 rounded-full bg-[#DEB573] text-[#141110] text-[9px] font-bold">
                          {productForm.badge}
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] font-bold text-[#DEB573] uppercase">
                      {productForm.category} • {productForm.volume}
                    </div>
                    <div className="font-serif font-bold text-sm text-white line-clamp-1">
                      {productForm.name || 'Formulation Name'}
                    </div>
                    <div className="text-[11px] text-zinc-400 line-clamp-2 mt-0.5">
                      {productForm.subtitle || productForm.description || 'Formulation highlight description...'}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/8 flex items-center justify-between">
                    <span className="font-serif font-black text-base text-white">
                      GH₵ {productForm.priceGHS || '0'}
                    </span>
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-[#DEB573] text-[#141110]">
                      Customer Store Card
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Order Detail & Dispatch Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-luxury-zoom">
          <div
            className="w-full max-w-xl bg-[#0F0F16] text-white rounded-3xl p-6 shadow-2xl border border-white/10 space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/8">
              <div>
                <span className="text-[10px] font-mono text-[#DEB573] font-bold">{selectedOrder.id}</span>
                <h3 className="font-serif text-xl font-bold">Dispatch Inspector & Manifest</h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 rounded-full hover:bg-white/10 text-zinc-400 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3.5 bg-white/5 rounded-2xl border border-white/5">
                <div>
                  <span className="text-zinc-400 text-[10px] block">Customer</span>
                  <strong className="text-sm text-white">{selectedOrder.customer}</strong>
                  <div className="font-mono text-[#DEB573] mt-0.5">{selectedOrder.phone}</div>
                </div>
                <div>
                  <span className="text-zinc-400 text-[10px] block">Settlement Gateway</span>
                  <strong className="text-white">{selectedOrder.paymentMethod}</strong>
                  <div className="text-emerald-400 font-mono font-bold text-sm mt-0.5">
                    GH₵ {selectedOrder.totalGHS?.toLocaleString()}
                  </div>
                </div>
              </div>

              <div>
                <span className="text-zinc-400 text-[10px] block mb-0.5">Delivery Hub Location</span>
                <p className="font-bold text-white flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#DEB573]" />
                  <span>{selectedOrder.city}</span>
                </p>
                {selectedOrder.address && <p className="text-zinc-400 mt-0.5">{selectedOrder.address}</p>}
              </div>

              <div>
                <span className="text-zinc-400 text-[10px] block mb-1">Manifest Items:</span>
                <div className="space-y-1.5 max-h-36 overflow-y-auto no-scrollbar">
                  {selectedOrder.items?.map((item, idx) => (
                    <div key={idx} className="flex justify-between p-2 rounded-xl bg-white/5 border border-white/5">
                      <div>
                        <span className="font-bold text-white">{item.name}</span>
                        {item.variant && <span className="text-zinc-400 text-[10px]"> ({item.variant})</span>}
                      </div>
                      <span className="font-mono font-bold text-[#DEB573]">
                        {item.qty} × GH₵ {item.price}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Update Trigger Buttons */}
              <div className="pt-2 border-t border-white/8 space-y-2">
                <span className="text-zinc-400 text-[10px] block font-semibold">Update Dispatch Pipeline:</span>
                <div className="grid grid-cols-3 gap-2">
                  {['Pending Dispatch', 'Dispatched', 'Delivered'].map((st) => (
                    <button
                      key={st}
                      onClick={() => handleUpdateStatus(selectedOrder.id, st)}
                      className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        selectedOrder.status === st
                          ? 'bg-[#DEB573] text-[#141110] shadow-md font-extrabold'
                          : 'bg-white/5 text-zinc-300 hover:bg-white/10'
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
                href={generateWhatsAppLink(selectedOrder)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 rounded-full bg-[#25D366] hover:bg-[#20BD5A] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Notify Customer via WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-luxury-zoom">
          <div className="w-full max-w-sm bg-[#0F0F16] text-white rounded-3xl p-6 shadow-2xl border border-white/10 space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto border border-rose-500/20">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold">Remove Formulation?</h3>
            <p className="text-xs text-zinc-400">
              Are you sure you want to remove <strong>{productToDelete.name}</strong> from the catalog? This change will instantly remove it from all live customer vanity views.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setProductToDelete(null)}
                className="flex-1 py-2.5 rounded-full bg-white/5 text-xs font-bold text-zinc-300 hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteProduct(productToDelete.id)}
                className="flex-1 py-2.5 rounded-full bg-rose-500 text-white text-xs font-bold cursor-pointer hover:bg-rose-600 transition-colors shadow-lg shadow-rose-500/20"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Pill */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0F0F16] text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-bold border border-[#DEB573]/50 animate-luxury-zoom">
          <CheckCircle2 className="w-4 h-4 text-[#DEB573]" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
