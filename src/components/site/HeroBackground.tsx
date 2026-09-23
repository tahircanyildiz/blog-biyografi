export function HeroBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1440 800"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden
      >
        <defs>
          <filter id="hero-noise">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.85"
              numOctaves="2"
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
          </filter>
        </defs>

        <path
          d="M0,560 C 320,480 420,620 720,560 C 1020,500 1120,600 1440,540 L1440,800 L0,800 Z"
          fill="#18181b"
          opacity="0.6"
        />
        <path
          d="M0,620 C 300,580 480,680 760,600 C 1040,520 1200,660 1440,600 L1440,800 L0,800 Z"
          fill="#27272a"
          opacity="0.55"
        />
        <path
          d="M0,680 C 260,640 520,720 800,660 C 1080,600 1260,700 1440,660 L1440,800 L0,800 Z"
          fill="#f97316"
          opacity="0.05"
        />

        <rect width="1440" height="800" filter="url(#hero-noise)" opacity="0.03" />
      </svg>
    </div>
  );
}
