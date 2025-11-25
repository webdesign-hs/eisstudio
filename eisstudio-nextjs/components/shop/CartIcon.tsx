'use client';

import { useCart } from '@/context/CartContext';

export default function CartIcon() {
  const { cart, toggleCart } = useCart();
  const totalQuantity = cart?.totalQuantity || 0;

  return (
    <button
      onClick={toggleCart}
      className="cart-icon-btn"
      aria-label={`Warenkorb (${totalQuantity} Artikel)`}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
      {totalQuantity > 0 && (
        <span className="cart-badge">{totalQuantity}</span>
      )}
    </button>
  );
}
