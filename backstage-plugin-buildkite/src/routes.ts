import { createRouteRef, createSubRouteRef } from "@backstage/core-plugin-api";

export const buildkiteRouteRef = createRouteRef({
  id: "buildkite",
});

export const buildkitePipelineRouteRef = createSubRouteRef({
  id: "buildkite/pipeline",
  parent: buildkiteRouteRef,
  path: "/:pipelineSlug",
});

export const buildkiteBuildRouteRef = createSubRouteRef({
  id: "buildkite/build",
  parent: buildkiteRouteRef,
  path: "/:pipelineSlug/:buildNumber",
});
