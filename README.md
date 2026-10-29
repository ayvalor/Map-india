# The Bharat Atlas

An interactive India map and geography learning app built with React, TypeScript, D3 Geo, Framer Motion and Tailwind CSS.

## Explore

- Click a state or choose one from the menu to fit it in the center of the map. All 28 states and 8 union territories are accessible, including small island territories.
- Explore **7,176 city/town locations** across India. Each selected state has a searchable, paginated directory containing every available name. Click a place to center it and open its details.
- Map markers are batched into one SVG path. Labels stay at a readable size, with up to 10 on narrow viewports or 18 on wider maps; the selected city is always labeled. Use zoom to explore nearby locations.
- Search names and alternate spellings, including Indian scripts. Use arrow keys and Enter to select, or Escape to close.
- Read the original educational articles where available, or geographic coordinates and source information for other places. The five-question geography quiz remains available.
- On mobile, details appear below the map. On desktop, they occupy their own column without covering the selected state.

## Run locally

Use **Node.js 24** and npm. From this repository's root:

```sh
npm ci
npm run dev
```

Open the local URL printed by Vite. For a production preview:

```sh
npm run lint
npm test
npm run build
npm run preview -- --host 127.0.0.1 --port 4174
```

The deployable site is in `dist/`. Upload the **contents** of that folder to a static host. Relative asset URLs support both a domain root and a subdirectory such as `/Map-india/`; keep the directory URL's trailing slash. Opening source `index.html` directly from the filesystem is not supported.

The production HTML retains its Content Security Policy. Vite development removes the policy to allow its local refresh script and WebSocket. Fonts use Google Fonts, with local font fallbacks. Map and city data are bundled locally, so exploration does not call a third-party map API or require API keys.

## Data and coverage

The directory contains 7,175 GeoNames populated places/administrative seats and one original historical location. It is a countrywide gazetteer, **not a complete census of every village or legally designated city/town**. Population values from GeoNames have no reference year and are identified as source estimates. Existing educational descriptions are inherited project content, not newly verified statistics.

GeoNames data is used under **CC BY 4.0**. Attribution is included in the app footer, the directory metadata and [DATA-SOURCES.md](DATA-SOURCES.md). That document describes filtering, state mappings, corrections, source hashes and the reproducible import command. The existing map boundaries are retained; this project does not certify them as official or survey accurate.

## Code layout

```text
public/data/india_states.geojson   Existing state boundaries
public/data/india_cities.json      Countrywide directory and provenance
scripts/import-geonames.cjs       Rebuild directory from official source downloads
src/data/cities.ts                Validated, cached loader and name matching
src/data/educationalData.ts       Existing state profiles and city articles
src/components/Map/IndiaMap.tsx   Map interaction and state city directory
src/components/Map/mapGeometry.ts Projection, state fit and label placement
src/components/UI/               Header, details, search and lazy-loaded quiz
src/App.tsx                      Shared selection and responsive layout
```

Successful boundary and city fetches are cached for the session. Failed requests offer retry controls. Geometry is memoized, city rendering is bounded, and reduced-motion preferences are respected.
