#!/bin/bash
set -e

# Install local dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ] && [ -f "package.json" ]; then
  echo "Installing dependencies..."
  yarn install --frozen-lockfile
fi

# Generate TypeScript declaration files using the compiler
echo "Generating TypeScript declaration files..."
if [ -f "tsconfig.json" ]; then
  tsc --project tsconfig.json
else
  echo "Warning: tsconfig.json not found. TypeScript declarations may not be generated correctly."
  # Ensure TypeScript declarations directory exists as a fallback
  mkdir -p dist-types/src
fi

# Execute the command passed to the script
exec "$@"