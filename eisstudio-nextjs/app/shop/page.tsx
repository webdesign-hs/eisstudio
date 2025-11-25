import { getProducts } from '@/lib/shopify';
import Navigation from '@/components/Navigation';
import { ShopContent, ShopFooter } from '@/components/shop';

export const metadata = {
  title: 'Shop | sitNeis',
  description: 'Entdecke unser handgemachtes Eis aus der Manufaktur.',
};

export default async function ShopPage() {
  const products = await getProducts(50);

  return (
    <>
      <Navigation />

      <main className="shop-page">
        {/* Hero Section */}
        <section className="shop-hero">
          <div className="container">
            <span className="shop-hero-badge">Shop</span>
            <h1>Unser Sortiment</h1>
            <p>Handgemachtes Eis aus der Manufaktur – direkt zu dir nach Hause</p>
          </div>
        </section>

        {/* Shop Content (Client Component mit Suche & Filter) */}
        <ShopContent products={products} />
      </main>

      <ShopFooter />
    </>
  );
}
