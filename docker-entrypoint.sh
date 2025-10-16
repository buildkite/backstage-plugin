#!/bin/bash
set -e

# Install local dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ] && [ -f "package.json" ]; then
  echo "Installing dependencies..."
  yarn install --frozen-lockfile
fi

# Make sure backstage CLI is available locally (not globally)
if ! command -v "$(npm bin)/backstage-cli" &> /dev/null; then
  echo "Installing @backstage/cli locally if needed..."
  yarn add --dev @backstage/cli
fi

# Execute the command passed to the script
exec "$@"