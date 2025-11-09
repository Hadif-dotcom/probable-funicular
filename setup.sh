#!/bin/bash

# Widget Builder Discovery Challenge Setup
# Activity 05: Dynamic UI components with API data

echo "🎯 Setting up Widget Builder Discovery Challenge..."
echo ""

if [ ! -f "index.html" ]; then
    echo "❌ Error: Please run this script from the activity-05-widget-builder directory"
    exit 1
fi

echo "📚 Discovery Challenge Overview:"
echo "   🎯 Build dynamic UI widgets powered by API data"
echo "   🎨 Focus: Component architecture, real-time updates, responsive design"
echo "   🔬 Method: UI/UX pattern exploration and implementation"
echo ""

echo "🎓 DISCOVERY LEARNING OBJECTIVES:"
echo "   1. Research component-based architecture patterns"
echo "   2. Explore real-time data binding techniques"
echo "   3. Investigate responsive widget design principles"
echo "   4. Master dynamic content generation"
echo "   5. Build professional dashboard components"
echo ""

if command -v python3 &> /dev/null; then
    echo "🚀 Starting server at: http://localhost:8000"
    python3 -m http.server 8000
else
    echo "❌ Python not found. Use VS Code Live Server or similar."
fi

echo "✨ Build beautiful, data-driven widgets! 🎯"