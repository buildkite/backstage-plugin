import { DiscoveryApi, FetchApi } from '@backstage/core-plugin-api';
import {
  BuildParams,
  BuildStepParams,
  PipelineParams,
} from '../components/Types';
import { BuildkiteAPI, User } from './BuildkiteAPI';
import { BuildkitePluginConfig } from '../plugin';

export class BuildkiteClient implements BuildkiteAPI {
  private readonly discoveryAPI: DiscoveryApi;
  private readonly fetchAPI: FetchApi;

  constructor(options: {
    discoveryAPI: DiscoveryApi;
    fetchAPI: FetchApi;
    config: BuildkitePluginConfig;
  }) {
    this.discoveryAPI = options.discoveryAPI;
    this.fetchAPI = options.fetchAPI;
  }

  private calculateBuildDuration(build: any): string {
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

      console.log('Response status:', response.status);

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
      console.log('Received data:', data);
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

      const pipelineData = await pipelineResponse.json();

      const buildsUrl = `${baseUrl}/organizations/${orgSlug}/pipelines/${pipelineSlug}/builds`;
      const buildsResponse = await this.fetchAPI.fetch(buildsUrl);
      if (!buildsResponse.ok) {
        throw new Error(`Failed to fetch builds: ${buildsResponse.statusText}`);
      }

      const buildsData = await buildsResponse.json();

      const transformedData: PipelineParams = {
        id: pipelineData.id || '',
        name: pipelineData.name || 'Pipeline',
        navatarColor: '#D1FAFF',
        navatarImage:
          pipelineData.repository?.provider?.icon ||
          'https://buildkiteassets.com/emojis/img-buildkite-64/buildkite.png',
        builds: buildsData.map((build: any) => ({
          buildNumber: build.number?.toString() || '',
          status: this.mapBuildkiteStatus(build.state),
          buildMessage: build.message || '',
          author: {
            name: build.creator?.name || 'Unknown',
            avatar: build.creator?.avatar_url || '',
          },
          branch: build.branch || 'main',
          commitId: build.commit?.substring(0, 7) || '',
          createdAt: build.created_at || new Date().toISOString(),
          timeElapsed: this.calculateBuildDuration(build),
          steps: (build.jobs || []).map((job: any) => ({
            id: job.id || '',
            title: job.name || '',
            status: this.mapBuildkiteStatus(job.state),
            url: job.web_url || '',
          })),
        })),
      };

      return transformedData;
    } catch (error) {
      console.error('Error in getPipeline:', error);
      throw error;
    }
  }

  private mapBuildkiteStatus(status: string): Status {
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
      case 'skipped':
        return 'SKIPPED';
      case 'waiting':
        return 'WAITING';
      default:
        return 'NOT_RUN';
    }
  }

  async getBuilds(
    orgSlug: string,
    pipelineSlug: string,
  ): Promise<BuildParams[]> {
    const baseUrl = await this.getBaseURL();
    const url = `${baseUrl}/organizations/${orgSlug}/pipelines/${pipelineSlug}/builds`;

    const response = await this.fetchAPI.fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch builds: ${response.statusText}`);
    }

    const data = await response.json();
    return data.map((build: any) => {
      return {
        id: build.id,
        number: build.number,
        state: build.state,
        startedAt: build.started_at,
        finishedAt: build.finished_at,
        branch: build.branch,
        commit: build.commit,
        message: build.message,
      };
    });
  }

  async getBuildSteps(
    orgSlug: string,
    pipelineSlug: string,
    buildNumber: string,
  ): Promise<BuildStepParams[]> {
    const baseUrl = await this.getBaseURL();
    const url = `${baseUrl}/organizations/${orgSlug}/pipelines/${pipelineSlug}/builds/${buildNumber}`;

    const response = await this.fetchAPI.fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch build steps: ${response.statusText}`);
    }

    const data = await response.json();
    return data.jobs.map((job: any) => {
      return {
        id: job.id,
        name: job.name,
        state: job.state,
        startedAt: job.started_at,
        finishedAt: job.finished_at,
        command: job.command,
      };
    });
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

      const data = await response.json();
      return {
        buildNumber: data.number?.toString() || '',
        status: this.mapBuildkiteStatus(data.state),
        buildMessage: data.message || '',
        author: {
          name: data.creator?.name || 'Unknown',
          avatar: data.creator?.avatar_url || '',
        },
        branch: data.branch || 'main',
        commitId: data.commit?.substring(0, 7) || '',
        createdAt: data.created_at || new Date().toISOString(),
        timeElapsed: this.calculateBuildDuration(data),
        steps: (data.jobs || []).map((job: any) => ({
          id: job.id || '',
          title: job.name || '',
          status: this.mapBuildkiteStatus(job.state),
          url: job.web_url || '',
        })),
      };
    } catch (error) {
      console.error('Error rebuilding build:', error);
      throw error;
    }
  }
}
