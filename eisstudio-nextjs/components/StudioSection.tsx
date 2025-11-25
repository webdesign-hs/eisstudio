'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';

const chapters = [
  {
    badge: 'KAPITEL I',
    image: '/img/acts/act1.png',
    year: '2024',
    title: 'Die Gründung',
    description:
      'Eine Idee nimmt Form an: Eis als Story erzählen. Nicht nur Geschmack, sondern Geschichten. In einem kleinen Studio entstand die Vision, jede Kreation wie einen investigativen Report zu behandeln.',
    tags: [
      { icon: 'fa-landmark', text: 'Origins' },
      { icon: 'fa-newspaper', text: 'Vision' },
    ],
  },
  {
    badge: 'KAPITEL II',
    image: '/img/acts/act2.png',
    year: 'Handwerk',
    title: 'Das Handwerk',
    description:
      'Wie Journalisten ihre Quellen prüfen, untersuchen wir jede Zutat. Unser Studio ist Redaktion und Labor zugleich – wo täglich neue Geschmacksgeschichten entstehen.',
    tags: [
      { icon: 'fa-flask', text: 'Recherche' },
      { icon: 'fa-lightbulb', text: 'Innovation' },
    ],
  },
  {
    badge: 'KAPITEL III',
    image: '/img/acts/act3.png',
    year: 'Heute',
    title: 'Heute',
    description:
      'sitNeis ist mehr als eine Eismanufaktur – es ist eine Story-Plattform. Mit einem Team aus Geschmacks-Reportern veröffentlichen wir täglich neue Fallberichte.',
    tags: [
      { icon: 'fa-clipboard-list', text: 'Berichte' },
      { icon: 'fa-bullseye', text: 'Mission' },
    ],
  },
];

export default function StudioSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cards = entry.target.querySelectorAll('.studio-card');
            cards.forEach((card, index) => {
              setTimeout(() => {
                card.classList.add('visible');
              }, index * 100);
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
    <section ref={sectionRef} id="studio" className="studio">
      <div className="container">
        <div className="section-header slide-up">
          <h2 className="section-title">Das Studio</h2>
          <p className="section-subtitle">Eine investigative Reportage in drei Kapiteln</p>
        </div>

        <div className="studio-grid">
          {chapters.map((chapter, index) => (
            <article key={index} className="studio-card fade-in-section">
              <div className="card-header">
                <span className="card-badge">{chapter.badge}</span>
                <div className="card-divider"></div>
              </div>

              <div className="card-image">
                <Image src={chapter.image} alt={chapter.title} fill />
                <div className="image-overlay">
                  <span className="overlay-year">{chapter.year}</span>
                </div>
              </div>

              <div className="card-content">
                <h3 className="card-title">{chapter.title}</h3>
                <p className="card-description">{chapter.description}</p>
                <div className="card-meta">
                  {chapter.tags.map((tag, tagIndex) => (
                    <span key={tagIndex} className="meta-tag">
                      <i className={`fas ${tag.icon}`}></i> {tag.text}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
