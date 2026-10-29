import { geoMercator, geoPath } from 'd3-geo';
import type { FeatureCollection, Geometry } from 'geojson';

export type IndiaGeoData = FeatureCollection<Geometry, { ST_NM: string }>;
export interface MapSize { width: number; height: number }
export interface MapTransform { x: number; y: number; k: number }
export interface LabelPoint { id: string; name: string; x: number; y: number }
export interface CityLabel extends LabelPoint { labelX: number; labelY: number; width: number; height: number; lines: string[] }

export function buildMapGeometry(data: IndiaGeoData | null, { width, height }: MapSize) {
  if (!data) return null;
  const projection = geoMercator().fitExtent([[22, 18], [width - 22, height - 18]], data);
  const path = geoPath(projection);
  const shapes = data.features.map(feature => ({
    name: feature.properties.ST_NM,
    path: path(feature) || '',
    bounds: path.bounds(feature),
  }));
  return { projection, shapes, byName: new Map(shapes.map(shape => [shape.name, shape])) };
}

export function fitState(bounds: [[number, number], [number, number]] | undefined, size: MapSize): MapTransform {
  if (!bounds) return { x: 0, y: 0, k: 1 };
  const [[x0, y0], [x1, y1]] = bounds;
  const k = Math.max(1, Math.min((size.width - 104) / Math.max(0.01, x1 - x0), (size.height - 100) / Math.max(0.01, y1 - y0)));
  return { x: size.width / 2 - k * (x0 + x1) / 2, y: size.height / 2 - k * (y0 + y1) / 2, k };
}

// Labels live in screen coordinates, outside the scaled geography group.
// Greedy placement tests nearby positions then edge lanes to avoid overlaps.
export function layoutCityLabels(points: LabelPoint[], size: MapSize): CityLabel[] {
  const placed: CityLabel[] = [];
  for (const point of points) {
    const width = Math.min(230, size.width - 20, Math.max(52, point.name.length * 7.3 + 18));
    const maxCharacters = Math.max(6, Math.floor((width - 18) / 7.3 + 1e-6));
    const lines: string[] = [];
    let line = '';
    for (const word of point.name.split(/\s+/)) {
      if (word.length > maxCharacters) {
        if (line) lines.push(line);
        for (let index = 0; index < word.length; index += maxCharacters) lines.push(word.slice(index, index + maxCharacters));
        line = '';
      } else if (line && line.length + word.length + 1 > maxCharacters) { lines.push(line); line = word; }
      else line += `${line ? ' ' : ''}${word}`;
    }
    if (line) lines.push(line);
    const height = 25 + (lines.length - 1) * 15;
    const candidates = [
      [point.x + 11, point.y - height / 2], [point.x - width - 11, point.y - height / 2],
      [point.x - width / 2, point.y - height - 12], [point.x - width / 2, point.y + 12],
      [point.x + 11, point.y - height - 12], [point.x - width - 11, point.y + 12],
    ];
    for (let y = 10; y < size.height - height - 10; y += height + 9) candidates.push([10, y], [size.width - width - 10, y]);
    let best = { x: 10, y: 10, score: Infinity };
    for (const [candidateX, candidateY] of candidates) {
      const x = Math.max(8, Math.min(size.width - width - 8, candidateX));
      const y = Math.max(8, Math.min(size.height - height - 8, candidateY));
      const overlap = placed.reduce((sum, other) => sum + Math.max(0, Math.min(x + width + 6, other.labelX + other.width + 6) - Math.max(x, other.labelX)) * Math.max(0, Math.min(y + height + 6, other.labelY + other.height + 6) - Math.max(y, other.labelY)), 0);
      const score = overlap * 10000 + Math.hypot(x + width / 2 - point.x, y + height / 2 - point.y);
      if (score < best.score) best = { x, y, score };
    }
    placed.push({ ...point, labelX: best.x, labelY: best.y, width, height, lines });
  }
  return placed;
}
