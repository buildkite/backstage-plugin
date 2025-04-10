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
fi

# Ensure TypeScript declarations directory exists
mkdir -p dist-types/src

# Create a basic index.d.ts file if it doesn't exist or generation failed
if [ ! -f dist-types/src/index.d.ts ]; then
  echo "Creating fallback declaration files..."
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

# Create components index.d.ts if it doesn't exist
if [ ! -f dist-types/src/components/index.d.ts ]; then
  mkdir -p dist-types/src/components
  echo '/**
 * Buildkite plugin components
 */
export * from "../../src/components/BuildRow";
export * from "../../src/components/BuildStep";
export * from "../../src/components/BuildkiteWrapper";
export * from "../../src/components/Navatar";
export * from "../../src/components/PipelineView";
export * from "../../src/components/TimeChip";
export * from "../../src/components/BuildkiteHeader";
export * from "../../src/components/TriggerBuildButton";
export * from "../../src/components/PipelinePage";
export * from "../../src/components/Job";
export * from "../../src/components/JobLogViewer";
export * from "../../src/components/ViewerFetch";
export * from "../../src/components/PipelineConfigEditor";
export * from "../../src/components/Filters";
export * from "../../src/components/types/buildkiteTypes";' > dist-types/src/components/index.d.ts
fi

# Execute the command passed to the script
exec "$@"