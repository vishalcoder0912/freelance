import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WishlistState {
  items: string[]; // List of product IDs
  toggleWishlist: (productId: string) => void;
  clearWishlist: () => void;
  hasItem: (productId: string) => boolean;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      toggleWishlist: (productId) =>
        set((state) => {
          const exists = state.items.includes(productId);
          if (exists) {
            return { items: state.items.filter((id) => id !== productId) };
          }
          return { items: [...state.items, productId] };
        }),
      clearWishlist: () => set({ items: [] }),
      hasItem: (productId) => get().items.includes(productId),
    }),
    {
      name: 'mason-wishlist-storage',
    }
  )
);
