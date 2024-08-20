import { DiscoveryApi, FetchApi } from "@backstage/core-plugin-api";
import { BuildkiteAPI, User } from "./BuildkiteAPI";

export class BuildkiteClient implements BuildkiteAPI {
  private readonly discoveryAPI: DiscoveryApi;
  private readonly fetchAPI: FetchApi;

  constructor(options: { discoveryAPI: DiscoveryApi; fetchAPI: FetchApi }) {
    this.discoveryAPI = options.discoveryAPI;
    this.fetchAPI = options.fetchAPI;
  }

  private async getBaseUrl(): Promise<string> {
    const proxyUrl = await this.discoveryAPI.getBaseUrl("proxy");
    console.log("Proxy URL from discoveryAPI:", proxyUrl);
    const baseUrl = `${proxyUrl}/buildkite/api`;
    console.log("Constructed base URL:", baseUrl);
    return baseUrl;
  }

  async getUser(): Promise<User> {
    try {
      const baseUrl = await this.getBaseUrl();
      const url = `${baseUrl}/user`;
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
}
