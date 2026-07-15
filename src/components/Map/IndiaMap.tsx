import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { geoMercator, geoPath } from 'd3-geo';
import { educationalData } from '../../data/educationalData';
import { RefreshCw, Info } from 'lucide-react';

interface IndiaMapProps {
  selectedState: string | null;
  onSelectState: (stateName: string | null) => void;
  selectedCity: string | null;
  onSelectCity: (cityName: string | null) => void;
}

interface GeoJsonFeature {
  type: string;
  properties: {
    ST_NM: string;
  };
  geometry: any;
}

interface GeoJsonData {
  type: string;
  features: GeoJsonFeature[];
}

export const IndiaMap: React.FC<IndiaMapProps> = ({
  selectedState,
  onSelectState,
  selectedCity,
  onSelectCity,
}) => {
  const [geoData, setGeoData] = useState<GeoJsonData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [windowWidth, setWindowWidth] = useState<number>(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );
  
  // Dimensions for standard map viewport
  const width = 760;
  const height = 820;

  // D3 Projection centered on India with Survey of India bounds
  const projection = geoMercator()
    .center([78.9629, 22.5937])
    .scale(1250)
    .translate([width / 2, height / 2]);

  const pathGenerator = geoPath().projection(projection);

  // Zoom transform state
  const [zoomTransform, setZoomTransform] = useState({ x: 0, y: 0, k: 1 });

  // Listen for window resize to handle desktop shifting
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch GeoJSON data on mount
  useEffect(() => {
    fetch('/data/india_states.geojson')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load map data');
        return res.json();
      })
      .then((data) => {
        setGeoData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching GeoJSON:', err);
        setLoading(false);
      });
  }, []);

  // Update zoom transform when selected state changes
  useEffect(() => {
    if (!geoData) return;

    if (!selectedState) {
      // Reset zoom to national view
      setZoomTransform({ x: 0, y: 0, k: 1 });
      return;
    }

    // Find the state feature to calculate bounding box
    const stateFeature = geoData.features.find(
      (f) => f.properties.ST_NM.toLowerCase() === selectedState.toLowerCase()
    );

    if (stateFeature) {
      const bounds = pathGenerator.bounds(stateFeature as any);
      if (!bounds) return;

      const [[x0, y0], [x1, y1]] = bounds;
      const dx = x1 - x0;
      const dy = y1 - y0;
      const x = (x0 + x1) / 2;
      const y = (y0 + y1) / 2;

      // Determine visible area based on screen layout
      const isDesktop = windowWidth >= 1024;
      const visibleWidth = isDesktop ? (width * 0.55) : width;
      const visibleHeight = height;

      // Calculate appropriate scale based on visible bounds, leaving margin to avoid cuts
      const scaleX = (visibleWidth * 0.7) / dx;
      const scaleY = (visibleHeight * 0.7) / dy;
      
      // Keep zoom scale clean, minimum 1.5, maximum 3.8 to prevent overflow
      const scale = Math.max(1.5, Math.min(3.8, Math.min(scaleX, scaleY)));
      
      // Calculate translations to center the state in the VISIBLE viewport
      const translateX = (visibleWidth / 2) - scale * x;
      const translateY = (visibleHeight / 2) - scale * y;

      setZoomTransform({ x: translateX, y: translateY, k: scale });
    }
  }, [selectedState, geoData, windowWidth]);

  // Handle map state click
  const handleStateClick = (stateName: string) => {
    if (selectedState === stateName) {
      // Reset if clicked again
      onSelectState(null);
      onSelectCity(null);
    } else {
      onSelectState(stateName);
      onSelectCity(null);
    }
  };

  // Reset function for manual button
  const handleReset = () => {
    onSelectState(null);
    onSelectCity(null);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[500px] w-full">
        <RefreshCw className="w-8 h-8 animate-spin text-gold" />
        <p className="mt-4 text-xs text-navy-600 font-bold uppercase tracking-wider">Loading Interactive Atlas...</p>
      </div>
    );
  }

  if (!geoData) {
    return (
      <div className="flex items-center justify-center h-[500px] w-full text-red-500 font-medium">
        Error: Official India Map Boundaries could not be loaded securely.
      </div>
    );
  }

  // Get cities for current zoomed state
  const stateDetails = selectedState ? educationalData[selectedState] : null;
  const cities = stateDetails?.cities || [];

  return (
    <div className="relative bg-white border border-cream-200 rounded-3xl p-6 shadow-sm overflow-hidden flex flex-col items-center w-full h-[880px]">
      
      {/* Floating control buttons */}
      <div className="absolute top-6 left-6 flex flex-col gap-2 z-10 select-none">
        <button
          onClick={handleReset}
          disabled={!selectedState}
          className="p-3 bg-cream-50 hover:bg-cream-100 disabled:opacity-50 disabled:hover:bg-cream-50 text-navy rounded-xl transition-all shadow-sm border border-cream-200 cursor-pointer"
          title="Reset to Full India Map"
        >
          <RefreshCw className="w-4 h-4 text-gold-700" />
        </button>
        <div className="text-[10px] font-bold text-navy-600 bg-cream-50 px-3 py-1.5 rounded-lg border border-cream-200 flex items-center gap-1.5 select-none uppercase tracking-wider">
          <Info className="w-3.5 h-3.5 text-gold-700" />
          {selectedState ? 'State View' : 'National View'}
        </div>
      </div>

      {/* Dynamic Title / Breadcrumb */}
      <div className="absolute top-6 right-6 text-right select-none z-10">
        <div className="text-[9px] text-gold-700 font-bold tracking-widest uppercase">
          Interactive Explorer
        </div>
        <div className="text-lg font-medium text-navy font-regal mt-0.5 tracking-wide">
          {selectedState ? (
            <span className="flex items-center gap-1 justify-end">
              Bharat <span className="text-gold-600 font-sans">/</span> <span className="text-saffron font-bold">{selectedState}</span>
            </span>
          ) : (
            'Republic of India'
          )}
        </div>
      </div>

      {/* SVG Container */}
      <div className="w-full h-full flex items-center justify-center relative select-none">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full max-h-[740px] focus:outline-none overflow-visible"
        >
          <rect width={width} height={height} fill="transparent" />
          
          <motion.g
            animate={{
              x: zoomTransform.x,
              y: zoomTransform.y,
              scale: zoomTransform.k,
            }}
            transition={{
              type: 'spring',
              stiffness: 85,
              damping: 20,
            }}
            style={{ originX: 0, originY: 0 }}
          >
            {/* Map States */}
            {geoData.features.map((feature) => {
              const stateName = feature.properties.ST_NM;
              const isSelected = selectedState === stateName;
              const isHovered = hoveredState === stateName;
              const isAnyStateSelected = selectedState !== null;

              // Color configurations for the luxurious light theme
              let fill = '#faf9f4'; // warm off-white
              let stroke = '#e2dfd5'; // soft gold-grey
              let strokeWidth = 0.8;

              if (isSelected) {
                fill = 'rgba(234, 88, 12, 0.05)'; // soft saffron tint
                stroke = '#ea580c'; // rich saffron border
                strokeWidth = 1.6 / zoomTransform.k;
              } else if (isHovered) {
                fill = 'rgba(197, 168, 128, 0.05)'; // soft gold tint
                stroke = '#c5a880'; // gold border
                strokeWidth = 1.2 / zoomTransform.k;
              } else if (isAnyStateSelected) {
                fill = '#ffffff'; // flat white
                stroke = '#f1eedf'; // very light divider
                strokeWidth = 0.5 / zoomTransform.k;
              }

              return (
                <path
                  key={stateName}
                  d={pathGenerator(feature as any) || ''}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth={strokeWidth}
                  onClick={() => handleStateClick(stateName)}
                  onMouseEnter={() => !isAnyStateSelected && setHoveredState(stateName)}
                  onMouseLeave={() => setHoveredState(null)}
                  className="cursor-pointer transition-colors duration-200 focus:outline-none"
                  style={{
                    vectorEffect: 'non-scaling-stroke',
                  }}
                />
              );
            })}

            {/* City Markers - Only display when state is active and selected */}
            <AnimatePresence>
              {selectedState &&
                cities.map((city) => {
                  const projectedCoords = projection(city.coordinates);
                  if (!projectedCoords) return null;
                  const [cx, cy] = projectedCoords;
                  const isCitySelected = selectedCity === city.name;

                  return (
                    <g key={city.name}>
                      {/* Pulsing ring for active selection */}
                      <motion.circle
                        cx={cx}
                        cy={cy}
                        r={isCitySelected ? 12 / zoomTransform.k : 8 / zoomTransform.k}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: [0.15, 0.4, 0.15], scale: [1, 1.8, 1] }}
                        exit={{ opacity: 0, scale: 0 }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="fill-saffron stroke-none pointer-events-none"
                      />
                      
                      {/* Interactive city dot */}
                      <motion.circle
                        cx={cx}
                        cy={cy}
                        r={6 / zoomTransform.k}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        whileHover={{ scale: 1.3 }}
                        onClick={(e) => {
                          e.stopPropagation(); // Avoid triggering state click resets
                          onSelectCity(city.name);
                        }}
                        className={`cursor-pointer stroke-white transition-colors duration-200 ${
                          isCitySelected ? 'fill-saffron' : 'fill-navy'
                        }`}
                        style={{
                          strokeWidth: 1.5 / zoomTransform.k,
                        }}
                      />
                      
                      {/* Elegant city text label */}
                      <foreignObject
                        x={cx + 8 / zoomTransform.k}
                        y={cy - 10 / zoomTransform.k}
                        width={120 / zoomTransform.k}
                        height={30 / zoomTransform.k}
                        className="pointer-events-none overflow-visible"
                      >
                        <div
                          style={{ fontSize: `${Math.max(8, 12 / zoomTransform.k)}px` }}
                          className={`font-bold tracking-tight whitespace-nowrap px-1 rounded select-none ${
                            isCitySelected
                              ? 'text-saffron font-extrabold'
                              : 'text-navy-800'
                          }`}
                        >
                          {city.name}
                        </div>
                      </foreignObject>
                    </g>
                  );
                })}
            </AnimatePresence>
          </motion.g>
        </svg>

        {/* Floating instruction tooltip */}
        <AnimatePresence>
          {hoveredState && !selectedState && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-6 bg-white/95 backdrop-blur border border-cream-200 px-5 py-3 rounded-2xl shadow-md flex flex-col items-center gap-1 select-none"
            >
              <div className="text-[9px] font-extrabold text-gold-700 uppercase tracking-widest">
                Click to explore
              </div>
              <div className="text-sm font-bold text-navy">
                {hoveredState}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
