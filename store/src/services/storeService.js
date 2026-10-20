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
  }
};

export default storeService;
