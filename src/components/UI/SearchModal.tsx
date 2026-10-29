import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Search, X, MapPin, Compass, ArrowRight } from 'lucide-react';
import { educationalData } from '../../data/educationalData';
import { normalizePlaceName } from '../../data/cities';
import type { CityLocation } from '../../data/cities';

interface SearchResult { type: 'state' | 'city'; name: string; stateName: string; cityId: string | null; details: string; searchNames: string[] }
interface SearchModalProps {
  isOpen: boolean;
  cityDirectory?: CityLocation[];
  onClose: () => void;
  onSelect: (stateName: string, cityId: string | null) => void;
}
const emptyDirectory: CityLocation[] = [];
const stateIndex: SearchResult[] = Object.entries(educationalData).map(([stateName, state]) => ({
  type: 'state', name: state.name, stateName, cityId: null, searchNames: [normalizePlaceName(state.name), normalizePlaceName(stateName)],
  details: state.capital && state.capital !== 'N/A' ? `Capital: ${state.capital}` : 'State / union territory',
}));
const curatedIndex: SearchResult[] = Object.entries(educationalData).flatMap(([stateName, state]) => state.cities.map(city => ({
  type: 'city' as const, name: city.name, stateName, cityId: city.name, searchNames: [normalizePlaceName(city.name)], details: `City in ${stateName}`,
})));
const suggestions = ['Maharashtra', 'Rajasthan', 'Delhi', 'Ladakh', 'Kerala', 'Bengaluru'];
const focusRing = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-700';

function SearchDialog({ cityDirectory = emptyDirectory, onClose, onSelect }: Omit<SearchModalProps, 'isOpen'>) {
  const id = useId();
  const reducedMotion = useReducedMotion();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const resultRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const onCloseRef = useRef(onClose);
  useEffect(() => { onCloseRef.current = onClose; }, [onClose]);
  const searchIndex = useMemo<SearchResult[]>(() => [...stateIndex, ...(cityDirectory.length ? cityDirectory.map(city => ({
    type: 'city' as const, name: city.name, stateName: city.stateName, cityId: city.id,
    details: `City / town in ${city.stateName}`,
    searchNames: [...new Set([city.name, city.educationalName ?? '', ...(city.aliases ?? [])].filter(Boolean).map(normalizePlaceName))],
  })) : curatedIndex)], [cityDirectory]);
  const searchQuery = normalizePlaceName(query);
  const { results, total } = useMemo(() => {
    if (!searchQuery) return { results: [], total: 0 };
    const matches = searchIndex.filter(item => item.searchNames.some(name => name.includes(searchQuery)));
    const exact = (item: SearchResult) => item.searchNames.includes(searchQuery);
    const startsWith = (item: SearchResult) => item.searchNames.some(name => name.startsWith(searchQuery));
    return { results: [...matches.filter(exact), ...matches.filter(item => !exact(item) && startsWith(item)), ...matches.filter(item => !startsWith(item))].slice(0, 30), total: matches.length };
  }, [searchQuery, searchIndex]);

  useEffect(() => {
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const { overflow, paddingRight } = document.body.style;
    const scrollbar = Math.max(0, window.innerWidth - document.documentElement.clientWidth);
    document.body.style.overflow = 'hidden';
    if (scrollbar) document.body.style.paddingRight = `${parseFloat(getComputedStyle(document.body).paddingRight) + scrollbar}px`;
    const focusFrame = requestAnimationFrame(() => inputRef.current?.focus({ preventScroll: true }));
    const focusable = () => Array.from(dialogRef.current?.querySelectorAll<HTMLElement>(
      'button:not(:disabled), input:not(:disabled), a[href], [tabindex]:not([tabindex="-1"])',
    ) ?? []).filter(node => node.getClientRects().length > 0);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.isComposing) return;
      if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); onCloseRef.current(); return; }
      if (event.key !== 'Tab') return;
      const nodes = focusable(), first = nodes[0], last = nodes[nodes.length - 1];
      if (!first) { event.preventDefault(); dialogRef.current?.focus(); return; }
      const inside = dialogRef.current?.contains(document.activeElement);
      if (event.shiftKey && (!inside || document.activeElement === first)) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && (!inside || document.activeElement === last)) { event.preventDefault(); first.focus(); }
    };
    const containFocus = (event: FocusEvent) => {
      if (event.target instanceof Node && !dialogRef.current?.contains(event.target)) inputRef.current?.focus({ preventScroll: true });
    };
    document.addEventListener('keydown', onKeyDown, true);
    document.addEventListener('focusin', containFocus);
    return () => {
      cancelAnimationFrame(focusFrame);
      document.removeEventListener('keydown', onKeyDown, true);
      document.removeEventListener('focusin', containFocus);
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
      if (previousFocus?.isConnected && !previousFocus.closest('[inert]')) previousFocus.focus({ preventScroll: true });
    };
  }, []);

  const selectResult = (item: SearchResult) => { onSelect(item.stateName, item.cityId); onClose(); };
  const navigateResults = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    const next = event.key === 'ArrowDown' ? Math.min(index + 1, results.length - 1)
      : event.key === 'ArrowUp' ? index - 1 : event.key === 'Home' ? 0 : event.key === 'End' ? results.length - 1 : null;
    if (next === null) return;
    event.preventDefault();
    if (next < 0) inputRef.current?.focus(); else resultRefs.current[next]?.focus();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-4 sm:pt-[10dvh]">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reducedMotion ? 0 : 0.15 }}
        onClick={onClose} aria-hidden="true" className="absolute inset-0 bg-navy-950/40" />
      <motion.div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby={`${id}-title`} aria-describedby={`${id}-help`} tabIndex={-1}
        initial={{ opacity: 0, y: reducedMotion ? 0 : -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
        transition={{ duration: reducedMotion ? 0 : 0.15 }}
        className="relative flex w-full max-w-lg max-h-[calc(100dvh-1.5rem)] sm:max-h-[80dvh] min-h-0 flex-col overflow-hidden rounded-2xl sm:rounded-3xl border border-cream-200 bg-white shadow-2xl">
        <h2 id={`${id}-title`} className="sr-only">Find a state or city</h2>
        <div className="p-3 sm:p-5 flex items-center gap-2 sm:gap-3 border-b border-cream-100 shrink-0">
          <Search className="w-5 h-5 text-gold-700 shrink-0" aria-hidden="true" />
          <input ref={inputRef} type="search" value={query} onChange={event => setQuery(event.target.value)}
            aria-label="Search states, union territories, and cities" autoComplete="off" spellCheck={false}
            onKeyDown={event => {
              if (event.nativeEvent.isComposing) return;
              if (event.key === 'ArrowDown' && results.length) { event.preventDefault(); resultRefs.current[0]?.focus(); }
              else if (event.key === 'Enter' && results[0]) { event.preventDefault(); selectResult(results[0]); }
            }} placeholder="Search states or cities…"
            className={`min-w-0 min-h-11 w-full rounded bg-transparent border-none text-base text-navy placeholder-navy-600 ${focusRing}`} />
          <button type="button" onClick={onClose} aria-label="Close search" title="Close search"
            className={`w-11 h-11 shrink-0 inline-flex items-center justify-center hover:bg-cream-100 rounded-full text-navy-600 hover:text-navy transition-colors ${focusRing}`}><X className="w-5 h-5" aria-hidden="true" /></button>
        </div>
        <div className="min-h-0 overflow-y-auto overscroll-contain p-3 sm:p-4 space-y-1">
          <p role="status" className={searchQuery ? 'px-2 py-1 text-xs text-navy-600' : 'sr-only'}>{searchQuery ? `Showing ${results.length} of ${total} matches` : 'Type a state or city name to search'}</p>
          {results.length ? results.map((result, index) => (
            <button key={`${result.type}-${result.stateName}-${result.cityId ?? result.name}`} type="button" ref={node => { resultRefs.current[index] = node; }}
              onClick={() => selectResult(result)} onKeyDown={event => navigateResults(event, index)}
              className={`w-full min-h-14 flex items-center justify-between gap-3 p-3 hover:bg-cream-50 rounded-xl text-left group transition-colors ${focusRing}`}>
              <span className="flex min-w-0 items-center gap-3"><span className={`p-2 rounded-xl shrink-0 ${result.type === 'state' ? 'bg-saffron-100/40 text-saffron' : 'bg-navy/5 text-gold-700'}`}>
                {result.type === 'state' ? <Compass className="w-5 h-5" aria-hidden="true" /> : <MapPin className="w-5 h-5" aria-hidden="true" />}
              </span><span className="min-w-0"><span className="block text-sm font-bold text-navy break-words">{result.name}</span><span className="block text-xs text-navy-600 mt-1 break-words">{result.details}</span></span></span>
              <ArrowRight className="w-4 h-4 text-gold-700 shrink-0" aria-hidden="true" />
            </button>
          )) : searchQuery ? <p className="p-5 text-center text-sm text-navy-600 leading-relaxed">No matching states or cities found. Try “Jaipur”, “Kerala”, or “Ladakh”.</p> : (
            <div className="p-2 space-y-3"><h3 className="text-xs font-bold text-gold-700 uppercase tracking-wide">Quick suggestions</h3><div className="flex flex-wrap gap-2">
              {suggestions.map(item => <button key={item} type="button" onClick={() => { setQuery(item); inputRef.current?.focus(); }} className={`min-h-11 px-3 py-2 bg-cream-50 hover:bg-cream-100 text-sm font-semibold text-navy-600 rounded-xl border border-cream-200 transition-colors ${focusRing}`}>{item}</button>)}
            </div></div>
          )}
        </div>
        <p id={`${id}-help`} className="shrink-0 px-4 py-3 border-t border-cream-100 bg-cream-50/50 text-xs leading-relaxed text-navy-600">Use ↑ / ↓ to browse results, Enter to select, or Esc to close. Refine your search to see more matches.</p>
      </motion.div>
    </div>
  );
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, cityDirectory, onClose, onSelect }) => (
  <AnimatePresence>{isOpen && <SearchDialog key="search" cityDirectory={cityDirectory} onClose={onClose} onSelect={onSelect} />}</AnimatePresence>
);
