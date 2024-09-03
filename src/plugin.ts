import { buildkiteRouteRef } from "./routes";
import {
  createApiFactory,
  createPlugin,
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

export { PipelinePage } from './components/PipelinePage';
