FROM node:20

WORKDIR /app

# Install global dependencies
RUN npm install -g typescript@5.1.6 eslint-plugin-react-hooks@4.6.0 @backstage/cli

# Copy package.json and tsconfig.json first to leverage Docker caching
COPY package.json tsconfig.json ./

# Create necessary directories
RUN mkdir -p /app/dist-types/src/components

# For CI builds, we need these to exist ahead of time for lint/test phases
RUN mkdir -p dist-types/src/components && \
    echo '/**
 * A Backstage plugin that integrates with Buildkite
 *
 * @packageDocumentation
 */

export * from "../src/plugin";
export * from "../src/api";
export * from "../src/components";
export * from "../src/hooks";
export * from "../src/routes";' > dist-types/src/index.d.ts && \
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

# Copy entrypoint script and make it executable
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Set entrypoint to our script
ENTRYPOINT ["docker-entrypoint.sh"]

# Default command keeps the container running for development
CMD ["tail", "-f", "/dev/null"]