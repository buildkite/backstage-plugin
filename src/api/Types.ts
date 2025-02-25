import {
  BuildParams,
  BuildStepParams,
  PipelineParams,
  Status,
} from '../components';

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
}

export interface BuildkiteApiPipeline {
  id: string;
  name: string;
  repository?: {
    provider?: {
      icon?: string;
    };
  };
}

export interface JobLog {
  content: string[];
}

// Type for transforming API data to our component types
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
}
