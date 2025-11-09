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
let lastQuoteText = ''; // Track last shown quote to avoid duplicates
let quotesCache = [];
const QUOTE_CACHE_MAX = 100;

// API Configuration for Daily Inspiration
const API_CONFIGS = {
    quotes: {
        baseUrl: 'https://api.api-ninjas.com/v2/quotes'
    }
};

const API_NINJAS_KEY = 'fKz5d6h2XbvVj0OG2jKnvg==ksZ4THaoinct7b5b';
const QUOTE_CATEGORIES = ['inspirational','wisdom','success','life','leadership','happiness','love','education','business','courage','friendship','knowledge','art'];
const THEME_CATEGORY_MAP = {
    inspirational: ['inspirational','wisdom','courage','education'],
    motivational: ['inspirational','success','leadership','courage'],
    life: ['life','happiness','friendship','love'],
    success: ['success','business','leadership','knowledge']
};

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    try {
        const raw = localStorage.getItem('quotesCache');
        if (raw) {
            const arr = JSON.parse(raw);
            if (Array.isArray(arr)) {
                quotesCache = arr;
            }
        }
    } catch (e) {}
    // Load the Daily Inspiration widget by default
    loadWidget('quotes');
});


// Load and display the Daily Inspiration widget
async function loadWidget(widgetType = 'quotes') {
    activeWidget = widgetType;
    document.getElementById('widgetContainer').style.display = 'block';
    document.getElementById('widgetTitle').textContent = '💭 Daily Inspiration';

    const template = document.querySelector(`.widget-template[data-widget="${widgetType}"]`);
    const widgetContent = document.getElementById('widgetContent');

    if (template) {
        widgetContent.innerHTML = template.innerHTML;
        // Convert data-id to id within the inserted template to avoid duplicate IDs in hidden templates
        const withDataIds = widgetContent.querySelectorAll('[data-id]');
        withDataIds.forEach(el => {
            const val = el.getAttribute('data-id');
            if (val) {
                el.setAttribute('id', val);
                el.removeAttribute('data-id');
            }
        });
        await loadQuoteData();
    }

    document.getElementById('widgetContainer').scrollIntoView({ behavior: 'smooth' });
}

// Initialize the Daily Inspiration widget
async function initializeWidget() {
    try {
        await loadQuoteData();
    } catch (error) {
        console.error('Error initializing Daily Inspiration widget:', error);
        showWidgetError(error.message);
    }
}

// Quotes Widget Functions
async function updateQuotes() {
    await loadQuoteData();
}

async function getNewQuote() {
    await loadQuoteData();
}

function persistQuotesCache() {
    try {
        localStorage.setItem('quotesCache', JSON.stringify(quotesCache.slice(0, QUOTE_CACHE_MAX)));
    } catch (e) {}
}

function displayNextQuote() {
    const display = document.getElementById('quotesDisplay');
    if (!quotesCache.length) {
        display.innerHTML = '<div class="loading">No saved quotes yet. Try New Quote.</div>';
        return;
    }
    const q = quotesCache.shift();
    persistQuotesCache();
    const text = q.quote || q.content || '';
    const author = q.author || 'Unknown';
    lastQuoteText = text;
    display.innerHTML = `
        <div class="quote"><div class="quote-text">"${text}"</div><div class="quote-author">— ${author}</div></div>
    `;
}

async function fetchQuotesBatch(categoriesParam, count) {
    try {
        const url = `${API_CONFIGS.quotes.baseUrl}?categories=${encodeURIComponent(categoriesParam)}&limit=${count}`;
        let response = await fetch(url, { headers: { 'X-Api-Key': API_NINJAS_KEY } });
        if (!response.ok) {
            return 0;
        }
        const data = await response.json();
        const items = Array.isArray(data) ? data : [];
        if (!items.length) return 0;
        const existing = new Set(quotesCache.map(q => (q.quote || q.content || '')));
        let added = 0;
        for (const q of items) {
            const text = q.quote || q.content || '';
            if (text && !existing.has(text)) {
                existing.add(text);
                quotesCache.push(q);
                added++;
                if (quotesCache.length >= QUOTE_CACHE_MAX) break;
            }
        }
        persistQuotesCache();
        return added;
    } catch (e) {
        return 0;
    }
}

async function loadQuoteData() {
    const display = document.getElementById('quotesDisplay');
    display.innerHTML = '<div class="loading">Loading inspirational quote...</div>';

    try {
        const select = document.getElementById('quoteCategory');
        const chosen = (select && select.value) ? select.value : '';
        const categoryMap = { motivational: 'inspirational' };
        const normalized = (chosen && chosen.trim().length > 0) ? (categoryMap[chosen.trim().toLowerCase()] || chosen.trim()) : '';
        function sampleMany(arr, count) {
            const copy = [...arr];
            const picked = [];
            while (copy.length && picked.length < count) {
                picked.push(copy.splice(Math.floor(Math.random() * copy.length), 1)[0]);
            }
            return picked;
        }

        let categoriesParam;
        if (!normalized || normalized.toLowerCase() === 'random') {
            const picked = sampleMany(['inspirational','wisdom','life','success'], 2);
            categoriesParam = picked.join(',');
        } else {
            const related = THEME_CATEGORY_MAP[normalized.toLowerCase()] || [normalized];
            const count = Math.min(2, related.length);
            const picked = sampleMany(related, count);
            categoriesParam = picked.join(',');
        }

        if (quotesCache.length < 5) {
            await (async () => {
                const added = await fetchQuotesBatch(categoriesParam, 10);
                if (!added && !quotesCache.length) {
                    const fallbackAdded = await fetchQuotesBatch('success,wisdom', 10);
                    if (!fallbackAdded) {
                        throw new Error('No quotes returned');
                    }
                }
            })();
        }

        displayNextQuote();

    } catch (error) {
        display.innerHTML = `<div class="error">
            <h3>Quote Error</h3>
            <p>Could not load inspirational quote</p>
        </div>`;
        console.error('Quotes API error:', error);
    }
}

// TODO 4: Widget Communication & Events (Medium)
// LEARNING GOAL: Implementing auto-refresh with intervals and event handling
// SUCCESS CRITERIA:
//   - Toggle auto-refresh on/off based on checkbox state
//   - Store interval ID in autoRefreshIntervals Map for later cleanup
//   - Clear interval when auto-refresh is disabled
//   - Only refresh the active widget (avoid refreshing inactive widgets)
// DEBUGGING TIP: Use console.log to track when intervals are created/cleared
// HINT: setInterval returns an ID that you need to store for clearInterval
// WATCH OUT: Always clear intervals when toggling off to prevent memory leaks
// EXTENSION: Add different refresh rates for different widget types
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

// TODO 2: Widget Configuration System (Medium)
// LEARNING GOAL: Creating dynamic configuration panels for different widget types
// SUCCESS CRITERIA:
//   - Configuration panel displays correct controls for each widget type
//   - Controls are properly labeled and have appropriate default values
//   - Configuration options match the widget's functionality
// DEBUGGING TIP: Use document.getElementById to verify elements are created correctly
// HINT: Each widget type needs different configuration options (weather needs units, pokemon needs display options)
// WATCH OUT: Make sure input IDs match what you'll reference in applyConfig()
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

// TODO 5: Dashboard Layout Management (Hard)
// LEARNING GOAL: Dynamic UI generation and array-based rendering
// SUCCESS CRITERIA:
//   - Render all widgets from dashboardWidgets array
//   - Each widget displays with correct title and remove button
//   - Empty state message shows when no widgets are added
//   - Mini-widget placeholders are initialized after rendering
// DEBUGGING TIP: Use console.log(dashboardWidgets) to inspect the widget array
// HINT: Use .map() to transform widget objects into HTML strings, then .join('') to combine
// WATCH OUT: Each widget needs a unique data-widget-id for removal functionality
// EXTENSION: Add drag-and-drop to reorder widgets in the dashboard
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

/*
========================================================================================
STUDENT INSTRUCTIONS: API Widget Builder Challenge
========================================================================================

OVERVIEW:
This activity teaches you how to build a modular widget system that integrates multiple
APIs into a customizable dashboard. You'll learn component-based architecture, state
management, and how to coordinate multiple data sources in a single application.

WHAT'S ALREADY WORKING (65-70% COMPLETE):
✅ Widget loading system with templates
✅ Four different widgets (Weather, Pokemon, Space, Quotes)
✅ All API fetch functions are implemented
✅ Display functions for showing data
✅ Basic styling and layout

YOUR TASKS (30-35% TO COMPLETE):

========================================================================================
TODO 1: Basic Widget Initialization (Easy) - 15 minutes
========================================================================================
LOCATION: Line 115 - initializeWidget() function

WHAT YOU'LL LEARN:
- How to initialize different widget types with default data
- Using switch statements for multi-option logic
- Async/await patterns for sequential operations

SUCCESS CRITERIA:
✓ All four widget types load with their default data
✓ Weather widget shows London weather
✓ Pokemon widget shows Pikachu
✓ Space widget shows Astronomy Picture of the Day
✓ Quotes widget shows a random inspirational quote

TESTING STEPS:
1. Click each widget button in the Widget Library
2. Verify default data loads correctly
3. Check browser console for any initialization errors
4. Try clicking widgets multiple times

DEBUGGING TIPS:
- Open Developer Tools (F12) → Console tab
- Look for error messages during widget initialization
- Use console.log(widgetType) to see which widget is being loaded
- Verify that helper functions (loadWeatherData, etc.) are called

========================================================================================
TODO 2: Widget Configuration System (Medium) - 20 minutes
========================================================================================
LOCATION: Line 505 - loadWidgetConfig() function

WHAT YOU'LL LEARN:
- Dynamic HTML generation based on application state
- Creating different UI controls (inputs, selects, checkboxes)
- Designing user-friendly configuration interfaces

SUCCESS CRITERIA:
✓ Configuration panel appears when clicking "Customize" button
✓ Each widget type shows appropriate configuration options
✓ Weather widget offers units selection (Celsius/Fahrenheit)
✓ Pokemon widget has display options (shiny, stats)
✓ All input elements have correct IDs for later reference

TESTING STEPS:
1. Load a widget (e.g., Weather widget)
2. Click the "Customize" button
3. Verify configuration controls appear
4. Switch to different widgets and check their config options
5. Inspect HTML to verify input IDs are correct

DEBUGGING TIPS:
- Check that activeWidget variable is set correctly
- Use console.log(activeWidget) before the switch statement
- Verify configControls element exists: console.log(configControls)
- Test with all four widget types

========================================================================================
TODO 3: Multi-API Integration (Hard) - 30 minutes
========================================================================================
LOCATION: Line 230 - loadPokemonData() function

WHAT YOU'LL LEARN:
- Integrating with real-world APIs (PokeAPI)
- Handling different response formats
- Error handling for network failures and invalid data
- Parsing complex JSON structures

SUCCESS CRITERIA:
✓ Successfully fetch Pokemon data using name or ID
✓ Display Pokemon sprite image
✓ Show Pokemon stats (HP, Attack, Defense, etc.)
✓ Handle errors gracefully (invalid Pokemon names)
✓ Support both shiny and normal forms

API ENDPOINTS:
- PokeAPI Base: https://pokeapi.co/api/v2/pokemon
- Get Pokemon by name: https://pokeapi.co/api/v2/pokemon/pikachu
- Get Pokemon by ID: https://pokeapi.co/api/v2/pokemon/25

TESTING STEPS:
1. Load Pokemon widget and verify "pikachu" appears
2. Search for "charizard" - should show fire Pokemon
3. Try searching by ID: "25" should show Pikachu
4. Test error handling: search "zzz" (invalid Pokemon)
5. Toggle "Show Shiny" checkbox and verify sprite changes

DEBUGGING TIPS:
- Log the full API response: console.log(pokemon)
- Check response.ok before parsing JSON
- Verify sprite URLs: console.log(pokemon.sprites.front_default)
- Test with these valid Pokemon: pikachu, charizard, bulbasaur, eevee
- Test with these IDs: 1, 25, 150 (Bulbasaur, Pikachu, Mewtwo)

COMMON ERRORS:
- "Pokemon not found" → Check spelling or try a different name
- "Cannot read property 'sprites'" → API response may be malformed
- Network error → Check internet connection

========================================================================================
TODO 4: Widget Communication & Events (Medium) - 25 minutes
========================================================================================
LOCATION: Line 479 - toggleAutoRefresh() function

WHAT YOU'LL LEARN:
- Using JavaScript intervals for periodic tasks
- Managing interval IDs to prevent memory leaks
- Event-driven programming with checkboxes
- Map data structure for storing interval references

SUCCESS CRITERIA:
✓ Auto-refresh checkbox toggles periodic updates
✓ Quotes refresh every 30 seconds when enabled
✓ Interval stops cleanly when checkbox is unchecked
✓ No memory leaks from orphaned intervals

TESTING STEPS:
1. Load the Quotes widget
2. Enable "Auto-refresh" checkbox
3. Watch quotes change every 30 seconds
4. Disable checkbox and verify updates stop
5. Re-enable and verify it works again
6. Check console for interval creation/cleanup logs

DEBUGGING TIPS:
- Log interval creation: console.log('Interval created:', interval)
- Log interval cleanup: console.log('Interval cleared')
- Check autoRefreshIntervals Map: console.log(autoRefreshIntervals)
- Verify only one interval exists at a time
- Use setInterval documentation: https://developer.mozilla.org/en-US/docs/Web/API/setInterval

EXTENSION CHALLENGE:
- Add different refresh rates for different widgets
- Weather: 5 minutes (300000ms)
- Quotes: 30 seconds (30000ms)
- Space: 1 hour (3600000ms)

========================================================================================
TODO 5: Dashboard Layout Management (Hard) - 30 minutes
========================================================================================
LOCATION: Line 654 - renderDashboard() function

WHAT YOU'LL LEARN:
- Array-based rendering patterns
- Dynamic HTML generation with .map() and .join()
- Managing collections of UI components
- Event delegation and data attributes

SUCCESS CRITERIA:
✓ Dashboard displays all added widgets in a grid layout
✓ Each widget shows correct title and icon
✓ Remove button (×) works for each widget
✓ Empty state message when no widgets are added
✓ Dashboard updates automatically when widgets are added/removed

TESTING STEPS:
1. Configure a Weather widget and click "Add to Dashboard"
2. Verify widget appears in the dashboard grid
3. Add more widgets (Pokemon, Space, Quotes)
4. Click the × button to remove a widget
5. Remove all widgets and verify empty state message
6. Click "Export Dashboard" to test JSON export

DEBUGGING TIPS:
- Log dashboardWidgets array: console.log(dashboardWidgets)
- Verify each widget has unique ID: console.log(widget.id)
- Check grid innerHTML after rendering
- Test with 1, 3, and 6+ widgets to see grid behavior
- Inspect data-widget-id attributes in DevTools

ADVANCED DEBUGGING:
- Use Array.map() documentation: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map
- Template literals guide: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals

========================================================================================
LEARNING PATH (Recommended Order):
========================================================================================

BEGINNER (Start Here):
1. Complete TODO 1 first - it's the easiest and gets widgets working
2. Test all four widget types to understand the system
3. Read through existing code to see patterns

INTERMEDIATE:
4. Complete TODO 2 to add configuration controls
5. Complete TODO 4 to add auto-refresh functionality
6. Experiment with different configuration options

ADVANCED:
7. Complete TODO 3 for real API integration
8. Complete TODO 5 for dashboard management
9. Try the extension challenges below

========================================================================================
EXTENSION CHALLENGES (For Advanced Students):
========================================================================================

🌟 CHALLENGE 1: Add a fifth widget type
- Choose an API from this list: https://github.com/public-apis/public-apis
- Create a new widget template in HTML
- Add API integration in script.js
- Add configuration options

🌟 CHALLENGE 2: Widget persistence
- Save dashboard layout to localStorage
- Load saved widgets on page refresh
- Add "Load Saved Dashboard" button

🌟 CHALLENGE 3: Widget customization
- Allow users to resize widgets
- Add color theme options (dark mode, light mode)
- Create widget presets (News Dashboard, Gaming Dashboard, etc.)

🌟 CHALLENGE 4: Advanced API features
- Add pagination for Pokemon list (previous/next buttons)
- Show 7-day weather forecast instead of current weather
- Display multiple Mars rover photos in a carousel

🌟 CHALLENGE 5: Dashboard analytics
- Track which widgets are used most
- Show "Most Popular Widget" badge
- Add usage statistics to dashboard

========================================================================================
API DOCUMENTATION:
========================================================================================

WEATHER API (Simulated):
- This activity uses simulated weather data for offline testing
- Production version would use: https://openweathermap.org/api
- Cities available: London, Paris, Tokyo, New York

POKEMON API (Real - No Key Required):
- Base URL: https://pokeapi.co/api/v2
- Documentation: https://pokeapi.co/docs/v2
- No rate limits for reasonable usage
- Returns JSON with sprites, stats, types, abilities

NASA API (Simulated):
- This activity uses simulated NASA data
- Production version would use: https://api.nasa.gov/
- Requires free API key from NASA
- Available data: APOD, Mars Rover, Near Earth Objects

QUOTES API (Simulated):
- This activity uses predefined quotes
- Production version could use: https://quotable.io/
- No authentication required
- Returns random inspirational quotes

========================================================================================
SUCCESS CRITERIA FOR COMPLETION:
========================================================================================

✅ ALL 5 TODOs COMPLETED
✅ All four widget types load and display correctly
✅ Configuration panel works for all widgets
✅ Pokemon widget fetches real data from PokeAPI
✅ Auto-refresh toggles on/off properly
✅ Dashboard displays multiple widgets in a grid
✅ Remove widget functionality works
✅ Export dashboard creates valid JSON file
✅ No console errors during normal operation
✅ Code is well-commented with your own notes

========================================================================================
DEBUGGING CHECKLIST (If Something Goes Wrong):
========================================================================================

❌ Widget won't load:
   → Check browser console for errors
   → Verify widget template exists in HTML
   → Check that loadWidget() is called correctly

❌ API fetch fails:
   → Check internet connection
   → Verify API endpoint URL is correct
   → Look for CORS errors in console
   → Test API URL directly in browser

❌ Configuration not working:
   → Verify configControls element exists
   → Check that input IDs match what applyConfig() expects
   → Use console.log to debug switch statement

❌ Dashboard not rendering:
   → Check dashboardWidgets array length
   → Verify renderDashboard() is called after adding widgets
   → Inspect HTML to see if grid element exists

❌ Auto-refresh not stopping:
   → Check that clearInterval() is called with correct ID
   → Verify interval is removed from autoRefreshIntervals Map
   → Test with console.log to track interval lifecycle

========================================================================================
FINAL TIPS:
========================================================================================

📚 READ THE CODE FIRST
   Before making changes, read through the entire file to understand the structure

🧪 TEST INCREMENTALLY
   Complete one TODO, test it thoroughly, then move to the next

💬 USE CONSOLE.LOG LIBERALLY
   Add console.log statements to understand data flow

🔍 INSPECT THE DOM
   Use browser DevTools to inspect generated HTML

📖 REFERENCE THE DOCS
   Check MDN Web Docs when you encounter unfamiliar concepts

🤝 ASK FOR HELP
   If stuck for more than 15 minutes, ask your instructor

🎉 CELEBRATE PROGRESS
   Each working TODO is an achievement - you're building something complex!

========================================================================================
HAVE FUN BUILDING YOUR WIDGET DASHBOARD!
========================================================================================
*/