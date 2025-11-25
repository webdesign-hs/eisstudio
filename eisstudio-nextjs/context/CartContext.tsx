'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import {
  createCart,
  getCart,
  addToCart as addToCartApi,
  updateCartLines,
  removeFromCart as removeFromCartApi,
  ShopifyCart,
} from '@/lib/shopify';

interface CartContextType {
  cart: ShopifyCart | null;
  isLoading: boolean;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addToCart: (variantId: string, quantity?: number) => Promise<void>;
  updateQuantity: (lineId: string, quantity: number) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_ID_KEY = 'shopify_cart_id';

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<ShopifyCart | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  // Cart beim Start laden
  useEffect(() => {
    async function initCart() {
      try {
        const cartId = localStorage.getItem(CART_ID_KEY);

        if (cartId) {
          try {
            const existingCart = await getCart(cartId);
            if (existingCart) {
              setCart(existingCart);
              setIsLoading(false);
              return;
            }
          } catch (error) {
            console.error('Error loading existing cart:', error);
            localStorage.removeItem(CART_ID_KEY);
          }
        }

        // Neuen Cart erstellen
        const newCart = await createCart();
        localStorage.setItem(CART_ID_KEY, newCart.id);
        setCart(newCart);
      } catch (error) {
        console.error('Error initializing cart:', error);
      } finally {
        setIsLoading(false);
      }
    }

    initCart();
  }, []);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const toggleCart = useCallback(() => setIsOpen((prev) => !prev), []);

  const addToCart = useCallback(
    async (variantId: string, quantity = 1) => {
      if (!cart?.id) {
        console.error('No cart available');
        return;
      }

      setIsLoading(true);
      try {
        const updatedCart = await addToCartApi(cart.id, [{ merchandiseId: variantId, quantity }]);
        setCart(updatedCart);
        setIsOpen(true); // Öffne Cart nach Hinzufügen
      } catch (error) {
        console.error('Error adding to cart:', error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [cart?.id]
  );

  const updateQuantity = useCallback(
    async (lineId: string, quantity: number) => {
      if (!cart?.id) return;

      setIsLoading(true);
      try {
        if (quantity === 0) {
          const updatedCart = await removeFromCartApi(cart.id, [lineId]);
          setCart(updatedCart);
        } else {
          const updatedCart = await updateCartLines(cart.id, [{ id: lineId, quantity }]);
          setCart(updatedCart);
        }
      } catch (error) {
        console.error('Error updating cart:', error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [cart?.id]
  );

  const removeItem = useCallback(
    async (lineId: string) => {
      if (!cart?.id) return;

      setIsLoading(true);
      try {
        const updatedCart = await removeFromCartApi(cart.id, [lineId]);
        setCart(updatedCart);
      } catch (error) {
        console.error('Error removing from cart:', error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [cart?.id]
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading,
        isOpen,
        openCart,
        closeCart,
        toggleCart,
        addToCart,
        updateQuantity,
        removeItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
