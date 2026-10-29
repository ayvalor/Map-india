import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, X, MapPin, Users, Maximize2, History, Landmark, Sparkles, BookOpen, Compass, Search } from 'lucide-react';
import { educationalData } from '../../data/educationalData';
import { CITY_DIRECTORY_SOURCE, findEducationalCity, getCitiesForState, normalizePlaceName } from '../../data/cities';
import type { CityLocation } from '../../data/cities';

interface DetailsDrawerProps {
  selectedState: string | null;
  selectedCity: string | null;
  cityDirectory?: CityLocation[];
  onSelectCity: (cityId: string) => void;
  onCloseCity: () => void;
  onCloseState: () => void;
}
const emptyDirectory: CityLocation[] = [];
const tabs = [{ id: 'overview', label: 'Overview' }, { id: 'landmarks', label: 'Landmarks' }, { id: 'trivia', label: 'Fun facts' }] as const;
type DetailTab = (typeof tabs)[number]['id'];
const sectionTitle = 'text-xs font-bold text-navy uppercase tracking-wide flex items-center gap-2 border-b border-cream-100 pb-2';
const focusRing = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-700';
const coordinatesText = ([longitude, latitude]: [number, number]) => `${Math.abs(latitude).toFixed(3)}° ${latitude >= 0 ? 'N' : 'S'}, ${Math.abs(longitude).toFixed(3)}° ${longitude >= 0 ? 'E' : 'W'}`;

export const DetailsDrawer: React.FC<DetailsDrawerProps> = ({ selectedState, selectedCity, cityDirectory = emptyDirectory, onSelectCity, onCloseCity, onCloseState }) => {
  const id = useId();
  const reducedMotion = useReducedMotion();
  const contentRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const focusSelection = useRef(false);
  const selectionKey = `${selectedState ?? ''}/${selectedCity ?? ''}`;
  const [tabSelection, setTabSelection] = useState<{ key: string; tab: DetailTab }>({ key: '', tab: 'overview' });
  const [cityFilter, setCityFilter] = useState({ state: '', query: '', limit: 40 });
  const stateInfo = selectedState ? educationalData[selectedState] : undefined;
  const stateCities = useMemo<CityLocation[]>(() => {
    if (!stateInfo || !selectedState) return [];
    const cities = getCitiesForState(cityDirectory, selectedState);
    if (cities.length) return cities;
    return stateInfo.cities.map(city => ({ id: city.name, name: city.name, stateName: selectedState, coordinates: city.coordinates, educationalName: city.name, source: 'curated' as const }));
  }, [cityDirectory, selectedState, stateInfo]);
  const query = cityFilter.state === selectedState ? cityFilter.query : '';
  const cityLimit = cityFilter.state === selectedState ? cityFilter.limit : 40;
  const citySearchIndex = useMemo(() => stateCities.map(city => ({ city,
    names: [city.name, city.educationalName ?? '', ...(city.aliases ?? [])].filter(Boolean).map(normalizePlaceName),
  })), [stateCities]);
  const filteredCities = useMemo(() => {
    const term = normalizePlaceName(query);
    return term ? citySearchIndex.filter(item => item.names.some(name => name.includes(term))).map(item => item.city) : stateCities;
  }, [query, stateCities, citySearchIndex]);
  useEffect(() => {
    contentRef.current?.scrollTo({ top: 0 });
    if (focusSelection.current) { titleRef.current?.focus({ preventScroll: true }); focusSelection.current = false; }
  }, [selectionKey]);

  if (!stateInfo) return null;
  const selectedName = normalizePlaceName(selectedCity ?? '');
  // Loading-time selections use curated names. Preserve their article identity
  // before considering gazetteer namesakes when the full directory arrives.
  const selectedPlace = selectedCity ? stateCities.find(city => city.id === selectedCity)
    ?? stateCities.find(city => city.educationalName && normalizePlaceName(city.educationalName) === selectedName)
    ?? stateCities.find(city => [city.name, ...(city.aliases ?? [])].some(name => normalizePlaceName(name) === selectedName))
    : undefined;
  const cityInfo = selectedPlace ? findEducationalCity(selectedPlace) : undefined;
  const title = selectedPlace?.name ?? stateInfo.name;
  const availableTabs = tabs.filter(tab => tab.id === 'overview' ? Boolean(cityInfo?.history || cityInfo?.geography) : tab.id === 'landmarks' ? Boolean(cityInfo?.landmarks.length) : Boolean(cityInfo?.funFacts.length));
  const requestedTab = tabSelection.key === selectionKey ? tabSelection.tab : 'overview';
  const activeTab = availableTabs.some(tab => tab.id === requestedTab) ? requestedTab : availableTabs[0]?.id ?? 'overview';
  const selectTab = (tab: DetailTab) => setTabSelection({ key: selectionKey, tab });
  const navigateTabs = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const current = availableTabs.findIndex(tab => tab.id === activeTab);
    const next = event.key === 'ArrowRight' ? (current + 1) % availableTabs.length : event.key === 'ArrowLeft' ? (current + availableTabs.length - 1) % availableTabs.length : event.key === 'Home' ? 0 : event.key === 'End' ? availableTabs.length - 1 : -1;
    if (next < 0 || !availableTabs.length) return;
    event.preventDefault(); selectTab(availableTabs[next].id);
    event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]')[next]?.focus();
  };
  const area = selectedPlace ? cityInfo?.area : stateInfo.area;
  const population = selectedPlace ? cityInfo?.population || (selectedPlace.population ? selectedPlace.population.toLocaleString('en-IN') : '') : stateInfo.population;
  const sourceEstimate = Boolean(selectedPlace?.population && !cityInfo?.population);

  return (
    <motion.aside aria-labelledby={`${id}-title`} initial={{ opacity: 0, y: reducedMotion ? 0 : 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: reducedMotion ? 0 : 0.16 }}
      className="w-full min-w-0 flex flex-col rounded-3xl border border-cream-200 bg-white shadow-sm overflow-hidden lg:max-h-[calc(100dvh-8rem)]">
      <div className="p-4 sm:p-5 border-b border-cream-100 flex items-start justify-between gap-3 shrink-0">
        <div className="min-w-0">
          <p className="text-xs font-bold tracking-wide text-gold-700 uppercase">{selectedPlace ? `City / town in ${stateInfo.name}` : 'State / union territory'}</p>
          <h2 ref={titleRef} id={`${id}-title`} tabIndex={-1} className={`text-xl font-medium text-navy font-regal mt-1 break-words ${focusRing}`}>{title}</h2>
          {selectedPlace && <button type="button" onClick={() => { focusSelection.current = true; onCloseCity(); }} className={`mt-2 min-h-11 inline-flex items-center gap-2 text-sm font-semibold text-navy-600 hover:text-navy ${focusRing}`}><ArrowLeft className="w-4 h-4 shrink-0" aria-hidden="true" />Back to {stateInfo.name}</button>}
        </div>
        <button type="button" onClick={onCloseState} aria-label={`Close ${stateInfo.name} details`} title="Close details" className={`w-11 h-11 shrink-0 inline-flex items-center justify-center rounded-full text-navy-600 hover:bg-cream-100 hover:text-navy transition-colors ${focusRing}`}><X className="w-5 h-5" aria-hidden="true" /></button>
      </div>
      <div ref={contentRef} className="min-h-0 p-4 sm:p-5 space-y-6 lg:overflow-y-auto lg:overscroll-contain">
        {(area || population) && <div><dl className="grid grid-cols-2 gap-3">
          {[{ label: 'Total area', value: area, Icon: Maximize2 }, { label: sourceEstimate ? 'Recorded population' : 'Population', value: population, Icon: Users }].filter(item => item.value).map(({ label, value, Icon }) => <div key={label} className="min-w-0 p-3 bg-cream-50/50 rounded-2xl border border-cream-100"><dt className="flex items-center gap-2 text-xs font-semibold text-navy-600"><Icon className="w-4 h-4 shrink-0 text-gold-700" aria-hidden="true" />{label}</dt><dd className="mt-2 text-sm font-bold text-navy break-words">{value}</dd></div>)}
        </dl>{sourceEstimate && <p className="mt-2 text-xs leading-relaxed text-navy-600">GeoNames source estimate; a reference year is not supplied. This is not a current census count.</p>}</div>}
        {!selectedPlace ? <div className="space-y-6">
          {stateInfo.description && <section className="space-y-3"><h3 className={sectionTitle}><Compass className="w-4 h-4 shrink-0 text-gold-700" aria-hidden="true" />Overview</h3><p className="text-sm text-navy-600 leading-relaxed">{stateInfo.description}</p></section>}
          {stateInfo.funFact && <section className="p-4 bg-saffron-50/20 border border-saffron-100/50 rounded-2xl space-y-2"><h3 className="text-xs font-bold text-navy uppercase tracking-wide flex items-center gap-2"><Sparkles className="w-4 h-4 text-gold-700" aria-hidden="true" />Did you know?</h3><p className="text-sm text-navy-600 leading-relaxed">{stateInfo.funFact}</p></section>}
          <dl className="p-4 bg-cream-50/30 rounded-2xl border border-cream-100 space-y-4 text-sm">
            <div><dt className="font-semibold text-navy-600">Capital</dt><dd className="mt-1 font-bold text-navy break-words">{stateInfo.capital}</dd></div>
            <div><dt className="font-semibold text-navy-600">Official languages</dt><dd className="mt-2 flex flex-wrap gap-2">{stateInfo.languages.map(language => <span key={language} className="bg-cream-100 px-2 py-1 rounded text-sm text-navy-600">{language}</span>)}</dd></div>
          </dl>
          {stateCities.length > 0 && <section className="space-y-3">
            <h3 className={sectionTitle}><MapPin className="w-4 h-4 shrink-0 text-gold-700" aria-hidden="true" />Explore cities and towns</h3>
            <label className="flex min-h-11 items-center gap-2 rounded-xl border border-cream-200 px-3 focus-within:ring-2 focus-within:ring-gold-700/40"><Search className="w-4 h-4 shrink-0 text-gold-700" aria-hidden="true" /><input type="search" aria-label={`Filter cities and towns in ${stateInfo.name}`} value={query} onChange={event => setCityFilter({ state: selectedState!, query: event.target.value, limit: 40 })} placeholder="Find a city or town…" className="w-full min-w-0 bg-transparent py-3 text-base text-navy focus:outline-none" /></label>
            <p role="status" className="text-xs text-navy-600">{Math.min(cityLimit, filteredCities.length)} of {filteredCities.length} places shown. Choose a place here or on the map.</p>
            <div className="max-h-72 overflow-y-auto overscroll-contain space-y-3 p-1">
              <div className="grid grid-cols-2 gap-2">{filteredCities.slice(0, cityLimit).map(city => <button key={city.id} type="button" onClick={() => { focusSelection.current = true; onSelectCity(city.id); }} className={`min-h-11 min-w-0 p-3 bg-cream-50/50 hover:bg-cream-100 border border-cream-200 rounded-xl text-sm font-semibold text-navy text-left break-words transition-colors ${focusRing}`}>{city.name}</button>)}</div>
              {!filteredCities.length && <p className="text-sm text-navy-600">No places match that name.</p>}
              {filteredCities.length > cityLimit && <button type="button" onClick={() => setCityFilter({ state: selectedState!, query, limit: cityLimit + 40 })} className={`w-full min-h-11 rounded-xl border border-cream-200 px-3 py-2 text-sm font-bold text-navy hover:bg-cream-50 ${focusRing}`}>Show more places</button>}
            </div>
          </section>}
        </div> : <div className="space-y-5">
          <section className="space-y-2"><h3 className={sectionTitle}><MapPin className="w-4 h-4 shrink-0 text-gold-700" aria-hidden="true" />Location</h3><p className="text-sm text-navy-600">{selectedPlace.name}, {stateInfo.name}</p><p className="text-sm text-navy-600">{coordinatesText(selectedPlace.coordinates)}</p>{selectedPlace.source === 'geonames' && <p className="text-xs text-navy-600"><a href={`https://www.geonames.org/${selectedPlace.id.replace(/^geonames-/, '')}`} target="_blank" rel="noopener noreferrer" className={`underline text-gold-700 ${focusRing}`}>GeoNames geographic record</a>{' · '}<a href={CITY_DIRECTORY_SOURCE.licenseUrl} target="_blank" rel="noopener noreferrer" className={`underline text-gold-700 ${focusRing}`}>{CITY_DIRECTORY_SOURCE.license}</a></p>}</section>
          {availableTabs.length > 0 && cityInfo ? <>
            <div role="tablist" aria-label={`${selectedPlace.name} information`} onKeyDown={navigateTabs} className="flex border-b border-cream-200">{availableTabs.map(tab => <button key={tab.id} type="button" role="tab" id={`${id}-${tab.id}`} aria-controls={`${id}-panel`} aria-selected={activeTab === tab.id} tabIndex={activeTab === tab.id ? 0 : -1} onClick={() => selectTab(tab.id)} className={`flex-1 min-w-0 min-h-11 px-1 py-3 text-xs sm:text-sm font-bold border-b-2 transition-colors ${focusRing} ${activeTab === tab.id ? 'border-saffron text-navy' : 'border-transparent text-navy-600 hover:text-navy'}`}>{tab.label}</button>)}</div>
            <div role="tabpanel" id={`${id}-panel`} aria-labelledby={`${id}-${activeTab}`} tabIndex={0} className={`space-y-5 ${focusRing}`}>
              {activeTab === 'overview' && <>{cityInfo.history && <section className="space-y-3"><h3 className={sectionTitle}><History className="w-4 h-4 shrink-0 text-gold-700" aria-hidden="true" />Historical importance</h3><p className="text-sm text-navy-600 leading-relaxed">{cityInfo.history}</p></section>}{cityInfo.geography && <section className="space-y-3"><h3 className={sectionTitle}><Compass className="w-4 h-4 shrink-0 text-gold-700" aria-hidden="true" />Geographical profile</h3><p className="text-sm text-navy-600 leading-relaxed">{cityInfo.geography}</p></section>}</>}
              {activeTab === 'landmarks' && <section className="space-y-3"><h3 className={sectionTitle}><Landmark className="w-4 h-4 shrink-0 text-gold-700" aria-hidden="true" />Landmark attractions</h3><ol className="space-y-2">{cityInfo.landmarks.map((landmark, index) => <li key={landmark} className="p-3 bg-cream-50/50 border border-cream-100 rounded-xl flex items-start gap-3 text-sm text-navy"><span className="font-bold text-gold-700" aria-hidden="true">{index + 1}.</span>{landmark}</li>)}</ol></section>}
              {activeTab === 'trivia' && <section className="space-y-3"><h3 className={sectionTitle}><Sparkles className="w-4 h-4 shrink-0 text-gold-700" aria-hidden="true" />Did-you-know trivia</h3><ul className="space-y-3">{cityInfo.funFacts.map(fact => <li key={fact} className="p-4 bg-saffron-50/20 border border-saffron-100/35 rounded-xl flex items-start gap-3"><BookOpen className="w-4 h-4 text-gold-700 mt-1 shrink-0" aria-hidden="true" /><p className="text-sm leading-relaxed text-navy-600">{fact}</p></li>)}</ul></section>}
            </div>
          </> : <p className="text-sm leading-relaxed text-navy-600">This directory entry provides a geographic location. Curated history and landmark notes are not available for this place yet.</p>}
        </div>}
      </div>
    </motion.aside>
  );
};
