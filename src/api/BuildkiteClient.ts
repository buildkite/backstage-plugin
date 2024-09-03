import { DiscoveryApi, FetchApi } from "@backstage/core-plugin-api";
import { PipelineParams } from "../components/Types";
import { BuildkiteAPI, User } from "./BuildkiteAPI";

export class BuildkiteClient implements BuildkiteAPI {
  private readonly discoveryAPI: DiscoveryApi;
  private readonly fetchAPI: FetchApi;

  constructor(options: { discoveryAPI: DiscoveryApi; fetchAPI: FetchApi }) {
    this.discoveryAPI = options.discoveryAPI;
    this.fetchAPI = options.fetchAPI;
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
    
    const response = await this.fetchAPI.fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch pipeline: ${response.statusText}`);
    }
    
    const data = await response.json();
    return {
      name: data.name,
      id: data.id,
      navatarColor: data.color || '#000000',
      navatarImage: data.icon || '',
      builds: [],
    };
  }
}
