import React from 'react';

export const AshokaEmblem: React.FC<{ className?: string }> = ({ className = 'w-16 h-24' }) => {
  return (
    <svg
      viewBox="0 0 100 150"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`${className} text-gold`}
    >
      {/* Crown / Top Line */}
      <path d="M 50 15 L 50 20" strokeWidth="1" />

      {/* Center Lion Head Silhouette */}
      <path d="M 40 25 C 38 20, 62 20, 60 25 C 60 28, 58 30, 58 35 C 58 38, 62 42, 60 46 C 58 48, 54 48, 50 50 C 46 48, 42 48, 40 46 C 38 42, 42 38, 42 35 C 42 30, 40 28, 40 25 Z" />
      {/* Center Lion Details */}
      <path d="M 45 28 C 45 28, 50 26, 55 28" /> {/* Eyebrows */}
      <path d="M 48 33 L 52 33 L 50 37 Z" fill="currentColor" /> {/* Nose */}
      <path d="M 46 41 C 48 43, 52 43, 54 41" /> {/* Mouth */}
      
      {/* Left Lion Head Silhouette */}
      <path d="M 24 38 C 22 34, 38 30, 41 38 C 41 41, 39 42, 38 46 C 37 49, 39 53, 36 55 C 34 56, 31 54, 28 54 C 25 53, 23 49, 24 46 C 25 43, 25 41, 24 38 Z" />
      {/* Left Lion Details */}
      <path d="M 28 42 L 30 44 L 27 46" />
      
      {/* Right Lion Head Silhouette */}
      <path d="M 76 38 C 78 34, 62 30, 59 38 C 59 41, 61 42, 62 46 C 63 49, 61 53, 64 55 C 66 56, 69 54, 72 54 C 75 53, 77 49, 76 46 C 75 43, 75 41, 76 38 Z" />
      {/* Right Lion Details */}
      <path d="M 72 42 L 70 44 L 73 46" />

      {/* Mane Textures (Stylized Curves) */}
      <path d="M 45 47 L 43 55 M 55 47 L 57 55" />
      <path d="M 33 50 L 32 58 M 67 50 L 68 58" />
      
      {/* Lion Bodies / Pillar Join */}
      <path d="M 35 55 L 35 85 L 65 85 L 65 55" />
      <path d="M 42 55 L 42 85 M 58 55 L 58 85 M 50 55 L 50 85" />
      
      {/* Abacus (Circular Base Platform) */}
      <rect x="25" y="85" width="50" height="15" rx="3" fill="none" strokeWidth="2" />
      
      {/* Dharma Chakra on Abacus */}
      <circle cx="50" cy="92.5" r="5.5" strokeWidth="1.2" />
      <circle cx="50" cy="92.5" r="1" fill="currentColor" />
      {/* Spokes */}
      <path d="M 50 87 L 50 98 M 44.5 92.5 L 55.5 92.5" strokeWidth="0.8" />
      <path d="M 46 88.5 L 54 96.5 M 46 96.5 L 54 88.5" strokeWidth="0.8" />

      {/* Left and Right Animals on Abacus (Stylized Outline Bull and Horse) */}
      <circle cx="34" cy="92.5" r="2.5" /> {/* Left animal representation */}
      <circle cx="66" cy="92.5" r="2.5" /> {/* Right animal representation */}

      {/* Bell-shaped Lotus Base */}
      <path d="M 28 100 C 28 100, 20 120, 30 125 C 38 129, 44 115, 50 120 C 56 115, 62 129, 70 125 C 80 120, 72 100, 72 100 Z" strokeWidth="1.5" />
      {/* Petal Flutes */}
      <path d="M 35 101 C 36 108, 38 116, 36 123" />
      <path d="M 50 101 L 50 119" />
      <path d="M 65 101 C 64 108, 62 116, 64 123" />

      {/* Base Pedestal (Plinth) */}
      <rect x="18" y="125" width="64" height="6" rx="1.5" fill="none" strokeWidth="1.5" />
      <line x1="15" y1="131" x2="85" y2="131" strokeWidth="2" />

      {/* Satyameva Jayate Devnagari Script Outline placeholder */}
      <path d="M 36 138 H 64 M 40 144 H 60 M 50 138 V 144" strokeWidth="0.8" opacity="0.6" />
    </svg>
  );
};
