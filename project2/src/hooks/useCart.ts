import { useEffect, useState } from 'react';
import { useCartStore, CartItem, Product } from '../store/useCartStore';

export function useCart() {
  const [mounted, setMounted] = useState(false);
  const items = useCartStore((state) => state.items);
  const isOpen = useCartStore((state) => state.isOpen);
  const addItem = useCartStore((state) => state.addItem);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const clearCart = useCartStore((state) => state.clearCart);
  const toggleCart = useCartStore((state) => state.toggleCart);

  useEffect(() => {
    setMounted(true);
  }, []);

  const cartItems = mounted ? items : [];
  const cartItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return {
    items: cartItems,
    isOpen: mounted ? isOpen : false,
    itemCount: cartItemCount,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    toggleCart,
    isMounted: mounted,
  };
}
