import { memo, useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Maximize2, Minus, Plus, RefreshCw } from 'lucide-react';
import { educationalData } from '../../data/educationalData';
import { getCitiesForState, normalizePlaceName } from '../../data/cities';
import type { CityLocation } from '../../data/cities';
import { buildMapGeometry, fitState, layoutCityLabels } from './mapGeometry';
import type { IndiaGeoData, MapSize, MapTransform } from './mapGeometry';
import './IndiaMap.css';

interface IndiaMapProps {
  selectedState: string | null;
  onSelectState: (stateName: string | null) => void;
  selectedCity: string | null;
  onSelectCity: (cityId: string | null) => void;
  cityDirectory?: CityLocation[];
}
type StateShape = NonNullable<ReturnType<typeof buildMapGeometry>>['shapes'][number];
const EMPTY_DIRECTORY: CityLocation[] = [];
const PAGE_SIZE = 40;
const StatePaths = memo(function StatePaths({ shapes, selectedState, onSelect }: {
  shapes: StateShape[]; selectedState: string | null; onSelect: (name: string) => void;
}) {
  return <>{shapes.map(shape => <path key={shape.name} d={shape.path} data-state={shape.name} role="button" tabIndex={!selectedState || selectedState === shape.name ? 0 : -1}
    aria-label={`Explore ${shape.name}`} aria-pressed={selectedState === shape.name} className="india-map__state"
    fill={selectedState ? '#faf9f5' : '#f4f0e6'} stroke={selectedState ? '#e6e0d5' : '#c9beab'} strokeWidth={0.9} vectorEffect="non-scaling-stroke"
    onClick={() => onSelect(shape.name)} onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); onSelect(shape.name); } }}>
    <title>{shape.name}</title>
  </path>)}</>;
});
function isMapData(value: unknown): value is IndiaGeoData {
  if (!value || typeof value !== 'object') return false;
  const data = value as Partial<IndiaGeoData>;
  return data.type === 'FeatureCollection' && Array.isArray(data.features) && data.features.length > 0
    && data.features.every(feature => typeof feature?.properties?.ST_NM === 'string' && feature?.geometry?.type);
}

// Cache both the pending request and parsed boundaries across map/quiz remounts.
// Subscribers only stop their own updates; StrictMode cleanup cannot abort peers.
let boundariesRequest: Promise<IndiaGeoData> | undefined;
function loadBoundaries(): Promise<IndiaGeoData> {
  if (!boundariesRequest) {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 30000);
    boundariesRequest = fetch(`${import.meta.env.BASE_URL}data/india_states.geojson`, { signal: controller.signal })
      .then(response => { if (!response.ok) throw new Error(`Map response ${response.status}`); return response.json() as Promise<unknown>; })
      .then(data => { if (!isMapData(data)) throw new Error('Invalid map boundaries'); return data; })
      .catch((error: unknown) => { boundariesRequest = undefined; throw error; })
      .finally(() => window.clearTimeout(timeout));
  }
  return boundariesRequest;
}

export function IndiaMap({ selectedState, onSelectState, selectedCity, onSelectCity, cityDirectory = EMPTY_DIRECTORY }: IndiaMapProps) {
  const viewport = useRef<HTMLDivElement>(null);
  const directoryList = useRef<HTMLDivElement>(null);
  const mapGroup = useRef<SVGGElement>(null);
  const labelNodes = useRef(new Map<string, SVGGElement>());
  const renderedTransform = useRef<MapTransform>({ x: 0, y: 0, k: 1 });
  const [size, setSize] = useState<MapSize>({ width: 700, height: 560 });
  const [geoData, setGeoData] = useState<IndiaGeoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [navigation, setNavigation] = useState({ key: '', zoom: 1 });
  const [directoryView, setDirectoryView] = useState({ state: '', query: '', page: 0 });
  const [reduceMotion, setReduceMotion] = useState(() => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const captionId = useId(), selectorId = useId(), directoryId = useId();

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduceMotion(preference.matches);
    preference.addEventListener('change', update);
    return () => preference.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const element = viewport.current;
    if (!element) return;
    let frame = 0;
    const measure = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const bounds = element.getBoundingClientRect();
        const next = { width: Math.max(160, Math.round(bounds.width)), height: Math.max(240, Math.round(bounds.height)) };
        setSize(previous => previous.width === next.width && previous.height === next.height ? previous : next);
      });
    };
    measure();
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(measure);
    observer?.observe(element);
    if (!observer) window.addEventListener('resize', measure);
    return () => { cancelAnimationFrame(frame); observer?.disconnect(); window.removeEventListener('resize', measure); };
  }, []);

  useEffect(() => {
    let disposed = false;
    setLoading(true); setLoadError(false);
    loadBoundaries()
      .then(data => { if (!disposed) setGeoData(data); })
      .catch(() => { if (!disposed) setLoadError(true); })
      .finally(() => { if (!disposed) setLoading(false); });
    return () => { disposed = true; };
  }, [attempt]);

  const geometry = useMemo(() => buildMapGeometry(geoData, size), [geoData, size]);
  const options = useMemo(() => geometry?.shapes.map(shape => shape.name).sort((a, b) => a.localeCompare(b)) || Object.keys(educationalData).sort(), [geometry]);
  const cities = useMemo<CityLocation[]>(() => {
    if (!selectedState) return [];
    if (cityDirectory.length) return getCitiesForState(cityDirectory, selectedState);
    return (educationalData[selectedState]?.cities || []).map(city => ({ id: city.name, name: city.name,
      coordinates: city.coordinates, stateName: selectedState, educationalName: city.name, source: 'curated' as const }));
  }, [cityDirectory, selectedState]);
  const projectedCities = useMemo(() => {
    if (!geometry) return [];
    return cities.flatMap(city => {
      const point = geometry.projection(city.coordinates);
      return point ? [{ ...city, mapX: point[0], mapY: point[1] }] : [];
    }).sort((a, b) => (b.population || 0) - (a.population || 0) || a.name.localeCompare(b.name));
  }, [geometry, cities]);
  const activeCity = projectedCities.find(city => city.id === selectedCity)
    || projectedCities.find(city => city.educationalName === selectedCity)
    || projectedCities.find(city => city.name === selectedCity);
  const baseTransform = useMemo(() => fitState(selectedState ? geometry?.byName.get(selectedState)?.bounds : undefined, size), [geometry, selectedState, size]);
  const navigationKey = `${selectedState || ''}/${selectedCity || ''}`;
  const zoom = navigation.key === navigationKey ? navigation.zoom : 1;
  const transform = useMemo(() => {
    const k = baseTransform.k * (activeCity ? 2 : 1) * zoom;
    const centerX = activeCity?.mapX ?? (size.width / 2 - baseTransform.x) / baseTransform.k;
    const centerY = activeCity?.mapY ?? (size.height / 2 - baseTransform.y) / baseTransform.k;
    return { x: size.width / 2 - centerX * k, y: size.height / 2 - centerY * k, k };
  }, [baseTransform, activeCity, zoom, size]);
  const visibleCities = useMemo(() => projectedCities.map(city => ({ ...city,
    x: city.mapX * transform.k + transform.x, y: city.mapY * transform.k + transform.y,
  })).filter(city => city.x >= 8 && city.x <= size.width - 8 && city.y >= 8 && city.y <= size.height - 8), [projectedCities, transform, size]);
  const labels = useMemo(() => {
    const limit = size.width < 480 ? 10 : 18;
    const priority = [...visibleCities].sort((a, b) => Number(b.id === activeCity?.id) - Number(a.id === activeCity?.id)
      || Number(!!b.educationalName) - Number(!!a.educationalName) || (b.population || 0) - (a.population || 0));
    const chosen: typeof priority = [];
    for (const city of priority) {
      if (chosen.length === limit) break;
      if (city.id === activeCity?.id || city.educationalName || !chosen.some(other => Math.hypot(city.x - other.x, city.y - other.y) < 35)) chosen.push(city);
    }
    return layoutCityLabels(chosen, size);
  }, [visibleCities, activeCity, size]);
  const markerPath = useMemo(() => visibleCities.map(city => {
    const radius = 2.2 / transform.k;
    return `M${city.mapX - radius},${city.mapY}a${radius},${radius} 0 1,0 ${radius * 2},0a${radius},${radius} 0 1,0 ${-radius * 2},0`;
  }).join(''), [visibleCities, transform.k]);
  const query = directoryView.state === selectedState ? directoryView.query : '';
  const filteredCities = useMemo(() => {
    const needle = normalizePlaceName(query);
    return cities.filter(city => !needle || normalizePlaceName([city.name, ...(city.aliases || [])].join(' ')).includes(needle))
      .sort((a, b) => a.name.localeCompare(b.name) || a.id.localeCompare(b.id));
  }, [cities, query]);
  const pageCount = Math.max(1, Math.ceil(filteredCities.length / PAGE_SIZE));
  const page = Math.min(pageCount - 1, directoryView.state === selectedState ? directoryView.page : 0);
  const pageCities = filteredCities.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  useEffect(() => { if (directoryList.current) directoryList.current.scrollTop = 0; }, [selectedState, page, query]);
  // Native SVG attributes use the viewport coordinate system. CSS transforms on
  // SVG groups can instead use their changing fill bounds as the transform origin.
  // One short animation moves geography and fixed-size label anchors together.
  useLayoutEffect(() => {
    if (!mapGroup.current) return;
    const from = { ...renderedTransform.current };
    const anchors = labels.map(label => ({ id: label.id,
      x: (label.x - transform.x) / transform.k, y: (label.y - transform.y) / transform.k,
    }));
    const draw = (value: MapTransform) => {
      renderedTransform.current = value;
      mapGroup.current?.setAttribute('transform', `translate(${value.x} ${value.y}) scale(${value.k})`);
      for (const anchor of anchors) labelNodes.current.get(anchor.id)?.setAttribute('transform',
        `translate(${anchor.x * value.k + value.x} ${anchor.y * value.k + value.y})`);
    };
    if (reduceMotion) { draw(transform); return; }
    let frame = 0;
    const start = performance.now();
    draw(from);
    const animate = (now: number) => {
      const progress = Math.min(1, (now - start) / 360);
      const eased = 1 - Math.pow(1 - progress, 3);
      draw({ x: from.x + (transform.x - from.x) * eased, y: from.y + (transform.y - from.y) * eased, k: from.k + (transform.k - from.k) * eased });
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [transform, labels, reduceMotion]);
  const selectState = useCallback((name: string | null) => { setNavigation({ key: '', zoom: 1 }); onSelectCity(null); onSelectState(name); }, [onSelectCity, onSelectState]);
  const toggleState = useCallback((name: string) => selectState(name === selectedState ? null : name), [selectState, selectedState]);
  const changeZoom = (factor: number) => setNavigation({ key: navigationKey, zoom: Math.max(0.5, Math.min(8, zoom * factor)) });
  const fitSelectedState = () => { setNavigation({ key: '', zoom: 1 }); onSelectCity(null); };
  const setPage = (next: number) => setDirectoryView({ state: selectedState || '', query, page: next });

  return <section className="india-map" aria-label="Interactive India atlas">
    <div className="india-map__toolbar">
      <div><span className="india-map__eyebrow">Interactive explorer</span><h2 className="india-map__title">{selectedState || 'Republic of India'}</h2></div>
      <div className="india-map__tools" aria-label="Map controls">
        <button type="button" onClick={() => changeZoom(1.5)} disabled={!geometry || zoom >= 8} aria-label="Zoom in" title="Zoom in"><Plus aria-hidden="true" /></button>
        <button type="button" onClick={() => changeZoom(1 / 1.5)} disabled={!geometry || zoom <= 0.5} aria-label="Zoom out" title="Zoom out"><Minus aria-hidden="true" /></button>
        <button type="button" onClick={fitSelectedState} disabled={!geometry} aria-label={selectedState ? 'Fit selected state' : 'Fit India'} title="Fit map"><Maximize2 aria-hidden="true" /></button>
        <button type="button" onClick={() => selectState(null)} disabled={!selectedState && zoom === 1} aria-label="Reset to India" title="Reset to India"><RefreshCw aria-hidden="true" /></button>
      </div>
      <label className="india-map__state-select" htmlFor={selectorId}>Explore a state
        <select id={selectorId} value={selectedState || ''} onChange={event => selectState(event.target.value || null)}>
          <option value="">All India</option>{options.map(name => <option key={name} value={name}>{name}</option>)}
        </select>
      </label>
    </div>
    <div className="india-map__viewport" ref={viewport}>
      {geometry && <svg className="india-map__svg" viewBox={`0 0 ${size.width} ${size.height}`} role="group"
        aria-label={selectedState ? `Map of ${selectedState}` : 'Map of India: choose a state or union territory'} aria-describedby={captionId} data-map-label-count={labels.length}
        onClickCapture={event => {
          if (!event.detail || (event.target as Element).closest('[data-city-id]')) return;
          const box = event.currentTarget.getBoundingClientRect();
          const x = (event.clientX - box.left) * size.width / box.width, y = (event.clientY - box.top) * size.height / box.height;
          const current = renderedTransform.current;
          const distanceToPointer = (city: (typeof visibleCities)[number]) => Math.hypot(city.mapX * current.k + current.x - x, city.mapY * current.k + current.y - y);
          const hit = visibleCities.reduce<(typeof visibleCities)[number] | undefined>((best, city) => {
            const distance = distanceToPointer(city);
            return distance < 10 && (!best || distance < distanceToPointer(best)) ? city : best;
          }, undefined);
          if (hit) { event.stopPropagation(); onSelectCity(hit.id); }
        }}>
        <g ref={mapGroup}>
          <StatePaths shapes={geometry.shapes} selectedState={selectedState} onSelect={toggleState} />
          <path d={markerPath} fill="#9b7651" fillOpacity={0.72} pointerEvents="none" aria-hidden="true" />
        </g>
        {labels.map(label => <g key={`${selectedState}/${label.id}`} className="india-map__city" data-city-id={label.id}
          ref={node => { if (node) labelNodes.current.set(label.id, node); else labelNodes.current.delete(label.id); }}
          role="button" tabIndex={0} aria-label={`Explore ${label.name}`} aria-pressed={label.id === activeCity?.id}
          onClick={event => { event.stopPropagation(); onSelectCity(label.id); }}
          onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); event.stopPropagation(); onSelectCity(label.id); } }}>
          <line x1={0} y1={0} x2={Math.max(label.labelX, Math.min(label.labelX + label.width, label.x)) - label.x} y2={label.labelY + label.height / 2 - label.y} />
          <circle r={label.id === activeCity?.id ? 5 : 3.8} />
          <rect x={label.labelX - label.x} y={label.labelY - label.y} width={label.width} height={label.height} rx={6} />
          <text>{label.lines.map((line, index) => <tspan key={index} x={label.labelX - label.x + 9} y={label.labelY - label.y + 16.5 + index * 15}>{line}</tspan>)}</text>
        </g>)}
      </svg>}
      {loading && <div className="india-map__status" role="status"><RefreshCw className="india-map__spinner" aria-hidden="true" /><p>Loading the interactive map…</p></div>}
      {!loading && loadError && <div className="india-map__status" role="alert"><p>The map boundaries could not load. Check your connection and try again.</p><button type="button" className="india-map__retry" onClick={() => setAttempt(value => value + 1)}>Retry map</button></div>}
    </div>
    <p className="india-map__caption" id={captionId} aria-live="polite">
      {selectedState ? `${labels.length} names and ${visibleCities.length.toLocaleString()} city markers in this view. ${cities.length.toLocaleString()} available places in ${selectedState}; browse every name below.`
        : 'Select a state on the map or use the menu above. The menu also makes small union territories easy to explore.'}
    </p>
    {selectedState && <div className="india-map__directory">
      <div className="india-map__directory-head"><strong>Cities & towns in {selectedState}</strong><span>{cities.length.toLocaleString()} available places</span></div>
      <label className="sr-only" htmlFor={directoryId}>Search cities and towns in {selectedState}</label>
      <input id={directoryId} type="search" className="india-map__city-search" value={query} placeholder="Find a city or town…"
        onChange={event => setDirectoryView({ state: selectedState, query: event.target.value, page: 0 })} />
      <div className="india-map__city-list" ref={directoryList} aria-label={`Cities and towns in ${selectedState}`}>
        {pageCities.map(city => <button key={city.id} type="button" data-directory-city={city.id} aria-pressed={city.id === activeCity?.id} onClick={() => onSelectCity(city.id)}><span>{city.name}</span>{city.id === activeCity?.id && <span aria-hidden="true">↗</span>}</button>)}
      </div>
      {!filteredCities.length && <p className="india-map__empty">{cities.length ? 'No matching places. Try a shorter name or another spelling.' : 'No city entries are available for this territory in the current directory.'}</p>}
      {!!filteredCities.length && <div className="india-map__pagination" aria-label="City directory pages">
        <button type="button" disabled={!page} onClick={() => setPage(page - 1)}>Previous</button>
        <span aria-live="polite">{page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, filteredCities.length)} of {filteredCities.length.toLocaleString()}</span>
        <button type="button" disabled={page >= pageCount - 1} onClick={() => setPage(page + 1)}>Next</button>
      </div>}
    </div>}
  </section>;
}
