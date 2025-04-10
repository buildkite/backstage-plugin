#!/bin/bash
set -e

# This script creates TypeScript declaration files needed for packaging

echo "Creating TypeScript declaration files..."

# Create necessary directories
mkdir -p dist-types/src/components/types

# Create index.d.ts file
cat > dist-types/src/index.d.ts << 'EOF'
/**
 * A Backstage plugin that integrates with Buildkite
 *
 * @packageDocumentation
 */

export * from "./plugin";
export * from "./api";
export * from "./components";
export * from "./hooks";
export * from "./routes";
EOF

# Create components/index.d.ts file
cat > dist-types/src/components/index.d.ts << 'EOF'
/**
 * Buildkite plugin components
 */

// UI Components
export { BuildRow } from "./BuildRow";
export { BuildStep } from "./BuildStep";
export { BuildkiteWrapper } from "./BuildkiteWrapper";
export { Navatar } from "./Navatar";
export { PipelineView } from "./PipelineView";
export { TimeChip } from "./TimeChip";
export { BuildkiteHeader } from "./BuildkiteHeader";
export { TriggerBuildButton } from "./TriggerBuildButton";

// Page Components
export { PipelinePage } from "./PipelinePage";

// Feature Components
export { Job } from "./Job";
export { JobLogViewer } from "./JobLogViewer";
export { ViewerFetch } from "./ViewerFetch";
export { PipelineConfigEditor } from "./PipelineConfigEditor";

// Filter Components
export * from "./Filters";

// Types
export * from "./types/buildkiteTypes";
EOF

# Create empty declaration files for each component
for component in BuildRow BuildStep BuildkiteWrapper Navatar PipelineView TimeChip BuildkiteHeader TriggerBuildButton PipelinePage Job JobLogViewer ViewerFetch PipelineConfigEditor Filters; do
  echo 'export declare const '"$component"': any;' > "dist-types/src/components/$component.d.ts"
done

# Create buildkiteTypes.d.ts
cat > dist-types/src/components/types/buildkiteTypes.d.ts << 'EOF'
export interface BuildkiteType {
  [key: string]: any;
}
EOF

# Create empty declaration files for other imports
for file in plugin api hooks routes; do
  echo 'export {};' > "dist-types/src/$file.d.ts"
done

# Create empty Filters index
mkdir -p dist-types/src/components/Filters
echo 'export {};' > dist-types/src/components/Filters/index.d.ts

echo "TypeScript declaration files created successfully."