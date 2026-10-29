/// <reference types="vite/client" />
import { educationalData } from './educationalData';
import type { CityData } from './educationalData';

/** A gazetteer location, not a fabricated educational article. */
export interface CityLocation {
  id: string;
  name: string;
  coordinates: [number, number]; // WGS84 longitude, latitude
  stateName: string;
  population?: number; // GeoNames value; its census/reference year is unspecified.
  aliases?: string[];
  educationalName?: string;
  source: 'geonames' | 'curated';
  featureCode?: string;
}

export const CITY_DIRECTORY_SOURCE = {
  name: 'GeoNames cities500 · India',
  url: 'https://download.geonames.org/export/dump/',
  license: 'CC BY 4.0',
  licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
  coverage: 'Populated places and administrative seats from GeoNames cities500, supplemented by the original educational locations. Neighborhoods and abandoned places are excluded. This is not a complete census of every Indian settlement.',
} as const;

export function normalizePlaceName(value: string): string {
  return value.normalize('NFKD').replace(/\p{M}/gu, '').toLocaleLowerCase('en')
    .replace(/&/g, ' and ').replace(/[^\p{L}\p{N}]+/gu, ' ').trim().replace(/\s+/g, ' ');
}

function distanceKm(a: [number, number], b: [number, number]): number {
  const radians = Math.PI / 180;
  return Math.hypot((a[0] - b[0]) * Math.cos((a[1] + b[1]) * 0.5 * radians), a[1] - b[1]) * 111.195;
}

/** Resolve only a matching existing article; never infer history or landmarks. */
export function findEducationalCity(city: CityLocation): CityData | undefined {
  const curated = educationalData[city.stateName]?.cities ?? [];
  if (city.educationalName) {
    const explicit = curated.find(item => item.name === city.educationalName);
    if (explicit) return explicit;
  }
  // Import-time matching is one-to-one. Nearby namesakes must not reuse an article.
  if (city.source === 'geonames') return undefined;
  const names = new Set([city.name, ...(city.aliases ?? [])].map(normalizePlaceName));
  return curated.filter(item => names.has(normalizePlaceName(item.name)) && distanceKm(item.coordinates, city.coordinates) <= 15)
    .sort((a, b) => distanceKm(a.coordinates, city.coordinates) - distanceKm(b.coordinates, city.coordinates))[0];
}

const stateIndexes = new WeakMap<CityLocation[], Map<string, CityLocation[]>>();

/** Stable per-state arrays, cached for the shared directory instance. */
export function getCitiesForState(cities: CityLocation[], stateName: string): CityLocation[] {
  let index = stateIndexes.get(cities);
  if (!index) {
    index = new Map();
    for (const city of cities) {
      const list = index.get(city.stateName) ?? [];
      list.push(city);
      index.set(city.stateName, list);
    }
    stateIndexes.set(cities, index);
  }
  return index.get(stateName) ?? [];
}

function isCityLocation(value: unknown): value is CityLocation {
  if (!value || typeof value !== 'object') return false;
  const city = value as Partial<CityLocation>;
  const coordinates = city.coordinates;
  return typeof city.id === 'string' && city.id.length > 0 &&
    typeof city.name === 'string' && city.name.length > 0 &&
    typeof city.stateName === 'string' && Object.prototype.hasOwnProperty.call(educationalData, city.stateName) &&
    Array.isArray(coordinates) && coordinates.length === 2 &&
    Number.isFinite(coordinates[0]) && Number.isFinite(coordinates[1]) &&
    Math.abs(coordinates[0]) <= 180 && Math.abs(coordinates[1]) <= 90 &&
    (city.population === undefined || (Number.isFinite(city.population) && city.population >= 0)) &&
    (city.aliases === undefined || (Array.isArray(city.aliases) && city.aliases.every(alias => typeof alias === 'string'))) &&
    (city.source === 'geonames' || city.source === 'curated');
}

let directoryRequest: Promise<CityLocation[]> | undefined;

/** One asynchronous local fetch shared by map, search and details; failures can retry. */
export function loadCityDirectory(): Promise<CityLocation[]> {
  if (!directoryRequest) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30_000);
    directoryRequest = fetch(`${import.meta.env.BASE_URL}data/india_cities.json`, { signal: controller.signal })
      .then(async response => {
        if (!response.ok) throw new Error(`City directory could not load (${response.status}).`);
        const payload: unknown = await response.json();
        const cities: unknown = payload && typeof payload === 'object' && 'cities' in payload ? payload.cities : undefined;
        if (!Array.isArray(cities) || !cities.length || !cities.every(isCityLocation)) {
          throw new Error('City directory has an invalid or unsupported format.');
        }
        const unique = new Set(cities.map(city => city.id));
        if (unique.size !== cities.length) throw new Error('City directory contains duplicate location IDs.');
        return cities;
      })
      .catch((error: unknown) => {
        directoryRequest = undefined;
        throw error;
      })
      .finally(() => clearTimeout(timeout));
  }
  return directoryRequest;
}
