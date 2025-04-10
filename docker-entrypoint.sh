#!/bin/bash
set -e

# Install local dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ] && [ -f "package.json" ]; then
  echo "Installing dependencies..."
  yarn install --frozen-lockfile
fi

# Generate TypeScript declaration files
/app/scripts/generate-types.sh

# Execute the command passed to the script
exec "$@"