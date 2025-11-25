'use client';

import { useEffect, useState } from 'react';

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.pageYOffset > 50);

      // Update active section
      const sections = document.querySelectorAll('section[id]');
      const scrollPosition = window.pageYOffset + 100;

      sections.forEach((section) => {
        const sectionTop = (section as HTMLElement).offsetTop;
        const sectionHeight = (section as HTMLElement).offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          setActiveSection(sectionId || '');
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const smoothScroll = (target: string) => {
    const targetSection = document.querySelector(target);
    if (targetSection) {
      const isMobile = window.innerWidth <= 768;
      let offset = 0;

      if (target === '#home') offset = 0;
      else if (target === '#studio') offset = isMobile ? -20 : 25;
      else if (target === '#faelle') offset = isMobile ? -10 : 45;
      else if (target === '#reports') offset = isMobile ? 10 : 55;
      else if (target === '#kontakt') offset = isMobile ? 0 : 65;

      const targetPosition = (targetSection as HTMLElement).offsetTop + offset;
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth',
      });

      setMenuOpen(false);
    }
  };

  const navLinks = [
    { href: '#home', label: 'Home' },
    { href: '#studio', label: 'Das Studio' },
    { href: '#faelle', label: 'Fälle' },
    { href: '#reports', label: 'Reports' },
    { href: '#kontakt', label: 'Kontakt' },
  ];

  return (
    <nav className={`navigation ${scrolled ? 'scrolled' : ''} ${menuOpen ? 'menu-open' : ''}`}>
      <div className="nav-container">
        <div className="nav-logo">
          sitNeis
        </div>

        <ul className={`nav-menu ${menuOpen ? 'active' : ''}`}>
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  smoothScroll(link.href);
                }}
                className={`nav-link ${activeSection === link.href.slice(1) ? 'active' : ''}`}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div
          className={`nav-hamburger ${menuOpen ? 'active' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span />
          <span />
          <span />
        </div>
      </div>
    </nav>
  );
}
