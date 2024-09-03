import { createApiRef } from "@backstage/core-plugin-api";
import { PipelineParams } from "../components/Types";

export interface User {
  avatar_url: string;
  created_at: string;
  email: string;
  graphql_id: string;
  id: string;
  name: string;
}

export interface BuildkiteAPI {
  getUser(): Promise<User>;
  getPipeline(orgSlug: string, pipelineSlug: string): Promise<PipelineParams>;
}

export const buildkiteAPIRef = createApiRef<BuildkiteAPI>({
  id: "plugin.buildkite.service",
});
