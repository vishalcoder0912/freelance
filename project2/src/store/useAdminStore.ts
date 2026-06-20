import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface OrderItem {
  productId: string;
  title: string;
  quantity: number;
  price: string;
}

export interface Order {
  id: string;
  date: string;
  customerName: string;
  customerEmail: string;
  address: string;
  city: string;
  postalCode: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status: 'Sourced' | 'Crafting' | 'Dispatched' | 'Delivered';
  paymentMethod: string;
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'fixed' | 'free_shipping';
  value: number; // e.g. 20 for 20%
  isActive: boolean;
}

interface AdminState {
  inventory: Record<string, number>; // productId -> quantity in stock
  orders: Order[];
  coupons: Coupon[];
  
  // Actions
  setStock: (productId: string, quantity: number) => void;
  deductStock: (productId: string, quantity: number) => void;
  addOrder: (order: Omit<Order, 'status' | 'date'>) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  addCoupon: (coupon: Coupon) => void;
  toggleCouponStatus: (code: string) => void;
  validateCoupon: (code: string) => Coupon | null;
  getSalesAnalytics: () => {
    totalRevenue: number;
    totalOrders: number;
    categorySales: Record<string, number>;
  };
}

const INITIAL_INVENTORY: Record<string, number> = {
  'sig-dark-75': 42,
  'malabar-milk-55': 28,
  'anaimalai-85': 18,
  'monsoon-harvest-spiced': 12,
  'rose-pistachio-white': 8,
  'artisan-curations-box': 15,
  'festive-heritage-box': 6,
  'single-origin-trio-bundle': 22,
  'monthly-club-subscription': 99,
  'seasonal-discovery-subscription': 99,
  'corporate-executive-set': 99,
};

const INITIAL_COUPONS: Coupon[] = [
  { code: 'GOLDEN20', discountType: 'percentage', value: 20, isActive: true },
  { code: 'CACAO10', discountType: 'percentage', value: 10, isActive: true },
  { code: 'FREESHIP', discountType: 'free_shipping', value: 0, isActive: true },
  { code: 'ATELIER500', discountType: 'fixed', value: 500, isActive: true },
];

export const useAdminStore = create<AdminState>()(
  persist(
    (set, get) => ({
      inventory: INITIAL_INVENTORY,
      orders: [],
      coupons: INITIAL_COUPONS,

      setStock: (productId, quantity) =>
        set((state) => ({
          inventory: { ...state.inventory, [productId]: Math.max(0, quantity) },
        })),

      deductStock: (productId, quantity) =>
        set((state) => {
          const current = state.inventory[productId] ?? 50;
          return {
            inventory: { ...state.inventory, [productId]: Math.max(0, current - quantity) },
          };
        }),

      addOrder: (order) =>
        set((state) => {
          const newOrder: Order = {
            ...order,
            date: new Date().toISOString(),
            status: 'Sourced',
          };
          return { orders: [newOrder, ...state.orders] };
        }),

      updateOrderStatus: (orderId, status) =>
        set((state) => ({
          orders: state.orders.map((o) => (o.id === orderId ? { ...o, status } : o)),
        })),

      addCoupon: (coupon) =>
        set((state) => ({
          coupons: [...state.coupons.filter((c) => c.code !== coupon.code), coupon],
        })),

      toggleCouponStatus: (code) =>
        set((state) => ({
          coupons: state.coupons.map((c) =>
            c.code === code ? { ...c, isActive: !c.isActive } : c
          ),
        })),

      validateCoupon: (code) => {
        const coupon = get().coupons.find(
          (c) => c.code.toUpperCase() === code.toUpperCase()
        );
        return coupon && coupon.isActive ? coupon : null;
      },

      getSalesAnalytics: () => {
        const orders = get().orders;
        const totalRevenue = orders.reduce((acc, o) => acc + o.total, 0);
        const totalOrders = orders.length;

        // Mock product mapping for categories
        const categorySales: Record<string, number> = {
          'Dark Chocolate': 0,
          'Milk Chocolate': 0,
          'Single Origin': 0,
          'Limited Editions': 0,
          'Gift Boxes': 0,
          'Festive Collections': 0,
          'Chocolate Bundles': 0,
          'Subscriptions': 0,
        };

        orders.forEach((order) => {
          order.items.forEach((item) => {
            // Categorize based on item prefix
            if (item.productId.includes('dark') || item.productId.includes('anaimalai')) {
              categorySales['Dark Chocolate'] += item.quantity;
            }
            if (item.productId.includes('milk')) {
              categorySales['Milk Chocolate'] += item.quantity;
            }
            if (item.productId.includes('anaimalai') || item.productId.includes('sig-dark')) {
              categorySales['Single Origin'] += item.quantity;
            }
            if (item.productId.includes('monsoon') || item.productId.includes('rose')) {
              categorySales['Limited Editions'] += item.quantity;
            }
            if (item.productId.includes('box')) {
              categorySales['Gift Boxes'] += item.quantity;
            }
            if (item.productId.includes('festive') || item.productId.includes('spiced')) {
              categorySales['Festive Collections'] += item.quantity;
            }
            if (item.productId.includes('bundle')) {
              categorySales['Chocolate Bundles'] += item.quantity;
            }
            if (item.productId.includes('subscription') || item.productId.includes('club')) {
              categorySales['Subscriptions'] += item.quantity;
            }
          });
        });

        return { totalRevenue, totalOrders, categorySales };
      },
    }),
    {
      name: 'mason-admin-storage',
    }
  )
);
