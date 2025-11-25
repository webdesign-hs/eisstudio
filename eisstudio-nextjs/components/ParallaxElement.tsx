'use client';

import { useEffect, useState } from 'react';

export default function ParallaxElement() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const targetX = (e.clientX - window.innerWidth / 2) * 0.02;
      const targetY = (e.clientY - window.innerHeight / 2) * 0.02;
      setPosition({ x: targetX, y: targetY });
    };

    const handleScroll = () => {
      setScrollY(window.pageYOffset);
    };

    if (window.innerWidth > 768) {
      window.addEventListener('mousemove', handleMouseMove);
    }
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const translateY = scrollY * -0.3;
  const scale = 1 + scrollY * 0.0002;
  const opacity = Math.max(0.3, 0.5 - scrollY * 0.0005);

  return (
    <div
      className="fixed top-1/2 right-[10%] w-[300px] h-[300px] pointer-events-none z-10 -translate-y-1/2 transition-transform duration-100 ease-out md:block hidden"
      style={{
        transform: `translate(${position.x}px, calc(-50% + ${position.y}px + ${translateY}px)) scale(${scale})`,
      }}
    >
      <div
        className="w-full h-full rounded-full blur-[80px]"
        style={{
          background: `radial-gradient(circle at 30% 30%, #FDE2E4 0%, #CDE8F6 50%, rgba(205, 232, 246, 0.2) 100%)`,
          opacity: opacity,
          animation: 'float 6s ease-in-out infinite',
        }}
      />
    </div>
  );
}
