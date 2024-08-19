import { createApiRef } from "@backstage/core-plugin-api";

export interface BuildkiteAPI {
  getViewerId(): Promise<string>;
}

export const buildkiteAPIRef = createApiRef<BuildkiteAPI>({
  id: "plugin.buildkite.service",
});
