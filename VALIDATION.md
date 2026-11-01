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

## Map styling and quiz update — 1 November 2026

- Removed browser focus/tap rectangles from zoomed SVG state and city controls; keyboard focus remains visible through geographic and label strokes. All 36 state paths computed `outline: none` with zero width. Focused, selected Andaman & Nicobar, Kerala, Rajasthan and Lakshadweep displayed without a rectangular frame. The original reported black frame was not reproducible before the change, so its precise browser-specific trigger remains unconfirmed.
- Replaced the BH badge with an IN badge on saffron, white and green, shared by the header and favicon. The logo remains visible on narrow screens.
- Expanded the quiz to 6,780 questions: 36 capitals, 168 landmarks, 6,545 city/state associations and 31 facts. Mixed rounds balance categories. Ambiguous city/state names and duplicate landmark associations are excluded; underlying educational entries were not independently re-audited.
- TypeScript and Vite production builds passed. Oxlint checked 18 files with zero diagnostics. All 12 directory/quiz regression tests passed, including unique answers, category balance, session history, exhaustion before repeats, ambiguity filtering and fallback pools.
- Completed a five-question Mixed round, a ten-question Landmarks round at 390 × 844, and a twenty-question City → State round at 320 × 740 in the in-app browser. Each round had unique questions and four distinct choices; answers locked after submission, and final scores matched feedback (1/5, 3/10 and 6/20 respectively).
- Play again and Change quiz options worked; session question history survived a reload and topic changes. The tested mobile layouts had no horizontal page overflow. No runtime errors were logged during these successful flows.
- Removed the unused root-level duplicate `QuizGame.tsx` after checking references and TypeScript project boundaries, plus unused CSS tokens/animations/glow classes. The active quiz component, source data, licenses, import script and tests remain in the repository.
