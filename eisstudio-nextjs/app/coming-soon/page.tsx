'use client';

import Link from 'next/link';

export default function ComingSoonPage() {
  return (
    <div className="login-page">
      {/* Film Grain */}
      <div className="film-grain"></div>

      {/* Decorative Elements */}
      <div className="login-decoration login-decoration-top">
        <span className="login-decoration-dot"></span>
        Coming Soon
      </div>

      <div className="login-decoration login-decoration-bottom">

      </div>

      {/* Container */}
      <div className="login-container">
        {/* Header Bar */}
        <div className="login-header">
          <div className="login-logo">
            <span className="login-logo-text">Coming Soon</span>
          </div>
          <div className="login-label"></div>
        </div>

        {/* Content */}
        <div className="login-content">
          <div>
            <h1 className="login-title">In Bearbeitung</h1>
            <p className="login-subtitle">
              Diese Website wird gerade erstellt.
            </p>
          </div>

        </div>

        {/* Footer with legal links */}
        <div className="login-footer coming-soon-footer">
          <Link href="/impressum" className="coming-soon-link">Impressum</Link>
          <span className="login-footer-dot">●</span>
          <Link href="/datenschutz" className="coming-soon-link">Datenschutz</Link>
        </div>
      </div>
    </div>
  );
}
