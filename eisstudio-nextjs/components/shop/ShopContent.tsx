'use client';

import { useState, useMemo } from 'react';
import { ShopifyProduct } from '@/lib/shopify';
import { ProductCard } from '@/components/shop';

interface ShopContentProps {
  products: ShopifyProduct[];
}

export default function ShopContent({ products }: ShopContentProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('alle');
  const [sortBy, setSortBy] = useState<string>('default');

  // Alle einzigartigen Kategorien für Filter extrahieren
  const categories = useMemo(() => {
    const cats = products
      .map((p) => p.category?.name || p.productType)
      .filter((cat) => cat && cat.trim() !== '');
    return ['alle', ...Array.from(new Set(cats))];
  }, [products]);

  // Hilfsfunktion um Kategorie eines Produkts zu bekommen
  const getProductCategory = (product: ShopifyProduct) => {
    return product.category?.name || product.productType || 'Sonstiges';
  };

  // Gefilterte und sortierte Produkte
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Suchfilter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.productType.toLowerCase().includes(query) ||
          p.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // Kategoriefilter
    if (activeFilter !== 'alle') {
      result = result.filter((p) => getProductCategory(p) === activeFilter);
    }

    // Sortierung
    switch (sortBy) {
      case 'price-asc':
        result.sort(
          (a, b) =>
            parseFloat(a.priceRange.minVariantPrice.amount) -
            parseFloat(b.priceRange.minVariantPrice.amount)
        );
        break;
      case 'price-desc':
        result.sort(
          (a, b) =>
            parseFloat(b.priceRange.minVariantPrice.amount) -
            parseFloat(a.priceRange.minVariantPrice.amount)
        );
        break;
      case 'name-asc':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'name-desc':
        result.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case 'newest':
        result.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      default:
        break;
    }

    return result;
  }, [products, searchQuery, activeFilter, sortBy]);

  // Produkte nach Kategorie gruppieren für Überschriften
  const groupedProducts = useMemo(() => {
    if (activeFilter !== 'alle' || searchQuery.trim()) {
      // Bei aktivem Filter oder Suche: keine Gruppierung
      return null;
    }

    const groups: { [key: string]: ShopifyProduct[] } = {};
    filteredProducts.forEach((product) => {
      const category = getProductCategory(product);
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(product);
    });

    return groups;
  }, [filteredProducts, activeFilter, searchQuery]);

  return (
    <>
      {/* Such- und Filterleiste - Volle Breite */}
      <section className="shop-toolbar">
        <div className="toolbar-fullwidth">
          <div className="toolbar-row">
            {/* Suchleiste */}
            <div className="search-wrapper">
              <svg
                className="search-icon"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
              <input
                type="text"
                placeholder="Produkte suchen..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="search-clear"
                  aria-label="Suche löschen"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {/* Sortierung */}
            <div className="sort-wrapper">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                <option value="default">Sortierung</option>
                <option value="newest">Neueste zuerst</option>
                <option value="price-asc">Preis: Niedrig → Hoch</option>
                <option value="price-desc">Preis: Hoch → Niedrig</option>
                <option value="name-asc">Name: A → Z</option>
                <option value="name-desc">Name: Z → A</option>
              </select>
            </div>
          </div>

          {/* Filter-Buttons */}
          {categories.length > 1 && (
            <div className="filter-buttons">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={`filter-btn ${activeFilter === cat ? 'active' : ''}`}
                >
                  {cat === 'alle' ? 'Alle Produkte' : cat}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Ergebnis-Info - nur bei Suche oder Filter anzeigen */}
      {(searchQuery || activeFilter !== 'alle') && (
        <section className="shop-results-info">
          <div className="container">
            <p className="results-count">
              {filteredProducts.length} von {products.length} Produkten
              {searchQuery && ` für "${searchQuery}"`}
              {activeFilter !== 'alle' && ` in ${activeFilter}`}
            </p>
          </div>
        </section>
      )}

      {/* Produkte */}
      <section className="shop-products">
        <div className="container">
          {filteredProducts.length === 0 ? (
            <div className="shop-empty">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
              <h3>Keine Produkte gefunden</h3>
              <p>Versuche einen anderen Suchbegriff oder Filter.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveFilter('alle');
                }}
                className="reset-filters-btn"
              >
                Filter zurücksetzen
              </button>
            </div>
          ) : groupedProducts ? (
            // Gruppierte Darstellung mit Überschriften
            Object.entries(groupedProducts).map(([category, categoryProducts]) => (
              <div key={category} className="product-category">
                <h2 className="category-title">{category}</h2>
                <div className="products-grid">
                  {categoryProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </div>
            ))
          ) : (
            // Ungroupierte Darstellung bei Filter/Suche
            <div className="products-grid">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
