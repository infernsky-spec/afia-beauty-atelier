/**
 * Store Service: Real-time reactive data layer for Afia Beauty Atelier.
 * Uses localStorage + BroadcastChannel + CustomEvents for instant cross-tab & cross-app real-time synchronization.
 */
import storeConfig from '../config/store.config';
import initialProducts from '../data/products.json';

const STORAGE_KEYS = {
  ORDERS: 'afia_orders',
  PRODUCTS: 'afia_admin_products',
  CONFIG: 'afia_store_config',
  ACTIVITIES: 'afia_live_activities'
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

// Broadcast channel for instantaneous cross-tab synchronization
const channel = typeof window !== 'undefined' && 'BroadcastChannel' in window
  ? new BroadcastChannel('afia_realtime_store')
  : null;

const notifyListeners = (type, data) => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('afia_store_sync', { detail: { type, data } }));
    if (channel) {
      try {
        channel.postMessage({ type, data, timestamp: Date.now() });
      } catch (err) {
        console.warn('Broadcast channel sync notice:', err);
      }
    }
  }
};

export const storeService = {
  // Real-Time Event Subscription (Used by Customer Store and Admin Suite)
  subscribe: (callback) => {
    if (typeof window === 'undefined') return () => {};

    const localHandler = (e) => {
      callback(e.detail || { type: 'UNKNOWN' });
    };

    const storageHandler = (e) => {
      if (Object.values(STORAGE_KEYS).includes(e.key)) {
        callback({ type: 'STORAGE_CHANGE', key: e.key });
      }
    };

    window.addEventListener('afia_store_sync', localHandler);
    window.addEventListener('storage', storageHandler);

    if (channel) {
      channel.onmessage = (msgEvent) => {
        callback(msgEvent.data || { type: 'BROADCAST_SYNC' });
      };
    }

    return () => {
      window.removeEventListener('afia_store_sync', localHandler);
      window.removeEventListener('storage', storageHandler);
    };
  },

  // Orders
  getOrders: () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
      if (saved) return JSON.parse(saved);
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(DEFAULT_SAMPLE_ORDERS));
      return DEFAULT_SAMPLE_ORDERS;
    } catch {
      return DEFAULT_SAMPLE_ORDERS;
    }
  },

  addOrder: (order) => {
    try {
      const orders = storeService.getOrders();
      const newOrder = {
        ...order,
        id: order.id || `TXN-${Date.now().toString().slice(-6)}`,
        date: order.date || new Date().toISOString()
      };
      const updated = [newOrder, ...orders];
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(updated));
      storeService.logActivity(`New order ${newOrder.id} placed by ${newOrder.customer} (GH₵ ${newOrder.totalGHS})`);
      notifyListeners('ORDER_ADDED', newOrder);
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
      storeService.logActivity(`Order ${orderId} updated to ${newStatus}`);
      notifyListeners('ORDER_STATUS_UPDATED', { orderId, newStatus });
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
      storeService.logActivity(`Order ${orderId} was removed`);
      notifyListeners('ORDER_DELETED', { orderId });
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
        inStock: product.inStock !== false
      };
      const updated = [newProduct, ...products];
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(updated));
      storeService.logActivity(`Added new formulation: ${newProduct.name}`);
      notifyListeners('PRODUCT_ADDED', newProduct);
      return updated;
    } catch (e) {
      console.error('Error adding product:', e);
      return [];
    }
  },

  updateProduct: (productId, updates) => {
    try {
      const products = storeService.getProducts();
      const updated = products.map((p) => (p.id === productId ? { ...p, ...updates } : p));
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(updated));
      storeService.logActivity(`Updated formulation specs: ${updates.name || productId}`);
      notifyListeners('PRODUCT_UPDATED', { productId, updates });
      return updated;
    } catch (e) {
      console.error('Error updating product:', e);
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
      storeService.logActivity(`Price adjusted for ${productId} to GH₵ ${newPriceGHS}`);
      notifyListeners('PRODUCT_PRICE_UPDATED', { productId, newPriceGHS });
      return updated;
    } catch (e) {
      console.error('Error updating product price:', e);
      return [];
    }
  },

  toggleProductStock: (productId) => {
    try {
      const products = storeService.getProducts();
      let toggledTo = true;
      const updated = products.map((p) => {
        if (p.id === productId) {
          toggledTo = p.inStock === false ? true : false;
          return { ...p, inStock: toggledTo };
        }
        return p;
      });
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(updated));
      storeService.logActivity(`Stock for ${productId} set to ${toggledTo ? 'In Stock' : 'Out of Stock'}`);
      notifyListeners('PRODUCT_STOCK_TOGGLED', { productId, inStock: toggledTo });
      return updated;
    } catch (e) {
      console.error('Error toggling product stock:', e);
      return [];
    }
  },

  deleteProduct: (productId) => {
    try {
      const products = storeService.getProducts();
      const updated = products.filter((p) => p.id !== productId);
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(updated));
      storeService.logActivity(`Deleted formulation: ${productId}`);
      notifyListeners('PRODUCT_DELETED', { productId });
      return updated;
    } catch (e) {
      console.error('Error deleting product:', e);
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
      storeService.logActivity('Storefront identity & feature switches updated');
      notifyListeners('CONFIG_SAVED', newConfig);
      return newConfig;
    } catch (e) {
      console.error('Error saving config overrides:', e);
      return storeConfig;
    }
  },

  // Live Activity Log
  getActivities: () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
      return saved ? JSON.parse(saved) : [
        { text: 'Store initialized with 22 Q4 Swedish beauty formulations', time: '1 hr ago' },
        { text: 'MTN MoMo USSD Gateway synchronized', time: '45 mins ago' },
        { text: 'Order #TXN-MOMO-839102 logged into courier pipeline', time: '35 mins ago' }
      ];
    } catch {
      return [];
    }
  },

  logActivity: (text) => {
    try {
      const list = storeService.getActivities();
      const updated = [{ text, time: 'Just now', id: Date.now() }, ...list.slice(0, 19)];
      localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(updated));
      notifyListeners('ACTIVITY_LOGGED', updated);
      return updated;
    } catch {
      return [];
    }
  },

  // Quick Order Simulation for live demonstration
  simulateSampleOrder: () => {
    const names = ['Kofi Annan', 'Esi Mensah', 'Kwame Nkrumah Jr', 'Yaa Asantewaa', 'Kwesi Arthur'];
    const cities = ['Accra Metro', 'Kumasi Central', 'Lagos Hub (Ikeja/VI)', 'Takoradi Coast'];
    const randomName = names[Math.floor(Math.random() * names.length)];
    const randomCity = cities[Math.floor(Math.random() * cities.length)];
    const randomTotal = Math.floor(Math.random() * 900) + 350;

    const simulated = {
      id: `TXN-SIM-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toISOString(),
      customer: randomName,
      phone: '23324' + Math.floor(1000000 + Math.random() * 9000000),
      city: randomCity,
      address: 'Simulated Order via Real-Time Cloud Pipeline',
      paymentMethod: Math.random() > 0.4 ? 'MTN Mobile Money' : 'Telecel Cash',
      items: [
        { name: 'Top Scents Rose Mode Eau de Parfum', code: '46059', qty: 1, price: 520, variant: '50ml' }
      ],
      totalGHS: randomTotal,
      isVip: Math.random() > 0.7,
      consultantName: 'Afia Mensah',
      status: 'Pending Dispatch'
    };

    return storeService.addOrder(simulated);
  }
};

export default storeService;
