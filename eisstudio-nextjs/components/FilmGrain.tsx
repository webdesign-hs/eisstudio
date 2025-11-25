'use client';

export default function FilmGrain() {
  return (
    <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-[1000] opacity-[0.03]">
      <div
        className="absolute -top-full -left-full w-[300%] h-[300%]"
        style={{
          background: `url('data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Cfilter id="noise"%3E%3CfeTurbulence baseFrequency="0.9" /%3E%3C/filter%3E%3Crect width="100" height="100" filter="url(%23noise)" /%3E%3C/svg%3E')`,
          animation: 'grain 8s steps(10) infinite',
        }}
      />
    </div>
  );
}
