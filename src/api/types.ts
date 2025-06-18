import {
  BuildParams,
  BuildStepParams,
  PipelineParams,
  Status,
} from '../components/types/buildkiteTypes';

export interface BuildkiteApiJob {
  id: string;
  name: string;
  state: string;
  web_url: string;
  command?: string;
  step_key?: string;
  agent?: {
    id: string;
    name: string;
  };
  type?: string;
  artifact_paths?: string;
  agent_query_rules?: string[];
  timeout_in_minutes?: number;
  retry?: {
    manual?: {
      allowed: boolean;
      reason?: string;
    };
    automatic?: {
      limit?: number;
      exit_status?: number;
    };
  };
}

export interface BuildkiteApiBuild {
  id: string;
  number: string;
  state: string;
  message?: string;
  creator?: {
    name: string;
    avatar_url: string;
  };
  branch?: string;
  commit?: string;
  created_at?: string;
  started_at?: string;
  finished_at?: string;
  jobs?: BuildkiteApiJob[];
  meta_data?: Record<string, any>;
  web_url: string;
}

export interface BuildkiteBuildsOptions {
  page?: number;
  per_page?: number;
  branch?: string;
}

export interface BuildkiteApiPipeline {
  id: string;
  name: string;
  repository?: {
    url?: string;
    provider?: {
      icon?: string;
    };
  };
}

export interface JobLog {
  content: string[];
}

export interface BuildTriggerOptions {
  commit?: string;
  branch?: string;
  message?: string;
  author?: {
    name: string;
    email: string;
  };
  env?: Record<string, string>;
  meta_data?: Record<string, any>;
}

// Type for transforming API data to our component types
import { DeploymentParams } from '../components/types/buildkiteTypes';

export interface BuildkiteTransforms {
  mapBuildkiteStatus: (status: string) => Status;
  toBuildParams: (build: BuildkiteApiBuild) => BuildParams;
  toBuildStepParams: (job: BuildkiteApiJob) => BuildStepParams;
  toPipelineParams: (
    pipeline: BuildkiteApiPipeline,
    builds: BuildkiteApiBuild[],
    orgSlug: string,
    pipelineSlug: string,
  ) => PipelineParams;
  toDeploymentParams: (build: BuildkiteApiBuild) => DeploymentParams[];
}
