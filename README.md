# API Widget Builder Template

A comprehensive StackBlitz template for building interactive widgets using various APIs. Learn to create reusable components with real-world data.

## 🎯 Learning Objectives

- Build interactive widgets with real API data
- Create reusable and configurable components
- Handle different API response formats and data structures
- Implement user-friendly interfaces with loading states and error handling
- Manage multiple widgets in a dashboard environment
- Explore creative combinations of functionality and design

## ✨ Featured Widgets

### 🌤️ Weather Dashboard
- Real-time weather data for any city
- Temperature unit switching (Celsius/Fahrenheit)
- Comprehensive weather details (humidity, wind, pressure)
- Auto-refresh capabilities

### 🔴 Pokemon Explorer
- Search Pokemon by name or ID
- Random Pokemon discovery
- Shiny form toggle
- Detailed stats display
- Evolution chain information

### 🚀 NASA Space Explorer
- Astronomy Picture of the Day (APOD)
- Mars Rover photos
- Near Earth Objects tracking
- Multiple NASA API endpoints

### 💭 Daily Inspiration
- Random inspirational quotes
- Category-based filtering
- Auto-refresh functionality
- Motivational content delivery

## 📁 File Structure

```
activity-05-widget-builder/
├── index.html          # Main widget builder interface
├── styles.css          # Comprehensive styling system
├── script.js           # Widget framework and API integrations
├── README.md           # This documentation
└── sample-data.json    # Fallback data for offline testing
```

## 🚀 Quick Start

### Option 1: StackBlitz (Recommended)
1. Upload all files to a new StackBlitz project
2. Open the preview
3. Choose a widget type and start building!

### Option 2: Local Development
1. Download all files to a folder
2. Run `python3 -m http.server 8001`
3. Open `http://localhost:8001`

## 🎮 How to Use

### 1. Choose Your Widget Type
- Click on any widget option (Weather, Pokemon, Space, or Quotes)
- Each widget loads with sample data to get you started

### 2. Interact with Widgets
- **Weather**: Enter city names, toggle temperature units
- **Pokemon**: Search by name/ID, toggle shiny forms, view stats
- **Space**: Switch between APOD, Mars photos, and NEO data
- **Quotes**: Change categories, enable auto-refresh

### 3. Customize Widgets
- Click "⚙️ Customize" to access configuration options
- Modify default settings, API keys, and display preferences
- Apply changes to see immediate updates

### 4. Build a Dashboard
- Configure multiple widgets
- Add them to a multi-widget dashboard
- Export dashboard configurations
- Manage widget layouts

## 🛠️ Widget Development Framework

### Basic Widget Structure
```javascript
class CustomWidget {
  constructor(containerId, config) {
    this.container = document.getElementById(containerId);
    this.config = config;
    this.init();
  }

  async init() {
    this.render();
    await this.loadData();
  }

  render() {
    this.container.innerHTML = `
      <div class="widget">
        <h3>${this.config.title}</h3>
        <div id="widgetData">Loading...</div>
        <button onclick="this.refresh()">Refresh</button>
      </div>
    `;
  }

  async loadData() {
    try {
      const response = await fetch(this.config.apiUrl);
      const data = await response.json();
      this.displayData(data);
    } catch (error) {
      this.showError(error.message);
    }
  }
}
```

### Advanced Features
- **Caching System**: Reduces API calls with intelligent caching
- **Error Handling**: Graceful degradation and user feedback
- **Auto-Refresh**: Configurable automatic data updates
- **Configuration Management**: Persistent widget settings
- **Responsive Design**: Mobile-friendly widget layouts

## 🔧 API Configurations

### Weather Widget
```javascript
// OpenWeatherMap API (Free tier available)
const weatherConfig = {
  apiKey: 'your_openweather_key',
  baseUrl: 'https://api.openweathermap.org/data/2.5/weather',
  units: 'metric' // or 'imperial'
};
```

### Pokemon Widget
```javascript
// PokéAPI (No API key required)
const pokemonConfig = {
  baseUrl: 'https://pokeapi.co/api/v2/pokemon',
  showShiny: false,
  showStats: true
};
```

### Space Widget
```javascript
// NASA Open Data API
const spaceConfig = {
  apiKey: 'DEMO_KEY', // Get free key from api.nasa.gov
  endpoints: {
    apod: 'https://api.nasa.gov/planetary/apod',
    mars: 'https://api.nasa.gov/mars-photos/api/v1/rovers',
    neo: 'https://api.nasa.gov/neo/rest/v1/feed'
  }
};
```

### Quotes Widget
```javascript
// Quotable API (No API key required)
const quotesConfig = {
  baseUrl: 'https://quotable.io/random',
  categories: ['inspirational', 'motivational', 'life', 'success'],
  autoRefresh: false
};
```

## 🎨 Styling System

### Widget Container Classes
```css
.widget {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  transition: transform 0.3s ease;
}

.widget:hover {
  transform: translateY(-2px);
}
```

### Loading States
```css
.loading::before {
  content: '';
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top: 2px solid rgba(255,255,255,0.8);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 10px;
}
```

### Responsive Grid
```css
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 20px;
  padding: 30px;
}
```

## 🧪 Testing Your Widgets

### Manual Testing Checklist
- [ ] Widget loads with sample data
- [ ] User inputs trigger API calls
- [ ] Loading states display during requests
- [ ] Errors are handled gracefully
- [ ] Configuration changes apply correctly
- [ ] Responsive design works on mobile
- [ ] Dashboard functionality operates smoothly

### API Testing Scenarios
1. **Valid Requests**: Test with known good data
2. **Invalid Inputs**: Try non-existent cities, Pokemon, etc.
3. **Network Issues**: Test offline behavior
4. **Rate Limits**: Verify graceful handling of API limits
5. **Empty Responses**: Handle APIs returning no data

## 🚀 Extension Ideas

### Beginner Extensions
- Add more pre-built widget themes
- Implement widget favorites system
- Create widget sharing functionality

### Intermediate Extensions
- Build a news feed widget
- Add a cryptocurrency price widget
- Create a GitHub repository explorer

### Advanced Extensions
- Implement widget marketplace
- Add real-time data streaming
- Create collaborative widget editing
- Build widget analytics dashboard

## 🔍 Widget Examples

### Custom News Widget
```javascript
class NewsWidget extends BaseWidget {
  constructor(containerId) {
    super(containerId, {
      title: 'Latest News',
      apiUrl: 'https://newsapi.org/v2/top-headlines',
      refreshInterval: 300000 // 5 minutes
    });
  }

  async loadData() {
    const response = await fetch(
      `${this.config.apiUrl}?country=us&apiKey=${this.apiKey}`
    );
    const data = await response.json();
    this.displayNews(data.articles);
  }
}
```

### Stock Price Widget
```javascript
class StockWidget extends BaseWidget {
  constructor(containerId, symbol = 'AAPL') {
    super(containerId, {
      title: `${symbol} Stock Price`,
      symbol: symbol,
      autoRefresh: true
    });
  }

  async loadData() {
    // Integrate with financial API
    const stockData = await this.fetchStockPrice(this.config.symbol);
    this.displayStockInfo(stockData);
  }
}
```

## 💡 Best Practices

### Performance Optimization
- Implement intelligent caching to reduce API calls
- Use debouncing for user input events
- Lazy load widget content
- Optimize images and assets

### User Experience
- Always show loading states
- Provide clear error messages
- Make widgets responsive
- Enable keyboard navigation

### Code Organization
- Use modular widget classes
- Separate API logic from UI logic
- Implement consistent error handling
- Document widget configurations

## 🐛 Common Issues & Solutions

### API Key Problems
**Issue**: Widgets not loading data
**Solution**:
- Verify API keys are correctly configured
- Check if keys need activation time
- Ensure correct API endpoint URLs

### CORS Errors
**Issue**: "Cross-origin request blocked"
**Solution**:
- Use StackBlitz or local development server
- Some APIs require server-side proxy for production

### Rate Limiting
**Issue**: API requests being throttled
**Solution**:
- Implement request caching
- Add delays between requests
- Use free tier limits responsibly

### Widget Performance
**Issue**: Slow loading or unresponsive widgets
**Solution**:
- Optimize API calls and data processing
- Implement proper loading states
- Use efficient DOM manipulation

## 📚 Learning Resources

### API Documentation
- [OpenWeatherMap API](https://openweathermap.org/api)
- [PokéAPI](https://pokeapi.co/docs/v2)
- [NASA Open Data](https://api.nasa.gov/)
- [Quotable API](https://github.com/lukePeavey/quotable)

### Web Development
- [Fetch API Guide](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [CSS Grid Layout](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout)
- [JavaScript Classes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes)

## 🤝 Contributing

This template is designed for educational purposes and can be extended in many creative ways:

- Add new widget types
- Improve existing widget functionality
- Enhance the styling system
- Create new API integrations
- Build advanced dashboard features

## 🎓 Educational Value

This template teaches:
- **API Integration**: Working with different API formats and authentication
- **Component Architecture**: Building reusable, configurable components
- **Error Handling**: Graceful degradation and user feedback
- **State Management**: Managing widget configurations and data
- **Responsive Design**: Creating mobile-friendly interfaces
- **Performance**: Optimizing API calls and user interactions

---

Start building amazing widgets! 🎉 This template provides the foundation for creating engaging, data-driven web applications that connect to the vast ecosystem of web APIs.