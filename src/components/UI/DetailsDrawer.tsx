import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, MapPin, Users, Maximize2, History, Landmark, Sparkles, BookOpen, Compass } from 'lucide-react';
import { educationalData } from '../../data/educationalData';
import type { StateData, CityData } from '../../data/educationalData';

interface DetailsDrawerProps {
  selectedState: string | null;
  selectedCity: string | null;
  onCloseCity: () => void;
  onCloseState: () => void;
}

export const DetailsDrawer: React.FC<DetailsDrawerProps> = ({
  selectedState,
  selectedCity,
  onCloseCity,
  onCloseState,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'landmarks' | 'trivia'>('overview');

  if (!selectedState) return null;

  const stateInfo: StateData = educationalData[selectedState];
  const cityInfo: CityData | undefined = selectedCity
    ? stateInfo.cities.find((c) => c.name.toLowerCase() === selectedCity.toLowerCase())
    : undefined;

  // Header Title and Subtitle based on Selection Level
  const title = cityInfo ? cityInfo.name : stateInfo.name;
  const subtitle = cityInfo ? `City in ${stateInfo.name}` : `State of India`;

  const handleClose = () => {
    if (cityInfo) {
      onCloseCity();
    } else {
      onCloseState();
    }
  };

  return (
    <motion.div
      initial={{ x: '100%', opacity: 0.95 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '100%', opacity: 0.95 }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed right-0 top-0 bottom-0 w-full sm:w-[450px] bg-white/90 backdrop-blur-xl border-l border-cream-200 shadow-2xl z-50 flex flex-col overflow-hidden transition-colors duration-300"
    >
      {/* Drawer Header */}
      <div className="p-6 border-b border-cream-100 flex items-center justify-between">
        <div>
          <span className="text-[9px] font-extrabold tracking-widest text-gold-700 uppercase">
            {subtitle}
          </span>
          <h2 className="text-xl font-medium text-navy font-regal tracking-wide mt-1 select-none">
            {title}
          </h2>
        </div>
        <button
          onClick={handleClose}
          className="p-2 hover:bg-cream-100 text-navy-600 hover:text-navy rounded-full transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Content Scroller */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        
        {/* Quick Statistics Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-cream-50/50 rounded-2xl border border-cream-100 flex items-center gap-3">
            <div className="p-2 bg-saffron-100/30 text-saffron rounded-xl">
              <Maximize2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[9px] font-bold text-navy-600 uppercase tracking-wider">
                Total Area
              </div>
              <div className="text-xs font-bold text-navy mt-0.5">
                {cityInfo ? cityInfo.area : stateInfo.area}
              </div>
            </div>
          </div>

          <div className="p-4 bg-cream-50/50 rounded-2xl border border-cream-100 flex items-center gap-3">
            <div className="p-2 bg-navy/5 text-gold-700 rounded-xl">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[9px] font-bold text-navy-600 uppercase tracking-wider">
                Population
              </div>
              <div className="text-xs font-bold text-navy mt-0.5">
                {cityInfo ? cityInfo.population : stateInfo.population}
              </div>
            </div>
          </div>
        </div>

        {/* State View - Specific Static Details */}
        {!cityInfo && (
          <div className="space-y-6">
            {/* Overview Section */}
            <div className="space-y-2">
              <h3 className="text-[10px] font-extrabold text-navy uppercase tracking-wider flex items-center gap-1.5 border-b border-cream-100 pb-1.5">
                <Compass className="w-4 h-4 text-gold-700" /> State Overview
              </h3>
              <p className="text-xs text-navy-600 leading-relaxed font-medium">
                {stateInfo.description}
              </p>
            </div>

            {/* Core facts */}
            <div className="p-5 bg-saffron-50/20 border border-saffron-100/50 rounded-2xl space-y-2">
              <h4 className="text-[10px] font-extrabold text-saffron uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> State Fun Fact
              </h4>
              <p className="text-xs font-medium text-navy-600 leading-relaxed">
                {stateInfo.funFact}
              </p>
            </div>

            {/* Administrative Info Card */}
            <div className="p-5 bg-cream-50/30 rounded-2xl border border-cream-100 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-navy-600 uppercase tracking-wider">Capital</span>
                <span className="font-extrabold text-navy">{stateInfo.capital}</span>
              </div>
              <div className="w-full h-px bg-cream-100" />
              <div className="flex justify-between items-start text-xs">
                <span className="font-bold text-navy-600 uppercase tracking-wider mt-0.5">Official Languages</span>
                <span className="font-bold text-navy text-right flex flex-wrap gap-1 justify-end">
                  {stateInfo.languages.map((lang) => (
                    <span key={lang} className="bg-cream-100 px-2 py-0.5 rounded text-[10px] text-navy-600">
                      {lang}
                    </span>
                  ))}
                </span>
              </div>
            </div>

            {/* List of Cities inside this State */}
            {stateInfo.cities.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-[10px] font-extrabold text-navy uppercase tracking-wider flex items-center gap-1.5 border-b border-cream-100 pb-1.5">
                  <MapPin className="w-4 h-4 text-gold-700" /> Prominent Cities
                </h3>
                <div className="space-y-2">
                  <p className="text-[10px] text-navy-600 font-medium">
                    Click a city marker on the map to explore curriculum details:
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {stateInfo.cities.map((city) => (
                      <div
                        key={city.name}
                        className="p-3 bg-cream-50/50 border border-cream-100 rounded-xl text-xs font-bold text-navy-600 text-center select-none"
                      >
                        {city.name}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* City View - Detailed Tab System (Level 3 Drilldown) */}
        {cityInfo && (
          <div className="space-y-6">
            
            {/* Elegant Tabs */}
            <div className="flex border-b border-cream-100">
              <button
                onClick={() => setActiveTab('overview')}
                className={`flex-1 pb-3 text-[10px] font-extrabold uppercase tracking-wider text-center border-b-2 transition-all cursor-pointer ${
                  activeTab === 'overview'
                    ? 'border-saffron text-saffron'
                    : 'border-transparent text-navy-600 hover:text-navy'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('landmarks')}
                className={`flex-1 pb-3 text-[10px] font-extrabold uppercase tracking-wider text-center border-b-2 transition-all cursor-pointer ${
                  activeTab === 'landmarks'
                    ? 'border-saffron text-saffron'
                    : 'border-transparent text-navy-600 hover:text-navy'
                }`}
              >
                Landmarks
              </button>
              <button
                onClick={() => setActiveTab('trivia')}
                className={`flex-1 pb-3 text-[10px] font-extrabold uppercase tracking-wider text-center border-b-2 transition-all cursor-pointer ${
                  activeTab === 'trivia'
                    ? 'border-saffron text-saffron'
                    : 'border-transparent text-navy-600 hover:text-navy'
                }`}
              >
                Fun Facts
              </button>
            </div>

            {/* Tab content */}
            <div className="space-y-6 min-h-[300px]">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Historical Context */}
                  <div className="space-y-2">
                    <h3 className="text-[10px] font-extrabold text-navy uppercase tracking-wider flex items-center gap-1.5 border-b border-cream-100 pb-1.5">
                      <History className="w-4 h-4 text-gold-700" /> Historical Importance
                    </h3>
                    <p className="text-xs text-navy-600 leading-relaxed font-medium">
                      {cityInfo.history}
                    </p>
                  </div>

                  {/* Geographical Features */}
                  <div className="space-y-2">
                    <h3 className="text-[10px] font-extrabold text-navy uppercase tracking-wider flex items-center gap-1.5 border-b border-cream-100 pb-1.5">
                      <Compass className="w-4 h-4 text-gold-700" /> Geographical Profile
                    </h3>
                    <p className="text-xs text-navy-600 leading-relaxed font-medium">
                      {cityInfo.geography}
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'landmarks' && (
                <div className="space-y-4">
                  <h3 className="text-[10px] font-extrabold text-navy uppercase tracking-wider flex items-center gap-1.5 border-b border-cream-100 pb-1.5 mb-2">
                    <Landmark className="w-4 h-4 text-gold-700" /> Landmark Attractions
                  </h3>
                  
                  <div className="space-y-2.5">
                    {cityInfo.landmarks.map((landmark, idx) => (
                      <div
                        key={idx}
                        className="p-4 bg-cream-50/50 border border-cream-100 rounded-2xl flex items-center gap-3.5"
                      >
                        <div className="w-7 h-7 bg-navy/5 text-gold-700 rounded-lg flex items-center justify-center font-bold text-xs select-none">
                          {idx + 1}
                        </div>
                        <div className="text-xs font-bold text-navy">
                          {landmark}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'trivia' && (
                <div className="space-y-4">
                  <h3 className="text-[10px] font-extrabold text-navy uppercase tracking-wider flex items-center gap-1.5 border-b border-cream-100 pb-1.5 mb-2">
                    <Sparkles className="w-4 h-4 text-gold-700" /> Did-You-Know Trivia
                  </h3>
                  
                  <div className="space-y-2.5">
                    {cityInfo.funFacts.map((fact, idx) => (
                      <div
                        key={idx}
                        className="p-4 bg-saffron-50/20 border border-saffron-100/35 rounded-2xl flex items-start gap-3"
                      >
                        <BookOpen className="w-5 h-5 text-saffron mt-0.5 shrink-0" />
                        <div className="text-xs leading-relaxed text-navy-600 font-medium">
                          {fact}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer Branding */}
      <div className="p-6 border-t border-cream-100 bg-cream-50/50 flex items-center justify-between select-none">
        <span className="text-[9px] text-navy-600 font-bold uppercase tracking-wider">
          Official Boundary Compliant
        </span>
        <span className="text-[9px] text-gold font-extrabold uppercase tracking-widest">
          BHARAT ATLAS
        </span>
      </div>
    </motion.div>
  );
};
