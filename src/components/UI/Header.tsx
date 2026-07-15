import React from 'react';
import { Search, Compass, HelpCircle } from 'lucide-react';

interface HeaderProps {
  onSearchClick: () => void;
  activeView: 'map' | 'quiz';
  onViewChange: (view: 'map' | 'quiz') => void;
}

export const Header: React.FC<HeaderProps> = ({
  onSearchClick,
  activeView,
  onViewChange,
}) => {
  return (
    <header className="py-5 px-6 sm:px-8 border-b border-cream-200 bg-white/80 backdrop-blur-xl flex items-center justify-between sticky top-0 z-40 select-none">
      
      {/* Brand Title */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-navy text-gold-100 border border-gold/30 rounded-xl flex items-center justify-center font-bold text-sm tracking-wider shadow-sm select-none">
          BH
        </div>
        <div>
          <h1 className="text-base sm:text-lg font-medium text-navy m-0 tracking-widest leading-none font-regal">
            THE BHARAT ATLAS
          </h1>
          <span className="text-[9px] font-bold text-gold-700 tracking-wider uppercase mt-1 block">
            A PREMIER GEOGRAPHIC GUIDE TO INDIA
          </span>
        </div>
      </div>

      {/* Navigation and Actions */}
      <div className="flex items-center gap-2 sm:gap-4">
        
        {/* Navigation Tabs */}
        <nav className="flex bg-cream-100 p-1 rounded-xl border border-cream-200">
          <button
            onClick={() => onViewChange('map')}
            className={`px-4.5 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeView === 'map'
                ? 'bg-white text-navy shadow-sm'
                : 'text-navy-600 hover:text-navy'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Explore Map</span>
          </button>
          <button
            onClick={() => onViewChange('quiz')}
            className={`px-4.5 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeView === 'quiz'
                ? 'bg-white text-navy shadow-sm'
                : 'text-navy-600 hover:text-navy'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Play Quiz</span>
          </button>
        </nav>

        {/* Global Search Button */}
        <button
          onClick={onSearchClick}
          className="p-2.5 bg-cream-100 hover:bg-cream-200 border border-cream-200 text-navy-600 hover:text-navy rounded-xl transition-all cursor-pointer"
          title="Search States or Cities"
        >
          <Search className="w-4 h-4" />
        </button>
      </div>

    </header>
  );
};
