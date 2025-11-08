# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a live real-time data article showing CO₂ emissions savings due to FAA flight reductions during the US government shutdown that began on November 7, 2025. The page features a live counter starting at 6am ET that calculates real-time emissions savings from actual FAA-ordered flight reductions affecting 40 major US airports.

## Key Architecture

### Core Components
- **Live Counter**: `LiveShutdownSavingsCounter` class in `src/main.js` - Real-time CO₂ savings calculations
- **Equivalent Calculator**: `EquivalentCalculator` class in `src/components/EquivalentCalculator.js` - Converts CO₂ savings to understandable equivalents
- **Timeline & Charts**: D3.js-based data visualizations (planned components)
- **Affected Airports Map**: Interactive map showing 40 airports with FAA flight reductions

### Live Counter Logic
The counter starts at 6am ET November 7, 2025 and calculates:
- Baseline: 28,542 tons CO₂/hour (US domestic aviation)
- Current reduction: 4-10% (progressive scaling based on FAA schedule)
- Savings rate: Up to 1,142 tons CO₂/hour (0.32 tons/second)

### Data Sources
- Bureau of Transportation Statistics: Aviation emissions baseline
- FAA: Flight reduction orders and affected airports
- EPA: Greenhouse gas equivalencies calculator
- Real-world flight cancellation data from AP News

## Development Commands

### Local Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Deploy to GitHub Pages
npm run deploy
```

### Key Scripts
- `npm run dev` - Start Vite dev server on port 3000
- `npm run build` - Build production bundle to `dist/`
- `npm run preview` - Preview production build on port 4173

## Technology Stack

### Core Dependencies
- **GSAP**: Advanced scroll-based animations and ScrollTrigger
- **D3.js**: Data visualizations and charts
- **Luxon**: Date/time manipulation with timezone support
- **Tailwind CSS**: Utility-first styling

### Build Tools
- **Vite**: Modern build tool and dev server
- **PostCSS**: CSS processing with Tailwind
- **GitHub Actions**: Automated deployment to GitHub Pages

## Project Structure

```
src/
├── main.js                    # Main application entry point and LiveShutdownSavingsCounter
├── components/
│   └── EquivalentCalculator.js # CO₂ equivalent calculations
├── data/
│   └── affected-airports.json # 40 airports with flight reductions
└── styles/
    └── main.css              # Main stylesheet
```

## Key Implementation Details

### Time Zone Handling
All calculations use America/New_York timezone. The live counter starts from November 7, 2025 at 6:00 AM ET and updates every second.

### Progressive Reduction Schedule
The counter implements a progressive reduction schedule:
- Nov 7-10: 4% reduction
- Nov 11-12: 6% reduction
- Nov 13: 8% reduction
- Nov 14+: 10% reduction

### Performance Considerations
- Counter updates use `requestAnimationFrame` for smooth 60fps animations
- Intersection Observer API used to pause animations when scrolled out of view
- Efficient number formatting and caching for equivalent calculations

## Deployment

The project is configured for automatic GitHub Pages deployment via GitHub Actions. Pushing to the main branch triggers:
1. Build process with Vite
2. Deployment to GitHub Pages
3. Site available at `https://maxtkc.github.io/oops-we-saved-co2/`

## Development Notes

### Live Counter Updates
The counter calculates savings in real-time:
```javascript
const secondsElapsed = now.diff(startTime, 'seconds').seconds;
const hourlySavings = hourlyBaseline * currentReductionPercentage;
const totalSavings = secondsElapsed * (hourlySavings / 3600);
```

### Equivalent Calculations
CO₂ savings are converted to relatable equivalents:
- Cars not driven for a year
- Homes powered by solar for a month
- Trees that don't need to be planted
- Smartphones charged for a year
- Homes switching all bulbs to LED

### Responsive Design
The application is fully responsive with:
- Mobile-first design approach
- Touch-friendly interactions
- Optimized animations for mobile performance
- Simplified charts for smaller screens

## Important Files to Modify

### Updating Emissions Calculations
Edit `LiveShutdownSavingsCounter` in `src/main.js`:
- `hourlyBaseline`: Update baseline emissions
- `currentReductionPercentage`: Update reduction percentage
- Add new time-based reduction schedules

### Adding New Equivalents
Update `equivalents` object in `src/components/EquivalentCalculator.js`:
- Add new equivalent types with factors and icons
- Update `factor` values based on EPA calculations

### Adding Airport Data
Update `src/data/affected-airports.json` with new airport information including coordinates and reduction percentages.