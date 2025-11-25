'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';

export default function HeroSection() {
  const [scrollTransform, setScrollTransform] = useState({ translateY: 0, opacity: 1, blur: 0 });
  const heroContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.pageYOffset;
      if (scrollY < window.innerHeight) {
        const scrollPercent = scrollY / window.innerHeight;
        const translateY = scrollPercent * -300;
        const opacity = 1 - scrollPercent * 0.4;
        const blur = scrollPercent * 2;

        setScrollTransform({ translateY, opacity, blur });
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section id="home" className="hero">
      <div
        ref={heroContentRef}
        className="hero-content"
        style={{
          transform: `translateY(${scrollTransform.translateY}px)`,
          opacity: scrollTransform.opacity,
          filter: `blur(${scrollTransform.blur}px)`,
        }}
      >
        <div className="hero-badge fade-in">
          <span className="badge-text">sitNeis Investigation</span>
        </div>

        <div className="hero-text fade-in">
          <h1 className="hero-title">
            <span className="title-line-1">sitNeis</span>
            <span className="title-line-2">Wo Eis zur Story wird.</span>
          </h1>
          <p className="hero-slogan">Investigativer Genuss seit 2024</p>

          <div className="hero-meta">
            <span className="meta-item">
              <i className="fas fa-map-marker-alt"></i> Standort: Klassifiziert
            </span>
            <span className="meta-divider">|</span>
            <span className="meta-item">
              <i className="fas fa-folder-open"></i> Aktive Fälle: 6
            </span>
            <span className="meta-divider">|</span>
            <span className="meta-item">
              <i className="fas fa-search"></i> Status: In Recherche
            </span>
          </div>
        </div>

        <div className="hero-cta fade-in">
          <Link
            href="/shop"
            className="cta-button-primary"
          >
            <span className="button-text">Fallakte öffnen</span>
            <span className="button-icon">→</span>
          </Link>
          <a href="#faelle" className="cta-button-secondary">
            <span className="button-text">Fälle durchsuchen</span>
          </a>
        </div>
      </div>
    </section>
  );
}
