import React from 'react';
import { Calendar, ShieldCheck } from 'lucide-react';

export const FlagSection: React.FC = () => {
  return (
    <div className="bg-white border border-cream-200 rounded-3xl p-8 shadow-sm transition-colors duration-300">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8 border-b border-cream-100 pb-6">
        <div>
          <span className="text-[9px] font-extrabold text-gold-700 tracking-widest uppercase block">
            National Symbolism
          </span>
          <h2 className="text-2xl font-medium text-navy tracking-wide font-regal mt-1 select-none">
            The Indian National Flag
          </h2>
          <p className="text-xs text-navy-600 mt-1 font-medium">
            Representing the sovereignty, pride, and heritage of a diverse nation.
          </p>
        </div>

        {/* Flag Vector SVG */}
        <div className="w-40 h-24 shadow-md rounded-lg overflow-hidden border border-cream-200 shrink-0">
          <svg viewBox="0 0 300 200" className="w-full h-full">
            {/* Saffron Band */}
            <rect x="0" y="0" width="300" height="66.6" fill="#FF9933" />
            {/* White Band */}
            <rect x="0" y="66.6" width="300" height="66.6" fill="#FFFFFF" />
            {/* Green Band */}
            <rect x="0" y="133.2" width="300" height="66.6" fill="#138808" />
            
            {/* Ashoka Chakra */}
            <g transform="translate(150, 100)">
              <circle cx="0" cy="0" r="24" fill="none" stroke="#000080" strokeWidth="2.2" />
              <circle cx="0" cy="0" r="4.5" fill="#000080" />
              {/* Draw 24 Spokes */}
              {Array.from({ length: 24 }).map((_, idx) => (
                <line
                  key={idx}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="-24"
                  stroke="#000080"
                  strokeWidth="1.2"
                  transform={`rotate(${(360 / 24) * idx})`}
                />
              ))}
            </g>
          </svg>
        </div>
      </div>

      {/* Flag Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left Side: History Card */}
        <div className="p-5 bg-cream-50/50 border border-cream-100 rounded-2xl flex gap-4">
          <div className="p-3 bg-navy/5 text-navy rounded-xl shrink-0 h-fit">
            <Calendar className="w-5 h-5 text-gold-700" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-xs font-bold text-navy uppercase tracking-wider">
              History & Design
            </h3>
            <p className="text-xs text-navy-600 leading-relaxed font-medium">
              The flag was originally designed by the legendary freedom fighter <strong className="text-navy font-bold">Pingali Venkayya</strong>. It was officially adopted by the Constituent Assembly on <strong className="text-navy font-bold">July 22, 1947</strong>, just days before India's independence from British rule.
            </p>
          </div>
        </div>

        {/* Right Side: Symbolism Card */}
        <div className="p-5 bg-saffron-50/20 border border-saffron-100/50 rounded-2xl flex gap-4">
          <div className="p-3 bg-saffron-50/80 text-saffron rounded-xl shrink-0 h-fit">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-saffron uppercase tracking-wider">
              Color Symbolism
            </h3>
            <div className="grid grid-cols-1 gap-2.5 text-xs">
              <div className="flex gap-2 items-start">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF9933] mt-1 shrink-0" />
                <span className="text-navy-600 font-medium leading-relaxed">
                  <strong className="text-navy font-bold">Saffron (Kesari)</strong> represents strength, courage, and sacrifice.
                </span>
              </div>
              <div className="flex gap-2 items-start">
                <span className="w-2.5 h-2.5 rounded-full bg-neutral-200 border border-neutral-400 mt-1 shrink-0" />
                <span className="text-navy-600 font-medium leading-relaxed">
                  <strong className="text-navy font-bold">White</strong> represents peace, truth, and purity, adorned with the navy-blue 24-spoke Ashoka Chakra representing the wheel of law and righteousness.
                </span>
              </div>
              <div className="flex gap-2 items-start">
                <span className="w-2.5 h-2.5 rounded-full bg-[#138808] mt-1 shrink-0" />
                <span className="text-navy-600 font-medium leading-relaxed">
                  <strong className="text-navy font-bold">Green</strong> represents fertility, growth, and auspiciousness of the soil.
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
