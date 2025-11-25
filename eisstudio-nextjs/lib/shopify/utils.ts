// Utility Functions für Shopify

/**
 * Formatiert einen Preis mit Währungssymbol
 */
export function formatPrice(amount: string, currencyCode: string): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: currencyCode,
  }).format(parseFloat(amount));
}

/**
 * Kombiniert CSS-Klassen
 */
export function classNames(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Erstellt eine URL-sichere Version eines Strings
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[äÄ]/g, 'ae')
    .replace(/[öÖ]/g, 'oe')
    .replace(/[üÜ]/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/**
 * Kürzt Text auf eine bestimmte Länge
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

/**
 * Prüft ob ein Produkt im Sale ist
 */
export function isOnSale(price: string, compareAtPrice: string | null): boolean {
  if (!compareAtPrice) return false;
  return parseFloat(compareAtPrice) > parseFloat(price);
}

/**
 * Berechnet den Rabatt in Prozent
 */
export function getDiscountPercentage(price: string, compareAtPrice: string): number {
  const priceNum = parseFloat(price);
  const compareNum = parseFloat(compareAtPrice);
  if (compareNum <= priceNum) return 0;
  return Math.round(((compareNum - priceNum) / compareNum) * 100);
}
