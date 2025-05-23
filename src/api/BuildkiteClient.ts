import { DiscoveryApi, FetchApi } from '@backstage/core-plugin-api';
import { BuildParams, BuildStepParams, PipelineParams } from '../components';
import { BuildkiteAPI, User } from './buildkiteApiRef';
import { BuildkitePluginConfig } from '../plugin';
import {
  BuildkiteApiBuild,
  BuildkiteApiJob,
  BuildkiteApiPipeline,
  BuildkiteTransforms,
  BuildTriggerOptions,
  JobLog,
} from './types';
import {
  calculateBuildDuration,
  isRunning,
  mapBuildkiteStatus,
  getBuildkiteApiBaseUrl,
  getBuildkiteJobLogsApiUrl,
  getBuildkitePipelineApiUrl,
  getBuildkiteBuildsApiUrl,
  formatCommitId,
} from '../utils';

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
      mapBuildkiteStatus,
      toBuildParams: (build: BuildkiteApiBuild): BuildParams => ({
        buildNumber: build.number?.toString() || '',
        status: this.transforms.mapBuildkiteStatus(build.state),
        buildMessage: build.message || '',
        author: {
          name: build.creator?.name || 'Unknown',
          avatar: build.creator?.avatar_url || '',
        },
        branch: build.branch || 'main',
        commitId: formatCommitId(build.commit || ''),
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
      const url = getBuildkiteJobLogsApiUrl(
        baseUrl,
        orgSlug,
        pipelineSlug,
        buildNumber,
        jobId,
      );

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
    return calculateBuildDuration(
      build.started_at,
      build.finished_at,
      isRunning(build.state),
    );
  }

  private async getBaseURL(): Promise<string> {
    try {
      const proxyURL = await this.discoveryAPI.getBaseUrl('proxy');
      const baseUrl = getBuildkiteApiBaseUrl(proxyURL);
      
      if (!baseUrl) {
        throw new Error('Failed to construct Buildkite API base URL');
      }
      
      // Log the constructed URL for debugging purposes
      console.debug(`Buildkite API base URL: ${baseUrl}`);
      
      return baseUrl;
    } catch (error) {
      console.error('Error constructing Buildkite API base URL:', error);
      throw error;
    }
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
      const url = getBuildkitePipelineApiUrl(baseUrl, orgSlug, pipelineSlug);

      const pipelineResponse = await this.fetchAPI.fetch(url);
      if (!pipelineResponse.ok) {
        throw new Error(
          `Failed to fetch pipeline: ${pipelineResponse.statusText}`,
        );
      }

      const pipelineData: BuildkiteApiPipeline = await pipelineResponse.json();

      const buildsUrl = getBuildkiteBuildsApiUrl(
        baseUrl,
        orgSlug,
        pipelineSlug,
      );
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
      const url = getBuildkiteBuildsApiUrl(baseUrl, orgSlug, pipelineSlug);

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

  async triggerBuild(
    orgSlug: string,
    pipelineSlug: string,
    options: BuildTriggerOptions,
  ): Promise<BuildParams> {
    try {
      const baseUrl = await this.getBaseURL();
      // Use the existing URL utility for consistent URL construction
      const url = getBuildkiteBuildsApiUrl(baseUrl, orgSlug, pipelineSlug);

      const response = await this.fetchAPI.fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(options),
      });

      if (!response.ok) {
        let errorText;
        try {
          // Try to parse as JSON first for more details
          const errorJson = await response.json();
          errorText = JSON.stringify(errorJson);
        } catch {
          // If JSON parsing fails, get the text
          errorText = await response.text();
        }
        throw new Error(`Failed to trigger build (${response.status}): ${errorText}`);
      }

      const data: BuildkiteApiBuild = await response.json();
      return this.transforms.toBuildParams(data);
    } catch (error) {
      console.error('Error triggering build:', error);
      throw error;
    }
  }

  async getPipelineConfig(
    orgSlug: string,
    pipelineSlug: string,
  ): Promise<string> {
    try {
      const baseUrl = await this.getBaseURL();
      const url = getBuildkitePipelineApiUrl(baseUrl, orgSlug, pipelineSlug);
      
      const response = await this.fetchAPI.fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch pipeline configuration: ${response.statusText}`);
      }
      
      const data = await response.json();
      // Return the configuration field if it exists, otherwise format the entire response
      if (data.configuration) {
        return data.configuration;
      }
      return JSON.stringify(data, null, 2);
    } catch (error) {
      console.error('Error fetching pipeline configuration:', error);
      throw error;
    }
  }

  async updatePipelineConfig(
    orgSlug: string,
    pipelineSlug: string,
    config: string,
  ): Promise<void> {
    try {
      const baseUrl = await this.getBaseURL();
      const url = getBuildkitePipelineApiUrl(baseUrl, orgSlug, pipelineSlug);
      
      const payload = {
        configuration: config
      };
      
      const response = await this.fetchAPI.fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update pipeline configuration: ${errorText}`);
      }
    } catch (error) {
      console.error('Error updating pipeline configuration:', error);
      throw error;
    }
  }
}
