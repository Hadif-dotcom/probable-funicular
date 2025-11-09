// API Widget Builder - Discovery Challenge
// Explore component-based architecture and dynamic UI generation
// LEARNING GOAL: Understanding modular programming and reusable components
// CONCEPT: State management in complex web applications

// Widget State Management - Study these patterns
// CONCEPT: Global State Variables
// LEARNING: These variables track the application's current state
// DEBUGGING TIP: Use console.log() to inspect these variables when debugging
// Think about: Why do we need to track state in web applications?
let activeWidget = null;      // Which widget is currently being configured
let widgetConfig = {};        // Current widget's configuration settings
let dashboardWidgets = [];    // Array of widgets added to the dashboard
let autoRefreshIntervals = new Map(); // Tracks automatic refresh timers

// API Keys and Configurations
const API_CONFIGS = {
    weather: {
        apiKey: 'demo_key', // Replace with actual OpenWeatherMap key
        baseUrl: 'https://api.openweathermap.org/data/2.5/weather'
    },
    pokemon: {
        baseUrl: 'https://pokeapi.co/api/v2/pokemon'
    },
    space: {
        apiKey: 'DEMO_KEY', // Replace with actual NASA key
        baseUrl: 'https://api.nasa.gov'
    },
    quotes: {
        baseUrl: 'https://quotable.io/random'
    }
};

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    initializeCodeTabs();
    loadSampleWidgets();
});

// Code Tab Management
function initializeCodeTabs() {
    const tabButtons = document.querySelectorAll('.code-tab');
    const tabPanels = document.querySelectorAll('.code-panel');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.dataset.tab;

            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanels.forEach(panel => panel.classList.remove('active'));

            button.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });
}

// Widget Loading
// CONCEPT: Dynamic Component Loading
// LEARNING GOAL: Understanding how to load and initialize different UI components
async function loadWidget(widgetType) {
    // CONCEPT: State Management
    // LEARNING: Track which widget is currently active
    activeWidget = widgetType;

    // CONCEPT: DOM Manipulation
    // LEARNING: Programmatically show/hide UI elements
    // DEBUGGING TIP: Check if elements exist before manipulating them
    document.getElementById('widgetContainer').style.display = 'block';
    document.getElementById('widgetTitle').textContent = getWidgetTitle(widgetType);

    // CONCEPT: Template System
    // LEARNING: Reusing HTML templates for different widget types
    // HINT: Templates are hidden HTML that we clone and modify
    // WATCH OUT: Make sure template selectors match your HTML
    const template = document.querySelector(`.widget-template[data-widget="${widgetType}"]`);
    const widgetContent = document.getElementById('widgetContent');

    if (template) {
        // CONCEPT: Dynamic HTML Generation
        // LEARNING: Copy template content into the active widget area
        widgetContent.innerHTML = template.innerHTML;

        // CONCEPT: Asynchronous Initialization
        // LEARNING: Some widgets need to fetch data before they're ready
        // DEBUGGING TIP: Watch the Network tab to see API calls
        await initializeWidget(widgetType);
    }

    // CONCEPT: User Experience
    // LEARNING: Smooth scrolling provides better user experience
    // UX PRINCIPLE: Guide users' attention to new content
    document.getElementById('widgetContainer').scrollIntoView({ behavior: 'smooth' });
}

function getWidgetTitle(widgetType) {
    const titles = {
        weather: '🌤️ Weather Dashboard',
        pokemon: '🔴 Pokemon Explorer',
        space: '🚀 NASA Space Explorer',
        quotes: '💭 Daily Inspiration'
    };
    return titles[widgetType] || 'Widget';
}

// Widget Initialization
async function initializeWidget(widgetType) {
    try {
        switch(widgetType) {
            case 'weather':
                await loadWeatherData('London');
                break;
            case 'pokemon':
                await loadPokemonData('pikachu');
                break;
            case 'space':
                await loadSpaceData('apod');
                break;
            case 'quotes':
                await loadQuoteData();
                break;
        }
    } catch (error) {
        console.error(`Error initializing ${widgetType} widget:`, error);
        showWidgetError(error.message);
    }
}

// Weather Widget Functions
async function updateWeather() {
    const city = document.getElementById('weatherCity').value.trim();
    if (!city) {
        alert('Please enter a city name');
        return;
    }

    await loadWeatherData(city);
}

async function loadWeatherData(city) {
    // CONCEPT: Loading States and User Feedback
    // LEARNING: Always show users when data is being loaded
    // UX PRINCIPLE: Immediate feedback prevents user confusion
    const display = document.getElementById('weatherDisplay');
    display.innerHTML = '<div class="loading">Loading weather data...</div>';

    try {
        // CONCEPT: API Simulation vs Production
        // LEARNING: Use mock data during development, real APIs in production
        // DEBUGGING TIP: Simulation lets you test without API keys or rate limits
        // WATCH OUT: Remember to replace simulated data with real API calls
        // For demo purposes, we'll simulate weather data
        // In production, use actual OpenWeatherMap API
        const weatherData = await simulateWeatherAPI(city);

        // CONCEPT: User Preference Handling
        // LEARNING: Respect user choices for units, themes, etc.
        // DEBUGGING TIP: Check what radio button is actually selected
        const units = document.querySelector('input[name="weatherUnits"]:checked').value;
        const tempSymbol = units === 'metric' ? '°C' : '°F';

        display.innerHTML = `
            <div class="weather-main">
                <h3>${weatherData.name}, ${weatherData.country}</h3>
                <div class="weather-temp">${weatherData.temp}${tempSymbol}</div>
                <div class="weather-description">${weatherData.description}</div>
            </div>
            <div class="weather-details">
                <div class="weather-detail">
                    <strong>Feels like</strong><br>
                    ${weatherData.feelsLike}${tempSymbol}
                </div>
                <div class="weather-detail">
                    <strong>Humidity</strong><br>
                    ${weatherData.humidity}%
                </div>
                <div class="weather-detail">
                    <strong>Wind</strong><br>
                    ${weatherData.windSpeed} m/s
                </div>
                <div class="weather-detail">
                    <strong>Pressure</strong><br>
                    ${weatherData.pressure} hPa
                </div>
            </div>
        `;
    } catch (error) {
        display.innerHTML = `<div class="error">
            <h3>Weather Error</h3>
            <p>Could not load weather data for ${city}</p>
        </div>`;
    }
}

// Pokemon Widget Functions
async function searchPokemon() {
    const name = document.getElementById('pokemonName').value.trim().toLowerCase();
    if (!name) {
        alert('Please enter a Pokemon name or ID');
        return;
    }

    await loadPokemonData(name);
}

async function randomPokemon() {
    const randomId = Math.floor(Math.random() * 1010) + 1;
    await loadPokemonData(randomId.toString());
}

async function loadPokemonData(identifier) {
    const display = document.getElementById('pokemonDisplay');
    display.innerHTML = '<div class="loading">Loading Pokemon data...</div>';

    try {
        const response = await fetch(`${API_CONFIGS.pokemon.baseUrl}/${identifier}`);

        if (!response.ok) {
            throw new Error('Pokemon not found');
        }

        const pokemon = await response.json();

        const showShiny = document.getElementById('showShiny')?.checked || false;
        const showStats = document.getElementById('showStats')?.checked || true;

        const spriteUrl = showShiny && pokemon.sprites.front_shiny
            ? pokemon.sprites.front_shiny
            : pokemon.sprites.front_default;

        let statsHtml = '';
        if (showStats) {
            statsHtml = `
                <div class="pokemon-stats">
                    ${pokemon.stats.map(stat => `
                        <div class="pokemon-stat">
                            <span>${stat.stat.name}</span>
                            <span>${stat.base_stat}</span>
                        </div>
                    `).join('')}
                </div>
            `;
        }

        display.innerHTML = `
            <div class="pokemon-card">
                <div class="pokemon-info">
                    <h3>${pokemon.name}</h3>
                    <p><strong>ID:</strong> #${pokemon.id.toString().padStart(3, '0')}</p>
                    <p><strong>Height:</strong> ${pokemon.height / 10} m</p>
                    <p><strong>Weight:</strong> ${pokemon.weight / 10} kg</p>
                    <p><strong>Types:</strong> ${pokemon.types.map(t => t.type.name).join(', ')}</p>
                    ${statsHtml}
                </div>
                <div class="pokemon-images">
                    <img src="${spriteUrl}" alt="${pokemon.name}">
                </div>
            </div>
        `;

        // Update input with actual name
        document.getElementById('pokemonName').value = pokemon.name;

    } catch (error) {
        display.innerHTML = `<div class="error">
            <h3>Pokemon Error</h3>
            <p>Could not find Pokemon: ${identifier}</p>
        </div>`;
    }
}

function toggleShiny() {
    if (activeWidget === 'pokemon') {
        const currentName = document.getElementById('pokemonName').value;
        if (currentName) {
            loadPokemonData(currentName);
        }
    }
}

function toggleStats() {
    if (activeWidget === 'pokemon') {
        const currentName = document.getElementById('pokemonName').value;
        if (currentName) {
            loadPokemonData(currentName);
        }
    }
}

// Space Widget Functions
async function updateSpaceData() {
    const dataType = document.getElementById('spaceDataType').value;
    await loadSpaceData(dataType);
}

async function refreshSpaceData() {
    const dataType = document.getElementById('spaceDataType').value;
    await loadSpaceData(dataType);
}

async function loadSpaceData(dataType) {
    const display = document.getElementById('spaceDisplay');
    display.innerHTML = '<div class="loading">Loading space data...</div>';

    try {
        let spaceData;

        switch(dataType) {
            case 'apod':
                spaceData = await loadAPOD();
                break;
            case 'mars':
                spaceData = await loadMarsPhotos();
                break;
            case 'neo':
                spaceData = await loadNearEarthObjects();
                break;
            default:
                throw new Error('Unknown data type');
        }

        display.innerHTML = spaceData;

    } catch (error) {
        display.innerHTML = `<div class="error">
            <h3>Space Data Error</h3>
            <p>Could not load space data: ${error.message}</p>
        </div>`;
    }
}

async function loadAPOD() {
    // For demo purposes, simulate APOD data
    // In production, use actual NASA APOD API
    const apodData = {
        title: "The Andromeda Galaxy",
        date: new Date().toISOString().split('T')[0],
        explanation: "The Andromeda Galaxy, also known as M31, is a spiral galaxy approximately 2.5 million light-years from Earth and is the nearest major galaxy to the Milky Way. This stunning image shows the galaxy's distinctive spiral structure with its bright central bulge and sweeping arms filled with star-forming regions.",
        url: "https://apod.nasa.gov/apod/image/2312/M31_HubbleSpitzer_2048.jpg",
        media_type: "image"
    };

    return `
        <div class="space-content">
            <h3>${apodData.title}</h3>
            <p class="space-date">${apodData.date}</p>
            <img src="${apodData.url}" alt="${apodData.title}" class="space-image">
            <div class="space-description">
                <h4>Explanation</h4>
                <p>${apodData.explanation}</p>
            </div>
        </div>
    `;
}

async function loadMarsPhotos() {
    return `
        <div class="space-content">
            <h3>Mars Rover Photos - Sol 1000</h3>
            <p>Recent photos from the Curiosity rover on Mars</p>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-top: 20px;">
                <img src="https://mars.nasa.gov/msl-raw-images/proj/msl/redops/ods/surface/sol/01000/opgs/edr/ccam/CR0_486265466EDR_F0481570CCAM01000M_.JPG" style="width: 100%; border-radius: 8px;">
                <img src="https://mars.nasa.gov/msl-raw-images/proj/msl/redops/ods/surface/sol/01000/opgs/edr/ccam/CR0_486265398EDR_F0481570CCAM01000M_.JPG" style="width: 100%; border-radius: 8px;">
            </div>
            <p><em>Images from Curiosity's ChemCam instrument</em></p>
        </div>
    `;
}

async function loadNearEarthObjects() {
    return `
        <div class="space-content">
            <h3>Near Earth Objects Today</h3>
            <p>Asteroids approaching Earth today</p>
            <div style="margin-top: 20px;">
                <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 8px; margin-bottom: 10px;">
                    <h4>2023 DW</h4>
                    <p><strong>Estimated Diameter:</strong> 50-112 meters</p>
                    <p><strong>Relative Velocity:</strong> 24,140 km/h</p>
                    <p><strong>Miss Distance:</strong> 1,935,696 km</p>
                    <p style="color: #51cf66;">✅ Safe - No impact threat</p>
                </div>
                <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 8px;">
                    <h4>2024 ON</h4>
                    <p><strong>Estimated Diameter:</strong> 280-610 meters</p>
                    <p><strong>Relative Velocity:</strong> 33,500 km/h</p>
                    <p><strong>Miss Distance:</strong> 988,000 km</p>
                    <p style="color: #51cf66;">✅ Safe - No impact threat</p>
                </div>
            </div>
        </div>
    `;
}

// Quotes Widget Functions
async function updateQuotes() {
    await loadQuoteData();
}

async function getNewQuote() {
    await loadQuoteData();
}

async function loadQuoteData() {
    const display = document.getElementById('quotesDisplay');
    display.innerHTML = '<div class="loading">Loading inspirational quote...</div>';

    try {
        // For demo purposes, use predefined quotes
        // In production, use actual quotes API
        const quotes = [
            {
                content: "The only way to do great work is to love what you do.",
                author: "Steve Jobs"
            },
            {
                content: "Innovation distinguishes between a leader and a follower.",
                author: "Steve Jobs"
            },
            {
                content: "Life is what happens to you while you're busy making other plans.",
                author: "John Lennon"
            },
            {
                content: "The future belongs to those who believe in the beauty of their dreams.",
                author: "Eleanor Roosevelt"
            },
            {
                content: "It is during our darkest moments that we must focus to see the light.",
                author: "Aristotle"
            }
        ];

        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

        display.innerHTML = `
            <div class="quote-text">"${randomQuote.content}"</div>
            <div class="quote-author">— ${randomQuote.author}</div>
        `;

    } catch (error) {
        display.innerHTML = `<div class="error">
            <h3>Quote Error</h3>
            <p>Could not load inspirational quote</p>
        </div>`;
    }
}

function toggleAutoRefresh() {
    const autoRefresh = document.getElementById('autoRefresh').checked;

    if (autoRefresh) {
        const interval = setInterval(() => {
            if (activeWidget === 'quotes') {
                loadQuoteData();
            }
        }, 30000); // 30 seconds

        autoRefreshIntervals.set('quotes', interval);
    } else {
        const interval = autoRefreshIntervals.get('quotes');
        if (interval) {
            clearInterval(interval);
            autoRefreshIntervals.delete('quotes');
        }
    }
}

// Widget Controls
async function refreshWidget() {
    if (activeWidget) {
        await initializeWidget(activeWidget);
    }
}

function customizeWidget() {
    const configDiv = document.getElementById('widgetConfig');
    const isVisible = configDiv.style.display !== 'none';

    configDiv.style.display = isVisible ? 'none' : 'block';

    if (!isVisible) {
        loadWidgetConfig();
    }
}

function loadWidgetConfig() {
    const configControls = document.getElementById('configControls');

    switch(activeWidget) {
        case 'weather':
            configControls.innerHTML = `
                <label>Default City:
                    <input type="text" id="configDefaultCity" value="London">
                </label>
                <label>Temperature Units:
                    <select id="configUnits">
                        <option value="metric">Celsius</option>
                        <option value="imperial">Fahrenheit</option>
                    </select>
                </label>
                <label>
                    <input type="checkbox" id="configAutoRefresh"> Auto-refresh every 5 minutes
                </label>
            `;
            break;
        case 'pokemon':
            configControls.innerHTML = `
                <label>Default Pokemon:
                    <input type="text" id="configDefaultPokemon" value="pikachu">
                </label>
                <label>
                    <input type="checkbox" id="configShowShiny"> Show shiny forms by default
                </label>
                <label>
                    <input type="checkbox" id="configShowEvolution"> Show evolution chain
                </label>
            `;
            break;
        case 'space':
            configControls.innerHTML = `
                <label>NASA API Key:
                    <input type="text" id="configNasaKey" value="DEMO_KEY">
                </label>
                <label>Default Data Type:
                    <select id="configSpaceType">
                        <option value="apod">Astronomy Picture of the Day</option>
                        <option value="mars">Mars Rover Photos</option>
                        <option value="neo">Near Earth Objects</option>
                    </select>
                </label>
            `;
            break;
        case 'quotes':
            configControls.innerHTML = `
                <label>Quote Category:
                    <select id="configQuoteCategory">
                        <option value="inspirational">Inspirational</option>
                        <option value="motivational">Motivational</option>
                        <option value="wisdom">Wisdom</option>
                    </select>
                </label>
                <label>
                    <input type="checkbox" id="configAutoRefreshQuotes"> Auto-refresh quotes
                </label>
            `;
            break;
    }
}

function applyConfig() {
    // Apply configuration changes based on active widget
    console.log('Applying configuration for', activeWidget);

    // Hide config panel
    document.getElementById('widgetConfig').style.display = 'none';

    // Refresh widget with new config
    refreshWidget();
}

function resetConfig() {
    // Reset to default configuration
    loadWidgetConfig();
}

function closeWidget() {
    document.getElementById('widgetContainer').style.display = 'none';

    // Clear any auto-refresh intervals
    autoRefreshIntervals.forEach((interval, key) => {
        clearInterval(interval);
    });
    autoRefreshIntervals.clear();

    activeWidget = null;
}

// Dashboard Functions
function showDashboard() {
    document.getElementById('dashboard').style.display = 'block';
    document.getElementById('dashboard').scrollIntoView({ behavior: 'smooth' });
}

function addWidgetToDashboard() {
    // CONCEPT: Input Validation and Error Prevention
    // LEARNING: Always validate user actions before proceeding
    // UX PRINCIPLE: Provide clear error messages when actions can't be completed
    if (!activeWidget) {
        alert('Please select and configure a widget first');
        return;
    }

    // CONCEPT: Object Creation and Data Structure
    // LEARNING: Create consistent data structures for managing collections
    // DEBUGGING TIP: Use unique IDs to track items in collections
    // WATCH OUT: Date.now() provides millisecond timestamps for unique IDs
    const widget = {
        id: Date.now(),                          // Unique identifier
        type: activeWidget,                      // Widget type (weather, pokemon, etc.)
        title: getWidgetTitle(activeWidget),     // Display title
        config: { ...widgetConfig }              // Copy of current configuration
    };

    // CONCEPT: Array Management and State Updates
    // LEARNING: Add items to arrays and trigger UI updates
    // DEBUGGING TIP: console.log(dashboardWidgets) to see all widgets
    dashboardWidgets.push(widget);
    renderDashboard();
    showDashboard();
}

function renderDashboard() {
    const grid = document.getElementById('dashboardGrid');

    if (dashboardWidgets.length === 0) {
        grid.innerHTML = '<p style="text-align: center; color: #666; grid-column: 1/-1;">No widgets added yet. Configure a widget and click "Add to Dashboard".</p>';
        return;
    }

    grid.innerHTML = dashboardWidgets.map(widget => `
        <div class="dashboard-widget" data-widget-id="${widget.id}">
            <button class="remove-widget" onclick="removeFromDashboard(${widget.id})">×</button>
            <h3>${widget.title}</h3>
            <div class="mini-widget" id="mini-${widget.id}">
                Loading...
            </div>
        </div>
    `).join('');

    // Initialize mini widgets
    dashboardWidgets.forEach(widget => {
        initializeMiniWidget(widget);
    });
}

function removeFromDashboard(widgetId) {
    dashboardWidgets = dashboardWidgets.filter(w => w.id !== widgetId);
    renderDashboard();
}

function clearDashboard() {
    dashboardWidgets = [];
    renderDashboard();
}

function exportDashboard() {
    const data = {
        widgets: dashboardWidgets,
        exported: new Date().toISOString(),
        version: '1.0'
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'widget-dashboard.json';
    a.click();

    URL.revokeObjectURL(url);
}

function initializeMiniWidget(widget) {
    const container = document.getElementById(`mini-${widget.id}`);

    // Create simplified version of each widget for dashboard
    switch(widget.type) {
        case 'weather':
            container.innerHTML = '<div style="text-align: center; padding: 10px;">🌤️<br>Weather<br><small>London</small></div>';
            break;
        case 'pokemon':
            container.innerHTML = '<div style="text-align: center; padding: 10px;">🔴<br>Pokemon<br><small>Pikachu</small></div>';
            break;
        case 'space':
            container.innerHTML = '<div style="text-align: center; padding: 10px;">🚀<br>Space<br><small>APOD</small></div>';
            break;
        case 'quotes':
            container.innerHTML = '<div style="text-align: center; padding: 10px;">💭<br>Quotes<br><small>Inspirational</small></div>';
            break;
    }
}

// Utility Functions
function showWidgetError(message) {
    const content = document.getElementById('widgetContent');
    content.innerHTML = `
        <div class="error">
            <h3>Widget Error</h3>
            <p>${message}</p>
            <button onclick="refreshWidget()" class="btn btn-primary">Try Again</button>
        </div>
    `;
}

// Simulate APIs for demo purposes
async function simulateWeatherAPI(city) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const cities = {
        'london': { name: 'London', country: 'GB', temp: 15, feelsLike: 13, humidity: 72, windSpeed: 3.2, pressure: 1013, description: 'partly cloudy' },
        'paris': { name: 'Paris', country: 'FR', temp: 18, feelsLike: 16, humidity: 65, windSpeed: 2.8, pressure: 1015, description: 'clear sky' },
        'tokyo': { name: 'Tokyo', country: 'JP', temp: 22, feelsLike: 24, humidity: 58, windSpeed: 4.1, pressure: 1009, description: 'light rain' },
        'new york': { name: 'New York', country: 'US', temp: 12, feelsLike: 10, humidity: 68, windSpeed: 5.2, pressure: 1012, description: 'overcast clouds' }
    };

    const cityData = cities[city.toLowerCase()] || {
        name: city,
        country: 'Unknown',
        temp: Math.floor(Math.random() * 30) + 5,
        feelsLike: Math.floor(Math.random() * 30) + 5,
        humidity: Math.floor(Math.random() * 40) + 40,
        windSpeed: Math.floor(Math.random() * 10) + 1,
        pressure: Math.floor(Math.random() * 50) + 990,
        description: 'clear sky'
    };

    return cityData;
}

// Load sample widgets for demonstration
function loadSampleWidgets() {
    // This could pre-load some example widgets
    console.log('Sample widgets loaded');
}

// Export functions for global access
window.loadWidget = loadWidget;
window.refreshWidget = refreshWidget;
window.customizeWidget = customizeWidget;
window.closeWidget = closeWidget;
window.updateWeather = updateWeather;
window.searchPokemon = searchPokemon;
window.randomPokemon = randomPokemon;
window.toggleShiny = toggleShiny;
window.toggleStats = toggleStats;
window.updateSpaceData = updateSpaceData;
window.refreshSpaceData = refreshSpaceData;
window.updateQuotes = updateQuotes;
window.getNewQuote = getNewQuote;
window.toggleAutoRefresh = toggleAutoRefresh;
window.applyConfig = applyConfig;
window.resetConfig = resetConfig;
window.addWidgetToDashboard = addWidgetToDashboard;
window.removeFromDashboard = removeFromDashboard;
window.clearDashboard = clearDashboard;
window.exportDashboard = exportDashboard;