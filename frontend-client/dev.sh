#!/bin/bash
# Kill port 5173 if exists
lsof -ti:5173 | xargs kill -9 2>/dev/null || true

# Clear cache
rm -rf node_modules/.vite

echo "🚀 Starting dev server..."
npm run dev
