import {
  createPlugin,
  createRoutableExtension,
} from "@backstage/core-plugin-api";

import { rootRouteRef } from "./routes";

export const buildkitePlugin = createPlugin({
  id: "buildkite",
  routes: {
    root: rootRouteRef,
  },
});

export const BuildkitePage = buildkitePlugin.provide(
  createRoutableExtension({
    name: "BuildkitePage",
    component: () =>
      import("./components/PipelineComponent").then((m) => m.PipelineComponent),
    mountPoint: rootRouteRef,
  })
);
