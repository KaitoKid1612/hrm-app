#!/bin/bash

echo "🧪 Test scraper dependencies..."

echo ""
echo "Checking Python packages:"

packages=("selenium" "python_dotenv" "webdriver_manager" "pandas" "bs4" "lxml")

all_ok=true
for pkg in "${packages[@]}"; do
    if python3 -c "import $pkg" 2>/dev/null; then
        echo "  ✓ $pkg"
    else
        echo "  ✗ $pkg (not installed)"
        all_ok=false
    fi
done

echo ""
if [ "$all_ok" = true ]; then
    echo "✅ All dependencies are installed!"
    echo ""
    echo "Next steps:"
    echo "  1. cp .env.example .env"
    echo "  2. Edit .env file with your credentials"
    echo "  3. python3 main.py --scrape-only"
else
    echo "❌ Some dependencies are missing"
    echo "Run: pip3 install -r requirements.txt"
fi
