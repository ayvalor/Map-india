# City directory sources and coverage

The application includes **7,176 locations** across all **36 states and union territories** in its existing map: **7,175 GeoNames records** and **one original educational location**. Search accepts the source's alternate names, including Indian scripts and historical names. This is a broad city/town gazetteer, **not a claim to contain every Indian settlement or every officially classified census town**.

## Attribution and license

Contains information from [GeoNames](https://www.geonames.org), available under [Creative Commons Attribution 4.0](https://creativecommons.org/licenses/by/4.0/). The source has been filtered, assigned to the application's state names, renamed where documented below, and combined with the project's existing educational locations. Retain this attribution and the license link when redistributing this derived directory. The app footer also credits GeoNames.

Primary sources accessed on **29 October 2026**:

- [cities500.zip](https://download.geonames.org/export/dump/cities500.zip) — the downloaded worldwide point gazetteer, 13,911,957 bytes; only country code `IN` is imported.
- [admin1CodesASCII.txt](https://download.geonames.org/export/dump/admin1CodesASCII.txt) — state/UT membership and names.
- [GeoNames export documentation and license](https://download.geonames.org/export/dump/readme.txt) — schema, WGS84 coordinates, coverage and CC BY 4.0 statement.
- [GeoNames feature definitions](https://www.geonames.org/export/codes.html) — populated-place classifications.

Source ZIP SHA-256: `d1e13678275b108d6dd0a5a35dcaee59ca2f0e3f3a6fa56a23c796f497ecebed`.

## Import choices

The snapshot contains 7,301 `IN` records. We retain `PPL`, `PPLC`, `PPLA`, `PPLA2`, `PPLA3`, `PPLA4` and `PPLA5` (inhabited populated places and administrative seats). We exclude 57 populated-place sections (`PPLX`), 8 abandoned places (`PPLQ`), 54 localities (`PPLL`), 5 farm villages (`PPLF`), 1 religious populated place (`PPLR`) and 1 group of populated places (`PPLS`). These exclusions prevent neighborhoods, abandoned settlements and loose locality groupings from being presented as individual cities/towns. GeoNames classification is retained as `featureCode`; it is not an Indian statutory urban designation.

State membership follows the source's admin1 code, not simplified map polygons. Two display-name mappings align it with the existing GeoJSON: `Jammu and Kashmir` → `Jammu & Kashmir`; `Andaman and Nicobar` → `Andaman & Nicobar`. All 36 source administrative codes map to an existing region. The existing boundary geometry has not been replaced or independently certified by this import.

Coordinates are `[longitude, latitude]` in WGS84. Names prefer the source's ASCII spelling, while alternate names retain Unicode. A zero source population is omitted, because it does not establish that a place has no inhabitants. Other population values are shown as **GeoNames estimates with an unspecified reference year**, not as current population or a certified census count. The snapshot does not provide a population reference year.

### Preserved educational content and corrections

Of the existing 48 educational locations, 47 match a same-state GeoNames name/alias within 15 km. They keep an explicit `educationalName` link; no new historical descriptions, landmarks or facts are generated for the remaining directory records.

The existing Andhra Pradesh article's coordinates and Buddhist landmarks describe **historic Amaravati**, about 18 km from the GeoNames modern-capital point. It remains a separate `curated-andhra-pradesh-amaravati` location, displayed as **Amaravati (historic town)**. This avoids merging two distinct positions solely because their names match. The original educational descriptions are inherited project content, not claims sourced to GeoNames.

Port Blair's display name is corrected to **Sri Vijaya Puram**, following the [Ministry of Home Affairs announcement of 13 September 2024](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2054647). Port Blair remains an alias. The related educational capital name is updated as well.

The five programmatically generated UT city entries previously copied territory-wide area/population figures into city fields and supplied generic invented landmarks/history. Those unsupported city fields are now empty. Territory records remain separate. Missing educational fields should be omitted in the UI.

## Files and refresh

- `public/data/india_cities.json`: compact derived data and provenance, including access/generation timestamps, hash, filter counts and totals for each state.
- `src/data/cities.ts`: typed loader, validation, retryable promise cache, name normalization and educational matching.
- `scripts/import-geonames.cjs`: reproducible local importer using Node's standard library; requires Node 24 or later. It does not fetch data or require an API key.

Download the two source files above into a local folder, preserving their names, then run from the project root:

```sh
node scripts/import-geonames.cjs /path/to/download-folder
npm run build
```

Review the generated metadata and counts after an update. `retrievedAt` records the ZIP's local modification time; download into a fresh file so it reflects the access date. `generatedAt` records the import time. GeoNames data changes daily, so future counts and hashes may differ. The importer fails on unknown administrative codes or duplicate IDs rather than silently dropping unmatched regions.
