# Widget Builder - Activity 05

Master advanced API integration by building a modular widget dashboard! This template teaches you to create reusable, data-driven components with multiple APIs.

## 🎯 Learning Objectives

By completing this activity, you will:
- Build reusable widget components that work with different APIs
- Handle multiple API data formats and structures
- Create a modular dashboard architecture
- Implement widget configuration and customization systems
- Master advanced error handling across different API services
- Design responsive, user-friendly widget interfaces

## 🚀 Getting Started

### ⚡ Quick Start (See Results in 30 Seconds!)

**IMPORTANT: This template includes 65% WORKING CODE! You can see widgets in action immediately:**

1. **Navigate to this folder** in your terminal/command prompt
2. **Start a local server** (choose one):
   ```bash
   # Mac/Linux:
   python3 -m http.server 8001

   # Windows:
   python -m http.server 8001

   # Alternative using Node.js:
   npx http-server -p 8001
   ```
3. **Open your browser** to: http://localhost:8001
4. **Click any widget type** to see it in action:
   - Weather Dashboard - Shows real-time weather
   - Pokemon Explorer - Displays Pokemon data
   - Space Explorer - NASA APOD already working
   - Daily Quotes - Inspirational quotes loaded

### 🎯 What's Already Working

**65% of the code is implemented for you:**
- ✅ **Weather Widget** - Complete with city search, unit toggle, and refresh (fully working)
- ✅ **Pokemon Widget** - Search by name, random Pokemon, shiny toggle (fully working)
- ✅ **Space Widget** - APOD display working (Mars/NEO need TODOs)
- ✅ **Quotes Widget** - Random quotes with category filter (fully working)
- ⚠️ **Widget Customization** - Settings panel (TODO for you)
- ⚠️ **Dashboard System** - Multi-widget layout (TODO for you)
- ⚠️ **Export/Import** - Save configurations (TODO for creativity)

### 📝 Your Learning Tasks

1. **First, test each widget** to understand how they work
2. **Then complete the dashboard system** for managing multiple widgets
3. **Finally, add customization and export features**

## 📋 Tasks to Complete

### TODO 1: Widget Customization Panel (Medium)
Complete the widget customization system to let users configure widget settings.

**Requirements:**
- Create a settings modal/panel for each widget type
- Allow users to change widget titles and refresh intervals
- Save customizations to localStorage
- Apply changes dynamically without page reload

**Success Criteria:**
- Clicking "⚙️ Customize" opens a settings panel
- Changes persist after page refresh
- Each widget type has appropriate configuration options
- Settings apply immediately when saved

### TODO 2: Multi-Widget Dashboard (Medium-Hard)
Implement the dashboard system to display multiple widgets simultaneously.

**Requirements:**
- Create a grid layout that holds multiple widgets
- Add "Add to Dashboard" button for each widget type
- Allow users to remove widgets from dashboard
- Implement drag-and-drop reordering (optional)

**Success Criteria:**
- Users can add multiple widgets to dashboard
- Dashboard layout is responsive (1-3 columns based on screen size)
- Each widget updates independently
- Remove buttons work correctly

### TODO 3: Mars Rover Photos (Medium)
Complete the Mars Rover section of the Space Widget.

**API Endpoint:** `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos`

**Requirements:**
- Fetch photos from a specific sol (Mars day)
- Display multiple photos in a gallery format
- Add filters for different cameras
- Handle cases where no photos exist for that sol

**Success Criteria:**
- Mars Rover tab shows photos
- Camera filter works correctly
- Loading state displays during fetch
- Graceful error handling for invalid sols

### TODO 4: Export/Import Dashboard (Challenge)
Create functionality to save and load dashboard configurations.

**Requirements:**
- Export current dashboard configuration as JSON
- Download configuration file to user's computer
- Import configuration from uploaded file
- Validate imported data before applying

**Features to implement:**
- JSON.stringify() for export
- File download using Blob API
- File upload input and reading
- Data validation and error handling

### TODO 5: Widget Analytics (Bonus)
Add usage tracking to understand how users interact with widgets.

**Purpose:**
- Track which widgets are used most
- Monitor API call success rates
- Display statistics in a summary panel
- Help users understand their widget usage patterns

## 🛠️ Widget Architecture Reference

### Pre-Built Widget Classes

Each widget follows this base structure:
```javascript
class BaseWidget {
  constructor(containerId, config) {
    this.container = document.getElementById(containerId);
    this.config = config;
    this.cache = new Map(); // For API caching
    this.init();
  }

  async init() {
    this.render();
    await this.loadData();
  }

  render() { /* Creates HTML structure */ }
  async loadData() { /* Fetches from API */ }
  displayData(data) { /* Renders data */ }
  showError(error) { /* Handles errors */ }
}
```

### Available Widget Types

**Weather Widget Features:**
- City search with real-time data
- Celsius/Fahrenheit toggle
- Displays: temperature, humidity, wind, pressure
- Auto-refresh option

**Pokemon Widget Features:**
- Search by name or ID
- Random Pokemon button
- Shiny form toggle
- Stats display (HP, Attack, Defense)
- Type badges with colors

**Space Widget Features:**
- Astronomy Picture of the Day (APOD)
- Mars Rover photo galleries
- Near Earth Objects (NEO) tracking
- Date selection for historical data

**Quotes Widget Features:**
- Random inspirational quotes
- Category filtering
- Author information
- Share functionality

## 🔧 API Reference

### Weather Widget (OpenWeatherMap)
**Base URL:** `https://api.openweathermap.org/data/2.5/weather`
**API Key:** Required (free tier available at openweathermap.org)

**Example Request:**
```javascript
const url = `https://api.openweathermap.org/data/2.5/weather?q=London&appid=${apiKey}&units=metric`;
```

**Response Format:**
```json
{
  "main": {
    "temp": 15.5,
    "feels_like": 14.2,
    "humidity": 72,
    "pressure": 1013
  },
  "weather": [{"description": "clear sky", "icon": "01d"}],
  "wind": {"speed": 5.2}
}
```

### Pokemon Widget (PokéAPI)
**Base URL:** `https://pokeapi.co/api/v2/pokemon`
**API Key:** None required (completely free!)

**Example Requests:**
```javascript
// By name
GET https://pokeapi.co/api/v2/pokemon/pikachu

// By ID
GET https://pokeapi.co/api/v2/pokemon/25
```

**Response Format:**
```json
{
  "name": "pikachu",
  "id": 25,
  "sprites": {
    "front_default": "url_to_image",
    "front_shiny": "url_to_shiny_image"
  },
  "stats": [
    {"stat": {"name": "hp"}, "base_stat": 35},
    {"stat": {"name": "attack"}, "base_stat": 55}
  ],
  "types": [{"type": {"name": "electric"}}]
}
```

### Space Widget (NASA Open Data)
**Base URL:** `https://api.nasa.gov/`
**API Key:** Use `DEMO_KEY` for testing, get free key at api.nasa.gov

**APOD Endpoint:**
```javascript
GET https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY
```

**Mars Rover Photos:**
```javascript
GET https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=1000&api_key=DEMO_KEY
```

**Near Earth Objects:**
```javascript
GET https://api.nasa.gov/neo/rest/v1/feed?start_date=2024-01-01&api_key=DEMO_KEY
```

### Quotes Widget (Quotable)
**Base URL:** `https://quotable.io`
**API Key:** None required (free and open!)

**Example Requests:**
```javascript
// Random quote
GET https://quotable.io/random

// Random quote by tag
GET https://quotable.io/random?tags=technology

// Multiple random quotes
GET https://quotable.io/quotes/random?limit=3
```

**Response Format:**
```json
{
  "content": "The only way to do great work is to love what you do.",
  "author": "Steve Jobs",
  "tags": ["inspirational", "work"]
}
```

## 🧪 Testing Your Work

### Manual Testing Checklist
- [ ] **Weather Widget** loads and displays city weather correctly
- [ ] **Pokemon Widget** searches and displays Pokemon with shiny toggle
- [ ] **Space Widget** shows APOD and Mars Rover photos
- [ ] **Quotes Widget** fetches random quotes with category filter
- [ ] **Customization Panel** opens and saves settings
- [ ] **Dashboard** displays multiple widgets simultaneously
- [ ] **Export/Import** saves and loads dashboard configurations
- [ ] All widgets show loading states during API calls
- [ ] Error messages display when APIs fail
- [ ] Responsive design works on mobile devices

### Debugging Tips
1. **Open Developer Tools** (F12 in most browsers)
2. **Check Console tab** for API errors and responses
3. **Use Network tab** to inspect API requests/responses
4. **Check localStorage** to verify saved configurations
5. **Test with different screen sizes** using device mode

### Common Issues & Solutions

**Issue:** "API key invalid" for Weather Widget
**Solution:** Get a free API key from openweathermap.org and add it to your config

**Issue:** Mars Rover photos not loading
**Solution:** Try different sol values (1000-2000 are reliable), some sols have no photos

**Issue:** Dashboard widgets overlapping
**Solution:** Check that CSS Grid is properly configured with `repeat(auto-fit, minmax(350px, 1fr))`

**Issue:** Export file downloads as blank
**Solution:** Ensure dashboard data exists in localStorage before exporting

**Issue:** CORS errors in browser console
**Solution:** Use local development server (python http.server) instead of opening HTML file directly

## 🎓 Extension Challenges

Ready to level up your widget dashboard? Try these challenges:

### Beginner Extensions
- **Widget Themes:** Add dark mode and light mode themes for all widgets
- **Favorite Widgets:** Let users mark widgets as favorites with a star icon
- **Widget Counter:** Display how many times each widget has been used
- **Quick Settings:** Add one-click presets for common configurations

### Intermediate Extensions
- **News Feed Widget:** Integrate NewsAPI for latest headlines
- **Crypto Prices Widget:** Display Bitcoin/Ethereum prices from CoinGecko API
- **GitHub Stats Widget:** Show repository stars and issues from GitHub API
- **Widget Resize:** Allow users to change widget sizes (small, medium, large)

### Advanced Extensions
- **Real-time Updates:** Use WebSocket APIs for live data streaming
- **Widget Marketplace:** Create a system where users can share custom widgets
- **Collaborative Dashboard:** Let multiple users edit the same dashboard in real-time
- **Analytics Dashboard:** Track widget usage patterns with charts and graphs
- **Widget Templates:** Save and reuse widget configurations as templates

### Creative Extensions
- **Widget Animations:** Add entrance animations when widgets load
- **Sound Effects:** Play sounds when widgets complete actions
- **Widget Recommendations:** Suggest widgets based on usage patterns
- **Mobile App Version:** Convert to React Native or PWA

## 📁 File Structure Reference

```
activity-05-widget-builder/
├── index.html          # Main interface with widget selector
├── styles.css          # Comprehensive styling for all widgets
├── script.js           # Widget classes and API integrations
├── README.md           # This documentation
└── sample-data.json    # Fallback data for offline testing
```

## 📚 Additional Resources

### API Documentation
- [OpenWeatherMap API Docs](https://openweathermap.org/api) - Weather data API
- [PokéAPI Documentation](https://pokeapi.co/docs/v2) - Pokemon data API
- [NASA Open Data Portal](https://api.nasa.gov/) - Space and astronomy APIs
- [Quotable API Guide](https://github.com/lukePeavey/quotable) - Quotes API

### JavaScript Concepts
- **Class-based Architecture:** Learn to build reusable components
- **LocalStorage API:** Persist data in the browser
- **Blob API:** Create and download files dynamically
- **CSS Grid Layout:** Build responsive multi-column layouts
- **Error Boundaries:** Handle API failures gracefully

### Advanced Topics
- **API Caching Strategies:** Reduce redundant requests
- **Debouncing & Throttling:** Optimize user input handling
- **Progressive Web Apps:** Make your dashboard work offline
- **Service Workers:** Cache API responses for better performance

## 🏆 Success Criteria

Your project is complete when:
- ✅ All 4 widget types work correctly (Weather, Pokemon, Space, Quotes)
- ✅ Customization panel saves and applies settings
- ✅ Dashboard displays multiple widgets simultaneously
- ✅ Export/Import functionality preserves configurations
- ✅ Loading states and error handling work across all widgets
- ✅ Responsive design functions on mobile and desktop
- ✅ Code is organized and well-commented
- ✅ At least one extension challenge completed

## 🎉 Congratulations!

Once you complete this project, you'll have:
- Built a production-ready widget dashboard system
- Mastered working with 4 different API structures
- Created reusable, configurable components
- Implemented advanced features like export/import
- Gained experience with complex state management
- Developed skills in responsive design and user experience

This project demonstrates professional-level API integration skills and serves as an impressive portfolio piece!

---

**Need Help?**
- Review the working widget code to understand patterns
- Check API documentation for correct endpoint usage
- Test one widget at a time before building the dashboard
- Use console.log() to debug data flow
- Start with the basic TODOs before attempting extensions

Happy widget building! 🚀✨