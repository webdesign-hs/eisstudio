'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShopifyProduct } from '@/lib/shopify';
import { formatPrice } from '@/lib/shopify/utils';

interface ProductCardProps {
  product: ShopifyProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  const price = product.priceRange.minVariantPrice;
  const compareAtPrice = product.variants[0]?.compareAtPrice;
  const isOnSale = compareAtPrice && parseFloat(compareAtPrice.amount) > parseFloat(price.amount);

  return (
    <Link href={`/shop/${product.handle}`} className="product-card group">
      <div className="product-card-image">
        {product.featuredImage ? (
          <Image
            src={product.featuredImage.url}
            alt={product.featuredImage.altText || product.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-[var(--color-pistachio)] flex items-center justify-center">
            <span className="text-[var(--color-espresso)] text-lg">Kein Bild</span>
          </div>
        )}

        {isOnSale && (
          <span className="product-card-badge">Sale</span>
        )}
      </div>

      <div className="product-card-info">
        <h3 className="product-card-title">{product.title}</h3>

        {product.productType && (
          <p className="product-card-type">{product.productType}</p>
        )}

        <div className="product-card-price">
          <span className="price-current">
            {formatPrice(price.amount, price.currencyCode)}
          </span>

          {isOnSale && compareAtPrice && (
            <span className="price-compare">
              {formatPrice(compareAtPrice.amount, compareAtPrice.currencyCode)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
