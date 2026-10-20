import React, { useState, useMemo, useEffect } from 'react';
import storeService from '../../services/storeService';
import storeConfig from '../../config/store.config';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
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
  ChevronDown
} from 'lucide-react';

const CATEGORIES = ['All', 'Skincare', 'Fragrance', 'Makeup', 'Personal Care', 'Wellness'];

export default function AdminDashboard({ onExitAdmin, isDarkMode, setIsDarkMode, onProductsChange }) {
  // Navigation
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'orders' | 'products' | 'analytics' | 'affiliates' | 'settings'
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // State from storeService
  const [orders, setOrders] = useState(() => storeService.getOrders());
  const [products, setProducts] = useState(() => storeService.getProducts());
  const [config, setConfig] = useState(() => storeService.getConfigOverrides());

  // Filters & Views
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('All');
  const [productViewMode, setProductViewMode] = useState('grid'); // 'grid' | 'table'

  // Modals
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  const [orderToDelete, setOrderToDelete] = useState(null);

  // Notifications & Toasts
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Synchronize products to parent when updated
  const syncProducts = (updatedProducts) => {
    setProducts(updatedProducts);
    if (onProductsChange) onProductsChange(updatedProducts);
  };

  // Form State for Add / Edit Product
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

  // KPI & Analytics calculations
  const totalRevenue = useMemo(() => {
    return orders.reduce((sum, o) => sum + (o.totalGHS || 0), 0);
  }, [orders]);

  const totalOrdersCount = orders.length;
  const aov = totalOrdersCount > 0 ? Math.round(totalRevenue / totalOrdersCount) : 0;
  const pendingOrdersCount = orders.filter((o) => o.status === 'Pending Dispatch').length;
  const dispatchedOrdersCount = orders.filter((o) => o.status === 'Dispatched').length;
  const deliveredOrdersCount = orders.filter((o) => o.status === 'Delivered').length;

  // Chart Data: 7-Day Revenue Velocity
  const revenueChartData = useMemo(() => {
    const base = totalRevenue > 0 ? Math.round(totalRevenue / 7) : 450;
    return [
      { name: 'Mon', revenue: Math.round(base * 0.75), orders: 1 },
      { name: 'Tue', revenue: Math.round(base * 0.9), orders: 2 },
      { name: 'Wed', revenue: Math.round(base * 1.3), orders: 3 },
      { name: 'Thu', revenue: Math.round(base * 0.65), orders: 1 },
      { name: 'Fri', revenue: Math.round(base * 1.6), orders: 4 },
      { name: 'Sat', revenue: Math.round(base * 1.45), orders: 3 },
      { name: 'Sun', revenue: Math.round(base * 0.85), orders: 2 }
    ];
  }, [totalRevenue]);

  // Chart Data: Order Status Distribution
  const orderStatusData = [
    { name: 'Pending', value: pendingOrdersCount || 1, color: '#F59E0B' },
    { name: 'Dispatched', value: dispatchedOrdersCount || 1, color: '#3B82F6' },
    { name: 'Delivered', value: deliveredOrdersCount || 2, color: '#10B981' }
  ];

  // Chart Data: Payment Channels
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

  // Handlers for Orders
  const handleUpdateStatus = (orderId, newStatus) => {
    const updated = storeService.updateOrderStatus(orderId, newStatus);
    setOrders(updated);
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
    showToast(`Order ${orderId} marked as ${newStatus}`);
  };

  const handleDeleteOrder = (orderId) => {
    const updated = storeService.deleteOrder(orderId);
    setOrders(updated);
    setOrderToDelete(null);
    if (selectedOrder && selectedOrder.id === orderId) setSelectedOrder(null);
    showToast(`Order ${orderId} deleted`);
  };

  // Handlers for Products CRUD
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
      alert('Please provide at least a Product Name and Price');
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
      const updated = storeService.updateProduct(editingProduct.id, cleanedData);
      syncProducts(updated);
      showToast(`Updated "${cleanedData.name}"`);
    } else {
      const updated = storeService.addProduct(cleanedData);
      syncProducts(updated);
      showToast(`Added "${cleanedData.name}" to inventory`);
    }

    setIsAddProductModalOpen(false);
    setEditingProduct(null);
  };

  const handleDeleteProduct = (productId) => {
    const updated = storeService.deleteProduct(productId);
    syncProducts(updated);
    setProductToDelete(null);
    showToast('Product removed from catalog');
  };

  const handleToggleStock = (productId) => {
    const updated = storeService.toggleProductStock(productId);
    syncProducts(updated);
  };

  // Handlers for Store Configuration
  const handleSaveConfig = (e) => {
    e.preventDefault();
    storeService.saveConfigOverrides(config);
    showToast('Store configuration & feature toggles saved live!');
  };

  // Export orders to CSV
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
    showToast('Exported orders to CSV');
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

  // Navigation Items
  const navItems = [
    { id: 'dashboard', label: 'Executive Pulse', icon: Home, badge: null },
    { id: 'orders', label: 'Orders & Dispatch', icon: ShoppingBag, badge: pendingOrdersCount > 0 ? pendingOrdersCount : null },
    { id: 'products', label: 'Formulations & Stock', icon: Package, badge: products.length },
    { id: 'analytics', label: 'Financial Analytics', icon: BarChart3, badge: null },
    { id: 'affiliates', label: 'Partner Network', icon: Users, badge: '2 Active' },
    { id: 'settings', label: 'Storefront Config', icon: Settings, badge: null }
  ];

  return (
    <div className="min-h-screen bg-[#F4ECE1] dark:bg-[#000000] text-[#1A1615] dark:text-zinc-100 font-sans transition-colors duration-300 flex">
      {/* ============================================================== */}
      {/* 1. SIDEBAR (Collapsible Desktop + Slide-over Mobile)           */}
      {/* ============================================================== */}
      {/* Mobile Backdrop */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden animate-in fade-in"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 h-screen z-50 flex flex-col justify-between bg-[#141110] text-[#FAF6F0] border-r border-[#DEB573]/20 transition-all duration-300 shadow-2xl ${
          isSidebarCollapsed ? 'w-20' : 'w-64'
        } ${
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Branding Header */}
        <div className="p-4 sm:p-5 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#DEB573] to-[#C48B3B] text-[#1A1615] flex items-center justify-center font-serif font-black text-lg shrink-0 shadow-lg shadow-[#DEB573]/20">
              A
            </div>
            {!isSidebarCollapsed && (
              <div className="leading-tight truncate animate-in fade-in">
                <span className="font-serif text-base font-extrabold tracking-wider block text-white">
                  {config.branding.namePrefix}<span className="text-[#DEB573]">.</span>ADMIN
                </span>
                <span className="text-[10px] text-[#DEB573] font-mono tracking-widest uppercase block">
                  Executive Suite
                </span>
              </div>
            )}
          </div>

          {/* Desktop Collapse Toggle */}
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="hidden lg:flex p-1.5 rounded-xl hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>

          {/* Mobile Close */}
          <button
            onClick={() => setIsMobileSidebarOpen(false)}
            className="lg:hidden p-1.5 rounded-xl hover:bg-white/10 text-zinc-400 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
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
                className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-2xl text-xs font-bold transition-all duration-200 cursor-pointer group relative ${
                  isActive
                    ? 'bg-gradient-to-r from-[#DEB573] to-[#C48B3B] text-[#1A1615] shadow-lg shadow-[#DEB573]/25 font-extrabold'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
                title={isSidebarCollapsed ? item.label : undefined}
              >
                <Icon className={`w-5 h-5 shrink-0 transition-transform group-hover:scale-110 ${isActive ? 'text-[#1A1615]' : 'text-[#DEB573]'}`} />
                {!isSidebarCollapsed && (
                  <span className="truncate flex-1 text-left">{item.label}</span>
                )}
                {!isSidebarCollapsed && item.badge !== null && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-extrabold shrink-0 ${
                      isActive
                        ? 'bg-[#1A1615] text-[#DEB573]'
                        : 'bg-[#DEB573]/20 text-[#DEB573]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom User & Storefront Actions */}
        <div className="p-3 border-t border-white/10 space-y-2 bg-[#0C0A09]">
          <button
            onClick={onExitAdmin}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white text-xs font-bold transition-all cursor-pointer ${
              isSidebarCollapsed ? 'justify-center' : ''
            }`}
            title="Switch back to Customer Store"
          >
            <ArrowLeft className="w-4 h-4 text-[#DEB573]" />
            {!isSidebarCollapsed && <span>Customer Store</span>}
          </button>

          {!isSidebarCollapsed && (
            <div className="flex items-center justify-between p-2 rounded-xl bg-white/5">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-[#DEB573] text-[#1A1615] flex items-center justify-center font-bold text-xs shrink-0">
                  {config.contact.ownerName.charAt(0)}
                </div>
                <div className="truncate text-left">
                  <div className="text-xs font-bold text-white truncate">{config.contact.ownerName}</div>
                  <div className="text-[10px] text-zinc-400">Atelier Admin</div>
                </div>
              </div>
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-[#DEB573] cursor-pointer"
                title="Toggle Theme"
              >
                {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* ============================================================== */}
      {/* 2. MAIN CONTENT AREA                                           */}
      {/* ============================================================== */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 bg-white/90 dark:bg-[#0A0A0C]/90 backdrop-blur-xl border-b border-[#EADBCE] dark:border-white/10 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-[#FAF6F0] dark:bg-zinc-900 border border-[#EADBCE] dark:border-zinc-800 text-[#1A1615] dark:text-white cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-lg sm:text-xl font-bold capitalize text-[#1A1615] dark:text-white">
                  {activeTab === 'dashboard' && 'Executive Pulse'}
                  {activeTab === 'orders' && 'Orders & Dispatch Control'}
                  {activeTab === 'products' && 'Formulation Catalogue & Inventory'}
                  {activeTab === 'analytics' && 'Financial & Regional Intelligence'}
                  {activeTab === 'affiliates' && 'Consultant & Brand Partner Network'}
                  {activeTab === 'settings' && 'White-Label Storefront Engine'}
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>SYNCED</span>
                </span>
              </div>
              <p className="text-[11px] text-[#8C7B72] dark:text-zinc-400 hidden sm:block">
                Oriflame Sweden luxury beauty management interface
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Return / Preview Button */}
            <button
              onClick={onExitAdmin}
              className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#1A1615] dark:bg-white text-white dark:text-[#1A1615] hover:opacity-90 text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              <span>View Storefront</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>

            {/* Dark mode toggle for mobile/header */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2.5 rounded-full bg-[#FAF6F0] dark:bg-zinc-900 border border-[#EADBCE] dark:border-zinc-800 text-[#1A1615] dark:text-white cursor-pointer"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-[#DEB573]" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </header>

        {/* Page Content Body */}
        <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
          {/* ============================================================== */}
          {/* TAB 1: EXECUTIVE PULSE (DASHBOARD)                            */}
          {/* ============================================================== */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* 4 KPI Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
                <div className="bg-white dark:bg-[#0E0E10] border border-[#EADBCE] dark:border-white/10 rounded-3xl p-5 shadow-xs">
                  <div className="flex items-center justify-between text-[#8C7B72] dark:text-zinc-400 text-xs font-semibold mb-2">
                    <span>Gross Sales Volume</span>
                    <div className="w-8 h-8 rounded-full bg-[#DEB573]/20 text-[#C48B3B] dark:text-[#DEB573] flex items-center justify-center">
                      <DollarSign className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-serif font-bold text-[#1A1615] dark:text-white">
                    GH₵ {totalRevenue.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-emerald-500 font-bold flex items-center gap-1 mt-1.5">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>+24.8% vs last catalog</span>
                  </div>
                </div>

                <div className="bg-white dark:bg-[#0E0E10] border border-[#EADBCE] dark:border-white/10 rounded-3xl p-5 shadow-xs">
                  <div className="flex items-center justify-between text-[#8C7B72] dark:text-zinc-400 text-xs font-semibold mb-2">
                    <span>Active Orders</span>
                    <div className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center">
                      <ShoppingBag className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-serif font-bold text-[#1A1615] dark:text-white">
                    {totalOrdersCount} Orders
                  </div>
                  <div className="text-[11px] text-amber-500 font-bold flex items-center gap-1 mt-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{pendingOrdersCount} awaiting courier</span>
                  </div>
                </div>

                <div className="bg-white dark:bg-[#0E0E10] border border-[#EADBCE] dark:border-white/10 rounded-3xl p-5 shadow-xs">
                  <div className="flex items-center justify-between text-[#8C7B72] dark:text-zinc-400 text-xs font-semibold mb-2">
                    <span>Average Order Value</span>
                    <div className="w-8 h-8 rounded-full bg-purple-500/10 text-purple-500 flex items-center justify-center">
                      <Activity className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-serif font-bold text-[#1A1615] dark:text-white">
                    GH₵ {aov.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-[#8C7B72] dark:text-zinc-400 mt-1.5">
                    Powered by Novage+ routines
                  </div>
                </div>

                <div className="bg-white dark:bg-[#0E0E10] border border-[#EADBCE] dark:border-white/10 rounded-3xl p-5 shadow-xs">
                  <div className="flex items-center justify-between text-[#8C7B72] dark:text-zinc-400 text-xs font-semibold mb-2">
                    <span>Formulations in Stock</span>
                    <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                      <Package className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-serif font-bold text-[#1A1615] dark:text-white">
                    {products.length} Formulations
                  </div>
                  <div className="text-[11px] text-emerald-500 font-bold flex items-center gap-1 mt-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>100% Verified Oriflame</span>
                  </div>
                </div>
              </div>

              {/* Graphs Row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* 7-Day Revenue Velocity Chart (2 cols) */}
                <div className="lg:col-span-2 bg-white dark:bg-[#0E0E10] border border-[#EADBCE] dark:border-white/10 rounded-3xl p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-serif text-lg font-bold text-[#1A1615] dark:text-white">
                        Revenue Velocity (7 Days)
                      </h3>
                      <p className="text-xs text-[#8C7B72] dark:text-zinc-400">
                        Daily cash flow and settlement transactions
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#DEB573]/20 text-[#C48B3B] dark:text-[#DEB573]">
                      GH₵ {totalRevenue.toLocaleString()} Total
                    </span>
                  </div>

                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={revenueChartData}>
                        <defs>
                          <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#DEB573" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#DEB573" stopOpacity={0.0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                        <XAxis dataKey="name" stroke="#8C7B72" fontSize={11} tickLine={false} />
                        <YAxis stroke="#8C7B72" fontSize={11} tickLine={false} tickFormatter={(val) => `GH₵${val}`} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#141110',
                            borderColor: '#DEB573',
                            borderRadius: '1rem',
                            color: '#FAF6F0',
                            fontSize: '12px'
                          }}
                          formatter={(value) => [`GH₵ ${value.toLocaleString()}`, 'Revenue']}
                        />
                        <Area type="monotone" dataKey="revenue" stroke="#DEB573" strokeWidth={3} fillOpacity={1} fill="url(#goldGradient)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Fulfillment Status Donut Chart (1 col) */}
                <div className="bg-white dark:bg-[#0E0E10] border border-[#EADBCE] dark:border-white/10 rounded-3xl p-6 shadow-xs space-y-4">
                  <h3 className="font-serif text-lg font-bold text-[#1A1615] dark:text-white">
                    Order Fulfillment Pulse
                  </h3>
                  <div className="h-48 w-full flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={orderStatusData}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={75}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {orderStatusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#141110',
                            borderColor: '#DEB573',
                            borderRadius: '0.75rem',
                            color: '#FAF6F0',
                            fontSize: '11px'
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                        <span>Pending Dispatch</span>
                      </span>
                      <strong>{pendingOrdersCount}</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                        <span>Dispatched to Courier</span>
                      </span>
                      <strong>{dispatchedOrdersCount}</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                        <span>Successfully Delivered</span>
                      </span>
                      <strong>{deliveredOrdersCount}</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Orders Preview */}
              <div className="bg-white dark:bg-[#0E0E10] border border-[#EADBCE] dark:border-white/10 rounded-3xl p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-[#1A1615] dark:text-white">
                      Recent Orders
                    </h3>
                    <p className="text-xs text-[#8C7B72] dark:text-zinc-400">
                      Latest customer orders requiring dispatch attention
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs font-bold text-[#C48B3B] dark:text-[#DEB573] hover:underline cursor-pointer"
                  >
                    View All Orders →
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#FAF6F0] dark:bg-zinc-900 text-[#8C7B72] dark:text-zinc-400 uppercase font-semibold">
                      <tr>
                        <th className="py-3 px-4 rounded-l-xl">Order ID</th>
                        <th className="py-3 px-4">Customer</th>
                        <th className="py-3 px-4">Hub</th>
                        <th className="py-3 px-4">Total</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right rounded-r-xl">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#FAF6F0] dark:divide-zinc-800">
                      {orders.slice(0, 5).map((order) => (
                        <tr key={order.id} className="hover:bg-[#FAF6F0]/50 dark:hover:bg-zinc-900/30 transition-colors">
                          <td className="py-3 px-4 font-mono font-bold text-[#1A1615] dark:text-white">{order.id}</td>
                          <td className="py-3 px-4 font-bold">{order.customer}</td>
                          <td className="py-3 px-4 text-[#8C7B72]">{order.city}</td>
                          <td className="py-3 px-4 font-bold">GH₵ {order.totalGHS?.toLocaleString()}</td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
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
                          <td className="py-3 px-4 text-right">
                            <a
                              href={generateWhatsAppLink(order)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 inline-flex rounded-full bg-[#25D366] text-white hover:bg-[#20BD5A]"
                              title="WhatsApp Customer"
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
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 2: ORDERS & DISPATCH                                      */}
          {/* ============================================================== */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              {/* Controls & Export Header */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-[#0E0E10] p-4 rounded-3xl border border-[#EADBCE] dark:border-white/10 shadow-xs">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C7B72]" />
                  <input
                    type="text"
                    placeholder="Search order ID, customer name, phone or hub..."
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-xs rounded-full bg-[#FAF6F0] dark:bg-zinc-900 border border-[#EADBCE] dark:border-zinc-800 text-[#1A1615] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#DEB573]"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={orderStatusFilter}
                    onChange={(e) => setOrderStatusFilter(e.target.value)}
                    className="bg-[#FAF6F0] dark:bg-zinc-900 border border-[#EADBCE] dark:border-zinc-800 rounded-full px-3 py-2 text-xs font-bold cursor-pointer text-[#1A1615] dark:text-white"
                  >
                    <option value="All">All Statuses ({orders.length})</option>
                    <option value="Pending Dispatch">Pending Dispatch ({pendingOrdersCount})</option>
                    <option value="Dispatched">Dispatched ({dispatchedOrdersCount})</option>
                    <option value="Delivered">Delivered ({deliveredOrdersCount})</option>
                  </select>

                  <button
                    onClick={handleExportCSV}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#1A1615] dark:bg-zinc-800 text-[#FAF6F0] hover:bg-zinc-800 text-xs font-bold transition-all cursor-pointer shrink-0 border border-white/10"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Export CSV</span>
                  </button>
                </div>
              </div>

              {/* Orders Table */}
              <div className="bg-white dark:bg-[#0E0E10] rounded-3xl border border-[#EADBCE] dark:border-white/10 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#FAF6F0] dark:bg-zinc-950 border-b border-[#EADBCE] dark:border-zinc-800 text-[#8C7B72] dark:text-zinc-400 uppercase font-semibold">
                      <tr>
                        <th className="py-3.5 px-4 sm:px-6">Transaction ID</th>
                        <th className="py-3.5 px-4">Customer</th>
                        <th className="py-3.5 px-4">Items</th>
                        <th className="py-3.5 px-4">Delivery Hub</th>
                        <th className="py-3.5 px-4">Total</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F5EFEB] dark:divide-zinc-800/80">
                      {filteredOrders.length === 0 ? (
                        <tr>
                          <td colSpan="7" className="py-12 text-center text-[#8C7B72] dark:text-zinc-400">
                            No orders found matching your search.
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
                                {order.date ? new Date(order.date).toLocaleDateString() : 'Today'}
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="font-bold text-[#1A1615] dark:text-white">{order.customer}</div>
                              <div className="text-[10px] font-mono text-[#8C7B72]">{order.phone}</div>
                            </td>
                            <td className="py-4 px-4">
                              <span className="font-semibold">{order.items?.length || 1} item(s)</span>
                            </td>
                            <td className="py-4 px-4">
                              <div>{order.city}</div>
                              {order.address && (
                                <div className="text-[10px] text-[#8C7B72] truncate max-w-[140px]">{order.address}</div>
                              )}
                            </td>
                            <td className="py-4 px-4 font-bold text-[#1A1615] dark:text-white">
                              GH₵ {order.totalGHS?.toLocaleString()}
                              {order.isVip && (
                                <span className="ml-1 px-1.5 py-0.2 rounded-full text-[9px] bg-[#DEB573] text-black font-extrabold">
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
                            <td className="py-4 px-4 sm:px-6 text-right space-x-1.5" onClick={(e) => e.stopPropagation()}>
                              <a
                                href={generateWhatsAppLink(order)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 inline-flex rounded-full bg-[#25D366] text-white hover:bg-[#20BD5A] transition-colors"
                                title="Send WhatsApp Update"
                              >
                                <MessageCircle className="w-3.5 h-3.5" />
                              </a>
                              <button
                                onClick={() => setSelectedOrder(order)}
                                className="p-2 inline-flex rounded-full bg-[#FAF6F0] dark:bg-zinc-800 text-[#1A1615] dark:text-white hover:bg-[#EADBCE] transition-colors"
                                title="Inspect Details"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setOrderToDelete(order)}
                                className="p-2 inline-flex rounded-full bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 transition-colors"
                                title="Delete Order"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
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
          {/* TAB 3: FORMULATIONS & STOCK (FULL CRUD)                       */}
          {/* ============================================================== */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              {/* Product Header & Action Toolbar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white dark:bg-[#0E0E10] p-4 sm:p-5 rounded-3xl border border-[#EADBCE] dark:border-white/10 shadow-xs">
                <div>
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1A1615] dark:text-white">
                    Catalog Formulations ({filteredProducts.length})
                  </h2>
                  <p className="text-xs text-[#8C7B72] dark:text-zinc-400">
                    Add new products, adjust pricing, manage formulations and toggle stock availability
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-[#FAF6F0] dark:bg-zinc-900 rounded-full p-1 border border-[#EADBCE] dark:border-zinc-800">
                    <button
                      onClick={() => setProductViewMode('grid')}
                      className={`p-1.5 rounded-full cursor-pointer transition-all ${
                        productViewMode === 'grid' ? 'bg-[#1A1615] dark:bg-white text-white dark:text-[#1A1615]' : 'text-zinc-400'
                      }`}
                      title="Grid View"
                    >
                      <LayoutGrid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setProductViewMode('table')}
                      className={`p-1.5 rounded-full cursor-pointer transition-all ${
                        productViewMode === 'table' ? 'bg-[#1A1615] dark:bg-white text-white dark:text-[#1A1615]' : 'text-zinc-400'
                      }`}
                      title="Table View"
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={handleOpenAddProduct}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-[#DEB573] to-[#C48B3B] text-[#1A1615] text-xs font-bold shadow-lg shadow-[#DEB573]/20 hover:opacity-95 transition-all cursor-pointer shrink-0"
                  >
                    <Plus className="w-4 h-4 stroke-[3]" />
                    <span>Add Formulation</span>
                  </button>
                </div>
              </div>

              {/* Filters & Search Row */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C7B72]" />
                  <input
                    type="text"
                    placeholder="Search formulation name, code #, or keyword..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-xs rounded-full bg-white dark:bg-[#0E0E10] border border-[#EADBCE] dark:border-white/10 text-[#1A1615] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#DEB573]"
                  />
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setProductCategoryFilter(cat)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                        productCategoryFilter === cat
                          ? 'bg-[#1A1615] dark:bg-[#DEB573] text-white dark:text-[#1A1615]'
                          : 'bg-white dark:bg-[#0E0E10] border border-[#EADBCE] dark:border-white/10 text-[#8C7B72]'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Products View: Cards Grid */}
              {productViewMode === 'grid' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      className="bg-white dark:bg-[#0E0E10] border border-[#EADBCE] dark:border-white/10 rounded-3xl p-4 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow relative group"
                    >
                      <div>
                        {/* Top Image + Badges */}
                        <div className="relative h-44 rounded-2xl overflow-hidden bg-[#FAF6F0] dark:bg-zinc-900 border border-[#EADBCE] dark:border-zinc-800 mb-3">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              e.target.src = '/catalog/page_1.jpg';
                            }}
                          />
                          <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1">
                            <span className="px-2 py-0.5 rounded-full bg-black/75 backdrop-blur-sm text-[#DEB573] font-mono text-[10px] font-bold">
                              #{product.code}
                            </span>
                            {product.badge && (
                              <span className="px-2 py-0.5 rounded-full bg-[#DEB573] text-[#1A1615] text-[10px] font-bold">
                                {product.badge}
                              </span>
                            )}
                          </div>

                          <div className="absolute top-2.5 right-2.5">
                            <button
                              onClick={() => handleToggleStock(product.id)}
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold shadow-md cursor-pointer transition-all ${
                                product.inStock !== false
                                  ? 'bg-emerald-500 text-white'
                                  : 'bg-rose-500 text-white'
                              }`}
                            >
                              {product.inStock !== false ? 'In Stock' : 'Out of Stock'}
                            </button>
                          </div>
                        </div>

                        {/* Info */}
                        <div className="space-y-1">
                          <div className="text-[10px] font-bold text-[#DEB573] uppercase tracking-wider">
                            {product.category} • {product.volume || 'Standard'}
                          </div>
                          <h3 className="font-serif font-bold text-sm text-[#1A1615] dark:text-white line-clamp-1">
                            {product.name}
                          </h3>
                          <p className="text-xs text-[#8C7B72] dark:text-zinc-400 line-clamp-2 leading-relaxed">
                            {product.description || product.subtitle}
                          </p>
                        </div>
                      </div>

                      {/* Pricing and Actions Row */}
                      <div className="pt-3 mt-3 border-t border-[#FAF6F0] dark:border-zinc-800 flex items-center justify-between">
                        <div>
                          <div className="font-serif font-bold text-base text-[#1A1615] dark:text-white">
                            GH₵ {product.priceGHS}
                          </div>
                          {product.originalPriceGHS && (
                            <span className="text-[10px] text-[#8C7B72] line-through">
                              GH₵ {product.originalPriceGHS}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleOpenEditProduct(product)}
                            className="p-2 rounded-xl bg-[#FAF6F0] dark:bg-zinc-800 hover:bg-[#DEB573] hover:text-[#1A1615] transition-colors cursor-pointer text-[#8C7B72] dark:text-zinc-300"
                            title="Edit Formulation Details"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setProductToDelete(product)}
                            className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white transition-colors cursor-pointer"
                            title="Delete Formulation"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Products View: Compact Table */}
              {productViewMode === 'table' && (
                <div className="bg-white dark:bg-[#0E0E10] rounded-3xl border border-[#EADBCE] dark:border-white/10 overflow-hidden shadow-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#FAF6F0] dark:bg-zinc-950 border-b border-[#EADBCE] dark:border-zinc-800 text-[#8C7B72] uppercase font-semibold">
                        <tr>
                          <th className="py-3.5 px-4 sm:px-6">Formulation</th>
                          <th className="py-3.5 px-4">Code</th>
                          <th className="py-3.5 px-4">Category</th>
                          <th className="py-3.5 px-4">Price</th>
                          <th className="py-3.5 px-4">Stock</th>
                          <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#FAF6F0] dark:divide-zinc-800">
                        {filteredProducts.map((p) => (
                          <tr key={p.id} className="hover:bg-[#FAF6F0]/50 dark:hover:bg-zinc-900/40 transition-colors">
                            <td className="py-3.5 px-4 sm:px-6 flex items-center gap-3">
                              <img
                                src={p.image}
                                alt={p.name}
                                className="w-10 h-10 rounded-xl object-cover bg-zinc-800 shrink-0"
                              />
                              <div>
                                <div className="font-bold text-[#1A1615] dark:text-white">{p.name}</div>
                                <div className="text-[10px] text-[#8C7B72]">{p.volume}</div>
                              </div>
                            </td>
                            <td className="py-3.5 px-4 font-mono font-bold text-[#DEB573]">#{p.code}</td>
                            <td className="py-3.5 px-4 text-[#8C7B72]">{p.category}</td>
                            <td className="py-3.5 px-4 font-bold">GH₵ {p.priceGHS}</td>
                            <td className="py-3.5 px-4">
                              <button
                                onClick={() => handleToggleStock(p.id)}
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold cursor-pointer ${
                                  p.inStock !== false ? 'bg-emerald-500/15 text-emerald-500' : 'bg-rose-500/15 text-rose-500'
                                }`}
                              >
                                {p.inStock !== false ? 'In Stock' : 'Out of Stock'}
                              </button>
                            </td>
                            <td className="py-3.5 px-4 sm:px-6 text-right space-x-1.5">
                              <button
                                onClick={() => handleOpenEditProduct(p)}
                                className="p-1.5 rounded-lg bg-[#FAF6F0] dark:bg-zinc-800 text-[#8C7B72] hover:text-white"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setProductToDelete(p)}
                                className="p-1.5 rounded-lg bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white"
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
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue by Settlement Gateway BarChart */}
                <div className="bg-white dark:bg-[#0E0E10] border border-[#EADBCE] dark:border-white/10 rounded-3xl p-6 shadow-xs space-y-4">
                  <h3 className="font-serif text-lg font-bold text-[#1A1615] dark:text-white">
                    Revenue by Settlement Method
                  </h3>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={channelData}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                        <XAxis dataKey="name" stroke="#8C7B72" fontSize={10} tickLine={false} />
                        <YAxis stroke="#8C7B72" fontSize={11} tickLine={false} tickFormatter={(v) => `GH₵${v}`} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#141110',
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

                {/* Regional Hub Share */}
                <div className="bg-white dark:bg-[#0E0E10] border border-[#EADBCE] dark:border-white/10 rounded-3xl p-6 shadow-xs space-y-4">
                  <h3 className="font-serif text-lg font-bold text-[#1A1615] dark:text-white">
                    Courier Dispatch Hub Distribution
                  </h3>
                  <div className="space-y-4 text-xs pt-2">
                    {[
                      { hub: 'Accra Metro (East Legon, Airport, Cantonments)', pct: 64, orders: 18, ghs: '6,420' },
                      { hub: 'Kumasi Central (Ahodwo, KNUST, Ridge)', pct: 22, orders: 7, ghs: '2,150' },
                      { hub: 'Lagos Hub (Ikeja, Victoria Island)', pct: 10, orders: 4, ghs: '1,790' },
                      { hub: 'Takoradi & Cape Coast Coastline Hub', pct: 4, orders: 2, ghs: '580' }
                    ].map((item, idx) => (
                      <div key={idx} className="space-y-1.5">
                        <div className="flex justify-between font-semibold">
                          <span>{item.hub}</span>
                          <span className="font-bold text-[#C48B3B] dark:text-[#DEB573]">
                            {item.pct}% (GH₵ {item.ghs})
                          </span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-[#FAF6F0] dark:bg-zinc-800 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#DEB573] to-[#C48B3B] rounded-full transition-all duration-500"
                            style={{ width: `${item.pct}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Performance Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="bg-white dark:bg-[#0E0E10] border border-[#EADBCE] dark:border-white/10 rounded-3xl p-5 space-y-2">
                  <span className="text-xs text-[#8C7B72] font-semibold">VIP Wholesale Conversion</span>
                  <div className="text-3xl font-serif font-bold text-[#C48B3B] dark:text-[#DEB573]">28.6%</div>
                  <p className="text-xs text-[#8C7B72]">Clients shopping with the 20% consultant discount</p>
                </div>

                <div className="bg-white dark:bg-[#0E0E10] border border-[#EADBCE] dark:border-white/10 rounded-3xl p-5 space-y-2">
                  <span className="text-xs text-[#8C7B72] font-semibold">Repeat Customer Rate</span>
                  <div className="text-3xl font-serif font-bold text-emerald-500">41.2%</div>
                  <p className="text-xs text-[#8C7B72]">Novage+ skin refills ordered within 60 days</p>
                </div>

                <div className="bg-white dark:bg-[#0E0E10] border border-[#EADBCE] dark:border-white/10 rounded-3xl p-5 space-y-2">
                  <span className="text-xs text-[#8C7B72] font-semibold">WhatsApp Concierge Conversions</span>
                  <div className="text-3xl font-serif font-bold text-blue-500">73.0%</div>
                  <p className="text-xs text-[#8C7B72]">Voice note & shade queries converted to checkout</p>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 5: PARTNER NETWORK (AFFILIATES)                           */}
          {/* ============================================================== */}
          {activeTab === 'affiliates' && (
            <div className="space-y-6">
              <div>
                <h2 className="font-serif text-2xl font-bold text-[#1A1615] dark:text-white">
                  Multi-Tenant Brand Partners & Consultants
                </h2>
                <p className="text-xs text-[#8C7B72] dark:text-zinc-400">
                  Track individual consultant referral performance and provide one-click WhatsApp store links.
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
                    ordersCount: 4
                  },
                  {
                    name: 'Ama Konadu',
                    phone: '233241239988',
                    id: 'GH-2026-412',
                    role: 'Certified Fragrance Specialist',
                    salesGHS: 1420,
                    ordersCount: 2
                  }
                ].map((consultant) => {
                  const partnerUrl = `${window.location.origin}?consultant=${encodeURIComponent(consultant.name)}&phone=${consultant.phone}&id=${consultant.id}`;
                  return (
                    <div
                      key={consultant.id}
                      className="bg-white dark:bg-[#0E0E10] border border-[#EADBCE] dark:border-white/10 rounded-3xl p-6 shadow-xs space-y-4"
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
                            className="flex-1 px-3 py-2 rounded-full bg-[#FAF6F0] dark:bg-zinc-900 border border-[#EADBCE] dark:border-zinc-800 text-[10px] font-mono text-[#6E5D53] dark:text-zinc-300"
                          />
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(partnerUrl);
                              showToast(`Copied referral link for ${consultant.name}`);
                            }}
                            className="px-3.5 py-2 rounded-full bg-[#1A1615] dark:bg-white text-white dark:text-[#1A1615] text-[10px] font-bold cursor-pointer shrink-0"
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
          {/* TAB 6: STORE CONFIG & FEATURE TOGGLES                         */}
          {/* ============================================================== */}
          {activeTab === 'settings' && (
            <form onSubmit={handleSaveConfig} className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-[#1A1615] dark:text-white">
                    Storefront Engine & Branding
                  </h2>
                  <p className="text-xs text-[#8C7B72] dark:text-zinc-400">
                    Live white-label configuration. Changes update the customer storefront immediately.
                  </p>
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#DEB573] to-[#C48B3B] text-[#1A1615] text-xs font-bold shadow-lg shadow-[#DEB573]/20 hover:opacity-95 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Live Settings</span>
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Branding Card */}
                <div className="bg-white dark:bg-[#0E0E10] border border-[#EADBCE] dark:border-white/10 rounded-3xl p-6 shadow-xs space-y-4">
                  <h4 className="font-bold text-sm text-[#1A1615] dark:text-white border-b pb-2 border-[#FAF6F0] dark:border-zinc-800">
                    Brand Identity
                  </h4>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-[#8C7B72] block mb-1">Prefix</label>
                      <input
                        type="text"
                        value={config.branding.namePrefix}
                        onChange={(e) =>
                          setConfig({
                            ...config,
                            branding: { ...config.branding, namePrefix: e.target.value }
                          })
                        }
                        className="w-full px-3 py-2 text-xs rounded-xl bg-[#FAF6F0] dark:bg-zinc-900 border border-[#EADBCE] dark:border-zinc-800 text-[#1A1615] dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-[#8C7B72] block mb-1">Suffix</label>
                      <input
                        type="text"
                        value={config.branding.nameSuffix}
                        onChange={(e) =>
                          setConfig({
                            ...config,
                            branding: { ...config.branding, nameSuffix: e.target.value }
                          })
                        }
                        className="w-full px-3 py-2 text-xs rounded-xl bg-[#FAF6F0] dark:bg-zinc-900 border border-[#EADBCE] dark:border-zinc-800 text-[#1A1615] dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-[#8C7B72] block mb-1">Store Tagline</label>
                    <input
                      type="text"
                      value={config.branding.tagline}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          branding: { ...config.branding, tagline: e.target.value }
                        })
                      }
                      className="w-full px-3 py-2 text-xs rounded-xl bg-[#FAF6F0] dark:bg-zinc-900 border border-[#EADBCE] dark:border-zinc-800 text-[#1A1615] dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-[#8C7B72] block mb-1">Top Announcement Badge</label>
                    <input
                      type="text"
                      value={config.branding.badge}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          branding: { ...config.branding, badge: e.target.value }
                        })
                      }
                      className="w-full px-3 py-2 text-xs rounded-xl bg-[#FAF6F0] dark:bg-zinc-900 border border-[#EADBCE] dark:border-zinc-800 text-[#1A1615] dark:text-white"
                    />
                  </div>
                </div>

                {/* Owner / Contact Card */}
                <div className="bg-white dark:bg-[#0E0E10] border border-[#EADBCE] dark:border-white/10 rounded-3xl p-6 shadow-xs space-y-4">
                  <h4 className="font-bold text-sm text-[#1A1615] dark:text-white border-b pb-2 border-[#FAF6F0] dark:border-zinc-800">
                    Contact & WhatsApp Orders
                  </h4>

                  <div>
                    <label className="text-[11px] font-semibold text-[#8C7B72] block mb-1">Owner Name</label>
                    <input
                      type="text"
                      value={config.contact.ownerName}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          contact: { ...config.contact, ownerName: e.target.value }
                        })
                      }
                      className="w-full px-3 py-2 text-xs rounded-xl bg-[#FAF6F0] dark:bg-zinc-900 border border-[#EADBCE] dark:border-zinc-800 text-[#1A1615] dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-[#8C7B72] block mb-1">
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
                      className="w-full px-3 py-2 text-xs rounded-xl bg-[#FAF6F0] dark:bg-zinc-900 border border-[#EADBCE] dark:border-zinc-800 text-[#1A1615] dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-[#8C7B72] block mb-1">Contact Email</label>
                    <input
                      type="email"
                      value={config.contact.email}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          contact: { ...config.contact, email: e.target.value }
                        })
                      }
                      className="w-full px-3 py-2 text-xs rounded-xl bg-[#FAF6F0] dark:bg-zinc-900 border border-[#EADBCE] dark:border-zinc-800 text-[#1A1615] dark:text-white"
                    />
                  </div>
                </div>

                {/* Customer App Feature Switches */}
                <div className="lg:col-span-2 bg-white dark:bg-[#0E0E10] border border-[#EADBCE] dark:border-white/10 rounded-3xl p-6 shadow-xs space-y-4">
                  <h4 className="font-bold text-sm text-[#1A1615] dark:text-white border-b pb-2 border-[#FAF6F0] dark:border-zinc-800">
                    Customer Experience Modular Switches
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      { key: 'enable3DCarousel', label: '3D Product Perspective Carousel', desc: 'Interactive Swedish luxury showcase' },
                      { key: 'enableVirtualTryOn', label: 'AR Camera Try-On Room', desc: 'Live shade & lipstick simulation' },
                      { key: 'enableRoutineBuilder', label: 'Vanity Regimen Routine Builder', desc: '4-step system with 15% discount' },
                      { key: 'enableVoiceConcierge', label: 'Voice Note Audio Hotline', desc: 'Audio consultation player' },
                      { key: 'enableSkinDiagnostic', label: 'Cellular Skin Diagnostic Wizard', desc: 'Personalized product matchmaking' },
                      { key: 'enableScentFinder', label: 'Artisanal Scent Atelier', desc: 'Fragrance pyramid explorer' },
                      { key: 'enableVipWholesale', label: 'VIP Wholesale Rates', desc: '20% customer discount mode' },
                      { key: 'enableMomoUSSD', label: 'Mobile Money USSD Simulation', desc: 'MTN & Telecel checkout prompt' },
                      { key: 'enableAffiliateReferrals', label: 'Multi-Tenant Consultant Links', desc: '?consultant= referral generator' }
                    ].map((feat) => (
                      <label
                        key={feat.key}
                        className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#FAF6F0] dark:bg-zinc-900 border border-[#EADBCE] dark:border-zinc-800 cursor-pointer hover:border-[#DEB573] transition-all"
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
      </div>

      {/* ============================================================== */}
      {/* 3. MODALS (Add/Edit Product, Order Details, Delete Dialog)     */}
      {/* ============================================================== */}

      {/* Add / Edit Formulation Modal */}
      {isAddProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div
            className="w-full max-w-2xl bg-white dark:bg-[#0E0E10] text-[#1A1615] dark:text-white rounded-3xl p-6 shadow-2xl border border-[#EADBCE] dark:border-white/10 max-h-[90vh] overflow-y-auto space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#FAF6F0] dark:border-zinc-800">
              <div>
                <span className="text-[10px] font-mono text-[#DEB573] uppercase tracking-wider">
                  {editingProduct ? 'Update Formulation' : 'New Catalog Formulation'}
                </span>
                <h3 className="font-serif text-xl font-bold">
                  {editingProduct ? `Edit ${editingProduct.name}` : 'Add Formulation to Catalog'}
                </h3>
              </div>
              <button
                onClick={() => setIsAddProductModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-[#FAF6F0] dark:hover:bg-zinc-800 text-[#8C7B72] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-semibold text-[#8C7B72] block mb-1">
                    Formulation Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Giordani Gold Essenza Supreme"
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF6F0] dark:bg-zinc-900 border border-[#EADBCE] dark:border-zinc-800"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-[#8C7B72] block mb-1">
                    Catalog Code #
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 47722"
                    value={productForm.code}
                    onChange={(e) => setProductForm({ ...productForm, code: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF6F0] dark:bg-zinc-900 border border-[#EADBCE] dark:border-zinc-800"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[#8C7B72] block mb-1">
                  Subtitle / Formulation Highlight
                </label>
                <input
                  type="text"
                  placeholder="e.g. Niche Perfume Collection in co-lab with Givaudan"
                  value={productForm.subtitle}
                  onChange={(e) => setProductForm({ ...productForm, subtitle: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF6F0] dark:bg-zinc-900 border border-[#EADBCE] dark:border-zinc-800"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-[#8C7B72] block mb-1">Category</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full px-2 py-2 rounded-xl bg-[#FAF6F0] dark:bg-zinc-900 border border-[#EADBCE] dark:border-zinc-800 font-bold"
                  >
                    <option value="Skincare">Skincare</option>
                    <option value="Fragrance">Fragrance</option>
                    <option value="Makeup">Makeup</option>
                    <option value="Personal Care">Personal Care</option>
                    <option value="Wellness">Wellness</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-[#8C7B72] block mb-1">Sub-Category</label>
                  <input
                    type="text"
                    placeholder="Women / Anti-Ageing"
                    value={productForm.subCategory}
                    onChange={(e) => setProductForm({ ...productForm, subCategory: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF6F0] dark:bg-zinc-900 border border-[#EADBCE] dark:border-zinc-800"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-[#8C7B72] block mb-1">Retail Price (GH₵) *</label>
                  <input
                    type="number"
                    required
                    placeholder="650"
                    value={productForm.priceGHS}
                    onChange={(e) => setProductForm({ ...productForm, priceGHS: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF6F0] dark:bg-zinc-900 border border-[#EADBCE] dark:border-zinc-800 font-bold text-[#DEB573]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-[#8C7B72] block mb-1">Catalog Page #</label>
                  <input
                    type="number"
                    placeholder="3"
                    value={productForm.page}
                    onChange={(e) => setProductForm({ ...productForm, page: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF6F0] dark:bg-zinc-900 border border-[#EADBCE] dark:border-zinc-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-[#8C7B72] block mb-1">Volume / Size</label>
                  <input
                    type="text"
                    placeholder="50 ml"
                    value={productForm.volume}
                    onChange={(e) => setProductForm({ ...productForm, volume: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF6F0] dark:bg-zinc-900 border border-[#EADBCE] dark:border-zinc-800"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-[#8C7B72] block mb-1">Luxury Badge</label>
                  <input
                    type="text"
                    placeholder="Niche Luxury / Best Seller"
                    value={productForm.badge}
                    onChange={(e) => setProductForm({ ...productForm, badge: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF6F0] dark:bg-zinc-900 border border-[#EADBCE] dark:border-zinc-800"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-[#8C7B72] block mb-1">Image URL / Path</label>
                  <input
                    type="text"
                    placeholder="/catalog/page_3.jpg"
                    value={productForm.image}
                    onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF6F0] dark:bg-zinc-900 border border-[#EADBCE] dark:border-zinc-800 font-mono text-[11px]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[#8C7B72] block mb-1">
                  Full Botanical / Formulation Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe the cellular formulation, key ingredients, and sensorial experience..."
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF6F0] dark:bg-zinc-900 border border-[#EADBCE] dark:border-zinc-800"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-[#8C7B72] block mb-1">
                    Key Notes / Ingredients (comma-separated)
                  </label>
                  <input
                    type="text"
                    placeholder="Damask Rose, Pink Peppercorn, White Amber"
                    value={productForm.notes}
                    onChange={(e) => setProductForm({ ...productForm, notes: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF6F0] dark:bg-zinc-900 border border-[#EADBCE] dark:border-zinc-800"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-[#8C7B72] block mb-1">
                    Key Benefits (comma-separated)
                  </label>
                  <input
                    type="text"
                    placeholder="Artisanal niche, 10+ hr sillage, Givaudan co-lab"
                    value={productForm.benefits}
                    onChange={(e) => setProductForm({ ...productForm, benefits: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF6F0] dark:bg-zinc-900 border border-[#EADBCE] dark:border-zinc-800"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[#FAF6F0] dark:border-zinc-800">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productForm.inStock}
                    onChange={(e) => setProductForm({ ...productForm, inStock: e.target.checked })}
                    className="rounded accent-[#DEB573]"
                  />
                  <span className="font-bold">Available in Stock Immediately</span>
                </label>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddProductModalOpen(false)}
                    className="px-4 py-2 rounded-full bg-[#FAF6F0] dark:bg-zinc-800 text-[#8C7B72] hover:text-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-full bg-gradient-to-r from-[#DEB573] to-[#C48B3B] text-[#1A1615] font-bold cursor-pointer shadow-md"
                  >
                    {editingProduct ? 'Save Changes' : 'Create Product'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Order Detail & Dispatch Modal */}
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
                {selectedOrder.address && <p className="text-[#8C7B72]">{selectedOrder.address}</p>}
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
                href={generateWhatsAppLink(selectedOrder)}
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

      {/* Delete Confirmation Modal (Products) */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm bg-white dark:bg-[#0E0E10] text-[#1A1615] dark:text-white rounded-3xl p-6 shadow-2xl border border-[#EADBCE] dark:border-white/10 space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold">Remove Formulation?</h3>
            <p className="text-xs text-[#8C7B72] dark:text-zinc-400">
              Are you sure you want to remove <strong>{productToDelete.name}</strong> from the catalog? This action will immediately remove it from the customer store.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setProductToDelete(null)}
                className="flex-1 py-2.5 rounded-full bg-[#FAF6F0] dark:bg-zinc-800 text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteProduct(productToDelete.id)}
                className="flex-1 py-2.5 rounded-full bg-rose-500 text-white text-xs font-bold cursor-pointer hover:bg-rose-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Pill */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1A1615] dark:bg-white text-white dark:text-[#1A1615] px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-bold border border-[#DEB573]/50 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-[#DEB573] dark:text-[#C48B3B]" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
