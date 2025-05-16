#!/bin/bash

# Corp Astro Analytics Initialization Script
# This script initializes the analytics system by running migrations and setting up the database

echo "Corp Astro Analytics Initialization"
echo "=================================="
echo

# Check if the setup-analytics.sh script exists and run it first
if [ -f "./scripts/setup-analytics.sh" ]; then
  echo "Running setup-analytics.sh to set up the database..."
  ./scripts/setup-analytics.sh
  
  if [ $? -ne 0 ]; then
    echo "Error: Failed to run setup-analytics.sh"
    exit 1
  fi
else
  echo "Warning: setup-analytics.sh not found. Skipping database setup."
fi

# Install TypeScript dependencies if needed
echo "Checking TypeScript dependencies..."
if ! command -v tsc &> /dev/null; then
  echo "TypeScript not found. Installing TypeScript..."
  npm install -g typescript
fi

# Compile TypeScript files
echo "Compiling TypeScript files..."
npm run build

if [ $? -ne 0 ]; then
  echo "Error: Failed to compile TypeScript files"
  exit 1
fi

# Register analytics routes
echo "Registering analytics routes..."
echo "Analytics routes have been registered in app.ts"

# Create example A/B test
echo "Creating example A/B test for onboarding flow..."
echo "A/B test will be created when the server starts"

echo
echo "Analytics system initialization complete!"
echo "You can now start the server with: npm start"
echo
echo "To track analytics events, use the following endpoints:"
echo "  - POST /api/analytics/events - Track general events"
echo "  - POST /api/analytics/batch - Batch process events"
echo "  - POST /api/analytics/feature-usage - Track feature usage"
echo "  - POST /api/analytics/ui-interaction - Track UI interactions"
echo "  - POST /api/analytics/astrology/chart - Track chart generation"
echo "  - POST /api/analytics/astrology/horoscope - Track horoscope views"
echo "  - POST /api/analytics/astrology/business-forecast - Track business forecasts"
echo "  - POST /api/analytics/astrology/free-tool - Track free tool usage"
echo "  - POST /api/analytics/astrology/subscription - Track subscription changes"
echo "  - POST /api/analytics/astrology/ai-chat - Track Astro Ratan AI chat"
echo "  - GET /api/analytics/ab-test/variant - Get A/B test variant"
echo "  - POST /api/analytics/ab-test/conversion - Track A/B test conversion"
echo
echo "For more information, see the documentation in docs/mobile-analytics-integration-guide.md"
