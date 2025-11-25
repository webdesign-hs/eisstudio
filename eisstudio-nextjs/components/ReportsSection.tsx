import { getBlogArticles } from '@/lib/shopify';
import Image from 'next/image';
import Link from 'next/link';

// Fallback-Daten falls keine Shopify-Artikel vorhanden
const fallbackReports = [
  {
    handle: 'vanille-skandal',
    featured: true,
    image: '/img/featured.jpg',
    category: 'Investigation',
    title: 'Der Vanille-Skandal: Eine süße Verschwörung',
    excerpt:
      'Unsere Reporter deckten auf: Nicht alle Vanille ist gleich. Eine Expedition nach Madagascar enthüllt, was wirklich in deiner Kugel steckt.',
    author: 'The Reporter',
    date: '12. März 2024',
  },
  {
    handle: 'ghana-expedition',
    featured: false,
    image: '/img/chocolate.jpg',
    category: 'Field Report',
    title: 'Ghana-Expedition: Die Wahrheit über Schokolade',
    excerpt: 'Unser Culinary Explorer reiste zu den Kakaoplantagen – und fand mehr als nur Bohnen.',
    author: 'Culinary Explorer',
    date: '5. März 2024',
  },
  {
    handle: 'pistazien-raetsel',
    featured: false,
    image: '/img/pistachio.jpg',
    category: 'Mystery',
    title: 'Das Pistazien-Rätsel aus Sizilien',
    excerpt:
      'Warum sind manche Pistazien grün, andere nicht? Eine investigative Reise ins Herz Siziliens.',
    author: 'Flavor Mystery',
    date: '28. Feb. 2024',
  },
  {
    handle: 'regionale-bauernhoefe',
    featured: false,
    image: '/img/local.jpg',
    category: 'Local Story',
    title: 'Regionale Bauernhöfe: Unsere Quellen vor der Tür',
    excerpt:
      'Erdbeeren aus Brandenburg, Milch aus Bayern. Wie lokale Partnerschaften unseren Geschmack prägen.',
    author: 'The Reporter',
    date: '20. Feb. 2024',
  },
  {
    handle: 'tag-im-studio',
    featured: false,
    image: '/img/artisan.jpg',
    category: 'Behind the Scenes',
    title: 'Ein Tag im Studio: Wie Eis zur Story wird',
    excerpt: '24 Stunden hinter den Kulissen. Von der ersten Idee bis zur fertigen Kugel.',
    author: 'Studio Team',
    date: '15. Feb. 2024',
  },
];

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('de-DE', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default async function ReportsSection() {
  // Versuche Artikel von Shopify zu laden
  let articles: Awaited<ReturnType<typeof getBlogArticles>> = [];

  try {
    articles = await getBlogArticles(5);
  } catch (error) {
    console.error('Failed to fetch blog articles:', error);
  }

  // Wenn keine Artikel, nutze Fallback
  const useFallback = articles.length === 0;

  return (
    <section id="reports" className="reports">
      <div className="container">
        <div className="section-header slide-up">
          <h2 className="section-title">Reports</h2>
          <p className="section-subtitle">Geschmacks-Reportagen aus dem Studio</p>
        </div>

        <div className="reports-grid">
          {useFallback ? (
            // Fallback: Statische Daten
            fallbackReports.map((report, index) => (
              <article
                key={index}
                className={`report-card fade-in-section ${report.featured ? 'featured' : ''}`}
              >
                <div className="report-image">
                  <Image src={report.image} alt={report.title} fill />
                  {report.featured && <span className="report-badge">Featured</span>}
                </div>

                <div className="report-content">
                  <span className="report-category">{report.category}</span>
                  <h3 className="report-title">{report.title}</h3>
                  <p className="report-excerpt">{report.excerpt}</p>
                  <div className="report-meta">
                    <span className="report-author">{report.author}</span>
                    <span className="report-date">{report.date}</span>
                  </div>
                </div>
              </article>
            ))
          ) : (
            // Shopify-Artikel
            articles.map((article, index) => {
              const isFeatured = index === 0;
              const category = article.tags[0] || 'Report';

              return (
                <Link
                  key={article.id}
                  href={`/blog/${article.handle}`}
                  className={`report-card fade-in-section ${isFeatured ? 'featured' : ''}`}
                >
                  <div className="report-image">
                    {article.image ? (
                      <Image
                        src={article.image.url}
                        alt={article.image.altText || article.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        style={{ objectFit: 'cover' }}
                      />
                    ) : (
                      <div className="report-placeholder" />
                    )}
                    {isFeatured && <span className="report-badge">Featured</span>}
                  </div>

                  <div className="report-content">
                    <span className="report-category">{category}</span>
                    <h3 className="report-title">{article.title}</h3>
                    {article.excerpt && <p className="report-excerpt">{article.excerpt}</p>}
                    <div className="report-meta">
                      <span className="report-author">{article.author?.name || 'sitNeis Team'}</span>
                      <span className="report-date">{formatDate(article.publishedAt)}</span>
                    </div>
                  </div>
                </Link>
              );
            })
          )}
        </div>

        {/* Link zur Blog-Seite */}
        <div className="reports-cta">
          <Link href="/blog" className="cta-investigate">
            Alle Reports ansehen <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
