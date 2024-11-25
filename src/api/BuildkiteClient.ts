import { DiscoveryApi, FetchApi } from "@backstage/core-plugin-api";
import { BuildParams, BuildStepParams, PipelineParams } from "../components/Types";
import { BuildkiteAPI, User } from "./BuildkiteAPI";
import { BuildkitePluginConfig } from "../plugin";

export class BuildkiteClient implements BuildkiteAPI {
  private readonly discoveryAPI: DiscoveryApi;
  private readonly fetchAPI: FetchApi;

  constructor(options: { discoveryApi: DiscoveryApi; fetchApi: FetchApi; config: BuildkitePluginConfig }) {
    this.discoveryAPI = options.discoveryApi;
    this.fetchAPI = options.fetchApi;
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
    const baseUrl = await this.getBaseURL();
    const url = `${baseUrl}/organizations/${orgSlug}/pipelines/${pipelineSlug}`;
    
    const [pipelineResponse, buildsResponse] = await Promise.all([
      this.fetchAPI.fetch(url),
      this.getBuilds(orgSlug, pipelineSlug)
    ]);

    if (!pipelineResponse.ok) {
      throw new Error(`Failed to fetch pipeline: ${pipelineResponse.statusText}`);
    }
    
    const data = await pipelineResponse.json();
    return {
      name: data.name,
      id: data.id,
      navatarColor: data.color || '#000000',
      navatarImage: data.icon || '',
      builds: buildsResponse,
    };
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
