// CO2 Equivalent Calculator Component
class EquivalentCalculator {
    constructor() {
        // EPA Greenhouse Gas Equivalencies (approximate values)
        this.equivalents = {
            cars: {
                factor: 0.00022, // cars not driven for one year per ton CO2
                unit: 'cars not driven for a year',
                icon: '🚗',
                color: '#ef4444'
            },
            homes: {
                factor: 0.11, // homes powered by solar for one month per ton CO2
                unit: 'homes powered by solar for one month',
                icon: '🏠',
                color: '#3b82f6'
            },
            trees: {
                factor: 16.5, // trees not needing to be planted per ton CO2
                unit: "trees that don't need to be planted",
                icon: '🌳',
                color: '#10b981'
            },
            smartphones: {
                factor: 1230, // smartphones charged for one year per ton CO2
                unit: 'smartphones charged for one year',
                icon: '📱',
                color: '#8b5cf6'
            },
            led: {
                factor: 1.8, // homes switching all bulbs to LED per ton CO2
                unit: 'homes switching all bulbs to LED',
                icon: '💡',
                color: '#fbbf24'
            },
            energy: {
                factor: 0.00012, // homes' annual electricity use per ton CO2
                unit: "homes' annual electricity use",
                icon: '🔋',
                color: '#06b6d4'
            }
        };

        this.selectedEquivalent = 'cars';
        this.animationDuration = 1000; // 1 second
        this.currentValues = {};

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeValues();
    }

    setupEventListeners() {
        // Equivalent selector buttons
        const selectors = document.querySelectorAll('.equivalent-selector');
        selectors.forEach(button => {
            button.addEventListener('click', (e) => {
                const equivalent = e.target.dataset.equivalent;
                if (equivalent) {
                    this.setSelectedEquivalent(equivalent);
                }
            });
        });
    }

    initializeValues() {
        // Initialize all equivalent values to 0
        Object.keys(this.equivalents).forEach(key => {
            this.currentValues[key] = 0;
        });
    }

    calculateEquivalents(tonsCO2) {
        const results = {};

        Object.entries(this.equivalents).forEach(([key, config]) => {
            const value = Math.round(tonsCO2 * config.factor);
            results[key] = {
                value: value,
                formattedValue: this.formatNumber(value),
                unit: config.unit,
                icon: config.icon,
                color: config.color
            };
        });

        return results;
    }

    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        } else {
            return num.toLocaleString();
        }
    }

    updateDisplay(tonsCO2) {
        const equivalents = this.calculateEquivalents(tonsCO2);

        Object.entries(equivalents).forEach(([key, data]) => {
            const element = document.querySelector(`[data-equivalent="${key}"]`);
            if (element) {
                this.animateCounter(element, data.value, key);
            }

            // Update unit text
            const unitElement = document.querySelector(`[data-equivalent="${key}"]`)?.closest('.equivalent-item')?.querySelector('.equivalent-unit');
            if (unitElement) {
                unitElement.textContent = data.unit;
            }
        });
    }

    animateCounter(element, targetValue, key) {
        const startValue = this.currentValues[key] || 0;
        const duration = this.animationDuration;
        const startTime = performance.now();

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function (ease-out)
            const easeOut = 1 - Math.pow(1 - progress, 3);

            const currentValue = Math.floor(startValue + (targetValue - startValue) * easeOut);

            // Format and display value
            if (targetValue >= 1000000) {
                element.textContent = (currentValue / 1000000).toFixed(1) + 'M';
            } else if (targetValue >= 1000) {
                element.textContent = (currentValue / 1000).toFixed(1) + 'K';
            } else {
                element.textContent = currentValue.toLocaleString();
            }

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                this.currentValues[key] = targetValue;
            }
        };

        requestAnimationFrame(animate);
    }

    setSelectedEquivalent(equivalent) {
        if (this.equivalents[equivalent]) {
            this.selectedEquivalent = equivalent;
            this.highlightSelectedEquivalent(equivalent);
        }
    }

    highlightSelectedEquivalent(equivalent) {
        // Remove all highlights
        document.querySelectorAll('.equivalent-item').forEach(item => {
            item.classList.remove('ring-4', 'ring-co2-green', 'bg-green-50');
        });

        // Add highlight to selected
        const selectedItem = document.querySelector(`[data-equivalent="${equivalent}"]`)?.closest('.equivalent-item');
        if (selectedItem) {
            selectedItem.classList.add('ring-4', 'ring-co2-green', 'bg-green-50');
        }

        // Update button states
        document.querySelectorAll('.equivalent-selector').forEach(button => {
            button.classList.remove('bg-co2-green', 'text-white');
            button.classList.add('bg-white', 'text-co2-green');
        });

        const selectedButton = document.querySelector(`[data-equivalent="${equivalent}"]`);
        if (selectedButton) {
            selectedButton.classList.remove('bg-white', 'text-co2-green');
            selectedButton.classList.add('bg-co2-green', 'text-white');
        }
    }

    // Get detailed breakdown for sharing
    getDetailedBreakdown(tonsCO2) {
        const equivalents = this.calculateEquivalents(tonsCO2);
        const selected = equivalents[this.selectedEquivalent];

        return {
            totalTons: Math.floor(tonsCO2).toLocaleString(),
            selectedEquivalent: selected,
            allEquivalents: Object.entries(equivalents).map(([key, data]) => ({
                type: key,
                ...data
            }))
        };
    }

    // Create shareable text
    createShareableText(tonsCO2) {
        const breakdown = this.getDetailedBreakdown(tonsCO2);
        const selected = breakdown.selectedEquivalent;

        return `${breakdown.totalTons} tons of CO₂ saved = ${selected.formattedValue} ${selected.unit} because of the government shutdown!`;
    }

    // Method to add time-based calculations
    getTimeBasedEquivalents(tonsCO2, timeFrame = 'hour') {
        const multipliers = {
            second: 1,
            minute: 60,
            hour: 3600,
            day: 86400,
            week: 604800,
            month: 2628000,
            year: 31536000
        };

        const multiplier = multipliers[timeFrame] || 1;
        const adjustedTons = tonsCO2 * multiplier;

        return this.calculateEquivalents(adjustedTons);
    }

    // Interactive calculator method
    createInteractiveCalculator() {
        const calculatorContainer = document.createElement('div');
        calculatorContainer.className = 'bg-white rounded-lg p-6 mt-8';
        calculatorContainer.innerHTML = `
            <h3 class="text-xl font-semibold mb-4">Calculate Your Impact</h3>
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        Time Frame
                    </label>
                    <select id="timeframe-select" class="w-full p-2 border border-gray-300 rounded-md">
                        <option value="second">Per Second</option>
                        <option value="minute">Per Minute</option>
                        <option value="hour" selected>Per Hour</option>
                        <option value="day">Per Day</option>
                        <option value="week">Per Week</option>
                        <option value="month">Per Month</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        Equivalent Type
                    </label>
                    <select id="equivalent-select" class="w-full p-2 border border-gray-300 rounded-md">
                        ${Object.entries(this.equivalents).map(([key, config]) =>
                            `<option value="${key}">${config.icon} ${config.unit}</option>`
                        ).join('')}
                    </select>
                </div>
                <div id="calculator-result" class="text-lg font-semibold text-co2-green">
                    Select options to see calculation
                </div>
            </div>
        `;

        // Add event listeners
        const timeframeSelect = calculatorContainer.querySelector('#timeframe-select');
        const equivalentSelect = calculatorContainer.querySelector('#equivalent-select');
        const result = calculatorContainer.querySelector('#calculator-result');

        const updateCalculator = () => {
            const currentSavings = window.liveCounter?.getCurrentSavings() || 0;
            const timeFrame = timeframeSelect.value;
            const equivalent = equivalentSelect.value;

            const equivalents = this.getTimeBasedEquivalents(currentSavings, timeFrame);
            const selected = equivalents[equivalent];

            result.textContent = `${selected.formattedValue} ${selected.unit} ${timeFrame}`;
        };

        timeframeSelect.addEventListener('change', updateCalculator);
        equivalentSelect.addEventListener('change', updateCalculator);

        // Update every second
        setInterval(updateCalculator, 1000);

        return calculatorContainer;
    }
}

// Export for global access
window.EquivalentCalculator = EquivalentCalculator;