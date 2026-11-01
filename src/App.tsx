import React, { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { Header } from './components/UI/Header';
import { IndiaMap } from './components/Map/IndiaMap';
import { DetailsDrawer } from './components/UI/DetailsDrawer';
import { SearchModal } from './components/UI/SearchModal';
const QuizGame = lazy(() => import('./components/UI/QuizGame').then(module => ({ default: module.QuizGame })));
import { FlagSection } from './components/UI/FlagSection';
import { AshokaEmblem } from './components/UI/AshokaEmblem';
import { Compass, GraduationCap } from 'lucide-react';
import { educationalData } from './data/educationalData';
import { CITY_DIRECTORY_SOURCE, loadCityDirectory, type CityLocation } from './data/cities';

const stateNames = Object.keys(educationalData).sort();

export const App: React.FC = () => {
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeView, setActiveView] = useState<'map' | 'quiz'>('map');

  const [cityDirectory, setCityDirectory] = useState<CityLocation[]>([]);
  const [cityStatus, setCityStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [cityAttempt, setCityAttempt] = useState(0);
  const mapSection = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  useEffect(() => {
    let active = true;
    setCityStatus('loading');
    loadCityDirectory().then(cities => {
      if (active) { setCityDirectory(cities); setCityStatus('ready'); }
    }).catch(() => { if (active) setCityStatus('error'); });
    return () => { active = false; };
  }, [cityAttempt]);

  const selectState = useCallback((name: string | null) => {
    setSelectedState(name);
    setSelectedCity(null);
  }, []);
  // Directory/search can be below the map or in the quiz view on a phone.
  useEffect(() => {
    if (!selectedState || activeView !== 'map' || isSearchOpen) return;
    const frame = requestAnimationFrame(() => {
      const section = mapSection.current;
      const viewport = section?.querySelector('.india-map__viewport');
      if (section && viewport && viewport.getBoundingClientRect().bottom < 220) {
        section.scrollIntoView({ behavior: reducedMotion ? 'instant' : 'smooth', block: 'start' });
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [selectedState, selectedCity, activeView, isSearchOpen, reducedMotion]);

  const handleSelectResult = (stateName: string, cityName: string | null) => {
    setActiveView('map');
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-6 items-start">
              
              {/* Map Canvas Frame */}
              <div ref={mapSection} className="lg:col-span-2 flex flex-col min-w-0 scroll-mt-24">
                <div className="city-data-status" role="status">
                  {cityStatus === 'loading' && 'Loading India city & town directory…'}
                  {cityStatus === 'ready' && `${cityDirectory.length.toLocaleString('en-IN')} cities & towns · Select a state to explore`}
                  {cityStatus === 'error' && <>City directory could not load. <button onClick={() => setCityAttempt(n => n + 1)}>Retry city download</button></>}
                </div>
                <IndiaMap
                  selectedState={selectedState}
                  onSelectState={selectState}
                  cityDirectory={cityDirectory}
                  selectedCity={selectedCity}
                  onSelectCity={setSelectedCity}
                />
              </div>

              {/* Sidebar Information Portal */}
              <div className="flex flex-col gap-5 min-w-0">
                
                {selectedState ? <DetailsDrawer
                  selectedState={selectedState}
                  selectedCity={selectedCity}
                  cityDirectory={cityDirectory}
                  onSelectCity={setSelectedCity}
                  onCloseCity={() => setSelectedCity(null)}
                  onCloseState={() => selectState(null)}
                /> : <>
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

                </>}

                {/* State Explorer Selector */}
                <div className="bg-white border border-cream-200 rounded-3xl p-6 shadow-sm flex-1 flex flex-col transition-colors duration-300">
                  <h3 className="text-xs font-extrabold text-navy-600 uppercase tracking-wider flex items-center gap-1.5 mb-4 select-none">
                    <Compass className="w-4 h-4 text-gold-700" /> State Explorer Directory
                  </h3>

                  <div className="flex-1 overflow-y-auto max-h-[340px] pr-1 space-y-1.5 scrollbar-thin">
                    {stateNames
                      .map((stateName) => {
                        const isSelected = selectedState === stateName;
                        return (
                          <button
                            key={stateName}
                            onClick={() => {
                              selectState(stateName);
                            }}
                            className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex justify-between items-center cursor-pointer ${
                              isSelected
                                ? 'bg-gold-50 text-gold-700 border border-gold-100'
                                : 'bg-cream-50/50 hover:bg-cream-100 text-navy-600 border border-transparent'
                            }`}
                          >
                            <span className="min-w-0 flex-1">{stateName}</span>
                            <span className="text-[10px] text-gold-700 font-medium font-mono text-right max-w-[45%]">
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
            <Suspense fallback={<p role="status" className="p-8">Loading quiz…</p>}><QuizGame cityDirectory={cityDirectory} /></Suspense>
          </div>
        )}

      </main>

      {/* Minimalist Professional Footer */}
      <footer className="py-6 px-8 border-t border-cream-200 bg-white/50 text-center select-none text-[11px] font-bold text-navy-600 tracking-widest mt-auto">
        DESIGNED & DEVELOPED BY <span className="text-gold font-extrabold">AYVALOR</span>
        <p className="mt-3 text-xs font-normal tracking-normal leading-relaxed">
          City & town data: <a className="underline" href={CITY_DIRECTORY_SOURCE.url} target="_blank" rel="noopener noreferrer">GeoNames</a>
          {' · '}<a className="underline" href={CITY_DIRECTORY_SOURCE.licenseUrl} target="_blank" rel="noopener noreferrer">CC BY 4.0</a>
          {' · '}Filtered, mapped to states and supplemented with existing educational locations.
        </p>
        <p className="mt-1 text-xs font-normal tracking-normal leading-relaxed">Coverage includes cities, towns and administrative seats; it is not a complete census of every settlement.</p>
      </footer>

      {/* Global Search Overlay Modal */}
      <SearchModal
        cityDirectory={cityDirectory}
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelect={handleSelectResult}
      />


      
    </div>
  );
};

export default App;
