import { createApiRef } from '@backstage/core-plugin-api';
import {
  PipelineParams,
  BuildParams,
  BuildStepParams,
} from '../components/Types';

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
  getBuilds(orgSlug: string, pipelineSlug: string): Promise<BuildParams[]>;
  getBuildSteps(
    orgSlug: string,
    pipelineSlug: string,
    buildNumber: string,
  ): Promise<BuildStepParams[]>;
  rebuildBuild(
    orgSlug: string,
    pipelineSlug: string,
    buildNumber: string,
  ): Promise<BuildParams>;
}

export const buildkiteAPIRef = createApiRef<BuildkiteAPI>({
  id: 'plugin.buildkite.service',
});
