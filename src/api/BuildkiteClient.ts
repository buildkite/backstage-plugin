import { DiscoveryApi, FetchApi } from '@backstage/core-plugin-api';
import {
  BuildParams,
  BuildStepParams,
  PipelineParams,
  DeploymentParams,
} from '../components';
import { BuildkiteAPI, User } from './buildkiteApiRef';
import { BuildkitePluginConfig } from '../plugin';
import { VERSION } from '../version';
import {
  BuildkiteApiBuild,
  BuildkiteApiJob,
  BuildkiteApiPipeline,
  BuildkiteBuildsOptions,
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
        repository: pipeline.repository?.url,
      }),

      toDeploymentParams: (build: BuildkiteApiBuild): DeploymentParams[] => {
        const deployments: DeploymentParams[] = [];

        if (!build.meta_data) {
          // No metadata, return empty array
          return deployments;
        }

        // Check for traditional environment field
        if (build.meta_data.environment) {
          // For environment-based deployments, check for environment-specific URL
          const environmentUrlKey = `${build.meta_data.environment}:url`;
          const environmentUrl =
            build.meta_data[environmentUrlKey] || build.meta_data.url || '';

          // Check for environment-specific version
          const environmentVersionKey = `${build.meta_data.environment}:version`;
          const environmentVersion =
            build.meta_data[environmentVersionKey] ||
            build.meta_data.version ||
            '';

          deployments.push({
            id: build.id,
            number: parseInt(build.number, 10) || 0,
            stage: build.meta_data.environment,
            app: undefined,
            status: this.transforms.mapBuildkiteStatus(build.state),
            commit: formatCommitId(build.commit || ''),
            branch: build.branch || '',
            message: build.message || '',
            createdAt: build.created_at || '',
            author: {
              name: build.creator?.name || 'Unknown',
              avatar: build.creator?.avatar_url || '',
            },
            url: environmentUrl || build.web_url,
            version: environmentVersion,
            web_url: build.web_url,
          });
        }

        // Check for app:environment:deployed pattern
        for (const key in build.meta_data) {
          if (key.includes(':') && key.endsWith(':deployed')) {
            // Check if the value is true, 'true', or any truthy value
            if (
              build.meta_data[key] === true ||
              build.meta_data[key] === 'true' ||
              build.meta_data[key]
            ) {
              const parts = key.split(':');
              if (parts.length === 3) {
                const app = parts[0];
                const stage = parts[1];

                // Check for app-specific URL in meta_data (e.g., backend:staging:url)
                const appUrlKey = `${app}:${stage}:url`;
                const customUrl =
                  build.meta_data[appUrlKey] || build.meta_data.url || '';

                // Check for app-specific version in meta_data (e.g., api:production:version)
                const appVersionKey = `${app}:${stage}:version`;
                const appVersion =
                  build.meta_data[appVersionKey] ||
                  build.meta_data.version ||
                  '';

                deployments.push({
                  id: build.id,
                  number: parseInt(build.number, 10) || 0,
                  stage,
                  app,
                  status: this.transforms.mapBuildkiteStatus(build.state),
                  commit: formatCommitId(build.commit || ''),
                  branch: build.branch || '',
                  message: build.message || '',
                  createdAt: build.created_at || '',
                  author: {
                    name: build.creator?.name || 'Unknown',
                    avatar: build.creator?.avatar_url || '',
                  },
                  url: customUrl || build.web_url,
                  version: appVersion,
                  web_url: build.web_url,
                });
              }
            }
          }
        }

        // If no match found, check legacy format
        if (deployments.length === 0) {
          for (const key in build.meta_data) {
            if (key.endsWith('_deployment') && build.meta_data[key] === true) {
              // Convert e.g. 'staging_deployment' to 'staging'
              const stage = key.replace('_deployment', '');

              // Check for stage-specific URL
              const stageUrlKey = `${stage}:url`;
              const stageUrl =
                build.meta_data[stageUrlKey] || build.meta_data.url || '';

              // Check for stage-specific version
              const stageVersionKey = `${stage}:version`;
              const stageVersion =
                build.meta_data[stageVersionKey] ||
                build.meta_data.version ||
                '';

              deployments.push({
                id: build.id,
                number: parseInt(build.number, 10) || 0,
                stage,
                app: undefined,
                status: this.transforms.mapBuildkiteStatus(build.state),
                commit: formatCommitId(build.commit || ''),
                branch: build.branch || '',
                message: build.message || '',
                createdAt: build.created_at || '',
                author: {
                  name: build.creator?.name || 'Unknown',
                  avatar: build.creator?.avatar_url || '',
                },
                url: stageUrl || build.web_url,
                version: stageVersion,
                web_url: build.web_url,
              });
            }
          }
        }

        // If still no deployments found, use production as default (backward compatibility)
        if (deployments.length === 0) {
          // Check for production URL in meta_data
          const prodUrlKey = 'production:url';
          const prodUrl =
            build.meta_data[prodUrlKey] || build.meta_data.url || '';

          // Check for production version in meta_data
          const prodVersionKey = 'production:version';
          const prodVersion =
            build.meta_data[prodVersionKey] || build.meta_data.version || '';

          deployments.push({
            id: build.id,
            number: parseInt(build.number, 10) || 0,
            stage: 'production',
            app: undefined,
            status: this.transforms.mapBuildkiteStatus(build.state),
            commit: formatCommitId(build.commit || ''),
            branch: build.branch || '',
            message: build.message || '',
            createdAt: build.created_at || '',
            author: {
              name: build.creator?.name || 'Unknown',
              avatar: build.creator?.avatar_url || '',
            },
            url: prodUrl || build.web_url,
            version: prodVersion,
            web_url: build.web_url,
          });
        }

        return deployments;
      },
    };
  }

  private getCommonHeaders(contentType?: boolean): Record<string, string> {
    const headers: Record<string, string> = {
      'X-Buildkite-Source': 'backstage-plugin',
      'X-Buildkite-Plugin-Version': VERSION,
    };

    if (contentType) {
      headers['Content-Type'] = 'application/json';
    }

    return headers;
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

      const response = await this.fetchAPI.fetch(url, {
        headers: this.getCommonHeaders(),
      });
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

      const response = await this.fetchAPI.fetch(url, {
        method: 'GET',
        headers: this.getCommonHeaders(true),
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

      const pipelineResponse = await this.fetchAPI.fetch(url, {
        headers: this.getCommonHeaders(),
      });
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
      const buildsResponse = await this.fetchAPI.fetch(buildsUrl, {
        headers: this.getCommonHeaders(),
      });
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
    options?: BuildkiteBuildsOptions,
  ): Promise<BuildParams[]> {
    try {
      const baseUrl = await this.getBaseURL();
      const url = getBuildkiteBuildsApiUrl(
        baseUrl,
        orgSlug,
        pipelineSlug,
        options,
      );

      const response = await this.fetchAPI.fetch(url, {
        headers: this.getCommonHeaders(),
      });
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

  async getDeployments(
    orgSlug: string,
    pipelineSlug: string,
  ): Promise<DeploymentParams[]> {
    try {
      const baseUrl = await this.getBaseURL();
      // Fetch all builds, not just from main
      const url = getBuildkiteBuildsApiUrl(baseUrl, orgSlug, pipelineSlug);
      const response = await this.fetchAPI.fetch(url, {
        headers: this.getCommonHeaders(),
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch deployments: ${response.statusText}`);
      }

      const data: BuildkiteApiBuild[] = await response.json();
      console.log(
        `[Buildkite] Fetched ${data.length} total builds for pipeline ${orgSlug}/${pipelineSlug}.`,
      );

      // Filter for builds that are deployments
      const deployments = data.filter(build => {
        if (!build.meta_data) return false;

        // Check for traditional environment field
        if (build.meta_data.environment) return true;

        // Check for app:$environment:deployed pattern (e.g., backend:production:deployed)
        for (const key in build.meta_data) {
          if (key.includes(':') && key.endsWith(':deployed')) {
            if (
              build.meta_data[key] === true ||
              build.meta_data[key] === 'true' ||
              build.meta_data[key]
            ) {
              return true;
            }
          }
        }

        // Legacy: Check for environment-specific flags like staging_deployment: true
        for (const key in build.meta_data) {
          if (key.endsWith('_deployment') && build.meta_data[key] === true) {
            return true;
          }
        }

        return false;
      });

      console.log(
        `[Buildkite] Found ${deployments.length} builds with deployment metadata.`,
      );

      // Log all deployment metadata for debugging
      deployments.forEach(build => {
        console.log(
          `[Buildkite] Deployment: ${build.number}, metadata:`,
          build.meta_data,
        );
      });

      // Flatten the array of arrays into a single array of deployment params
      return deployments.flatMap(this.transforms.toDeploymentParams);
    } catch (error) {
      console.error('Error in getDeployments:', error);
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

      const response = await this.fetchAPI.fetch(url, {
        headers: this.getCommonHeaders(),
      });
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
        headers: this.getCommonHeaders(true),
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
        headers: this.getCommonHeaders(true),
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
        throw new Error(
          `Failed to trigger build (${response.status}): ${errorText}`,
        );
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

      const response = await this.fetchAPI.fetch(url, {
        headers: this.getCommonHeaders(),
      });
      if (!response.ok) {
        throw new Error(
          `Failed to fetch pipeline configuration: ${response.statusText}`,
        );
      }

      const data = await response.json();
      // Return the configuration field if it exists, otherwise format the entire response
      if (data.configuration) {
        return data.configuration;
      }
      return JSON.stringify(data, null, 2);
    } catch (error) {
      console.error('Error fetching pipeline config:', error);
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

      const response = await this.fetchAPI.fetch(url, {
        method: 'PATCH',
        headers: this.getCommonHeaders(true),
        body: JSON.stringify({ configuration: config }),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to update pipeline configuration: ${response.statusText}`,
        );
      }
    } catch (error) {
      console.error('Error updating pipeline config:', error);
      throw error;
    }
  }
}
