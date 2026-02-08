#!/bin/bash

# Pediatrics Shelf Exam Study App - Startup Script

set -e

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo "Starting Pediatrics Shelf Exam Study App..."
echo ""

# Check if node_modules exists
if [ ! -d "$SCRIPT_DIR/node_modules" ]; then
  echo "Installing dependencies..."
  cd "$SCRIPT_DIR"
  npm install
  echo "Dependencies installed successfully"
  echo ""
fi

# Start the server
cd "$SCRIPT_DIR"
echo "Starting server..."
echo ""

# Function to open browser after a short delay
open_browser() {
  sleep 2

  # Detect OS and open browser accordingly
  if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    if command -v xdg-open > /dev/null; then
      xdg-open "http://localhost:3000"
    else
      echo "Please open http://localhost:3000 in your browser"
    fi
  elif [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    open "http://localhost:3000"
  elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" ]]; then
    # Windows
    start "http://localhost:3000"
  else
    echo "Please open http://localhost:3000 in your browser"
  fi
}

# Open browser in background
open_browser &

# Start the Node.js server
node server.js
