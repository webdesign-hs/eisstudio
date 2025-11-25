'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getProductByHandle, ShopifyProduct } from '@/lib/shopify';
import { formatPrice } from '@/lib/shopify/utils';
import Navigation from '@/components/Navigation';
import { AddToCartButton, VariantSelector, ShopFooter } from '@/components/shop';

export default function ProductPage() {
  const params = useParams();
  const handle = params.handle as string;

  const [product, setProduct] = useState<ShopifyProduct | null>(null);
  const [selectedVariantId, setSelectedVariantId] = useState<string>('');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProduct() {
      try {
        const productData = await getProductByHandle(handle);
        setProduct(productData);
        if (productData?.variants[0]) {
          setSelectedVariantId(productData.variants[0].id);
        }
      } catch (error) {
        console.error('Fehler beim Laden:', error);
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [handle]);

  if (loading) {
    return (
      <>
        <Navigation />
        <main className="product-page">
          <div className="container">
            <div className="product-loading">
              <div className="loading-spinner" />
              <p>Lade Produkt...</p>
            </div>
          </div>
        </main>
        <ShopFooter />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navigation />
        <main className="product-page">
          <div className="container">
            <div className="product-not-found">
              <h1>Produkt nicht gefunden</h1>
              <p>Das gewünschte Produkt existiert nicht.</p>
              <Link href="/shop" className="back-to-shop">
                Zurück zum Shop
              </Link>
            </div>
          </div>
        </main>
        <ShopFooter />
      </>
    );
  }

  const selectedVariant = product.variants.find((v) => v.id === selectedVariantId);
  const price = selectedVariant?.price || product.priceRange.minVariantPrice;
  const compareAtPrice = selectedVariant?.compareAtPrice;
  const isOnSale = compareAtPrice && parseFloat(compareAtPrice.amount) > parseFloat(price.amount);
  const images = product.images.length > 0 ? product.images : product.featuredImage ? [product.featuredImage] : [];

  return (
    <>
      <Navigation />
      <main className="product-page">
        <div className="container">
          {/* Breadcrumb */}
          <nav className="breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <Link href="/shop">Shop</Link>
            <span>/</span>
            <span>{product.title}</span>
          </nav>

          <div className="product-layout">
          {/* Image Gallery */}
          <div className="product-gallery">
            <div className="product-main-image">
              {images[selectedImageIndex] ? (
                <Image
                  src={images[selectedImageIndex].url}
                  alt={images[selectedImageIndex].altText || product.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="product-no-image">
                  <span>Kein Bild verfuegbar</span>
                </div>
              )}

              {isOnSale && <span className="product-sale-badge">Sale</span>}
            </div>

            {images.length > 1 && (
              <div className="product-thumbnails">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`thumbnail ${index === selectedImageIndex ? 'active' : ''}`}
                  >
                    <Image
                      src={image.url}
                      alt={image.altText || `${product.title} - Bild ${index + 1}`}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="product-info">
            {product.vendor && <p className="product-vendor">{product.vendor}</p>}

            <h1 className="product-title">{product.title}</h1>

            <div className="product-price-display">
              <span className="current-price">
                {formatPrice(price.amount, price.currencyCode)}
              </span>
              {isOnSale && compareAtPrice && (
                <span className="compare-price">
                  {formatPrice(compareAtPrice.amount, compareAtPrice.currencyCode)}
                </span>
              )}
            </div>

            {/* Variant Selector */}
            <VariantSelector
              product={product}
              selectedVariantId={selectedVariantId}
              onVariantChange={setSelectedVariantId}
            />

            {/* Add to Cart */}
            <AddToCartButton
              variantId={selectedVariantId}
              availableForSale={selectedVariant?.availableForSale ?? false}
            />

            {/* Description */}
            {product.descriptionHtml && (
              <div className="product-description">
                <h2>Beschreibung</h2>
                <div dangerouslySetInnerHTML={{ __html: product.descriptionHtml }} />
              </div>
            )}

            {/* Tags */}
            {product.tags.length > 0 && (
              <div className="product-tags">
                {product.tags.map((tag) => (
                  <span key={tag} className="product-tag">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
        </div>
      </main>
      <ShopFooter />
    </>
  );
}
