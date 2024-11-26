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

  private async getBaseURL(): Promise<string> {
    const proxyURL = await this.discoveryAPI.getBaseUrl("proxy");
    const baseURL = `${proxyURL}/buildkite/api`;
    return baseURL;
  }

  private calculateTimeElapsed(dateStr: string): string {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diff < 60) return `${diff}s`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    return `${Math.floor(diff / 86400)}d`;
  }

  private mapBuildState(state: string): 'passed' | 'failed' | 'running' {
    switch (state.toLowerCase()) {
      case 'passed':
        return 'passed';
      case 'failed':
      case 'canceled':
        return 'failed';
      default:
        return 'running';
    }
  }

  async getUser(): Promise<User> {
    try {
      const baseURL = await this.getBaseURL();
      const url = `${baseURL}/user`;
      console.log("Requesting URL:", url);

      const response = await this.fetchAPI.fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch user: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error in getUser:", error);
      throw error;
    }
  }

  async getPipeline(orgSlug: string, pipelineSlug: string): Promise<PipelineParams> {
    try {
      const baseUrl = await this.getBaseURL();
      console.log(`Fetching pipeline from: ${baseUrl}/organizations/${orgSlug}/pipelines/${pipelineSlug}`);
      
      // Fetch pipeline details
      const pipelineResponse = await this.fetchAPI.fetch(
        `${baseUrl}/organizations/${orgSlug}/pipelines/${pipelineSlug}`
      );
      
      if (!pipelineResponse.ok) {
        throw new Error(`Failed to fetch pipeline: ${pipelineResponse.statusText}`);
      }
      
      const pipelineData = await pipelineResponse.json();
      
      // Fetch builds for this pipeline
      const buildsResponse = await this.fetchAPI.fetch(
        `${baseUrl}/organizations/${orgSlug}/pipelines/${pipelineSlug}/builds`
      );
      
      if (!buildsResponse.ok) {
        throw new Error(`Failed to fetch builds: ${buildsResponse.statusText}`);
      }
      
      const buildsData = await buildsResponse.json();
      
      // Transform the data into the expected format
      const builds = await Promise.all(
        buildsData.map(async (build: any) => {
          // Fetch build steps
          const steps = await this.getBuildSteps(orgSlug, pipelineSlug, build.number);
          
          return {
            statusIcon: this.mapBuildState(build.state),
            buildMessage: build.message || 'No message provided',
            buildNumber: build.number,
            author: {
              avatar: build.creator?.avatar_url || '',
              name: build.creator?.name || 'Unknown',
            },
            branch: build.branch,
            commitId: build.commit.substring(0, 7),
            createdAt: build.created_at,
            timeElapsed: this.calculateTimeElapsed(build.created_at),
            steps: steps.map(step => ({
              id: step.id,
              title: step.name,
              icon: '', // You might want to map step type to an icon
              status: this.mapBuildState(step.state),
              url: `https://buildkite.com/${orgSlug}/${pipelineSlug}/builds/${build.number}#${step.id}`,
            })),
          };
        })
      );

      return {
        name: pipelineData.name,
        navatarColor: '#D1FAFF', // You might want to derive this from the pipeline data
        navatarImage: pipelineData.repository?.provider?.icon || 
                     'https://buildkiteassets.com/emojis/img-buildkite-64/buildkite.png',
        builds: builds,
      };
    } catch (error) {
      console.error('Error fetching pipeline:', error);
      throw error;
    }
  }

  async getBuilds(orgSlug: string, pipelineSlug: string): Promise<BuildParams[]> {
    const baseUrl = await this.getBaseURL();
    const response = await this.fetchAPI.fetch(
      `${baseUrl}/organizations/${orgSlug}/pipelines/${pipelineSlug}/builds`
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch builds: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  }

  async getBuildSteps(orgSlug: string, pipelineSlug: string, buildNumber: string): Promise<BuildStepParams[]> {
    const baseUrl = await this.getBaseURL();
    const response = await this.fetchAPI.fetch(
      `${baseUrl}/organizations/${orgSlug}/pipelines/${pipelineSlug}/builds/${buildNumber}`
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch build steps: ${response.statusText}`);
    }

    const data = await response.json();
    return data.jobs || [];
  }
}
