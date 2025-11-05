import {
  createApiFactory,
  createPlugin,
  createRoutableExtension,
  discoveryApiRef,
  fetchApiRef,
  configApiRef,
} from "@backstage/core-plugin-api";
import { BuildkiteClient, buildkiteAPIRef } from "./api";
import {
  buildkiteRouteRef,
  buildkitePipelineRouteRef,
  buildkiteBuildRouteRef,
} from "./routes";

export interface BuildkitePluginConfig {
  defaultPageSize?: number;
  apiBaseUrl?: string;
}

export const buildkitePlugin = createPlugin({
  id: "buildkite",
  apis: [
    createApiFactory({
      api: buildkiteAPIRef,
      deps: {
        discoveryAPI: discoveryApiRef,
        fetchAPI: fetchApiRef,
        config: configApiRef,
      },
      factory: ({ discoveryAPI, fetchAPI, config }) => {
        const buildkiteConfig = config.getOptionalConfig("buildkite");

        const pluginConfig: BuildkitePluginConfig = {
          defaultPageSize:
            buildkiteConfig?.getOptionalNumber("defaultPageSize") ?? 25,
          apiBaseUrl:
            buildkiteConfig?.getOptionalString("apiBaseUrl") ??
            "https://api.buildkite.com/v2",
        };

        return new BuildkiteClient({
          discoveryAPI,
          fetchAPI,
          config: pluginConfig,
        });
      },
    }),
  ],
  routes: {
    root: buildkiteRouteRef,
    pipeline: buildkitePipelineRouteRef,
    build: buildkiteBuildRouteRef,
  },
});

export const PipelinePage = buildkitePlugin.provide(
  createRoutableExtension({
    name: "PipelinePage",
    component: () =>
      import("./components/PipelinePage").then((m) => m.PipelinePage),
    mountPoint: buildkiteRouteRef,
  }),
);

export { BuildkiteWrapper } from "./components/BuildkiteWrapper";
export { BuildRow } from "./components/BuildRow";
