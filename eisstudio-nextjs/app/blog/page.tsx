import { getBlogArticles } from '@/lib/shopify';
import Navigation from '@/components/Navigation';
import Image from 'next/image';
import Link from 'next/link';

export const metadata = {
  title: 'Reports – sitNeis',
  description: 'Geschmacks-Reportagen aus dem Studio. Investigative Berichte über unsere Zutaten und Geschichten.',
};

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('de-DE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default async function BlogPage() {
  const articles = await getBlogArticles(20);

  return (
    <div className="blog-page">
      <Navigation />

      {/* Hero */}
      <section className="blog-hero">
        <div className="container">
          <span className="blog-hero-badge">Investigativ</span>
          <h1>Reports</h1>
          <p>Geschmacks-Reportagen aus dem Studio</p>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="blog-articles">
        <div className="container">
          {articles.length === 0 ? (
            <div className="blog-empty">
              <p>Noch keine Reports vorhanden.</p>
              <p>Schau bald wieder vorbei!</p>
            </div>
          ) : (
            <div className="blog-grid">
              {articles.map((article, index) => {
                const isFeatured = index === 0;
                const category = article.tags[0] || 'Report';

                return (
                  <Link
                    key={article.id}
                    href={`/blog/${article.handle}`}
                    className={`blog-card ${isFeatured ? 'featured' : ''}`}
                  >
                    <div className="blog-card-image">
                      {article.image ? (
                        <Image
                          src={article.image.url}
                          alt={article.image.altText || article.title}
                          fill
                          sizes={isFeatured ? '(max-width: 768px) 100vw, 66vw' : '(max-width: 768px) 100vw, 33vw'}
                        />
                      ) : (
                        <div className="blog-card-placeholder" />
                      )}
                      {isFeatured && <span className="blog-card-badge">Featured</span>}
                    </div>

                    <div className="blog-card-content">
                      <span className="blog-card-category">{category}</span>
                      <h2 className="blog-card-title">{article.title}</h2>
                      {article.excerpt && (
                        <p className="blog-card-excerpt">{article.excerpt}</p>
                      )}
                      <div className="blog-card-meta">
                        <span className="blog-card-author">
                          {article.author?.name || 'sitNeis Team'}
                        </span>
                        <span className="blog-card-date">
                          {formatDate(article.publishedAt)}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
