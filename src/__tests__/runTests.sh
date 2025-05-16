#!/bin/bash

# Colors for better readability
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}==== Corp Astro Server Testing Suite ====${NC}"
echo -e "${YELLOW}Running tests for the Corp Astro backend server${NC}"
echo ""

# Function to run tests and check result
run_test() {
  local test_name=$1
  local test_command=$2
  
  echo -e "${YELLOW}Running $test_name tests...${NC}"
  
  # Run the test command
  npm run $test_command
  
  # Check the result
  if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ $test_name tests passed${NC}"
    return 0
  else
    echo -e "${RED}✗ $test_name tests failed${NC}"
    return 1
  fi
}

# Create a flag to track overall success
overall_success=true

# Run unit tests for mobile services
if run_test "Mobile API" "test:mobile"; then
  echo ""
else
  overall_success=false
  echo ""
fi

# Run unit tests for content services
if run_test "Content API" "test:content"; then
  echo ""
else
  overall_success=false
  echo ""
fi

# Run end-to-end tests
if run_test "End-to-End" "test:e2e"; then
  echo ""
else
  overall_success=false
  echo ""
fi

# Run coverage report
echo -e "${YELLOW}Generating test coverage report...${NC}"
npm run test:coverage

# Final summary
echo ""
if $overall_success; then
  echo -e "${GREEN}==== All tests passed successfully! ====${NC}"
  exit 0
else
  echo -e "${RED}==== Some tests failed. Please check the output above for details. ====${NC}"
  exit 1
fi
