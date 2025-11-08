// Main application entry point
// CSS is loaded via link tag in HTML

// Global variables
let liveCounter = null;
let equivalentCalculator = null;

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

async function initializeApp() {
    try {
        // Hide loading screen
        setTimeout(() => {
            const loadingScreen = document.getElementById('loading-screen');
            if (loadingScreen) {
                loadingScreen.classList.add('hidden');
            }
        }, 1000);

        // Initialize all components
        initializeLiveCounter();
        initializeComponents();
        initializeEventListeners();

        // Initialize scroll-based animations
        initializeScrollAnimations();

        console.log('Application initialized successfully');
    } catch (error) {
        console.error('Error initializing application:', error);
    }
}


// Live CO2 savings counter
class LiveShutdownSavingsCounter {
    constructor() {
        // Use luxon from CDN (window.luxon)
        this.DateTime = window.luxon.DateTime;

        // Set start time to 6am ET Friday, November 7, 2025
        this.startTime = this.DateTime.fromISO('2025-11-07T06:00:00-05:00');

        // Emissions estimates (based on the PLAN)
        this.hourlyBaseline = 28542; // tons CO2 per hour (US domestic flights)
        this.currentReductionPercentage = 0.04; // 4% reduction
        this.maxReductionPercentage = 0.10; // FAA scaling to 10%
        this.affectedAirports = 40; // Number of airports affected

        // Current cancellations (from AP News data)
        this.currentCancellations = 815;

        // Counter elements
        this.counters = {};

        // Initialize counter
        this.init();
    }

    init() {
        // Create custom countup functions since we're using CDN
        this.createCounters();
        this.startCounters();
    }

    createCounters() {
        // Simple counter animation function
        const animateCounter = (element, target, duration = 2000) => {
            const start = parseFloat(element.textContent) || 0;
            const increment = (target - start) / (duration / 16);
            let current = start;

            const updateCounter = () => {
                current += increment;
                if ((increment > 0 && current >= target) || (increment < 0 && current <= target)) {
                    element.textContent = target.toLocaleString('en-US', {
                        maximumFractionDigits: 0
                    });
                } else {
                    element.textContent = current.toLocaleString('en-US', {
                        maximumFractionDigits: 0
                    });
                    requestAnimationFrame(updateCounter);
                }
            };

            updateCounter();
        };

        // Store elements for updates
        this.counters = {
            savings: document.getElementById('savings-counter'),
            rate: document.getElementById('rate-counter'),
            airports: document.getElementById('airports-counter'),
            cancellations: document.getElementById('cancellations-counter'),
            elapsedTime: document.getElementById('elapsed-time'),
            shareSavings: document.getElementById('share-savings-amount'),
            shareTime: document.getElementById('share-time-elapsed')
        };
    }

    getCurrentReductionPercentage() {
        const now = this.DateTime.now().setZone('America/New_York');
        const currentHour = now.hour;
        const currentDay = now.weekday; // 1=Monday, 7=Sunday

        // Define the progressive reduction schedule
        const nov7 = this.DateTime.fromISO('2025-11-07T00:00:00-05:00');
        const nov11 = this.DateTime.fromISO('2025-11-11T00:00:00-05:00');
        const nov13 = this.DateTime.fromISO('2025-11-13T00:00:00-05:00');
        const nov14 = this.DateTime.fromISO('2025-11-14T00:00:00-05:00');

        if (now < nov7) {
            return 0; // No reduction before Nov 7
        } else if (now >= nov7 && now < nov11) {
            return 0.04; // 4% from Nov 7-10
        } else if (now >= nov11 && now < nov13) {
            return 0.06; // 6% from Nov 11-12
        } else if (now >= nov13 && now < nov14) {
            return 0.08; // 8% on Nov 13
        } else {
            return 0.10; // 10% from Nov 14 onwards
        }
    }

    getCurrentSavings() {
        const now = this.DateTime.now().setZone('America/New_York');
        const secondsElapsed = Math.max(0, now.diff(this.startTime, 'seconds').seconds);
        const currentReduction = this.getCurrentReductionPercentage();
        const hourlySavings = this.hourlyBaseline * currentReduction;
        return secondsElapsed * (hourlySavings / 3600);
    }

    getElapsedTime() {
        const now = this.DateTime.now().setZone('America/New_York');
        const diff = now.diff(this.startTime);
        return {
            hours: Math.floor(diff.as('hours')),
            minutes: Math.floor(diff.as('minutes')) % 60,
            seconds: Math.floor(diff.as('seconds')) % 60,
            totalHours: diff.as('hours')
        };
    }

    startCounters() {
        // Initial update
        this.update();

        // Update every second
        setInterval(() => this.update(), 1000);
    }

    update() {
        const currentSavings = this.getCurrentSavings();
        const elapsed = this.getElapsedTime();
        const currentReduction = this.getCurrentReductionPercentage();
        const hourlySavings = this.hourlyBaseline * currentReduction;

        // Update main savings counter
        if (this.counters.savings) {
            this.counters.savings.textContent = Math.floor(currentSavings).toLocaleString();
        }

        // Update rate counter
        if (this.counters.rate) {
            const ratePerSecond = hourlySavings / 3600;
            this.counters.rate.textContent = ratePerSecond.toFixed(2);
        }

        // Update airports counter
        if (this.counters.airports) {
            this.counters.airports.textContent = this.affectedAirports;
        }

        // Update elapsed time
        if (this.counters.elapsedTime) {
            this.counters.elapsedTime.textContent =
                `${elapsed.hours}h ${elapsed.minutes}m ${elapsed.seconds}s since FAA reductions began`;
        }

        // Update cancellations (simulate growth)
        this.simulateCancellations();

        // Update share section
        this.updateShareSection(currentSavings, elapsed);

        // Update equivalents if calculator is available
        if (window.equivalentCalculator) {
            window.equivalentCalculator.updateDisplay(currentSavings);
        }

        // Update estimation details
        this.updateEstimationDetails(currentSavings, elapsed, currentReduction, hourlySavings);

        // Update future estimates
        this.updateFutureEstimates();
    }

    updateEstimationDetails(currentSavings, elapsed, currentReduction, hourlySavings) {
        const now = this.DateTime.now().setZone('America/New_York');
        const ratePerSecond = hourlySavings / 3600;

        // Update current time
        const currentTimeElement = document.getElementById('calc-current-time');
        if (currentTimeElement) {
            currentTimeElement.textContent = now.toFormat('MMM d, h:mm:ss a ZZZZ');
        }

        // Update current reduction level
        const currentReductionElement = document.getElementById('calc-current-reduction');
        if (currentReductionElement) {
            const reductionPercent = (currentReduction * 100).toFixed(0);
            currentReductionElement.textContent = `${reductionPercent}% (${this.getReductionPhase()})`;
        }

        // Update hourly savings
        const hourlySavingsElement = document.getElementById('calc-hourly-savings');
        if (hourlySavingsElement) {
            hourlySavingsElement.textContent = `${Math.floor(hourlySavings).toLocaleString()} tons CO₂/hour`;
        }

        // Update rate per second
        const ratePerSecondElement = document.getElementById('calc-rate-per-second');
        if (ratePerSecondElement) {
            ratePerSecondElement.textContent = `${ratePerSecond.toFixed(3)} tons CO₂/second`;
        }

        // Update time elapsed
        const timeElapsedElement = document.getElementById('calc-time-elapsed');
        if (timeElapsedElement) {
            timeElapsedElement.textContent = `${elapsed.hours}h ${elapsed.minutes}m ${elapsed.seconds}s`;
        }

        // Update total saved
        const totalSavedElement = document.getElementById('calc-total-saved');
        if (totalSavedElement) {
            totalSavedElement.textContent = `${Math.floor(currentSavings).toLocaleString()} tons CO₂`;
        }

        // Update formula breakdown
        this.updateFormulaBreakdown(currentSavings, elapsed, currentReduction, hourlySavings);
    }

    getReductionPhase() {
        const now = this.DateTime.now().setZone('America/New_York');
        const nov7 = this.DateTime.fromISO('2025-11-07T00:00:00-05:00');
        const nov11 = this.DateTime.fromISO('2025-11-11T00:00:00-05:00');
        const nov13 = this.DateTime.fromISO('2025-11-13T00:00:00-05:00');
        const nov14 = this.DateTime.fromISO('2025-11-14T00:00:00-05:00');

        if (now < nov7) {
            return "Before reductions";
        } else if (now >= nov7 && now < nov11) {
            return "Initial phase";
        } else if (now >= nov11 && now < nov13) {
            return "Moderate reduction";
        } else if (now >= nov13 && now < nov14) {
            return "High reduction";
        } else {
            return "Maximum reduction";
        }
    }

    updateFormulaBreakdown(currentSavings, elapsed, currentReduction, hourlySavings) {
        const formulaElement = document.getElementById('calculation-formula');
        if (!formulaElement) return;

        const now = this.DateTime.now().setZone('America/New_York');
        const secondsElapsed = Math.max(0, now.diff(this.startTime, 'seconds').seconds);
        const ratePerSecond = hourlySavings / 3600;

        formulaElement.innerHTML = `
            <div class="bg-white p-4 rounded border">
                <div class="font-semibold mb-2">Current Estimation:</div>
                <div class="font-mono text-xs space-y-1">
                    <div>Baseline Emissions: ${this.hourlyBaseline.toLocaleString()} tons CO₂/hour</div>
                    <div>Current Reduction: ${(currentReduction * 100).toFixed(0)}%</div>
                    <div>Hourly Savings: ${this.hourlyBaseline.toLocaleString()} × ${currentReduction.toFixed(2)} = ${Math.floor(hourlySavings).toLocaleString()} tons CO₂/hour</div>
                    <div>Rate per Second: ${Math.floor(hourlySavings).toLocaleString()} ÷ 3600 = ${ratePerSecond.toFixed(3)} tons CO₂/second</div>
                    <div>Time Elapsed: ${secondsElapsed.toLocaleString()} seconds</div>
                    <div><strong>Total Saved: ${ratePerSecond.toFixed(3)} × ${secondsElapsed.toLocaleString()} = ${Math.floor(currentSavings).toLocaleString()} tons CO₂</strong></div>
                </div>
            </div>
            <div class="bg-yellow-50 p-4 rounded border border-yellow-200">
                <div class="font-semibold mb-2">Estimation Steps:</div>
                <ol class="list-decimal list-inside space-y-1 text-xs">
                    <li>Start with baseline US domestic aviation emissions: ${this.hourlyBaseline.toLocaleString()} tons CO₂/hour</li>
                    <li>Apply current reduction level: ${(currentReduction * 100).toFixed(0)}%</li>
                    <li>Estimate hourly savings: ${Math.floor(hourlySavings).toLocaleString()} tons CO₂/hour</li>
                    <li>Convert to per-second rate: ${ratePerSecond.toFixed(3)} tons CO₂/second</li>
                    <li>Multiply by elapsed time: ${secondsElapsed.toLocaleString()} seconds</li>
                    <li>Result: ${Math.floor(currentSavings).toLocaleString()} tons CO₂ saved</li>
                </ol>
            </div>
        `;
    }

    // Calculate total CO2 saved for a future date using progressive reduction schedule
    getFutureSavings(timeOffset) {
        const futureTime = this.DateTime.now().setZone('America/New_York').plus(timeOffset);
        return this.calculateProgressiveSavings(this.startTime, futureTime);
    }

    // Calculate CO2 savings between two dates using progressive reduction schedule
    calculateProgressiveSavings(startTime, endTime) {
        let totalSavings = 0;
        let currentTime = startTime;

        // Define progressive reduction schedule dates
        const nov7 = this.DateTime.fromISO('2025-11-07T00:00:00-05:00');
        const nov11 = this.DateTime.fromISO('2025-11-11T00:00:00-05:00');
        const nov13 = this.DateTime.fromISO('2025-11-13T00:00:00-05:00');
        const nov14 = this.DateTime.fromISO('2025-11-14T00:00:00-05:00');

        // Define reduction periods
        const periods = [
            { start: nov7, end: nov11, reduction: 0.04, description: "4% reduction" },
            { start: nov11, end: nov13, reduction: 0.06, description: "6% reduction" },
            { start: nov13, end: nov14, reduction: 0.08, description: "8% reduction" },
            { start: nov14, end: endTime, reduction: 0.10, description: "10% reduction" }
        ];

        // Calculate savings for each period
        periods.forEach(period => {
            // Use DateTime comparison methods properly
            const periodStart = currentTime > period.start ? currentTime : period.start;
            const periodEnd = endTime < period.end ? endTime : period.end;

            if (periodStart < periodEnd) {
                const hoursInPeriod = periodEnd.diff(periodStart, 'hours').hours;
                const savingsInPeriod = hoursInPeriod * this.hourlyBaseline * period.reduction;
                totalSavings += savingsInPeriod;
                currentTime = periodEnd;
            }
        });

        return totalSavings;
    }

    // Get time period information for display
    getTimePeriodInfo(timeOffset) {
        const futureTime = this.DateTime.now().setZone('America/New_York').plus(timeOffset);
        const elapsed = futureTime.diff(this.startTime);

        return {
            totalHours: Math.max(0, elapsed.as('hours')),
            totalDays: Math.max(0, elapsed.as('days')),
            displayTime: this.formatElapsedTime(elapsed),
            futureTime: futureTime.toFormat('MMM d, yyyy, h:mm a ZZZZ')
        };
    }

    // Format elapsed time for display
    formatElapsedTime(duration) {
        const totalHours = Math.floor(duration.as('hours'));
        const days = Math.floor(totalHours / 24);
        const hours = totalHours % 24;

        if (days > 0) {
            return `${days}d ${hours}h`;
        } else {
            const minutes = Math.floor((duration.as('minutes')) % 60);
            return `${hours}h ${minutes}m`;
        }
    }

    // Update future estimates display
    updateFutureEstimates() {
        const timeSelector = document.getElementById('time-selector');
        if (!timeSelector) return;

        const selectedValue = timeSelector.value;
        let timeOffset;

        // Convert selector value to duration
        switch (selectedValue) {
            case 'now':
                timeOffset = { seconds: 0 };
                break;
            case '1week':
                timeOffset = { weeks: 1 };
                break;
            case '2weeks':
                timeOffset = { weeks: 2 };
                break;
            case '1month':
                timeOffset = { months: 1 };
                break;
            case '2months':
                timeOffset = { months: 2 };
                break;
            case '3months':
                timeOffset = { months: 3 };
                break;
            case '6months':
                timeOffset = { months: 6 };
                break;
            case '1year':
                timeOffset = { years: 1 };
                break;
            default:
                timeOffset = { seconds: 0 };
        }

        const futureSavings = this.getFutureSavings(timeOffset);
        const timeInfo = this.getTimePeriodInfo(timeOffset);

        // Update future estimates display
        const futureTotalElement = document.getElementById('future-total-saved');
        if (futureTotalElement) {
            futureTotalElement.textContent = Math.floor(futureSavings).toLocaleString();
        }

        const futureTimeElement = document.getElementById('future-time-elapsed');
        if (futureTimeElement) {
            futureTimeElement.textContent = timeInfo.displayTime;
        }

        // Update future calculation breakdown
        this.updateFutureCalculationBreakdown(futureSavings, timeInfo, selectedValue);
    }

    updateFutureCalculationBreakdown(futureSavings, timeInfo, selectedValue) {
        const breakdownElement = document.getElementById('future-calculation-breakdown');
        if (!breakdownElement) return;

        const futureTime = this.DateTime.now().setZone('America/New_York').plus(this.getTimeOffset(selectedValue));
        const periodBreakdown = this.getPeriodBreakdown(this.startTime, futureTime);

        let breakdownHTML = `
            <div class="bg-blue-50 p-3 rounded border border-blue-200">
                <div class="font-semibold mb-2 text-blue-800">Progressive Estimation Breakdown:</div>
                <div class="space-y-2">
        `;

        periodBreakdown.forEach(period => {
            if (period.hours > 0) {
                breakdownHTML += `
                    <div class="flex justify-between items-center text-xs">
                        <span>${period.description} (${period.duration}):</span>
                        <span class="font-semibold">${Math.floor(period.savings).toLocaleString()} tons</span>
                    </div>
                `;
            }
        });

        breakdownHTML += `
                </div>
                <div class="mt-3 pt-3 border-t border-blue-200">
                    <div class="flex justify-between items-center font-semibold">
                        <span>Total Estimated Savings:</span>
                        <span class="text-green-700">${Math.floor(futureSavings).toLocaleString()} tons CO₂</span>
                    </div>
                    <div class="text-xs text-gray-600 mt-1">
                        Estimated by ${futureTime.toFormat('MMM d, yyyy, h:mm a ZZZZ')}
                    </div>
                </div>
            </div>
        `;

        breakdownElement.innerHTML = breakdownHTML;
    }

    getTimeOffset(selectedValue) {
        switch (selectedValue) {
            case 'now': return { seconds: 0 };
            case '1week': return { weeks: 1 };
            case '2weeks': return { weeks: 2 };
            case '1month': return { months: 1 };
            case '2months': return { months: 2 };
            case '3months': return { months: 3 };
            case '6months': return { months: 6 };
            case '1year': return { years: 1 };
            default: return { seconds: 0 };
        }
    }

    getPeriodBreakdown(startTime, endTime) {
        const breakdown = [];

        // Define progressive reduction schedule dates
        const nov7 = this.DateTime.fromISO('2025-11-07T00:00:00-05:00');
        const nov11 = this.DateTime.fromISO('2025-11-11T00:00:00-05:00');
        const nov13 = this.DateTime.fromISO('2025-11-13T00:00:00-05:00');
        const nov14 = this.DateTime.fromISO('2025-11-14T00:00:00-05:00');

        // Define reduction periods
        const periods = [
            { start: nov7, end: nov11, reduction: 0.04, description: "4% reduction" },
            { start: nov11, end: nov13, reduction: 0.06, description: "6% reduction" },
            { start: nov13, end: nov14, reduction: 0.08, description: "8% reduction" },
            { start: nov14, end: endTime, reduction: 0.10, description: "10% reduction" }
        ];

        let currentTime = startTime;

        // Calculate savings for each period
        periods.forEach(period => {
            // Use DateTime comparison methods properly
            const periodStart = currentTime > period.start ? currentTime : period.start;
            const periodEnd = endTime < period.end ? endTime : period.end;

            if (periodStart < periodEnd) {
                const hoursInPeriod = periodEnd.diff(periodStart, 'hours').hours;
                const daysInPeriod = Math.floor(hoursInPeriod / 24);
                const remainingHours = Math.floor(hoursInPeriod % 24);

                let duration = '';
                if (daysInPeriod > 0) {
                    duration = `${daysInPeriod}d ${remainingHours}h`;
                } else {
                    duration = `${Math.floor(hoursInPeriod)}h`;
                }

                const savingsInPeriod = hoursInPeriod * this.hourlyBaseline * period.reduction;

                breakdown.push({
                    description: period.description,
                    hours: hoursInPeriod,
                    duration: duration,
                    savings: savingsInPeriod
                });

                currentTime = periodEnd;
            }
        });

        return breakdown;
    }

    simulateCancellations() {
        const now = this.DateTime.now().setZone('America/New_York');
        const hoursSinceStart = Math.max(0, now.diff(this.startTime, 'hours').hours);

        // Rough estimate: additional cancellations increase over time
        const estimatedCancellations = Math.floor(this.currentCancellations + (hoursSinceStart * 50));

        if (this.counters.cancellations) {
            this.counters.cancellations.textContent = estimatedCancellations.toLocaleString();
        }
    }

    updateShareSection(savings, elapsed) {
        if (this.counters.shareSavings) {
            this.counters.shareSavings.textContent = Math.floor(savings).toLocaleString();
        }

        if (this.counters.shareTime) {
            this.counters.shareTime.textContent =
                `${elapsed.hours}h ${elapsed.minutes}m elapsed`;
        }
    }

    updateReductionPercentage(newPercentage) {
        this.currentReductionPercentage = Math.min(newPercentage, this.maxReductionPercentage);
    }
}

// Initialize all additional components
function initializeComponents() {
    // Initialize equivalent calculator
    if (window.EquivalentCalculator) {
        equivalentCalculator = new window.EquivalentCalculator();
        window.equivalentCalculator = equivalentCalculator;
    }
  }

// Initialize live counter
function initializeLiveCounter() {
    if (window.luxon) {
        liveCounter = new LiveShutdownSavingsCounter();
        window.liveCounter = liveCounter; // Make it globally accessible
    } else {
        console.error('Luxon library not loaded');
    }
}

// Event listeners
function initializeEventListeners() {
    // Share functionality
    const shareButton = document.getElementById('share-savings');
    if (shareButton) {
        shareButton.addEventListener('click', handleShareSavings);
    }

    const shareTwitter = document.getElementById('share-twitter');
    if (shareTwitter) {
        shareTwitter.addEventListener('click', handleShareTwitter);
    }

    const shareFacebook = document.getElementById('share-facebook');
    if (shareFacebook) {
        shareFacebook.addEventListener('click', handleShareFacebook);
    }

    const copyLink = document.getElementById('copy-link');
    if (copyLink) {
        copyLink.addEventListener('click', handleCopyLink);
    }

    // Equivalent selector buttons
    const equivalentSelectors = document.querySelectorAll('.equivalent-selector');
    equivalentSelectors.forEach(button => {
        button.addEventListener('click', (e) => {
            const equivalent = e.target.dataset.equivalent;
            if (equivalent && window.equivalentCalculator) {
                window.equivalentCalculator.setSelectedEquivalent(equivalent);
            }
        });
    });

    // Time selector for future estimates
    const timeSelector = document.getElementById('time-selector');
    if (timeSelector) {
        timeSelector.addEventListener('change', () => {
            if (window.liveCounter) {
                window.liveCounter.updateFutureEstimates();
            }
        });
    }
}

// Share handlers
function handleShareSavings() {
    const savings = document.getElementById('savings-counter')?.textContent || '0';
    const text = `${savings} TONS OF CO₂ SAVED BECAUSE OF THE GOVERNMENT SHUTDOWN`;

    if (navigator.share) {
        navigator.share({
            title: 'CO2 Saved Because of the Government Shutdown',
            text: text,
            url: window.location.href
        });
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(text + ' ' + window.location.href).then(() => {
            alert('Copied to clipboard!');
        });
    }
}

function handleShareTwitter() {
    const savings = document.getElementById('savings-counter')?.textContent || '0';
    const text = `${savings} TONS OF CO₂ SAVED BECAUSE OF THE GOVERNMENT SHUTDOWN`;
    const url = encodeURIComponent(window.location.href);
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${url}`;
    window.open(twitterUrl, '_blank');
}

function handleShareFacebook() {
    const url = encodeURIComponent(window.location.href);
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    window.open(facebookUrl, '_blank');
}

function handleCopyLink() {
    navigator.clipboard.writeText(window.location.href).then(() => {
        const button = document.getElementById('copy-link');
        const originalText = button.textContent;
        button.textContent = 'Link Copied!';
        button.classList.add('bg-green-600');

        setTimeout(() => {
            button.textContent = originalText;
            button.classList.remove('bg-green-600');
        }, 2000);
    });
}

// GSAP ScrollTrigger animations
function initializeScrollAnimations() {
    if (window.gsap && window.ScrollTrigger) {
        gsap.registerPlugin(ScrollTrigger);

        // Hero section animations (already handled by CSS)
        // Section fade-ins
        gsap.utils.toArray('section').forEach((section, index) => {
            if (section.id !== 'hero') {
                gsap.from(section.children, {
                    scrollTrigger: {
                        trigger: section,
                        start: 'top 80%',
                        end: 'bottom 20%',
                        toggleActions: 'play none none reverse'
                    },
                    y: 30,
                    opacity: 0,
                    duration: 0.8,
                    stagger: 0.2
                });
            }
        });

        // Parallax effect for hero section
        gsap.to('.hero-title', {
            scrollTrigger: {
                trigger: '.hero-section',
                start: 'top top',
                end: 'bottom top',
                scrub: 1
            },
            y: 50,
            opacity: 0.5
        });

        console.log('Scroll animations initialized');
    } else {
        // Fallback: use Intersection Observer for basic animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe sections
        document.querySelectorAll('section').forEach(section => {
            if (section.id !== 'hero') {
                section.style.opacity = '0';
                section.style.transform = 'translateY(30px)';
                section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                observer.observe(section);
            }
        });
    }
}

// Utility function to check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Export for use in other modules
window.CO2SavingsApp = {
    liveCounter,
    equivalentCalculator,
    isInViewport
};