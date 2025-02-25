import { DiscoveryApi, FetchApi } from '@backstage/core-plugin-api';
import {
  BuildParams,
  BuildStepParams,
  PipelineParams,
  Status,
} from '../components';
import { BuildkiteAPI, User } from './buildkiteApiRef';
import { BuildkitePluginConfig } from '../plugin';
import {
  BuildkiteApiBuild,
  BuildkiteApiJob,
  BuildkiteApiPipeline,
  BuildkiteTransforms,
  JobLog,
} from './types';

export class BuildkiteClient implements BuildkiteAPI {
  private readonly discoveryAPI: DiscoveryApi;
  private readonly fetchAPI: FetchApi;
  private transforms: BuildkiteTransforms;

  constructor(options: {
    discoveryAPI: DiscoveryApi;
    fetchAPI: FetchApi;
    config: BuildkitePluginConfig;
  }) {
    this.discoveryAPI = options.discoveryAPI;
    this.fetchAPI = options.fetchAPI;

    this.transforms = {
      mapBuildkiteStatus: (status: string): Status => {
        switch (status?.toLowerCase()) {
          case 'passed':
            return 'PASSED';
          case 'failed':
            return 'FAILED';
          case 'running':
            return 'RUNNING';
          case 'scheduled':
            return 'SCHEDULED';
          case 'canceled':
            return 'CANCELED';
          case 'canceling':
            return 'CANCELING';
          case 'skipped':
            return 'SKIPPED';
          case 'not_run':
            return 'NOT_RUN';
          case 'waiting':
            return 'WAITING';
          case 'waiting_failed':
            return 'WAITING_FAILED';
          case 'blocked':
            return 'BLOCKED';
          case 'unblocked':
            return 'UNBLOCKED';
          case 'creating':
            return 'CREATING';
          case 'failing':
            return 'FAILING';
          case 'timing_out':
            return 'TIMING_OUT';
          case 'assigned':
            return 'ASSIGNED';
          case 'accepted':
            return 'ACCEPTED';
          case 'limited':
            return 'LIMITED';
          case 'limiting':
            return 'LIMITING';
          case 'paused':
            return 'PAUSED';
          case 'wait':
            return 'WAIT';
          case 'waiter':
            return 'WAITER';
          default:
            console.warn(`Unhandled Buildkite status: ${status}`);
            return 'NOT_RUN';
        }
      },
      toBuildParams: (build: BuildkiteApiBuild): BuildParams => ({
        buildNumber: build.number?.toString() || '',
        status: this.transforms.mapBuildkiteStatus(build.state),
        buildMessage: build.message || '',
        author: {
          name: build.creator?.name || 'Unknown',
          avatar: build.creator?.avatar_url || '',
        },
        branch: build.branch || 'main',
        commitId: build.commit?.substring(0, 7) || '',
        createdAt: build.created_at || new Date().toISOString(),
        timeElapsed: this.calculateBuildDuration(build),
        steps: (build.jobs || []).map(this.transforms.toBuildStepParams),
      }),

      toBuildStepParams: (job: BuildkiteApiJob): BuildStepParams => ({
        id: job.id,
        title: job.name,
        status: this.transforms.mapBuildkiteStatus(job.state),
        command: job.command,
        url: job.web_url,
      }),

      toPipelineParams: (
        pipeline: BuildkiteApiPipeline,
        builds: BuildkiteApiBuild[],
        orgSlug: string,
        pipelineSlug: string,
      ): PipelineParams => ({
        id: pipeline.id || '',
        name: pipeline.name || 'Pipeline',
        navatarColor: '#D1FAFF',
        navatarImage:
          pipeline.repository?.provider?.icon ||
          'https://buildkiteassets.com/emojis/img-buildkite-64/buildkite.png',
        builds: builds.map(this.transforms.toBuildParams),
        orgSlug,
        slug: pipelineSlug,
      }),
    };
  }

  async getJobLogs(
    orgSlug: string,
    pipelineSlug: string,
    buildNumber: string,
    jobId: string,
  ): Promise<JobLog> {
    try {
      const baseUrl = await this.getBaseURL();
      const url = `${baseUrl}/organizations/${orgSlug}/pipelines/${pipelineSlug}/builds/${buildNumber}/jobs/${jobId}/log`;

      const response = await this.fetchAPI.fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch job logs: ${response.statusText}`);
      }

      const data = await response.json();

      // Extract and process the log content
      const logContent = data.content
        .split('\n')
        .filter((line: string) => line.trim() !== '');

      return {
        content: logContent,
      };
    } catch (error) {
      console.error('Error fetching job logs:', error);
      throw error;
    }
  }

  private calculateBuildDuration(build: BuildkiteApiBuild): string {
    if (this.isRunning(build.state) && build.started_at) {
      const startedAt = new Date(build.started_at);
      const now = new Date();
      return this.formatDuration(
        Math.floor((now.getTime() - startedAt.getTime()) / 1000),
      );
    }

    if (build.started_at && build.finished_at) {
      const startedAt = new Date(build.started_at);
      const finishedAt = new Date(build.finished_at);
      return this.formatDuration(
        Math.floor((finishedAt.getTime() - startedAt.getTime()) / 1000),
      );
    }

    return '0s';
  }

  private isRunning(state: string): boolean {
    return state?.toLowerCase() === 'running';
  }

  private formatDuration(seconds: number): string {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  }

  private async getBaseURL(): Promise<string> {
    const proxyURL = await this.discoveryAPI.getBaseUrl('proxy');
    const baseURL = `${proxyURL}/buildkite/api`;
    return baseURL;
  }

  async getUser(): Promise<User> {
    try {
      const baseURL = await this.getBaseURL();
      const url = `${baseURL}/user`;
      console.log('Requesting URL:', url);

      const response = await this.fetchAPI.fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const text = await response.text();
        console.error(
          'Response not OK:',
          response.status,
          response.statusText,
          text,
        );
        throw new Error(`Buildkite API request failed: ${response.statusText}`);
      }

      const data = await response.json();
      return data as User;
    } catch (error) {
      console.error('Error in getUser:', error);
      throw error;
    }
  }

  async getPipeline(
    orgSlug: string,
    pipelineSlug: string,
  ): Promise<PipelineParams> {
    try {
      const baseUrl = await this.getBaseURL();
      const url = `${baseUrl}/organizations/${orgSlug}/pipelines/${pipelineSlug}`;

      const pipelineResponse = await this.fetchAPI.fetch(url);
      if (!pipelineResponse.ok) {
        throw new Error(
          `Failed to fetch pipeline: ${pipelineResponse.statusText}`,
        );
      }

      const pipelineData: BuildkiteApiPipeline = await pipelineResponse.json();

      const buildsUrl = `${baseUrl}/organizations/${orgSlug}/pipelines/${pipelineSlug}/builds`;
      const buildsResponse = await this.fetchAPI.fetch(buildsUrl);
      if (!buildsResponse.ok) {
        throw new Error(`Failed to fetch builds: ${buildsResponse.statusText}`);
      }

      const buildsData: BuildkiteApiBuild[] = await buildsResponse.json();

      return this.transforms.toPipelineParams(
        pipelineData,
        buildsData,
        orgSlug,
        pipelineSlug,
      );
    } catch (error) {
      console.error('Error in getPipeline:', error);
      throw error;
    }
  }

  async getBuilds(
    orgSlug: string,
    pipelineSlug: string,
  ): Promise<BuildParams[]> {
    try {
      const baseUrl = await this.getBaseURL();
      const url = `${baseUrl}/organizations/${orgSlug}/pipelines/${pipelineSlug}/builds`;

      const response = await this.fetchAPI.fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch builds: ${response.statusText}`);
      }

      const data: BuildkiteApiBuild[] = await response.json();
      return data.map(this.transforms.toBuildParams);
    } catch (error) {
      console.error('Error in getBuilds:', error);
      throw error;
    }
  }

  async getBuildSteps(
    orgSlug: string,
    pipelineSlug: string,
    buildNumber: string,
  ): Promise<BuildStepParams[]> {
    try {
      const baseUrl = await this.getBaseURL();
      const url = `${baseUrl}/organizations/${orgSlug}/pipelines/${pipelineSlug}/builds/${buildNumber}`;

      const response = await this.fetchAPI.fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch build steps: ${response.statusText}`);
      }

      const data: BuildkiteApiBuild = await response.json();
      return (data.jobs || []).map(this.transforms.toBuildStepParams);
    } catch (error) {
      console.error('Error in getBuildSteps:', error);
      throw error;
    }
  }

  async rebuildBuild(
    orgSlug: string,
    pipelineSlug: string,
    buildNumber: string,
  ): Promise<BuildParams> {
    try {
      const baseUrl = await this.getBaseURL();
      const url = `${baseUrl}/organizations/${orgSlug}/pipelines/${pipelineSlug}/builds/${buildNumber}/rebuild`;

      const response = await this.fetchAPI.fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to rebuild build: ${errorText}`);
      }

      const data: BuildkiteApiBuild = await response.json();
      return this.transforms.toBuildParams(data);
    } catch (error) {
      console.error('Error rebuilding build:', error);
      throw error;
    }
  }
}
