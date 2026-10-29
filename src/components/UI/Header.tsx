import React from 'react';
import { Search, Compass, HelpCircle } from 'lucide-react';

interface HeaderProps {
  onSearchClick: () => void;
  activeView: 'map' | 'quiz';
  onViewChange: (view: 'map' | 'quiz') => void;
}

export const Header: React.FC<HeaderProps> = ({ onSearchClick, activeView, onViewChange }) => (
  <header className="sticky top-0 z-40 border-b border-cream-200 bg-white/95 px-3 py-3 sm:px-6 sm:py-4 lg:px-8 flex flex-wrap items-center justify-between gap-3">
    <div className="flex items-center gap-2 sm:gap-3 min-w-0">
      <div aria-hidden="true" className="hidden sm:flex w-10 h-10 shrink-0 bg-navy text-gold-100 border border-gold/30 rounded-xl items-center justify-center font-bold text-sm shadow-sm">BH</div>
      <div className="min-w-0">
        <h1 className="text-sm sm:text-lg font-medium text-navy m-0 tracking-wide leading-tight font-regal">THE BHARAT ATLAS</h1>
        <p className="hidden md:block text-xs font-semibold text-gold-700 tracking-wide uppercase mt-1">A geographic guide to India</p>
      </div>
    </div>
    <div className="flex shrink-0 items-center gap-2 sm:gap-3">
      <nav aria-label="Main navigation" className="flex bg-cream-100 p-1 rounded-xl border border-cream-200">
        <button type="button" onClick={() => onViewChange('map')} aria-label="Explore map" aria-current={activeView === 'map' ? 'page' : undefined} title="Explore map"
          className={`min-w-11 min-h-11 px-3 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-700 ${activeView === 'map' ? 'bg-white text-navy shadow-sm' : 'text-navy-600 hover:text-navy'}`}>
          <Compass className="w-5 h-5 shrink-0" aria-hidden="true" /><span className="hidden sm:inline">Explore map</span>
        </button>
        <button type="button" onClick={() => onViewChange('quiz')} aria-label="Play quiz" aria-current={activeView === 'quiz' ? 'page' : undefined} title="Play quiz"
          className={`min-w-11 min-h-11 px-3 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-700 ${activeView === 'quiz' ? 'bg-white text-navy shadow-sm' : 'text-navy-600 hover:text-navy'}`}>
          <HelpCircle className="w-5 h-5 shrink-0" aria-hidden="true" /><span className="hidden sm:inline">Play quiz</span>
        </button>
      </nav>
      <button type="button" onClick={onSearchClick} aria-label="Search states or cities" aria-haspopup="dialog" title="Search states or cities"
        className="w-11 h-11 inline-flex items-center justify-center bg-cream-100 hover:bg-cream-200 border border-cream-200 text-navy-600 hover:text-navy rounded-xl transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-700">
        <Search className="w-5 h-5" aria-hidden="true" />
      </button>
    </div>
  </header>
);
