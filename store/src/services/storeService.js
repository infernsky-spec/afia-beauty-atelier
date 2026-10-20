/**
 * Store Service: Handles real-time order logging, inventory status,
 * and analytics persistence for the Admin Command Center.
 */
import storeConfig from '../config/store.config';
import initialProducts from '../data/products.json';

const STORAGE_KEYS = {
  ORDERS: 'afia_orders',
  PRODUCTS: 'afia_admin_products',
  CONFIG: 'afia_store_config',
};

// Seed realistic sample orders if none exist
const DEFAULT_SAMPLE_ORDERS = [
  {
    id: 'TXN-MOMO-839102',
    date: new Date(Date.now() - 1000 * 60 * 35).toISOString(), // 35 mins ago
    customer: 'Nana Yaa Boateng',
    phone: '233244123456',
    city: 'Accra Metro',
    address: 'East Legon, near ANC Mall',
    paymentMethod: 'MTN Mobile Money',
    items: [
      { name: 'Top Scents Rose Mode Eau de Parfum', code: '46059', qty: 1, price: 520, variant: '50ml' },
      { name: 'THE ONE 5-in-1 Wonder Lash Pump Plump Mascara', code: '46897', qty: 2, price: 165, variant: 'Black Velvet' }
    ],
    totalGHS: 850,
    isVip: false,
    consultantName: 'Afia Mensah',
    status: 'Pending Dispatch'
  },
  {
    id: 'TXN-PAYSTACK-619284',
    date: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
    customer: 'Emeka Nwosu',
    phone: '2348039876543',
    city: 'Lagos Hub (Ikeja/VI)',
    address: 'Victoria Island, Plot 14 Ahmadu Bello Way',
    paymentMethod: 'Mastercard / Visa',
    items: [
      { name: 'Giordani Gold Man Eau de Toilette', code: '38538', qty: 2, price: 780, variant: '75ml' },
      { name: 'North For Men Subzero 2-in-1 Moisturising Gel', code: '35877', qty: 1, price: 230, variant: '50ml' }
    ],
    totalGHS: 1790,
    isVip: true,
    consultantName: 'Afia Mensah',
    status: 'Dispatched'
  },
  {
    id: 'TXN-MOMO-482019',
    date: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), // 8 hours ago
    customer: 'Akosua Serwaa',
    phone: '233208112233',
    city: 'Kumasi Central',
    address: 'Ahodwo Roundabout, Kumasi',
    paymentMethod: 'Telecel Cash',
    items: [
      { name: 'Novage+ Ultimate Restore Skin Care Routine', code: '43694', qty: 1, price: 1980, variant: 'Full 5-Piece System' }
    ],
    totalGHS: 1980,
    isVip: false,
    consultantName: 'Afia Mensah',
    status: 'Delivered'
  },
  {
    id: 'TXN-MOMO-391820',
    date: new Date(Date.now() - 1000 * 60 * 60 * 22).toISOString(), // Yesterday
    customer: 'David Osei-Tutu',
    phone: '233277889900',
    city: 'Tema Community 6',
    address: 'Near Tema General Hospital',
    paymentMethod: 'AT Money',
    items: [
      { name: 'Love Potion So Tempting Fragrance Body Cream', code: '42514', qty: 2, price: 280, variant: '250ml' },
      { name: 'Milk & Honey Gold Smoothing Sugar Scrub', code: '31601', qty: 2, price: 195, variant: '250ml' }
    ],
    totalGHS: 950,
    isVip: false,
    consultantName: 'Ama Konadu',
    status: 'Delivered'
  }
];

export const storeService = {
  // Orders
  getOrders: () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
      if (saved) return JSON.parse(saved);
      // Pre-populate with realistic orders on first load
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(DEFAULT_SAMPLE_ORDERS));
      return DEFAULT_SAMPLE_ORDERS;
    } catch {
      return DEFAULT_SAMPLE_ORDERS;
    }
  },

  addOrder: (order) => {
    try {
      const orders = storeService.getOrders();
      const updated = [order, ...orders];
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(updated));
      return updated;
    } catch (e) {
      console.error('Error saving new order:', e);
      return [];
    }
  },

  updateOrderStatus: (orderId, newStatus) => {
    try {
      const orders = storeService.getOrders();
      const updated = orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o));
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(updated));
      return updated;
    } catch (e) {
      console.error('Error updating order:', e);
      return [];
    }
  },

  deleteOrder: (orderId) => {
    try {
      const orders = storeService.getOrders();
      const updated = orders.filter((o) => o.id !== orderId);
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(updated));
      return updated;
    } catch (e) {
      console.error('Error deleting order:', e);
      return [];
    }
  },

  // Products & Inventory
  getProducts: () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (saved) return JSON.parse(saved);
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(initialProducts));
      return initialProducts;
    } catch {
      return initialProducts;
    }
  },

  addProduct: (product) => {
    try {
      const products = storeService.getProducts();
      const newProduct = {
        ...product,
        id: product.id || (product.name ? product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : `product-${Date.now()}`),
      };
      const updated = [...products, newProduct];
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(updated));
      return updated;
    } catch (e) {
      console.error('Error adding product:', e);
      return [];
    }
  },

  updateProductPrice: (productId, newPriceGHS) => {
    try {
      const products = storeService.getProducts();
      const updated = products.map((p) =>
        p.id === productId ? { ...p, priceGHS: Number(newPriceGHS) } : p
      );
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(updated));
      return updated;
    } catch (e) {
      console.error('Error updating product price:', e);
      return [];
    }
  },

  updateProduct: (productId, updates) => {
    try {
      const products = storeService.getProducts();
      const updated = products.map((p) =>
        p.id === productId ? { ...p, ...updates } : p
      );
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(updated));
      return updated;
    } catch (e) {
      console.error('Error updating product:', e);
      return [];
    }
  },

  deleteProduct: (productId) => {
    try {
      const products = storeService.getProducts();
      const updated = products.filter((p) => p.id !== productId);
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(updated));
      return updated;
    } catch (e) {
      console.error('Error deleting product:', e);
      return [];
    }
  },

  toggleProductStock: (productId) => {
    try {
      const products = storeService.getProducts();
      const updated = products.map((p) =>
        p.id === productId ? { ...p, inStock: p.inStock === false ? true : false } : p
      );
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(updated));
      return updated;
    } catch (e) {
      console.error('Error toggling product stock:', e);
      return [];
    }
  },

  // Live Store Configuration Overrides
  getConfigOverrides: () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CONFIG);
      return saved ? JSON.parse(saved) : storeConfig;
    } catch {
      return storeConfig;
    }
  },

  saveConfigOverrides: (newConfig) => {
    try {
      localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(newConfig));
      return newConfig;
    } catch (e) {
      console.error('Error saving config overrides:', e);
      return storeConfig;
    }
  },

  // Analytics — computed from orders & products
  getAnalytics: () => {
    try {
      const orders = storeService.getOrders();

      const totalRevenue = orders.reduce((sum, o) => sum + (o.totalGHS || 0), 0);
      const totalOrders = orders.length;
      const avgOrderValue = totalOrders > 0 ? Math.round((totalRevenue / totalOrders) * 100) / 100 : 0;

      const pendingOrders = orders.filter((o) => o.status === 'Pending Dispatch').length;
      const dispatchedOrders = orders.filter((o) => o.status === 'Dispatched').length;
      const deliveredOrders = orders.filter((o) => o.status === 'Delivered').length;
      const vipOrders = orders.filter((o) => o.isVip).length;

      // Revenue by day (last 7 days)
      const now = new Date();
      const dayLabels = [];
      const dayMap = {};
      for (let i = 6; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        const key = d.toISOString().slice(0, 10); // YYYY-MM-DD
        dayLabels.push(key);
        dayMap[key] = 0;
      }
      orders.forEach((o) => {
        if (o.date) {
          const orderDay = new Date(o.date).toISOString().slice(0, 10);
          if (dayMap[orderDay] !== undefined) {
            dayMap[orderDay] += o.totalGHS || 0;
          }
        }
      });
      const revenueByDay = dayLabels.map((day) => ({ day, revenue: dayMap[day] }));

      // Revenue by channel (paymentMethod)
      const channelMap = {};
      orders.forEach((o) => {
        const channel = o.paymentMethod || 'Unknown';
        if (!channelMap[channel]) channelMap[channel] = { revenue: 0, count: 0 };
        channelMap[channel].revenue += o.totalGHS || 0;
        channelMap[channel].count += 1;
      });
      const revenueByChannel = Object.entries(channelMap).map(([channel, data]) => ({
        channel,
        revenue: data.revenue,
        count: data.count,
      }));

      // Top products (across all order items)
      const productMap = {};
      orders.forEach((o) => {
        (o.items || []).forEach((item) => {
          const name = item.name || 'Unknown';
          if (!productMap[name]) productMap[name] = { revenue: 0, unitsSold: 0 };
          const qty = item.qty || 1;
          productMap[name].unitsSold += qty;
          productMap[name].revenue += (item.price || 0) * qty;
        });
      });
      const topProducts = Object.entries(productMap)
        .map(([name, data]) => ({ name, revenue: data.revenue, unitsSold: data.unitsSold }))
        .sort((a, b) => b.revenue - a.revenue);

      // Orders by city
      const cityMap = {};
      orders.forEach((o) => {
        const city = o.city || 'Unknown';
        if (!cityMap[city]) cityMap[city] = { count: 0, revenue: 0 };
        cityMap[city].count += 1;
        cityMap[city].revenue += o.totalGHS || 0;
      });
      const ordersByCity = Object.entries(cityMap).map(([city, data]) => ({
        city,
        count: data.count,
        revenue: data.revenue,
      }));

      return {
        totalRevenue,
        totalOrders,
        avgOrderValue,
        pendingOrders,
        dispatchedOrders,
        deliveredOrders,
        vipOrders,
        revenueByDay,
        revenueByChannel,
        topProducts,
        ordersByCity,
      };
    } catch (e) {
      console.error('Error computing analytics:', e);
      return {
        totalRevenue: 0,
        totalOrders: 0,
        avgOrderValue: 0,
        pendingOrders: 0,
        dispatchedOrders: 0,
        deliveredOrders: 0,
        vipOrders: 0,
        revenueByDay: [],
        revenueByChannel: [],
        topProducts: [],
        ordersByCity: [],
      };
    }
  },
};

export default storeService;
