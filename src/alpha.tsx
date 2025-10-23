import React from "react";
import {
  createFrontendPlugin,
  ApiBlueprint,
  PageBlueprint,
  NavItemBlueprint,
} from "@backstage/frontend-plugin-api";
import {
  compatWrapper,
  convertLegacyRouteRef,
} from "@backstage/core-compat-api";
import {
  configApiRef,
  discoveryApiRef,
  fetchApiRef,
  DiscoveryApi,
  FetchApi,
  ConfigApi,
} from "@backstage/core-plugin-api";
import { buildkiteRouteRef } from "./routes";
import { BuildkiteClient, buildkiteAPIRef } from "./api";
import { BuildkitePluginConfig } from "./plugin";
import { ClusterIcon } from "./components/Icons";

// API Extension using ApiBlueprint
const buildkiteApiExtension = ApiBlueprint.make({
  params: (defineParams) =>
    defineParams({
      api: buildkiteAPIRef,
      deps: {
        discoveryApi: discoveryApiRef,
        fetchApi: fetchApiRef,
        configApi: configApiRef,
      },
      factory: ({
        discoveryApi,
        fetchApi,
        configApi,
      }: {
        discoveryApi: DiscoveryApi;
        fetchApi: FetchApi;
        configApi: ConfigApi;
      }) => {
        const buildkiteConfig = configApi.getOptionalConfig("buildkite");

        const pluginConfig: BuildkitePluginConfig = {
          apiToken: buildkiteConfig?.getString("apiToken") ?? "",
          organization: buildkiteConfig?.getString("organization") ?? "",
          defaultPageSize:
            buildkiteConfig?.getOptionalNumber("defaultPageSize") ?? 25,
          apiBaseUrl:
            buildkiteConfig?.getOptionalString("apiBaseUrl") ??
            "https://api.buildkite.com/v2",
        };

        if (!pluginConfig.organization) {
          throw new Error(
            "Missing required config value for buildkite.organization",
          );
        }

        return new BuildkiteClient({
          discoveryAPI: discoveryApi,
          fetchAPI: fetchApi,
          config: pluginConfig,
        });
      },
    }),
});

// Page Extension using PageBlueprint
const pipelinePageExtension = PageBlueprint.make({
  params: {
    path: "/buildkite",
    routeRef: convertLegacyRouteRef(buildkiteRouteRef),
    loader: () =>
      import("./components/PipelinePage").then((m) =>
        compatWrapper(<m.PipelinePage />),
      ),
  },
});

// Nav Item Extension using NavItemBlueprint
const buildkiteNavItem = NavItemBlueprint.make({
  params: {
    routeRef: convertLegacyRouteRef(buildkiteRouteRef),
    title: "Buildkite",
    icon: ClusterIcon,
  },
});

export default createFrontendPlugin({
  pluginId: "buildkite",
  extensions: [buildkiteApiExtension, pipelinePageExtension, buildkiteNavItem],
});
