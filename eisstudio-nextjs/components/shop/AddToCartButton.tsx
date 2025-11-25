'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';

interface AddToCartButtonProps {
  variantId: string;
  availableForSale: boolean;
  quantity?: number;
  className?: string;
}

export default function AddToCartButton({
  variantId,
  availableForSale,
  quantity = 1,
  className = '',
}: AddToCartButtonProps) {
  const { addToCart, isLoading } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleClick = async () => {
    if (!availableForSale || isAdding) return;

    setIsAdding(true);
    try {
      await addToCart(variantId, quantity);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (error) {
      console.error('Fehler beim Hinzufuegen:', error);
    } finally {
      setIsAdding(false);
    }
  };

  if (!availableForSale) {
    return (
      <button
        disabled
        className={`add-to-cart-btn disabled ${className}`}
      >
        Ausverkauft
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={isAdding || isLoading}
      className={`add-to-cart-btn ${showSuccess ? 'success' : ''} ${className}`}
    >
      {isAdding ? (
        <span className="flex items-center justify-center gap-2">
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Wird hinzugefuegt...
        </span>
      ) : showSuccess ? (
        <span className="flex items-center justify-center gap-2">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Hinzugefuegt!
        </span>
      ) : (
        'In den Warenkorb'
      )}
    </button>
  );
}
