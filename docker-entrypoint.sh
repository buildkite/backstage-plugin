#!/bin/bash
set -e

# Install local dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ] && [ -f "package.json" ]; then
  echo "Installing dependencies..."
  yarn install --frozen-lockfile
fi

# Declaration files are now created in the Dockerfile
# This ensures they exist for all CI phases (lint, test, build)
# No need for runtime creation since we pre-create them in the Docker image

# Execute the command passed to the script
exec "$@"