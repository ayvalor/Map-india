import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, MapPin, Compass, ArrowRight } from 'lucide-react';
import { educationalData } from '../../data/educationalData';

interface SearchResult {
  type: 'state' | 'city';
  name: string;
  stateName: string; // Parent state name
  details: string;
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (stateName: string, cityName: string | null) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelect,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Flatten the educational database into searchable lists on query changes
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const searchQuery = query.toLowerCase().trim();
    const matches: SearchResult[] = [];

    Object.entries(educationalData).forEach(([stateName, stateData]) => {
      // Check if state name matches
      if (stateName.toLowerCase().includes(searchQuery)) {
        matches.push({
          type: 'state',
          name: stateName,
          stateName: stateName,
          details: stateData.capital && stateData.capital !== 'N/A' ? `Capital: ${stateData.capital}` : 'State of India',
        });
      }

      // Check if cities match
      stateData.cities.forEach((city) => {
        if (city.name.toLowerCase().includes(searchQuery)) {
          matches.push({
            type: 'city',
            name: city.name,
            stateName: stateName,
            details: `City in ${stateName}`,
          });
        }
      });
    });

    setResults(matches.slice(0, 8)); // Limit to top 8 matches for clean presentation
  }, [query]);

  // Auto-focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  const handleItemSelect = (item: SearchResult) => {
    if (item.type === 'state') {
      onSelect(item.stateName, null);
    } else {
      onSelect(item.stateName, item.name);
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-start justify-center pt-[10vh] px-4 select-none">
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-navy-950/20 backdrop-blur-sm"
          />

          {/* Search Card Container */}
          <motion.div
            initial={{ scale: 0.96, opacity: 0, y: -20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: -20 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="bg-white border border-cream-200 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col relative"
          >
            {/* Search Input Bar */}
            <div className="p-5 flex items-center gap-3 border-b border-cream-100">
              <Search className="w-5 h-5 text-gold-700 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search state, union territory, or prominent city..."
                className="w-full bg-transparent border-none text-sm text-navy placeholder-navy-600 focus:outline-none focus:ring-0"
              />
              <button
                onClick={onClose}
                className="p-1 hover:bg-cream-100 rounded-full transition-all text-navy-600 hover:text-navy cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Results Section */}
            <div className="max-h-[350px] overflow-y-auto p-4 space-y-1">
              {results.length > 0 ? (
                results.map((result, idx) => (
                  <button
                    key={`${result.type}-${result.name}-${idx}`}
                    onClick={() => handleItemSelect(result)}
                    className="w-full flex items-center justify-between p-3.5 hover:bg-cream-50 rounded-2xl transition-all group text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className={`p-2 rounded-xl ${
                        result.type === 'state' 
                          ? 'bg-saffron-100/40 text-saffron' 
                          : 'bg-navy/5 text-gold-700'
                      }`}>
                        {result.type === 'state' ? (
                          <Compass className="w-4.5 h-4.5" />
                        ) : (
                          <MapPin className="w-4.5 h-4.5" />
                        )}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-navy group-hover:text-saffron transition-colors">
                          {result.name}
                        </div>
                        <div className="text-[10px] font-bold text-navy-600 mt-0.5">
                          {result.details}
                        </div>
                      </div>
                    </div>
                    
                    {/* Hover indicator arrow */}
                    <div className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 text-saffron transition-all duration-200">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </button>
                ))
              ) : query.trim() ? (
                <div className="p-8 text-center text-xs text-navy-600 font-bold uppercase tracking-wider">
                  No matching states or cities found. Try "Jaipur", "Kerala", or "Ladakh".
                </div>
              ) : (
                /* Default search suggestions when query is empty */
                <div className="p-4 space-y-3">
                  <div className="text-[9px] font-extrabold text-gold-700 uppercase tracking-widest">
                    Quick Suggestions
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {['Maharashtra', 'Rajasthan', 'Delhi', 'Ladakh', 'Kerala', 'Bengaluru'].map((item) => (
                      <button
                        key={item}
                        onClick={() => setQuery(item)}
                        className="px-3.5 py-1.5 bg-cream-50 hover:bg-cream-100 text-xs font-bold text-navy-600 rounded-xl transition-all border border-cream-200 cursor-pointer"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer tips */}
            <div className="px-5 py-3 border-t border-cream-100 bg-cream-50/50 text-[10px] text-navy-600 font-bold tracking-wider select-none flex justify-between uppercase">
              <span>Press ESC to close</span>
              <span>Search geo-stats & history</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
