import { createApiRef } from '@backstage/core-plugin-api';
import { PipelineParams, BuildParams, BuildStepParams } from '../components/';
import { JobLog } from './types';

export interface User {
  avatar_url: string;
  created_at: string;
  email: string;
  graphql_id: string;
  id: string;
  name: string;
  buildkite_avatar_url?: string;
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
  getJobLogs(
    orgSlug: string,
    pipelineSlug: string,
    buildNumber: string,
    jobId: string,
  ): Promise<JobLog>;
  triggerBuild(
    orgSlug: string,
    pipelineSlug: string,
    options: BuildTriggerOptions,
  ): Promise<BuildParams>;
  getPipelineConfig(
    orgSlug: string,
    pipelineSlug: string,
  ): Promise<string>;
  updatePipelineConfig(
    orgSlug: string,
    pipelineSlug: string,
    config: string,
  ): Promise<void>;
}

export const buildkiteAPIRef = createApiRef<BuildkiteAPI>({
  id: 'plugin.buildkite.service',
});
