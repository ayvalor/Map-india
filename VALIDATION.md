# Validation — 29 October 2026

Verified locally in Chromium-based Microsoft Edge using the production build, plus a separate Vite development check. These checks cover the changed flows; they are not a claim that every device or inherited educational fact has been audited.

## Build and data

- TypeScript project build and Vite production build passed.
- Oxlint: 17 files checked, zero diagnostics.
- `npm test`: five directory regression tests passed (IDs/coordinates/36-region coverage, unique educational links, historic Amaravati, Sri Vijaya Puram alias and feature filtering).
- 7,176 directory records; all 48 original educational destinations retain an explicit link. GeoNames license and import choices are documented in `DATA-SOURCES.md`.
- Dependency audit after compatible lockfile updates: zero reported vulnerabilities at the time of validation.

## Browser interactions

- All 36 states/UTs tested at widths **1440, 390 and 320 pixels**: 108 selections centered within 0.18 CSS pixels, with state bounds inside the map and no page or label overflow.
- Both mouse and keyboard activation of SVG states worked. Zoom, fit-state and reset controls worked.
- Every one of Uttar Pradesh's 525 available city names was reachable through the paginated list.
- A newly added city centered correctly, retained its selected label and displayed coordinates/source population without invented history.
- Legacy city selection during a delayed directory download preserved historic Amaravati instead of switching to the modern capital point.
- Search Escape, focus containment/restoration, arrow/Enter navigation and Bangalore alias matching passed. Search from the quiz returned to the map.
- Completed a five-question quiz; every question had four distinct answers, and answers locked after submission.
- Switching between quiz and map fetched each local dataset only once per session.
- Simulated HTTP 503 failures for both datasets displayed retry controls and recovered without reloading the page.
- Mobile details stayed below the map; city lists scroll within a bounded area. Touch city selection passed.
- Interrupted animated state transitions settled at the correct center.
- Assets and data loaded at the domain root and under a simulated `/Map-india/` static-host prefix. Vite development loaded with refresh-compatible CSP behavior; production retained its restrictive CSP.
- No page errors or console errors occurred in the successful production flows.

## Performance choices and limits

The 1.61 MB uncompressed directory loads asynchronously from local static assets. The main JavaScript bundle is about 437 kB (142 kB gzip); quiz code loads separately. Projected boundaries are memoized, map hover uses CSS, markers share a single path, and the UI limits map labels to 10/18 depending on viewport width. These are structural improvements, not a universal frame-rate guarantee. Safari and physical mobile hardware were not exercised in this run.
