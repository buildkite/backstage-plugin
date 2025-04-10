#!/bin/bash
set -e

# Install local dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ] && [ -f "package.json" ]; then
  echo "Installing dependencies..."
  yarn install --frozen-lockfile
fi

# Ensure TypeScript declarations directory exists
mkdir -p dist-types/src

# Create a basic index.d.ts file if it doesn't exist
if [ ! -f dist-types/src/index.d.ts ]; then
  echo '/**
 * A Backstage plugin that integrates with Buildkite
 *
 * @packageDocumentation
 */

export * from "../src/plugin";
export * from "../src/api";
export * from "../src/components";
export * from "../src/hooks";
export * from "../src/routes";' > dist-types/src/index.d.ts
fi

# Execute the command passed to the script
exec "$@"