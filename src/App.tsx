import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Header } from './components/UI/Header';
import { IndiaMap } from './components/Map/IndiaMap';
import { DetailsDrawer } from './components/UI/DetailsDrawer';
import { SearchModal } from './components/UI/SearchModal';
import { QuizGame } from './components/UI/QuizGame';
import { FlagSection } from './components/UI/FlagSection';
import { AshokaEmblem } from './components/UI/AshokaEmblem';
import { Compass, GraduationCap } from 'lucide-react';
import { educationalData } from './data/educationalData';

export const App: React.FC = () => {
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeView, setActiveView] = useState<'map' | 'quiz'>('map');

  const handleSelectResult = (stateName: string, cityName: string | null) => {
    setSelectedState(stateName);
    setSelectedCity(cityName);
  };

  return (
    <div className="min-h-screen bg-[#fcfbf8] flex flex-col font-sans transition-colors duration-300">
      
      {/* Top Header Navigation */}
      <Header
        onSearchClick={() => setIsSearchOpen(true)}
        activeView={activeView}
        onViewChange={setActiveView}
      />

      {/* Main Content Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-8">
        
        {activeView === 'map' ? (
          <div className="space-y-8">
            
            {/* Map & Sidebar Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Map Canvas Frame */}
              <div className="lg:col-span-2 flex flex-col">
                <IndiaMap
                  selectedState={selectedState}
                  onSelectState={setSelectedState}
                  selectedCity={selectedCity}
                  onSelectCity={setSelectedCity}
                />
              </div>

              {/* Sidebar Information Portal */}
              <div className="flex flex-col gap-6">
                
                {/* National Profile Card */}
                <div className="bg-white border border-cream-200 rounded-3xl p-6 shadow-sm select-none transition-colors duration-300">
                  <div className="flex items-center gap-3.5 border-b border-cream-100 pb-4.5">
                    <div className="p-2.5 bg-navy/5 text-navy rounded-xl">
                      <GraduationCap className="w-5.5 h-5.5 text-gold-700" />
                    </div>
                    <div>
                      <span className="text-[9px] font-extrabold text-gold-700 tracking-widest uppercase block">
                        National Identity
                      </span>
                      <h2 className="text-base font-medium text-navy font-regal tracking-wider mt-0.5">
                        Republic of India
                      </h2>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3.5 mt-5">
                    <div className="p-3 bg-cream-50/50 border border-cream-100 rounded-2xl">
                      <span className="text-[9px] font-bold text-navy-600 uppercase tracking-wider">
                        Capital
                      </span>
                      <div className="text-xs font-bold text-navy mt-0.5">
                        New Delhi
                      </div>
                    </div>
                    <div className="p-3 bg-cream-50/50 border border-cream-100 rounded-2xl">
                      <span className="text-[9px] font-bold text-navy-600 uppercase tracking-wider">
                        Total Area
                      </span>
                      <div className="text-xs font-bold text-navy mt-0.5">
                        3.28M km²
                      </div>
                    </div>
                    <div className="p-3 bg-cream-50/50 border border-cream-100 rounded-2xl">
                      <span className="text-[9px] font-bold text-navy-600 uppercase tracking-wider">
                        Population
                      </span>
                      <div className="text-xs font-bold text-navy mt-0.5">
                        1.4 Billion+
                      </div>
                    </div>
                    <div className="p-3 bg-cream-50/50 border border-cream-100 rounded-2xl">
                      <span className="text-[9px] font-bold text-navy-600 uppercase tracking-wider">
                        Structure
                      </span>
                      <div className="text-xs font-bold text-navy mt-0.5">
                        28 States / 8 UTs
                      </div>
                    </div>
                  </div>

                  {/* High Quality National Emblem Section */}
                  <div className="mt-5 p-5 bg-cream-50 border border-cream-200 rounded-2xl flex gap-4 items-center">
                    <div className="w-12 h-18 bg-white border border-cream-200/80 rounded-xl flex items-center justify-center p-1.5 shrink-0 shadow-sm">
                      <AshokaEmblem className="w-full h-full" />
                    </div>
                    <div className="space-y-1">
                      <div className="text-[9px] font-extrabold text-gold-700 tracking-widest uppercase">
                        State Emblem of India
                      </div>
                      <p className="text-[11px] leading-relaxed text-navy-600 font-medium">
                        Adapted from the Lion Capital of Ashoka at Sarnath, depicting three visible lions representing Power, Courage, and Pride, atop an abacus with the Ashoka Chakra.
                      </p>
                    </div>
                  </div>

                </div>

                {/* State Explorer Selector */}
                <div className="bg-white border border-cream-200 rounded-3xl p-6 shadow-sm flex-1 flex flex-col transition-colors duration-300">
                  <h3 className="text-xs font-extrabold text-navy-600 uppercase tracking-wider flex items-center gap-1.5 mb-4 select-none">
                    <Compass className="w-4 h-4 text-gold-700" /> State Explorer Directory
                  </h3>

                  <div className="flex-1 overflow-y-auto max-h-[340px] pr-1 space-y-1.5 scrollbar-thin">
                    {Object.keys(educationalData)
                      .sort()
                      .map((stateName) => {
                        const isSelected = selectedState === stateName;
                        return (
                          <button
                            key={stateName}
                            onClick={() => {
                              setSelectedState(stateName);
                              setSelectedCity(null);
                            }}
                            className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex justify-between items-center cursor-pointer ${
                              isSelected
                                ? 'bg-gold-50 text-gold-700 border border-gold-100'
                                : 'bg-cream-50/50 hover:bg-cream-100 text-navy-600 border border-transparent'
                            }`}
                          >
                            <span>{stateName}</span>
                            <span className="text-[10px] text-gold-700 font-medium font-mono">
                              {educationalData[stateName].capital}
                            </span>
                          </button>
                        );
                      })}
                  </div>
                </div>

              </div>

            </div>

            {/* National Flag Section */}
            <FlagSection />
            
          </div>
        ) : (
          /* Geography Quiz Panel */
          <div className="max-w-3xl w-full mx-auto my-4">
            <QuizGame />
          </div>
        )}

      </main>

      {/* Minimalist Professional Footer */}
      <footer className="py-6 px-8 border-t border-cream-200 bg-white/50 text-center select-none text-[11px] font-bold text-navy-600 tracking-widest mt-auto">
        DESIGNED & DEVELOPED BY <span className="text-gold font-extrabold">AYVALOR</span>
      </footer>

      {/* Global Search Overlay Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelect={handleSelectResult}
      />

      {/* Details Slide-out Drawer */}
      <AnimatePresence>
        {selectedState && (
          <DetailsDrawer
            selectedState={selectedState}
            selectedCity={selectedCity}
            onCloseCity={() => setSelectedCity(null)}
            onCloseState={() => setSelectedState(null)}
          />
        )}
      </AnimatePresence>
      
    </div>
  );
};

export default App;
