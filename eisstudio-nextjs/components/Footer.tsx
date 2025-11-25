'use client';

export default function Footer() {
  const smoothScroll = (target: string) => {
    const targetSection = document.querySelector(target);
    if (targetSection) {
      const targetPosition = (targetSection as HTMLElement).offsetTop;
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <footer id="kontakt" className="footer-contact">
      <div className="container">
        <div className="footer-header">
          <h2 className="section-title">Kontakt & Informationen</h2>
          <p className="section-subtitle">Schreiben Sie uns Ihre Geschichte</p>
        </div>

        <div className="footer-grid">
          <div className="footer-info-group">
            <div className="info-card">
              <div className="info-icon">
                <i className="fas fa-map-marker-alt"></i>
              </div>
              <h3 className="info-title">Besuchen Sie uns</h3>
              <p className="info-text">
                sitNeis
                <br />
                Investigative Straße 42
                <br />
                10117 Berlin
              </p>
            </div>

            <div className="info-card">
              <div className="info-icon">
                <i className="fas fa-clock"></i>
              </div>
              <h3 className="info-title">Öffnungszeiten</h3>
              <p className="info-text">
                Mo – Fr: 11:00 – 20:00
                <br />
                Sa – So: 10:00 – 21:00
              </p>
            </div>

            <div className="info-card">
              <div className="info-icon">
                <i className="fas fa-envelope"></i>
              </div>
              <h3 className="info-title">Kontakt</h3>
              <p className="info-text">
                <a href="mailto:hello@sitneis.de">hello@sitneis.de</a>
                <br />
                <a href="tel:+493012345678">+49 30 123 456 78</a>
              </p>
            </div>
          </div>

          <div className="footer-brand-section">
            <div className="footer-logo-large">sitNeis</div>
            <p className="footer-tagline">Wo Eis zur Story wird.</p>
            <p className="footer-subtitle">sitNeis – Investigativer Genuss seit 2024</p>

            <nav className="footer-nav">
              {['#home', '#studio', '#faelle', '#reports'].map((href) => (
                <a
                  key={href}
                  href={href}
                  onClick={(e) => {
                    e.preventDefault();
                    smoothScroll(href);
                  }}
                  className="footer-nav-link"
                >
                  {href === '#home'
                    ? 'Home'
                    : href === '#studio'
                    ? 'Das Studio'
                    : href === '#faelle'
                    ? 'Fälle'
                    : 'Reports'}
                </a>
              ))}
            </nav>

            <div className="social-links">
              <a href="#" aria-label="Instagram" className="social-link">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" aria-label="Facebook" className="social-link">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" aria-label="Twitter" className="social-link">
                <i className="fab fa-twitter"></i>
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-legal">
            <a href="#">Impressum</a>
            <span>|</span>
            <a href="#">Datenschutz</a>
            <span>|</span>
            <a href="#">AGB</a>
          </div>
          <p>&copy; 2024 sitNeis. Alle Rechte vorbehalten.</p>
        </div>
      </div>
    </footer>
  );
}
