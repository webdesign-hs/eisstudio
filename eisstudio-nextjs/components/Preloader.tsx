'use client';

import { useEffect, useState } from 'react';

const PRELOADER_SESSION_KEY = 'sitNeis_preloader_shown';

export default function Preloader() {
  const [isVisible, setIsVisible] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    // Check if preloader was already shown in this session
    const wasShown = sessionStorage.getItem(PRELOADER_SESSION_KEY);

    if (wasShown) {
      // Already shown this session, don't display
      setIsVisible(false);
      setShouldRender(false);
      return;
    }

    // First visit in this session - show preloader
    setShouldRender(true);
    setIsVisible(true);
    sessionStorage.setItem(PRELOADER_SESSION_KEY, 'true');

    // Add loading class to body
    document.body.classList.add('loading');

    // Start fade out after animation
    const fadeTimer = setTimeout(() => {
      setIsFading(true);
    }, 2000);

    // Remove preloader after fade out
    const removeTimer = setTimeout(() => {
      setIsVisible(false);
      document.body.classList.remove('loading');
    }, 2600); // 2000ms animation + 600ms fade

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!shouldRender || !isVisible) return null;

  return (
    <div
      className="fixed top-0 left-0 w-full h-full bg-[#121212] z-[10000] flex flex-col items-center justify-center gap-[30px]"
      style={{
        opacity: isFading ? 0 : 1,
        transition: 'opacity 0.6s ease-in-out',
        pointerEvents: isFading ? 'none' : 'auto',
      }}
    >
      <div
        className="hero-badge"
        style={{ animation: 'badgeFade 2s ease' }}
      >
        <span className="badge-text">sitNeis Investigation</span>
      </div>
      <div
        className="font-display text-[56px] font-black text-[#F7F4E9] tracking-[8px]"
        style={{ animation: 'textFade 2s ease' }}
      >
        sitNeis
      </div>
      <div
        className="font-display text-lg font-normal italic text-[#F2C23D] tracking-[2px]"
        style={{ animation: 'taglineFade 2s ease' }}
      >
        Wo Eis zur Story wird.
      </div>
    </div>
  );
}
