import { getBlogArticle, getBlogArticles } from '@/lib/shopify';
import { ShopNavigation } from '@/components/shop';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ handle: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params;
  const article = await getBlogArticle(handle);

  if (!article) {
    return { title: 'Artikel nicht gefunden – sitNeis' };
  }

  return {
    title: `${article.title} – sitNeis Reports`,
    description: article.excerpt || `Lesen Sie "${article.title}" auf sitNeis Reports.`,
  };
}

export async function generateStaticParams() {
  const articles = await getBlogArticles(50);
  return articles.map((article) => ({ handle: article.handle }));
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('de-DE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default async function BlogArticlePage({ params }: Props) {
  const { handle } = await params;
  const article = await getBlogArticle(handle);

  if (!article) {
    notFound();
  }

  const category = article.tags[0] || 'Report';

  return (
    <div className="article-page">
      <ShopNavigation />

      {/* Breadcrumb */}
      <div className="article-breadcrumb">
        <div className="container">
          <Link href="/blog">← Zurück zu Reports</Link>
        </div>
      </div>

      {/* Article Header */}
      <header className="article-header">
        <div className="container">
          <span className="article-category">{category}</span>
          <h1 className="article-title">{article.title}</h1>
          <div className="article-meta">
            <span className="article-author">
              Von {article.author?.name || 'sitNeis Team'}
            </span>
            <span className="article-divider">|</span>
            <span className="article-date">{formatDate(article.publishedAt)}</span>
          </div>
        </div>
      </header>

      {/* Featured Image */}
      {article.image && (
        <div className="article-image">
          <div className="container">
            <div className="article-image-wrapper">
              <Image
                src={article.image.url}
                alt={article.image.altText || article.title}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 900px"
              />
            </div>
          </div>
        </div>
      )}

      {/* Article Content */}
      <article className="article-content">
        <div className="container">
          <div
            className="article-body"
            dangerouslySetInnerHTML={{ __html: article.contentHtml }}
          />
        </div>
      </article>

      {/* Tags */}
      {article.tags.length > 0 && (
        <div className="article-tags">
          <div className="container">
            <div className="tags-list">
              {article.tags.map((tag) => (
                <span key={tag} className="tag">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Back to Blog */}
      <div className="article-footer">
        <div className="container">
          <Link href="/blog" className="back-to-blog">
            ← Alle Reports ansehen
          </Link>
        </div>
      </div>
    </div>
  );
}
