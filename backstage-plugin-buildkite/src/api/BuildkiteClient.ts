import { DiscoveryApi, FetchApi } from "@backstage/core-plugin-api";
import { BuildkiteAPI } from "./BuildkiteAPI";

export class BuildkiteClient implements BuildkiteAPI {
  private readonly discoveryAPI: DiscoveryApi;
  private readonly fetchAPI: FetchApi;

  constructor(options: { discoveryAPI: DiscoveryApi; fetchAPI: FetchApi }) {
    this.discoveryAPI = options.discoveryAPI;
    this.fetchAPI = options.fetchAPI;
  }

  private async getBaseURL() {
    return await this.discoveryAPI.getBaseUrl("proxy");
  }

  private async query<T>(
    query: string,
    variables?: Record<string, any>,
  ): Promise<T> {
    const baseUrl = await this.getBaseURL();
    const url = `${baseUrl}/buildkite/api`;

    try {
      const response = await this.fetchAPI.fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query, variables }),
      });

      if (!response.ok) {
        console.error("Response not OK:", response.status, response.statusText);
        const text = await response.text();
        console.error("Response body:", text);
        throw new Error(`Buildkite API request failed: ${response.statusText}`);
      }

      const { data, errors } = await response.json();
      if (errors) {
        console.error("GraphQL Errors:", errors);
        throw new Error(`GraphQL Errors: ${JSON.stringify(errors)}`);
      }

      return data;
    } catch (error) {
      console.error("Fetch error:", error);
      throw error;
    }
  }

  async getViewerId(): Promise<string> {
    const data = await this.query<{ viewer: { id: string } }>(`
        query {
          viewer {
            id
          }
        }
      `);
    return data.viewer.id;
  }
}
