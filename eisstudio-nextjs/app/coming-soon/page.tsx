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
        Est. 2024
      </div>

      {/* Container */}
      <div className="login-container">
        {/* Header Bar */}
        <div className="login-header">
          <div className="login-logo">
            <span className="login-logo-dot">●</span>
            <span className="login-logo-text">sitNeis</span>
          </div>
          <div className="login-label">COMING SOON</div>
        </div>

        {/* Content */}
        <div className="login-content">
          <div>
            <div className="login-badge">In Kürze</div>
            <h1 className="login-title">Wir arbeiten daran</h1>
            <p className="login-subtitle">
              Unsere neue Website ist bald fertig. Investigativer Genuss erwartet dich.
            </p>
          </div>

          {/* Ice cream icon */}
          <div className="coming-soon-icon">
            <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M32 4C24.268 4 18 10.268 18 18v2h28v-2c0-7.732-6.268-14-14-14z" fill="#F2C23D"/>
              <path d="M18 20h28v8c0 2.21-1.79 4-4 4H22c-2.21 0-4-1.79-4-4v-8z" fill="#F7F4E9"/>
              <path d="M24 32l8 28 8-28H24z" fill="#D4A574"/>
            </svg>
          </div>

          {/* Social hint */}
          <p className="coming-soon-hint">
            Folge uns für Updates
          </p>
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
