'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/shopify/utils';

export default function CartDrawer() {
  const { cart, isOpen, closeCart, updateQuantity, removeItem, isLoading } = useCart();
  const drawerRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCart();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, closeCart]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
        closeCart();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, closeCart]);

  const lines = cart?.lines || [];
  const totalQuantity = cart?.totalQuantity || 0;
  const subtotal = cart?.cost?.subtotalAmount;

  return (
    <>
      {/* Overlay */}
      <div
        className={`cart-overlay ${isOpen ? 'open' : ''}`}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className={`cart-drawer ${isOpen ? 'open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Warenkorb"
      >
        {/* Header */}
        <div className="cart-drawer-header">
          <h2>Warenkorb ({totalQuantity})</h2>
          <button onClick={closeCart} className="cart-close-btn" aria-label="Warenkorb schliessen">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="cart-drawer-content">
          {lines.length === 0 ? (
            <div className="cart-empty">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              <p>Dein Warenkorb ist leer</p>
            </div>
          ) : (
            <ul className="cart-items">
              {lines.map((line) => {
                const merchandise = line.merchandise;
                const product = merchandise.product;

                return (
                  <li key={line.id} className="cart-item">
                    <div className="cart-item-image">
                      {product.featuredImage ? (
                        <Image
                          src={product.featuredImage.url}
                          alt={product.featuredImage.altText || product.title}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="cart-item-placeholder" />
                      )}
                    </div>

                    <div className="cart-item-details">
                      <h3>{product.title}</h3>
                      {merchandise.title !== 'Default Title' && (
                        <p className="cart-item-variant">{merchandise.title}</p>
                      )}
                      <p className="cart-item-price">
                        {formatPrice(merchandise.price.amount, merchandise.price.currencyCode)}
                      </p>
                    </div>

                    <div className="cart-item-actions">
                      <div className="quantity-selector">
                        <button
                          onClick={() => updateQuantity(line.id, line.quantity - 1)}
                          disabled={isLoading}
                          aria-label="Menge verringern"
                        >
                          -
                        </button>
                        <span>{line.quantity}</span>
                        <button
                          onClick={() => updateQuantity(line.id, line.quantity + 1)}
                          disabled={isLoading}
                          aria-label="Menge erhoehen"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(line.id)}
                        disabled={isLoading}
                        className="remove-item-btn"
                        aria-label="Artikel entfernen"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                        </svg>
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Footer */}
        {lines.length > 0 && (
          <div className="cart-drawer-footer">
            <div className="cart-subtotal">
              <span>Zwischensumme</span>
              <span>
                {subtotal ? formatPrice(subtotal.amount, subtotal.currencyCode) : '0,00 EUR'}
              </span>
            </div>
            <p className="cart-shipping-note">Versandkosten werden beim Checkout berechnet</p>
            <a
              href={cart?.checkoutUrl}
              className="checkout-btn"
            >
              Zur Kasse
            </a>
          </div>
        )}
      </div>
    </>
  );
}
