import {
  configApiRef,
  createApiFactory,
  createPlugin,
  createRoutableExtension,
  discoveryApiRef,
  fetchApiRef,
} from "@backstage/core-plugin-api";

import { rootRouteRef } from "./routes";
import { BuildkiteClient, buildkiteAPIRef } from "./api";

export const buildkitePlugin = createPlugin({
  id: "buildkite",
  apis: [
    createApiFactory({
      api: buildkiteAPIRef,
      deps: {
        discoveryAPI: discoveryApiRef,
        fetchAPI: fetchApiRef,
      },
      factory: ({ discoveryAPI, fetchAPI }) =>
        new BuildkiteClient({ discoveryAPI, fetchAPI }),
    }),
  ],
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
  }),
);

export const BuildkiteViewerPage = buildkitePlugin.provide(
  createRoutableExtension({
    name: "BuildkiteViewerPage",
    component: () =>
      import("./components/ViewerFetchComponent").then(
        (m) => m.ViewerFetchComponent,
      ),
    mountPoint: rootRouteRef,
  }),
);
