import { DiscoveryApi, FetchApi } from "@backstage/core-plugin-api";
import { BuildParams, BuildStepParams, PipelineParams } from "../components/Types";
import { BuildkiteAPI, User } from "./BuildkiteAPI";
import { BuildkitePluginConfig } from "../plugin";

export class BuildkiteClient implements BuildkiteAPI {
  private readonly discoveryAPI: DiscoveryApi;
  private readonly fetchAPI: FetchApi;

  constructor(options: { discoveryAPI: DiscoveryApi; fetchAPI: FetchApi; config: BuildkitePluginConfig }) {
    this.discoveryAPI = options.discoveryAPI;
    this.fetchAPI = options.fetchAPI;
  }
   
  private mapBuildState(state: string): string {
    switch (state) {
      case 'passed':
        return 'success';
      case 'failed':
        return 'failure';
      case 'blocked':
      case 'canceled':
        return 'canceled';
      case 'running':
        return 'running';
      default:
        return 'pending';
    }
  }

  private calculateTimeElapsed(dateStr: string): string {
    if (!dateStr) return '0s';
    const date = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diff < 60) return `${diff}s`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    return `${Math.floor(diff / 86400)}d`;
  }

  private async getBaseURL(): Promise<string> {
    const proxyURL = await this.discoveryAPI.getBaseUrl("proxy");
    const baseURL = `${proxyURL}/buildkite/api`;
    return baseURL;
  }

  async getUser(): Promise<User> {
    try {
      const baseURL = await this.getBaseURL();
      const url = `${baseURL}/user`;
      console.log("Requesting URL:", url);

      const response = await this.fetchAPI.fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        const text = await response.text();
        console.error(
          "Response not OK:",
          response.status,
          response.statusText,
          text,
        );
        throw new Error(`Buildkite API request failed: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Received data:", data);
      return data as User;
    } catch (error) {
      console.error("Error in getUser:", error);
      throw error;
    }
  }

  async getPipeline(orgSlug: string, pipelineSlug: string): Promise<PipelineParams> {
    try {
      const baseUrl = await this.getBaseURL();
      const url = `${baseUrl}/organizations/${orgSlug}/pipelines/${pipelineSlug}`;
      
      console.log('BuildkiteClient: Making pipeline request:', {
        method: 'GET',
        url,
        orgSlug,
        pipelineSlug,
      });

      const response = await this.fetchAPI.fetch(url);
      
      console.log('BuildkiteClient: Received response:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        url: response.url,
      });

      if (!response.ok) {
        let errorDetails = '';
        try {
          // Try to get error details from response body
          const errorText = await response.text();
          console.error('BuildkiteClient: Error response body:', errorText);
          try {
            // Try to parse as JSON if possible
            const errorJson = JSON.parse(errorText);
            console.error('BuildkiteClient: Parsed error response:', errorJson);
            errorDetails = JSON.stringify(errorJson, null, 2);
          } catch {
            // If not JSON, use text directly
            errorDetails = errorText;
          }
        } catch (e) {
          console.error('BuildkiteClient: Could not read error response:', e);
          errorDetails = 'Could not read error details';
        }

        throw new Error(
          `Failed to fetch pipeline: ${response.status} ${response.statusText}\nDetails: ${errorDetails}`
        );
      }

      const pipelineData = await response.json();
      console.log('BuildkiteClient: Successfully fetched pipeline data:', pipelineData);

      // Now fetch the builds
      const buildsUrl = `${baseUrl}/organizations/${orgSlug}/pipelines/${pipelineSlug}/builds`;
      console.log('BuildkiteClient: Fetching builds:', {
        method: 'GET',
        url: buildsUrl,
      });

      const buildsResponse = await this.fetchAPI.fetch(buildsUrl);
      
      console.log('BuildkiteClient: Received builds response:', {
        status: buildsResponse.status,
        statusText: buildsResponse.statusText,
        headers: Object.fromEntries(buildsResponse.headers.entries()),
      });

      if (!buildsResponse.ok) {
        const errorText = await buildsResponse.text();
        console.error('BuildkiteClient: Error fetching builds:', errorText);
        throw new Error(`Failed to fetch builds: ${buildsResponse.statusText}`);
      }

      const buildsData = await buildsResponse.json();
      console.log('BuildkiteClient: Successfully fetched builds data:', buildsData);

      // Transform the data
      const transformedData = {
        name: pipelineData.name,
        navatarColor: '#D1FAFF',
        navatarImage: pipelineData.repository?.provider?.icon || 
                     'https://buildkiteassets.com/emojis/img-buildkite-64/buildkite.png',
        builds: buildsData.map((build: any) => ({
          statusIcon: this.mapBuildState(build.state),
          buildMessage: build.message || 'No message',
          buildNumber: build.number.toString(),
          author: {
            avatar: build.creator?.avatar_url || '',
            name: build.creator?.name || 'Unknown',
          },
          branch: build.branch || 'main',
          commitId: (build.commit || '').substring(0, 7),
          createdAt: build.created_at,
          timeElapsed: this.calculateTimeElapsed(build.created_at),
          steps: (build.jobs || []).map((job: any) => ({
            id: job.id,
            title: job.name || 'Unknown Step',
            icon: '',
            status: this.mapBuildState(job.state),
            url: job.web_url || '#',
          })),
        })),
      };

      console.log('BuildkiteClient: Transformed pipeline data:', transformedData);
      return transformedData;

    } catch (error) {
      console.error('BuildkiteClient: Error in getPipeline:', {
        error,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        errorStack: error instanceof Error ? error.stack : undefined,
        orgSlug,
        pipelineSlug,
      });
      throw error;
    }
  }

  async getBuilds(orgSlug: string, pipelineSlug: string): Promise<BuildParams[]> {
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

  async getBuildSteps(orgSlug: string, pipelineSlug: string, buildNumber: string): Promise<BuildStepParams[]> {
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
}
