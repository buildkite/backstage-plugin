import { buildkiteRouteRef } from "./routes";
import {
  createApiFactory,
  createPlugin,
  createRoutableExtension,
  discoveryApiRef,
  fetchApiRef,
} from "@backstage/core-plugin-api";
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
    root: buildkiteRouteRef,
  },
});

export const EntityBuildkiteContent = buildkitePlugin.provide(
  createRoutableExtension({
    name: "EntityBuildkiteContent",
    component: () => import("./components/Router").then((m) => m.Router),
    mountPoint: buildkiteRouteRef,
  }),
);

export const BuildkiteViewerPage = buildkitePlugin.provide(
  createRoutableExtension({
    name: "BuildkiteViewerPage",
    component: () =>
      import("./components/ViewerFetchComponent").then(
        (m) => m.ViewerFetchComponent,
      ),
    mountPoint: buildkiteRouteRef,
  }),
);
