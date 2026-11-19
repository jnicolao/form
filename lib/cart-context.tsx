'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from 'react';
import type { CartItem, PickspotOrderStatus } from './types';
import { getProductById } from './products';

const STORAGE_KEY = 'form-cart';
const ORDERS_KEY = 'form-orders';

interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  addItem: (productId: string, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  incrementItem: (productId: string) => void;
  decrementItem: (productId: string) => void;
  clearCart: () => void;
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // The saved cart can only be read in the browser, after the first render, so
  // that the server and the browser agree on the first page they draw.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setItems(JSON.parse(stored));
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    if (hydrated) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      } catch {
        /* ignore */
      }
    }
  }, [items, hydrated]);

  const addItem = useCallback((productId: string, quantity = 1) => {
    const product = getProductById(productId);
    if (!product) return;
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === productId);
      if (existing) {
        return prev.map((i) =>
          i.productId === productId
            ? { ...i, quantity: Math.min(i.quantity + quantity, 99) }
            : i,
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          slug: product.slug,
          name: product.name,
          subtitle: product.subtitle,
          size: product.size,
          priceKES: product.priceKES,
          image: product.image,
          parcelClass: product.parcelClass,
          quantity,
        },
      ];
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity < 1) return;
    setItems((prev) =>
      prev.map((i) =>
        i.productId === productId
          ? { ...i, quantity: Math.min(quantity, 99) }
          : i,
      ),
    );
  }, []);

  const incrementItem = useCallback((productId: string) => {
    setItems((prev) =>
      prev.map((i) =>
        i.productId === productId
          ? { ...i, quantity: Math.min(i.quantity + 1, 99) }
          : i,
      ),
    );
  }, []);

  const decrementItem = useCallback((productId: string) => {
    setItems((prev) =>
      prev.map((i) =>
        i.productId === productId
          ? { ...i, quantity: Math.max(i.quantity - 1, 1) }
          : i,
      ),
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);
  const openDrawer = useCallback(() => setDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.priceKES * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        addItem,
        removeItem,
        updateQuantity,
        incrementItem,
        decrementItem,
        clearCart,
        isDrawerOpen,
        openDrawer,
        closeDrawer,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}

export function storeOrder(order: {
  orderId: string;
  reference: string;
  kind: 'PARCEL' | 'CLAIM';
  status: PickspotOrderStatus;
  items: CartItem[];
  recipientPhone?: string;
  recipientHandle?: string;
  parcelCode?: string | null;
  claimUrl?: string | null;
}) {
  try {
    const existing = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
    existing.unshift({ ...order, createdAt: new Date().toISOString() });
    localStorage.setItem(ORDERS_KEY, JSON.stringify(existing.slice(0, 20)));
  } catch {
    /* ignore */
  }
}

export function getStoredOrders() {
  try {
    return JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
  } catch {
    return [];
  }
}

export function getStoredOrder(orderId: string) {
  try {
    const orders = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
    return orders.find(
      (o: { orderId: string; reference?: string }) =>
        o.orderId === orderId || o.reference === orderId,
    );
  } catch {
    return null;
  }
}
