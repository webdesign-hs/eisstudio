'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const cases = [
  {
    number: '001',
    status: 'Gelöst',
    statusClass: '',
    image: '/img/ice-cream/vanilla.png',
    title: 'Die Vanille-Verschwörung',
    teaser:
      'In den Tiefen von Kühlkammer 4 wurde eine Spur entdeckt: süß, cremig, verdächtig lecker.',
    location: 'Madagascar',
    tag: 'Classic',
  },
  {
    number: '002',
    status: 'Hot Case',
    statusClass: 'status-hot',
    image: '/img/ice-cream/chocolate.png',
    title: 'Chocolate – Dark Investigation',
    teaser: 'Bittere Wahrheiten, süße Enthüllungen. Unser Reporter war vor Ort in Ghana.',
    location: 'Ghana',
    tag: 'Intense',
  },
  {
    number: '003',
    status: 'Gelöst',
    statusClass: '',
    image: '/img/ice-cream/pistacio.png',
    title: 'Pistachio – The Green Case',
    teaser: 'Was sich in Siziliens Pistazienhainen versteckt, bleibt nicht lange verborgen.',
    location: 'Sizilien',
    tag: 'Premium',
  },
  {
    number: '004',
    status: 'Saisonal',
    statusClass: 'status-seasonal',
    image: '/img/ice-cream/strawberry.png',
    title: 'Erdbeer-Akte',
    teaser: 'Saisonale Spurensuche: Lokale Bauernhöfe, sonnenverwöhnte Erdbeeren, keine Kompromisse.',
    location: 'Regional',
    tag: 'Seasonal',
  },
  {
    number: '005',
    status: 'Gelöst',
    statusClass: '',
    image: '/img/ice-cream/caramel.png',
    title: 'Karamell Mysterium',
    teaser: 'Gebrannter Zucker unter Verdacht. Eine süße Angelegenheit mit dramatischem Finale.',
    location: 'Studio West',
    tag: 'Artisan',
  },
  {
    number: '006',
    status: 'Hot Case',
    statusClass: 'status-hot',
    image: '/img/ice-cream/lemon.png',
    title: 'Der Zitronen-Fall',
    teaser: 'Amalfi-Küste, sonnige Enthüllungen. Ein erfrischender Report mit säuerlichem Twist.',
    location: 'Amalfi',
    tag: 'Fresh',
  },
];

export default function FaelleSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cards = entry.target.querySelectorAll('.case-card');
            cards.forEach((card, index) => {
              setTimeout(() => {
                card.classList.add('visible');
              }, index * 50);
            });
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -100px 0px' }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="faelle" className="faelle">
      <div className="container">
        <div className="section-header slide-up">
          <h2 className="section-title">Die Fälle</h2>
          <p className="section-subtitle">
            Unsere investigativen Eissorten – Jeder Fall ein Geschmackserlebnis
          </p>
        </div>

        <div className="case-grid">
          {cases.map((caseItem, index) => (
            <article key={index} className="case-card fade-in-section">
              <div className="case-header">
                <span className="case-number">FALL #{caseItem.number}</span>
                <span className={`case-status ${caseItem.statusClass}`}>
                  {caseItem.status}
                </span>
              </div>

              <div className="case-image">
                <Image src={caseItem.image} alt={caseItem.title} fill />
                <div className="case-overlay">
                  <span className="overlay-text">Fallakte öffnen</span>
                </div>
              </div>

              <div className="case-content">
                <h3 className="case-title">{caseItem.title}</h3>
                <p className="case-teaser">{caseItem.teaser}</p>
                <div className="case-meta">
                  <span className="meta-item">
                    <i className="fas fa-map-marker-alt"></i> {caseItem.location}
                  </span>
                  <span className="meta-item">
                    <i className="fas fa-tag"></i> {caseItem.tag}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="faelle-cta">
          <Link
            href="/shop"
            className="cta-investigate"
          >
            <span>Alle Fälle im Shop</span>
            <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
