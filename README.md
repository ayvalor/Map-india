# The Bharat Atlas

A premium, interactive digital atlas and geography learning portal designed to international standards. Featuring a light-only design system, official boundary lines, and educational quiz games, this application is perfect for school students (K-12).

## Tech Stack
* **Vite + React (TypeScript)**: Snappy local developer environment and lightweight bundles.
* **Tailwind CSS v4**: Modern CSS-first utility compilation.
* **Framer Motion**: Smooth, hardware-accelerated fluid transitions.
* **D3-Geo**: Secure SVG mapping and projection calculations.
* **Lucide React**: Outline iconography.

## Design Philosophy
* **Regal Serif Typography**: Headings styled in `Cinzel` serif font.
* **Jakarta Sans Typography**: Body copy styled in `Plus Jakarta Sans`.
* **National Light Theme**: Pure white background, subtle cream borders, deep navy blue accents, rich saffron, and muted gold highlights.
* **No Flashy Colors**: A dignified, clean visual representation.

## Structure
```
app/
├── public/
│   ├── data/
│   │   └── india_states.geojson  # Local map coordinates (Survey of India compliant)
│   └── favicon.svg               # Portal icon
├── src/
│   ├── components/
│   │   ├── Map/
│   │   │   └── IndiaMap.tsx      # SVG projection & zoom coordinator
│   │   └── UI/
│   │       ├── AshokaEmblem.tsx  # High-quality emblem vector
│   │       ├── FlagSection.tsx   # Pingali Venkayya flag symbolism
│   │       ├── DetailsDrawer.tsx # Slide drawer with statistics & trivia
│   │       ├── SearchModal.tsx   # Global search dialog
│   │       ├── QuizGame.tsx      # Geography game
│   │       └── Header.tsx        # Top-level branding & navigation
│   ├── data/
│   │   └── educationalData.ts    # Curated school database
│   ├── App.tsx                   # Main layout coordinator
│   ├── index.css                 # Custom @theme declarations
│   └── main.tsx                  # Mount point
├── index.html                    # SEO and security headers
├── package.json
└── vite.config.ts
```

## Running the Portal Locally

1. Open your terminal in the `app` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the local development server:
   ```bash
   npm run dev
   ```
4. Open the displayed URL (typically `http://localhost:5173`) in your browser.

## Building for Production

Compile static assets for global hosting (GitHub Pages, Netlify, Cloudflare, etc.):
```bash
npm run build
```
The output will be generated under the `dist` folder.
