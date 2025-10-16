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
  apiToken: string;
  organization: string;
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
          apiToken: buildkiteConfig?.getString("apiToken") ?? "",
          organization: buildkiteConfig?.getString("organization") ?? "",
          defaultPageSize:
            buildkiteConfig?.getOptionalNumber("defaultPageSize") ?? 25,
          apiBaseUrl:
            buildkiteConfig?.getOptionalString("apiBaseUrl") ??
            "https://api.buildkite.com/v2",
        };

        if (!pluginConfig.apiToken) {
          throw new Error(
            "Missing required config value for buildkite.apiToken",
          );
        }

        if (!pluginConfig.organization) {
          throw new Error(
            "Missing required config value for buildkite.organization",
          );
        }

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
