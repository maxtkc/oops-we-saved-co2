# Oops! We Saved CO₂

A live real-time data article showing CO₂ emissions savings due to FAA flight reductions during the US government shutdown.

## 🌍 Live Demo

[View the live site](https://maxtkc.github.io/oops-we-saved-co2/) (once deployed)

## 📊 What This Shows

- **Live CO₂ Savings Counter**: Real-time calculation of emissions saved since 6am ET, November 7, 2025
- **Affected Airports Map**: 40 major airports with FAA-ordered flight reductions
- **Interactive Equivalents**: Understand the impact through relatable comparisons
- **Real-Time Timeline**: Watch the savings accumulate over time

## 🚀 Key Features

- **Real-Time Data**: Live counter updating every second
- **Responsive Design**: Works on all devices
- **Interactive Visualizations**: D3.js charts and maps
- **Smooth Animations**: GSAP ScrollTrigger animations
- **Social Sharing**: Share current savings statistics

## 🛠️ Technology Stack

- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Animations**: GSAP with ScrollTrigger
- **Visualizations**: D3.js for charts and maps
- **Styling**: Tailwind CSS
- **Time Handling**: Luxon
- **Deployment**: GitHub Pages

## 📁 Project Structure

```
oops-we-saved-co2/
├── index.html                 # Main page
├── src/
│   ├── styles/
│   │   └── main.css           # Main stylesheet
│   ├── components/
│   │   ├── AffectedAirportsMap.js
│   │   ├── EquivalentCalculator.js
│   │   └── TimelineChart.js
│   ├── data/
│   │   └── affected-airports.json
│   └── main.js               # Main application
├── .github/
│   └── workflows/
│       └── deploy.yml        # GitHub Pages deployment
├── package.json
├── vite.config.js
└── README.md
```

## 🧮 How the Math Works

### Baseline Calculations
- **US Domestic Aviation**: 28,542 tons CO₂ per hour
- **Current Reduction**: 4% (as ordered by FAA)
- **Savings Rate**: 1,142 tons CO₂ per hour (0.32 tons per second)

### Live Formula
```javascript
const currentTime = DateTime.now().setZone('America/New_York');
const secondsElapsed = currentTime.diff(startTime, 'seconds').seconds;
const totalSavings = secondsElapsed * (hourlySavings / 3600);
```

## 🗂️ Data Sources

- **FAA**: Flight reduction orders and affected airports
- **Bureau of Transportation Statistics**: Domestic aviation emissions baseline
- **EPA**: Greenhouse gas equivalencies calculator
- **AP News**: Current flight cancellation numbers

## 🚀 Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/oops-we-saved-co2.git
   cd oops-we-saved-co2
   ```

2. Open `index.html` in your browser or use a local server:
   ```bash
   # Python 3
   python -m http.server 8000

   # Node.js (if npm install works)
   npm run dev
   ```

3. The site will be available at `http://localhost:8000`

## 📱 Mobile Optimization

- Fully responsive design
- Touch-friendly interactions
- Optimized animations for mobile performance
- Simplified charts for smaller screens

## ♿ Accessibility

- Semantic HTML5 structure
- ARIA labels and descriptions
- Keyboard navigation support
- Screen reader compatible
- High contrast mode support
- Reduced motion preferences respected

## 🔧 Customization

### Updating Emissions Calculations
Edit the `LiveShutdownSavingsCounter` class in `src/main.js`:

```javascript
this.hourlyBaseline = 28542; // Update baseline
this.currentReductionPercentage = 0.04; // Update reduction percentage
```

### Adding New Airports
Update `src/data/affected-airports.json` with new airport data:

```json
{
  "city": "Airport City",
  "code": "ABC",
  "state": "ST",
  "coordinates": [lat, lng],
  "reduction": "4-10%",
  "flights_affected": 100
}
```

### Customizing Equivalents
Edit the `equivalents` object in `src/components/EquivalentCalculator.js`:

```javascript
cars: {
  factor: 0.00022, // Update calculation factor
  unit: 'cars not driven for a year',
  icon: '🚗',
  color: '#ef4444'
}
```

## 🚀 Deployment

This project is automatically deployed to GitHub Pages using GitHub Actions.

To deploy manually:
1. Push changes to the main branch
2. GitHub Actions will automatically build and deploy
3. Site will be available at `https://yourusername.github.io/oops-we-saved-co2/`

## 📈 Performance

- **Lighthouse Score**: 90+ (Performance, Accessibility, Best Practices, SEO)
- **Bundle Size**: Optimized for fast loading
- **Real-Time Updates**: Efficient counter updates using requestAnimationFrame
- **Chart Performance**: Virtualized data points for smooth animations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Push to the branch: `git push origin feature-name`
5. Open a pull request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🔗 Links

- [Live Demo](https://maxtkc.github.io/oops-we-saved-co2/)
- [FAA Flight Reductions](https://www.faa.gov/)
- [EPA Climate Equivalencies](https://www.epa.gov/greenchemistry/greenhouse-gas-equivalencies-calculator)
- [Bureau of Transportation Statistics](https://www.bts.gov/)

## 💬 About

This project demonstrates the environmental impact of operational changes in aviation. While government shutdowns create challenges, they also provide real-world data about how coordinated action can reduce emissions.

The calculations are based on publicly available data and EPA greenhouse gas equivalencies. All sources are cited for transparency.