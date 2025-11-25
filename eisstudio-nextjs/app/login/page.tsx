'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const CORRECT_PASSWORD = 'filmeis2024';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if already logged in
    if (typeof window !== 'undefined' && sessionStorage.getItem('eisstudioLoggedIn') === 'true') {
      router.push('/');
    }
  }, [router]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (password === CORRECT_PASSWORD) {
      // Set session storage
      sessionStorage.setItem('eisstudioLoggedIn', 'true');

      // Smooth transition
      setIsAnimating(true);

      setTimeout(() => {
        router.push('/');
      }, 300);
    } else {
      // Show error
      setError(true);
      setPassword('');

      setTimeout(() => {
        setError(false);
      }, 3000);
    }
  };

  return (
    <div className="login-page">
      {/* Film Grain */}
      <div className="film-grain"></div>

      {/* Decorative Elements */}
      <div className="login-decoration login-decoration-top">
        <span className="login-decoration-dot"></span>
        Exklusiver Zugang
      </div>

      <div className="login-decoration login-decoration-bottom">
        Est. 2024
      </div>

      {/* Login Container */}
      <div
        className={`login-container ${isAnimating ? 'opacity-0 scale-95' : ''} ${error ? 'shake' : ''}`}
        style={{ transition: 'opacity 0.3s, transform 0.3s' }}
      >
        {/* Header Bar */}
        <div className="login-header">
          <div className="login-logo">
            <span className="login-logo-dot">●</span>
            <span className="login-logo-text">sitNeis</span>
          </div>
          <div className="login-label">LOGIN</div>
        </div>

        {/* Content */}
        <div className="login-content">
          <div>
            <div className="login-badge">Willkommen</div>
            <h1 className="login-title">Anmeldung</h1>
            <p className="login-subtitle">
              Gib dein Passwort ein, um auf den exklusiven Bereich zuzugreifen.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div>
              <label className="login-form-label">Passwort</label>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(false);
                }}
                placeholder="••••••••"
                required
                className="login-input"
              />
            </div>

            <button type="submit" className="login-button">
              <span>Einloggen</span>
              <span className="login-button-arrow">→</span>
            </button>

            {error && (
              <div className="login-error">
                <span>!</span>
                <span>Falsches Passwort. Bitte versuche es erneut.</span>
              </div>
            )}
          </form>
        </div>

        {/* Footer */}
        <div className="login-footer">
          <span>Die Eismanufaktur</span>
          <span className="login-footer-dot">●</span>
          <span>Handgemacht</span>
        </div>
      </div>
    </div>
  );
}
